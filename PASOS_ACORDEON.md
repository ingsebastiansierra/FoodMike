# Pasos para Completar el Diseño de Acordeón

## ✅ Ya hecho:

1. Estados del acordeón agregados
2. Funciones `handleCompleteAddress` y `handleCompletePayment` creadas
3. Función `toggleSection` para abrir/cerrar secciones
4. UI principal del acordeón implementada
5. Eliminado el sistema de pasos horizontal

## 📝 Falta agregar estilos:

Agregar estos estilos al final del StyleSheet:

```javascript
// Acordeón
scrollContainer: {
  flex: 1,
},
accordionSection: {
  marginHorizontal: SPACING.lg,
  marginBottom: SPACING.md,
  backgroundColor: COLORS.white,
  borderRadius: 16,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  overflow: 'hidden',
},
accordionSectionDisabled: {
  opacity: 0.5,
},
accordionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: SPACING.lg,
  backgroundColor: COLORS.white,
},
accordionHeaderCompleted: {
  backgroundColor: COLORS.primary + '10',
},
accordionHeaderLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
accordionNumber: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: COLORS.lightGray,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: SPACING.md,
},
accordionNumberCompleted: {
  backgroundColor: COLORS.primary,
},
accordionNumberText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: COLORS.dark,
},
accordionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: COLORS.dark,
},
accordionSummary: {
  paddingHorizontal: SPACING.lg,
  paddingBottom: SPACING.md,
  backgroundColor: COLORS.background,
},
accordionSummaryText: {
  fontSize: 14,
  color: COLORS.gray,
  marginBottom: 4,
},
```

## 🔧 Modificar render functions:

### 1. Al final de `renderAddressStep`, agregar botón:

```javascript
<TouchableOpacity
  style={styles.continueButton}
  onPress={handleCompleteAddress}
>
  <Text style={styles.continueButtonText}>Continuar →</Text>
</TouchableOpacity>
```

### 2. Al final de `renderPaymentStep`, agregar botón:

```javascript
<TouchableOpacity
  style={styles.continueButton}
  onPress={handleCompletePayment}
>
  <Text style={styles.continueButtonText}>Continuar →</Text>
</TouchableOpacity>
```

### 3. Agregar estilos para botones:

```javascript
continueButton: {
  backgroundColor: COLORS.primary,
  padding: SPACING.md,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: SPACING.md,
  marginHorizontal: SPACING.lg,
  marginBottom: SPACING.md,
},
continueButtonText: {
  color: COLORS.white,
  fontSize: 16,
  fontWeight: 'bold',
},
```

## 🎯 Resultado Final:

- ✅ Sección 1 expandida al inicio
- ✅ Usuario llena dirección y hace clic en "Continuar"
- ✅ Sección 1 se colapsa mostrando resumen
- ✅ Sección 2 se expande automáticamente
- ✅ Usuario selecciona pago y hace clic en "Continuar"
- ✅ Sección 2 se colapsa mostrando resumen
- ✅ Sección 3 se expande automáticamente
- ✅ Usuario revisa y confirma pedido
- ✅ Botón final aparece para confirmar

## 🚀 Ventajas:

- Todo en una pantalla con scroll vertical
- Progreso visual claro
- Puede editar secciones anteriores tocándolas
- Diseño moderno como Uber, Rappi, etc.
- Menos confusión para el usuario

¿Quieres que implemente estos cambios finales?
