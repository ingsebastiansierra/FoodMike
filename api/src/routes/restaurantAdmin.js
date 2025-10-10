const express = require('express');
const router = express.Router();
const restaurantAdminController = require('../controllers/restaurantAdminController');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');

// Middleware: Verificar token y rol de administrador de restaurante
router.use(verifyToken);
router.use(requireRole(['administradorRestaurante', 'administrador']));

// Dashboard
router.get('/dashboard', restaurantAdminController.getDashboard);

// Productos
router.get('/products', restaurantAdminController.getProducts);
router.post('/products', restaurantAdminController.createProduct);
router.put('/products/:id', restaurantAdminController.updateProduct);
router.delete('/products/:id', restaurantAdminController.deleteProduct);

// Categorías
router.get('/categories', restaurantAdminController.getCategories);
router.post('/categories', restaurantAdminController.createCategory);

// Pedidos
router.get('/orders', restaurantAdminController.getOrders);
router.put('/orders/:id/status', restaurantAdminController.updateOrderStatus);

// Restaurante
router.put('/restaurant', restaurantAdminController.updateRestaurant);

module.exports = router;
