/* ===== FALLING PETALS ===== */
const canvas = document.getElementById('petals');
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

const PETAL_COUNT = 55;
const petals = [];

const colors = [
  'rgba(244,167,185,',
  'rgba(252,228,236,',
  'rgba(232,120,154,',
  'rgba(201,184,232,',
  'rgba(255,240,246,',
];

class Petal {
  constructor() { this.reset(true); }

  reset(init = false) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : -20;
    this.size = Math.random() * 10 + 5;
    this.speedY = Math.random() * 1.2 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.04;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = Math.random() * 0.03 + 0.01;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.blur = Math.random() > 0.7;
  }

  update() {
    this.wobble += this.wobbleSpeed;
    this.x += this.speedX + Math.sin(this.wobble) * 0.6;
    this.y += this.speedY;
    this.angle += this.angleSpeed;
    if (this.y > H + 20) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.blur ? this.opacity * 0.4 : this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Petal shape
    ctx.beginPath();
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner highlight
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.ellipse(0, -this.size * 0.2, this.size * 0.2, this.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

for (let i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());

function animatePetals() {
  ctx.clearRect(0, 0, W, H);
  petals.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animatePetals);
}

animatePetals();

/* ===== ENTER BUTTON ===== */
document.getElementById('enterBtn').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll(
  '.glass-card, .gallery-item, .quote-card, .about-text, .section-title, .section-label'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => observer.observe(el));

/* ===== SMOOTH PARALLAX HERO ===== */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    heroContent.style.opacity = 1 - scrollY / 500;
  }
});

/* ===== GLOW FOLLOW MOUSE (subtle) ===== */
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Subtle cursor glow effect on gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty('--mx', x + '%');
    item.style.setProperty('--my', y + '%');
  });
});
