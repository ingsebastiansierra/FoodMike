-- Agregar columnas para pagos con Wompi a la tabla orders

-- Columna para el estado del pago
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Columna para el ID de transacción de Wompi
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS wompi_transaction_id TEXT;

-- Columna para el tipo de pago usado en Wompi (CARD, PSE, NEQUI, etc)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS wompi_payment_type TEXT;

-- Columna para la fecha de pago
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Comentarios para documentar
COMMENT ON COLUMN orders.payment_status IS 'Estado del pago: pending, paid, failed, refunded';
COMMENT ON COLUMN orders.wompi_transaction_id IS 'ID de la transacción en Wompi';
COMMENT ON COLUMN orders.wompi_payment_type IS 'Tipo de pago usado: CARD, PSE, NEQUI, BANCOLOMBIA_TRANSFER, etc';
COMMENT ON COLUMN orders.paid_at IS 'Fecha y hora en que se completó el pago';

-- Índice para búsquedas rápidas por transacción de Wompi
CREATE INDEX IF NOT EXISTS idx_orders_wompi_transaction 
ON orders(wompi_transaction_id);

-- Índice para búsquedas por estado de pago
CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON orders(payment_status);

-- Actualizar pedidos existentes con método de pago en efectivo
UPDATE orders 
SET payment_status = 'pending'
WHERE payment_method = 'cash' 
AND payment_status IS NULL;

-- Actualizar pedidos existentes con método de pago transferencia
UPDATE orders 
SET payment_status = 'pending'
WHERE payment_method = 'transfer' 
AND payment_status IS NULL;

-- Ver estructura actualizada
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('payment_status', 'wompi_transaction_id', 'wompi_payment_type', 'paid_at')
ORDER BY ordinal_position;
