# 🎨 Sistema de Diseño TOC TOC

## Paleta de Colores Renovada

### 🔥 Colores Principales
Inspirados en ingredientes frescos y apetitosos:

- **Primary**: `#FF4757` - Rojo vibrante (tomate fresco)
- **Secondary**: `#FFA502` - Naranja dorado (queso cheddar)  
- **Accent**: `#2ED573` - Verde fresco (lechuga/hierbas)

### 🌈 Colores por Categoría de Comida
- **Pizza**: `#FF4757` - Rojo tomate
- **Burger**: `#FFA502` - Naranja queso
- **Sushi**: `#2ED573` - Verde wasabi
- **Dessert**: `#FF6B9D` - Rosa fresa
- **Drinks**: `#3742FA` - Azul refrescante
- **Healthy**: `#26C65B` - Verde saludable
- **Mexican**: `#FF7675` - Rojo chile
- **Asian**: `#FDCB6E` - Amarillo curry

### 🎯 Colores de Estado
- **Success**: `#2ED573` - Verde éxito
- **Error**: `#FF4757` - Rojo error
- **Warning**: `#FFA502` - Naranja advertencia
- **Info**: `#3742FA` - Azul información

## 🧩 Componentes Modernos

### ModernCard
Tarjeta con sombras y gradientes opcionales:
```jsx
<ModernCard variant="primary" elevation="large" gradient>
  <Text>Contenido de la tarjeta</Text>
</ModernCard>
```

### ModernText
Sistema de tipografía consistente:
```jsx
<Heading1>Título Principal</Heading1>
<BodyMedium color="secondary">Texto del cuerpo</BodyMedium>
<Caption>Texto pequeño</Caption>
```

### ModernBadge
Etiquetas y badges con múltiples variantes:
```jsx
<ModernBadge variant="success" icon="check" gradient>
  Disponible
</ModernBadge>
```

### Input Mejorado
Campo de entrada con estados visuales:
```jsx
<Input
  icon="envelope"
  placeholder="tu@email.com"
  label="Correo electrónico"
  error="Campo requerido"
/>
```

### BotonEstandar Renovado
Botón con gradientes y múltiples tamaños:
```jsx
<BotonEstandar
  title="Ordenar Ahora"
  variant="primary"
  size="large"
  gradient
  icon="shopping-cart"
/>
```

## 🌟 Gradientes Disponibles

### Principales
- `primary`: Rojo vibrante
- `secondary`: Naranja dorado
- `accent`: Verde fresco
- `sunset`: Rojo a naranja
- `ocean`: Azul a verde
- `fire`: Rojo intenso
- `warm`: Naranja a rosa

### Por Categoría
- `food.pizza`: Gradiente de pizza
- `food.burger`: Gradiente de hamburguesa
- `food.sushi`: Gradiente de sushi
- `food.dessert`: Gradiente de postre

## 🎭 Sombras Modernas

### Niveles
- `small`: Sombra sutil
- `medium`: Sombra estándar
- `large`: Sombra prominente
- `xlarge`: Sombra dramática

### Especializadas
- `button.default`: Para botones
- `card.elevated`: Para tarjetas
- `input.focused`: Para campos activos

## 🚀 Uso Recomendado

### Para Pantallas de Comida
```jsx
<GradientBackground variant="fire">
  <ModernCard variant="primary" elevation="large">
    <Heading2>Pizza Margherita</Heading2>
    <ModernBadge variant="success" icon="leaf">
      Vegetariana
    </ModernBadge>
  </ModernCard>
</GradientBackground>
```

### Para Estados de Pedido
```jsx
<ModernBadge variant="warning" icon="clock-o">
  Preparando
</ModernBadge>
<ModernBadge variant="success" icon="check">
  Entregado
</ModernBadge>
```

### Para Categorías
```jsx
<ModernCard gradient gradientColors={COLORS.gradients.food.pizza}>
  <Heading3 color="inverse">Pizzas</Heading3>
</ModernCard>
```

## 🎨 Filosofía de Diseño

1. **Apetitoso**: Colores que estimulan el apetito
2. **Moderno**: Gradientes y sombras contemporáneas
3. **Accesible**: Contraste adecuado para legibilidad
4. **Consistente**: Sistema unificado en toda la app
5. **Vibrante**: Colores vivos que transmiten energía

## 📱 Responsive Design

Todos los componentes están optimizados para:
- Diferentes tamaños de pantalla
- Modo claro (implementado)
- Modo oscuro (preparado para futuro)
- Accesibilidad mejorada

---

*Diseñado para hacer que cada interacción con TOC TOC sea deliciosa* 🍕✨