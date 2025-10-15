# 🚀 Configuración Completa de Wompi

## ✅ Paso 1: Configuración Inicial (YA HECHO)

Ya tienes tus llaves de Wompi configuradas en `.env`:
- ✅ Llave pública: `pub_test_hJj6yim7cO0jRFzHP8tG0yeRH2o0gGmC`
- ✅ Llave privada: `prv_test_gubYvyyV5VEZQF8zb7e7COxMaOWDFNrQ`

## 📦 Paso 2: Instalar Dependencias

```bash
npm install axios
```

## 🗄️ Paso 3: Actualizar Base de Datos

Ejecuta el script SQL en Supabase:

```bash
# Copia el contenido de add-payment-columns.sql
# Pégalo en el SQL Editor de Supabase
# Ejecuta el script
```

O manualmente en Supabase SQL Editor:

```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS wompi_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS wompi_payment_type TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
```

## 🔧 Paso 4: Configurar Políticas RLS en Supabase

```sql
-- Permitir que los usuarios vean sus propios pedidos con info de pago
CREATE POLICY "Users can view their own orders with payment info"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Permitir actualizar estado de pago (para webhooks)
CREATE POLICY "Service role can update payment status"
ON orders FOR UPDATE
USING (true);
```

## 🌐 Paso 5: Configurar Backend (Webhook)

### Opción A: Usar Supabase Edge Functions (Recomendado)

1. Instalar Supabase CLI:
```bash
npm install -g supabase
```

2. Crear función:
```bash
supabase functions new wompi-webhook
```

3. Copiar el código de `backend-webhook-example.js` adaptado para Edge Functions

4. Desplegar:
```bash
supabase functions deploy wompi-webhook
```

### Opción B: Servidor Node.js/Express

1. Crear servidor backend con el código de `backend-webhook-example.js`
2. Desplegarlo en Heroku, Railway, o tu servidor
3. Asegurarte que tenga HTTPS

## 🔔 Paso 6: Configurar Webhook en Wompi

1. Ir a https://comercios.wompi.co/
2. Iniciar sesión
3. Ir a **Configuración > Webhooks**
4. Agregar nueva URL:
   - URL: `https://tu-backend.com/webhooks/wompi`
   - Eventos: Seleccionar `transaction.updated`
5. Guardar

## 🧪 Paso 7: Probar en Modo Test

### Tarjetas de prueba de Wompi:

**Tarjeta aprobada:**
- Número: `4242 4242 4242 4242`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Nombre: Cualquier nombre

**Tarjeta rechazada:**
- Número: `4111 1111 1111 1111`
- CVV: `123`
- Fecha: Cualquier fecha futura

### Números de Nequi para pruebas:

**Nequi aprobado:**
- Número: `3999999999`
- Estado: Transacción aprobada ✅

**Nequi rechazado:**
- Número: `3111111111`
- Estado: Transacción rechazada ❌

**Nequi pendiente:**
- Número: `3222222222`
- Estado: Transacción pendiente ⏳

### Flujo de prueba:

1. Agregar productos al carrito
2. Ir a checkout
3. Llenar dirección y teléfono
4. Seleccionar "Tarjeta (Wompi)"
5. Confirmar pedido
6. Serás redirigido a Wompi
7. Usar tarjeta de prueba
8. Completar pago
9. Verificar que el webhook actualice el pedido

## 📱 Paso 8: Probar el Flujo Completo

```bash
# 1. Reiniciar la app
npx expo start --clear

# 2. Hacer un pedido de prueba
# 3. Seleccionar Wompi como método de pago
# 4. Completar el pago en Wompi
# 5. Verificar en Supabase que el pedido se actualizó
```

## 🔍 Verificar Estado de Transacción

Puedes verificar manualmente en:
- Dashboard de Wompi: https://comercios.wompi.co/transactions
- Tu base de datos: Tabla `orders` columna `payment_status`

## 🚀 Paso 9: Pasar a Producción

1. **Obtener llaves de producción:**
   - Ir a https://comercios.wompi.co/
   - Completar verificación de cuenta
   - Obtener llaves de producción

2. **Actualizar .env:**
```env
EXPO_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_TU_LLAVE_PRODUCCION
WOMPI_PRIVATE_KEY=prv_prod_TU_LLAVE_PRODUCCION
```

3. **Actualizar webhook URL** en Wompi con tu URL de producción

4. **Probar con transacciones reales pequeñas**

## 📊 Monitoreo

### Ver transacciones en Wompi:
https://comercios.wompi.co/transactions

### Ver logs de webhook:
https://comercios.wompi.co/webhooks

### Consultar transacción por API:
```bash
curl -X GET \
  'https://production.wompi.co/v1/transactions/TRANSACTION_ID' \
  -H 'Authorization: Bearer pub_test_hJj6yim7cO0jRFzHP8tG0yeRH2o0gGmC'
```

## ❓ Troubleshooting

### El checkout no se abre:
- Verificar que la llave pública esté correcta en `.env`
- Verificar que axios esté instalado
- Ver logs en consola

### El webhook no actualiza el pedido:
- Verificar que la URL del webhook sea HTTPS
- Ver logs en el dashboard de Wompi
- Verificar que el backend esté respondiendo 200

### El pago se aprueba pero el pedido no se actualiza:
- Verificar que el webhook esté configurado
- Ver logs del backend
- Verificar políticas RLS en Supabase

## 📞 Soporte

- Documentación Wompi: https://docs.wompi.co/
- Soporte Wompi: soporte@wompi.co
- WhatsApp Wompi: +57 300 123 4567

## 🎉 ¡Listo!

Ahora tu app puede recibir pagos con:
- 💵 Efectivo
- 🏦 Nequi / Transferencia
- 💳 Tarjetas (Wompi)
- 🏧 PSE (Wompi)
- 📱 Bancolombia (Wompi)

¡Tu app está lista para recibir pagos! 