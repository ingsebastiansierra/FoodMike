import { useState, useEffect } from 'react';
import restaurantAdminService from '../services/restaurantAdminService';

export const usePendingOrders = () => {
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingOrders();
        // Actualizar cada 30 segundos
        const interval = setInterval(loadPendingOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadPendingOrders = async () => {
        try {
            const response = await restaurantAdminService.getOrders(null);
            const pendingOrders = response.data?.filter(order =>
                order.status === 'pending' || order.status === 'confirmed'
            ) || [];

            setPendingCount(pendingOrders.length);
            setLoading(false);
        } catch (error) {
            console.error('Error loading pending orders:', error);
            setLoading(false);
        }
    };

    return { pendingCount, loading, refresh: loadPendingOrders };
};
