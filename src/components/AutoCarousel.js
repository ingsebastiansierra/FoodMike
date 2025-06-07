import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../theme/typography';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 40; // 20px padding on each side

const AutoCarousel = ({ items }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * ITEM_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, [currentIndex, items.length]);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {items.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.itemContainer}
            onPress={item.onPress}
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.dotsContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
    alignItems: 'center',
  },
  scrollView: {
    marginHorizontal: -20,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: 160,
    marginHorizontal: 20,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: SPACING.lg,
    justifyContent: 'flex-end',
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.h5,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  description: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 24,
    height: 8,
  },
  inactiveDot: {
    backgroundColor: COLORS.background.divider,
  },
});

export default AutoCarousel; 