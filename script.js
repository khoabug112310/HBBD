/**
 * HAPPY BIRTHDAY ANH ĐẶNG THÀNH NGUYÊN
 * Complete Interactive Logic, Particle Engines & Mini-Games
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. WEB AUDIO API SYNTHESIZER (MUSIC & SFX)
  // ==========================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.isPlayingMusic = false;
      this.musicTimer = null;
      this.currentNoteIndex = 0;
      this.isMuted = false;

      // File nhạc MP3 chính
      this.bgMusic = new Audio('assets/audio/birthday-song.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.75;
      
      // Happy Birthday Melody (Notes & Durations)
      // C4, D4, E4, F4, G4, A4, B4, C5...
      this.notes = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
        'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
        'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99
      };

      this.birthdayMelody = [
        { note: 'G4', dur: 0.4 }, { note: 'G4', dur: 0.2 }, { note: 'A4', dur: 0.6 }, { note: 'G4', dur: 0.6 },
        { note: 'C5', dur: 0.6 }, { note: 'B4', dur: 1.0 },
        { note: 'G4', dur: 0.4 }, { note: 'G4', dur: 0.2 }, { note: 'A4', dur: 0.6 }, { note: 'G4', dur: 0.6 },
        { note: 'D5', dur: 0.6 }, { note: 'C5', dur: 1.0 },
        { note: 'G4', dur: 0.4 }, { note: 'G4', dur: 0.2 }, { note: 'G5', dur: 0.6 }, { note: 'E5', dur: 0.6 },
        { note: 'C5', dur: 0.6 }, { note: 'B4', dur: 0.6 }, { note: 'A4', dur: 0.8 },
        { note: 'F5', dur: 0.4 }, { note: 'F5', dur: 0.2 }, { note: 'E5', dur: 0.6 }, { note: 'C5', dur: 0.6 },
        { note: 'D5', dur: 0.6 }, { note: 'C5', dur: 1.2 }
      ];
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, duration = 0.3, type = 'sine', gainVal = 0.15) {
      if (!this.ctx || this.isMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio play error:', e);
      }
    }

    playFireworkSound() {
      this.init();
      if (!this.ctx || this.isMuted) return;
      // Low boom + noise
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    }

    playPopSound() {
      this.init();
      this.playTone(600, 0.1, 'sine', 0.25);
    }

    playTickSound() {
      this.init();
      this.playTone(850, 0.04, 'triangle', 0.12);
    }

    playWindBlow() {
      this.init();
      this.playTone(220, 0.6, 'sine', 0.1);
    }

    playFanfare() {
      this.init();
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      chord.forEach((note, i) => {
        setTimeout(() => this.playTone(note, 0.5, 'triangle', 0.2), i * 140);
      });
    }

    toggleMusic() {
      this.init();
      if (this.isPlayingMusic) {
        this.stopMusic();
        return false;
      } else {
        this.startMusic();
        return true;
      }
    }

    startMusic() {
      this.init();
      this.isPlayingMusic = true;
      if (this.bgMusic) {
        this.bgMusic.play().catch(e => {
          console.warn('Trình duyệt chặn autoplay hoặc cần tương tác, chuyển sang giai điệu dự phòng:', e);
          this.playNextMelodyNote();
        });
      } else {
        this.playNextMelodyNote();
      }
    }

    stopMusic() {
      this.isPlayingMusic = false;
      if (this.bgMusic) {
        this.bgMusic.pause();
      }
      if (this.musicTimer) {
        clearTimeout(this.musicTimer);
        this.musicTimer = null;
      }
    }

    playNextMelodyNote() {
      if (!this.isPlayingMusic) return;
      const noteObj = this.birthdayMelody[this.currentNoteIndex];
      const freq = this.notes[noteObj.note];
      
      this.playTone(freq, noteObj.dur * 0.9, 'sine', 0.15);

      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.birthdayMelody.length;
      const waitTime = noteObj.dur * 650; // Tempo

      this.musicTimer = setTimeout(() => {
        this.playNextMelodyNote();
      }, waitTime);
    }
  }

  const audioEngine = new SoundEngine();

  // ==========================================
  // 2. FIREWORKS CANVAS ENGINE
  // ==========================================
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas.getContext('2d');
  let fireworks = [];
  let particles = [];

  function resizeCanvases() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
    petalsCanvas.width = window.innerWidth;
    petalsCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvases);

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.018 + 0.012;
      this.size = Math.random() * 3.2 + 1.5;
      this.gravity = 0.08;
    }

    update() {
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function launchFirework(startX = null, targetY = null) {
    const x = startX || Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
    const y = targetY || Math.random() * fwCanvas.height * 0.4 + fwCanvas.height * 0.15;
    
    // Choose celebratory color palette
    const palettes = [
      ['#ffd700', '#ffae19', '#fff'],
      ['#ff4d6d', '#ff758c', '#ffb3c1'],
      ['#70e000', '#38b000', '#ccff33'],
      ['#00f5d4', '#00bbf9', '#9b5de5'],
      ['#f15bb5', '#fee440', '#00f5d4']
    ];
    const chosenPalette = palettes[Math.floor(Math.random() * palettes.length)];

    for (let i = 0; i < 70; i++) {
      const color = chosenPalette[Math.floor(Math.random() * chosenPalette.length)];
      particles.push(new FireworkParticle(x, y, color));
    }

    audioEngine.playFireworkSound();
  }

  function renderFireworks() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(fwCtx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(renderFireworks);
  }

  // ==========================================
  // 3. FALLING ROSE PETALS CANVAS ENGINE
  // ==========================================
  const petalsCanvas = document.getElementById('petalsCanvas');
  const ptCtx = petalsCanvas.getContext('2d');
  let petals = [];
  let petalDensity = 32;

  class RosePetal {
    constructor() {
      this.reset();
      this.y = Math.random() * window.innerHeight; // initial spread
    }

    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = -20;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 1.6 + 1.0;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.angle = Math.random() * 360;
      this.spinSpeed = (Math.random() - 0.5) * 2;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.03 + 0.01;
      this.opacity = Math.random() * 0.4 + 0.6;
      this.color = Math.random() > 0.3 ? '#ff4d6d' : '#c9184a';
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle * Math.PI / 180) * 1.2 + this.speedX;
      this.angle += this.spinSpeed;
      this.flip += this.flipSpeed;

      if (this.y > window.innerHeight + 30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.scale(Math.cos(this.flip), 1);
      ctx.globalAlpha = this.opacity;
      
      // Draw realistic petal curve
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
      
      const grad = ctx.createLinearGradient(0, 0, 0, this.size);
      grad.addColorStop(0, '#ff758c');
      grad.addColorStop(1, this.color);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  function initPetals() {
    petals = [];
    for (let i = 0; i < petalDensity; i++) {
      petals.push(new RosePetal());
    }
  }

  function renderPetals() {
    ptCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
    for (let p of petals) {
      p.update();
      p.draw(ptCtx);
    }
    requestAnimationFrame(renderPetals);
  }

  // Click anywhere to burst fireworks
  document.addEventListener('click', (e) => {
    // Avoid triggering if clicking on input, button or link
    if (e.target.closest('button, input, textarea, a, .memory-card, .floating-balloon')) return;
    launchFirework(e.clientX, e.clientY);
  });

  // Start Canvas Loops
  resizeCanvases();
  initPetals();
  renderFireworks();
  renderPetals();

  // ==========================================
  // 4. FLOATING CONTROL BUTTONS
  // ==========================================
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const triggerFireworkBtn = document.getElementById('triggerFireworkBtn');
  const triggerPetalBtn = document.getElementById('triggerPetalBtn');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  musicToggleBtn.addEventListener('click', () => {
    const isPlaying = audioEngine.toggleMusic();
    musicToggleBtn.classList.toggle('active', isPlaying);
  });

  triggerFireworkBtn.addEventListener('click', () => {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => launchFirework(), i * 220);
    }
  });

  triggerPetalBtn.addEventListener('click', () => {
    // Increase density temporarily
    for (let i = 0; i < 20; i++) {
      petals.push(new RosePetal());
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // 5. INTRO GIFT OPENING MODAL
  // ==========================================
  const giftIntroModal = document.getElementById('giftIntroModal');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const giftBoxContainer = document.getElementById('giftBoxContainer');

  function openGiftEvent() {
    audioEngine.init();
    audioEngine.startMusic();
    musicToggleBtn.classList.add('active');

    // Launch celebratory barrage
    for (let i = 0; i < 6; i++) {
      setTimeout(() => launchFirework(), i * 250);
    }

    giftIntroModal.classList.add('hide-modal');
  }

  openGiftBtn.addEventListener('click', openGiftEvent);
  giftBoxContainer.addEventListener('click', openGiftEvent);

  // ==========================================
  // 6. CAKE BLOWING & SECRET LETTER
  // ==========================================
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const flames = document.querySelectorAll('.flame');
  const candleWishStatus = document.getElementById('candleWishStatus');
  const secretEnvelope = document.getElementById('secretEnvelope');
  let isCandleBlown = false;

  function blowCandles() {
    if (isCandleBlown) return;
    isCandleBlown = true;

    audioEngine.playWindBlow();

    flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.add('extinguished');
      }, index * 90);
    });

    candleWishStatus.innerHTML = '🎉 <strong style="color: var(--gold-primary);">Điều ước đã được gửi tới vũ trụ!</strong> Bức thư bí mật đã mở ra bên dưới!';
    blowCandleBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã Thổi Nến Thành Công!';
    blowCandleBtn.style.opacity = '0.7';

    setTimeout(() => {
      audioEngine.playFanfare();
      for (let i = 0; i < 5; i++) {
        setTimeout(() => launchFirework(), i * 200);
      }
      secretEnvelope.classList.add('revealed');
      secretEnvelope.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 700);
  }

  blowCandleBtn.addEventListener('click', blowCandles);
  flames.forEach(f => f.addEventListener('click', blowCandles));

  // ==========================================
  // 7. PHOTO GALLERY FILTERS & LIGHTBOX
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.btn-zoom-photo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-img');
      lightboxImg.src = imgSrc;
      lightboxModal.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });

  // ==========================================
  // 8. MINI-GAMES ZONE
  // ==========================================
  
  // Game Tab Navigation
  const gameTabs = document.querySelectorAll('.game-tab-btn');
  const gamePanels = document.querySelectorAll('.game-panel');

  gameTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gameTabs.forEach(t => t.classList.remove('active'));
      gamePanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const game = tab.getAttribute('data-game');
      if (game === 'wheel') document.getElementById('gamePanelWheel').classList.add('active');
      if (game === 'memory') {
        document.getElementById('gamePanelMemory').classList.add('active');
        initMemoryGame();
      }
      if (game === 'balloons') document.getElementById('gamePanelBalloons').classList.add('active');
    });
  });

  // --- GAME 1: LUCKY WHEEL ---
  const wheelCanvas = document.getElementById('wheelCanvas');
  const wheelCtx = wheelCanvas.getContext('2d');
  const spinWheelBtn = document.getElementById('spinWheelBtn');
  const wheelResultBox = document.getElementById('wheelResultBox');
  const wheelWinText = document.getElementById('wheelWinText');

  const prizes = [
    { label: '☕ 1 Ly Highland', color: '#ff4d6d' },
    { label: '🍱 Ăn Trưa Free', color: '#2a1b52' },
    { label: '👑 Miễn Việc Vặt', color: '#f5c518' },
    { label: '🎁 Quà Bí Mật', color: '#7209b7' },
    { label: '💌 1 Lời Khen Team', color: '#ff758c' },
    { label: '🎬 Vé Xem Phim', color: '#1a1029' },
    { label: '🧋 Trà Sữa Tẹt Ga', color: '#ff9e00' },
    { label: '🎵 Chọn Nhạc Cả Ngày', color: '#3a0ca3' }
  ];

  let currentAngle = 0;
  let isSpinning = false;

  function drawWheel() {
    const numSlices = prizes.length;
    const sliceAngle = (Math.PI * 2) / numSlices;
    const radius = wheelCanvas.width / 2;

    wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    wheelCtx.save();
    wheelCtx.translate(radius, radius);
    wheelCtx.rotate(currentAngle);

    for (let i = 0; i < numSlices; i++) {
      wheelCtx.beginPath();
      wheelCtx.moveTo(0, 0);
      wheelCtx.arc(0, 0, radius - 10, i * sliceAngle, (i + 1) * sliceAngle);
      wheelCtx.fillStyle = prizes[i].color;
      wheelCtx.fill();
      wheelCtx.lineWidth = 2;
      wheelCtx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
      wheelCtx.stroke();

      // Text label
      wheelCtx.save();
      wheelCtx.rotate(i * sliceAngle + sliceAngle / 2);
      wheelCtx.textAlign = 'right';
      wheelCtx.fillStyle = '#ffffff';
      wheelCtx.font = 'bold 15px Plus Jakarta Sans';
      wheelCtx.shadowBlur = 4;
      wheelCtx.shadowColor = '#000';
      wheelCtx.fillText(prizes[i].label, radius - 30, 6);
      wheelCtx.restore();
    }

    wheelCtx.restore();

    // Outer golden decorative ring
    wheelCtx.save();
    wheelCtx.beginPath();
    wheelCtx.arc(radius, radius, radius - 5, 0, Math.PI * 2);
    wheelCtx.lineWidth = 8;
    wheelCtx.strokeStyle = '#ffd700';
    wheelCtx.stroke();
    wheelCtx.restore();
  }

  drawWheel();

  spinWheelBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    wheelResultBox.classList.add('hidden');

    // Chỉ định 3 phần thưởng được phép trúng:
    // Index 1: '🍱 Ăn Trưa Free', Index 2: '👑 Miễn Việc Vặt', Index 4: '💌 1 Lời Khen Team'
    const allowedPrizeIndices = [1, 2, 4];
    
    // Chia đều tỷ lệ 33.33% cho 3 ô này (các ô khác 0%)
    const chosenIndex = allowedPrizeIndices[Math.floor(Math.random() * allowedPrizeIndices.length)];

    // Tính toán góc dừng để kim ở đỉnh chỉ chuẩn xác vào ô đã chọn
    const sliceAngle = (Math.PI * 2) / prizes.length;
    // Độ lệch tự nhiên bên trong ô (tránh luôn rơi đúng chính giữa milimet)
    const offsetInsideSlice = (0.2 + Math.random() * 0.6) * sliceAngle;
    const targetPointerAngle = chosenIndex * sliceAngle + offsetInsideSlice;

    const destNormalized = (Math.PI * 1.5 - targetPointerAngle + Math.PI * 4) % (Math.PI * 2);
    const currentNormalized = (currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const angleDiff = (destNormalized - currentNormalized + Math.PI * 2) % (Math.PI * 2);

    const spinTotalRounds = Math.floor(Math.random() * 3) + 6; // Quay 6 - 8 vòng
    const targetAngle = currentAngle + spinTotalRounds * Math.PI * 2 + angleDiff;

    const startTime = performance.now();
    const duration = 4500; // 4.5s
    const startAngle = currentAngle;

    function animateSpin(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentAngle = startAngle + (targetAngle - startAngle) * easeOut;
      drawWheel();

      // Ticking sound on quarter turns
      if (Math.floor(currentAngle * 6) % 2 === 0) {
        audioEngine.playTickSound();
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        isSpinning = false;
        
        // Calculate winning slice under top pointer (Pointer is at top = 3*PI/2 in standard cartesian, or -PI/2)
        const normalizedAngle = (currentAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        // Pointer is at top (270 deg or 1.5 * PI)
        const pointerAngle = (Math.PI * 1.5 - normalizedAngle + Math.PI * 2) % (Math.PI * 2);
        const sliceIndex = Math.floor(pointerAngle / ((Math.PI * 2) / prizes.length)) % prizes.length;
        
        const prizeWon = prizes[sliceIndex].label;
        wheelWinText.innerText = prizeWon;
        wheelResultBox.classList.remove('hidden');

        audioEngine.playFanfare();
        for (let i = 0; i < 3; i++) {
          setTimeout(() => launchFirework(), i * 200);
        }
      }
    }

    requestAnimationFrame(animateSpin);
  });

  // --- GAME 2: MEMORY MATCH ---
  const memoryGrid = document.getElementById('memoryGrid');
  const memoryTimer = document.getElementById('memoryTimer');
  const memoryMoves = document.getElementById('memoryMoves');
  const resetMemoryBtn = document.getElementById('resetMemoryBtn');
  const memoryWinModal = document.getElementById('memoryWinModal');
  const finalTime = document.getElementById('finalTime');
  const finalMoves = document.getElementById('finalMoves');

  const cardIcons = ['🎂', '🎁', '👑', '🚀', '🥂', '🌹'];
  let memoryCards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let movesCount = 0;
  let gameTimerInterval = null;
  let secondsElapsed = 0;

  function initMemoryGame() {
    clearInterval(gameTimerInterval);
    secondsElapsed = 0;
    movesCount = 0;
    matchedPairs = 0;
    flippedCards = [];
    memoryTimer.innerText = '00:00';
    memoryMoves.innerText = '0';
    memoryWinModal.classList.add('hidden');
    memoryGrid.innerHTML = '';

    const deck = [...cardIcons, ...cardIcons];
    deck.sort(() => Math.random() - 0.5);

    deck.forEach((icon, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-icon', icon);
      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-face memory-front">✨</div>
          <div class="memory-face memory-back">${icon}</div>
        </div>
      `;
      card.addEventListener('click', () => handleCardFlip(card));
      memoryGrid.appendChild(card);
    });

    gameTimerInterval = setInterval(() => {
      secondsElapsed++;
      const m = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
      const s = String(secondsElapsed % 60).padStart(2, '0');
      memoryTimer.innerText = `${m}:${s}`;
    }, 1000);
  }

  function handleCardFlip(card) {
    if (flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    card.classList.add('flipped');
    audioEngine.playPopSound();
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      movesCount++;
      memoryMoves.innerText = movesCount;
      const [card1, card2] = flippedCards;

      if (card1.getAttribute('data-icon') === card2.getAttribute('data-icon')) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cardIcons.length) {
          clearInterval(gameTimerInterval);
          finalTime.innerText = memoryTimer.innerText;
          finalMoves.innerText = movesCount;
          memoryWinModal.classList.remove('hidden');
          audioEngine.playFanfare();
          for (let i = 0; i < 4; i++) {
            setTimeout(() => launchFirework(), i * 200);
          }
        }
      } else {
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
        }, 900);
      }
    }
  }

  resetMemoryBtn.addEventListener('click', initMemoryGame);

  // --- GAME 3: BALLOON POP ---
  const balloonStage = document.getElementById('balloonStage');
  const startBalloonBtn = document.getElementById('startBalloonBtn');
  const balloonScore = document.getElementById('balloonScore');
  const balloonHint = document.getElementById('balloonHint');
  let score = 0;
  let balloonSpawner = null;
  let isBalloonGameActive = false;

  const balloonColors = ['#ff4d6d', '#ffd700', '#7209b7', '#00bbf9', '#00f5d4', '#f72585'];
  const balloonEmojis = ['🎈', '🎁', '🎂', '🎉', '⭐', '❤️'];

  function spawnBalloon() {
    if (!isBalloonGameActive) return;

    const balloon = document.createElement('div');
    balloon.className = 'floating-balloon';
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const emoji = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
    balloon.style.background = `radial-gradient(circle at 30% 30%, #fff 0%, ${color} 70%)`;
    balloon.innerText = emoji;

    const maxX = balloonStage.clientWidth - 70;
    balloon.style.left = `${Math.random() * maxX + 10}px`;

    const floatDuration = Math.random() * 2500 + 3500; // 3.5s to 6s
    balloon.style.transition = `bottom ${floatDuration}ms linear`;

    balloonStage.appendChild(balloon);

    // Trigger rise
    setTimeout(() => {
      balloon.style.bottom = `${balloonStage.clientHeight + 80}px`;
    }, 50);

    // Remove when out of screen
    setTimeout(() => {
      if (balloon.parentNode === balloonStage) {
        balloon.remove();
      }
    }, floatDuration + 200);

    balloon.addEventListener('click', (e) => {
      e.stopPropagation();
      audioEngine.playPopSound();
      score += 10;
      balloonScore.innerText = score;
      
      // Spawn small spark burst
      launchFirework(e.clientX, e.clientY);

      balloon.remove();
    });
  }

  startBalloonBtn.addEventListener('click', () => {
    if (isBalloonGameActive) return;
    isBalloonGameActive = true;
    score = 0;
    balloonScore.innerText = '0';
    balloonHint.style.display = 'none';
    startBalloonBtn.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i> Đang chơi...';
    startBalloonBtn.style.pointerEvents = 'none';

    balloonSpawner = setInterval(spawnBalloon, 750);

    // 25s game round
    setTimeout(() => {
      clearInterval(balloonSpawner);
      isBalloonGameActive = false;
      startBalloonBtn.innerHTML = '<i class="fa-solid fa-play"></i> Chơi Lại';
      startBalloonBtn.style.pointerEvents = 'auto';
      audioEngine.playFanfare();
      alert(`🎉 Chúc mừng anh Nguyên đã đạt được ${score} điểm rực rỡ trong game Nổ Bóng!`);
    }, 25000);
  });

  // ==========================================
  // 9. WISHES WALL SUBMISSION
  // ==========================================
  const wishForm = document.getElementById('wishForm');
  const wishesGrid = document.getElementById('wishesGrid');
  const senderNameInput = document.getElementById('senderName');
  const senderIconSelect = document.getElementById('senderIcon');
  const wishMessageInput = document.getElementById('wishMessage');

  // Load persisted wishes
  const savedWishes = JSON.parse(localStorage.getItem('birthday_wishes_nguyen') || '[]');
  savedWishes.forEach(item => renderWishCard(item, false));

  function renderWishCard(data, prepend = true) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <div class="wish-card-top">
        <span class="wish-icon">${data.icon}</span>
        <div class="wish-author">
          <strong>${data.name}</strong>
          <small>${data.date}</small>
        </div>
      </div>
      <p class="wish-text">“${data.message}”</p>
    `;
    if (prepend) {
      wishesGrid.insertBefore(card, wishesGrid.firstChild);
    } else {
      wishesGrid.appendChild(card);
    }
  }

  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = senderNameInput.value.trim();
    const icon = senderIconSelect.value;
    const message = wishMessageInput.value.trim();

    if (!name || !message) return;

    const newWish = {
      name,
      icon,
      message,
      date: 'Vừa xong'
    };

    renderWishCard(newWish, true);

    // Save to local storage
    savedWishes.unshift(newWish);
    localStorage.setItem('birthday_wishes_nguyen', JSON.stringify(savedWishes));

    // Celebrate
    audioEngine.playFanfare();
    launchFirework();

    // Reset form
    wishForm.reset();
  });
});
