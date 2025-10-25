import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas
import SplashScreen from '../screens/splash/SplashScreen';
import WelcomeCarouselScreen from '../features/core/screens/WelcomeCarouselScreen';

const Stack = createStackNavigator();

const OnboardingNavigator = ({ onComplete }) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen 
      name="WelcomeCarousel" 
      component={WelcomeCarouselScreen}
      initialParams={{ onComplete }}
    />
  </Stack.Navigator>
);

export default OnboardingNavigator;
