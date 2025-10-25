// Skeleton Components para TOC TOC
export { default as SkeletonBase } from './SkeletonBase';
export { default as SkeletonCard } from './SkeletonCard';
export { default as SkeletonList } from './SkeletonList';
export { default as SkeletonProfile } from './SkeletonProfile';
export { default as SkeletonCart } from './SkeletonCart';
export { default as SkeletonSearch } from './SkeletonSearch';
export { default as SkeletonOrders } from './SkeletonOrders';
export { default as SkeletonOrderDetail } from './SkeletonOrderDetail';

// Skeleton preconfigurados para casos comunes
import React from 'react';
import SkeletonList from './SkeletonList';
import SkeletonCard from './SkeletonCard';

// Skeleton para lista de restaurantes
export const SkeletonRestaurantList = ({ itemCount = 5 }) => (
  <SkeletonList 
    itemCount={itemCount} 
    itemType="restaurant" 
  />
);

// Skeleton para lista de productos
export const SkeletonProductList = ({ itemCount = 6 }) => (
  <SkeletonList 
    itemCount={itemCount} 
    itemType="card" 
  />
);

// Skeleton para lista simple (categorías, etc.)
export const SkeletonSimpleList = ({ itemCount = 8 }) => (
  <SkeletonList 
    itemCount={itemCount} 
    itemType="simple" 
  />
);

// Skeleton para tarjeta de producto individual
export const SkeletonProductCard = () => (
  <SkeletonCard 
    showImage={true}
    showTitle={true}
    showSubtitle={true}
    showPrice={true}
  />
);

// Skeleton para tarjeta de restaurante
export const SkeletonRestaurantCard = () => (
  <SkeletonCard 
    showImage={true}
    showTitle={true}
    showSubtitle={true}
    showPrice={false}
  />
);