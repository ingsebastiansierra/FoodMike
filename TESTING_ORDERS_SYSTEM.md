# 🧪 Guía para Probar el Sistema de Pedidos

## 📋 **Pasos para Probar**

### **1. Ejecutar el SQL en Supabase**
1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega todo el contenido del archivo `supabase-orders-schema.sql`
4. Ejecuta el script (botón "Run")
5. Verifica que las tablas `orders` y `order_items` se crearon correctamente

### **2. Probar el Flujo Completo**

#### **Paso 1: Agregar productos al carrito**
1. Abre la app
2. Ve a la pantalla de inicio
3. Busca productos o ve a un restaurante
4. Agrega varios productos al carrito

#### **Paso 2: Ir a Checkout**
1. Toca el ícono del carrito en el header
2. En la pantalla del carrito, toca "Confirmar Pedido"
3. Deberías llegar a la pantalla de Checkout

#### **Paso 3: Completar información**
1. Ingresa tu dirección de entrega
2. Ingresa tu número de teléfono
3. Selecciona método de pago (Efectivo)
4. Opcionalmente agrega notas

#### **Paso 4: Confirmar pedido**
1. Revisa el resumen de precios
2. Toca "Confirmar Pedido"
3. Confirma en el diálogo
4. Deberías ver un mensaje de éxito

#### **Paso 5: Ver pedidos**
1. Ve a la pestaña "Pedidos"
2. Deberías ver tu pedido recién creado
3. Toca el pedido para ver los detalles

### **3. Verificar en Supabase**

#### **Tabla orders**
1. Ve a Supabase → Table Editor → orders
2. Deberías ver tu pedido con:
   - `user_id`: Tu ID de usuario
   - `restaurant_id`: ID del restaurante
   - `status`: 'pending'
   - `total`: Total del pedido
   - `delivery_address`: Tu dirección

#### **Tabla order_items**
1. Ve a Supabase → Table Editor → order_items
2. Deberías ver los items del pedido con:
   - `order_id`: ID del pedido
   - `product_id`: ID de cada producto
   - `quantity`: Cantidad de cada producto
   - `total_price`: Precio total por item

## 🔍 **Qué Verificar**

### **✅ Funcionalidades que deberían funcionar:**
- ✅ Agregar productos al carrito
- ✅ Persistencia del carrito (se mantiene al cerrar/abrir app)
- ✅ Navegación a checkout desde carrito
- ✅ Formulario de checkout completo
- ✅ Cálculo automático de envío y totales
- ✅ Creación de pedido en Supabase
- ✅ Visualización de pedidos en la pestaña "Pedidos"
- ✅ Detalle completo del pedido
- ✅ Filtros por estado de pedido
- ✅ Cancelación de pedidos pendientes

### **📱 Estados de Pedido:**
- **Pendiente** (amarillo): Recién creado
- **Confirmado** (azul): Restaurante confirmó
- **Preparando** (naranja): En cocina
- **Listo** (verde): Para entregar
- **Entregado** (verde): Completado
- **Cancelado** (rojo): Cancelado

## 🐛 **Posibles Problemas**

### **Si no aparecen los pedidos:**
1. Verifica que el usuario esté autenticado
2. Revisa la consola para errores
3. Verifica que las tablas existan en Supabase
4. Confirma que las políticas RLS estén activas

### **Si falla la creación del pedido:**
1. Verifica que todos los campos requeridos estén llenos
2. Revisa que el `restaurantid` exista en los productos
3. Confirma que el usuario tenga permisos

### **Si hay errores de navegación a OrderDetail:**
1. **SOLUCIONADO**: Ahora OrderDetail está en el stack principal
2. La navegación usa `navigation.getParent()?.navigate()`
3. Reinicia la app completamente si sigues viendo errores
4. Verifica en la consola que aparezca: "Navegando a OrderDetail con orderId: [ID]"

### **Si la navegación sigue fallando:**
1. Cierra completamente la app (no solo minimizar)
2. Ejecuta: `npx expo start --clear`
3. Recarga la app en el dispositivo/emulador

## 🔧 **Comandos Útiles para Debug**

### **Ver logs en tiempo real:**
```bash
npx expo start
```

### **Limpiar caché si hay problemas:**
```bash
npx expo start --clear
```

### **Ver errores específicos:**
- Abre las DevTools del navegador
- Ve a la pestaña Console
- Busca errores en rojo

## 📊 **Datos de Prueba**

### **Productos de ejemplo:**
- Asegúrate de que tus productos tengan `restaurantid`
- Verifica que las imágenes sean URLs válidas
- Confirma que los precios sean números

### **Usuario de prueba:**
- Crea un usuario con email válido
- Asegúrate de que tenga rol 'cliente'
- Verifica que esté en la tabla `profiles`

## 🎯 **Próximos Pasos**

Una vez que confirmes que todo funciona:

1. **Probar diferentes escenarios:**
   - Pedidos con múltiples productos
   - Pedidos de diferentes restaurantes
   - Cancelación de pedidos

2. **Implementar funcionalidades adicionales:**
   - Notificaciones push
   - Actualización de estados en tiempo real
   - Historial de pedidos con paginación

3. **Optimizaciones:**
   - Caché de pedidos
   - Sincronización offline
   - Mejoras de UX

¡Prueba todo y me cuentas cómo va! 🚀