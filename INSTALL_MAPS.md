# Instalación de React Native Maps

Para que el mapa funcione correctamente, necesitas instalar react-native-maps:

## Instalación

```bash
npm install react-native-maps
```

o si usas yarn:

```bash
yarn add react-native-maps
```

## Configuración para Expo

Si estás usando Expo, también necesitas instalar:

```bash
npx expo install react-native-maps
```

## Configuración de Google Maps API Key (Opcional pero recomendado)

Para mejor rendimiento y funcionalidad completa:

1. Obtén una API Key de Google Maps en: https://console.cloud.google.com/
2. Habilita las siguientes APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API

3. Agrega la API Key en tu `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_API_KEY_AQUI"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_API_KEY_AQUI"
      }
    }
  }
}
```

## Después de instalar

Ejecuta:

```bash
npx expo start --clear
```

## Características implementadas

✅ Mapa interactivo centrado en Samacá, Boyacá
✅ Selección de ubicación tocando el mapa
✅ Marcador visual de la ubicación seleccionada
✅ Geocodificación inversa (convierte coordenadas a dirección)
✅ Botón para usar ubicación actual del GPS
✅ Botón para elegir ubicación en el mapa
✅ Modal con mapa de pantalla completa
✅ Confirmación de ubicación seleccionada

## Coordenadas de Samacá

- Latitud: 5.4894
- Longitud: -73.4894
- Zoom inicial: 0.05 delta (aproximadamente 5km de radio)
