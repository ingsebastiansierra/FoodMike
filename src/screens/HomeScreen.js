import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";
import BottomNavBar from "../components/BottomNavBar";
import CarritoComponent from "../components/CarritoComponent";
import ScreenContainer from "../components/ScreenContainer";
import FavoritosComponent from "../components/FavoritosComponent";
import PerfilComponent from "../components/PerfilComponent";
import HomeContentComponent from "../components/HomeContentComponent";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Home");
  const { addToCart, getTotalQuantity, cartItems } = useContext(CartContext);
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (food) => {
    addToCart(food);
    console.log("Adding to cart:", food);
  };

  React.useEffect(() => {
    setCartCount(getTotalQuantity());
  }, [cartItems]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={{ fontSize: 24, color: COLORS.text.primary }}>
            Food Mike
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        {activeTab === "Home" ? <HomeContentComponent onAddToCart={handleAddToCart} /> : null}
        {activeTab === "Favoritos" ? (
          <View style={styles.container}>
            <Text style={styles.title}>Favoritos</Text>
            <FavoritosComponent />
          </View>
        ) : null}
        {activeTab === "Perfil" ? (
          <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>
            <PerfilComponent />
          </View>
        ) : null}
        {activeTab === "Carrito" ? (
          <View style={styles.container}>
            <Text style={styles.title}>Carrito</Text>
            <CarritoComponent />
          </View>
        ) : null}
      </View>

      <BottomNavBar
        navigation={navigation}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        cartCount={cartCount}
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
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
