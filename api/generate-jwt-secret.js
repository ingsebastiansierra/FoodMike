const crypto = require('crypto');

// Generar un JWT_SECRET seguro
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 JWT_SECRET generado:');
console.log(jwtSecret);
console.log('\n📝 Crea un archivo .env en la carpeta api con el siguiente contenido:');
console.log('=====================================');
console.log('PORT=3001');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('CORS_ORIGIN=http://localhost:3000');
console.log('RATE_LIMIT_WINDOW_MS=900000');
console.log('RATE_LIMIT_MAX_REQUESTS=100');
console.log('NODE_ENV=development');
console.log('=====================================');
console.log('\n💡 Después de crear el archivo .env, reinicia el servidor.'); 