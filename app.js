const botao = document.getElementById('acao');
const resposta = document.getElementById('resposta');

botao.addEventListener('click', () => {
  const frases = [
    "Processamento concluído com sucesso!",
    "Sistema Z.E.R.O. em ação! ⚙️",
    "Operação executada com eficiência máxima!",
    "Z.E.R.O. pronto para o próximo comando. 🤖"
  ];
  const aleatorio = frases[Math.floor(Math.random() * frases.length)];
  resposta.textContent = aleatorio;
});
