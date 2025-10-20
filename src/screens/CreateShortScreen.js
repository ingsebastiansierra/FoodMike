import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    Image,
    Switch,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../theme';
import { shortsService } from '../services/shortsService';
import { useAuth } from '../context/AuthContext';

const CreateShortScreen = ({ route }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const restaurantId = route.params?.restaurantId || user?.restaurant_id;

    const [videoUri, setVideoUri] = useState(null);
    const [thumbnailUri, setThumbnailUri] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [durationHours, setDurationHours] = useState(48);
    const [publishNow, setPublishNow] = useState(true);
    const [publishDate, setPublishDate] = useState(new Date());
    const [isPermanent, setIsPermanent] = useState(false);
    const [permanentCount, setPermanentCount] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        loadPermanentCount();
    }, []);

    const loadPermanentCount = async () => {
        try {
            const count = await shortsService.getPermanentShortsCount(restaurantId);
            setPermanentCount(count);
        } catch (error) {
            console.error('Error loading permanent count:', error);
        }
    };

    const pickVideo = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [9, 16],
                quality: 1,
                videoMaxDuration: 60,
            });

            if (!result.canceled) {
                setVideoUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking video:', error);
            Alert.alert('Error', 'No se pudo seleccionar el video');
        }
    };

    const pickThumbnail = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [9, 16],
                quality: 0.8,
            });

            if (!result.canceled) {
                setThumbnailUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking thumbnail:', error);
            Alert.alert('Error', 'No se pudo seleccionar la miniatura');
        }
    };

    const handlePublish = async () => {
        if (!videoUri) {
            Alert.alert('Video requerido', 'Debes seleccionar un video');
            return;
        }

        if (!title.trim()) {
            Alert.alert('Título requerido', 'Debes agregar un título');
            return;
        }

        try {
            setUploading(true);

            // Intentar subir video
            let videoUrl;
            try {
                videoUrl = await shortsService.uploadVideo(videoUri, restaurantId);
            } catch (uploadError) {
                console.error('Error uploading to Storage:', uploadError);

                // Mostrar opciones al usuario
                Alert.alert(
                    'Error de Storage',
                    'No se pudo subir el video a Supabase Storage. Esto puede deberse a:\n\n' +
                    '1. Los buckets no están creados\n' +
                    '2. Las políticas no están configuradas\n' +
                    '3. Problema de red\n\n' +
                    'Por favor, verifica la configuración de Storage en Supabase.',
                    [
                        {
                            text: 'Usar URL de prueba',
                            onPress: async () => {
                                // Usar URL de video de prueba
                                const testVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

                                try {
                                    await shortsService.createShort({
                                        restaurantId,
                                        videoUrl: testVideoUrl,
                                        thumbnailUrl: null,
                                        title: title.trim() + ' (DEMO)',
                                        description: description.trim(),
                                    });

                                    Alert.alert('¡Éxito!', 'Short de prueba creado. Configura Storage para subir videos reales.', [
                                        { text: 'OK', onPress: () => navigation.goBack() },
                                    ]);
                                } catch (err) {
                                    Alert.alert('Error', 'No se pudo crear el short');
                                }
                                setUploading(false);
                            }
                        },
                        {
                            text: 'Cancelar',
                            style: 'cancel',
                            onPress: () => setUploading(false)
                        }
                    ]
                );
                return;
            }

            // Subir thumbnail si existe
            let thumbnailUrl = null;
            if (thumbnailUri) {
                try {
                    thumbnailUrl = await shortsService.uploadThumbnail(thumbnailUri, restaurantId);
                } catch (thumbError) {
                    console.log('No se pudo subir thumbnail, continuando sin él');
                }
            }

            // Crear short con programación
            const shortData = {
                restaurantId,
                videoUrl,
                thumbnailUrl,
                title: title.trim(),
                description: description.trim(),
                isPermanent,
            };

            // Si es permanente, no agregar duración ni programación
            if (!isPermanent) {
                shortData.durationHours = durationHours;

                // Si no es publicación inmediata, agregar fecha de publicación
                if (!publishNow) {
                    shortData.publishAt = publishDate.toISOString();
                }
            }

            await shortsService.createShort(shortData);

            let message;
            if (isPermanent) {
                message = 'Tu publicación permanente ha sido agregada a tu perfil';
            } else if (publishNow) {
                message = `Tu short ha sido publicado y estará activo por ${durationHours} horas`;
            } else {
                message = `Tu short se publicará el ${publishDate.toLocaleDateString()} a las ${publishDate.toLocaleTimeString()}`;
            }

            Alert.alert('¡Éxito!', message, [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Error publishing short:', error);
            Alert.alert('Error', 'No se pudo publicar el short');
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={28} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Crear Short</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                {/* Video Picker */}
                <TouchableOpacity
                    style={styles.mediaPicker}
                    onPress={pickVideo}
                    disabled={uploading}
                >
                    {videoUri ? (
                        <View style={styles.mediaPreview}>
                            <Ionicons name="videocam" size={40} color={COLORS.primary} />
                            <Text style={styles.mediaText}>Video seleccionado</Text>
                        </View>
                    ) : (
                        <View style={styles.mediaPlaceholder}>
                            <Ionicons name="videocam-outline" size={50} color={COLORS.textSecondary} />
                            <Text style={styles.placeholderText}>Seleccionar video</Text>
                            <Text style={styles.placeholderSubtext}>Máximo 60 segundos</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Thumbnail Picker */}
                <TouchableOpacity
                    style={styles.thumbnailPicker}
                    onPress={pickThumbnail}
                    disabled={uploading}
                >
                    {thumbnailUri ? (
                        <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} />
                    ) : (
                        <View style={styles.thumbnailPlaceholder}>
                            <Ionicons name="image-outline" size={30} color={COLORS.textSecondary} />
                            <Text style={styles.thumbnailText}>Miniatura (opcional)</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Title Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Título *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Nuestra deliciosa pizza napolitana"
                        placeholderTextColor={COLORS.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                        editable={!uploading}
                    />
                    <Text style={styles.charCount}>{title.length}/100</Text>
                </View>

                {/* Description Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe tu platillo o preparación..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={description}
                        onChangeText={setDescription}
                        maxLength={500}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={!uploading}
                    />
                    <Text style={styles.charCount}>{description.length}/500</Text>
                </View>

                {/* Permanent Post Option */}
                <View style={styles.permanentContainer}>
                    <View style={styles.permanentHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>📌 Publicación Permanente</Text>
                            <Text style={styles.permanentSubtext}>
                                {isPermanent
                                    ? 'Se agregará a tu perfil sin fecha de expiración'
                                    : 'Agregar a tu perfil como publicación fija'}
                            </Text>
                            <Text style={[
                                styles.permanentCount,
                                permanentCount >= 15 && styles.permanentCountLimit
                            ]}>
                                {permanentCount}/15 publicaciones permanentes
                            </Text>
                        </View>
                        <Switch
                            value={isPermanent}
                            onValueChange={(value) => {
                                if (value && permanentCount >= 15) {
                                    Alert.alert(
                                        'Límite alcanzado',
                                        'Ya tienes 15 publicaciones permanentes. Elimina una antes de agregar otra.',
                                        [{ text: 'OK' }]
                                    );
                                    return;
                                }
                                setIsPermanent(value);
                            }}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                            thumbColor="white"
                            disabled={uploading || permanentCount >= 15}
                        />
                    </View>
                </View>

                {/* Duration Selector - Solo si no es permanente */}
                {!isPermanent && (
                    <View style={styles.durationContainer}>
                        <Text style={styles.label}>Duración de la publicación</Text>
                        <Text style={styles.durationSubtext}>El short se eliminará automáticamente después de este tiempo</Text>

                        <View style={styles.durationOptions}>
                            {[6, 12, 24, 48].map((hours) => (
                                <TouchableOpacity
                                    key={hours}
                                    style={[
                                        styles.durationOption,
                                        durationHours === hours && styles.durationOptionActive
                                    ]}
                                    onPress={() => setDurationHours(hours)}
                                    disabled={uploading}
                                >
                                    <Text style={[
                                        styles.durationOptionText,
                                        durationHours === hours && styles.durationOptionTextActive
                                    ]}>
                                        {hours}h
                                    </Text>
                                    <Text style={[
                                        styles.durationOptionLabel,
                                        durationHours === hours && styles.durationOptionLabelActive
                                    ]}>
                                        {hours === 6 ? '6 horas' : hours === 12 ? '12 horas' : hours === 24 ? '1 día' : '2 días'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Publish Schedule */}
                <View style={styles.scheduleContainer}>
                    <View style={styles.scheduleHeader}>
                        <View>
                            <Text style={styles.label}>Publicar ahora</Text>
                            <Text style={styles.scheduleSubtext}>
                                {publishNow ? 'Se publicará inmediatamente' : 'Programar publicación'}
                            </Text>
                        </View>
                        <Switch
                            value={publishNow}
                            onValueChange={setPublishNow}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                            thumbColor="white"
                            disabled={uploading}
                        />
                    </View>

                    {!publishNow && (
                        <View style={styles.datePickerContainer}>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                                disabled={uploading}
                            >
                                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.dateButtonText}>
                                    {publishDate.toLocaleDateString()} {publishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={publishDate}
                                    mode="datetime"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            // Validar que no sea más de 2 días en el futuro
                                            const maxDate = new Date();
                                            maxDate.setDate(maxDate.getDate() + 2);

                                            if (selectedDate > maxDate) {
                                                Alert.alert('Fecha inválida', 'No puedes programar más de 2 días en el futuro');
                                                return;
                                            }

                                            if (selectedDate < new Date()) {
                                                Alert.alert('Fecha inválida', 'La fecha debe ser futura');
                                                return;
                                            }

                                            setPublishDate(selectedDate);
                                        }
                                    }}
                                    minimumDate={new Date()}
                                    maximumDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
                                />
                            )}
                        </View>
                    )}
                </View>

                {/* Publish Button */}
                <TouchableOpacity
                    style={[styles.publishButton, uploading && styles.publishButtonDisabled]}
                    onPress={handlePublish}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.publishButtonText}>Publicar Short</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    content: {
        padding: SPACING.md,
    },
    mediaPicker: {
        height: 300,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    mediaPreview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    mediaText: {
        marginTop: SPACING.sm,
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    mediaPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.sm,
    },
    placeholderSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    thumbnailPicker: {
        height: 120,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    thumbnailPlaceholder: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    thumbnailText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: SPACING.sm,
    },
    inputContainer: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.md,
        fontSize: 14,
        color: COLORS.text,
    },
    textArea: {
        height: 100,
    },
    charCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'right',
        marginTop: SPACING.xs,
    },
    publishButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: SPACING.md,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    publishButtonDisabled: {
        opacity: 0.6,
    },
    publishButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    durationContainer: {
        marginBottom: SPACING.md,
    },
    durationSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    durationOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.sm,
    },
    durationOption: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.sm,
        alignItems: 'center',
    },
    durationOptionActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    durationOptionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    durationOptionTextActive: {
        color: COLORS.primary,
    },
    durationOptionLabel: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    durationOptionLabelActive: {
        color: COLORS.primary,
    },
    scheduleContainer: {
        marginBottom: SPACING.md,
        padding: SPACING.md,
        backgroundColor: COLORS.background,
        borderRadius: 8,
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scheduleSubtext: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    datePickerContainer: {
        marginTop: SPACING.md,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: SPACING.sm,
    },
    dateButtonText: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
});

export default CreateShortScreen;
