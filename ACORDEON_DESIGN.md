# Diseño de Acordeón para Checkout

## Estructura Visual

```
┌─────────────────────────────────────┐
│  ← Verificación del Pago            │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ✓ 1. Dirección de Entrega   │   │ ← Completado (colapsado)
│  │   Calle 123, Barrio Centro  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ▼ 2. Método de Pago         │   │ ← Expandido (activo)
│  │                             │   │
│  │   ○ Efectivo                │   │
│  │   ● Nequi / Transferencia   │   │
│  │   ○ Tarjeta (Wompi)         │   │
│  │                             │   │
│  │   [Continuar]               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔒 3. Confirmar Pedido      │   │ ← Bloqueado
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [🎉 Confirmar Pedido - $50,000]   │
└─────────────────────────────────────┘
```

## Comportamiento

1. **Sección 1 - Dirección**
   - Inicia expandida
   - Usuario llena datos
   - Click en "Continuar" → Se colapsa y muestra resumen
   - Se expande Sección 2

2. **Sección 2 - Pago**
   - Bloqueada hasta completar Sección 1
   - Se expande automáticamente
   - Usuario selecciona método
   - Click en "Continuar" → Se colapsa y muestra resumen
   - Se expande Sección 3

3. **Sección 3 - Confirmar**
   - Bloqueada hasta completar Sección 2
   - Muestra resumen completo
   - Botón final para confirmar pedido

## Ventajas

- ✅ Todo en una pantalla con scroll vertical
- ✅ Progreso visual claro
- ✅ Puede editar secciones anteriores
- ✅ Diseño moderno usado en Uber, Rappi, etc.
- ✅ Menos confusión para el usuario
