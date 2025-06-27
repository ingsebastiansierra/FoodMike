const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().createUser({
  email: 'prueba-firebase-auth@correo.com',
  password: '123456',
  displayName: 'Prueba Auth desde Node'
}).then(user => {
  console.log('✅ Usuario creado en Firebase Auth:', user.uid);
  process.exit(0);
}).catch(err => {
  console.error('❌ Error creando usuario en Firebase Auth:', err);
  process.exit(1);
}); 