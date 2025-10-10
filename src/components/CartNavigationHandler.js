import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const CartNavigationHandler = ({ children }) => {
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            // Obtener el estado actual
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];

            // Verificar si hay un carrito abierto en cualquier stack
            if (currentRoute?.state?.routes) {
                const hasCart = currentRoute.state.routes.some(route => route.name === 'Carrito');

                if (hasCart) {
                    // Prevenir la navegación por defecto
                    e.preventDefault();

                    // Obtener el nombre de la pestaña objetivo
                    const targetTabName = e.target?.split('-')[0] || currentRoute.name;

                    // Determinar la pantalla inicial de la pestaña
                    let initialScreen = 'HomeInitial';
                    switch (targetTabName) {
                        case 'Inicio': initialScreen = 'HomeInitial'; break;
                        case 'Buscar': initialScreen = 'SearchInitial'; break;
                        case 'Pedidos': initialScreen = 'OrdersInitial'; break;
                        case 'Favoritos': initialScreen = 'FavoritesInitial'; break;
                        case 'Perfil': initialScreen = 'ProfileInitial'; break;
                    }

                    // Resetear completamente la navegación a la pestaña deseada
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: targetTabName,
                                state: {
                                    routes: [{ name: initialScreen }],
                                    index: 0,
                                },
                            },
                        ],
                    });
                }
            }
        });

        return unsubscribe;
    }, [navigation]);

    return children;
};

export default CartNavigationHandler;