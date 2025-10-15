/**
 * Ejemplo de webhook para Wompi en el backend
 * Este código debe ir en tu servidor backend (Node.js/Express)
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Configurar Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Usar service key en el backend
);

/**
 * Endpoint para recibir webhooks de Wompi
 * URL: https://tu-backend.com/webhooks/wompi
 */
app.post('/webhooks/wompi', async (req, res) => {
    try {
        const { event, data, sent_at } = req.body;

        console.log('Webhook recibido de Wompi:', {
            event,
            timestamp: sent_at,
            transaction: data.transaction
        });

        // Verificar que sea un evento de transacción
        if (event === 'transaction.updated') {
            const transaction = data.transaction;
            const { id, status, reference, amount_in_cents, payment_method_type } = transaction;

            // Extraer el ID del pedido de la referencia
            // Formato: ORDER-123456
            const orderId = reference.split('-')[1];

            // Actualizar el estado del pedido según el estado de la transacción
            if (status === 'APPROVED') {
                // Pago aprobado - Actualizar pedido
                const { data: order, error } = await supabase
                    .from('orders')
                    .update({
                        payment_status: 'paid',
                        payment_method: 'wompi',
                        wompi_transaction_id: id,
                        wompi_payment_type: payment_method_type,
                        paid_at: new Date().toISOString(),
                        status: 'confirmed'
                    })
                    .eq('id', orderId)
                    .select()
                    .single();

                if (error) {
                    console.error('Error actualizando pedido:', error);
                    return res.status(500).json({ error: 'Error actualizando pedido' });
                }

                console.log('✅ Pedido confirmado:', order);

                // Aquí puedes enviar notificaciones al cliente y al restaurante
                // await sendOrderConfirmationEmail(order);
                // await sendPushNotification(order);

            } else if (status === 'DECLINED') {
                // Pago rechazado
                await supabase
                    .from('orders')
                    .update({
                        payment_status: 'failed',
                        status: 'cancelled',
                        cancelled_reason: 'Pago rechazado por Wompi'
                    })
                    .eq('id', orderId);

                console.log('❌ Pago rechazado para pedido:', orderId);

            } else if (status === 'VOIDED') {
                // Pago anulado
                await supabase
                    .from('orders')
                    .update({
                        payment_status: 'refunded',
                        status: 'cancelled',
                        cancelled_reason: 'Pago anulado'
                    })
                    .eq('id', orderId);

                console.log('🔄 Pago anulado para pedido:', orderId);

            } else if (status === 'ERROR') {
                // Error en el pago
                await supabase
                    .from('orders')
                    .update({
                        payment_status: 'failed',
                        status: 'cancelled',
                        cancelled_reason: 'Error en el procesamiento del pago'
                    })
                    .eq('id', orderId);

                console.log('⚠️ Error en pago para pedido:', orderId);
            }
        }

        // Responder a Wompi que recibimos el webhook
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error procesando webhook de Wompi:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

/**
 * Endpoint para verificar el estado de una transacción manualmente
 */
app.get('/api/wompi/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const axios = require('axios');

        const response = await axios.get(
            `https://production.wompi.co/v1/transactions/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error consultando transacción:', error);
        res.status(500).json({ error: 'Error consultando transacción' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    console.log(`📡 Webhook URL: http://localhost:${PORT}/webhooks/wompi`);
});

/**
 * CONFIGURACIÓN EN WOMPI:
 * 
 * 1. Ir a https://comercios.wompi.co/
 * 2. Configuración > Webhooks
 * 3. Agregar URL: https://tu-backend.com/webhooks/wompi
 * 4. Seleccionar eventos: transaction.updated
 * 5. Guardar
 * 
 * IMPORTANTE:
 * - El webhook debe ser HTTPS en producción
 * - Wompi enviará un POST con los datos de la transacción
 * - Debes responder con status 200 para confirmar recepción
 * - Si no respondes, Wompi reintentará el envío
 */

/**
 * ACTUALIZAR ESQUEMA DE BASE DE DATOS:
 * 
 * Agregar columnas a la tabla orders:
 * 
 * ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
 * ALTER TABLE orders ADD COLUMN IF NOT EXISTS wompi_transaction_id TEXT;
 * ALTER TABLE orders ADD COLUMN IF NOT EXISTS wompi_payment_type TEXT;
 * ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
 * 
 * Valores posibles para payment_status:
 * - 'pending': Esperando pago
 * - 'paid': Pagado
 * - 'failed': Pago fallido
 * - 'refunded': Reembolsado
 */
