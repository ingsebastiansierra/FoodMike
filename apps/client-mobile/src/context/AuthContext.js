import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
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
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Función para manejar cambios de sesión (login, logout, refresh)
  const handleSessionChange = useCallback(async (currentSession) => {
    console.log('📱 Cambio de sesión detectado');

    if (!currentSession?.user) {
      console.log('🚪 No hay sesión, limpiando estado');
      setSession(null);
      setUser(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    // Hay un usuario autenticado
    setSession(currentSession);
    setUser(currentSession.user);

    try {
      console.log('🔍 Buscando perfil para usuario:', currentSession.user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role, full_name, email, restaurant_id')
        .eq('id', currentSession.user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error al cargar el perfil:', error);
        setUserRole('cliente');
      } else if (profile) {
        const role = profile.role || 'cliente';
        console.log('✅ Perfil cargado:', {
          email: profile.email,
          role: role,
          restaurant_id: profile.restaurant_id
        });
        setUserRole(role);
      } else {
        console.warn(`⚠️ Perfil no encontrado. Asignando rol por defecto.`);
        setUserRole('cliente');
      }
    } catch (error) {
      console.error('❌ Error inesperado al cargar el perfil:', error);
      setUserRole('cliente');
    } finally {
      console.log('✨ Finalizando carga, quitando loading');
      setLoading(false);
    }
  }, []);

  // Efecto principal para inicializar y escuchar la autenticación
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      handleSessionChange(currentSession);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        handleSessionChange(currentSession);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [handleSessionChange]);

  // Funciones de autenticación (login, register, logout, etc.)
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    setLoading(false);
    if (error) throw error;
    return data.user;
  };

  const register = async (email, password, userData) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: userData?.fullName?.trim() || '',
        },
      },
    });
    setLoading(false);
    if (error) throw error;
    return data.user;
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
  };

  // No hay cambios en las demás funciones (resetPassword, updateProfile), 
  // ya que tu código para ellas está correcto.

  const value = {
    user,
    session,
    loading,
    userRole,
    isAuthenticated: !!user,
    isAdmin: userRole === 'administrador',
    isClient: userRole === 'cliente',
    isRestaurantAdmin: userRole === 'administradorRestaurante',
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

