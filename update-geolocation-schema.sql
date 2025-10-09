-- Script para agregar funcionalidad de geolocalización a la base de datos
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar columna de coordenadas de entrega a la tabla orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_coordinates jsonb;

-- 2. Agregar comentario para documentar la estructura de la columna
COMMENT ON COLUMN public.orders.delivery_coordinates IS 'Coordenadas GPS de entrega en formato JSON: {latitude: number, longitude: number, accuracy: number}';

-- 3. Crear índice para búsquedas por coordenadas (opcional, para futuras funcionalidades)
CREATE INDEX IF NOT EXISTS idx_orders_delivery_coordinates 
ON public.orders USING GIN (delivery_coordinates);

-- 4. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'delivery_coordinates';

-- 5. Ejemplo de consulta para ver pedidos con coordenadas
-- (Descomenta para probar después de crear algunos pedidos)
/*
SELECT 
    id,
    delivery_address,
    delivery_coordinates,
    created_at
FROM public.orders 
WHERE delivery_coordinates IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;
*/

-- 6. Función auxiliar para calcular distancia entre coordenadas (opcional)
-- Útil para futuras funcionalidades como cálculo de tarifas por distancia
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 double precision,
    lon1 double precision,
    lat2 double precision,
    lon2 double precision
) RETURNS double precision AS $$
DECLARE
    R double precision := 6371; -- Radio de la Tierra en km
    dLat double precision;
    dLon double precision;
    a double precision;
    c double precision;
BEGIN
    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);
    
    a := sin(dLat/2) * sin(dLat/2) + 
         cos(radians(lat1)) * cos(radians(lat2)) * 
         sin(dLon/2) * sin(dLon/2);
    
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    RETURN R * c; -- Distancia en kilómetros
END;
$$ LANGUAGE plpgsql;

-- 7. Función para verificar si una ubicación está dentro del área de servicio
CREATE OR REPLACE FUNCTION is_within_service_area(
    user_lat double precision,
    user_lon double precision,
    service_center_lat double precision DEFAULT 5.6667, -- Coordenadas de Samacá (ejemplo)
    service_center_lon double precision DEFAULT -73.4833,
    max_distance_km double precision DEFAULT 10
) RETURNS boolean AS $$
BEGIN
    RETURN calculate_distance(user_lat, user_lon, service_center_lat, service_center_lon) <= max_distance_km;
END;
$$ LANGUAGE plpgsql;

-- 8. Ejemplo de uso de las funciones (descomenta para probar)
/*
-- Calcular distancia entre dos puntos
SELECT calculate_distance(5.6667, -73.4833, 5.6700, -73.4800) as distance_km;

-- Verificar si una ubicación está en área de servicio
SELECT is_within_service_area(5.6700, -73.4800) as in_service_area;
*/

-- 9. Crear vista para pedidos con información de ubicación (opcional)
CREATE OR REPLACE VIEW orders_with_location AS
SELECT 
    o.*,
    (o.delivery_coordinates->>'latitude')::double precision as delivery_lat,
    (o.delivery_coordinates->>'longitude')::double precision as delivery_lon,
    (o.delivery_coordinates->>'accuracy')::double precision as gps_accuracy,
    CASE 
        WHEN o.delivery_coordinates IS NOT NULL THEN 
            calculate_distance(
                (o.delivery_coordinates->>'latitude')::double precision,
                (o.delivery_coordinates->>'longitude')::double precision,
                5.6667, -- Coordenadas del centro de Samacá
                -73.4833
            )
        ELSE NULL
    END as distance_from_center_km
FROM public.orders o;

-- 10. Comentario final
COMMENT ON VIEW orders_with_location IS 'Vista que incluye información de ubicación calculada para los pedidos';

-- ✅ Script completado
-- Ahora puedes usar la funcionalidad de geolocalización en la app