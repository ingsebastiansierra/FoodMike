import 'react-native-gesture-handler';
import React, { useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, Linking } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme/colors';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    const navigationRef = useRef();

    useEffect(() => {
        // Manejar deep links cuando la app está abierta
        const handleDeepLink = (event) => {
            const url = event.url;
            console.log('🔗 Deep link recibido:', url);

            if (url && url.startsWith('toctoc://')) {
                // Navegar a la pantalla de Pedidos cuando regrese de Wompi
                setTimeout(() => {
                    navigationRef.current?.navigate('Pedidos', { screen: 'OrdersInitial' });
                }, 500);
            }
        };

        // Listener para cuando la app está abierta
        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Verificar si la app se abrió con un deep link
        Linking.getInitialURL().then((url) => {
            if (url && url.startsWith('toctoc://')) {
                console.log('🔗 App abierta con deep link:', url);
                setTimeout(() => {
                    navigationRef.current?.navigate('Pedidos', { screen: 'OrdersInitial' });
                }, 1000);
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <AuthProvider>
                <CartProvider>
                    <NavigationContainer ref={navigationRef}>
                        <StatusBar
                            barStyle="dark-content"
                            backgroundColor={COLORS.background?.primary || COLORS.lightGray}
                        />
                        <AppNavigator />
                    </NavigationContainer>
                </CartProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
