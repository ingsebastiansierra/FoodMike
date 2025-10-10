const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

/**
 * Obtener dashboard del restaurante
 */
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.uid;

        // Obtener el restaurante del usuario
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('restaurant_id, role')
            .eq('id', userId)
            .single();

        if (profileError || !profile.restaurant_id) {
            return res.status(403).json({
                error: 'No tienes un restaurante asignado'
            });
        }

        const restaurantId = profile.restaurant_id;

        // Obtener estadísticas del restaurante
        const { data: stats } = await supabase
            .from('restaurant_stats')
            .select('*')
            .eq('restaurant_id', restaurantId)
            .single();

        // Obtener pedidos recientes
        const { data: recentOrders } = await supabase
            .from('orders')
            .select('id, total, status, created_at')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false })
            .limit(10);

        // Obtener productos más vendidos
        const { data: topProducts } = await supabase
            .from('products')
            .select('id, name, price, image, stars')
            .eq('restaurantid', restaurantId)
            .eq('is_available', true)
            .order('stars', { ascending: false })
            .limit(5);

        // Obtener información del restaurante
        const { data: restaurant } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', restaurantId)
            .single();

        res.json({
            success: true,
            data: {
                restaurant,
                stats: stats || {
                    total_orders: 0,
                    total_revenue: 0,
                    total_products: 0,
                    avg_rating: 0,
                    total_customers: 0
                },
                recentOrders: recentOrders || [],
                topProducts: topProducts || []
            }
        });
    } catch (error) {
        console.error('Error getting dashboard:', error);
        res.status(500).json({ error: 'Error al obtener el dashboard' });
    }
};

/**
 * Obtener todos los productos del restaurante
 */
const getProducts = async (req, res) => {
    try {
        const userId = req.user.uid;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        const { data: products, error } = await supabase
            .from('products')
            .select(`
        *,
        categories (
          id,
          name,
          icon
        )
      `)
            .eq('restaurantid', profile.restaurant_id)
            .order('createdat', { ascending: false });

        if (error) throw error;

        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

/**
 * Crear un nuevo producto
 */
const createProduct = async (req, res) => {
    try {
        const userId = req.user.uid;
        const productData = req.body;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        const { data: product, error } = await supabase
            .from('products')
            .insert([{
                ...productData,
                restaurantid: profile.restaurant_id,
                createdat: new Date().toISOString(),
                updatedat: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

/**
 * Actualizar un producto
 */
const updateProduct = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { id } = req.params;
        const productData = req.body;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        // Verificar que el producto pertenece al restaurante
        const { data: existingProduct } = await supabase
            .from('products')
            .select('restaurantid')
            .eq('id', id)
            .single();

        if (!existingProduct || existingProduct.restaurantid !== profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes permiso para editar este producto' });
        }

        const { data: product, error } = await supabase
            .from('products')
            .update({
                ...productData,
                updatedat: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data: product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

/**
 * Eliminar un producto
 */
const deleteProduct = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { id } = req.params;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        // Verificar que el producto pertenece al restaurante
        const { data: existingProduct } = await supabase
            .from('products')
            .select('restaurantid')
            .eq('id', id)
            .single();

        if (!existingProduct || existingProduct.restaurantid !== profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este producto' });
        }

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true, message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

/**
 * Obtener categorías del restaurante
 */
const getCategories = async (req, res) => {
    try {
        const userId = req.user.uid;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .eq('restaurantid', profile.restaurant_id)
            .order('name');

        if (error) throw error;

        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

/**
 * Crear una nueva categoría
 */
const createCategory = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { name, icon } = req.body;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        const { data: category, error } = await supabase
            .from('categories')
            .insert([{
                name,
                icon,
                restaurantid: profile.restaurant_id,
                createdat: new Date().toISOString(),
                updatedat: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

/**
 * Obtener pedidos del restaurante
 */
const getOrders = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { status } = req.query;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        let query = supabase
            .from('orders')
            .select(`
        *,
        order_items (
          *,
          products (
            name,
            image
          )
        )
      `)
            .eq('restaurant_id', profile.restaurant_id)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data: orders, error } = await query;

        if (error) throw error;

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
};

/**
 * Actualizar estado de un pedido
 */
const updateOrderStatus = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { id } = req.params;
        const { status } = req.body;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        // Verificar que el pedido pertenece al restaurante
        const { data: existingOrder } = await supabase
            .from('orders')
            .select('restaurant_id')
            .eq('id', id)
            .single();

        if (!existingOrder || existingOrder.restaurant_id !== profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes permiso para modificar este pedido' });
        }

        const { data: order, error } = await supabase
            .from('orders')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Error al actualizar estado del pedido' });
    }
};

/**
 * Actualizar información del restaurante
 */
const updateRestaurant = async (req, res) => {
    try {
        const userId = req.user.uid;
        const restaurantData = req.body;

        const { data: profile } = await supabase
            .from('profiles')
            .select('restaurant_id')
            .eq('id', userId)
            .single();

        if (!profile.restaurant_id) {
            return res.status(403).json({ error: 'No tienes un restaurante asignado' });
        }

        const { data: restaurant, error } = await supabase
            .from('restaurants')
            .update({
                ...restaurantData,
                updatedat: new Date().toISOString()
            })
            .eq('id', profile.restaurant_id)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data: restaurant });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ error: 'Error al actualizar restaurante' });
    }
};

module.exports = {
    getDashboard,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    createCategory,
    getOrders,
    updateOrderStatus,
    updateRestaurant
};
