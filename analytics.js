(() => {
  // Set only after the private Cloudflare Worker is live.
  const API_URL = "";
  const choiceKey = "gadjetsnathan_stats_choice";
  const ownerKey = "gadjetsnathan_creator_device";
  const tokenKey = "gadjetsnathan_admin_token";
  const banner = document.getElementById("stats-consent");
  const adminPanel = document.getElementById("creator-panel");
  const status = document.getElementById("creator-status");
  const results = document.getElementById("creator-results");
  const tokenInput = document.getElementById("creator-token");

  if (new URLSearchParams(location.search).has("creator")) {
    localStorage.setItem(ownerKey, "yes");
    history.replaceState(null, "", `${location.pathname}${location.hash}`);
  }

  function sendEvent(event) {
    if (!API_URL || localStorage.getItem(ownerKey) === "yes" || localStorage.getItem(choiceKey) !== "yes") return;
    fetch(`${API_URL}/api/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
      mode: "cors"
    }).catch(() => {});
  }

  if (API_URL && !localStorage.getItem(ownerKey) && !localStorage.getItem(choiceKey)) banner.hidden = false;
  document.getElementById("stats-accept")?.addEventListener("click", () => {
    localStorage.setItem(choiceKey, "yes");
    banner.hidden = true;
    sendEvent("page_view");
  });
  document.getElementById("stats-refuse")?.addEventListener("click", () => {
    localStorage.setItem(choiceKey, "no");
    banner.hidden = true;
  });
  document.getElementById("stats-change")?.addEventListener("click", () => {
    localStorage.removeItem(choiceKey);
    if (API_URL && localStorage.getItem(ownerKey) !== "yes") banner.hidden = false;
  });
  if (localStorage.getItem(choiceKey) === "yes") sendEvent("page_view");
  document.querySelectorAll('a[download], a[href$=".zip"]').forEach(link => {
    link.addEventListener("click", () => sendEvent("download_click"));
  });

  document.getElementById("creator-link")?.addEventListener("click", event => {
    event.preventDefault();
    localStorage.setItem(ownerKey, "yes");
    adminPanel.hidden = false;
    tokenInput?.focus();
  });
  document.getElementById("creator-close")?.addEventListener("click", () => { adminPanel.hidden = true; });
  document.getElementById("creator-logout")?.addEventListener("click", () => {
    sessionStorage.removeItem(tokenKey);
    if (tokenInput) tokenInput.value = "";
    results.replaceChildren();
    status.textContent = "Déconnecté. Ce navigateur reste exclu des compteurs.";
  });

  document.getElementById("creator-login")?.addEventListener("click", async () => {
    if (!API_URL) { status.textContent = "Le compteur privé sera activé après le déploiement du service."; return; }
    const token = tokenInput.value.trim();
    if (!token) { status.textContent = "Saisis le secret créateur configuré dans Cloudflare."; tokenInput.focus(); return; }
    status.textContent = "Connexion…";
    try {
      const response = await fetch(`${API_URL}/api/stats`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 401 ? "Secret incorrect." : "Le service ne répond pas.");
      const data = await response.json();
      sessionStorage.setItem(tokenKey, token);
      renderStats(data);
      status.textContent = "Connecté. Ce navigateur est exclu des prochains compteurs.";
    } catch (error) { status.textContent = error.message || "Connexion impossible."; }
  });

  function renderStats(data) {
    const labels = { page_view: "Visites consenties", download_click: "Clics sur Télécharger" };
    const counts = Object.fromEntries((data.totals || []).map(row => [row.event, row.count]));
    results.replaceChildren();
    for (const [key, label] of Object.entries(labels)) {
      const card = document.createElement("article"); card.className = "creator-stat";
      const value = document.createElement("strong"); value.textContent = String(counts[key] || 0);
      const caption = document.createElement("span"); caption.textContent = label;
      card.append(value, caption); results.append(card);
    }
    const note = document.createElement("p"); note.className = "creator-note";
    note.textContent = "Les visites sont comptées après accord statistique. Les téléchargements comptent les clics, pas la fin du transfert. Les données sont des totaux journaliers, sans information personnelle.";
    results.append(note);
  }
})();
