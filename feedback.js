(() => {
  const form = document.querySelector("#feedback-form");
  const help = document.querySelector("#feedback-help");
  if (!form || !help) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const kind = form.elements.kind.value.trim();
    const message = form.elements.message.value.trim();
    if (!message) return;
    const subject = `[gadjetsnathan] ${kind}`;
    const body = `${kind}\n\n${message}\n\nEnvoyé depuis le site gadjetsnathan.`;
    const mailto = `mailto:nathan.lepez45@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    help.classList.remove("error");
    help.textContent = "Ouverture de ton application e-mail… Si rien ne s’ouvre, clique sur l’adresse e-mail affichée à gauche et copie ton message.";
    window.location.href = mailto;
  });
})();
