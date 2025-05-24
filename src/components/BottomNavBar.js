import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/colors';

const NavItem = ({ iconName, isActive, onPress }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress}>
    <Icon 
      name={iconName} 
      size={24} 
      color={isActive ? COLORS.accent : COLORS.text.secondary} 
    />
  </TouchableOpacity>
);

const BottomNavBar = ({ activeTab, onTabPress }) => (
  <View style={styles.container}>
    <NavItem 
      iconName="home" 
      isActive={activeTab === 'home'} 
      onPress={() => onTabPress('home')} 
    />
    <NavItem 
      iconName="favorite-border" 
      isActive={activeTab === 'favorites'} 
      onPress={() => onTabPress('favorites')} 
    />
    <NavItem 
      iconName="notifications-none" 
      isActive={activeTab === 'notifications'} 
      onPress={() => onTabPress('notifications')} 
    />
    <NavItem 
      iconName="person-outline" 
      isActive={activeTab === 'profile'} 
      onPress={() => onTabPress('profile')} 
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 94,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
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
    padding: 10,
  },
});

export default BottomNavBar; 