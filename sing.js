// Import do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Config Firebase
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
const nomeInput = document.getElementById('nome');
const enderecoInput = document.getElementById('endereco');
const emailInput = document.getElementById('email');
const dataInput = document.getElementById('dataNascimento');
const telefoneInput = document.getElementById('telefone');
const senhaInput = document.getElementById('senha');
const confirmaSenhaInput = document.getElementById('confirmaSenha');
const btnCadastrar = document.getElementById('Cadastra');

// Criar spinner diretamente via JS
const spinner = document.createElement("div");
spinner.style.border = "4px solid #f3f3f3";
spinner.style.borderTop = "4px solid #3498db";
spinner.style.borderRadius = "50%";
spinner.style.width = "24px";
spinner.style.height = "24px";
spinner.style.animation = "spin 1s linear infinite";
spinner.style.marginLeft = "10px";
spinner.style.display = "none";

// Anexa spinner ao lado do botão
btnCadastrar.parentNode.insertBefore(spinner, btnCadastrar.nextSibling);

// Animação via CSS injetada
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// Função para validar número de telefone brasileiro
function validarTelefone(telefone) {
  const regex = /^\+55\s?\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
  return regex.test(telefone);
}

// Evento de cadastro
btnCadastrar.addEventListener('click', () => {
  const nome = nomeInput.value.trim();
  const endereco = enderecoInput.value.trim();
  const email = emailInput.value.trim();
  const dataNascimento = dataInput.value;
  const telefone = telefoneInput.value.trim();
  const senha = senhaInput.value;
  const confirmaSenha = confirmaSenhaInput.value;

  // Ativa spinner
  spinner.style.display = "inline-block";
  btnCadastrar.disabled = true;

  // Valida campos
  if (!nome || !endereco || !email || !dataNascimento || !telefone || !senha || !confirmaSenha) {
    alert('Por favor, preencha todos os campos!');
    resetLoader();
    return;
  }

  if (!validarTelefone(telefone)) {
    alert('Digite um número de telefone brasileiro válido! Exemplo: +55 (11) 91234-5678');
    resetLoader();
    return;
  }

  if (senha !== confirmaSenha) {
    alert('As senhas não coincidem!');
    resetLoader();
    return;
  }

  // Cria usuário no Firebase Auth
  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;

      return set(ref(database, 'vendedores/' + uid), {
        nome: nome,
        endereco: endereco,
        email: email,
        telefone: telefone,
        dataNascimento: dataNascimento,
        fotoPerfil: ""
      });
    })
    .then(() => {
      alert("Conta criada com sucesso!");
      resetLoader();
      // Redireciona
      window.location.href = "VendedorFotos.html";
    })
    .catch((error) => {
      console.error('Erro:', error);
      alert(error.message);
      resetLoader();
    });
});

// Função auxiliar para esconder spinner
function resetLoader() {
  spinner.style.display = "none";
  btnCadastrar.disabled = false;
}
