import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const CartNavigationHandler = ({ children }) => {
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            const state = navigation.getState();

            // Buscar el carrito en TODAS las pestañas
            let hasCartInAnyTab = false;
            let tabWithCart = null;

            state.routes.forEach((route, index) => {
                if (route.state?.routes) {
                    const hasCart = route.state.routes.some(r => r.name === 'Carrito');
                    if (hasCart) {
                        hasCartInAnyTab = true;
                        tabWithCart = route.name;
                    }
                }
            });

            if (hasCartInAnyTab) {
                // Prevenir navegación por defecto
                e.preventDefault();

                // Obtener la pestaña objetivo
                const targetTabName = e.target?.split('-')[0];

                // Resetear TODAS las pestañas sin carrito
                const newRoutes = state.routes.map(route => {
                    let initialScreen = 'HomeInitial';
                    switch (route.name) {
                        case 'Inicio': initialScreen = 'HomeInitial'; break;
                        case 'Buscar': initialScreen = 'SearchInitial'; break;
                        case 'Pedidos': initialScreen = 'OrdersInitial'; break;
                        case 'Favoritos': initialScreen = 'FavoritesInitial'; break;
                        case 'Perfil': initialScreen = 'ProfileInitial'; break;
                    }

                    return {
                        ...route,
                        state: {
                            routes: [{ name: initialScreen }],
                            index: 0,
                        },
                    };
                });

                // Encontrar el índice de la pestaña objetivo
                const targetIndex = newRoutes.findIndex(r => r.name === targetTabName);

                // Resetear con todas las pestañas limpias
                navigation.reset({
                    index: targetIndex >= 0 ? targetIndex : state.index,
                    routes: newRoutes,
                });

                console.log('✅ Reset completado');
            }
        });

        return unsubscribe;
    }, [navigation]);

    return children;
};

export default CartNavigationHandler;