-- =====================================================
-- SCRIPT: Limpiar datos de prueba
-- Descripción: Elimina restaurante y usuario de prueba
-- =====================================================

-- IMPORTANTE: Reemplaza estos valores con los correctos
-- Restaurant ID: 16 (ajusta si es diferente)
-- User email: el email del usuario que quieres borrar

-- 1. Primero, obtener el owner_id del restaurante
DO $$
DECLARE
    v_owner_id UUID;
    v_restaurant_id INTEGER := 16; -- CAMBIA ESTE ID SI ES NECESARIO
BEGIN
    -- Obtener el owner_id
    SELECT owner_id INTO v_owner_id
    FROM public.restaurants
    WHERE id = v_restaurant_id;
    
    IF v_owner_id IS NOT NULL THEN
        RAISE NOTICE 'Owner ID encontrado: %', v_owner_id;
        
        -- 2. Eliminar estadísticas del restaurante
        DELETE FROM public.restaurant_stats
        WHERE restaurant_id = v_restaurant_id;
        RAISE NOTICE 'Estadísticas eliminadas';
        
        -- 3. Eliminar categorías del restaurante
        DELETE FROM public.categories
        WHERE restaurantid = v_restaurant_id;
        RAISE NOTICE 'Categorías eliminadas';
        
        -- 4. Eliminar productos del restaurante
        DELETE FROM public.products
        WHERE restaurantid = v_restaurant_id;
        RAISE NOTICE 'Productos eliminados';
        
        -- 5. Eliminar horarios del restaurante
        DELETE FROM public.restaurant_schedules
        WHERE restaurant_id = v_restaurant_id;
        RAISE NOTICE 'Horarios eliminados';
        
        -- 6. Eliminar shorts del restaurante
        DELETE FROM public.shorts
        WHERE restaurant_id = v_restaurant_id;
        RAISE NOTICE 'Shorts eliminados';
        
        -- 7. Eliminar menús diarios del restaurante
        DELETE FROM public.daily_menus
        WHERE restaurant_id = v_restaurant_id;
        RAISE NOTICE 'Menús diarios eliminados';
        
        -- 8. Actualizar perfil (quitar restaurant_id)
        UPDATE public.profiles
        SET restaurant_id = NULL
        WHERE id = v_owner_id;
        RAISE NOTICE 'Perfil actualizado';
        
        -- 9. Eliminar el restaurante
        DELETE FROM public.restaurants
        WHERE id = v_restaurant_id;
        RAISE NOTICE 'Restaurante eliminado';
        
        -- 10. Eliminar solicitudes del usuario (si existen)
        DELETE FROM public.restaurant_applications
        WHERE owner_id = v_owner_id;
        RAISE NOTICE 'Solicitudes eliminadas';
        
        -- 11. Eliminar el perfil
        DELETE FROM public.profiles
        WHERE id = v_owner_id;
        RAISE NOTICE 'Perfil eliminado';
        
        -- 12. Eliminar el usuario de auth (esto también eliminará el perfil por CASCADE)
        -- NOTA: Esto requiere permisos especiales, puede que necesites hacerlo desde el dashboard
        DELETE FROM auth.users
        WHERE id = v_owner_id;
        RAISE NOTICE 'Usuario eliminado de auth';
        
        RAISE NOTICE '✅ Limpieza completada exitosamente';
    ELSE
        RAISE NOTICE '❌ No se encontró el restaurante con ID %', v_restaurant_id;
    END IF;
END $$;

-- =====================================================
-- ALTERNATIVA: Si el script anterior no funciona para auth.users
-- Ve a Supabase Dashboard > Authentication > Users
-- Y elimina el usuario manualmente desde ahí
-- =====================================================

-- Para verificar que todo se eliminó:
-- SELECT * FROM restaurants WHERE id = 16;
-- SELECT * FROM profiles WHERE restaurant_id = 16;
-- SELECT * FROM restaurant_applications WHERE owner_id = 'UUID_DEL_USUARIO';
