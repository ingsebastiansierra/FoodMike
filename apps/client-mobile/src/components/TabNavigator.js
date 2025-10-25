import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

const { width } = Dimensions.get('window');

const TabNavigator = ({ 
  tabs, 
  activeTab, 
  onTabPress, 
  style,
  showBadge = false,
  badgeCount = 0,
  badgeTab = null
}) => {
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);
  const tabWidth = width / tabs.length;

  return (
    <View style={[styles.container, style]}>
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={[COLORS.white, COLORS.lightGray]}
        style={styles.backgroundGradient}
      />
      
      {/* Forma de mordida para el tab activo */}
      {activeIndex >= 0 && (
        <View style={[styles.biteBackground, { left: activeIndex * tabWidth }]}>
          <Svg
            width={tabWidth}
            height={80}
            viewBox={`0 0 ${tabWidth} 80`}
            style={styles.biteSvg}
          >
            <Path
              d={`M 0 20 
                  Q ${tabWidth * 0.2} 5 ${tabWidth * 0.4} 10
                  Q ${tabWidth * 0.5} 0 ${tabWidth * 0.6} 10
                  Q ${tabWidth * 0.8} 5 ${tabWidth} 20
                  L ${tabWidth} 80
                  L 0 80
                  Z`}
              fill={COLORS.primary}
              fillOpacity={0.1}
            />
          </Svg>
          
          {/* Gradiente adicional para el efecto de mordida */}
          <LinearGradient
            colors={[COLORS.primary + '20', COLORS.primary + '05', 'transparent']}
            style={styles.biteGradient}
          />
        </View>
      )}

      {/* Tabs */}
      {tabs.map((tab, index) => (
        <TouchableOpacity 
          key={tab.key}
          style={[
            styles.tabItem, 
            activeTab === tab.key && styles.tabItemActive,
            { width: tabWidth }
          ]}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <View style={[
              styles.iconWrapper,
              activeTab === tab.key && styles.iconWrapperActive
            ]}>
              <Icon 
                name={tab.icon} 
                size={activeTab === tab.key ? 26 : 22} 
                color={activeTab === tab.key ? COLORS.white : COLORS.mediumGray} 
              />
            </View>
            {showBadge && badgeTab === tab.key && badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeCount}</Text>
              </View>
            )}
          </View>
          <Text style={[
            styles.tabText, 
            activeTab === tab.key && styles.tabTextActive
          ]}>
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
    alignItems: 'flex-end',
    backgroundColor: COLORS.white,
    height: 85,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  biteBackground: {
    position: 'absolute',
    top: 0,
    height: 80,
    zIndex: 1,
  },
  biteSvg: {
    position: 'absolute',
    top: 0,
  },
  biteGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    borderRadius: 20,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    position: 'relative',
    zIndex: 2,
    minHeight: 65,
    justifyContent: 'center',
  },
  tabItemActive: {
    transform: [{ translateY: -8 }],
  },
  iconContainer: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconWrapperActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.1 }],
  },
  tabText: {
    fontSize: 11,
    color: COLORS.mediumGray,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabNavigator; 