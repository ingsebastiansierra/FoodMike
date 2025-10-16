// Supabase Edge Function para recibir webhooks de Wompi
// Despliega con: supabase functions deploy wompi-webhook --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const WOMPI_EVENTS_SECRET = 'test_events_85omAsRuEdTqRbTNmiH0gh5rb8qACPbl';

interface WompiEvent {
  event: string;
  data: {
    transaction: {
      id: string;
      reference: string;
      status: string;
      amount_in_cents: number;
      currency: string;
      payment_method_type: string;
      payment_method: any;
      customer_email: string;
      finalized_at: string;
    };
  };
  sent_at: string;
  timestamp: number;
  signature: {
    checksum: string;
    properties: string[];
  };
}

serve(async (req) => {
  // Configurar CORS para permitir requests de Wompi
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  // Solo aceptar POST (además de OPTIONS que ya manejamos)
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Leer el body del webhook
    const event: WompiEvent = await req.json();
    console.log('📨 Webhook recibido:', event);

    // Verificar que sea un evento de transacción
    if (event.event !== 'transaction.updated') {
      console.log('⚠️ Evento ignorado:', event.event);
      return new Response(JSON.stringify({ message: 'Event ignored' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transaction = event.data.transaction;
    console.log('💳 Transacción:', {
      id: transaction.id,
      reference: transaction.reference,
      status: transaction.status,
      amount: transaction.amount_in_cents / 100,
    });

    // Verificar firma (opcional pero recomendado)
    // TODO: Implementar verificación de firma con WOMPI_EVENTS_SECRET

    // Conectar a Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extraer el ID del pedido de la referencia (formato: ORDER-123)
    const orderId = transaction.reference.replace('ORDER-', '');
    console.log('📦 Order ID extraído:', orderId);

    // Determinar el estado del pago
    let paymentStatus = 'pending';
    if (transaction.status === 'APPROVED') {
      paymentStatus = 'paid';
    } else if (transaction.status === 'DECLINED' || transaction.status === 'ERROR') {
      paymentStatus = 'failed';
    }

    console.log('🔄 Actualizando pedido:', orderId, 'con estado:', paymentStatus);

    // Actualizar el pedido en la base de datos
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        wompi_transaction_id: transaction.id,
        wompi_reference: transaction.reference,
        wompi_payment_method: transaction.payment_method_type,
        paid_at: transaction.status === 'APPROVED' ? transaction.finalized_at : null,
        status: transaction.status === 'APPROVED' ? 'confirmed' : 'pending',
      })
      .eq('id', orderId);

    if (error) {
      console.error('❌ Error actualizando pedido:', error);
      return new Response(
        JSON.stringify({ error: 'Database error', details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Pedido actualizado exitosamente:', data);

    // Responder a Wompi con 200 OK
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        orderId,
        paymentStatus,
        transactionId: transaction.id,
        paymentMethod: transaction.payment_method_type,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
