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
import { COLORS } from '../../../theme/colors';
import { SPACING } from '../../../theme/spacing';
import { useAuth } from '../../../context/AuthContext';
import { 
  Header, 
  Card, 
  StatsCard, 
  QuickActions, 
  UserProfile,
  BotonEstandar
} from '../../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkUserRole, fixUserRole, listAllUsers } from '../utils/debugAuth';

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

  // Funciones de depuración
  const debugCheckUserRole = async () => {
    try {
      const email = user?.email;
      if (!email) {
        Alert.alert('Error', 'No se puede obtener el email del usuario actual');
        return;
      }
      
      const userData = await checkUserRole(email);
      if (userData) {
        Alert.alert(
          'Información del Usuario',
          `Email: ${userData.email}\nNombre: ${userData.name}\nRol: ${userData.role}\nUID: ${userData.uid}`
        );
      } else {
        Alert.alert('Error', 'No se pudo obtener información del usuario');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al verificar rol del usuario');
    }
  };

  const debugListAllUsers = async () => {
    try {
      const users = await listAllUsers();
      if (users.length > 0) {
        const userList = users.map(u => `${u.name} (${u.email}) - ${u.role}`).join('\n');
        Alert.alert('Todos los Usuarios', userList);
      } else {
        Alert.alert('Info', 'No hay usuarios para listar');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo listar los usuarios');
    }
  };

  const debugFixCurrentUserRole = async () => {
    try {
      const email = user?.email;
      if (!email) {
        Alert.alert('Error', 'No se puede obtener el email del usuario actual');
        return;
      }
      await fixUserRole(email);
      Alert.alert('Éxito', 'Se intentó corregir el rol a administrador. Por favor, reinicia sesión para ver los cambios.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo corregir el rol');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Panel de Administrador" onLogout={handleLogout} />
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <UserProfile user={user} />
        
        <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>
        <View style={styles.statsContainer}>
          <StatsCard icon="users" value={users.length} label="Usuarios Totales" />
          <StatsCard icon="cutlery" value="125" label="Productos" />
          <StatsCard icon="money" value="$1,250" label="Ventas Hoy" />
        </View>

        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <QuickActions
          actions={[
            { title: 'Gestionar Productos', icon: 'list', onPress: () => {} },
            { title: 'Ver Pedidos', icon: 'truck', onPress: () => {} },
            { title: 'Reportes', icon: 'bar-chart', onPress: () => {} },
            { title: 'Configuración', icon: 'gear', onPress: () => {} },
          ]}
        />
        
        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Otras Acciones</Text>
          <BotonEstandar
            title="Resetear Onboarding"
            onPress={resetOnboarding}
            style={[styles.actionButton, { backgroundColor: '#FF5722' }]}
          />
          
          {/* Botones de depuración */}
          <Text style={[styles.sectionTitle, { marginTop: SPACING.xl, color: '#FF5722' }]}>🔧 Depuración</Text>
          <BotonEstandar
            title="Verificar Mi Rol"
            onPress={debugCheckUserRole}
            style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          />
          <BotonEstandar
            title="Listar Todos los Usuarios"
            onPress={debugListAllUsers}
            style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          />
          <BotonEstandar
            title="Corregir Mi Rol a Admin"
            onPress={debugFixCurrentUserRole}
            style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
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
