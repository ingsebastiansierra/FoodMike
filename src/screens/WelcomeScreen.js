import React from 'react';
import {
  SafeAreaView,
  ImageBackground,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { FONT_SIZES, FONT_WEIGHTS } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

const WelcomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/PF88chspAB/6jeq80j6_expires_30_days.png"}} 
        resizeMode="stretch"
        style={styles.backgroundImage}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.statusBar}>
            <Text style={styles.timeText}>{"9:41"}</Text>
            <View style={styles.flex} />
            <Image
              source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/PF88chspAB/ku7ad024_expires_30_days.png"}}
              resizeMode="stretch"
              style={styles.signalIcon}
            />
            <Image
              source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/PF88chspAB/bapkjr8x_expires_30_days.png"}}
              resizeMode="stretch"
              style={styles.wifiIcon}
            />
            <Image
              source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/PF88chspAB/soa4q2lv_expires_30_days.png"}}
              resizeMode="stretch"
              style={styles.batteryIcon}
            />
          </View>

          <View style={styles.contentCard}>
            <Text style={styles.title}>{"Bienvenido a Food Mike"}</Text>
            <Text style={styles.subtitle}>
              {"Aqui te ofrecemos todas las delicias de nuestra querida samacá, espero que disfrutes de toda nuestra gastronomía local."}
            </Text>

            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={[styles.dot, styles.inactiveDot]} />
              <View style={[styles.dot, styles.inactiveDot]} />
            </View>

            <View style={styles.navigationButtons}>
              <Text style={styles.skipButton}>{"Skip"}</Text>
              <View style={styles.nextContainer}>
                <Text style={styles.nextText}>{"Next"}</Text>
                <Image
                  source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/PF88chspAB/z08dbixb_expires_30_days.png"}}
                  resizeMode="stretch"
                  style={styles.nextIcon}
                />
              </View>
            </View>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.bottomIndicator} />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backgroundImage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 21,
    marginBottom: 328,
  },
  timeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: 2,
  },
  flex: {
    flex: 1,
  },
  signalIcon: {
    width: 17,
    height: 10,
    marginRight: 5,
  },
  wifiIcon: {
    width: 15,
    height: 10,
    marginRight: 5,
  },
  batteryIcon: {
    width: 24,
    height: 11,
  },
  contentCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.xxl,
    marginBottom: 4,
    marginHorizontal: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.xl,
  },
  dotsContainer: {
    alignItems: 'center',
    marginBottom: 98,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 24,
    height: 6,
    borderRadius: BORDER_RADIUS.full,
    marginRight: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
  },
  inactiveDot: {
    backgroundColor: COLORS.gray,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
  },
  skipButton: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
    flex: 1,
  },
  nextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginRight: 10,
  },
  nextIcon: {
    width: 20,
    height: 20,
  },
  bottomBar: {
    alignItems: 'center',
    paddingTop: 23,
    paddingBottom: SPACING.sm,
  },
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
  },
});

export default WelcomeScreen; 