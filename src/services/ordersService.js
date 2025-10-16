import { supabase, handleError } from '../config/supabase';

// Servicio para gestión de pedidos
const ordersService = {
  // Crear un nuevo pedido
  createOrder: async (orderData) => {
    try {
      const orderInsert = {
        user_id: orderData.userId,
        restaurant_id: orderData.restaurantId,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        total: orderData.total,
        delivery_address: orderData.deliveryAddress,
        delivery_coordinates: orderData.deliveryCoordinates,
        payment_method: orderData.paymentMethod,
        notes: orderData.notes,
        estimated_delivery_time: orderData.estimatedDeliveryTime,
        payment_status: orderData.paymentMethod === 'wompi' ? 'pending' : 'pending'
      };

      // Si es pago con Wompi, agregar la referencia
      if (orderData.wompiReference) {
        orderInsert.wompi_reference = orderData.wompiReference;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (orderError) throw orderError;

      // Crear los items del pedido
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
          extras: item.extras,
          notes: item.notes
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      return { data: order };
    } catch (error) {
      handleError(error, 'createOrder');
    }
  },

  // Obtener pedidos del usuario
  getUserOrders: async (userId, limit = 50) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            image,
            address
          ),
          order_items (
            *,
            products (
              id,
              name,
              image,
              price
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getUserOrders');
    }
  },

  // Obtener pedido por ID
  getOrderById: async (orderId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            image,
            address,
            phone
          ),
          order_items (
            *,
            products (
              id,
              name,
              image,
              price,
              description
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getOrderById');
    }
  },

  // Actualizar pedido (genérico)
  updateOrder: async (orderId, updates) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'updateOrder');
    }
  },

  // Actualizar estado del pedido
  updateOrderStatus: async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'updateOrderStatus');
    }
  },

  // Cancelar pedido
  cancelOrder: async (orderId, reason = '') => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'cancelOrder');
    }
  },

  // Obtener estadísticas de pedidos del usuario
  getUserOrderStats: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total, created_at')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalOrders: data.length,
        totalSpent: data.reduce((sum, order) => sum + parseFloat(order.total), 0),
        pendingOrders: data.filter(order => order.status === 'pending').length,
        completedOrders: data.filter(order => order.status === 'delivered').length,
        cancelledOrders: data.filter(order => order.status === 'cancelled').length
      };

      return { data: stats };
    } catch (error) {
      handleError(error, 'getUserOrderStats');
    }
  },

  // Para administradores: obtener todos los pedidos
  getAllOrders: async (filters = {}) => {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            image
          ),
          profiles (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.restaurantId) {
        query = query.eq('restaurant_id', filters.restaurantId);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data };
    } catch (error) {
      handleError(error, 'getAllOrders');
    }
  }
};

export default ordersService;