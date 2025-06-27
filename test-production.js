const axios = require('axios');

const PRODUCTION_API = 'https://foodmike.onrender.com/api';

async function testProduction() {
  console.log('🚀 Probando API de producción...\n');

  try {
    // 1. Probar health check
    console.log('1️⃣ Probando health check...');
    const healthResponse = await axios.get('https://foodmike.onrender.com/health');
    console.log('✅ Health check:', healthResponse.data);

    // 2. Probar categorías
    console.log('\n2️⃣ Probando categorías...');
    const categoriesResponse = await axios.get(`${PRODUCTION_API}/search/categories`);
    console.log(`✅ Categorías: ${categoriesResponse.data.data.length} encontradas`);

    // 3. Probar productos destacados
    console.log('\n3️⃣ Probando productos destacados...');
    const featuredResponse = await axios.get(`${PRODUCTION_API}/search/featured?limit=5`);
    console.log(`✅ Productos destacados: ${featuredResponse.data.data.length} encontrados`);

    // 4. Probar restaurantes abiertos
    console.log('\n4️⃣ Probando restaurantes abiertos...');
    const restaurantsResponse = await axios.get(`${PRODUCTION_API}/restaurants/open`);
    console.log(`✅ Restaurantes abiertos: ${restaurantsResponse.data.data.length} encontrados`);

    // 5. Probar login (sin credenciales reales)
    console.log('\n5️⃣ Probando endpoint de login...');
    try {
      await axios.post(`${PRODUCTION_API}/auth/login`, {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Login endpoint funciona (rechaza credenciales inválidas)');
      } else {
        console.log('⚠️ Login endpoint:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 ¡API de producción funcionando correctamente!');
    console.log('\n📱 Para probar la app móvil en producción:');
    console.log('=====================================');
    console.log('1. Asegúrate de que CORS esté configurado en Render');
    console.log('2. La app ya está configurada para usar producción automáticamente');
    console.log('3. Credenciales de prueba:');
    console.log('   👤 Admin: admin@foodmike.com / 123456');
    console.log('   👤 Cliente: cliente@test.com / 123456');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Error probando producción:', error.response?.data || error.message);
  }
}

testProduction(); 