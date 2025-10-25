// Utilidades de navegación
export const navigationUtils = {
  resetToScreen: (navigation, screenName, params = {}) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screenName, params }],
    });
  },

  goBack: (navigation, fallbackScreen) => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (fallbackScreen) {
      navigation.navigate(fallbackScreen);
    }
  },
};
