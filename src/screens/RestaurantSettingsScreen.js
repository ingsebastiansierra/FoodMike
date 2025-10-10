import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';

const RestaurantSettingsScreen = ({ navigation }) => {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar sesión');
                        }
                    },
                },
            ]
        );
    };

    const SettingItem = ({ icon, title, subtitle, onPress, color = COLORS.primary }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Icon name={icon} size={24} color={color} />
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Restaurante</Text>
                <SettingItem
                    icon="store"
                    title="Datos del Restaurante"
                    subtitle="Nombre, dirección, teléfono"
                    onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                />
                <SettingItem
                    icon="schedule"
                    title="Horarios"
                    subtitle="Configura tus horarios de atención"
                    onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                />
                <SettingItem
                    icon="image"
                    title="Imágenes"
                    subtitle="Logo y foto de portada"
                    onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configuración de Delivery</Text>
                <SettingItem
                    icon="delivery-dining"
                    title="Tarifa de Envío"
                    subtitle="Configura el costo de delivery"
                    onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                />
                <SettingItem
                    icon="attach-money"
                    title="Pedido Mínimo"
                    subtitle="Monto mínimo para pedidos"
                    onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categorías</Text>
                <SettingItem
                    icon="category"
                    title="Gestionar Categorías"
                    subtitle="Organiza tus productos"
                    onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Cuenta</Text>
                <SettingItem
                    icon="person"
                    title="Mi Perfil"
                    subtitle={user?.email}
                    onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
                />
                <SettingItem
                    icon="logout"
                    title="Cerrar Sesión"
                    subtitle="Salir de la aplicación"
                    onPress={handleLogout}
                    color="#FF6B6B"
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Food Mike - Administrador de Restaurante</Text>
                <Text style={styles.footerVersion}>Versión 1.0.0</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    section: {
        marginTop: SPACING.md,
        backgroundColor: '#FFF',
        paddingVertical: SPACING.xs,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    settingSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    footer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    footerVersion: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
});

export default RestaurantSettingsScreen;
