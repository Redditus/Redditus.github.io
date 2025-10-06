import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Elementos do formulário
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao");
const precoInput = document.getElementById("number");
const moedasSelect = document.getElementById("moedas");
const imagemInput = document.getElementById("imagem");
const button = document.getElementById("button");

// Botão de adicionar foto e preview
const btnAdicionarFoto = document.getElementById("btnAdicionarFoto");
const previewImagem = document.getElementById("previewImagem");

// 🔹 Spinner de processamento
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
spinner.style.display = "none";

// Adiciona keyframes para rodinha
const style = document.createElement("style");
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// 🔹 Ao clicar no botão, abre o input file
btnAdicionarFoto.addEventListener("click", () => {
  imagemInput.click();
});

// 🔹 Mostra preview da imagem selecionada
imagemInput.addEventListener("change", () => {
  const file = imagemInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImagem.src = e.target.result;
      previewImagem.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// 🔹 Evento de submit do formulário
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const preco = precoInput.value;
  const moeda = moedasSelect.value;
  const file = imagemInput.files[0];

  if (!titulo || !descricao || !preco || !file) {
    alert("Por favor, preencha todos os campos e selecione uma imagem.");
    return;
  }

  spinner.style.display = "inline-block";
  button.disabled = true;

  // 🔹 Verifica se o usuário está logado
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Você precisa estar logado para publicar um post!");
      spinner.style.display = "none";
      button.disabled = false;
      return;
    }

    const uid = user.uid;

    // 🔹 Converte imagem para Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const imagemBase64 = reader.result;

      try {
        // 🔹 Cria post no Firebase Realtime Database dentro do vendedor
        await push(ref(db, `vendedores/${uid}/posts`), {
          titulo: titulo,
          descricao: descricao,
          preco: preco,
          moeda: moeda,
          imagem: imagemBase64,
          dataCriacao: new Date().toISOString()
        });

        alert("Post publicado com sucesso!");
        // 🔹 Limpa o formulário
        tituloInput.value = "";
        descricaoInput.value = "";
        precoInput.value = "";
        moedasSelect.value = "$";
        imagemInput.value = "";
        previewImagem.src = "";
        previewImagem.style.display = "none";
      } catch (error) {
        alert("Erro ao publicar post: " + error.message);
      } finally {
        spinner.style.display = "none";
        button.disabled = false;
      }
    };

    reader.readAsDataURL(file); // Converte para Base64
  });
});
