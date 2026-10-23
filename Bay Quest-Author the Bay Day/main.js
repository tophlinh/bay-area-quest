const root = document.getElementById('game-container');

const NO_LINES = [
  'No',
  'Are you sure?',
  'Are you really sure?',
  'Bruh come on',
  'Stop being an unc',
  'Think of the corgis :(',
  'Last chance fr',
  'Ok now you\'re just mean',
  'The Bay is crying',
  'Pls pls pls',
  'Just press yes bestie',
];

const OUTINGS = [
  { image: 'assets/image.png', name: 'Corgi cafe', location: 'Financial District' },
  { image: 'assets/image-2.png', imageClass: 'magic-image', name: 'Magic lesson', location: 'A tavern' },
  { image: 'assets/image-3.png', imageClass: 'tarot-image', name: 'Tarot card or astrology reading', location: 'A wizard den' },
  { image: 'assets/image-4.png', name: 'Indonesian coffee (Kopi Kita)', location: 'Marina District' },
  { image: 'assets/image-5.png', name: 'Go on a run', location: '??? uncs run' },
  { image: 'assets/image-6.png', name: 'Surprise me or let Grok bot decide', location: 'recombobulating...' },
];

const music = new Audio('assets/audio/bay-bardcore-adventure.mp3');
music.loop = true;
music.volume = 0.4;
music.preload = 'none';
const jingle = new Audio('assets/audio/yay-jingle.mp3');
jingle.preload = 'none';
let muted = false;
let audioCtx = null;
let audioPrepared = false;

function warmAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx && AudioContextClass) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx?.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
}

function prepareAudio() {
  if (audioPrepared) {
    return;
  }
  audioPrepared = true;
  music.preload = 'auto';
  jingle.preload = 'auto';
  music.load();
  jingle.load();
  warmAudioContext();
  document.removeEventListener('pointerdown', prepareAudio);
  document.removeEventListener('keydown', prepareAudio);
}

document.addEventListener('pointerdown', prepareAudio, { passive: true });
document.addEventListener('keydown', prepareAudio);

function startMusic() {
  if (!muted && music.paused) {
    music.play().catch(() => {});
  }
}

