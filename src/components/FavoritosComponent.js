import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { formatCurrency } from '../shared/utils/format';
import { normalizeImageSource } from '../shared/utils/imageUtils';
import LoadingWrapper from './LoadingWrapper';
import { useFavorites } from '../hooks/useFavorites';
import AppHeader from './AppHeader';

const FavoritosComponent = () => {
  const navigation = useNavigation();
  const { favorites, loading, toggleFavorite, refreshFavorites } = useFavorites();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refreshFavorites();
    setRefreshing(false);
  }, [refreshFavorites]);

  const handleProductPress = (item) => {
    const product = item.products;
    if (product) {
      navigation.navigate('ProductDetail', { product: product });
    }
  };

  const handleRemoveFavorite = async (productId) => {
    await toggleFavorite(productId);
  };

  const renderFavoriteItem = ({ item }) => {
    const product = item.products;
    const restaurant = product?.restaurants;

    if (!product) return null;

    return (
      <TouchableOpacity
        style={styles.favoriteCard}
        onPress={() => handleProductPress(item)}
      >
        <Image
          source={normalizeImageSource(product.image)}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.restaurantName}>{restaurant?.name || 'Restaurante'}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.rating}>{product.stars || 0}</Text>
          </View>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item.product_id)}
        >
          <Ionicons name="heart" size={24} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
      <AppHeader
        screenName="FAVORITES"
        navigation={navigation}
      />
      {favorites.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
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
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
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
