const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

    // Buscar usuario por email (con índice optimizado)
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email.toLowerCase()) // Normalizar email
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

    // Verificar contraseña con bcrypt
    if (!userData.passwordHash) {
      // Usuario antiguo sin hash, migrar automáticamente
      console.log('🔄 Migrando usuario antiguo:', email);
      try {
        // Intentar autenticar con Firebase Auth para verificar credenciales
        await auth.getUserByEmail(email);
        
        // Hash de la contraseña actual (en producción, pedir nueva contraseña)
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // Actualizar usuario con hash
        await userDoc.ref.update({ 
          passwordHash,
          email: email.toLowerCase(),
          updatedAt: new Date()
        });
        
        console.log('✅ Usuario migrado exitosamente');
      } catch (firebaseError) {
        console.error('❌ Error migrando usuario:', firebaseError);
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }
    } else {
      // Verificar contraseña hasheada
      const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }
    }

    // Generar JWT con información mínima necesaria
    const token = jwt.sign(
      { 
        uid: userData.uid,
        email: userData.email,
        role: userData.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
      },
      process.env.JWT_SECRET,
      { 
        algorithm: 'HS256',
        issuer: 'food-mike-api',
        audience: 'food-mike-app'
      }
    );

    // Respuesta sin información sensible
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          uid: userData.uid,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isActive: userData.isActive
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

// Obtener información del usuario actual
const getCurrentUser = async (req, res) => {
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
    
    // Obtener datos actualizados del usuario desde Firestore
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const userData = userDoc.data();

    res.status(200).json({
      success: true,
      data: {
        user: {
          uid: userData.uid,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt,
          isActive: userData.isActive
        }
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo usuario actual:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Registro y generación de JWT
const register = async (req, res) => {
  try {
    const { email, password, name, phone, role = 'cliente', profilePhoto } = req.body;
    // Validaciones mejoradas
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, contraseña y nombre son requeridos'
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de email inválido'
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }
    const validRoles = ['cliente', 'administrador'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Rol inválido'
      });
    }
    const normalizedEmail = email.toLowerCase().trim();
    // Verificar si el usuario ya existe en Firebase Auth
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(normalizedEmail);
      return res.status(409).json({
        success: false,
        error: 'El email ya está registrado'
      });
    } catch (firebaseError) {
      if (firebaseError.code !== 'auth/user-not-found') {
        console.error('❌ Error verificando usuario en Firebase Auth:', firebaseError);
        return res.status(500).json({ success: false, error: 'Error verificando usuario en Firebase Auth', details: firebaseError.message });
      }
    }
    // Crear usuario en Firebase Auth
    try {
      firebaseUser = await auth.createUser({
        email: normalizedEmail,
        password,
        displayName: name,
        phoneNumber: phone || undefined,
        photoURL: profilePhoto || undefined
      });
    } catch (createError) {
      console.error('❌ Error creando usuario en Firebase Auth:', createError);
      let errorMsg = 'Error creando usuario en Firebase Auth';
      if (createError.code === 'auth/email-already-exists') {
        errorMsg = 'El email ya está registrado';
      } else if (createError.code === 'auth/invalid-password') {
        errorMsg = 'La contraseña no es válida';
      } else if (createError.code === 'auth/invalid-email') {
        errorMsg = 'El email no es válido';
      } else if (createError.code === 'auth/invalid-phone-number') {
        errorMsg = 'El número de teléfono no es válido';
      }
      return res.status(400).json({ success: false, error: errorMsg, details: createError.message });
    }
    const uid = firebaseUser.uid;
    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const now = new Date();
    const userData = {
      uid,
      email: normalizedEmail,
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      role,
      passwordHash,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      lastLoginAt: null,
      loginCount: 0,
      profilePhoto: profilePhoto || '',
      profile: {
        bio: '',
        address: '',
      }
    };
    // Guardar usuario en Firestore con el mismo UID
    try {
      await db.collection('users').doc(uid).set(userData);
    } catch (firestoreError) {
      // Si falla Firestore, elimina el usuario de Auth para evitar inconsistencias
      try {
        await auth.deleteUser(uid);
      } catch (deleteError) {
        console.error('❌ Error eliminando usuario de Auth tras fallo en Firestore:', deleteError);
      }
      console.error('❌ Error guardando usuario en Firestore:', firestoreError);
      return res.status(500).json({ success: false, error: 'Error guardando usuario en Firestore', details: firestoreError.message });
    }
    // Generar JWT
    const token = jwt.sign(
      {
        uid: userData.uid,
        email: userData.email,
        role: userData.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
      },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS256',
        issuer: 'food-mike-api',
        audience: 'food-mike-app'
      }
    );
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          uid: userData.uid,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          isActive: userData.isActive,
          createdAt: userData.createdAt,
          profilePhoto: userData.profilePhoto,
          profile: userData.profile
        }
      }
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

module.exports = {
  login,
  register,
  verifyToken,
  getCurrentUser
}; 