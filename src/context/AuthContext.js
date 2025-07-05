import React, { createContext, useState, useContext, useEffect } from 'react';
import { firebase } from '../../firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Función helper para verificar si AsyncStorage está disponible
const isAsyncStorageAvailable = () => {
  try {
    return typeof AsyncStorage !== 'undefined' && AsyncStorage !== null;
  } catch (error) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario está autenticado al cargar la app
  useEffect(() => {
    console.log('🔐 AuthContext: Iniciando verificación de autenticación');
    
    const unsubscribe = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      console.log('🔐 AuthContext: Estado de autenticación cambiado', firebaseUser ? 'Usuario autenticado' : 'Usuario no autenticado');
      
      if (firebaseUser) {
        // Obtener información adicional del usuario desde Firestore
        try {
          console.log('🔐 AuthContext: Obteniendo datos de Firestore para usuario:', firebaseUser.uid);
          
          const userDoc = await firebase.firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('🔐 AuthContext: Datos de usuario encontrados:', userData);
            
            setUser({
              ...firebaseUser,
              ...userData
            });
            setUserRole(userData.role || 'cliente');
          } else {
            console.log('🔐 AuthContext: Creando documento de usuario por defecto');
            
            // Si no existe el documento, crear uno por defecto
            const defaultUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: 'cliente',
              name: firebaseUser.displayName || '',
              createdAt: new Date(),
              isActive: true
            };
            
            await firebase.firestore()
              .collection('users')
              .doc(firebaseUser.uid)
              .set(defaultUserData);

            setUser({
              ...firebaseUser,
              ...defaultUserData
            });
            setUserRole('cliente');
          }
        } catch (error) {
          console.error('❌ AuthContext: Error al obtener datos del usuario:', error);
          
          // En caso de error, usar solo los datos de Firebase Auth
          setUser(firebaseUser);
          setUserRole('cliente');
        }
      } else {
        console.log('🔐 AuthContext: No hay usuario autenticado');
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Función para registrar un nuevo cliente
  const registerUser = async (email, password, name) => {
    const role = 'cliente'; // Forzar rol de cliente
    console.log('🔐 AuthContext: Registrando nuevo cliente:', { email, name });
    try {
      // Llamar a la API para registrar el usuario con el rol de cliente
      const response = await api.post('/auth/register', { email, password, name, role });
      const { token, user: apiUser } = response.data.data;

      // Guardar token solo si AsyncStorage está disponible
      if (isAsyncStorageAvailable()) {
        try {
          await AsyncStorage.setItem('userToken', token);
          console.log('🔐 AuthContext: Token JWT guardado exitosamente');
        } catch (storageError) {
          console.warn('⚠️ AuthContext: Error guardando token JWT:', storageError);
        }
      }

      // Actualizar el estado local
      setUser(apiUser);
      setUserRole(apiUser.role);

      console.log('🔐 AuthContext: Registro de cliente completado exitosamente');

      return { success: true, user: apiUser };
    } catch (error) {
      console.error('❌ AuthContext: Error al registrar cliente:', error);
      throw error;
    }
  };

  // Función para iniciar sesión
  const loginUser = async (email, password) => {
    console.log('🔐 AuthContext: Iniciando sesión para:', email);
    
    try {
      // Autenticar con Firebase Auth
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      console.log('🔐 AuthContext: Login exitoso con Firebase para:', email);
      
      // Obtener datos del usuario desde Firestore
      try {
        const userDoc = await firebase.firestore()
          .collection('users')
          .doc(firebaseUser.uid)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log('🔐 AuthContext: Datos de usuario obtenidos de Firestore:', userData);
          
          // Actualizar estado local
          setUser({
            ...firebaseUser,
            ...userData
          });
          setUserRole(userData.role || 'cliente');
        } else {
          console.log('🔐 AuthContext: Usuario no encontrado en Firestore, creando documento por defecto');
          
          // Crear documento por defecto
          const defaultUserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'cliente',
            name: firebaseUser.displayName || '',
            createdAt: new Date(),
            isActive: true
          };
          
          await firebase.firestore()
            .collection('users')
            .doc(firebaseUser.uid)
            .set(defaultUserData);

          setUser({
            ...firebaseUser,
            ...defaultUserData
          });
          setUserRole('cliente');
        }
      } catch (firestoreError) {
        console.error('❌ AuthContext: Error obteniendo datos de Firestore:', firestoreError);
        // En caso de error, usar solo datos de Firebase Auth
        setUser(firebaseUser);
        setUserRole('cliente');
      }
      
      console.log('🔐 AuthContext: Login completado exitosamente');
      
      return { success: true, user: firebaseUser };
    } catch (error) {
      console.error('❌ AuthContext: Error al iniciar sesión:', error);
      throw error;
    }
  };

  // Función para cerrar sesión
  const logoutUser = async () => {
    console.log('🔐 AuthContext: Cerrando sesión');
    
    try {
      await firebase.auth().signOut();
      
      // Limpiar token solo si AsyncStorage está disponible
      if (isAsyncStorageAvailable()) {
        try {
          await AsyncStorage.removeItem('userToken');
          console.log('🔐 AuthContext: Token JWT removido exitosamente');
        } catch (storageError) {
          console.warn('⚠️ AuthContext: Error removiendo token JWT:', storageError);
        }
      }
      
      setUser(null);
      setUserRole(null);
      console.log('🔐 AuthContext: Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ AuthContext: Error al cerrar sesión:', error);
    }
  };

  // Función para actualizar perfil del usuario
  const updateUserProfile = async (updates) => {
    console.log('🔐 AuthContext: Actualizando perfil:', updates);
    
    try {
      await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .update(updates);

      setUser(prevUser => ({
        ...prevUser,
        ...updates
      }));
      
      console.log('🔐 AuthContext: Perfil actualizado exitosamente');
    } catch (error) {
      console.error('❌ AuthContext: Error al actualizar perfil:', error);
      throw error;
    }
  };

  // Función para cambiar rol (solo para administradores)
  const changeUserRole = async (userId, newRole) => {
    console.log('🔐 AuthContext: Cambiando rol de usuario:', { userId, newRole, currentUserRole: userRole });
    
    if (userRole !== 'administrador') {
      throw new Error('No tienes permisos para cambiar roles');
    }

    try {
      await firebase.firestore()
        .collection('users')
        .doc(userId)
        .update({ role: newRole });
      
      console.log('🔐 AuthContext: Rol cambiado exitosamente');
    } catch (error) {
      console.error('❌ AuthContext: Error al cambiar rol:', error);
      throw error;
    }
  };

  // Función para obtener todos los usuarios (solo para administradores)
  const getAllUsers = async () => {
    console.log('🔐 AuthContext: Obteniendo todos los usuarios, rol actual:', userRole);
    
    if (userRole !== 'administrador') {
      throw new Error('No tienes permisos para ver todos los usuarios');
    }

    try {
      const snapshot = await firebase.firestore()
        .collection('users')
        .get();

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('🔐 AuthContext: Usuarios obtenidos:', users.length);
      return users;
    } catch (error) {
      console.error('❌ AuthContext: Error al obtener usuarios:', error);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    changeUserRole,
    getAllUsers,
    isAdmin: userRole === 'administrador',
    isClient: userRole === 'cliente'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 