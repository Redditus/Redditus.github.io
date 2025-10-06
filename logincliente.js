import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
const db = getDatabase(app);

// Função para criar spinner
function createSpinner(button) {
  const spinner = document.createElement("div");
  spinner.style.border = "4px solid #f3f3f3";
  spinner.style.borderTop = "4px solid #3498db";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "20px";
  spinner.style.height = "20px";
  spinner.style.display = "inline-block";
  spinner.style.marginLeft = "10px";
  spinner.style.animation = "spin 1s linear infinite";
  button.parentNode.insertBefore(spinner, button.nextSibling);
  return spinner;
}

// Adiciona keyframes
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// 🔹 Login com E-mail e Senha
const btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Preencha e-mail e senha!");
    return;
  }

  const spinner = createSpinner(btnLogin);
  btnLogin.disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const uid = userCredential.user.uid;

    const snap = await get(ref(db, "usuarios/clientes/" + uid));
    if (snap.exists()) {
      alert("Login bem-sucedido como cliente!");
      window.location.href = "homeCleinte.html";
    } else {
      alert("Esta conta não pertence a um cliente.");
    }
  } catch (error) {
    alert("Erro no login: " + error.message);
  } finally {
    spinner.remove();
    btnLogin.disabled = false;
  }
});

// 🔹 Login com Google
const btnGoogle = document.getElementById("btnGoogle");
btnGoogle.addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  const spinner = createSpinner(btnGoogle);
  btnGoogle.disabled = true;

  try {
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;

    const snap = await get(ref(db, "usuarios/clientes/" + uid));
    if (snap.exists()) {
      window.location.href = "sucesso.html";
    } else {
      alert("Conta Google não cadastrada como cliente.");
    }
  } catch (error) {
    alert("Erro no login Google: " + error.message);
  } finally {
    spinner.remove();
    btnGoogle.disabled = false;
  }
});

// 🔹 Login com Apple
const btnApple = document.getElementById("btnApple");
btnApple.addEventListener("click", async () => {
  const provider = new OAuthProvider("apple.com");
  const spinner = createSpinner(btnApple);
  btnApple.disabled = true;

  try {
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;

    const snap = await get(ref(db, "usuarios/clientes/" + uid));
    if (snap.exists()) {
      window.location.href = "sucesso.html";
    } else {
      alert("Conta Apple não cadastrada como cliente.");
    }
  } catch (error) {
    alert("Erro no login Apple: " + error.message);
  } finally {
    spinner.remove();
    btnApple.disabled = false;
  }
});
