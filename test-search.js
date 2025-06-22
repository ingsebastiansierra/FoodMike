// Archivo de prueba para el motor de búsqueda
const { searchProducts, CATEGORIES } = require('./src/data/restaurantsData');

// Función para probar el motor de búsqueda
const testSearchEngine = () => {
  console.log('🧪 Probando motor de búsqueda...');
  
  // Test 1: Búsqueda por término
  const pizzaResults = searchProducts('pizza');
  console.log('🍕 Búsqueda "pizza":', pizzaResults.length, 'resultados');
  
  // Test 2: Búsqueda por categoría
  const hamburgerResults = searchProducts('', { category: 'hamburguesas' });
  console.log('🍔 Búsqueda hamburguesas:', hamburgerResults.length, 'resultados');
  
  // Test 3: Búsqueda con filtro de precio
  const priceResults = searchProducts('', { minPrice: 10, maxPrice: 20 });
  console.log('💰 Búsqueda por precio $10-$20:', priceResults.length, 'resultados');
  
  console.log('✅ Pruebas completadas');
};

testSearchEngine(); 