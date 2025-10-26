# Admin Web - TOC TOC

Panel de administración web para la plataforma TOC TOC con autenticación completa.

## 🚀 Características

### 🔐 Autenticación
- Login y registro con Supabase
- Protección de rutas por roles
- Sesión persistente
- Validación de formularios

### 👥 Admin General (Solo administradores)
- Gestión de usuarios y roles
- Cambio de roles en tiempo real
- Estadísticas generales
- Acciones rápidas (productos, pedidos, reportes)

### 🍽️ Admin Restaurante (Administradores de restaurante)
- Dashboard con estadísticas del restaurante
- Gestión de pedidos en tiempo real
- Filtros de pedidos (todos, pagados, pendientes)
- Acciones rápidas (crear shorts, productos, configuración)
- Vista de productos destacados
- Estados de pago y métodos de pago

## 🛠️ Tecnologías

- React 18
- Vite
- React Router DOM v6
- Supabase (Auth + Database)
- Recharts (para gráficas)
- Axios (para API calls)

## 📦 Instalación

```bash
cd apps/admin-web
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3001`

## 🏗️ Build

```bash
npm run build
```

## 📁 Estructura

```
admin-web/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── ActionButton.jsx
│   │   ├── StatCard.jsx
│   │   └── OrderCard.jsx
│   ├── pages/          # Páginas principales
│   │   ├── AdminDashboard.jsx
│   │   └── RestaurantDashboard.jsx
│   ├── theme/          # Sistema de temas
│   │   └── colors.js
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globales
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Características de Diseño

- Diseño responsive
- Colores consistentes con la app móvil
- Animaciones suaves
- Componentes reutilizables
- Sistema de temas centralizado

## 🔑 Roles de Usuario

- **administrador**: Acceso completo a ambos dashboards
- **administradorRestaurante**: Acceso solo al dashboard de restaurante
- **cliente**: Sin acceso al panel de administración

## 🔄 Próximas Mejoras

- [x] Autenticación y autorización con Supabase
- [x] Protección de rutas por roles
- [ ] Integración con API real para datos dinámicos
- [ ] Gráficas interactivas con Recharts
- [ ] Notificaciones en tiempo real
- [ ] Gestión completa de productos (CRUD)
- [ ] Sistema de reportes avanzado
- [ ] Modo oscuro
- [ ] Recuperación de contraseña
- [ ] Autenticación con Google/Facebook
