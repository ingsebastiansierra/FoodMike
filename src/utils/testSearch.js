// Archivo de prueba para el motor de búsqueda
import { searchProducts, CATEGORIES } from '../data/restaurantsData';

// Función para probar el motor de búsqueda
export const testSearchEngine = () => {
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
  
  // Test 4: Búsqueda con filtro de estrellas
  const starResults = searchProducts('', { minStars: 4.5 });
  console.log('⭐ Búsqueda 4.5+ estrellas:', starResults.length, 'resultados');
  
  // Test 5: Búsqueda combinada
  const combinedResults = searchProducts('hamburguesa', { minPrice: 8, minStars: 4.0 });
  console.log('🔍 Búsqueda combinada hamburguesa + filtros:', combinedResults.length, 'resultados');
  
  console.log('✅ Pruebas completadas');
  return {
    pizzaResults,
    hamburgerResults,
    priceResults,
    starResults,
    combinedResults
  };
};

// Función para mostrar categorías disponibles
export const showCategories = () => {
  console.log('📂 Categorías disponibles:');
  CATEGORIES.forEach(cat => {
    console.log(`  - ${cat.name} (${cat.id})`);
  });
}; 