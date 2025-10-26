-- =====================================================
-- SCRIPT: Sistema de Solicitudes de Restaurantes
-- Descripción: Tabla separada para gestionar solicitudes
--              antes de aprobarlas en la tabla principal
-- =====================================================

-- 1. Crear la tabla de solicitudes
CREATE TABLE IF NOT EXISTS public.restaurant_applications (
    id SERIAL PRIMARY KEY,
    
    -- Datos del solicitante
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Información básica
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    
    -- Ubicación
    address VARCHAR(500) NOT NULL,
    location VARCHAR(255) NOT NULL DEFAULT 'Samacá, Boyacá',
    coordinates JSONB,
    
    -- Configuración del negocio
    cuisine_type VARCHAR(100),
    specialties TEXT[] DEFAULT '{}',
    deliveryfee NUMERIC(10,2) DEFAULT 5000.00,
    minorder NUMERIC(10,2) DEFAULT 15000.00,
    delivery_time VARCHAR(50) DEFAULT '30-45 min',
    schedule JSONB,
    
    -- Imágenes (opcional)
    image TEXT,
    coverimage TEXT,
    
    -- Estado de la solicitud
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    rejection_reason TEXT,
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Referencia al restaurante creado (cuando se aprueba)
    restaurant_id INTEGER REFERENCES public.restaurants(id) ON DELETE SET NULL,
    
    -- Índices para búsquedas rápidas
    CONSTRAINT unique_owner_pending UNIQUE (owner_id, status) 
        DEFERRABLE INITIALLY DEFERRED
);

-- 2. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_applications_owner 
    ON public.restaurant_applications(owner_id);

CREATE INDEX IF NOT EXISTS idx_applications_status 
    ON public.restaurant_applications(status);

CREATE INDEX IF NOT EXISTS idx_applications_created 
    ON public.restaurant_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_restaurant 
    ON public.restaurant_applications(restaurant_id);

-- 3. Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_restaurant_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_restaurant_applications_timestamp
    BEFORE UPDATE ON public.restaurant_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_applications_updated_at();

-- 4. Políticas RLS (Row Level Security)
ALTER TABLE public.restaurant_applications ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver solo sus propias solicitudes
CREATE POLICY "Users can view own applications"
    ON public.restaurant_applications
    FOR SELECT
    USING (auth.uid() = owner_id);

-- Política: Los usuarios pueden crear sus propias solicitudes
CREATE POLICY "Users can create own applications"
    ON public.restaurant_applications
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Política: Los usuarios pueden actualizar sus solicitudes si están pendientes o rechazadas
CREATE POLICY "Users can update own pending/rejected applications"
    ON public.restaurant_applications
    FOR UPDATE
    USING (
        auth.uid() = owner_id 
        AND status IN ('pending', 'rejected')
    )
    WITH CHECK (
        auth.uid() = owner_id 
        AND status IN ('pending', 'rejected')
    );

-- Política: Los admins pueden ver todas las solicitudes
CREATE POLICY "Admins can view all applications"
    ON public.restaurant_applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Política: Los admins pueden actualizar cualquier solicitud
CREATE POLICY "Admins can update all applications"
    ON public.restaurant_applications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 5. Función para aprobar una solicitud y crear el restaurante
CREATE OR REPLACE FUNCTION approve_restaurant_application(
    application_id INTEGER,
    admin_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    app_record RECORD;
    new_restaurant_id INTEGER;
BEGIN
    -- Obtener los datos de la solicitud
    SELECT * INTO app_record
    FROM public.restaurant_applications
    WHERE id = application_id
    AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or not pending';
    END IF;
    
    -- Crear el restaurante en la tabla principal
    INSERT INTO public.restaurants (
        name,
        description,
        phone,
        email,
        address,
        location,
        coordinates,
        cuisine_type,
        specialties,
        deliveryfee,
        minorder,
        delivery_time,
        schedule,
        image,
        coverimage,
        owner_id,
        status,
        isopen,
        stars,
        reviews,
        isfeatured,
        createdat,
        updatedat
    ) VALUES (
        app_record.name,
        app_record.description,
        app_record.phone,
        app_record.email,
        app_record.address,
        app_record.location,
        app_record.coordinates,
        app_record.cuisine_type,
        app_record.specialties,
        app_record.deliveryfee,
        app_record.minorder,
        app_record.delivery_time,
        app_record.schedule,
        app_record.image,
        app_record.coverimage,
        app_record.owner_id,
        'active',
        true,
        0,
        0,
        false,
        NOW(),
        NOW()
    )
    RETURNING id INTO new_restaurant_id;
    
    -- Actualizar la solicitud como aprobada
    UPDATE public.restaurant_applications
    SET 
        status = 'approved',
        restaurant_id = new_restaurant_id,
        reviewed_by = admin_user_id,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = application_id;
    
    -- Actualizar el perfil del usuario con el restaurant_id
    UPDATE public.profiles
    SET restaurant_id = new_restaurant_id
    WHERE id = app_record.owner_id;
    
    RETURN new_restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función para rechazar una solicitud
CREATE OR REPLACE FUNCTION reject_restaurant_application(
    application_id INTEGER,
    admin_user_id UUID,
    reason TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.restaurant_applications
    SET 
        status = 'rejected',
        rejection_reason = reason,
        reviewed_by = admin_user_id,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE id = application_id
    AND status IN ('pending', 'in_review');
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Función para poner una solicitud en revisión
CREATE OR REPLACE FUNCTION review_restaurant_application(
    application_id INTEGER,
    admin_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.restaurant_applications
    SET 
        status = 'in_review',
        reviewed_by = admin_user_id,
        updated_at = NOW()
    WHERE id = application_id
    AND status = 'pending';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Vista para estadísticas de solicitudes
CREATE OR REPLACE VIEW restaurant_applications_stats AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'in_review') as in_review_count,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
    COUNT(*) as total_count,
    MAX(created_at) FILTER (WHERE status = 'pending') as latest_pending_date
FROM public.restaurant_applications;

-- 9. Comentarios en la tabla para documentación
COMMENT ON TABLE public.restaurant_applications IS 
    'Tabla para gestionar solicitudes de nuevos restaurantes antes de aprobarlas';

COMMENT ON COLUMN public.restaurant_applications.status IS 
    'Estado: pending (pendiente), in_review (en revisión), approved (aprobado), rejected (rechazado)';

COMMENT ON COLUMN public.restaurant_applications.rejection_reason IS 
    'Razón por la cual se rechazó la solicitud, visible para el usuario';

COMMENT ON COLUMN public.restaurant_applications.admin_notes IS 
    'Notas internas del admin, no visibles para el usuario';

-- 10. Grants de permisos
GRANT SELECT, INSERT, UPDATE ON public.restaurant_applications TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE restaurant_applications_id_seq TO authenticated;
GRANT SELECT ON restaurant_applications_stats TO authenticated;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Para verificar que todo se creó correctamente:
-- SELECT * FROM restaurant_applications_stats;
