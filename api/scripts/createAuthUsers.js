const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

// Datos de usuarios para crear en Authentication
const authUsers = [
  {
    email: 'admin@foodmike.com',
    password: '123456',
    displayName: 'Administrador Principal',
    uid: 'admin-001'
  },
  {
    email: 'cliente@test.com',
    password: '123456',
    displayName: 'Cliente de Prueba',
    uid: 'cliente-001'
  },
  {
    email: 'maria@test.com',
    password: '123456',
    displayName: 'María González',
    uid: 'cliente-002'
  }
];

async function createAuthUsers() {
  try {
    console.log('🚀 Creando usuarios en Firebase Authentication...');

    for (const userData of authUsers) {
      try {
        // Verificar si el usuario ya existe
        try {
          const existingUser = await auth.getUserByEmail(userData.email);
          console.log(`⚠️ Usuario ya existe: ${userData.email} (${existingUser.uid})`);
          continue;
        } catch (error) {
          if (error.code !== 'auth/user-not-found') {
            throw error;
          }
        }

        // Crear usuario en Authentication
        const userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
          uid: userData.uid
        });

        console.log(`✅ Usuario creado en Auth: ${userData.email} (${userRecord.uid})`);
      } catch (error) {
        console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
      }
    }

    console.log('🎉 ¡Usuarios de Authentication creados exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    process.exit(0);
  }
}

createAuthUsers(); 