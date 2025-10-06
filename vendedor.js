// Importações Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Config do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "bartolomeu-cruz.firebaseapp.com",
  databaseURL: "https://bartolomeu-cruz-default-rtdb.firebaseio.com",
  projectId: "bartolomeu-cruz",
  storageBucket: "bartolomeu-cruz.appspot.com",
  messagingSenderId: "408863884951",
  appId: "1:408863884951:web:13e8c2282139c1307dcbd2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Pega o elemento container dos produtos
const boxProdutos = document.getElementById('boxDosmeusProdutos');

// Simulação de usuário logado
const usuarioLogado = "usuario123"; // Troque pelo ID do vendedor logado

// Função para criar cards de produtos
function criarProdutoCard(produto) {
  const div = document.createElement('div');
  div.classList.add('produto-card');

  const img = document.createElement('img');
  img.src = produto.imagem || "Logo.png";
  img.alt = "Produto";
  img.classList.add('produto-img');

  const h3 = document.createElement('h3');
  h3.textContent = produto.titulo || '';

  const p = document.createElement('p');
  p.textContent = produto.descricao || '';

  const preco = document.createElement('p');
  preco.textContent = produto.preco ? "Preço: " + produto.preco : '';

  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(p);
  div.appendChild(preco);

  return div;
}

// Buscar produtos do vendedor logado
const produtosRef = ref(db, 'produtos');
onValue(produtosRef, snapshot => {
  boxProdutos.innerHTML = ''; // limpa o container
  snapshot.forEach(childSnap => {
    const produto = childSnap.val();
    // Verifica se o produto pertence ao vendedor logado
    if (produto.usuario === usuarioLogado) {
      const card = criarProdutoCard(produto);
      boxProdutos.appendChild(card);
    }
  });
});
