// Seleciona elementos da interface
const botao = document.getElementById('acao');
const resposta = document.getElementById('resposta');

// Lista de mensagens
const frases = [
  "Processamento concluído com sucesso!",
  "Sistema Z.E.R.O. em ação! ⚙️",
  "Operação executada com eficiência máxima!",
  "Z.E.R.O. pronto para o próximo comando. 🤖"
];

// Quando clicar no botão...
botao.addEventListener('click', async () => {
  // Escolhe uma frase aleatória
  const aleatorio = frases[Math.floor(Math.random() * frases.length)];
  resposta.textContent = aleatorio;

  // Pede permissão de notificação se ainda não foi concedida
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }

  // Mostra a notificação (se permitido)
  if (Notification.permission === "granted") {
    if ("serviceWorker" in navigator) {
      // Usa o Service Worker para exibir a notificação
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification("Z.E.R.O. Notificação", {
        body: aleatorio,
        icon: "icon-192.png",
        badge: "icon-192.png"
      });
    } else {
      // Caso o Service Worker não esteja disponível
      new Notification("Z.E.R.O. Notificação", {
        body: aleatorio,
        icon: "icon-192.png"
      });
    }
  } else {
    alert("Notificações estão bloqueadas. Ative-as para receber alertas do Z.E.R.O.");
  }
});
