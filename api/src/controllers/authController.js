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

    // Verificar credenciales con Firebase Auth
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Obtener datos adicionales del usuario desde Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : { role: 'cliente' };

    // Generar JWT
    const token = jwt.sign(
      { 
        uid: user.uid,
        email: user.email,
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
          uid: user.uid,
          email: user.email,
          name: userData.name || user.displayName,
          role: userData.role
        }
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }

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
    // Crear usuario en Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    // Guardar datos en Firestore
    const userData = {
      uid: user.uid,
      email,
      name,
      role,
      createdAt: new Date(),
      isActive: true
    };
    await db.collection('users').doc(user.uid).set(userData);
    // Generar JWT
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
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
    if (error.code === 'auth/email-already-in-use') {
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }
    if (error.code === 'auth/weak-password') {
      return res.status(400).json({
        success: false,
        error: 'La contraseña es muy débil'
      });
    }
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