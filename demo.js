(() => {
  const canvases = [...document.querySelectorAll(".demo-canvas")];
  const colors = ["#4285f4", "#ea4335", "#fbbc05", "#4285f4", "#34a853", "#ea4335"];

  function rounded(ctx, x, y, w, h, radius, fill, stroke) {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }

  function frame(ctx, kind, time) {
    const w = 960, h = 540;
    const fade = Math.max(0, Math.min(1, (time - .8) / 1.3));
    const bg = ctx.createLinearGradient(0, 0, w, h);
    if (kind === "theme") { bg.addColorStop(0, `rgb(${Math.round(245 - 65 * fade)},${Math.round(244 - 15 * fade)},${Math.round(250 - 5 * fade)})`); bg.addColorStop(1, `rgb(${Math.round(230 - 35 * fade)},${Math.round(239 - 5 * fade)},${Math.round(250 + 3 * fade)})`); }
    else { bg.addColorStop(0, "#f8f7fb"); bg.addColorStop(1, "#e8e6f0"); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#f0eff4"; ctx.fillRect(0, 0, w, 38);
    ["#ef6b79", "#edc15b", "#64be82"].forEach((color, i) => { ctx.beginPath(); ctx.fillStyle = color; ctx.arc(20 + i * 19, 19, 5, 0, Math.PI * 2); ctx.fill(); });
    rounded(ctx, 115, 8, 720, 22, 11, "#fff", "#dedce5");
    ctx.fillStyle = "#777486"; ctx.font = "12px Arial"; ctx.fillText("🔒  https://www.google.com", 132, 23);
    if (kind === "theme") {
      ctx.fillStyle = `rgba(29, 61, 91, ${fade * .45})`; ctx.fillRect(0, 38, w, h - 38);
      if (fade > .4) {
        const glow = ctx.createRadialGradient(760, 130, 10, 760, 130, 260); glow.addColorStop(0, "#ffd585aa"); glow.addColorStop(1, "#ffd58500"); ctx.fillStyle = glow; ctx.fillRect(470, 38, 490, 310);
        ctx.fillStyle = "#fff"; ctx.font = "700 24px Arial"; ctx.fillText("Fond : coucher de soleil 🌇", 40, 90);
      }
    }
    const logoY = kind === "music" ? 120 : 185;
    ctx.font = "500 72px Arial"; ctx.textAlign = "left";
    const logo = "Google"; let x = kind === "music" ? 375 : 357;
    [...logo].forEach((letter, i) => { ctx.fillStyle = colors[i]; ctx.fillText(letter, x, logoY); x += letter === "l" ? 20 : 48; });
    rounded(ctx, 220, logoY + 38, 520, 52, 26, "#fff", "#dedce5");
    ctx.fillStyle = "#7c7a87"; ctx.font = "18px Arial"; ctx.fillText("Rechercher sur Google", 252, logoY + 71);

    if (kind === "stickers") {
      const count = Math.max(0, Math.min(5, Math.floor((time - .7) * 1.05)));
      const positions = [[176, 228], [390, 368], [696, 241], [765, 432], [257, 425]];
      positions.slice(0, count).forEach(([px, py], i) => {
        const size = 74 + 9 * Math.sin(time * 5 + i);
        ctx.save(); ctx.translate(px, py); ctx.rotate((i % 2 ? -.12 : .1));
        ctx.beginPath(); ctx.fillStyle = "#fff"; ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = "#df5038"; ctx.stroke(); ctx.font = `${size * .64}px Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(i % 2 ? "🍕" : "🌭", 0, 2); ctx.restore();
      });
      if (time > 4.4) { rounded(ctx, 326, 468, 310, 44, 12, "#ffcf33"); ctx.fillStyle = "#2d2411"; ctx.font = "700 18px Arial"; ctx.textAlign = "center"; ctx.fillText("Supprimer les autres", 481, 496); }
    }

    if (kind === "music") {
      rounded(ctx, 166, 221, 628, 240, 18, "#201b32");
      ctx.fillStyle = "#fff"; ctx.font = "700 23px Arial"; ctx.fillText("🎹 Mini studio", 198, 258);
      const names = ["🥁 Kick", "👏 Clap", "✨ Hat", "🎹 Mélodie"];
      const pattern = [[1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0],[1,1,1,1,1,1,1,1],[1,0,0,1,0,0,1,0]];
      const step = Math.floor(time * 2.3) % 8;
      names.forEach((name, row) => {
        const yy = 293 + row * 39; ctx.textAlign = "left"; ctx.font = "13px Arial"; ctx.fillStyle = "#ddd"; ctx.fillText(name, 199, yy + 15);
        for (let col = 0; col < 8; col++) {
          const xx = 292 + col * 55; rounded(ctx, xx, yy, 42, 28, 7, pattern[row][col] ? (col === step ? "#d6bdff" : "#a36af5") : "#39334b");
        }
      });
      ctx.fillStyle = "#cbb7ff"; ctx.font = "700 13px Arial"; ctx.fillText("110 BPM", 670, 450);
    }
    ctx.textAlign = "center"; ctx.fillStyle = kind === "theme" && fade > .5 ? "#fff" : "#5b5870"; ctx.font = "600 17px Arial";
    const caption = kind === "theme" ? "Choisis une couleur ou une ambiance" : kind === "stickers" ? "Un clic, un sticker qui pop !" : "Active des cases, puis appuie sur Lecture";
    ctx.fillText(caption, 480, 515);
  }

  function createDemo(canvas) {
    const kind = canvas.dataset.demo; const ctx = canvas.getContext("2d");
    canvas.width = 960; canvas.height = 540;
    const started = performance.now();
    const paint = now => { frame(ctx, kind, ((now - started) / 1000) % 7); requestAnimationFrame(paint); };
    requestAnimationFrame(paint);

    const video = canvas.parentElement.querySelector(".demo-video");
    if (!canvas.captureStream || !window.MediaRecorder) return;
    try {
      const stream = canvas.captureStream(24);
      const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(type => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks = [];
      recorder.addEventListener("dataavailable", event => { if (event.data.size) chunks.push(event.data); });
      recorder.addEventListener("stop", () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunks, { type: mimeType || "video/webm" });
        video.src = URL.createObjectURL(blob); video.hidden = false; canvas.hidden = true;
        video.addEventListener("loadeddata", () => { video.currentTime = 0; }, { once: true });
      }, { once: true });
      recorder.start(); window.setTimeout(() => { if (recorder.state === "recording") recorder.stop(); }, 7000);
    } catch { /* Le canvas animé reste visible si l’enregistrement vidéo est indisponible. */ }
  }

  canvases.forEach(createDemo);
})();
