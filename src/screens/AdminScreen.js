import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { useAuth } from '../context/AuthContext';
import { 
  Header, 
  Card, 
  StatsCard, 
  QuickActions, 
  UserProfile,
  BotonEstandar
} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = ({ navigation }) => {
  const { user, logoutUser, getAllUsers, changeUserRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === 'cliente' ? 'administrador' : 'cliente';
    
    Alert.alert(
      'Cambiar Rol',
      `¿Estás seguro de que quieres cambiar el rol a ${newRole}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await changeUserRole(userId, newRole);
              await loadUsers();
              Alert.alert('Éxito', 'Rol cambiado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cambiar el rol');
            }
          }
        }
      ]
    );
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

  const resetOnboarding = () => {
    Alert.alert(
      'Resetear Onboarding',
      '¿Estás seguro de que quieres resetear el onboarding? Esto hará que aparezca nuevamente la próxima vez que se abra la app.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('onboardingCompleted');
              Alert.alert('Éxito', 'Onboarding reseteado. Reinicia la app para ver los cambios.');
            } catch (error) {
              Alert.alert('Error', 'No se pudo resetear el onboarding');
            }
          }
        }
      ]
    );
  };

  const quickActions = [
    {
      key: 'restaurants',
      icon: 'cutlery',
      label: 'Restaurantes',
      color: '#4CAF50',
      onPress: () => Alert.alert('Funcionalidad', 'Gestión de restaurantes próximamente')
    },
    {
      key: 'orders',
      icon: 'list-alt',
      label: 'Órdenes',
      color: '#2196F3',
      onPress: () => Alert.alert('Funcionalidad', 'Gestión de órdenes próximamente')
    },
    {
      key: 'analytics',
      icon: 'bar-chart',
      label: 'Analíticas',
      color: '#FF9800',
      onPress: () => Alert.alert('Funcionalidad', 'Analíticas próximamente')
    },
    {
      key: 'settings',
      icon: 'cog',
      label: 'Configuración',
      color: '#9C27B0',
      onPress: () => Alert.alert('Funcionalidad', 'Configuración próximamente')
    }
  ];

  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'administrador').length;
  const clientUsers = users.filter(u => u.role === 'cliente').length;

  return (
    <View style={styles.container}>
      <Header
        title="Panel de Administración"
        subtitle={`Bienvenido, ${user?.name || 'Administrador'}`}
        onLogout={handleLogout}
        gradientColors={[COLORS.primary, COLORS.primary + 'DD']}
      />
      
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        
        <View style={styles.statsContainer}>
          <StatsCard
            icon="users"
            value={totalUsers}
            label="Total Usuarios"
            color="#4CAF50"
          />
          <StatsCard
            icon="cog"
            value={adminUsers}
            label="Administradores"
            color="#2196F3"
          />
          <StatsCard
            icon="user"
            value={clientUsers}
            label="Clientes"
            color="#FF9800"
          />
        </View>

        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <QuickActions actions={quickActions} columns={2} />

        <Text style={styles.sectionTitle}>Acciones del Sistema</Text>
        <View style={styles.actionsContainer}>
          <BotonEstandar
            title="Gestionar Restaurantes"
            onPress={() => Alert.alert('Funcionalidad', 'Gestión de restaurantes próximamente')}
            style={styles.actionButton}
          />
          <BotonEstandar
            title="Ver Todas las Órdenes"
            onPress={() => Alert.alert('Funcionalidad', 'Ver todas las órdenes próximamente')}
            style={styles.actionButton}
          />
          <BotonEstandar
            title="Generar Reportes"
            onPress={() => Alert.alert('Funcionalidad', 'Generar reportes próximamente')}
            style={styles.actionButton}
          />
          <BotonEstandar
            title="Resetear Onboarding"
            onPress={resetOnboarding}
            style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
          />
        </View>

        <Text style={styles.sectionTitle}>Gestión de Usuarios</Text>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          users.map((userItem) => (
            <Card key={userItem.uid} style={styles.userCard} elevation={2}>
              <View style={styles.userInfo}>
                <Icon 
                  name="user-circle" 
                  size={40} 
                  color={userItem.role === 'administrador' ? COLORS.primary : COLORS.gray} 
                />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{userItem.name || 'Sin nombre'}</Text>
                  <Text style={styles.userEmail}>{userItem.email}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: userItem.role === 'administrador' ? COLORS.primary : COLORS.gray }]}>
                    <Text style={styles.roleText}>{userItem.role}</Text>
                  </View>
                </View>
              </View>
              {userItem.uid !== user?.uid && (
                <TouchableOpacity
                  style={styles.changeRoleButton}
                  onPress={() => handleChangeRole(userItem.uid, userItem.role)}
                >
                  <Icon name="exchange" size={16} color={COLORS.primary} />
                  <Text style={styles.changeRoleText}>Cambiar Rol</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  actionsContainer: {
    marginBottom: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.sm,
  },
  userCard: {
    marginBottom: SPACING.sm,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  roleBadge: {
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
  changeRoleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  changeRoleText: {
    marginLeft: SPACING.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loader: {
    marginVertical: SPACING.xl,
  },
});

export default AdminScreen; 