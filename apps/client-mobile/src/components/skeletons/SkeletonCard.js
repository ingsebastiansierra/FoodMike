import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import SkeletonBase from './SkeletonBase';

const SkeletonCard = ({ 
  showImage = true, 
  showTitle = true, 
  showSubtitle = true, 
  showPrice = true,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      {showImage && (
        <SkeletonBase 
          width="100%" 
          height={180} 
          borderRadius={16} 
          style={styles.image}
        />
      )}
      
      <View style={styles.content}>
        {showTitle && (
          <SkeletonBase 
            width="80%" 
            height={20} 
            borderRadius={4} 
            style={styles.title}
          />
        )}
        
        {showSubtitle && (
          <SkeletonBase 
            width="60%" 
            height={16} 
            borderRadius={4} 
            style={styles.subtitle}
          />
        )}
        
        <View style={styles.footer}>
          {showPrice && (
            <SkeletonBase 
              width={80} 
              height={24} 
              borderRadius={6} 
              style={styles.price}
            />
          )}
          
          <SkeletonBase 
            width={60} 
            height={16} 
            borderRadius={4} 
            style={styles.rating}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    marginBottom: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    marginRight: SPACING.sm,
  },
  rating: {},
});

export default SkeletonCard;