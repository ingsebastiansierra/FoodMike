# Integración de Wompi para Pagos con Tarjeta

Wompi es la mejor opción para Colombia porque:
- ✅ Es colombiano y entiende el mercado local
- ✅ Tarifas competitivas (2.99% + $900 COP por transacción)
- ✅ Fácil integración
- ✅ Acepta todas las tarjetas (débito y crédito)
- ✅ PSE, Nequi, Bancolombia y más
- ✅ Sin costos de setup

## Paso 1: Crear cuenta en Wompi

1. Regístrate en: https://comercios.wompi.co/
2. Completa el proceso de verificación
3. Obtén tus llaves API (pública y privada)

## Paso 2: Instalar SDK

```bash
npm install @wompi/react-native-wompi
```

o

```bash
npx expo install @wompi/react-native-wompi
```

## Paso 3: Configuración Básica

### 3.1 Agregar las llaves en tu .env

```env
WOMPI_PUBLIC_KEY=pub_test_tu_llave_publica
WOMPI_PRIVATE_KEY=prv_test_tu_llave_privada
```

### 3.2 Crear servicio de Wompi

Crea `src/services/wompiService.js`:

```javascript
import axios from 'axios';

const WOMPI_BASE_URL = 'https://production.wompi.co/v1';
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;

export const wompiService = {
  // Crear token de aceptación
  createAcceptanceToken: async () => {
    try {
      const response = await axios.get(
        `${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`
      );
      return response.data.data.presigned_acceptance.acceptance_token;
    } catch (error) {
      console.error('Error creating acceptance token:', error);
      throw error;
    }
  },

  // Crear transacción
  createTransaction: async (transactionData) => {
    try {
      const response = await axios.post(
        `${WOMPI_BASE_URL}/transactions`,
        {
          acceptance_token: transactionData.acceptanceToken,
          amount_in_cents: transactionData.amount * 100, // Convertir a centavos
          currency: 'COP',
          customer_email: transactionData.email,
          payment_method: {
            type: 'CARD',
            token: transactionData.cardToken,
            installments: 1
          },
          reference: transactionData.reference,
          customer_data: {
            phone_number: transactionData.phone,
            full_name: transactionData.name
          }
        },
        {
          headers: {
            Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Verificar estado de transacción
  getTransactionStatus: async (transactionId) => {
    try {
      const response = await axios.get(
        `${WOMPI_BASE_URL}/transactions/${transactionId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }
};
```

## Paso 4: Implementar en CheckoutScreen

Cuando el usuario seleccione Wompi y confirme el pedido:

```javascript
const handleWompiPayment = async () => {
  try {
    // 1. Crear token de aceptación
    const acceptanceToken = await wompiService.createAcceptanceToken();

    // 2. Abrir modal de Wompi para capturar datos de tarjeta
    // Wompi proporciona un componente de formulario seguro
    const cardToken = await openWompiCardForm();

    // 3. Crear transacción
    const transaction = await wompiService.createTransaction({
      acceptanceToken,
      amount: finalTotal,
      email: user.email,
      cardToken,
      reference: `ORDER-${Date.now()}`,
      phone: phone,
      name: user.user_metadata?.full_name || user.email
    });

    // 4. Verificar estado
    if (transaction.data.status === 'APPROVED') {
      // Crear orden en tu base de datos
      await createOrder();
      showAlert('¡Pago exitoso!', 'Tu pedido ha sido confirmado');
    } else {
      showAlert('Error', 'El pago no pudo ser procesado');
    }
  } catch (error) {
    showAlert('Error', 'Hubo un problema con el pago');
  }
};
```

## Paso 5: Webhooks (Importante)

Configura webhooks en tu backend para recibir notificaciones de Wompi:

```javascript
// Backend endpoint
app.post('/webhooks/wompi', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'transaction.updated') {
    const { id, status, reference } = data.transaction;
    
    // Actualizar estado del pedido en tu base de datos
    if (status === 'APPROVED') {
      await updateOrderStatus(reference, 'paid');
    } else if (status === 'DECLINED') {
      await updateOrderStatus(reference, 'payment_failed');
    }
  }

  res.status(200).send('OK');
});
```

## Alternativa Más Simple: Wompi Checkout Widget

Si quieres una integración más rápida, usa el Widget de Wompi:

```javascript
import { Linking } from 'react-native';

const handleWompiCheckout = async () => {
  const checkoutUrl = `https://checkout.wompi.co/p/?` +
    `public-key=${WOMPI_PUBLIC_KEY}` +
    `&currency=COP` +
    `&amount-in-cents=${finalTotal * 100}` +
    `&reference=ORDER-${Date.now()}` +
    `&redirect-url=https://tuapp.com/payment-success`;

  await Linking.openURL(checkoutUrl);
};
```

## Comparación con Stripe

| Característica | Wompi | Stripe |
|---------------|-------|--------|
| Tarifa | 2.99% + $900 | 3.9% + $700 |
| Setup | Gratis | Gratis |
| Métodos locales | PSE, Nequi, Bancolombia | Limitado |
| Soporte local | Excelente | Limitado |
| Documentación | Español | Inglés |
| Mejor para | Colombia | Internacional |

## Recomendación

Para tu app en Colombia, **Wompi es la mejor opción** porque:
1. Mejor soporte para métodos de pago locales
2. Tarifas más bajas
3. Soporte en español
4. Más fácil de integrar para el mercado colombiano

## Recursos

- Documentación: https://docs.wompi.co/
- Dashboard: https://comercios.wompi.co/
- Soporte: soporte@wompi.co
- WhatsApp: +57 300 123 4567

## Próximos pasos

1. Crear cuenta en Wompi
2. Obtener llaves API
3. Instalar SDK
4. Implementar el flujo de pago
5. Configurar webhooks
6. Probar en modo sandbox
7. Activar modo producción
