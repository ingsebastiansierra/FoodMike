import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import restaurantAdminService from '../services/restaurantAdminService';

const AddProductScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categories, setCategories] = useState([]);

    const initialFormData = {
        name: '',
        description: '',
        price: '',
        image: '',
        categoryid: '',
        preparation_time: '15',
        is_available: true,
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        loadCategories();

        // Configurar el header con botón de atrás
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginLeft: 15 }}
                >
                    <Icon name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const loadCategories = async () => {
        try {
            const response = await restaurantAdminService.getCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price) {
            Alert.alert('Error', 'Por favor completa los campos obligatorios');
            return;
        }

        if (!formData.categoryid) {
            Alert.alert('Error', 'Por favor selecciona una categoría');
            return;
        }

        try {
            setLoading(true);

            // Validar y parsear valores numéricos
            const categoryId = parseInt(formData.categoryid);
            const price = parseFloat(formData.price);
            const prepTimeStr = formData.preparation_time?.trim();
            const prepTime = prepTimeStr && prepTimeStr !== '' ? parseInt(prepTimeStr) : 15;

            if (isNaN(categoryId)) {
                Alert.alert('Error', 'Categoría inválida');
                return;
            }

            if (isNaN(price) || price <= 0) {
                Alert.alert('Error', 'El precio debe ser un número válido mayor a 0');
                return;
            }

            if (isNaN(prepTime)) {
                Alert.alert('Error', 'El tiempo de preparación debe ser un número válido');
                return;
            }

            // Preparar datos para enviar
            const productData = {
                name: formData.name.trim(),
                description: formData.description?.trim() || null,
                price: price,
                image: formData.image?.trim() || null,
                categoryid: categoryId,
                preparation_time: prepTime,
                is_available: formData.is_available,
            };

            console.log('Sending product data:', productData);
            await restaurantAdminService.createProduct(productData);

            // Limpiar el formulario
            setFormData(initialFormData);

            Alert.alert('Éxito', 'Producto creado correctamente', [
                {
                    text: 'Crear otro',
                    onPress: () => {
                        // El formulario ya está limpio
                    }
                },
                {
                    text: 'Volver',
                    onPress: () => navigation.goBack(),
                    style: 'cancel'
                },
            ]);
        } catch (error) {
            console.error('Error creating product:', error);
            Alert.alert('Error', error.message || 'No se pudo crear el producto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Nombre del Producto *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Ej: Pizza Margarita"
                />

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.description}
                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                    placeholder="Describe tu producto..."
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>URL de la Imagen</Text>
                <TextInput
                    style={styles.input}
                    value={formData.image}
                    onChangeText={(text) => setFormData({ ...formData, image: text })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    keyboardType="url"
                    autoCapitalize="none"
                />

                {/* Vista previa de la imagen */}
                {formData.image ? (
                    <View style={styles.imagePreviewContainer}>
                        <Text style={styles.previewLabel}>Vista Previa:</Text>
                        <Image
                            source={{ uri: formData.image }}
                            style={styles.imagePreview}
                            onError={() => Alert.alert('Error', 'No se pudo cargar la imagen. Verifica la URL.')}
                        />
                    </View>
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Icon name="image" size={40} color="#BDC3C7" />
                        <Text style={styles.placeholderText}>Sin imagen</Text>
                    </View>
                )}

                <Text style={styles.label}>Categoría *</Text>
                {loadingCategories ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <View style={styles.categoriesContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryChip,
                                    formData.categoryid === category.id.toString() && styles.categoryChipActive
                                ]}
                                onPress={() => setFormData({ ...formData, categoryid: category.id.toString() })}
                            >
                                <Text style={[
                                    styles.categoryChipText,
                                    formData.categoryid === category.id.toString() && styles.categoryChipTextActive
                                ]}>
                                    {category.icon} {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <Text style={styles.label}>Precio *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                />

                <Text style={styles.label}>Tiempo de Preparación (minutos)</Text>
                <TextInput
                    style={styles.input}
                    value={formData.preparation_time}
                    onChangeText={(text) => setFormData({ ...formData, preparation_time: text })}
                    placeholder="15"
                    keyboardType="number-pad"
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Crear Producto</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    form: {
        padding: SPACING.md,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
        marginTop: SPACING.md,
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: SPACING.md,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePreviewContainer: {
        marginTop: SPACING.md,
        alignItems: 'center',
    },
    previewLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: COLORS.lightGray,
    },
    imagePlaceholder: {
        marginTop: SPACING.md,
        height: 150,
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 14,
        color: '#BDC3C7',
        marginTop: SPACING.xs,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: SPACING.md,
    },
    categoryChip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        backgroundColor: '#F5F7FA',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    categoryChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    categoryChipTextActive: {
        color: '#FFF',
    },
});

export default AddProductScreen;
