import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native"; // <-- agregamos ImageBackground
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const imageSize = width * 0.6;

const WelcomeCarouselScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef();

  const data = [
    {
      id: "1",
      imageSource: require("../assets/Onbornig_1.jpeg"),
      titleText: "¡Bienvenido a Food Mike!",
      subtitleText:
        "Encuentra tus comidas favoritas en un solo lugar. ¡Pide y nosotros nos encargamos del resto!",
    },
    {
      id: "2",
      imageSource: require("../assets/Onbornig_2.jpeg"),
      titleText: "Antojos al instante",
      subtitleText:
        "¿Se te antoja algo delicioso? ¡Lo tenemos! Pide ahora y recíbelo en minutos.",
    },
    {
      id: "3",
      imageSource: require("../assets/Onbornig_3.jpeg"),
      titleText: "La mejor variedad",
      subtitleText:
        "Desde sushi hasta hamburguesas, ¡encuentra todo lo que buscas en un solo lugar!",
    },
  ];

  const handleNext = async () => {
    if (currentIndex < data.length - 1) {
      scrollViewRef.current.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      try {
        await AsyncStorage.setItem("onboardingCompleted", "true");
      } catch (e) {
        // saving error
      }
      navigation.navigate("LoginRegister");
    }
  };

  const handleSkip = () => {
    navigation.navigate("LoginRegister");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
        contentContainerStyle={{ width: width * data.length }}
        style={{ flexGrow: 1 }}
      >
        {data.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.cardContainer}>
              <Image source={item.imageSource} style={styles.image} />
              <Text style={styles.title}>{item.titleText}</Text>
              <Text style={styles.subtitle}>{item.subtitleText}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSkip}>
          <Text style={styles.buttonText}>Omitir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === data.length - 1 ? "Comenzar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: COLORS.white,
  },
  itemContainer: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: 15,
    marginHorizontal: SPACING.md,
    elevation: 4,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    resizeMode: "cover",
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: SPACING.md,
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
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: SPACING.lg,
    backgroundColor: "transparent", // ✅ quitamos fondo blanco
  },
  button: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WelcomeCarouselScreen;
