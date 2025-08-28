import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { SPACING } from "../../../theme/spacing";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { 
  Header, 
  TabNavigator, 
  QuickActions,
  Card,
  BotonEstandar,
  SearchBar,
  SearchFilters,
  ProductCard,
  CartHeaderButton
} from "../../../components";
import { showAlert, showConfirmAlert } from '../../core/utils/alert';
import { resetOnboarding } from '../../core/utils/onboarding';
import CarritoComponent from "../../../components/CarritoComponent";
import FavoritosComponent from "../../../components/FavoritosComponent";
import HomeContentComponent from "../../../components/HomeContentComponent";
import ConfirmarOrdenComponente from "../../../components/ConfirmarOrdenComponente";
import SearchScreen from "./SearchScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { searchService } from '../../../services/searchService';

const ClientHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const handleAddToCart = (food) => {
    addToCart(food);
  };

  return (
    <View style={styles.container}>

      <ScrollView>
        <HomeContentComponent
          user={user}
          onProductPress={handleProductPress}
          onRestaurantPress={handleRestaurantPress}
          onAddToCart={handleAddToCart}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  // Estilos para la ubicación
  locationCard: {
    marginBottom: SPACING.lg,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  locationAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  locationActions: {
    marginTop: SPACING.md,
  },
  locationButton: {
    marginBottom: SPACING.sm,
  },
  // Estilos mejorados para el perfil
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileAvatar: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  // Estadísticas
  statsCard: {
    marginBottom: SPACING.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  // Acciones del perfil
  actionsCard: {
    marginBottom: SPACING.lg,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  actionText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: SPACING.md,
    flex: 1,
  },
  // Botón de cerrar sesión
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF5722',
    marginBottom: SPACING.xl,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
    marginLeft: SPACING.sm,
  },
  // Estilos para SearchContent
  searchContent: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  filtersContainer: {
    marginBottom: SPACING.sm,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: SPACING.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default ClientHomeScreen;