function blip(freq) {
  if (muted) {
    return;
  }
  warmAudioContext();
  if (!audioCtx) {
    return;
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

function playJingle() {
  if (!muted) {
    jingle.currentTime = 0;
    jingle.play().catch(() => {});
  }
}

const muteBtn = document.createElement('button');
muteBtn.id = 'mute';
muteBtn.textContent = '♪ ON';
muteBtn.onclick = (event) => {
  event.stopPropagation();
  muted = !muted;
  muteBtn.textContent = muted ? '♪ OFF' : '♪ ON';
  if (muted) {
    music.pause();
    jingle.pause();
    jingle.currentTime = 0;
  } else {
    music.play().catch(() => {});
  }
};

function render(html) {
  root.innerHTML = '';
  root.appendChild(muteBtn);
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = html;
  root.appendChild(card);
  return card;
}

function showIntro() {
  let noCount = 0;
  const card = render(`
    <h1><img class="intro-scroll" src="assets/image-7.png" alt="">Adventure awaits!<br>Join Victoria/Linh's quest in the Bay?</h1>
    <p>a cozy little invitation</p>
    <div class="row">
      <button class="yes">Yes!</button>
      <button class="no">No</button>
    </div>`);
  const yes = card.querySelector('.yes');
  const no = card.querySelector('.no');
  yes.onclick = () => {
    startMusic();
    playJingle();
    confetti();
    showOutings();
  };
  no.onclick = () => {
    startMusic();
    noCount += 1;
    blip(220 - Math.min(noCount, 8) * 15);
    no.textContent = NO_LINES[Math.min(noCount, NO_LINES.length - 1)];
    yes.style.fontSize = `${14 + noCount * 4}px`;
    yes.style.padding = `${14 + noCount * 3}px ${22 + noCount * 5}px`;
    no.style.fontSize = `${Math.max(8, 14 - noCount)}px`;
  };
}

function showOutings() {
  const picked = new Set();
  const card = render(`
    <h1>Yay!! Pick our quests</h1>
    <p>choose as many as your heart desires</p>
    <div class="grid">
      ${OUTINGS.map((o, i) => `<button class="opt" data-i="${i}"><span>${o.image ? `<img class="outing-image ${o.imageClass || ''}" src="${o.image}" alt="${o.name} pixel art">` : o.icon}</span>${o.name}</button>`).join('')}
    </div>
    <div class="row" style="min-height:0;margin-top:24px">
      <button class="yes go">Let's go! →</button>
    </div>`);
  card.querySelectorAll('.opt').forEach((btn) => {
    btn.onclick = () => {
      const index = Number(btn.dataset.i);
      if (picked.has(index)) {
        picked.delete(index);
        btn.classList.remove('sel');
        blip(330);
      } else {
        picked.add(index);
        btn.classList.add('sel');
        blip(660);
      }
    };
  });
  card.querySelector('.go').onclick = () => {
    if (picked.size === 0) {
      blip(150);
      card.querySelector('p').textContent = 'pick at least one, silly!';
      return;
    }
    playJingle();
    confetti();
    showFinal([...picked].map((i) => OUTINGS[i]));
  };
}

function showFinal(choices) {
  const routePoints = choices.map((_, index) => (
    index < 3 ? [150 + index * 300, 90] : [750 - (index - 3) * 300, 230]
  ));
  const routePath = routePoints
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ');
  const card = render(`
    <h1>Quest accepted! <img class="mushroom-icon" src="assets/image-10.png" alt="mushroom"></h1>
    <p>A little storybook route across the Bay:</p>
    <div class="story-map" role="group" aria-label="A storybook map of your route across the Bay">
      <svg class="story-map-art" viewBox="0 0 900 320" preserveAspectRatio="none" aria-hidden="true">
        <path class="map-shore" d="M0 0H900V42C820 57 786 28 715 42S591 57 516 39 382 55 305 40 166 56 89 38 25 49 0 43Z" />
        <path class="map-shore map-shore-south" d="M0 282C95 265 156 295 241 278S404 263 485 283 642 265 721 282 843 264 900 278V320H0Z" />
        <path class="map-contour" d="M0 58C95 43 155 71 247 54S420 71 501 54 685 70 770 52 856 67 900 55" />
        <path class="map-contour" d="M0 267C96 249 163 279 249 261S409 278 494 261 680 278 768 260 858 274 900 263" />
        <path class="map-bridge" d="M344 20V62M556 20V62M344 28Q450 76 556 28M344 23L450 58L556 23M344 28L450 36L556 28" />
        <path class="map-boat" d="M54 184H94L87 193H63Z M73 151V182L91 176Z M788 177H833L825 186H797Z M812 148V175L830 169Z" />
        <text class="map-label" x="450" y="18" text-anchor="middle">GOLDEN GATE</text>
        <text class="map-label" x="24" y="307">FERRY PIER</text>
        <text class="map-label" x="876" y="307" text-anchor="end">SAUSALITO SHORE</text>
        <path class="map-route-halo" d="${routePath}" />
        <path class="map-route" d="${routePath}" />
        ${routePoints.map(([x, y]) => `<circle class="map-stop-marker" cx="${x}" cy="${y}" r="11" />`).join('')}
      </svg>
      <div class="story-stops" role="list">
        ${choices.map((c, index) => `<article class="story-stop" role="listitem">
          <span class="story-stop-number">${String(index + 1).padStart(2, '0')}</span>
          ${c.image ? `<img class="story-stop-image" src="${c.image}" alt="${c.name} pixel art">` : `<span class="story-stop-icon">${c.icon}</span>`}
          <span class="story-stop-copy">
            <span class="story-waypoint">${c.location}</span>
            <span class="story-stop-name">${c.name}</span>
          </span>
        </article>`).join('')}
      </div>
    </div>
    <p class="story-map-note">see you soon, unc adventurer ✨✨✨</p>
    <button class="no again">Start over</button>`);
  card.classList.add('itinerary-screen');
  card.querySelector('.again').onclick = () => {
    blip(440);
    showIntro();
  };
  window.ProgressLogger?.logProgress('quest_complete', { choices: choices.map((c) => c.name) });
}

function confetti() {
  const colors = ['#efb9ad', '#b9d7b5', '#f4dcae', '#d9c9df', '#a9cbc5'];
  for (let i = 0; i < 80; i += 1) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    root.appendChild(piece);
    const fall = window.innerHeight + 40;
    piece.animate(
      [
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: `translate(${(Math.random() - 0.5) * 200}px, ${fall}px) rotate(${Math.random() * 720}deg)` },
      ],
      { duration: 1500 + Math.random() * 1500, easing: 'steps(30)' },
    ).onfinish = () => piece.remove();
  }
}

showIntro();
