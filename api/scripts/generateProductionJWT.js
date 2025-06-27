const crypto = require('crypto');

// Generar un JWT_SECRET seguro para producción
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 JWT_SECRET generado para producción:');
console.log('=====================================');
console.log(jwtSecret);
console.log('=====================================');
console.log('');
console.log('📋 Instrucciones para Render:');
console.log('1. Ve a https://dashboard.render.com');
console.log('2. Selecciona tu servicio "foodmike"');
console.log('3. Ve a la pestaña "Environment"');
console.log('4. Agrega esta variable:');
console.log(`   JWT_SECRET=${jwtSecret}`);
console.log('5. También agrega:');
console.log('   CORS_ORIGIN=*');
console.log('   NODE_ENV=production');
console.log('   PORT=10000');
console.log('6. Guarda y haz redeploy');
console.log('');
console.log('✅ Después del redeploy, la app funcionará correctamente!'); 