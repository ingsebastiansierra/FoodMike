import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  SkeletonList, 
  SkeletonCard, 
  SkeletonProfile, 
  SkeletonCart,
  SkeletonSearch,
  SkeletonOrders,
  SkeletonOrderDetail,
  SkeletonProductList,
  SkeletonRestaurantList 
} from './skeletons';

/**
 * Componente wrapper que muestra skeleton durante la carga
 * @param {boolean} isLoading - Estado de carga
 * @param {string} skeletonType - Tipo de skeleton a mostrar
 * @param {number} skeletonCount - Cantidad de elementos skeleton
 * @param {React.ReactNode} children - Contenido a mostrar cuando no está cargando
 * @param {object} style - Estilos adicionales
 */
const LoadingWrapper = ({
  isLoading,
  skeletonType = 'card',
  skeletonCount = 5,
  children,
  style,
  ...props
}) => {
  if (!isLoading) {
    return children;
  }

  const renderSkeleton = () => {
    switch (skeletonType) {
      case 'list':
        return <SkeletonList itemCount={skeletonCount} />;
      
      case 'card':
        return <SkeletonCard />;
      
      case 'profile':
        return <SkeletonProfile />;
      
      case 'cart':
        return <SkeletonCart itemCount={skeletonCount} />;
      
      case 'products':
        return <SkeletonProductList itemCount={skeletonCount} />;
      
      case 'restaurants':
        return <SkeletonRestaurantList itemCount={skeletonCount} />;
      
      case 'simple':
        return <SkeletonList itemCount={skeletonCount} itemType="simple" />;
      
      case 'search':
        return <SkeletonSearch />;
      
      case 'orders':
        return <SkeletonOrders itemCount={skeletonCount} />;
      
      case 'orderDetail':
        return <SkeletonOrderDetail />;
      
      default:
        return <SkeletonList itemCount={skeletonCount} />;
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      {renderSkeleton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoadingWrapper;