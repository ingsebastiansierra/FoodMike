import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

const TabNavigator = ({ 
  tabs, 
  activeTab, 
  onTabPress, 
  style,
  showBadge = false,
  badgeCount = 0,
  badgeTab = null
}) => {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity 
          key={tab.key}
          style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
          onPress={() => onTabPress(tab.key)}
        >
          <View style={styles.iconContainer}>
            <Icon 
              name={tab.icon} 
              size={24} 
              color={activeTab === tab.key ? COLORS.primary : COLORS.gray} 
            />
            {showBadge && badgeTab === tab.key && badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 60,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingBottom: SPACING.sm,
  },
  tabItem: {
    alignItems: 'center',
    padding: SPACING.xs,
    position: 'relative',
    flex: 1,
  },
  tabItemActive: {
    // Estilos adicionales para el tab activo si es necesario
  },
  iconContainer: {
    position: 'relative',
  },
  tabText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: SPACING.xs,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabNavigator; 