// ── Partículas sutis ─────────────────────────────────────────
class BloodParticle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 2.2;
        this.vy = Math.random() * 2.2 + 0.7;
        this.life = 1;
        this.decay = Math.random() * 0.013 + 0.006;
        this.size = Math.random() * 4.5 + 1.5;
    }
    update() { this.x += this.vx; this.y += this.vy; this.life -= this.decay; this.vy += 0.055; }
    draw(ctx) {
        ctx.fillStyle = `rgba(239,68,68,${this.life * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:1;';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    add(x, y, n = 5) { for (let i = 0; i < n; i++) this.particles.push(new BloodParticle(x, y)); }
    attach(sel, n = 5) {
        document.querySelectorAll(sel).forEach(el => {
            el.addEventListener('mouseenter', () => {
                const r = el.getBoundingClientRect();
                this.add(r.left + r.width / 2, r.top + r.height / 2, n);
            });
        });
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].draw(this.ctx);
            if (this.particles[i].life <= 0) this.particles.splice(i, 1);
        }
        requestAnimationFrame(() => this.animate());
    }
}

// ── Ondas de fundo ────────────────────────────────────────────
class WaveBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:0;pointer-events:none;';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.ctx = this.canvas.getContext('2d');
        this.t = 0;
        this.waves = [
            { a:16, f:0.01,  s:0.016, p:0 },
            { a:10, f:0.015, s:0.012, p:Math.PI/3 },
            { a:7,  f:0.022, s:0.008, p:Math.PI/2 }
        ];
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    animate() {
        const { width: w, height: h } = this.canvas;
        this.ctx.fillStyle = 'rgba(4,0,0,0.6)';
        this.ctx.fillRect(0, 0, w, h);
        this.waves.forEach((wave, i) => {
            this.ctx.strokeStyle = `rgba(239,68,68,${0.07 - i * 0.02})`;
            this.ctx.lineWidth = 1.2;
            this.ctx.beginPath();
            for (let x = 0; x < w; x += 4) {
                const y = h / 2 + wave.a * Math.sin(x * wave.f + this.t * wave.s + wave.p);
                x === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        });
        this.t++;
        requestAnimationFrame(() => this.animate());
    }
}

// ── GSAP animations ──────────────────────────────────────────
function animateDashboard() {
    if (typeof gsap === 'undefined') return;
    gsap.fromTo('.gamification-section', { opacity:0, y:22, scale:.97 }, { opacity:1, y:0, scale:1, duration:.7, ease:'back.out(1.4)', delay:.1 });
    gsap.fromTo('.quick-stat',           { opacity:0, y:16, scale:.84 }, { opacity:1, y:0, scale:1, duration:.5, stagger:.1, ease:'elastic.out(1.1,.75)', delay:.35 });
    gsap.fromTo('.insight-card',         { opacity:0, y:10 },            { opacity:1, y:0, duration:.4, stagger:.07, ease:'power2.out', delay:.55 });
    gsap.fromTo('.heartbeat-section',    { opacity:0 },                  { opacity:1, duration:.55, ease:'power2.out', delay:.7 });
    gsap.fromTo('.daily-reminder',       { opacity:0, y:14 },            { opacity:1, y:0, duration:.45, ease:'power2.out', delay:.85 });
    gsap.to('.btn-primary', { boxShadow:'0 0 26px rgba(239,68,68,.6)', duration:1.5, repeat:-1, yoyo:true, ease:'sine.inOut', delay:1 });
}

function enhanceNav() {
    if (typeof gsap === 'undefined') return;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => gsap.to(btn, { scale:1.07, duration:.3, ease:'back.out' }));
        btn.addEventListener('mouseleave', () => gsap.to(btn, { scale:1,    duration:.22, ease:'power2.out' }));
    });
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const ps = new ParticleSystem();
    ps.attach('.nav-btn', 4);
    ps.attach('.quick-stat', 3);

    new WaveBackground();

    setTimeout(() => { animateDashboard(); enhanceNav(); }, 320);
});