# FoodMike API

API REST para la aplicación FoodMike, construida con Node.js, Express y Firebase Firestore.

## 🚀 Características

- **RESTful API** con endpoints bien estructurados
- **Autenticación** con Firebase Admin
- **Base de datos** en Firestore
- **Rate limiting** para protección
- **CORS** configurado
- **Compresión** de respuestas
- **Logging** con Morgan
- **Seguridad** con Helmet

## 📋 Requisitos

- Node.js >= 16.0.0
- Cuenta de Firebase con Firestore habilitado
- Credenciales de servicio de Firebase

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
cd api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```

4. **Editar .env con tus credenciales de Firebase**
```env
PORT=3001
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-clave-privada\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
# ... resto de variables
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Migración de datos
```bash
npm run migrate
```

## 📚 Endpoints

### Restaurantes

- `GET /api/restaurants` - Obtener todos los restaurantes
- `GET /api/restaurants/open` - Obtener restaurantes abiertos
- `GET /api/restaurants/category/:category` - Obtener por categoría
- `GET /api/restaurants/:id` - Obtener restaurante por ID
- `POST /api/restaurants` - Crear restaurante
- `PUT /api/restaurants/:id` - Actualizar restaurante
- `DELETE /api/restaurants/:id` - Eliminar restaurante

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/popular` - Obtener productos populares
- `GET /api/products/category/:category` - Obtener por categoría
- `GET /api/products/restaurant/:restaurantId` - Obtener por restaurante
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Búsqueda

- `GET /api/search?q=query` - Búsqueda básica
- `GET /api/search/advanced?q=query&category=burgers&minPrice=10&maxPrice=50&minStars=4` - Búsqueda avanzada
- `GET /api/search/featured` - Productos destacados
- `GET /api/search/categories` - Categorías disponibles

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | 3001 |
| `FIREBASE_PROJECT_ID` | ID del proyecto Firebase | - |
| `FIREBASE_PRIVATE_KEY` | Clave privada de Firebase | - |
| `FIREBASE_CLIENT_EMAIL` | Email del cliente Firebase | - |
| `CORS_ORIGIN` | Origen permitido para CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limiting | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requests por ventana | 100 |

## 🗄️ Estructura de la Base de Datos

### Colección: restaurants
```javascript
{
  id: "string",
  name: "string",
  description: "string",
  address: "string",
  phone: "string",
  email: "string",
  stars: "number",
  reviews: "number",
  deliveryTime: "string",
  deliveryFee: "number",
  minOrder: "number",
  image: "object",
  coverImage: "object",
  categories: ["array"],
  isOpen: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Colección: products
```javascript
{
  id: "string",
  name: "string",
  description: "string",
  price: "number",
  originalPrice: "number",
  image: "object",
  category: "string",
  restaurantId: "string",
  stars: "number",
  reviews: "number",
  tags: ["array"],
  isAvailable: "boolean",
  isPopular: "boolean",
  isRecommended: "boolean",
  preparationTime: "string",
  allergens: ["array"],
  nutritionalInfo: "object",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 🚀 Despliegue

### Vercel
1. Instalar Vercel CLI: `npm i -g vercel`
2. Ejecutar: `vercel`
3. Configurar variables de entorno en el dashboard

### Railway
1. Conectar repositorio a Railway
2. Configurar variables de entorno
3. Deploy automático

### Heroku
1. Crear app en Heroku
2. Conectar repositorio
3. Configurar variables de entorno
4. Deploy

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon
- `npm run migrate` - Ejecutar migración de datos
- `npm test` - Ejecutar tests

## 🔒 Seguridad

- **Rate Limiting**: Protección contra spam
- **CORS**: Configurado para orígenes específicos
- **Helmet**: Headers de seguridad
- **Validación**: Validación de datos de entrada
- **Compresión**: Optimización de respuestas

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo de FoodMike.

## 📄 Licencia

MIT License 