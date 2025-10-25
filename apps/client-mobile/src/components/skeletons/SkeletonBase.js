import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

const SkeletonBase = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
  animationSpeed = 1000,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: animationSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: animationSpeed,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue, animationSpeed]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.0],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E8E8E8',
  },
});

export default SkeletonBase;