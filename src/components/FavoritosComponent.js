import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { formatCurrency } from '../shared/utils/format';
import LoadingWrapper from './LoadingWrapper';

const FavoritosComponent = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de favoritos
    setTimeout(() => {
      setFavorites([
        // Datos de ejemplo - en una app real vendrían de una API
        {
          id: 1,
          name: 'Pizza Margherita',
          restaurant: 'Pizzería Italiana',
          price: 25000,
          image: 'https://via.placeholder.com/150',
          rating: 4.5
        },
        {
          id: 2,
          name: 'Hamburguesa Clásica',
          restaurant: 'Burger House',
          price: 18000,
          image: 'https://via.placeholder.com/150',
          rating: 4.2
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleRemoveFavorite = (productId) => {
    setFavorites(favorites.filter(item => item.id !== productId));
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.restaurantName}>{item.restaurant}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="heart" size={24} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={colors.gray} />
      <Text style={styles.emptyTitle}>No tienes favoritos</Text>
      <Text style={styles.emptySubtitle}>
        Agrega productos a tus favoritos para verlos aquí
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Inicio')}
      >
        <Text style={styles.exploreButtonText}>Explorar Productos</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <LoadingWrapper
        isLoading={loading}
        skeletonType="favorites"
        skeletonCount={5}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Favoritos</Text>
        <Text style={styles.subtitle}>
          {favorites.length} producto{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  listContainer: {
    padding: spacing.lg,
  },
  favoriteCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  restaurantName: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  rating: {
    fontSize: typography.sizes.sm,
    color: colors.gray,
    marginLeft: spacing.xs,
  },
  price: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  removeButton: {
    padding: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  },
});

export default FavoritosComponent;
