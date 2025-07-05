import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas
import AdminDashboardScreen from '../features/admin/screens/AdminDashboardScreen';

const Stack = createStackNavigator();

const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
  </Stack.Navigator>
);

export default AdminNavigator;
