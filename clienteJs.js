import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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
const storage = getStorage(app);

const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

// 📸 Pré-visualização da imagem
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// 🔹 Enviar imagem para Firebase
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = fileInput.files[0];
  if (!file) {
    alert("Por favor, selecione uma imagem primeiro.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      const storagePath = `vendedores/${uid}/documentoPerfil.jpg`;
      const imgRef = storageRef(storage, storagePath);

      try {
        // Faz upload para o Firebase Storage
        await uploadBytes(imgRef, file);
        const url = await getDownloadURL(imgRef);

        // Salva o link da imagem no Realtime Database
        await update(ref(db, "usuarios/vendedores/" + uid), {
          documentoPerfil: url
        });

        alert("Imagem enviada com sucesso!");

        // Reset
        fileInput.value = "";
        preview.src = "camera.png";

        // Redireciona
        window.location.href = "sucesso.html";
      } catch (error) {
        alert("Erro ao enviar imagem: " + error.message);
      }
    } else {
      alert("Você precisa estar logado para cadastrar a imagem!");
    }
  });
});
