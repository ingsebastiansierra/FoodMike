// Script para corregir el rol de un usuario a administrador
// Ejecuta este script con: node fix-admin-role.js

const admin = require('firebase-admin');
const serviceAccount = require('./api/serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Función para corregir el rol de un usuario
async function fixUserRole(email, newRole = 'administrador') {
  try {
    console.log(`🔧 Corrigiendo rol para usuario: ${email} -> ${newRole}`);
    
    // Buscar usuario por email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.log('❌ Usuario no encontrado en Firestore');
      return false;
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('📋 Usuario encontrado:', {
      uid: userData.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role
    });
    
    // Actualizar el rol
    await userDoc.ref.update({ role: newRole });
    
    console.log('✅ Rol corregido exitosamente');
    console.log(`📝 Rol anterior: ${userData.role} -> Nuevo rol: ${newRole}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error corrigiendo rol:', error);
    return false;
  }
}

// Función para listar todos los usuarios
async function listAllUsers() {
  try {
    console.log('📋 Listando todos los usuarios...');
    
    const snapshot = await db.collection('users').get();
    
    if (snapshot.empty) {
      console.log('📋 No hay usuarios registrados');
      return;
    }
    
    console.log(`📋 Usuarios encontrados: ${snapshot.size}`);
    snapshot.forEach(doc => {
      const userData = doc.data();
      console.log(`- ${userData.name} (${userData.email}) - Rol: ${userData.role}`);
    });
  } catch (error) {
    console.error('❌ Error listando usuarios:', error);
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📖 Uso del script:');
    console.log('  node fix-admin-role.js list                    - Listar todos los usuarios');
    console.log('  node fix-admin-role.js fix <email> [role]      - Corregir rol de usuario');
    console.log('');
    console.log('📝 Ejemplos:');
    console.log('  node fix-admin-role.js list');
    console.log('  node fix-admin-role.js fix jssierrapi@unadvirtual.edu.co administrador');
    console.log('  node fix-admin-role.js fix jssierrapi@unadvirtual.edu.co cliente');
    return;
  }
  
  const command = args[0];
  
  if (command === 'list') {
    await listAllUsers();
  } else if (command === 'fix') {
    const email = args[1];
    const role = args[2] || 'administrador';
    
    if (!email) {
      console.log('❌ Error: Debes proporcionar un email');
      return;
    }
    
    const success = await fixUserRole(email, role);
    if (success) {
      console.log('🎉 Rol corregido exitosamente. Reinicia la app para ver los cambios.');
    } else {
      console.log('❌ No se pudo corregir el rol');
    }
  } else {
    console.log('❌ Comando no válido. Usa "list" o "fix"');
  }
  
  // Cerrar la conexión
  process.exit(0);
}

// Ejecutar el script
main().catch(console.error); 