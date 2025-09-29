// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:demo",
};

// Check if we're in demo mode
const isDemoMode =
  firebaseConfig.apiKey === "demo-api-key" ||
  firebaseConfig.apiKey.includes("demo");

let app = null;
let db = null;
let storage = null;

if (!isDemoMode) {
  try {
    // Initialize Firebase only if we have real credentials
    app = initializeApp(firebaseConfig);

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Initialize Cloud Storage and get a reference to the service
    storage = getStorage(app);

    // Para desarrollo local con emuladores
    if (
      process.env.REACT_APP_USE_FIREBASE_EMULATORS === "true" &&
      window.location.hostname === "localhost"
    ) {
      try {
        connectFirestoreEmulator(db, "localhost", 8080);
        connectStorageEmulator(storage, "localhost", 9199);
        console.log("🧪 Conectado a emuladores de Firebase");
      } catch (error) {
        console.warn("⚠️ Error al conectar con emuladores:", error);
      }
    }

    console.log("🔥 Firebase inicializado correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error);
  }
} else {
  console.warn("🧪 Modo DEMO activado - Firebase no inicializado");
  console.log("Para usar la aplicación completamente:");
  console.log("1. Crea un proyecto en https://console.firebase.google.com/");
  console.log("2. Habilita Firestore y Storage");
  console.log("3. Actualiza las credenciales en el archivo .env");
}

// Create mock functions for demo mode
const mockFirestoreOperations = {
  collection: () => ({
    addDoc: () => Promise.resolve({ id: "mock-id" }),
    onSnapshot: (callback) => {
      // Return some mock data
      const mockData = {
        forEach: (cb) => {
          // Mock report data
          cb({
            id: "mock-1",
            data: () => ({
              description: "Reporte de prueba en modo demo",
              photoURL: "https://via.placeholder.com/300x200?text=Demo+Report",
              location: { lat: -27.3671, lng: -55.8961 },
              createdAt: { toDate: () => new Date() },
            }),
          });
          cb({
            id: "mock-2",
            data: () => ({
              description: "Otro reporte demo",
              photoURL:
                "https://via.placeholder.com/300x200?text=Demo+Report+2",
              location: { lat: -27.37, lng: -55.89 },
              createdAt: { toDate: () => new Date(Date.now() - 3600000) },
            }),
          });
        },
      };
      setTimeout(() => callback(mockData), 1000);
      return () => {}; // unsubscribe function
    },
  }),
};

const mockStorageOperations = {
  ref: () => ({
    uploadBytes: () =>
      Promise.resolve({
        ref: {
          getDownloadURL: () =>
            Promise.resolve(
              "https://via.placeholder.com/300x200?text=Mock+Upload",
            ),
        },
      }),
  }),
};

// Export Firebase services or mocks
export { app };
export const dbExport = db || mockFirestoreOperations;
export const storageExport = storage || mockStorageOperations;

// For compatibility with existing code
export { dbExport as db, storageExport as storage };

// Export demo mode status
export const isDemo = isDemoMode;

export default app;
