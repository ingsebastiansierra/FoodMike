-- ============================================
-- ESQUEMA PARA ADMINISTRACIÓN DE RESTAURANTES
-- Food Mike - Sistema de Gestión de Restaurantes
-- Adaptado a la estructura existente
-- ============================================

-- 1. ACTUALIZAR TABLA DE PROFILES (ya existe)
-- Agregar columna de restaurant_id para administradores de restaurante
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS restaurant_id integer;

-- Actualizar constraint para roles válidos (incluir nuevo rol)
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('cliente', 'administrador', 'administradorRestaurante'));

-- 2. ACTUALIZAR TABLA DE RESTAURANTES (agregar campos faltantes)
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS owner_id uuid,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS coordinates jsonb,
ADD COLUMN IF NOT EXISTS delivery_time text DEFAULT '30-45 min',
ADD COLUMN IF NOT EXISTS cuisine_type text;

-- Constraint para status válidos
ALTER TABLE public.restaurants 
DROP CONSTRAINT IF EXISTS restaurants_status_check;

ALTER TABLE public.restaurants 
ADD CONSTRAINT restaurants_status_check 
CHECK (status IN ('active', 'inactive', 'pending', 'suspended'));

-- Foreign key al owner
ALTER TABLE public.restaurants 
ADD CONSTRAINT fk_restaurant_owner 
FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Foreign key desde profiles
ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profile_restaurant 
FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE SET NULL;

-- 3. ACTUALIZAR TABLA DE PRODUCTOS (agregar campos útiles)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS preparation_time integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS calories integer,
ADD COLUMN IF NOT EXISTS allergens text[],
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS discount_percentage numeric DEFAULT 0;

-- Nota: categories ya existe en tu BD, no necesitamos product_categories

-- 5. TABLA DE ESTADÍSTICAS DEL RESTAURANTE
CREATE TABLE IF NOT EXISTS public.restaurant_stats (
    id serial PRIMARY KEY,
    restaurant_id integer NOT NULL UNIQUE,
    total_orders integer DEFAULT 0,
    total_revenue numeric DEFAULT 0,
    total_products integer DEFAULT 0,
    avg_rating numeric DEFAULT 0,
    total_customers integer DEFAULT 0,
    last_order_date timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT fk_stats_restaurant 
    FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE
);

-- 6. TABLA DE HORARIOS DEL RESTAURANTE
CREATE TABLE IF NOT EXISTS public.restaurant_schedules (
    id serial PRIMARY KEY,
    restaurant_id integer NOT NULL,
    day_of_week integer NOT NULL, -- 0=Domingo, 6=Sábado
    open_time time NOT NULL,
    close_time time NOT NULL,
    is_closed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT fk_schedule_restaurant 
    FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE,
    CONSTRAINT day_of_week_check CHECK (day_of_week >= 0 AND day_of_week <= 6)
);

-- 7. ÍNDICES PARA MEJOR RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_restaurant_id ON public.profiles(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON public.restaurants(status);
CREATE INDEX IF NOT EXISTS idx_products_restaurantid ON public.products(restaurantid);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_categories_restaurantid ON public.categories(restaurantid);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 8. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 9. POLÍTICAS DE SEGURIDAD

-- Restaurantes: Todos pueden ver activos, solo owner puede editar
DROP POLICY IF EXISTS "Anyone can view active restaurants" ON public.restaurants;
CREATE POLICY "Anyone can view active restaurants" ON public.restaurants
    FOR SELECT USING (status = 'active' OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Restaurant owners can update their restaurant" ON public.restaurants;
CREATE POLICY "Restaurant owners can update their restaurant" ON public.restaurants
    FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Restaurant owners can insert their restaurant" ON public.restaurants;
CREATE POLICY "Restaurant owners can insert their restaurant" ON public.restaurants
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Productos: Todos pueden ver disponibles, solo owner del restaurante puede editar
DROP POLICY IF EXISTS "Anyone can view available products" ON public.products;
CREATE POLICY "Anyone can view available products" ON public.products
    FOR SELECT USING (
        is_available = true OR 
        EXISTS (
            SELECT 1 FROM public.restaurants 
            WHERE restaurants.id = products.restaurantid 
            AND restaurants.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Restaurant owners can manage their products" ON public.products;
CREATE POLICY "Restaurant owners can manage their products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.restaurants 
            WHERE restaurants.id = products.restaurantid 
            AND restaurants.owner_id = auth.uid()
        )
    );

-- Categorías: Solo owner del restaurante puede gestionar
DROP POLICY IF EXISTS "Restaurant owners can manage categories" ON public.categories;
CREATE POLICY "Restaurant owners can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.restaurants 
            WHERE restaurants.id = categories.restaurantid 
            AND restaurants.owner_id = auth.uid()
        )
    );

