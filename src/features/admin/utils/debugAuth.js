import { firebase } from '../../../../firebase-config';

// Función para verificar el rol de un usuario en Firestore
export const checkUserRole = async (email) => {
  try {
    console.log('🔍 Verificando rol para usuario:', email);
    
    // Buscar usuario por email
    const usersSnapshot = await firebase.firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log('❌ Usuario no encontrado en Firestore');
      return null;
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ Usuario encontrado:', {
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: userData.createdAt
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
    
    const usersSnapshot = await firebase.firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log('❌ Usuario no encontrado en Firestore');
      return false;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.update({ role: newRole });
    
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
    
    const snapshot = await firebase.firestore()
      .collection('users')
      .get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
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
    
    // Crear usuario en Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const firebaseUser = userCredential.user;
    
    // Crear documento en Firestore
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: name,
      role: 'administrador',
      createdAt: new Date(),
      isActive: true
    };
    
    await firebase.firestore()
      .collection('users')
      .doc(firebaseUser.uid)
      .set(userData);
    
    console.log('✅ Usuario administrador creado exitosamente');
    return { success: true, user: { ...firebaseUser, ...userData } };
  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
    return { success: false, error: error.message };
  }
};
