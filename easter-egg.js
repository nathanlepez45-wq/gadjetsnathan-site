(() => {
  const trigger = document.querySelector('#hotdog-trigger');
  if (!trigger) return;
  let clicks = 0, resetTimer, closeTimer, party;
  const storageKey = 'gadjetsnathan-hotdog-mode';
  function setHotdogMode(enabled) {
    document.body.classList.toggle('hotdog-unlocked', enabled);
    try { if (enabled) localStorage.setItem(storageKey, '1'); else localStorage.removeItem(storageKey); } catch {}
    let badge = document.querySelector('.hotdog-mode-badge');
    if (enabled && !badge) {
      badge = document.createElement('button'); badge.className = 'hotdog-mode-badge'; badge.type = 'button';
      badge.setAttribute('aria-label', 'Désactiver le mode secret hot-dog');
      badge.innerHTML = '<span aria-hidden="true">🌭</span><span>Mode secret activé</span><span class="hotdog-mode-off">×</span>';
      badge.addEventListener('click', () => setHotdogMode(false)); document.body.append(badge);
    } else if (!enabled && badge) badge.remove();
  }
  try { setHotdogMode(localStorage.getItem(storageKey) === '1'); } catch { setHotdogMode(false); }
  function playPop() {
    const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return;
    try {
      const audio = new Audio();
      [520,740,980].forEach((frequency,index) => {
        const oscillator=audio.createOscillator(), gain=audio.createGain(), start=audio.currentTime+index*0.11;
        oscillator.type='sine'; oscillator.frequency.setValueAtTime(frequency,start);
        gain.gain.setValueAtTime(0.0001,start); gain.gain.exponentialRampToValueAtTime(0.07,start+0.015); gain.gain.exponentialRampToValueAtTime(0.0001,start+0.16);
        oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(start); oscillator.stop(start+0.17);
      }); setTimeout(()=>audio.close().catch(()=>{}),650);
    } catch {}
  }
  function onEscape(event) { if(event.key==='Escape'&&party) closeParty(); }
  function closeParty() {
    clearTimeout(closeTimer); if(!party)return; const closing=party; party=null;
    document.removeEventListener('keydown',onEscape); closing.classList.add('is-closing');
    setTimeout(()=>closing.remove(),240); trigger.focus({preventScroll:true});
  }
  function launchParty() {
    if(party)return; setHotdogMode(true); party=document.createElement('div'); party.className='hotdog-party';
    party.setAttribute('role','dialog'); party.setAttribute('aria-modal','true'); party.setAttribute('aria-labelledby','hotdog-party-title');
    party.innerHTML='<div class="hotdog-party-card"><button class="hotdog-party-close" type="button" aria-label="Fermer la surprise">×</button><span class="hotdog-party-main" aria-hidden="true">🌭</span><p class="hotdog-party-kicker">EASTER EGG TROUVÉ</p><h2 id="hotdog-party-title">MODE HOT-DOG !</h2><p>Le site vient de passer en mode secret !</p><div class="hotdog-party-reward" aria-hidden="true">🍅　🧀　🌭　✨　🍕</div></div>';
    const confetti=['🌭','🍅','🧀','✨','🍕','⭐','🥒'];
    for(let i=0;i<28;i++) { const bit=document.createElement('span'); bit.className='hotdog-confetti'; bit.textContent=confetti[Math.floor(Math.random()*confetti.length)]; bit.style.left=Math.random()*100+'%'; bit.style.setProperty('--fall-delay',Math.random()*1.8+'s'); bit.style.setProperty('--fall-duration',2.4+Math.random()*2.2+'s'); bit.style.setProperty('--spin',Math.random()*540-270+'deg'); party.append(bit); }
    party.addEventListener('click',event=>{ if(event.target===party||event.target.closest('.hotdog-party-close'))closeParty(); });
    document.addEventListener('keydown',onEscape); document.body.append(party); party.querySelector('.hotdog-party-close').focus({preventScroll:true}); playPop(); closeTimer=setTimeout(closeParty,6200);
  }
  trigger.addEventListener('click',()=>{ if(party)return; clicks++; trigger.classList.remove('hotdog-wiggle'); void trigger.offsetWidth; trigger.classList.add('hotdog-wiggle'); clearTimeout(resetTimer); if(clicks>=5){clicks=0;launchParty();return;} resetTimer=setTimeout(()=>{clicks=0;},2600); });
})();
