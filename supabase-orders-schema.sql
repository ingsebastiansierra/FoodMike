-- Esquema para el sistema de pedidos en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- Tabla de pedidos (orders)
CREATE TABLE public.orders (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    restaurant_id integer NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    subtotal numeric NOT NULL DEFAULT 0.00,
    delivery_fee numeric NOT NULL DEFAULT 0.00,
    total numeric NOT NULL DEFAULT 0.00,
    delivery_address jsonb,
    delivery_coordinates jsonb, -- {latitude: number, longitude: number}
    payment_method text,
    notes text,
    estimated_delivery_time timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT fk_order_restaurant FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id),
    CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'))
);

-- Tabla de items del pedido (order_items)
CREATE TABLE public.order_items (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL,
    extras jsonb,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES public.products(id),
    CONSTRAINT order_items_quantity_check CHECK (quantity > 0),
    CONSTRAINT order_items_unit_price_check CHECK (unit_price >= 0),
    CONSTRAINT order_items_total_price_check CHECK (total_price >= 0)
);

-- Índices para mejor rendimiento
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas de seguridad para order_items
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en orders
CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON public.orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular el total del pedido
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar el subtotal del pedido
    UPDATE public.orders 
    SET subtotal = (
        SELECT COALESCE(SUM(total_price), 0) 
        FROM public.order_items 
        WHERE order_id = NEW.order_id
    ),
    total = subtotal + delivery_fee
    WHERE id = NEW.order_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para recalcular totales cuando se modifican items
CREATE TRIGGER calculate_order_total_on_insert
    AFTER INSERT ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

CREATE TRIGGER calculate_order_total_on_update
    AFTER UPDATE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

CREATE TRIGGER calculate_order_total_on_delete
    AFTER DELETE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION calculate_order_total();