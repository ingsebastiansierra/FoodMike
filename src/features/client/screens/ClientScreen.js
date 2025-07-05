import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import { useAuth } from '../../../context/AuthContext';
import BotonEstandar from '../../../components/BotonEstandar';
import { LinearGradient } from 'expo-linear-gradient';

const ClientScreen = ({ navigation }) => {
  const { user, logoutUser, updateUserProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Aquí podrías recargar datos del usuario
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: logoutUser }
      ]
    );
  };

  const ClientCard = ({ title, description, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.clientCard, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.cardContent}>
        <Icon name={icon} size={24} color={color} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <Icon name="chevron-right" size={16} color={COLORS.gray} />
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <Icon name={icon} size={24} color={COLORS.primary} />
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[COLORS.white, '#FFDDC1']} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>¡Hola,</Text>
          <Text style={styles.clientName}>{user?.name || 'Cliente'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <View style={styles.quickActionsContainer}>
          <QuickAction
            title="Buscar Comida"
            icon="search"
            onPress={() => Alert.alert('Próximamente', 'Búsqueda de restaurantes')}
          />
          <QuickAction
            title="Mis Pedidos"
            icon="list"
            onPress={() => Alert.alert('Próximamente', 'Historial de pedidos')}
          />
          <QuickAction
            title="Favoritos"
            icon="heart"
            onPress={() => Alert.alert('Próximamente', 'Restaurantes favoritos')}
          />
          <QuickAction
            title="Promociones"
            icon="gift"
            onPress={() => Alert.alert('Próximamente', 'Ofertas especiales')}
          />
        </View>

        <Text style={styles.sectionTitle}>Servicios</Text>
        
        <View style={styles.servicesContainer}>
          <ClientCard
            title="Restaurantes Cercanos"
            description="Encuentra los mejores restaurantes cerca de ti"
            icon="map-marker"
            color="#4CAF50"
            onPress={() => Alert.alert('Próximamente', 'Mapa de restaurantes')}
          />
          <ClientCard
            title="Pedidos a Domicilio"
            description="Ordena tu comida favorita y recíbela en casa"
            icon="truck"
            color="#2196F3"
            onPress={() => navigation.navigate('ClientHome')}
          />
          <ClientCard
            title="Reservar Mesa"
            description="Asegura tu lugar en tu restaurante preferido"
            icon="calendar"
            color="#FF9800"
            onPress={() => Alert.alert('Próximamente', 'Sistema de reservas')}
          />
        </View>

        <Text style={styles.sectionTitle}>Mi Perfil</Text>

        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Icon name="user-circle" size={60} color={COLORS.primary} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Nombre Apellido'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>Cliente</Text>
                </View>
              </View>
            </View>
            <View style={styles.profileActions}>
              <BotonEstandar texto="Editar Perfil" onPress={() => {}} />
              <BotonEstandar texto="Ver Actividad" onPress={() => {}} colorFondo={COLORS.secondary} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Mis Estadísticas</Text>

        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="shopping-cart" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Pedidos Realizados</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="star" size={24} color="#FFD700" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Puntos Acumulados</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="heart" size={24} color="#E91E63" />
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logoutButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  quickAction: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    width: '48%',
    marginBottom: SPACING.sm,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  servicesContainer: {
    marginBottom: SPACING.lg,
  },
  clientCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  profileSection: {
    marginBottom: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  profileInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  roleText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.xs,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
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
});

export default ClientScreen;
