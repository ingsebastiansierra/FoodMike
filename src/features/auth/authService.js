import { supabase } from '../../../config/supabase';

// Función para manejar errores de autenticación
const handleAuthError = (error) => {
  console.error('Error de autenticación:', error.message);
  
  // Mapeo de errores comunes de Supabase a mensajes amigables
  const errorMessages = {
    'Invalid login credentials': 'Correo o contraseña incorrectos',
    'Email not confirmed': 'Por favor verifica tu correo electrónico para activar tu cuenta',
    'User already registered': 'Este correo ya está registrado',
    'Email rate limit exceeded': 'Demasiados intentos. Por favor inténtalo más tarde',
    'Weak password': 'La contraseña debe tener al menos 6 caracteres',
    'Invalid email': 'Formato de correo electrónico inválido'
  };

  const message = errorMessages[error.message] || 'Error en la autenticación. Por favor inténtalo de nuevo';
  throw new Error(message);
};

// Iniciar sesión con email y contraseña
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) throw error;
    return { user: data.user, session: data.session };
  } catch (error) {
    return handleAuthError(error);
  }
};

// Registrar un nuevo usuario
export const signUpWithEmail = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          full_name: userData?.fullName?.trim() || '',
          // Agrega más campos según sea necesario
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { user: data.user, session: data.session };
  } catch (error) {
    return handleAuthError(error);
  }
};

// Cerrar sesión
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Restablecer contraseña
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    return handleAuthError(error);
  }
};

// Obtener la sesión actual
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error al obtener la sesión:', error);
    return null;
  }
};

// Escuchar cambios en la autenticación
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  
  // Retornar la función para desuscribirse
  return () => subscription?.unsubscribe();
};

// Actualizar perfil de usuario
export const updateUserProfile = async (updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', (await supabase.auth.getUser()).data.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
};
