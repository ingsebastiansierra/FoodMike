import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../screens/HomeScreen";
import WelcomeCarouselScreen from "../screens/WelcomeCarouselScreen";
import LoginRegisterScreen from "../screens/LoginRegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import LocationScreen from "../screens/LocationScreen";
import SplashScreen from "../screens/splash/SplashScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("onboardingCompleted");
        if (value !== null) {
          setIsOnboardingCompleted(true);
        }
      } catch (e) {
        // error reading value
      }
    };

    checkOnboardingStatus();
  }, []);

  const initialRouteName = isOnboardingCompleted ? "LoginRegister" : "Splash";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="WelcomeCarousel" component={WelcomeCarouselScreen} />
        <Stack.Screen
          name="LoginRegister"
          component={LoginRegisterScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
