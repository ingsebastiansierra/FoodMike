const axios = require('axios');

async function testRegister() {
  try {
    console.log('🧪 Probando endpoint de registro...');
    
    const timestamp = Date.now();
    const email = `admin-test-${timestamp}@test.com`;
    
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      email: email,
      password: '123456',
      name: 'Admin Test Final',
      role: 'administrador'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registro exitoso:', response.data);
  } catch (error) {
    console.error('❌ Error en registro:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegister(); 