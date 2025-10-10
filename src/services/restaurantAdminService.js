import { supabase } from '../config/supabase';

// Helper para obtener el restaurant_id del usuario actual
const getCurrentRestaurantId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuario no autenticado');

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('restaurant_id')
        .eq('id', user.id)
        .single();

    if (error || !profile?.restaurant_id) {
        throw new Error('No tienes un restaurante asignado');
    }

    return profile.restaurant_id;
};

const restaurantAdminService = {
    /**
     * Obtener dashboard del restaurante
     */
    getDashboard: async () => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            // Obtener estadísticas
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

            // Obtener productos destacados
            const { data: topProducts } = await supabase
                .from('products')
                .select('id, name, price, image, stars')
                .eq('restaurantid', restaurantId)
                .eq('is_available', true)
                .order('stars', { ascending: false })
                .limit(5);

            // Obtener info del restaurante
            const { data: restaurant } = await supabase
                .from('restaurants')
                .select('*')
                .eq('id', restaurantId)
                .single();

            return {
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
            };
        } catch (error) {
            console.error('Error getting dashboard:', error);
            throw error;
        }
    },

    /**
     * Obtener todos los productos del restaurante
     */
    getProducts: async () => {
        try {
            const restaurantId = await getCurrentRestaurantId();

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
                .eq('restaurantid', restaurantId)
                .order('createdat', { ascending: false });

            if (error) throw error;

            return { success: true, data: products };
        } catch (error) {
            console.error('Error getting products:', error);
            throw error;
        }
    },

    /**
     * Crear un nuevo producto
     */
    createProduct: async (productData) => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            // Limpiar datos: eliminar campos vacíos o inválidos
            const cleanedData = {};
            Object.keys(productData).forEach(key => {
                const value = productData[key];
                // Solo incluir valores que no sean null, undefined o cadenas vacías
                if (value !== null && value !== undefined && value !== '') {
                    cleanedData[key] = value;
                }
            });

            console.log('Cleaned product data:', cleanedData);

            const { data: product, error } = await supabase
                .from('products')
                .insert([{
                    ...cleanedData,
                    restaurantid: restaurantId,
                    createdat: new Date().toISOString(),
                    updatedat: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            return { success: true, data: product };
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    /**
     * Actualizar un producto
     */
    updateProduct: async (productId, productData) => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            // Verificar que el producto pertenece al restaurante
            const { data: existingProduct } = await supabase
                .from('products')
                .select('restaurantid')
                .eq('id', productId)
                .single();

            if (!existingProduct || existingProduct.restaurantid !== restaurantId) {
                throw new Error('No tienes permiso para editar este producto');
            }

            const { data: product, error } = await supabase
                .from('products')
                .update({
                    ...productData,
                    updatedat: new Date().toISOString()
                })
                .eq('id', productId)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data: product };
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    /**
     * Eliminar un producto
     */
    deleteProduct: async (productId) => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            // Verificar que el producto pertenece al restaurante
            const { data: existingProduct } = await supabase
                .from('products')
                .select('restaurantid')
                .eq('id', productId)
                .single();

            if (!existingProduct || existingProduct.restaurantid !== restaurantId) {
                throw new Error('No tienes permiso para eliminar este producto');
            }

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);

            if (error) throw error;

            return { success: true, message: 'Producto eliminado correctamente' };
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    /**
     * Obtener categorías del restaurante
     */
    getCategories: async () => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            const { data: categories, error } = await supabase
                .from('categories')
                .select('*')
                .eq('restaurantid', restaurantId)
                .order('name');

            if (error) throw error;

            return { success: true, data: categories };
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    },

    /**
     * Crear una nueva categoría
     */
    createCategory: async (categoryData) => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            const { data: category, error } = await supabase
                .from('categories')
                .insert([{
                    ...categoryData,
                    restaurantid: restaurantId,
                    createdat: new Date().toISOString(),
                    updatedat: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data: category };
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    /**
     * Obtener pedidos del restaurante
     */
    getOrders: async (status = null) => {
        try {
            const restaurantId = await getCurrentRestaurantId();

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
                .eq('restaurant_id', restaurantId)
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data: orders, error } = await query;

            if (error) throw error;

            return { success: true, data: orders };
        } catch (error) {
            console.error('Error getting orders:', error);
            throw error;
        }
    },

    /**
     * Actualizar estado de un pedido
     */
    updateOrderStatus: async (orderId, status) => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            // Verificar que el pedido pertenece al restaurante
            const { data: existingOrder } = await supabase
                .from('orders')
                .select('restaurant_id')
                .eq('id', orderId)
                .single();

            if (!existingOrder || existingOrder.restaurant_id !== restaurantId) {
                throw new Error('No tienes permiso para modificar este pedido');
            }

            const { data: order, error } = await supabase
                .from('orders')
                .update({
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data: order };
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    /**
     * Actualizar información del restaurante
     */
    updateRestaurant: async (restaurantData) => {
        try {
            const restaurantId = await getCurrentRestaurantId();

            const { data: restaurant, error } = await supabase
                .from('restaurants')
                .update({
                    ...restaurantData,
                    updatedat: new Date().toISOString()
                })
                .eq('id', restaurantId)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data: restaurant };
        } catch (error) {
            console.error('Error updating restaurant:', error);
            throw error;
        }
    },
};

export default restaurantAdminService;
