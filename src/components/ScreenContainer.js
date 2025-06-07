import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Platform, StatusBar as RNStatusBar } from 'react-native';
import { COLORS } from '../theme/colors';

const ScreenContainer = ({ children, style }) => {
  const statusBarHeight = Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

  return (
    <View style={[styles.container, style]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background.secondary}
      />
      <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  safeArea: {
    flex: 1,
  },
});

export default ScreenContainer; 