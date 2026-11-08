// js/auth.js

// 1. Importar la configuración de Firebase
import { auth, db } from './firebase-config.js';

// 2. Importar las funciones específicas de Firebase Authentication y Realtime Database
import { 
  fetchSignInMethodsForEmail, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Importar el controlador de módulos de interfaz
import { showStep } from './app.js';

// Variables temporales para el registro por pasos
let currentEmail = "";
let registerData = {};

// Captura de elementos del DOM
const formCheckEmail = document.getElementById('form-check-email');
const formLogin = document.getElementById('form-login');
const formRegPersonal = document.getElementById('form-reg-personal');
const formRegAvatar = document.getElementById('form-reg-avatar');
const formRegFinal = document.getElementById('form-reg-final');
const formForgot = document.getElementById('form-forgot');

// Botones de navegación
document.getElementById('btn-change-email-1')?.addEventListener('click', () => showStep('step-email'));
document.getElementById('btn-change-email-2')?.addEventListener('click', () => showStep('step-email'));
document.getElementById('btn-back-to-personal')?.addEventListener('click', () => showStep('step-reg-personal'));
document.getElementById('btn-back-to-avatar')?.addEventListener('click', () => showStep('step-reg-avatar'));
document.getElementById('btn-go-forgot')?.addEventListener('click', () => {
  document.getElementById('forgot-email').value = currentEmail;
  showStep('step-forgot');
});
document.getElementById('btn-back-to-login')?.addEventListener('click', () => showStep('step-login'));
document.getElementById('btn-logout')?.addEventListener('click', () => signOut(auth));

// --------------------------------------------------------------------------
// ETAPA 1: VERIFICAR SI EL CORREO EXISTE EN FIREBASE AUTH
// --------------------------------------------------------------------------
formCheckEmail?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('input-check-email').value.trim();
  
  if (!emailInput) return alert("Por favor ingresa un correo válido.");

  currentEmail = emailInput;

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, currentEmail);

    if (signInMethods.length > 0) {
      // Si el correo existe en Firebase -> Mostrar pantalla de Login
      document.getElementById('display-login-email').textContent = currentEmail;
      showStep('step-login');
    } else {
      // Si el correo NO existe -> Iniciar módulo de registro
      document.getElementById('display-reg-email').textContent = currentEmail;
      showStep('step-reg-personal');
    }
  } catch (error) {
    console.error("Error al verificar correo:", error);
    alert("Error al verificar el correo: " + error.message);
  }
});

// --------------------------------------------------------------------------
// ETAPA 2A: INICIAR SESIÓN
// --------------------------------------------------------------------------
formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('login-password').value;

  try {
    await signInWithEmailAndPassword(auth, currentEmail, password);
    // El cambio de vista lo maneja automáticamente onAuthStateChanged
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Contraseña incorrecta o error de acceso.");
  }
});

// --------------------------------------------------------------------------
// ETAPA 2B-1: CAPTURAR DATOS PERSONALES
// --------------------------------------------------------------------------
formRegPersonal?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  registerData.nombres = document.getElementById('reg-nombres').value;
  registerData.apellidos = document.getElementById('reg-apellidos').value;
  registerData.username = document.getElementById('reg-username').value;
  registerData.edad = parseInt(document.getElementById('reg-edad').value);
  registerData.genero = document.getElementById('reg-genero').value;

  showStep('step-reg-avatar');
});

// --------------------------------------------------------------------------
// ETAPA 2B-2: CAPTURAR SELECCIÓN DE AVATAR
// --------------------------------------------------------------------------
formRegAvatar?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const avatarSelected = document.querySelector('input[name="avatarSeleccionado"]:checked');
  registerData.fotoPerfil = avatarSelected ? avatarSelected.value : "";

  showStep('step-reg-final');
});

// --------------------------------------------------------------------------
// ETAPA 2B-3: CONTRASEÑA FINAL Y GUARDADO EN REALTIME DATABASE
// --------------------------------------------------------------------------
formRegFinal?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('reg-password').value;
  const passwordConfirm = document.getElementById('reg-password-confirm').value;
  const terms = document.getElementById('reg-terms').checked;

  if (password !== passwordConfirm) return alert("Las contraseñas no coinciden.");
  if (!terms) return alert("Debes aceptar los términos y condiciones.");

  const tieneMascotasRadio = document.querySelector('input[name="tieneMascotas"]:checked').value;
  const tieneExperienciaRadio = document.querySelector('input[name="tieneExperiencia"]:checked').value;

  registerData.cuenteMascotas = tieneMascotasRadio === "Si";
  registerData.experienciaAnimales = tieneExperienciaRadio === "Si";
  registerData.experienciaExplicacion = document.getElementById('reg-experiencia-desc').value;

  try {
    // 1. Crear el usuario en Firebase Authentication (Genera el UID único)
    const userCredential = await createUserWithEmailAndPassword(auth, currentEmail, password);
    const uid = userCredential.user.uid;

    // 2. Crear la estructura JSON para la Realtime Database
    const datosUsuario = {
      Nombres: registerData.nombres,
      Apellidos: registerData.apellidos,
      "Nombre de usuario": registerData.username,
      Correo: currentEmail,
      Genero: registerData.genero,
      Edad: registerData.edad,
      Foto_Perfil: registerData.fotoPerfil,
      Rol: "Persona Normal",
      Experiencia_Animales: registerData.experienciaAnimales,
      Experiencia_Explicacion: registerData.experienciaExplicacion,
      Cuente_Mascotas: registerData.cuenteMascotas
    };

    // 3. Guardar bajo el nodo "Usuarios/UID_FIREBASE"
    await set(ref(db, `Usuarios/${uid}`), datosUsuario);
    alert("¡Cuenta creada exitosamente!");

  } catch (error) {
    console.error("Error al registrar:", error);
    alert("Error al completar el registro: " + error.message);
  }
});

// --------------------------------------------------------------------------
// ETAPA 3: RECUPERACIÓN DE CONTRASEÑA
// --------------------------------------------------------------------------
formForgot?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await sendPasswordResetEmail(auth, currentEmail);
    alert("Se ha enviado un enlace de recuperación a tu correo.");
    showStep('step-login');
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// --------------------------------------------------------------------------
// ETAPA 4: OBSERVADOR DE SESIÓN ACTIVA (Mantiene al usuario logueado)
// --------------------------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const snapshot = await get(ref(db, `Usuarios/${user.uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        document.getElementById('dash-user-name').textContent = `${data.Nombres} ${data.Apellidos}`;
        document.getElementById('dash-user-email').textContent = data.Correo;
        document.getElementById('dash-user-role').textContent = data.Rol;

        const avatarImg = document.getElementById('dash-user-avatar');
        const iconDefault = document.getElementById('dash-user-icon');

        if (data.Foto_Perfil) {
          avatarImg.src = data.Foto_Perfil;
          avatarImg.classList.remove('hidden');
          iconDefault.classList.add('hidden');
        }
      }
    } catch (err) {
      console.error("Error leyendo datos del usuario:", err);
    }
    showStep('step-dashboard');
  } else {
    showStep('step-email');
  }
});