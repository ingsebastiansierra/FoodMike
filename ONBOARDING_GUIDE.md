# 🎯 Guía del Onboarding - FoodMike

## 📱 Descripción

El onboarding de FoodMike es una experiencia de 3 pantallas diseñada para dar la bienvenida a nuevos usuarios y presentar las características principales de la aplicación.

## 🎨 Características del Onboarding

### ✨ Diseño Moderno
- **Gradientes dinámicos**: Cada pantalla tiene su propio gradiente de colores
- **Animaciones suaves**: Transiciones fluidas entre pantallas
- **Iconos animados**: Elementos interactivos con efectos visuales
- **Imágenes de alta calidad**: Fotografías profesionales de comida

### 📋 Pantallas del Onboarding

#### 1. **¡Bienvenido a FoodMike!**
- **Color**: Naranja (#FF6B00)
- **Icono**: Utensilios
- **Mensaje**: Presentación de la experiencia gastronómica
- **Imagen**: Comida gourmet

#### 2. **Entrega Rápida y Segura**
- **Color**: Turquesa (#4ECDC4)
- **Icono**: Camión de entrega
- **Mensaje**: Enfoque en la velocidad y seguridad
- **Imagen**: Servicio de entrega

#### 3. **Variedad Sin Límites**
- **Color**: Azul (#45B7D1)
- **Icono**: Globo mundial
- **Mensaje**: Diversidad de opciones gastronómicas
- **Imagen**: Variedad de comidas

## 🔄 Lógica de Funcionamiento

### 🆕 Usuarios Nuevos
- **Primera vez**: Se muestra el onboarding automáticamente
- **Flujo**: Splash → Onboarding → Login/Register → App Principal

### 👤 Usuarios Existentes
- **Ya logueados**: Van directamente a la app principal
- **No logueados**: Van directamente a Login/Register

### 🎛️ Control de Estado
- **AsyncStorage**: Almacena el estado de completado
- **Clave**: `"onboardingCompleted"`
- **Valor**: `"true"` cuando está completado

## 🛠️ Funciones de Utilidad

### 📁 `src/utils/index.js`

```javascript
// Resetear onboarding
resetOnboarding(onSuccess, onError)

// Verificar estado
isOnboardingCompleted()

// Completar onboarding
completeOnboarding()
```

## 🎮 Cómo Probar el Onboarding

### 🔄 Resetear para Pruebas
1. **Desde el perfil del cliente**:
   - Ve a la pestaña "Perfil"
   - Toca "Resetear Onboarding"
   - Confirma la acción
   - Reinicia la aplicación

### 📱 Flujo de Prueba
1. **Resetear onboarding**
2. **Cerrar la aplicación completamente**
3. **Abrir la aplicación**
4. **Ver el splash screen**
5. **Ver las 3 pantallas del onboarding**
6. **Completar o omitir el onboarding**
7. **Ir a Login/Register**

## 🎨 Personalización

### 🎨 Cambiar Colores
```javascript
const data = [
  {
    color: "#FF6B00",
    gradient: ["#FF6B00", "#FF8E53"]
  }
];
```

### 📝 Cambiar Textos
```javascript
const data = [
  {
    titleText: "Tu título aquí",
    subtitleText: "Tu subtítulo aquí"
  }
];
```

### 🖼️ Cambiar Imágenes
```javascript
const data = [
  {
    imageSource: require("../assets/tu-imagen.jpg")
  }
];
```

## 🔧 Archivos Principales

- **`src/screens/WelcomeCarouselScreen.js`**: Pantalla principal del onboarding
- **`src/navigation/AppNavigator.js`**: Lógica de navegación
- **`src/utils/index.js`**: Funciones de utilidad
- **`src/screens/ClientHomeScreen.js`**: Botón de reseteo

## 🎯 Mejores Prácticas

### ✅ Recomendaciones
- **Mantener consistencia**: Usar los mismos colores de la app
- **Optimizar imágenes**: Comprimir para mejor rendimiento
- **Probar en diferentes dispositivos**: Asegurar responsividad
- **Mantener textos claros**: Mensajes concisos y atractivos

### ❌ Evitar
- **Textos muy largos**: Mantener mensajes breves
- **Imágenes pesadas**: Optimizar el tamaño
- **Colores muy contrastantes**: Usar paletas armónicas
- **Animaciones excesivas**: Mantener fluidez

## 🚀 Próximas Mejoras

- [ ] **Animaciones más avanzadas**: Lottie animations
- [ ] **Personalización por usuario**: Onboarding adaptativo
- [ ] **Múltiples idiomas**: Soporte internacional
- [ ] **Temas oscuros**: Modo nocturno
- [ ] **Analytics**: Seguimiento de uso

---

**Desarrollado con ❤️ para FoodMike** 