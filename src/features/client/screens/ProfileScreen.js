import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import { showAlert, showConfirmAlert } from '../../core/utils/alert';
import { resetOnboarding } from '../../core/utils/onboarding';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  // Simulación de datos del perfil
  const userData = {
    name: user?.displayName || 'Invitado',
    email: user?.email,
    avatar: user?.photoURL || 'default_avatar_url',
    stats: { orders: 12, favorites: 5, reviews: 3 },
  };

  const handleLogout = async () => {
    showConfirmAlert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', logout);
  };

  const handleResetOnboarding = async () => {
    await resetOnboarding();
    showAlert('Onboarding Reseteado', 'La próxima vez que inicies la app, verás la pantalla de bienvenida.');
  };

  return (
    <ScrollView style={styles.profileContainer}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Icon name="user-circle" size={80} color={COLORS.primary} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="pencil" size={15} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileEmail}>{userData.email}</Text>
            <View style={styles.roleBadge}>
              <Icon name="star" size={12} color={COLORS.white} />
              <Text style={styles.roleText}>CLIENTE</Text>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.statsCard}>
        <Text style={styles.statsTitle}>Tus Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Icon name="shopping-basket" size={30} color={COLORS.primary} />
            <Text style={styles.statNumber}>{userData.stats.orders}</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="heart" size={30} color={COLORS.primary} />
            <Text style={styles.statNumber}>{userData.stats.favorites}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="star" size={30} color={COLORS.primary} />
            <Text style={styles.statNumber}>{userData.stats.reviews}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Configuración</Text>
        <TouchableOpacity style={styles.actionItem}>
          <Icon name="user" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Editar Perfil</Text>
          <Icon name="chevron-right" size={16} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <Icon name="map-marker" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Mis Direcciones</Text>
          <Icon name="chevron-right" size={16} color={COLORS.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={handleResetOnboarding}>
          <Icon name="info-circle" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Ver Onboarding de Nuevo</Text>
          <Icon name="chevron-right" size={16} color={COLORS.gray} />
        </TouchableOpacity>
      </Card>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="sign-out" size={20} color="#FF5722" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.lightGray,
  },
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileAvatar: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  statsCard: {
    marginBottom: SPACING.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  actionsCard: {
    marginBottom: SPACING.lg,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  actionText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: SPACING.md,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF5722',
    marginBottom: SPACING.xl,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
    marginLeft: SPACING.sm,
  },
});

export default ProfileScreen;
