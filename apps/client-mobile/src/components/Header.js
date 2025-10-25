import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';

const Header = ({ 
  title, 
  subtitle, 
  onLogout, 
  onCartPress, 
  cartCount = 0,
  showCart = false,
  showLogout = true,
  gradientColors = [COLORS.primary, COLORS.primary + 'DD'],
  rightAction,
  rightActionIcon,
  onRightAction
}) => {
  return (
    <LinearGradient colors={gradientColors} style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          {showCart && (
            <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
              <Icon name="shopping-cart" size={20} color={COLORS.white} />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {rightAction && (
            <TouchableOpacity style={styles.actionButton} onPress={onRightAction}>
              <Icon name={rightActionIcon} size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}
          
          {showLogout && (
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Icon name="sign-out" size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sg,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sg,
  },
  logoutButton: {
    padding: SPACING.sm,
  },
});

export default Header; 