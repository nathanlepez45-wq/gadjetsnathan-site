(() => {
  const trigger = document.querySelector('#hotdog-trigger');
  if (!trigger) return;

  let clicks = 0;
  let resetTimer;
  let closeTimer;
  let party;

  function playPop() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const audio = new AudioContextClass();
      [520, 740, 980].forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + index * 0.11;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.07, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.17);
      });
      window.setTimeout(() => audio.close().catch(() => {}), 650);
    } catch {
      // The surprise still works when Web Audio is unavailable.
    }
  }

  function closeParty() {
    window.clearTimeout(closeTimer);
    if (!party) return;
    const closingParty = party;
    party = null;
    document.removeEventListener('keydown', onEscape);
    closingParty.classList.add('is-closing');
    window.setTimeout(() => closingParty.remove(), 240);
    trigger.focus({ preventScroll: true });
  }

  function launchParty() {
    if (party) return;
    party = document.createElement('div');
    party.className = 'hotdog-party';
    party.setAttribute('role', 'dialog');
    party.setAttribute('aria-modal', 'true');
    party.setAttribute('aria-labelledby', 'hotdog-party-title');
    party.innerHTML = '<div class="hotdog-party-card"><button class="hotdog-party-close" type="button" aria-label="Fermer la surprise">×</button><span class="hotdog-party-main" aria-hidden="true">🌭</span><p class="hotdog-party-kicker">EASTER EGG TROUVÉ</p><h2 id="hotdog-party-title">MODE HOT-DOG !</h2><p>Un peu de moutarde, beaucoup de fun.</p><div class="hotdog-party-reward" aria-hidden="true">🍅　🧀　🌭　✨　🍕</div></div>';

    const confetti = ['🌭', '🍅', '🧀', '✨', '🍕', '⭐', '🥒'];
    for (let i = 0; i < 28; i += 1) {
      const bit = document.createElement('span');
      bit.className = 'hotdog-confetti';
      bit.textContent = confetti[Math.floor(Math.random() * confetti.length)];
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.setProperty('--fall-delay', `${Math.random() * 1.8}s`);
      bit.style.setProperty('--fall-duration', `${2.4 + Math.random() * 2.2}s`);
      bit.style.setProperty('--spin', `${Math.random() * 540 - 270}deg`);
      party.append(bit);
    }

    party.addEventListener('click', (event) => {
      if (event.target === party || event.target.closest('.hotdog-party-close')) closeParty();
    });
    document.addEventListener('keydown', onEscape);
    document.body.append(party);
    party.querySelector('.hotdog-party-close').focus({ preventScroll: true });
    playPop();
    closeTimer = window.setTimeout(closeParty, 6200);
  }

  function onEscape(event) {
    if (event.key === 'Escape' && party) {
      closeParty();
      document.removeEventListener('keydown', onEscape);
      trigger.focus({ preventScroll: true });
    }
  }

  trigger.addEventListener('click', () => {
    if (party) return;
    clicks += 1;
    trigger.classList.remove('hotdog-wiggle');
    void trigger.offsetWidth;
    trigger.classList.add('hotdog-wiggle');
    window.clearTimeout(resetTimer);

    if (clicks >= 5) {
      clicks = 0;
      launchParty();
      return;
    }

    resetTimer = window.setTimeout(() => { clicks = 0; }, 2600);
  });

})();
