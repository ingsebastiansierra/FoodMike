import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas
import LoginRegisterScreen from '../features/auth/screens/LoginRegisterScreen';
import ForgotPasswordScreen from '../features/auth/screens/ForgotPasswordScreen';
import VerifyCodeScreen from '../features/auth/screens/VerifyCodeScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LoginRegister" component={LoginRegisterScreen} options={{ gestureEnabled: false }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
