import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// 🔥 Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsP7lNqu-tDpJxpsyv8t1DW0M_u2EAE3o",
  authDomain: "bartolomeu-cruz.firebaseapp.com",
  databaseURL: "https://bartolomeu-cruz-default-rtdb.firebaseio.com",
  projectId: "bartolomeu-cruz",
  storageBucket: "bartolomeu-cruz.appspot.com",
  messagingSenderId: "408863884951",
  appId: "1:408863884951:web:13e8c2282139c1307dcbd2"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Seleciona elementos do formulário
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const btnLogin = document.getElementById('btnLogin');
const btnGoogle = document.getElementById('btnGoogle');
const btnApple = document.getElementById('btnApple');

// --- Cria spinner via JS ---
const spinner = document.createElement("div");
spinner.style.border = "4px solid #f3f3f3";
spinner.style.borderTop = "4px solid #3498db";
spinner.style.borderRadius = "50%";
spinner.style.width = "20px";
spinner.style.height = "20px";
spinner.style.display = "inline-block";
spinner.style.marginLeft = "10px";
spinner.style.animation = "spin 1s linear infinite";

// Adiciona spinner ao lado do botão de login
btnLogin.parentNode.insertBefore(spinner, btnLogin.nextSibling);
spinner.style.display = "none";

// Adiciona keyframes via JS
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// --- Login com E-mail/Senha ---
btnLogin.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  if (!email || !senha) {
    alert('Preencha e-mail e senha!');
    return;
  }

  spinner.style.display = "inline-block";
  btnLogin.disabled = true;

  signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      spinner.style.display = "none";
      btnLogin.disabled = false;
      const user = userCredential.user;
      window.location.href = "postsVendedores.html";
    })
    .catch((error) => {
      spinner.style.display = "none";
      btnLogin.disabled = false;
      alert(error.message);
    });
});

// --- Login com Google ---
btnGoogle.addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  spinner.style.display = "inline-block";
  btnGoogle.disabled = true;
  signInWithRedirect(auth, provider);
});

// --- Login com Apple ---
btnApple.addEventListener('click', () => {
  const provider = new OAuthProvider('apple.com');
  spinner.style.display = "inline-block";
  btnApple.disabled = true;
  signInWithRedirect(auth, provider);
});

// --- Processa resultado de redirect ---
getRedirectResult(auth)
  .then((result) => {
    spinner.style.display = "none";
    btnGoogle.disabled = false;
    btnApple.disabled = false;

    if (result) {
      const user = result.user;
      const uid = user.uid;

      get(ref(database, 'vendedores/' + uid))
        .then((snapshot) => {
          if (!snapshot.exists()) {
            set(ref(database, 'vendedores/' + uid), {
              nome: user.displayName || '',
              email: user.email,
              telefone: '',
              dataNascimento: ''
            });
          }
          window.location.href = "/postsVendedores.html";
        })
        .catch((error) => console.error('Erro DB:', error));
    }
  })
  .catch((error) => {
    spinner.style.display = "none";
    btnGoogle.disabled = false;
    btnApple.disabled = false;
    console.error('Erro login redirect:', error);
    alert(error.message);
  });
