# Sistema de Roles - Food Mike

## Descripción

Este sistema implementa un login mejorado con roles de usuario para la aplicación Food Mike. Permite diferenciar entre usuarios administradores y clientes normales, con funcionalidades específicas para cada rol.

## Características Implementadas

### 🔐 Autenticación Mejorada
- **Registro con selección de rol**: Los usuarios pueden elegir entre rol de cliente o administrador
- **Login seguro**: Validación de credenciales con Firebase Auth
- **Persistencia de sesión**: El estado de autenticación se mantiene entre sesiones
- **Manejo de errores**: Mensajes de error específicos para diferentes casos

### 👥 Sistema de Roles
- **Rol Cliente**: Acceso a funcionalidades de usuario final
- **Rol Administrador**: Acceso completo al panel de administración
- **Navegación condicional**: Diferentes pantallas según el rol del usuario
- **Protección de rutas**: Componentes que verifican permisos antes de renderizar

### 🎨 Interfaces Específicas

#### Pantalla de Administrador (`AdminScreen`)
- Panel de control con estadísticas
- Gestión de usuarios (ver, cambiar roles)
- Acciones administrativas (restaurantes, reportes, configuración)
- Lista de todos los usuarios registrados

#### Pantalla de Cliente (`ClientScreen`)
- Acciones rápidas (buscar comida, pedidos, favoritos)
- Servicios disponibles (restaurantes, delivery, reservas)
- Perfil de usuario con estadísticas
- Navegación por pestañas

## Estructura de Archivos

```
src/
├── context/
│   └── AuthContext.js          # Contexto de autenticación
├── hooks/
│   └── useAuthGuard.js         # Hook para verificación de permisos
├── components/
│   └── ProtectedRoute.js       # Componente de protección de rutas
├── navigation/
│   ├── AppNavigator.js         # Navegador principal
│   └── ClientTabNavigator.js   # Navegador de pestañas para clientes
├── screens/
│   ├── LoginRegisterScreen.js  # Pantalla de login/registro mejorada
│   ├── AdminScreen.js          # Panel de administrador
│   └── ClientScreen.js         # Panel de cliente
└── theme/
    ├── colors.js
    ├── spacing.js
    └── typography.js
```

## Uso del Sistema

### 1. Registro de Usuario
```javascript
// En LoginRegisterScreen.js
const { registerUser } = useAuth();

const handleRegister = async () => {
  try {
    await registerUser(email, password, name, selectedRole);
    // El usuario será redirigido automáticamente según su rol
  } catch (error) {
    // Manejo de errores
  }
};
```

### 2. Login de Usuario
```javascript
// En LoginRegisterScreen.js
const { loginUser } = useAuth();

const handleLogin = async () => {
  try {
    await loginUser(email, password);
    // Navegación automática según rol
  } catch (error) {
    // Manejo de errores
  }
};
```

### 3. Protección de Rutas
```javascript
// Usando el componente ProtectedRoute
import ProtectedRoute from '../components/ProtectedRoute';

<ProtectedRoute requiredRole="administrador">
  <AdminOnlyComponent />
</ProtectedRoute>
```

### 4. Verificación de Permisos
```javascript
// Usando el hook useAuthGuard
import { useAuthGuard } from '../hooks/useAuthGuard';

const { hasPermission, canAccess } = useAuthGuard();

if (hasPermission('manage_users')) {
  // Mostrar funcionalidad de gestión de usuarios
}

if (canAccess('admin_panel')) {
  // Permitir acceso al panel de administración
}
```

## Configuración de Firebase

### Estructura de Firestore
```javascript
// Colección: users
{
  uid: "user_id",
  email: "user@example.com",
  name: "Nombre del Usuario",
  role: "cliente" | "administrador",
  createdAt: timestamp,
  isActive: true,
  profile: {
    phone: "",
    address: "",
    preferences: []
  }
}
```

### Reglas de Seguridad Recomendadas
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer/editar solo su propio documento
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Solo administradores pueden leer todos los usuarios
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'administrador';
    }
  }
}
```

## Funcionalidades por Rol

### 🔧 Administrador
- ✅ Ver todos los usuarios registrados
- ✅ Cambiar roles de usuarios
- ✅ Acceso al panel de administración
- ✅ Gestión de restaurantes (próximamente)
- ✅ Reportes y estadísticas (próximamente)
- ✅ Configuración del sistema (próximamente)

### 👤 Cliente
- ✅ Buscar restaurantes y comida
- ✅ Realizar pedidos (próximamente)
- ✅ Ver historial de pedidos (próximamente)
- ✅ Gestionar favoritos (próximamente)
- ✅ Ver promociones (próximamente)
- ✅ Editar perfil personal
- ✅ Reservar mesas (próximamente)

## Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Sistema de notificaciones push
- [ ] Integración con pasarelas de pago
- [ ] Sistema de reseñas y calificaciones
- [ ] Chat de soporte en tiempo real
- [ ] Sistema de puntos y recompensas
- [ ] Gestión de restaurantes para administradores
- [ ] Reportes detallados y analytics
- [ ] Sistema de cupones y descuentos

### Mejoras Técnicas
- [ ] Implementación de refresh tokens
- [ ] Autenticación biométrica
- [ ] Modo offline con sincronización
- [ ] Optimización de rendimiento
- [ ] Tests unitarios y de integración

## Instalación y Configuración

### 1. Dependencias Requeridas
```bash
npm install @react-navigation/bottom-tabs
npm install @react-native-async-storage/async-storage
npm install firebase
npm install react-native-vector-icons
```

### 2. Configuración de Firebase
Asegúrate de que tu archivo `firebase-config.js` incluya Firestore:
```javascript
import 'firebase/compat/firestore';
```

### 3. Configuración de Iconos
Para React Native Vector Icons, sigue la documentación oficial para tu plataforma.

## Troubleshooting

### Problemas Comunes

1. **Error de Firestore**: Asegúrate de que Firestore esté habilitado en tu proyecto de Firebase
2. **Iconos no aparecen**: Verifica la configuración de react-native-vector-icons
3. **Navegación no funciona**: Confirma que todas las dependencias de navegación estén instaladas

### Logs de Debug
```javascript
// Habilitar logs de debug
console.log('Usuario actual:', user);
console.log('Rol del usuario:', userRole);
console.log('¿Es administrador?', isAdmin);
```

## Contribución

Para contribuir al sistema de roles:

1. Crea una rama para tu feature
2. Implementa los cambios
3. Añade tests si es necesario
4. Actualiza la documentación
5. Crea un pull request

## Licencia

Este proyecto está bajo la licencia MIT. 