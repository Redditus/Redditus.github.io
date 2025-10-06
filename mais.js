// Import do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuração Firebase
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

// Elementos do HTML
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

// 📸 Pré-visualização da imagem
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result; // mostra a imagem
    };
    reader.readAsDataURL(file);
  }
});

// 🔹 Enviar para Realtime Database em Base64
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    alert("Por favor, selecione uma imagem primeiro.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Data = reader.result; // string Base64 da imagem

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        try {
          // Salva a string Base64 no Realtime Database
          await update(ref(db, "vendedores/" + uid), {
            documentoPerfil: base64Data
          });

          alert("imagens de perfil salva.");
          window.location.href = "postsVendedores.html"; // redireciona
        } catch (error) {
          alert("Erro ao salvar imagem: " + error.message);
        }
      } else {
        alert("Você precisa estar logado.");
      }
    });
  };

  reader.readAsDataURL(file); // converte para Base64
});
