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
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
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
} from "../components";
import { showAlert, showConfirmAlert, resetOnboarding } from "../utils";
import CarritoComponent from "../components/CarritoComponent";
import FavoritosComponent from "../components/FavoritosComponent";
import HomeContentComponent from "../components/HomeContentComponent";
import ConfirmarOrdenComponente from "../components/ConfirmarOrdenComponente";
import SearchScreen from "./SearchScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { searchService } from '../services/searchService';

// Componente SearchContent que funciona sin navegación propia
const SearchContent = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: undefined,
    maxPrice: undefined,
    minStars: undefined,
  });
  const { addToCart, getTotalQuantity } = useCart();

  // Cargar productos destacados al inicio
  React.useEffect(() => {
    loadTopProducts();
  }, []);

  // Función para cargar los mejores productos por calidad y precio
  const loadTopProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchService.getFeaturedProducts(12);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error cargando productos:', error);
      showAlert('Error', 'No se pudieron cargar los productos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para realizar búsqueda con filtros
  const performSearch = React.useCallback(async (term = searchTerm, currentFilters = filters) => {
    if (!term.trim() && currentFilters.category === 'all' && 
        !currentFilters.minPrice && !currentFilters.maxPrice && !currentFilters.minStars) {
      // Si no hay búsqueda ni filtros, mostrar productos destacados
      loadTopProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await searchService.advancedSearch(term, currentFilters);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      showAlert('Error', 'No se pudo realizar la búsqueda. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, loadTopProducts]);

  // Función para búsqueda manual (botón buscar)
  const handleManualSearch = () => {
    if (searchTerm.trim()) {
      performSearch();
    } else {
      showAlert('Búsqueda', 'Escribe algo para buscar');
    }
  };

  // Función para refrescar
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (searchTerm.trim()) {
      await performSearch();
    } else {
      await loadTopProducts();
    }
    setRefreshing(false);
  }, [performSearch, loadTopProducts, searchTerm]);

  // Función para manejar filtros
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    performSearch(searchTerm, newFilters);
  };

  // Función para agregar al carrito
  const handleAddToCart = (product) => {
    if (!product.restaurant) {
      showAlert('Error', 'Este producto no tiene restaurante asociado.');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      restaurantId: product.restaurant.id,
      restaurantName: product.restaurant.name,
    });
    showAlert('Éxito', `${product.name} agregado al carrito`);
  };

  // Función para navegar al carrito
  const handleCartPress = () => {
    if (getTotalQuantity() > 0) {
      navigation.navigate('Carrito');
    } else {
      showAlert('Carrito', 'Tu carrito está vacío. Agrega algunos productos primero.');
    }
  };

  // Función para navegar al restaurante
  const handleProductPress = (product) => {
    if (product.restaurant && product.restaurant.id) {
      navigation.navigate('RestaurantDetail', {
        restaurantId: product.restaurant.id,
        productId: product.id,
      });
    } else {
      showAlert('Error', 'Este producto no tiene restaurante asociado.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Contenido de búsqueda */}
      <View style={styles.searchContent}>
        {/* Barra de búsqueda */}
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSearch={handleManualSearch}
            onSubmitEditing={handleManualSearch}
            placeholder="Buscar productos, restaurantes..."
            showFilterButton={true}
            onFilterPress={() => setShowFilters(!showFilters)}
          />
        </View>

        {/* Filtros */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onApplyFilters={handleApplyFilters}
            />
          </View>
        )}

        {/* Resultados */}
        <ScrollView 
          style={styles.resultsContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.resultsCount}>
            {loading ? 'Buscando...' : 
             searchTerm.trim() ? `${searchResults.length} resultados encontrados` : 
             'Los mejores productos por calidad y precio'}
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Buscando productos...</Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {searchResults.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleProductPress(product)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const ClientHomeScreen = ({ navigation: propNavigation }) => {
  const { user, logoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Home");
  const { addToCart, getTotalQuantity, cartItems } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const [showConfirmarOrden, setShowConfirmarOrden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleAddToCart = (food) => {
    addToCart(food);
    console.log("Adding to cart:", food);
  };

  React.useEffect(() => {
    setCartCount(getTotalQuantity());
  }, [cartItems]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí podrías recargar datos
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    showConfirmAlert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      logoutUser
    );
  };

  // Nuevas pestañas sin carrito (queda solo en el header)
  const tabs = [
    { key: "Home", label: "Inicio", icon: "home" },
    { key: "Search", label: "Buscar", icon: "search" },
    { key: "Favoritos", label: "Favoritos", icon: "heart" },
    { key: "Ubicacion", label: "Ubicación", icon: "map-marker" },
    { key: "Perfil", label: "Perfil", icon: "user" },
  ];

  const quickActions = [];

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <ScrollView 
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <HomeContentComponent onAddToCart={handleAddToCart} />
          </ScrollView>
        );
      
      case "Search":
        return (
          <View style={styles.content}>
            <SearchContent navigation={navigation} />
          </View>
        );
      
      case "Favoritos":
        return (
          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Mis Favoritos</Text>
            <FavoritosComponent />
          </ScrollView>
        );
      
      case "Ubicacion":
        return (
          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Mi Ubicación</Text>
            <Card style={styles.locationCard} elevation={2}>
              <View style={styles.locationHeader}>
                <Icon name="map-marker" size={40} color={COLORS.primary} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationTitle}>Ubicación Actual</Text>
                  <Text style={styles.locationAddress}>Ciudad de México, México</Text>
                </View>
              </View>
              
              <View style={styles.locationActions}>
                <BotonEstandar
                  title="Cambiar Ubicación"
                  onPress={() => showAlert('Funcionalidad', 'Cambiar ubicación próximamente')}
                  style={styles.locationButton}
                />
                <BotonEstandar
                  title="Restaurantes Cercanos"
                  onPress={() => showAlert('Funcionalidad', 'Ver restaurantes cercanos próximamente')}
                  style={styles.locationButton}
                />
              </View>
            </Card>
          </ScrollView>
        );
      
      case "Perfil":
        return (
          <ScrollView style={styles.content}>
            {/* Tarjeta de perfil principal */}
            <Card style={styles.profileCard} elevation={2}>
              <View style={styles.profileHeader}>
                <View style={styles.profileAvatar}>
                  <Icon name="user-circle" size={80} color={COLORS.primary} />
                  <TouchableOpacity style={styles.editAvatarButton}>
                    <Icon name="camera" size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user?.name || 'Sin nombre'}</Text>
                  <Text style={styles.profileEmail}>{user?.email}</Text>
                  <View style={styles.roleBadge}>
                    <Icon name="star" size={12} color={COLORS.white} />
                    <Text style={styles.roleText}>Cliente Premium</Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* Estadísticas del usuario */}
            <Card style={styles.statsCard} elevation={2}>
              <Text style={styles.statsTitle}>Mis Estadísticas</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Icon name="shopping-cart" size={24} color="#4CAF50" />
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Pedidos</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="star" size={24} color="#FFD700" />
                  <Text style={styles.statNumber}>150</Text>
                  <Text style={styles.statLabel}>Puntos</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="heart" size={24} color="#E91E63" />
                  <Text style={styles.statNumber}>8</Text>
                  <Text style={styles.statLabel}>Favoritos</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="trophy" size={24} color="#FF9800" />
                  <Text style={styles.statNumber}>3</Text>
                  <Text style={styles.statLabel}>Logros</Text>
                </View>
              </View>
            </Card>

            {/* Acciones del perfil */}
            <Card style={styles.actionsCard} elevation={2}>
              <Text style={styles.actionsTitle}>Mi Cuenta</Text>
              
              <TouchableOpacity style={styles.actionItem}>
                <Icon name="user" size={20} color={COLORS.primary} />
                <Text style={styles.actionText}>Editar Perfil</Text>
                <Icon name="chevron-right" size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Icon name="history" size={20} color={COLORS.primary} />
                <Text style={styles.actionText}>Historial de Pedidos</Text>
                <Icon name="chevron-right" size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Icon name="map-marker" size={20} color={COLORS.primary} />
                <Text style={styles.actionText}>Mis Direcciones</Text>
                <Icon name="chevron-right" size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Icon name="credit-card" size={20} color={COLORS.primary} />
                <Text style={styles.actionText}>Métodos de Pago</Text>
                <Icon name="chevron-right" size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Icon name="bell" size={20} color={COLORS.primary} />
                <Text style={styles.actionText}>Notificaciones</Text>
                <Icon name="chevron-right" size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Icon name="cog" size={20} color={COLORS.primary} />
                <Text style={styles.actionText}>Configuración</Text>
                <Icon name="chevron-right" size={16} color={COLORS.gray} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <Icon name="question-circle" size={20} color={COLORS.primary} />
                <Text style={styles.actionText}>Ayuda y Soporte</Text>
                <Icon name="chevron-right" size={16} color={COLORS.gray} />
              </TouchableOpacity>
            </Card>

            {/* Botón de cerrar sesión */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Icon name="sign-out" size={20} color="#FF5722" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            {/* Botón temporal para resetear onboarding */}
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: '#E3F2FD', borderColor: '#2196F3' }]} 
              onPress={() => {
                showConfirmAlert(
                  'Resetear Onboarding',
                  '¿Estás seguro de que quieres resetear el onboarding? Esto te permitirá ver las pantallas de bienvenida nuevamente.',
                  () => resetOnboarding(),
                  () => {}
                );
              }}
            >
              <Icon name="refresh" size={20} color="#2196F3" />
              <Text style={[styles.logoutText, { color: '#2196F3' }]}>Resetear Onboarding</Text>
            </TouchableOpacity>
          </ScrollView>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="FoodMike"
        subtitle={`¡Hola, ${user?.name || 'Cliente'}!`}
        onLogout={handleLogout}
        onCartPress={() => navigation.navigate('Carrito')}
        cartCount={cartCount}
        showCart={true}
        gradientColors={[COLORS.primary, COLORS.primary + 'DD']}
      />
      
      {renderContent()}
      
      <TabNavigator
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        showBadge={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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