# 📍 Funcionalidad de Geolocalización - Guía de Prueba

## 🎯 **Nueva Funcionalidad Implementada**

### **✅ Características:**
- 🗺️ **Obtener ubicación GPS** del dispositivo
- 🏠 **Convertir coordenadas a dirección** (geocoding reverso)
- 💾 **Guardar coordenadas** en el pedido
- 📱 **Mostrar precisión** de la ubicación
- 🔍 **Ver ubicación** en el detalle del pedido

## 🔧 **Archivos Actualizados:**

### **1. Base de Datos (Supabase)**
- ✅ **Nueva columna**: `delivery_coordinates` en tabla `orders`
- ✅ **Formato JSON**: `{latitude: number, longitude: number, accuracy: number}`

### **2. Servicios Nuevos**
- ✅ **locationService.js**: Manejo completo de geolocalización
- ✅ **Permisos GPS**: Solicitud automática
- ✅ **Geocoding reverso**: Coordenadas → Dirección
- ✅ **Cálculo de distancia**: Para área de servicio

### **3. CheckoutScreen Mejorado**
- ✅ **Botón "Mi Ubicación"**: Obtiene GPS automáticamente
- ✅ **Indicador de precisión**: Muestra exactitud del GPS
- ✅ **Estado de carga**: Loading mientras obtiene ubicación
- ✅ **Manejo de errores**: Mensajes específicos por tipo de error

### **4. Pedidos con Ubicación**
- ✅ **Coordenadas guardadas**: En cada pedido
- ✅ **Mostrar en detalle**: Coordenadas y precisión
- ✅ **Integración completa**: Desde checkout hasta detalle

## 📱 **Cómo Probar:**

### **Paso 1: Actualizar Base de Datos**
```sql
-- Ejecutar en Supabase SQL Editor
ALTER TABLE public.orders 
ADD COLUMN delivery_coordinates jsonb;
```

### **Paso 2: Probar en Checkout**
1. **Agregar productos** al carrito
2. **Ir a Checkout**
3. **En "Dirección de Entrega"** → Tocar **"Mi Ubicación"**
4. **Permitir permisos** cuando el sistema lo solicite
5. **Esperar** a que se obtenga la ubicación
6. **Verificar** que aparezca:
   - ✅ Dirección automática en el campo
   - ✅ Mensaje verde: "Ubicación GPS detectada (Xm de precisión)"

### **Paso 3: Completar Pedido**
1. **Completar** resto de información (teléfono, método de pago)
2. **Confirmar pedido**
3. **Verificar** que se cree exitosamente

### **Paso 4: Ver en Detalle**
1. **Ir a "Pedidos"**
2. **Tocar el pedido** recién creado
3. **Verificar** que aparezca sección:
   - 📍 **"Ubicación de Entrega"**
   - 🗺️ **Coordenadas GPS**: lat, lng
   - 🎯 **Precisión**: metros de exactitud

## 🔍 **Estados Esperados:**

### **✅ Funcionamiento Correcto:**
- **Botón activo**: "Mi Ubicación" responde al toque
- **Permisos solicitados**: Sistema pide acceso a ubicación
- **Loading visible**: "Obteniendo..." mientras busca
- **Dirección automática**: Campo se llena solo
- **Indicador verde**: Confirma GPS detectado
- **Coordenadas guardadas**: Aparecen en detalle del pedido

### **⚠️ Posibles Problemas:**

#### **Permisos Denegados:**
- **Error**: "Permisos de ubicación denegados"
- **Solución**: Ir a Configuración → Apps → FoodMike → Permisos → Ubicación

#### **GPS Desactivado:**
- **Error**: "Verifica que tengas GPS activado"
- **Solución**: Activar ubicación en configuración del dispositivo

#### **Timeout:**
- **Error**: "La búsqueda tardó demasiado"
- **Solución**: Salir al exterior o cerca de ventana

#### **Sin Conexión:**
- **Error**: No se puede convertir coordenadas a dirección
- **Resultado**: Se guardan coordenadas pero dirección queda manual

## 🌍 **Funcionalidades Avanzadas:**

### **Cálculo de Distancia:**
```javascript
// Verificar si está en área de servicio
const distance = locationService.calculateDistance(
  userLat, userLng, 
  restaurantLat, restaurantLng
);
```

### **Área de Servicio:**
```javascript
// Verificar cobertura (ejemplo: 10km)
const inServiceArea = locationService.isWithinServiceArea(
  userLat, userLng, 
  restaurantLocation, 
  10 // km
);
```

## 📊 **Datos en Supabase:**

### **Tabla orders - Nueva columna:**
```json
{
  "delivery_coordinates": {
    "latitude": 5.123456,
    "longitude": -73.654321,
    "accuracy": 15.5
  }
}
```

### **Consulta para ver pedidos con ubicación:**
```sql
SELECT 
  id,
  delivery_address,
  delivery_coordinates,
  created_at
FROM orders 
WHERE delivery_coordinates IS NOT NULL;
```

## 🚀 **Próximas Mejoras Posibles:**

### **Funcionalidades Futuras:**
- 🗺️ **Mapa interactivo**: Mostrar ubicación en mapa
- 📏 **Cálculo de envío**: Precio basado en distancia
- 🚚 **Seguimiento en tiempo real**: Ubicación del repartidor
- 📍 **Múltiples direcciones**: Guardar direcciones favoritas
- 🏢 **Detección automática**: Casa, trabajo, etc.

**¡Prueba la funcionalidad y me cuentas cómo funciona! 📱🗺️**