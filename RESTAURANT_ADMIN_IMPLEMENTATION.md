# 🏪 Sistema de Administración de Restaurantes - Food Mike

## ✅ Fase 1 Completada: Base de Datos y Backend

### 📊 Base de Datos (Supabase)

**Archivo creado:** `restaurant-admin-schema.sql`

#### Cambios realizados:

1. **Tabla `profiles`** (actualizada)
   - ✅ Agregado campo `restaurant_id` para vincular administradores con restaurantes
   - ✅ Actualizado constraint de roles para incluir `administradorRestaurante`
   - ✅ Políticas RLS para seguridad

2. **Tabla `restaurants`** (actualizada)
   - ✅ Agregado campo `owner_id` (referencia al usuario administrador)
   - ✅ Agregado campo `status` (active, inactive, pending, suspended)
   - ✅ Agregado campo `coordinates` para ubicación
   - ✅ Agregado campo `delivery_time`
   - ✅ Agregado campo `cuisine_type`

3. **Tabla `products`** (actualizada)
   - ✅ Agregado campo `is_available` (disponibilidad del producto)
   - ✅ Agregado campo `preparation_time` (tiempo de preparación)
   - ✅ Agregado campo `calories`
   - ✅ Agregado campo `allergens` (alergenos)
   - ✅ Agregado campo `tags` (etiquetas)
   - ✅ Agregado campo `discount_percentage`

4. **Tabla `restaurant_stats`** (nueva)
   - Estadísticas agregadas del restaurante
   - Total de pedidos, ingresos, productos
   - Rating promedio, total de clientes

5. **Tabla `restaurant_schedules`** (nueva)
   - Horarios de apertura/cierre por día de la semana

#### Funciones y Triggers:
- ✅ Función `update_updated_at_column()` para timestamps automáticos
- ✅ Función `update_restaurant_stats()` para actualizar estadísticas
- ✅ Función `get_restaurant_dashboard()` para obtener datos del dashboard
- ✅ Triggers para mantener datos sincronizados

#### Políticas de Seguridad (RLS):
- ✅ Restaurantes: Todos pueden ver activos, solo owner puede editar
- ✅ Productos: Todos pueden ver disponibles, solo owner puede gestionar
- ✅ Categorías: Solo owner puede gestionar
- ✅ Estadísticas: Solo owner puede ver

### 🔧 Backend (API)

**Archivos creados:**

1. **`api/src/controllers/restaurantAdminController.js`**
   - ✅ `getDashboard()` - Obtener dashboard con estadísticas
   - ✅ `getProducts()` - Listar productos del restaurante
   - ✅ `createProduct()` - Crear nuevo producto
   - ✅ `updateProduct()` - Actualizar producto
   - ✅ `deleteProduct()` - Eliminar producto
   - ✅ `getCategories()` - Listar categorías
   - ✅ `createCategory()` - Crear categoría
   - ✅ `getOrders()` - Listar pedidos del restaurante
   - ✅ `updateOrderStatus()` - Actualizar estado de pedido
   - ✅ `updateRestaurant()` - Actualizar info del restaurante

2. **`api/src/routes/restaurantAdmin.js`**
   - ✅ Rutas protegidas con autenticación
   - ✅ Middleware de verificación de rol
   - ✅ Endpoints RESTful completos

3. **`api/src/middleware/roles.js`** (actualizado)
   - ✅ Función `requireRole()` para verificar permisos
   - ✅ Soporte para múltiples roles

4. **`api/src/index.js`** (actualizado)
   - ✅ Agregadas rutas `/api/restaurant-admin`

### 📱 Frontend (React Native)

**Archivos creados:**

1. **`src/services/restaurantAdminService.js`**
   - ✅ Servicio completo para consumir API
   - ✅ Interceptores para autenticación automática
   - ✅ Manejo de errores

2. **`src/screens/RestaurantAdminDashboardScreen.js`**
   - ✅ Dashboard con estadísticas principales
   - ✅ Tarjetas de métricas (pedidos, ingresos, productos, rating)
   - ✅ Acciones rápidas (nuevo producto, ver productos, pedidos, config)
   - ✅ Lista de pedidos recientes
   - ✅ Productos destacados
   - ✅ Pull to refresh

---

## 🚀 Próximos Pasos - Fase 2

### Pantallas a Crear:

#### 1. **Gestión de Productos**
```
src/screens/
├── RestaurantProductsScreen.js      # Lista de productos con filtros
├── AddProductScreen.js              # Formulario para crear producto
└── EditProductScreen.js             # Formulario para editar producto
```

