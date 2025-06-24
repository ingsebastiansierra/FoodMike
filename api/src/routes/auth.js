const express = require('express');
const router = express.Router();
const { login, register, verifyToken } = require('../controllers/authController');

// POST /api/auth/login - Login y obtener JWT
router.post('/login', login);

// POST /api/auth/register - Registro y obtener JWT
router.post('/register', register);

// GET /api/auth/verify - Verificar token
router.get('/verify', verifyToken);

module.exports = router; 