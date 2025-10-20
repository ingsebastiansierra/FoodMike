import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import { showAlert, showConfirmAlert } from '../../core/utils/alert';
import { resetOnboarding } from '../../core/utils/onboarding';
import { useAutoCloseCart } from '../../../hooks/useAutoCloseCart';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [showSettings, setShowSettings] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Auto-close cart when this screen gains focus
  useAutoCloseCart();

  // Datos del perfil mejorados
  const userData = {
    name: user?.displayName || 'Usuario TOC TOC',
    email: user?.email || 'usuario@toctoc.com',
    phone: '+57 300 123 4567',
    memberSince: '2024',
    avatar: user?.photoURL,
    stats: {
      orders: 24,
      favorites: 12,
      reviews: 8,
      points: 1250
    },
    level: 'Gold Member',
    nextLevelPoints: 250
  };

  const handleLogout = async () => {
    showConfirmAlert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', logout);
  };

  const handleResetOnboarding = async () => {
    await resetOnboarding();
    showAlert('Onboarding Reseteado', 'La próxima vez que inicies la app, verás la pantalla de bienvenida.');
  };

  const menuItems = [
    {
      id: 1,
      title: 'Mis Pedidos',
      subtitle: 'Historial y seguimiento',
      icon: 'shopping-bag',
      color: COLORS.primary,
      action: () => { }
    },
    {
      id: 2,
      title: 'Favoritos',
      subtitle: 'Restaurantes y platos',
      icon: 'heart',
      color: COLORS.error,
      action: () => navigation.navigate('Favorites')
    },
    {
      id: 3,
      title: 'Direcciones',
      subtitle: 'Gestionar ubicaciones',
      icon: 'map-marker',
      color: COLORS.accent,
      action: () => { }
    },
    {
      id: 4,
      title: 'Métodos de Pago',
      subtitle: 'Tarjetas y billeteras',
      icon: 'credit-card',
      color: COLORS.secondary,
      action: () => { }
    },
    {
      id: 5,
      title: 'Notificaciones',
      subtitle: 'Preferencias de avisos',
      icon: 'bell',
      color: COLORS.info,
      action: () => { }
    },
    {
      id: 6,
      title: 'Ayuda y Soporte',
      subtitle: 'Centro de ayuda',
      icon: 'question-circle',
      color: COLORS.warning,
      action: () => { }
    }
  ];

  // Animaciones del header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) / 2, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0.6],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header animado fijo */}
      <Animated.View style={[styles.fixedHeader, { height: headerHeight }]}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.headerGradient}
        >
          {/* Header compacto (visible cuando se hace scroll) */}
          <Animated.View style={[styles.compactHeader, { opacity: titleOpacity }]}>
            <View style={styles.compactContent}>
              <Animated.View style={[styles.compactAvatar, { transform: [{ scale: avatarScale }] }]}>
                {userData.avatar ? (
                  <Image source={{ uri: userData.avatar }} style={styles.compactAvatarImage} />
                ) : (
                  <View style={styles.compactAvatarPlaceholder}>
                    <Icon name="user" size={20} color={COLORS.white} />
                  </View>
                )}
              </Animated.View>
              <Text style={styles.compactUserName}>{userData.name}</Text>
            </View>
          </Animated.View>

          {/* Header expandido (visible cuando está arriba) */}
          <Animated.View style={[styles.expandedHeader, { opacity: headerOpacity }]}>
            <View style={styles.headerContent}>
              {/* Avatar y info principal */}
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  {userData.avatar ? (
                    <Image source={{ uri: userData.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Icon name="user" size={40} color={COLORS.white} />
                    </View>
                  )}
                  <TouchableOpacity style={styles.editAvatarBtn}>
                    <Icon name="camera" size={14} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userData.name}</Text>
                  <Text style={styles.userEmail}>{userData.email}</Text>
                </View>
              </View>

              {/* Información adicional del usuario */}
              <View style={styles.userDetailsSection}>
                <Text style={styles.userPhone}>{userData.phone}</Text>
                <Text style={styles.memberSince}>Miembro desde {userData.memberSince}</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
      >
        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="shopping-cart" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{userData.stats.orders}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="heart" size={24} color={COLORS.error} />
            <Text style={styles.statNumber}>{userData.stats.favorites}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="star" size={24} color={COLORS.secondary} />
            <Text style={styles.statNumber}>{userData.stats.reviews}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="gift" size={24} color={COLORS.accent} />
            <Text style={styles.statNumber}>{userData.stats.points}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
        </View>

        {/* Menú de opciones */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                <Icon name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={16} color={COLORS.mediumGray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección de configuración adicional */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleResetOnboarding}>
            <Icon name="refresh" size={20} color={COLORS.info} />
            <Text style={styles.settingText}>Ver Tutorial de Nuevo</Text>
            <Icon name="chevron-right" size={16} color={COLORS.mediumGray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Icon name="shield" size={20} color={COLORS.accent} />
            <Text style={styles.settingText}>Privacidad y Seguridad</Text>
            <Icon name="chevron-right" size={16} color={COLORS.mediumGray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Icon name="info-circle" size={20} color={COLORS.warning} />
            <Text style={styles.settingText}>Acerca de TOC TOC</Text>
            <Icon name="chevron-right" size={16} color={COLORS.mediumGray} />
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#FF6B6B', '#FF5252']}
            style={styles.logoutGradient}
          >
            <Icon name="sign-out" size={20} color={COLORS.white} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background?.primary || COLORS.lightGray,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    justifyContent: 'center',
    paddingTop: 30,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  compactAvatar: {
    marginRight: SPACING.md,
  },
  compactAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  compactAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  compactUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  expandedHeader: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 40,
  },
  headerContent: {
    paddingHorizontal: SPACING.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: SPACING.sm,
  },

  userDetailsSection: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  userPhone: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberSince: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text?.primary || COLORS.darkGray,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text?.secondary || COLORS.mediumGray,
    fontWeight: '600',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: 24,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text?.primary || COLORS.darkGray,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: COLORS.text?.secondary || COLORS.mediumGray,
    fontWeight: '500',
  },
  settingsSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    borderRadius: 24,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text?.primary || COLORS.darkGray,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text?.primary || COLORS.darkGray,
    marginLeft: SPACING.md,
  },
  logoutButton: {
    marginHorizontal: SPACING.lg,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: SPACING.sm,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default ProfileScreen;
