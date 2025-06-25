const axios = require('axios');

async function testEndpoint() {
  try {
    console.log('🧪 Probando endpoint /search/all...\n');
    
    const response = await axios.get('http://localhost:3001/api/search/all?limit=1000');
    
    console.log('✅ Respuesta del endpoint:');
    console.log(`- Status: ${response.status}`);
    console.log(`- Productos devueltos: ${response.data.data.length}`);
    console.log(`- Count en respuesta: ${response.data.count}`);
    
    if (response.data.data.length > 0) {
      console.log('\n📋 Primeros 5 productos:');
      response.data.data.slice(0, 5).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price} - ${product.category}`);
      });
      
      if (response.data.data.length > 5) {
        console.log(`... y ${response.data.data.length - 5} productos más`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  }
}

testEndpoint(); 