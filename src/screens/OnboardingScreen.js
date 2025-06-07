import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import BotonEstandar from "../components/BotonEstandar";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";

const OnboardingScreen = ({
  imageSource,
  titleText,
  subtitleText,
  stepCount,
  currentStep,
  onNextPress,
  onSkipPress,
  nextButtonText = "Siguiente",
  skipButtonText = "Omitir",
}) => {
  const renderPagination = () => {
    const dots = [];
    for (let i = 0; i < stepCount; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.paginationDot, i === currentStep && styles.activeDot]}
        />
      );
    }
    return <View style={styles.paginationContainer}>{dots}</View>;
  };

  return (
    <View style={styles.container}>

      {/* Title and Subtitle */}
      <Text style={styles.title}>{titleText}</Text>
      <Text style={styles.subtitle}>{subtitleText}</Text>

      {/* Pagination */}
      {renderPagination()}

      {/* Buttons */}
      <BotonEstandar
        title={nextButtonText}
        onPress={onNextPress}
        style={{ backgroundColor: '#FF6B00' }}
      />

      <BotonEstandar
        title={skipButtonText}
        onPress={onSkipPress}
        style={{ backgroundColor: '#FF6B00' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.lg,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: SPACING.lg,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text.primary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  paginationContainer: {
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gray,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  skipButtonText: {
    color: COLORS.text.secondary,
    fontSize: 16,
  },
});

export default OnboardingScreen;
