import { supabase } from '../../../config/supabase';

// Función para verificar el rol de un usuario en Supabase
export const checkUserRole = async (email) => {
  try {
    console.log('🔍 Verificando rol para usuario:', email);
    
    // Buscar usuario por email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) throw error;

    if (!users || users.length === 0) {
      console.log('❌ Usuario no encontrado en Supabase');
      return null;
    }

    const userData = users[0];
    
    console.log('✅ Usuario encontrado:', {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: userData.created_at
    });
    
    return userData;
  } catch (error) {
    console.error('❌ Error verificando rol:', error);
    return null;
  }
};

// Función para corregir el rol de un usuario
export const fixUserRole = async (email, newRole) => {
  try {
    console.log('🔧 Corrigiendo rol para usuario:', email, '->', newRole);
    
    // Primero obtenemos el usuario por email
    const { data: users, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (selectError) throw selectError;

    if (!users || users.length === 0) {
      console.log('❌ Usuario no encontrado en Supabase');
      return false;
    }

    // Actualizamos el rol del usuario
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', users[0].id);

    if (updateError) throw updateError;
    
    console.log('✅ Rol corregido exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error corrigiendo rol:', error);
    return false;
  }
};

// Función para listar todos los usuarios
export const listAllUsers = async () => {
  try {
    console.log('📋 Listando todos los usuarios...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    
    console.log('📋 Usuarios encontrados:', users.length);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Rol: ${user.role}`);
    });
    
    return users;
  } catch (error) {
    console.error('❌ Error listando usuarios:', error);
    return [];
  }
};

// Función para crear un usuario administrador de prueba
export const createTestAdmin = async (email, password, name) => {
  try {
    console.log('👤 Creando usuario administrador de prueba:', { email, name });
    
    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: 'administrador'
        }
      }
    });

    if (authError) throw authError;
    
    // Crear registro en la tabla users
    const userData = {
      id: authData.user.id,
      email: email,
      name: name,
      role: 'administrador',
      created_at: new Date(),
      is_active: true
    };
    
    const { error: insertError } = await supabase
      .from('users')
      .insert(userData);

    if (insertError) throw insertError;
    
    console.log('✅ Usuario administrador creado exitosamente');
    return { success: true, user: userData };
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    return { success: false, error: error.message };
  }
};
