import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyClHUnGH4I0hazZTUW2X4LcDxJujAK1Zpw",
  authDomain: "foodmike-autenticacion.firebaseapp.com",
  projectId: "foodmike-autenticacion",
  storageBucket: "foodmike-autenticacion.appspot.com",
  messagingSenderId: "6935061837",
  appId: "1:6935061837:web:4bf86395fcf67d29ea0304",
  measurementId: "G-T3QWPTHG2T"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Configurar Firestore
const db = firebase.firestore();

// Configurar reglas de Firestore para desarrollo
if (__DEV__) {
  db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
  });
}

export { firebase, db }; 