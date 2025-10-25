import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../theme/colors';
import { SPACING } from '../../theme/spacing';

const AddressSection = ({
    address,
    setAddress,
    phone,
    setPhone,
    orderNotes,
    setOrderNotes,
    currentLocation,
    isGettingLocation,
    onGetLocation,
    onOpenMap,
    onContinue
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Confirma tus datos de entrega y contacto</Text>

            {/* Botones de ubicación */}
            <View style={styles.locationButtonsRow}>
                <TouchableOpacity
                    style={styles.locationButtonHalf}
                    onPress={onGetLocation}
                    disabled={isGettingLocation}
                >
                    <View style={styles.locationButtonGradient}>
                        {isGettingLocation ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <Icon name="my-location" size={18} color={COLORS.white} />
                        )}
                        <Text style={styles.locationButtonTextSmall}>
                            {isGettingLocation ? 'Obteniendo...' : 'Mi ubicación'}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.locationButtonHalf} onPress={onOpenMap}>
                    <View style={[styles.locationButtonGradient, styles.mapButtonGradient]}>
                        <Icon name="map" size={18} color={COLORS.white} />
                        <Text style={styles.locationButtonTextSmall}>Elegir en mapa</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Información de ubicación detectada */}
            {currentLocation && (
                <View style={styles.locationInfo}>
                    <Icon name="check-circle" size={16} color="#4CAF50" />
                    <Text style={styles.locationInfoText}>
                        GPS detectado ({currentLocation.coordinates.accuracy?.toFixed(0)}m precisión)
                    </Text>
                </View>
            )}

            {/* Formulario */}
            <View style={styles.formCard}>
                <View style={styles.inputWrapper}>
                    <View style={styles.inputHeader}>
                        <Icon name="location-on" size={20} color={COLORS.primary} />
                        <Text style={styles.inputLabel}>Dirección de entrega *</Text>
                    </View>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Calle, número, barrio"
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        numberOfLines={2}
                        placeholderTextColor={COLORS.gray}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <View style={styles.inputHeader}>
                        <Icon name="phone" size={20} color={COLORS.primary} />
                        <Text style={styles.inputLabel}>Teléfono de contacto *</Text>
                    </View>
                    <TextInput
                        style={styles.inputField}
                        placeholder="+57 300 123 4567"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor={COLORS.gray}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <View style={styles.inputHeader}>
                        <Icon name="note" size={20} color={COLORS.primary} />
                        <Text style={styles.inputLabel}>Instrucciones (opcional)</Text>
                    </View>
                    <TextInput
                        style={styles.inputField}
                        placeholder="Ej: Casa de dos pisos, portón azul"
                        value={orderNotes}
                        onChangeText={setOrderNotes}
                        multiline
                        numberOfLines={2}
                        placeholderTextColor={COLORS.gray}
                    />
                </View>
            </View>

            <View style={styles.requiredNote}>
                <Icon name="info" size={14} color={COLORS.gray} />
                <Text style={styles.requiredNoteText}>* Campos obligatorios</Text>
            </View>

            {/* Botón Continuar */}
            <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                <Text style={styles.continueButtonText}>Continuar →</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.lg,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.gray,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 22,
    },
    locationButtonsRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    locationButtonHalf: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    locationButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.primary,
    },
    mapButtonGradient: {
        backgroundColor: '#FF6B35',
    },
    locationButtonTextSmall: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
        marginLeft: SPACING.xs,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 12,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.primary + '30',
    },
    locationInfoText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
        marginLeft: SPACING.sm,
        flex: 1,
    },
    formCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    inputWrapper: {
        marginBottom: SPACING.md,
    },
    inputHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark,
        marginLeft: SPACING.xs,
    },
    inputField: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: 15,
        color: COLORS.dark,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        minHeight: 44,
    },
    requiredNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.sm,
        marginBottom: SPACING.md,
    },
    requiredNoteText: {
        fontSize: 12,
        color: COLORS.gray,
        marginLeft: SPACING.xs,
        fontStyle: 'italic',
    },
    continueButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    continueButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddressSection;
