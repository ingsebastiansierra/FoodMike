-- ============================================
-- CORREGIR POLÍTICAS RLS PARA RESTAURANT_STATS
-- ============================================

-- Eliminar política existente si existe
DROP POLICY IF EXISTS "manage_own_stats" ON public.restaurant_stats;

-- Crear política para permitir INSERT y UPDATE en estadísticas propias
CREATE POLICY "manage_own_stats" 
ON public.restaurant_stats
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = restaurant_stats.restaurant_id 
        AND restaurants.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.restaurants 
        WHERE restaurants.id = restaurant_stats.restaurant_id 
        AND restaurants.owner_id = auth.uid()
    )
);

-- Verificar que las políticas están correctas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'restaurant_stats';
