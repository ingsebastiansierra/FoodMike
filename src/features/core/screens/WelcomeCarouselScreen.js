import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { COLORS } from "../../../theme/colors";
import { SPACING } from "../../../theme/spacing";
import { completeOnboarding } from "../utils/onboarding";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");
const imageSize = width * 0.6;

const WelcomeCarouselScreen = ({ navigation, route }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const onComplete = route.params?.onComplete;

  const data = [
    {
      id: "1",
      imageSource: require("../../../assets/Onbornig_1.jpeg"),
      titleText: "¡Bienvenido a Food Mike!",
      subtitleText: "Descubre la mejor experiencia gastronómica en tu ciudad. Ordena, disfruta y repite con la mejor calidad.",
      icon: "cutlery",
      color: "#FF6B00",
      gradient: ["#FF6B00", "#FF8E53"]
    },
    {
      id: "2",
      imageSource: require("../../../assets/Onbornig_2.jpeg"),
      titleText: "Entrega Rápida y Segura",
      subtitleText: "Recibe tus pedidos en tiempo récord con seguimiento en tiempo real. Nuestros repartidores están listos para ti.",
      icon: "truck",
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#7FDBDA"]
    },
    {
      id: "3",
      imageSource: require("../../../assets/Onbornig_3.jpeg"),
      titleText: "Variedad Sin Límites",
      subtitleText: "Desde comida local hasta internacional. Tenemos todo lo que tu paladar desee con los mejores restaurantes.",
      icon: "globe",
      color: "#45B7D1",
      gradient: ["#45B7D1", "#6BC5D8"]
    },
  ];

  const completeOnboardingFlow = async () => {
    try {
      await completeOnboarding();
      // Llamar al callback para actualizar el estado en AppNavigator
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      // En caso de error, también intentar actualizar
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleNext = async () => {
    if (currentIndex < data.length - 1) {
      // Animación de fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        scrollViewRef.current.scrollTo({
          x: (currentIndex + 1) * width,
          animated: true,
        });
        setCurrentIndex(currentIndex + 1);
        
        // Animación de fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      await completeOnboardingFlow();
    }
  };

  const handleSkip = async () => {
    await completeOnboardingFlow();
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {data.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
            {
              transform: [{
                scale: index === currentIndex ? 1.2 : 1
              }]
            }
          ]}
        />
      ))}
    </View>
  );

  const renderSlide = (item, index) => (
    <View key={item.id} style={styles.slideContainer}>
      <LinearGradient 
        colors={item.gradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentContainer}>
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }
            ]}
          >
            <Icon name={item.icon} size={36} color={item.color} />
          </Animated.View>

          <Animated.Image 
            source={item.imageSource} 
            style={[
              styles.image, 
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }]
              }
            ]} 
          />

          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>{item.titleText}</Text>
            <Text style={styles.subtitle}>{item.subtitleText}</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }],
          { useNativeDriver: false }
        )}
        style={{ flex: 1 }}
      >
        {data.map(renderSlide)}
      </ScrollView>

      <View style={styles.bottomContainer}>
        {renderDots()}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Omitir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.nextButton, 
              { 
                backgroundColor: data[currentIndex]?.color || COLORS.primary,
                shadowColor: data[currentIndex]?.color || COLORS.primary,
              }
            ]} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === data.length - 1 ? "Comenzar" : "Siguiente"}
            </Text>
            <Icon 
              name={currentIndex === data.length - 1 ? "check" : "arrow-right"} 
              size={18} 
              color={COLORS.white} 
              style={{ marginLeft: SPACING.sm }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slideContainer: {
    width: width,
    height: height,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl * 2,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    resizeMode: "cover",
    marginBottom: SPACING.xl,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: width * 0.85,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: SPACING.md,
    lineHeight: 38,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: SPACING.md,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomContainer: {
    paddingBottom: SPACING.xl + 20,
    paddingHorizontal: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: SPACING.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
  },
  activeDot: {
    width: 30,
    backgroundColor: COLORS.white,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  skipButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md + 4,
    paddingHorizontal: SPACING.xl + 8,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WelcomeCarouselScreen;