**Funcionalidades:**
- Lista de productos con búsqueda y filtros
- Formulario con campos: nombre, descripción, precio, categoría, imagen
- Toggle de disponibilidad
- Gestión de extras/adiciones
- Subir imágenes

#### 2. **Gestión de Pedidos**
```
src/screens/
├── RestaurantOrdersScreen.js        # Lista de pedidos con filtros por estado
└── OrderDetailScreen.js             # Detalle del pedido con acciones
```

**Funcionalidades:**
- Lista de pedidos en tiempo real
- Filtros por estado (pendiente, confirmado, preparando, listo, entregado)
- Cambiar estado de pedidos
- Ver detalles del pedido
- Notificaciones push (opcional)

#### 3. **Configuración del Restaurante**
```
src/screens/
└── RestaurantSettingsScreen.js      # Configuración general
```

**Funcionalidades:**
- Editar información básica (nombre, descripción, dirección)
- Configurar horarios de apertura
- Configurar tarifa de delivery
- Pedido mínimo
- Gestionar categorías
- Cambiar imágenes (logo, cover)

#### 4. **Navegación**
```
src/navigation/
└── RestaurantAdminNavigator.js      # Stack navigator para admin de restaurante
```

**Estructura:**
```
RestaurantAdminNavigator
├── Dashboard (Tab)
├── Products (Tab)
├── Orders (Tab)
└── Settings (Tab)
```

---

## 📋 Checklist de Implementación

### Base de Datos ✅
- [x] Actualizar esquema de Supabase
- [x] Crear tablas complementarias
- [x] Configurar políticas RLS
- [x] Crear funciones y triggers

### Backend ✅
- [x] Crear controlador de administración
- [x] Crear rutas protegidas
- [x] Actualizar middleware de roles
- [x] Integrar rutas en el servidor

### Frontend - Servicios ✅
- [x] Crear servicio de API
- [x] Configurar interceptores

### Frontend - Pantallas 🔄
- [x] Dashboard principal
- [ ] Lista de productos
- [ ] Crear/Editar producto
- [ ] Lista de pedidos
- [ ] Detalle de pedido
- [ ] Configuración del restaurante

### Frontend - Navegación 🔄
- [ ] Crear navegador de administrador
- [ ] Integrar con AuthContext
- [ ] Actualizar AppNavigator

### Extras 📝
- [ ] Subida de imágenes (Cloudinary/S3)
- [ ] Notificaciones push
- [ ] Reportes y analytics
- [ ] Exportar datos

---

## 🎯 Cómo Continuar

### Opción 1: Crear Pantallas de Productos
Crear las pantallas para gestionar productos (lista, crear, editar).

### Opción 2: Crear Pantallas de Pedidos
Crear las pantallas para ver y gestionar pedidos en tiempo real.

### Opción 3: Configurar Navegación
Integrar todo en el sistema de navegación y conectar con AuthContext.

### Opción 4: Configuración del Restaurante
Crear la pantalla de configuración para editar información del restaurante.

---

## 📝 Notas Importantes

### Roles del Sistema:
1. **`cliente`** - Usuario final que ordena comida
2. **`administrador`** - Admin general de la plataforma
3. **`administradorRestaurante`** - Dueño/admin de un restaurante específico

### Flujo de Autenticación:
1. Usuario se registra/inicia sesión
2. Sistema verifica el rol en `profiles.role`
3. Si es `administradorRestaurante`, verifica `profiles.restaurant_id`
4. Redirige al navegador correspondiente

### Seguridad:
- Todas las rutas están protegidas con JWT
- RLS en Supabase previene acceso no autorizado
- Cada admin solo puede ver/editar su propio restaurante

---

## 🔗 Endpoints Disponibles

```
Base URL: /api/restaurant-admin

GET    /dashboard              # Dashboard con estadísticas
GET    /products               # Lista de productos
POST   /products               # Crear producto
PUT    /products/:id           # Actualizar producto
DELETE /products/:id           # Eliminar producto
GET    /categories             # Lista de categorías
POST   /categories             # Crear categoría
GET    /orders                 # Lista de pedidos
PUT    /orders/:id/status      # Actualizar estado de pedido
PUT    /restaurant             # Actualizar info del restaurante
```

---

## 💡 Recomendaciones

1. **Ejecutar el SQL**: Primero ejecuta `restaurant-admin-schema.sql` en Supabase
2. **Probar Endpoints**: Usa Postman/Insomnia para probar los endpoints
3. **Crear Datos de Prueba**: Crea un usuario con rol `administradorRestaurante`
4. **Asignar Restaurante**: Vincula el usuario con un restaurante existente

---

¿Con cuál opción quieres continuar? 🚀
