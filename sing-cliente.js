import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Seleciona botão
const btnCadastrar = document.getElementById("cadastraCliente");

// Cria spinner diretamente via JS
const spinner = document.createElement("div");
spinner.style.border = "4px solid #f3f3f3";
spinner.style.borderTop = "4px solid #3498db";
spinner.style.borderRadius = "50%";
spinner.style.width = "20px";
spinner.style.height = "20px";
spinner.style.display = "inline-block";
spinner.style.marginLeft = "10px";
spinner.style.animation = "spin 1s linear infinite";

// Adiciona spinner ao lado do botão
btnCadastrar.parentNode.insertBefore(spinner, btnCadastrar.nextSibling);
spinner.style.display = "none"; // começa escondido

// Adiciona keyframes via JS
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

btnCadastrar.addEventListener("click", async () => {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const dataNascimento = document.getElementById("dataNascimento").value;
  const telefone = document.getElementById("telefone").value;
  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirmaSenha").value;

  if (senha !== confirmaSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  // Ativa spinner e desativa botão
  spinner.style.display = "inline-block";
  btnCadastrar.disabled = true;

  try {
    // Cria conta no Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Salva dados no Realtime Database
    await set(ref(db, "usuarios/clientes/" + user.uid), {
      nome: nome,
      email: email,
      dataNascimento: dataNascimento,
      telefone: telefone,
      tipo: "cliente"
    });

    alert("Conta criada com sucesso!");
    spinner.style.display = "none";
    btnCadastrar.disabled = false;

    window.location.href = "homeCleinte.html"; // redireciona após cadastro
  } catch (error) {
    alert("Erro: " + error.message);
    spinner.style.display = "none";
    btnCadastrar.disabled = false;
  }
});
