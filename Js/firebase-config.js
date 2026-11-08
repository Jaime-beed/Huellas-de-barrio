// js/firebase-config.js

// 1. Importar los módulos principales de Firebase desde el CDN oficial (v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 2. Reemplaza este objeto con tus datos reales obtenidos en el Paso 1
const firebaseConfig = {
  apiKey: "AIzaSyDR1lKAm62E3HV68tXK7YOqJoilm7TRP9A",
  authDomain: "huellasdebarrio-d9ecd.firebaseapp.com",
  databaseURL: "https://huellasdebarrio-d9ecd-default-rtdb.firebaseio.com",
  projectId: "huellasdebarrio-d9ecd",
  storageBucket: "huellasdebarrio-d9ecd.firebasestorage.app",
  messagingSenderId: "533945961770",
  appId: "1:533945961770:web:0337b6eb660ae042df6253"
};
// 3. Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// 4. Exportar las herramientas para usarlas en auth.js y otros módulos
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);