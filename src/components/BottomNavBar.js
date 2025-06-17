import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';

const NavItem = ({ iconName, title, isActive, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Icon
      name={iconName}
      size={24}
      color={isActive ? COLORS.accent : COLORS.text.secondary}
    />
    <Text style={[
      styles.navText,
      isActive && styles.navTextActive
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const BottomNavBar = ({ navigation, activeTab, onTabPress }) => (
  <View style={styles.container}>
    <NavItem
      iconName="home"
      title="Inicio"
      isActive={activeTab === 'Home'}
      onPress={() => {
        onTabPress('Home');
      }}
    />
    <NavItem
      iconName="favorite-border"
      title="Favoritos"
      isActive={activeTab === 'Favoritos'}
      onPress={() => {
        onTabPress('Favoritos');
      }}
    />
    <NavItem
      iconName="notifications-none"
      title="Notificaciones"
      isActive={activeTab === 'Notificaciones'}
      onPress={() => {
        onTabPress('Notificaciones');
      }}
    />
    <NavItem
      iconName="person-outline"
      title="Perfil"
      isActive={activeTab === 'Perfil'}
      onPress={() => {
        onTabPress('Perfil');
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 54,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navItem: {
    alignItems: 'center',
    padding: 6,
  },
  navText: {
    fontSize: 10,
    marginTop: 2,
    color: COLORS.text.secondary,
  },
  navTextActive: {
    color: COLORS.accent,
    fontWeight: '500',
  },
});

export default BottomNavBar;
