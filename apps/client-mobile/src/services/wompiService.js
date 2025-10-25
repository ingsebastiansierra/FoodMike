import axios from 'axios';
import { Linking, Alert } from 'react-native';
import * as Crypto from 'expo-crypto';

const WOMPI_BASE_URL = 'https://production.wompi.co/v1';
// Llaves de Wompi
const WOMPI_PUBLIC_KEY = 'pub_test_hJj6yim7cO0jRFzHP8tG0yeRH2o0gGmC';
// IMPORTANTE: Este es el "Integrity Secret" que se obtiene del dashboard de Wompi
// NO es la llave privada (prv_test_...), es un secreto diferente específico para firmas
// Lo encuentras en: Dashboard Wompi > Configuración > Llaves de integración > "Integrity Secret"
const WOMPI_INTEGRITY_SECRET = 'test_integrity_wOi25z7Ag29pcMDwJNSTyM8wquyrjEua';
// Events Secret (para webhooks)
const WOMPI_EVENTS_SECRET = 'test_events_85omAsRuEdTqRbTNmiH0gh5rb8qACPbl';

export const wompiService = {
    /**
     * Generar firma de integridad
     * Formato: SHA256(reference + amount_in_cents + currency + integrity_secret)
     * IMPORTANTE: Wompi requiere el hash en formato hexadecimal
     */
    generateIntegritySignature: async (reference, amountInCents, currency = 'COP') => {
        try {
            const concatenatedString = `${reference}${amountInCents}${currency}${WOMPI_INTEGRITY_SECRET}`;
            console.log('🔐 String para firma:', concatenatedString);
            console.log('📊 Detalles:');
            console.log('  - Reference:', reference);
            console.log('  - Amount (cents):', amountInCents);
            console.log('  - Currency:', currency);
            console.log('  - Secret:', WOMPI_INTEGRITY_SECRET);

            const hash = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                concatenatedString,
                { encoding: Crypto.CryptoEncoding.HEX }
            );

            console.log('✅ Firma SHA256 (hex):', hash);
            return hash.toLowerCase(); // Asegurar minúsculas
        } catch (error) {
            console.error('❌ Error generando firma:', error);
            throw error;
        }
    },

    /**
     * Crear enlace de pago con Wompi Checkout Widget
     * Esta es la forma más simple y segura de integrar Wompi
     */
    createCheckoutLink: async (orderData) => {
        try {
            console.log('🔨 Construyendo URL de checkout...');
            console.log('📦 Datos recibidos:', {
                amount: orderData.amount,
                reference: orderData.reference,
                email: orderData.email,
                name: orderData.name,
                phone: orderData.phone
            });

            const amountInCents = Math.round(orderData.amount * 100);
            const currency = 'COP';

            console.log('💰 Monto en centavos:', amountInCents);

            // Generar firma de integridad
            const integrity = await wompiService.generateIntegritySignature(
                orderData.reference,
                amountInCents,
                currency
            );

            console.log('🔐 Firma de integridad generada:', integrity);

            // Construir URL de checkout con firma de integridad
            // URL de redirección - Wompi redirige aquí después del pago
            const redirectUrl = orderData.redirectUrl || 'https://toctoc-payment.vercel.app';

            const params = new URLSearchParams({
                'public-key': WOMPI_PUBLIC_KEY,
                'currency': currency,
                'amount-in-cents': amountInCents.toString(),
                'reference': orderData.reference,
                'signature:integrity': integrity,
                'customer-data:email': orderData.email,
                'customer-data:full-name': orderData.name,
                'customer-data:phone-number': orderData.phone,
                'redirect-url': redirectUrl,
            });

            const checkoutUrl = `https://checkout.wompi.co/p/?${params.toString()}`;
            console.log('✅ URL construida (primeros 200 chars):', checkoutUrl.substring(0, 200));
            console.log('🔗 Parámetros enviados:', {
                publicKey: WOMPI_PUBLIC_KEY,
                currency,
                amountInCents,
                reference: orderData.reference,
                integrity: integrity.substring(0, 20) + '...',
            });

            return {
                url: checkoutUrl,
                reference: orderData.reference,
            };
        } catch (error) {
            console.error('❌ Error creating checkout link:', error);
            throw error;
        }
    },

    /**
     * Abrir el checkout de Wompi en el navegador
     */
    openCheckout: async (orderData) => {
        try {
            console.log('🔑 Wompi Public Key:', WOMPI_PUBLIC_KEY);
            console.log('📦 Order Data:', orderData);

            const checkout = await wompiService.createCheckoutLink(orderData);
            console.log('🔗 Checkout URL:', checkout.url);

            // Abrir en el navegador
            const canOpen = await Linking.canOpenURL(checkout.url);
            console.log('✅ Can open URL:', canOpen);

            if (canOpen) {
                await Linking.openURL(checkout.url);
                console.log('🚀 Browser opened successfully');
                return checkout;
            } else {
                throw new Error('No se puede abrir el navegador');
            }
        } catch (error) {
            console.error('❌ Error opening checkout:', error);
            Alert.alert('Error', `No se pudo abrir Wompi: ${error.message}`);
            throw error;
        }
    },

    /**
     * Verificar estado de una transacción
     */
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
    },

    /**
     * Crear transacción con token de tarjeta (método avanzado)
     * Requiere tokenización de tarjeta en el frontend
     */
    createTransaction: async (transactionData) => {
        try {
            const merchantInfo = await wompiService.getMerchantInfo();
            const acceptanceToken = merchantInfo.presigned_acceptance.acceptance_token;

            const response = await axios.post(
                `${WOMPI_BASE_URL}/transactions`,
                {
                    acceptance_token: acceptanceToken,
                    amount_in_cents: Math.round(transactionData.amount * 100),
                    currency: 'COP',
                    customer_email: transactionData.email,
                    payment_method: transactionData.paymentMethod,
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

    /**
     * Generar referencia única para el pedido
     */
    generateReference: (orderId) => {
        const timestamp = Date.now();
        return `ORDER-${orderId || timestamp}`;
    },

    /**
     * Formatear monto a centavos
     */
    toCents: (amount) => {
        return Math.round(amount * 100);
    },

    /**
     * Formatear centavos a pesos
     */
    fromCents: (cents) => {
        return cents / 100;
    }
};

export default wompiService;
