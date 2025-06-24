const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const db = admin.firestore();

// Obtener todos los lugares
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('places').get();
    const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(places);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener productos de un lugar
router.get('/:placeId/products', async (req, res) => {
  try {
    const { placeId } = req.params;
    const snapshot = await db.collection('places').doc(placeId).collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener un producto específico de un lugar
router.get('/:placeId/products/:productId', async (req, res) => {
  try {
    const { placeId, productId } = req.params;
    const doc = await db.collection('places').doc(placeId).collection('products').doc(productId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router; 