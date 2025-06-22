import React, { createContext, useState, useContext, useEffect } from 'react';
import { firebase } from '../../firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
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

  // Función para registrar usuario con rol
  const registerUser = async (email, password, name, role = 'cliente') => {
    console.log('🔐 AuthContext: Registrando usuario:', { email, name, role });
    
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log('🔐 AuthContext: Usuario creado en Firebase Auth:', userCredential.user.uid);
      
      // Crear documento del usuario en Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        role: role,
        createdAt: new Date(),
        isActive: true,
        profile: {
          phone: '',
          address: '',
          preferences: []
        }
      };

      console.log('🔐 AuthContext: Guardando datos en Firestore:', userData);
      
      await firebase.firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set(userData);

      // Actualizar displayName en Firebase Auth
      await userCredential.user.updateProfile({
        displayName: name
      });

      console.log('🔐 AuthContext: Usuario registrado exitosamente');
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('❌ AuthContext: Error al registrar usuario:', error);
      throw error;
    }
  };

  // Función para iniciar sesión
  const loginUser = async (email, password) => {
    console.log('🔐 AuthContext: Iniciando sesión para:', email);
    
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('🔐 AuthContext: Login exitoso para:', email);
      return { success: true, user: userCredential.user };
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
      await AsyncStorage.removeItem('userToken');
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