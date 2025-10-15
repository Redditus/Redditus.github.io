// Seleciona elementos da interface
const botao = document.getElementById('acao');
const resposta = document.getElementById('resposta');

// Lista de mensagens
const frases = [
  "osso ajudar em alguma coisa senhor ?",
  "hoje esta um belo dia lara uma caminhada"
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
// === Z.E.R.O. - Notificações automáticas diárias ===

// Pede permissão para enviar notificações
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Função para agendar uma notificação
function agendarNotificacao(hora, minuto, mensagem) {
  const agora = new Date();
  const alvo = new Date();

  alvo.setHours(hora, minuto, 0, 0);

  // Se a hora já passou hoje, agenda para amanhã
  if (alvo.getTime() < agora.getTime()) {
    alvo.setDate(alvo.getDate() + 1);
  }

  const tempoRestante = alvo.getTime() - agora.getTime();

  setTimeout(() => {
    mostrarNotificacao(mensagem);
    // Reagenda para o dia seguinte automaticamente
    agendarNotificacao(hora, minuto, mensagem);
  }, tempoRestante);
}

// Função para mostrar a notificação
function mostrarNotificacao(texto) {
  if (Notification.permission === "granted") {
    new Notification("Z.E.R.O. 🤖", {
      body: texto,
      icon: "icon-192.png",
    });
  }
}

// === Agenda as mensagens diárias ===
agendarNotificacao(6, 0, "Bom dia, senhor! ☀️ Que tenha um ótimo dia!");
agendarNotificacao(19, 50, "Boa tarde, senhor! 🍽️ Hora de recarregar as energias!");
agendarNotificacao(18, 0, "Boa noite, senhor! 🌙 Desejo-lhe um ótimo descanso!");
