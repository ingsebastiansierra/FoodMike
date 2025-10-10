-- ============================================
-- ESQUEMA SEGURO PARA ADMINISTRACIÓN DE RESTAURANTES
-- Food Mike - Sistema de Gestión de Restaurantes
-- Versión segura para Supabase
-- ============================================

-- IMPORTANTE: Ejecutar cada sección por separado en el SQL Editor de Supabase

-- ============================================
-- SECCIÓN 1: ACTUALIZAR TABLA PROFILES
-- ============================================

-- Agregar columna restaurant_id a profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS restaurant_id integer;

-- Agregar foreign key a restaurants (solo si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_profile_restaurant'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT fk_profile_restaurant 
        FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================
-- SECCIÓN 2: ACTUALIZAR TABLA RESTAURANTS
-- ============================================

-- Agregar columnas nuevas a restaurants
ALTER TABLE public.restaurants 
ADD COLUMN IF NOT EXISTS owner_id uuid,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS coordinates jsonb,
ADD COLUMN IF NOT EXISTS delivery_time text DEFAULT '30-45 min',
ADD COLUMN IF NOT EXISTS cuisine_type text;

-- Agregar foreign key a auth.users (solo si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_restaurant_owner'
    ) THEN
        ALTER TABLE public.restaurants 
        ADD CONSTRAINT fk_restaurant_owner 
        FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================
-- SECCIÓN 3: ACTUALIZAR TABLA PRODUCTS
-- ============================================

-- Agregar columnas nuevas a products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS preparation_time integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS calories integer,
ADD COLUMN IF NOT EXISTS allergens text[],
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS discount_percentage numeric DEFAULT 0;

-- ============================================
-- SECCIÓN 4: CREAR TABLA DE ESTADÍSTICAS
-- ============================================

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

-- ============================================
-- SECCIÓN 5: CREAR TABLA DE HORARIOS
-- ============================================

CREATE TABLE IF NOT EXISTS public.restaurant_schedules (
    id serial PRIMARY KEY,
    restaurant_id integer NOT NULL,
    day_of_week integer NOT NULL,
    open_time time NOT NULL,
    close_time time NOT NULL,
    is_closed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    
    CONSTRAINT fk_schedule_restaurant 
    FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(id) ON DELETE CASCADE,
    CONSTRAINT day_of_week_check CHECK (day_of_week >= 0 AND day_of_week <= 6)
);

-- ============================================
-- SECCIÓN 6: CREAR ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_restaurant_id ON public.profiles(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_status ON public.restaurants(status);
CREATE INDEX IF NOT EXISTS idx_products_restaurantid ON public.products(restaurantid);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_categories_restaurantid ON public.categories(restaurantid);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ============================================
-- SECCIÓN 7: HABILITAR RLS (Row Level Security)
-- ============================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECCIÓN 8: POLÍTICAS DE SEGURIDAD - RESTAURANTS
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "view_active_restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "update_own_restaurant" ON public.restaurants;
DROP POLICY IF EXISTS "insert_own_restaurant" ON public.restaurants;

-- Política para ver restaurantes activos
CREATE POLICY "view_active_restaurants" 
ON public.restaurants
FOR SELECT 
USING (
    status = 'active' OR 
    owner_id = auth.uid()
);

-- Política para actualizar restaurante propio
CREATE POLICY "update_own_restaurant" 
ON public.restaurants
FOR UPDATE 
USING (owner_id = auth.uid());

-- Política para insertar restaurante
CREATE POLICY "insert_own_restaurant" 
ON public.restaurants
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

-- ============================================
-- SECCIÓN 9: POLÍTICAS DE SEGURIDAD - PRODUCTS
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "view_available_products" ON public.products;
DROP POLICY IF EXISTS "manage_own_products" ON public.products;

-- Política para ver productos disponibles
CREATE POLICY "view_available_products" 
ON public.products
FOR SELECT 
USING (
    is_available = true OR 
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = products.restaurantid 
        AND restaurants.owner_id = auth.uid()
    )
);

-- Política para gestionar productos propios
CREATE POLICY "manage_own_products" 
ON public.products
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = products.restaurantid 
        AND restaurants.owner_id = auth.uid()
    )
);

-- ============================================
-- SECCIÓN 10: POLÍTICAS DE SEGURIDAD - CATEGORIES
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "manage_own_categories" ON public.categories;

-- Política para gestionar categorías propias
CREATE POLICY "manage_own_categories" 
ON public.categories
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = categories.restaurantid 
        AND restaurants.owner_id = auth.uid()
    )
);

-- ============================================
-- SECCIÓN 11: POLÍTICAS DE SEGURIDAD - PROFILES
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;

-- Política para ver perfil propio
CREATE POLICY "view_own_profile" 
ON public.profiles
FOR SELECT 
USING (id = auth.uid());

-- Política para actualizar perfil propio
CREATE POLICY "update_own_profile" 
ON public.profiles
FOR UPDATE 
USING (id = auth.uid());

-- ============================================
-- SECCIÓN 12: POLÍTICAS DE SEGURIDAD - STATS
-- ============================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "view_own_stats" ON public.restaurant_stats;

-- Política para ver estadísticas propias
CREATE POLICY "view_own_stats" 
ON public.restaurant_stats
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = restaurant_stats.restaurant_id 
        AND restaurants.owner_id = auth.uid()
    )
);

-- ============================================
-- SECCIÓN 13: FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedat = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para restaurants
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_restaurants_updatedat'
    ) THEN
        CREATE TRIGGER update_restaurants_updatedat
        BEFORE UPDATE ON public.restaurants 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Trigger para products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_products_updatedat'
    ) THEN
        CREATE TRIGGER update_products_updatedat
        BEFORE UPDATE ON public.products 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Función para actualizar estadísticas del restaurante
CREATE OR REPLACE FUNCTION update_restaurant_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar o insertar estadísticas
    INSERT INTO public.restaurant_stats (restaurant_id, total_products, updated_at)
    VALUES (NEW.restaurantid, 1, now())
    ON CONFLICT (restaurant_id) 
    DO UPDATE SET 
        total_products = (
            SELECT COUNT(*) 
            FROM public.products 
            WHERE restaurantid = NEW.restaurantid
        ),
        updated_at = now();
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar stats
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_stats_on_product_change'
    ) THEN
        CREATE TRIGGER update_stats_on_product_change
        AFTER INSERT OR DELETE ON public.products
        FOR EACH ROW EXECUTE FUNCTION update_restaurant_stats();
    END IF;
END $$;

-- ============================================
-- SECCIÓN 14: FUNCIÓN PARA DASHBOARD
-- ============================================

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
            WHERE p.restaurantid = p_restaurant_id
            AND p.is_available = true
            ORDER BY p.stars DESC
            LIMIT 5
        )
    ) INTO result;
    
    RETURN result;
END;
$$ language 'plpgsql';

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE public.restaurant_stats IS 'Estadísticas agregadas de cada restaurante';
COMMENT ON TABLE public.restaurant_schedules IS 'Horarios de apertura/cierre por día';
COMMENT ON FUNCTION get_restaurant_dashboard IS 'Obtiene datos del dashboard para un restaurante';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
