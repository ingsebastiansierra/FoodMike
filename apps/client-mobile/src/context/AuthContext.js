import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { supabase } from '../config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

// Importante: Permite que el navegador se cierre después de la autenticación
WebBrowser.maybeCompleteAuthSession();

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
      console.log('🔍 Verificando sesión guardada...');
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Error al obtener sesión:', error);
      }

      if (currentSession) {
        console.log('✅ Sesión encontrada:', currentSession.user.email);
      } else {
        console.log('⚠️ No hay sesión guardada');
      }

      handleSessionChange(currentSession);
    };

    getInitialSession();

    // Listener para deep links (cuando vuelve de Google)
    const handleDeepLink = async (event) => {
      console.log('🔗 Deep link recibido:', event.url);

      if (event.url) {
        // Extraer el hash fragment que contiene los tokens
        const url = new URL(event.url);
        const hashParams = new URLSearchParams(url.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          console.log('🔑 Tokens encontrados en deep link, estableciendo sesión...');
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (error) {
              console.error('❌ Error al establecer sesión:', error);
            } else {
              console.log('✅ Sesión establecida desde deep link');
            }
          } catch (err) {
            console.error('❌ Error procesando deep link:', err);
          }
        }
      }
    };

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔄 Auth state change:', event);
        handleSessionChange(currentSession);
      }
    );

    // Escuchar deep links
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    // Verificar si la app se abrió con un deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('🔗 App abierta con URL:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription?.unsubscribe();
      linkingSubscription?.remove();
    };
  }, [handleSessionChange]);

  // Funciones de autenticación (login, register, logout, etc.)
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        // Mensajes de error personalizados
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Correo o contraseña incorrectos');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Por favor verifica tu correo electrónico');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Demasiados intentos. Intenta más tarde');
        } else {
          throw new Error('Error al iniciar sesión. Intenta de nuevo');
        }
      }

      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, userData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: userData?.fullName?.trim() || '',
          },
        },
      });

      if (error) {
        // Mensajes de error personalizados
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          throw new Error('Este correo ya está registrado');
        } else if (error.message.includes('invalid format') || error.message.includes('Invalid email')) {
          throw new Error('Formato de correo inválido');
        } else if (error.message.includes('Password should be')) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        } else {
          throw new Error('Error al registrarse. Intenta de nuevo');
        }
      }

      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
  };

  const resendVerificationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });

      if (error) {
        throw new Error('Error al reenviar el email de verificación');
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🔵 Iniciando autenticación con Google...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('❌ Error de Supabase:', error);
        throw new Error('Error al iniciar sesión con Google: ' + error.message);
      }

      if (!data?.url) {
        throw new Error('No se recibió URL de autenticación');
      }

      console.log('🌐 Abriendo navegador con URL de Google...');

      // Abrir el navegador y esperar el resultado
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        'https://twyzwzagzzimbkblgpes.supabase.co'
      );

      console.log('📱 Resultado del navegador:', result.type);

      if (result.type === 'success' && result.url) {
        console.log('✅ URL recibida:', result.url);

        // Extraer tokens del hash fragment
        const url = result.url;
        const hashMatch = url.match(/#(.+)/);

        if (hashMatch) {
          const hashParams = new URLSearchParams(hashMatch[1]);
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            console.log('🔑 Tokens encontrados, estableciendo sesión...');

            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionError) {
              console.error('❌ Error al establecer sesión:', sessionError);
              throw new Error('Error al establecer la sesión');
            }

            console.log('✅ Sesión establecida correctamente con Google');
          }
        }
      } else if (result.type === 'cancel') {
        console.log('⚠️ Usuario canceló la autenticación');
        throw new Error('Autenticación cancelada');
      }

      return data;
    } catch (error) {
      console.error('❌ Error en signInWithGoogle:', error);
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: 'toctoc://auth/callback',
        },
      });

      if (error) {
        throw new Error('Error al iniciar sesión con Facebook');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

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
    resendVerificationEmail,
    signInWithGoogle,
    signInWithFacebook,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