-- Profiles: Los usuarios pueden ver y editar su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Estadísticas: Solo owner puede ver
DROP POLICY IF EXISTS "Restaurant owners can view their stats" ON public.restaurant_stats;
CREATE POLICY "Restaurant owners can view their stats" ON public.restaurant_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.restaurants 
            WHERE restaurants.id = restaurant_stats.restaurant_id 
            AND restaurants.owner_id = auth.uid()
        )
    );

-- 10. FUNCIONES Y TRIGGERS

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_restaurants_updated_at ON public.restaurants;
CREATE TRIGGER update_restaurants_updated_at 
    BEFORE UPDATE ON public.restaurants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON public.products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estadísticas del restaurante
CREATE OR REPLACE FUNCTION update_restaurant_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar total de productos
    UPDATE public.restaurant_stats 
    SET 
        total_products = (
            SELECT COUNT(*) 
            FROM public.products 
            WHERE restaurantid = NEW.restaurantid
        ),
        updated_at = now()
    WHERE restaurant_id = NEW.restaurantid;
    
    -- Si no existe registro de stats, crearlo
    IF NOT FOUND THEN
        INSERT INTO public.restaurant_stats (restaurant_id, total_products)
        VALUES (NEW.restaurantid, 1);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar stats cuando se agrega/elimina producto
DROP TRIGGER IF EXISTS update_stats_on_product_change ON public.products;
CREATE TRIGGER update_stats_on_product_change
    AFTER INSERT OR DELETE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_restaurant_stats();

-- 11. FUNCIÓN PARA OBTENER DASHBOARD DEL RESTAURANTE
CREATE OR REPLACE FUNCTION get_restaurant_dashboard(p_restaurant_id integer)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_build_object(
        'stats', (
            SELECT jsonb_build_object(
                'totalOrders', COALESCE(total_orders, 0),
                'totalRevenue', COALESCE(total_revenue, 0),
                'totalProducts', COALESCE(total_products, 0),
                'avgRating', COALESCE(avg_rating, 0),
                'totalCustomers', COALESCE(total_customers, 0)
            )
            FROM public.restaurant_stats
            WHERE restaurant_id = p_restaurant_id
        ),
        'recentOrders', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', o.id,
                    'total', o.total,
                    'status', o.status,
                    'createdAt', o.created_at
                )
            ), '[]'::jsonb)
            FROM public.orders o
            WHERE o.restaurant_id = p_restaurant_id
            ORDER BY o.created_at DESC
            LIMIT 10
        ),
        'topProducts', (
            SELECT COALESCE(jsonb_agg(
                jsonb_build_object(
                    'id', p.id,
                    'name', p.name,
                    'price', p.price,
                    'image', p.image
                )
            ), '[]'::jsonb)
            FROM public.products p
            WHERE p.restaurant_id = p_restaurant_id
            AND p.is_available = true
            ORDER BY p.stars DESC
            LIMIT 5
        )
    ) INTO result;
    
    RETURN result;
END;
$$ language 'plpgsql';

-- 12. DATOS INICIALES (OPCIONAL)
-- Insertar categorías por defecto para nuevos restaurantes
-- Se puede ejecutar manualmente cuando se crea un restaurante

COMMENT ON TABLE public.restaurant_stats IS 'Estadísticas agregadas de cada restaurante';
COMMENT ON TABLE public.product_categories IS 'Categorías de productos por restaurante';
COMMENT ON TABLE public.restaurant_schedules IS 'Horarios de apertura/cierre por día';
COMMENT ON FUNCTION get_restaurant_dashboard IS 'Obtiene datos del dashboard para un restaurante';
