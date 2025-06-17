import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import BottomNavBar from "../components/BottomNavBar";
import ScreenContainer from "../components/ScreenContainer";
import FavoritosComponent from "../components/FavoritosComponent";
import NotificacionesComponent from "../components/NotificacionesComponent";
import PerfilComponent from "../components/PerfilComponent";
import HomeContentComponent from "../components/HomeContentComponent";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="menu" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="shopping-cart" size={30} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "Home" ? <HomeContentComponent /> : null}
        {activeTab === "Favoritos" ? (
          <View style={styles.container}>
            <Text style={styles.title}>Favoritos</Text>
            <FavoritosComponent />
          </View>
        ) : null}
        {activeTab === "Notificaciones" ? (
          <View style={styles.container}>
            <Text style={styles.title}>Notificaciones</Text>
            <NotificacionesComponent />
          </View>
        ) : null}
        {activeTab === "Perfil" ? (
          <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <PerfilComponent />
          </View>
        ) : null}
      </ScrollView>

      <BottomNavBar
        navigation={navigation}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text.primary,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
