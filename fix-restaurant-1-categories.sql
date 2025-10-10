-- ============================================
-- SCRIPT PARA CORREGIR CATEGORÍAS DEL RESTAURANTE 1
-- ============================================

-- PASO 1: Crear las categorías faltantes para el restaurante 1
INSERT INTO public.categories (name, icon, restaurantid, createdat, updatedat)
VALUES 
    ('Hamburguesas', '🍔', 1, now(), now()),
    ('Papas Fritas', '🍟', 1, now(), now())
ON CONFLICT DO NOTHING;

-- PASO 2: Obtener los IDs de las nuevas categorías
-- (Ejecuta esto para ver los IDs que se crearon)
SELECT id, name, icon, restaurantid 
FROM public.categories 
WHERE restaurantid = 1 
ORDER BY id;

-- PASO 3: Actualizar los productos para usar las categorías correctas
-- IMPORTANTE: Reemplaza los números después de SET categoryid = con los IDs correctos
-- que obtuviste en el PASO 2

-- Actualizar productos de Hamburguesas (actualmente usan categoryid = 3)
-- Reemplaza el número X con el ID de la categoría "Hamburguesas" del restaurante 1
UPDATE public.products 
SET categoryid = (
    SELECT id FROM public.categories 
    WHERE name = 'Hamburguesas' AND restaurantid = 1 
    LIMIT 1
)
WHERE restaurantid = 1 AND categoryid = 3;

-- Actualizar productos de Papas Fritas (actualmente usan categoryid = 4)
-- Reemplaza el número Y con el ID de la categoría "Papas Fritas" del restaurante 1
UPDATE public.products 
SET categoryid = (
    SELECT id FROM public.categories 
    WHERE name = 'Papas Fritas' AND restaurantid = 1 
    LIMIT 1
)
WHERE restaurantid = 1 AND categoryid = 4;

-- PASO 4: Verificar que todo quedó correcto
SELECT 
    p.id,
    p.name as producto,
    p.restaurantid as restaurant_producto,
    c.name as categoria,
    c.restaurantid as restaurant_categoria
FROM public.products p
LEFT JOIN public.categories c ON p.categoryid = c.id
WHERE p.restaurantid = 1
ORDER BY c.name, p.name;
