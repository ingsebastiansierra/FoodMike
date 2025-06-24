const jwt = require('jsonwebtoken');
const { auth, db } = require('../config/firebase');

// Login y generación de JWT
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    // Para el Admin SDK, necesitamos verificar las credenciales de otra manera
    // Por ahora, vamos a buscar el usuario directamente en Firestore
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // En producción, deberías verificar la contraseña con bcrypt
    // Por ahora, asumimos que si el usuario existe, las credenciales son válidas
    // TODO: Implementar verificación de contraseña

    // Generar JWT
    const token = jwt.sign(
      { 
        uid: userData.uid,
        email: userData.email,
        role: userData.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          uid: userData.uid,
          email: userData.email,
          name: userData.name,
          role: userData.role
        }
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario aún existe en Firestore
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          uid: decoded.uid,
          email: decoded.email,
          role: decoded.role,
          ...userDoc.data()
        }
      }
    });
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Registro y generación de JWT
const register = async (req, res) => {
  try {
    const { email, password, name, role = 'cliente' } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, contraseña y nombre son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }

    // Crear usuario en Firestore (en producción, deberías hashear la contraseña)
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userData = {
      uid,
      email,
      name,
      role,
      createdAt: new Date(),
      isActive: true
    };

    await db.collection('users').doc(uid).set(userData);

    // Generar JWT
    const token = jwt.sign(
      {
        uid: userData.uid,
        email: userData.email,
        role: userData.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  register,
  verifyToken
}; 