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
  'pizza', 'bebidas', 'porciones', 'hamburguesa', 'taco', 'sushi', 'postre', 'ensalada', 'combo', 'acompañamiento'
];

const productosBase = [
  // Platos principales
  { name: 'Pizza Hawaiana', category: 'pizza', description: 'Queso, jamón y piña', price: 32000 },
  { name: 'Pizza Pepperoni', category: 'pizza', description: 'Queso y pepperoni', price: 34000 },
  { name: 'Hamburguesa Clásica', category: 'hamburguesa', description: 'Carne, queso, lechuga y tomate', price: 18000 },
  { name: 'Tacos de Pollo', category: 'taco', description: '3 tacos con pollo, guacamole y salsa verde', price: 16000 },
  { name: 'Sushi Roll California', category: 'sushi', description: 'Cangrejo, aguacate y pepino', price: 22000 },
  { name: 'Arepa Rellena', category: 'arepa', description: 'Arepa con queso y jamón', price: 9000 },
  { name: 'Parrillada Mixta', category: 'parrilla', description: 'Carne, pollo y chorizo', price: 38000 },
  { name: 'Ensalada César', category: 'ensalada', description: 'Lechuga, pollo, queso y aderezo', price: 15000 },
  { name: 'Combo Familiar', category: 'combo', description: 'Pizza grande + 2 bebidas + papas', price: 48000 },
  { name: 'Helado de Vainilla', category: 'postre', description: 'Helado artesanal', price: 7000 },
  // Bebidas
  { name: 'Coca-Cola 400ml', category: 'bebidas', description: 'Bebida gaseosa', price: 4000 },
  { name: 'Jugo Natural', category: 'bebidas', description: 'Jugo de fruta natural', price: 5000 },
  { name: 'Agua Botella', category: 'bebidas', description: 'Agua mineral 600ml', price: 3500 },
  // Porciones y adicionales
  { name: 'Porción de papas', category: 'porciones', description: 'Papas a la francesa', price: 6000 },
  { name: 'Porción de guacamole', category: 'porciones', description: 'Guacamole fresco', price: 5000 },
  { name: 'Adicional de queso', category: 'porciones', description: 'Queso extra para tu plato', price: 4000 },
  { name: 'Adicional de tocineta', category: 'porciones', description: 'Tocineta crocante', price: 5000 },
  { name: 'Porción de arroz', category: 'porciones', description: 'Arroz blanco', price: 3000 },
  { name: 'Porción de ensalada', category: 'porciones', description: 'Ensalada fresca', price: 4000 },
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