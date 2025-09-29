#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to ask questions
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

// Log with colors
const log = (message, color = 'reset') => {
  console.log(colors[color] + message + colors.reset);
};

// Main setup function
async function setup() {
  log('\n🦟 Vigilantes del Aedes - Configuración del Proyecto', 'cyan');
  log('=========================================================\n', 'cyan');

  log('Este script te ayudará a configurar tu proyecto paso a paso.\n', 'blue');

  // Check if .env already exists
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');

  if (fs.existsSync(envPath)) {
    const overwrite = await askQuestion('Ya existe un archivo .env. ¿Quieres sobrescribirlo? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      log('Configuración cancelada. El archivo .env existente se mantiene.', 'yellow');
      rl.close();
      return;
    }
  }

  log('📋 Configuración de Firebase', 'green');
  log('Necesitarás las credenciales de tu proyecto Firebase.\n', 'yellow');

  // Collect Firebase configuration
  const firebaseConfig = {};

  firebaseConfig.apiKey = await askQuestion('🔑 API Key: ');
  firebaseConfig.authDomain = await askQuestion('🏠 Auth Domain (ej: mi-proyecto.firebaseapp.com): ');
  firebaseConfig.projectId = await askQuestion('📝 Project ID: ');
  firebaseConfig.storageBucket = await askQuestion('🗄️  Storage Bucket (ej: mi-proyecto.appspot.com): ');
  firebaseConfig.messagingSenderId = await askQuestion('📨 Messaging Sender ID: ');
  firebaseConfig.appId = await askQuestion('🆔 App ID: ');

  // Optional configurations
  log('\n⚙️  Configuraciones Opcionales', 'green');

  const enableAnalytics = await askQuestion('📊 ¿Habilitar Analytics? (Y/n): ');
  const enableEmulators = await askQuestion('🧪 ¿Usar emuladores de Firebase en desarrollo? (y/N): ');

  // Map configuration
  log('\n🗺️  Configuración del Mapa', 'green');
  const useDefaultLocation = await askQuestion('📍 ¿Usar ubicación por defecto de Posadas? (Y/n): ');

  let mapConfig = {
    lat: -27.3671,
    lng: -55.8961,
    zoom: 13
  };

  if (useDefaultLocation.toLowerCase() === 'n' || useDefaultLocation.toLowerCase() === 'no') {
    mapConfig.lat = parseFloat(await askQuestion('🌍 Latitud por defecto: ')) || -27.3671;
    mapConfig.lng = parseFloat(await askQuestion('🌍 Longitud por defecto: ')) || -55.8961;
    mapConfig.zoom = parseInt(await askQuestion('🔍 Zoom por defecto (1-18): ')) || 13;
  }

  // Create .env content
  const envContent = `# Firebase Configuration - Vigilantes del Aedes
# Generado automáticamente por setup.js

REACT_APP_FIREBASE_API_KEY=${firebaseConfig.apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
REACT_APP_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
REACT_APP_FIREBASE_APP_ID=${firebaseConfig.appId}

# Environment
REACT_APP_ENVIRONMENT=development

# Firebase Emulators
REACT_APP_USE_FIREBASE_EMULATORS=${(enableEmulators.toLowerCase() === 'y' || enableEmulators.toLowerCase() === 'yes') ? 'true' : 'false'}

# Analytics
REACT_APP_ENABLE_ANALYTICS=${(enableAnalytics.toLowerCase() !== 'n' && enableAnalytics.toLowerCase() !== 'no') ? 'true' : 'false'}

# PWA Configuration
REACT_APP_PWA_NAME=Vigilantes del Aedes
REACT_APP_PWA_SHORT_NAME=Vigilantes Aedes
REACT_APP_PWA_DESCRIPTION=La red ciudadana que protege a Posadas

# Map Configuration
REACT_APP_DEFAULT_LAT=${mapConfig.lat}
REACT_APP_DEFAULT_LNG=${mapConfig.lng}
REACT_APP_DEFAULT_ZOOM=${mapConfig.zoom}

# Features
REACT_APP_ENABLE_OFFLINE_MODE=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_ENABLE_BACKGROUND_SYNC=true

# Generated on: ${new Date().toISOString()}
`;

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent);
    log('\n✅ Archivo .env creado exitosamente!', 'green');
  } catch (error) {
    log('\n❌ Error al crear el archivo .env:', 'red');
    log(error.message, 'red');
    rl.close();
    return;
  }

  // Update firebase.js with environment variables
  const firebaseJsPath = path.join(process.cwd(), 'src', 'firebase.js');
  if (fs.existsSync(firebaseJsPath)) {
    const updateFirebaseConfig = await askQuestion('\n🔧 ¿Actualizar src/firebase.js para usar variables de entorno? (Y/n): ');

    if (updateFirebaseConfig.toLowerCase() !== 'n' && updateFirebaseConfig.toLowerCase() !== 'no') {
      const firebaseJsContent = `// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Para desarrollo local con emuladores
if (process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true' && window.location.hostname === 'localhost') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🧪 Conectado a emuladores de Firebase');
  } catch (error) {
    console.warn('⚠️ Error al conectar con emuladores:', error);
  }
}

// Verificar configuración
if (!firebaseConfig.apiKey) {
  console.error('❌ Error: Firebase no está configurado correctamente. Verifica tu archivo .env');
}

export default app;
`;

      try {
        fs.writeFileSync(firebaseJsPath, firebaseJsContent);
        log('✅ Archivo firebase.js actualizado!', 'green');
      } catch (error) {
        log('❌ Error al actualizar firebase.js:', 'red');
        log(error.message, 'red');
      }
    }
  }

  // Display next steps
  log('\n🎉 ¡Configuración completa!', 'green');
  log('\n📝 Próximos pasos:', 'cyan');
  log('1. Configura las reglas de seguridad en Firebase Console:', 'yellow');
  log('   • Firestore: Permitir lectura pública y escritura controlada', 'yellow');
  log('   • Storage: Permitir subida de imágenes (max 10MB)', 'yellow');
  log('\n2. Ejecuta el proyecto:', 'yellow');
  log('   npm start', 'bright');
  log('\n3. Para producción:', 'yellow');
  log('   npm run build', 'bright');
  log('\n4. Para desplegar:', 'yellow');
  log('   firebase deploy', 'bright');

  if (enableEmulators.toLowerCase() === 'y' || enableEmulators.toLowerCase() === 'yes') {
    log('\n🧪 Para usar emuladores de Firebase:', 'cyan');
    log('   firebase emulators:start', 'bright');
  }

  log('\n📚 Consulta el README.md para más información detallada.', 'blue');
  log('\n🦟 ¡Gracias por contribuir a la salud pública de Posadas!', 'magenta');

  rl.close();
}

// Run setup if called directly
if (require.main === module) {
  setup().catch((error) => {
    log('\n❌ Error durante la configuración:', 'red');
    log(error.message, 'red');
    process.exit(1);
  });
}

module.exports = { setup };
