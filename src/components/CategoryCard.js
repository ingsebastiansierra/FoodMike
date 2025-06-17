import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/MaterialIcons";

const CategoryCard = ({ icon, title, isActive, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View
      style={[styles.iconContainer, isActive && styles.activeIconContainer]}
    >
      {icon.name ? (
        <Icon name={icon.name} size={47} color={COLORS.text.primary} />
      ) : (
        <Image source={icon} style={styles.icon} />
      )}
    </View>
    <Text style={[styles.title, isActive && styles.activeTitle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    marginRight: 17,
  },
  iconContainer: {
    width: 77,
    height: 77,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeIconContainer: {
    backgroundColor: COLORS.accent,
  },
  icon: {
    width: 47,
    height: 47,
  },
  title: {
    marginTop: 10,
    color: COLORS.text.secondary,
    fontSize: 16,
  },
  activeTitle: {
    color: COLORS.text.primary,
  },
});

export default CategoryCard;
