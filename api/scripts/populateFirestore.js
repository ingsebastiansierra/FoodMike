// Script para poblar Firestore con lugares y productos de ejemplo
// Ejecuta este script con: node api/scripts/populateFirestore.js

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const tiposLugares = [
  'restaurante', 'pizzería', 'comida rápida', 'cafetería', 'hamburguesería',
  'sushi', 'mexicano', 'parrilla', 'heladería', 'panadería'
];

const nombresLugares = [
  'Pizza Mike', 'Taco Loco', 'Burger House', 'Café Aroma', 'Sushi Go',
  'La Parrilla', 'Helados Yeti', 'Panadería Dulce', 'Pollo Express', 'Arepas VIP'
];

const categorias = [
  'hamburguesa', 'pizza', 'plato', 'sushi', 'mexicana', 'pollo', 'ensalada', 'postre',
  'combo', 'taco', 'parrilla', 'arepa'
];

const productosBase = [
  // Platos principales
  { name: 'Pizza Hawaiana', category: 'pizza', description: 'Queso, jamón y piña', price: 32000 },
  { name: 'Pizza Pepperoni', category: 'pizza', description: 'Queso y pepperoni', price: 34000 },
  { name: 'Hamburguesa Clásica', category: 'hamburguesa', description: 'Carne, queso, lechuga y tomate', price: 18000 },
  { name: 'Hamburguesa Doble', category: 'hamburguesa', description: 'Doble carne con queso y bacon', price: 22000 },
  { name: 'Tacos de Pollo', category: 'taco', description: '3 tacos con pollo, guacamole y salsa verde', price: 16000 },
  { name: 'Tacos de Carne', category: 'taco', description: '3 tacos con carne asada y salsa', price: 18000 },
  { name: 'Sushi Roll California', category: 'sushi', description: 'Cangrejo, aguacate y pepino', price: 22000 },
  { name: 'Sushi Roll Philadelphia', category: 'sushi', description: 'Salmón, queso crema y aguacate', price: 24000 },
  { name: 'Arepa Rellena', category: 'arepa', description: 'Arepa con queso y jamón', price: 9000 },
  { name: 'Arepa de Pollo', category: 'arepa', description: 'Arepa con pollo desmechado', price: 11000 },
  { name: 'Parrillada Mixta', category: 'parrilla', description: 'Carne, pollo y chorizo', price: 38000 },
  { name: 'Pollo Asado', category: 'pollo', description: 'Pollo asado con papas', price: 25000 },
  { name: 'Ensalada César', category: 'ensalada', description: 'Lechuga, pollo, queso y aderezo', price: 15000 },
  { name: 'Ensalada Griega', category: 'ensalada', description: 'Lechuga, aceitunas, queso feta', price: 12000 },
  { name: 'Combo Familiar', category: 'combo', description: 'Pizza grande + 2 bebidas + papas', price: 48000 },
  { name: 'Combo Individual', category: 'combo', description: 'Hamburguesa + papas + bebida', price: 28000 },
  { name: 'Helado de Vainilla', category: 'postre', description: 'Helado artesanal', price: 7000 },
  { name: 'Tiramisú', category: 'postre', description: 'Postre italiano tradicional', price: 12000 },
  { name: 'Plato Mexicano', category: 'mexicana', description: 'Tacos, guacamole y frijoles', price: 20000 },
  { name: 'Plato de Pasta', category: 'plato', description: 'Pasta con salsa boloñesa', price: 18000 },
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  for (let i = 0; i < 10; i++) {
    const placeRef = db.collection('places').doc();
    const tipo = tiposLugares[i % tiposLugares.length];
    const nombre = nombresLugares[i % nombresLugares.length];
    const categoriasLugar = [getRandom(categorias), getRandom(categorias)];
    await placeRef.set({
      name: nombre,
      type: tipo,
      address: `Calle ${100 + i} #${i}A-45`,
      image: `https://source.unsplash.com/400x300/?${tipo},food,restaurant,${i}`,
      phone: `30012345${i}${i}`,
      description: `Bienvenido a ${nombre}, el mejor lugar de ${tipo}.`,
      isOpen: true,
      categories: categoriasLugar,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // 20 productos por lugar
    for (let j = 0; j < 20; j++) {
      const base = productosBase[j % productosBase.length];
      const prodRef = placeRef.collection('products').doc();
      await prodRef.set({
        ...base,
        image: `https://source.unsplash.com/400x300/?${base.category},food,${j}`,
        available: true,
        tags: [base.category, tipo],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        sizes: base.category === 'pizza' || base.category === 'bebidas' ? [
          { name: 'Personal', price: base.price },
          { name: 'Mediana', price: base.price + 5000 },
          { name: 'Familiar', price: base.price + 10000 },
        ] : [],
        extras: base.category === 'pizza' ? [
          { name: 'Queso extra', price: 4000 },
          { name: 'Tocineta', price: 5000 },
        ] : [],
      });
    }
    console.log(`Lugar ${nombre} y sus productos creados.`);
  }
  console.log('¡Base de datos poblada exitosamente!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); }); 