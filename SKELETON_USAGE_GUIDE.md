# 🦴 Guía de Uso de Skeletons - TOC TOC

## 📱 Sistema de Skeleton Loaders Implementado

### 🎯 **¿Qué son los Skeletons?**
Los skeleton loaders son placeholders animados que se muestran mientras se carga el contenido real, mejorando la percepción de velocidad y la experiencia del usuario.

## 🧩 **Componentes Disponibles**

### 1. **SkeletonBase**
Componente base para crear skeletons personalizados:
```jsx
import { SkeletonBase } from '../components/skeletons';

<SkeletonBase 
  width="80%" 
  height={20} 
  borderRadius={8} 
  animationSpeed={1000}
/>
```

### 2. **SkeletonCard**
Para tarjetas de productos/restaurantes:
```jsx
import { SkeletonCard } from '../components/skeletons';

<SkeletonCard 
  showImage={true}
  showTitle={true}
  showSubtitle={true}
  showPrice={true}
/>
```

### 3. **SkeletonList**
Para listas de elementos:
```jsx
import { SkeletonList } from '../components/skeletons';

<SkeletonList 
  itemCount={5}
  itemType="card" // 'card', 'simple', 'restaurant'
  horizontal={false}
/>
```

### 4. **SkeletonProfile**
Para pantallas de perfil de usuario:
```jsx
import { SkeletonProfile } from '../components/skeletons';

<SkeletonProfile />
```

### 5. **SkeletonCart**
Para pantallas de carrito de compras:
```jsx
import { SkeletonCart } from '../components/skeletons';

<SkeletonCart itemCount={3} />
```

## 🚀 **LoadingWrapper - Uso Simplificado**

El componente `LoadingWrapper` facilita la implementación:

```jsx
import LoadingWrapper from '../components/LoadingWrapper';
import { useLoading } from '../hooks/useLoading';

const MyComponent = () => {
  const { isLoading, executeWithLoading } = useLoading();

  const loadData = async () => {
    await executeWithLoading(async () => {
      // Tu lógica de carga aquí
      const data = await fetchData();
      setData(data);
    });
  };

  return (
    <LoadingWrapper 
      isLoading={isLoading}
      skeletonType="products"
      skeletonCount={6}
    >
      {/* Tu contenido real aquí */}
      <ProductList products={data} />
    </LoadingWrapper>
  );
};
```

## 📋 **Tipos de Skeleton Disponibles**

| Tipo | Descripción | Uso Recomendado |
|------|-------------|-----------------|
| `card` | Tarjeta individual | Productos, restaurantes |
| `list` | Lista genérica | Cualquier lista |
| `profile` | Perfil completo | Pantalla de usuario |
| `cart` | Carrito de compras | Pantalla de carrito |
| `products` | Lista de productos | Catálogo de productos |
| `restaurants` | Lista de restaurantes | Lista de restaurantes |
| `simple` | Lista simple | Categorías, menús |

## 🎨 **Ejemplos de Implementación**

### **1. Pantalla de Productos**
```jsx
const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const { isLoading, executeWithLoading } = useLoading();

  useEffect(() => {
    executeWithLoading(async () => {
      const data = await productsService.getAll();
      setProducts(data);
    });
  }, []);

  return (
    <LoadingWrapper 
      isLoading={isLoading}
      skeletonType="products"
      skeletonCount={8}
    >
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </LoadingWrapper>
  );
};
```

### **2. Pantalla de Perfil**
```jsx
const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const { isLoading, executeWithLoading } = useLoading();

  useEffect(() => {
    executeWithLoading(async () => {
      const userData = await userService.getProfile();
      setUser(userData);
    });
  }, []);

  return (
    <LoadingWrapper 
      isLoading={isLoading}
      skeletonType="profile"
    >
      <ProfileContent user={user} />
    </LoadingWrapper>
  );
};
```

### **3. Múltiples Estados de Carga**
```jsx
const HomeScreen = () => {
  const { 
    loadingStates, 
    executeWithLoading, 
    isLoading 
  } = useMultipleLoading({
    restaurants: true,
    products: true,
    categories: false
  });

  return (
    <ScrollView>
      {/* Categorías */}
      <LoadingWrapper 
        isLoading={isLoading('categories')}
        skeletonType="simple"
        skeletonCount={5}
      >
        <CategoriesList />
      </LoadingWrapper>

      {/* Productos */}
      <LoadingWrapper 
        isLoading={isLoading('products')}
        skeletonType="products"
        skeletonCount={6}
      >
        <ProductsList />
      </LoadingWrapper>

      {/* Restaurantes */}
      <LoadingWrapper 
        isLoading={isLoading('restaurants')}
        skeletonType="restaurants"
        skeletonCount={4}
      >
        <RestaurantsList />
      </LoadingWrapper>
    </ScrollView>
  );
};
```

## 🎯 **Hook useLoading**

### **Uso Básico:**
```jsx
const { isLoading, executeWithLoading, setLoadingError } = useLoading();

// Ejecutar función con loading automático
await executeWithLoading(async () => {
  const data = await api.getData();
  setData(data);
});
```

### **Múltiples Estados:**
```jsx
const { 
  isLoading, 
  setLoading, 
  executeWithLoading 
} = useMultipleLoading({
  products: false,
  restaurants: false,
  user: true
});

// Cargar productos
await executeWithLoading('products', async () => {
  const products = await api.getProducts();
  setProducts(products);
});
```

## ✅ **Mejores Prácticas**

### **1. Tiempos de Animación**
- **Rápido**: 800ms para elementos pequeños
- **Normal**: 1000ms para elementos medianos
- **Lento**: 1200ms para elementos grandes

### **2. Cantidad de Elementos**
- **Listas**: 5-8 elementos skeleton
- **Grids**: 6-9 elementos skeleton
- **Carrusel**: 3-4 elementos skeleton

### **3. Consistencia Visual**
- Usar el mismo `borderRadius` que el contenido real
- Mantener proporciones similares
- Respetar la jerarquía visual

### **4. Estados de Error**
```jsx
const { isLoading, error, executeWithLoading } = useLoading();

if (error) {
  return <ErrorComponent message={error} />;
}

return (
  <LoadingWrapper isLoading={isLoading} skeletonType="products">
    <ProductsList />
  </LoadingWrapper>
);
```

## 🎨 **Personalización**

### **Colores Personalizados:**
```jsx
// En tu tema
export const SKELETON_COLORS = {
  base: COLORS.lightGray,
  highlight: COLORS.white,
  animated: COLORS.primaryLight,
};
```

### **Animaciones Personalizadas:**
```jsx
<SkeletonBase 
  animationSpeed={800}
  style={{ 
    backgroundColor: COLORS.lightPrimary 
  }}
/>
```

## 🚀 **Resultado**

Con este sistema implementado, TOC TOC ahora ofrece:

- ✅ **Mejor UX**: Los usuarios ven que algo está cargando
- ✅ **Percepción de velocidad**: La app se siente más rápida
- ✅ **Consistencia**: Skeletons coherentes en toda la app
- ✅ **Fácil mantenimiento**: Componentes reutilizables
- ✅ **Flexibilidad**: Fácil personalización y extensión

---

*¡Los skeletons hacen que cada carga en TOC TOC sea una experiencia fluida!* 🦴✨