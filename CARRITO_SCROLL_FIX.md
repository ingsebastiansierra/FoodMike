# Corrección del Scroll en el Carrito

## Problema Identificado
El carrito no permitía hacer scroll cuando había muchos productos porque:
1. El `FlatList` estaba dentro de un `View` con `flex: 1` pero con padding que reducía el espacio
2. La estructura de layout no permitía que el `FlatList` ocupara todo el espacio disponible
3. No había suficiente `paddingBottom` para evitar que el botón inferior tape los productos

## Solución Implementada

### 1. **Reestructuración del Layout**
- Removido el contenedor `View` con `styles.content` que limitaba el espacio
- El `FlatList` ahora está directamente en el nivel superior del componente
- Esto permite que ocupe todo el espacio disponible para scroll

### 2. **Mejoras en los Estilos**

#### Para el Carrito Normal (`renderCarrito`):
```javascript
// Antes: FlatList dentro de View con flex: 1
<View style={styles.content}>
  <FlatList ... />
</View>

// Después: FlatList directo con estilo propio
<FlatList 
  style={styles.cartFlatList}
  contentContainerStyle={styles.cartList}
  ...
/>
```

#### Para Confirmar Orden (`renderConfirmarOrden`):
```javascript
// Antes: FlatList dentro de itemsContainer
<View style={styles.itemsContainer}>
  <FlatList ... />
</View>

// Después: FlatList directo con header separado
<View style={styles.itemsHeader}>
  <Text>...</Text>
</View>
<FlatList 
  style={styles.confirmOrderFlatList}
  ...
/>
```

### 3. **Estilos Actualizados**

#### Nuevos estilos agregados:
- `cartFlatList`: `flex: 1` para que ocupe todo el espacio
- `confirmOrderFlatList`: `flex: 1` para la vista de confirmación
- `itemsHeader`: Header separado para la lista de productos

#### Estilos mejorados:
- `cartList`: Agregado `paddingBottom: 120` para espacio del botón
- `itemsList`: Agregado `paddingBottom: 120` para espacio del botón
- `listHeader`: Mejorado padding y background
- `summaryCard`: Agregado márgenes horizontales

## Resultado
✅ **Scroll funcional**: Ahora se puede hacer scroll en la lista de productos
✅ **Espacio adecuado**: El botón inferior no tapa los productos
✅ **Layout consistente**: Funciona tanto en carrito normal como en confirmación
✅ **UX mejorada**: Mejor experiencia de usuario al navegar productos

## Pruebas Recomendadas
1. Agregar varios productos al carrito (más de los que caben en pantalla)
2. Verificar que se puede hacer scroll hacia abajo
3. Confirmar que el último producto es visible sin ser tapado por el botón
4. Probar en ambas vistas: carrito normal y confirmación de orden