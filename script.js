// ============================================================
// GITHUB GIST — banco de dados gratuito e persistente
// Seus logs ficam salvos em gist.github.com com seu token
// ============================================================

const GIST_FILENAME = 'diario-aprendizado.json';

// Lê/escreve o token apenas no localStorage local (não vai pro Gist)
function getToken() {
    try { return localStorage.getItem('gh_token') || ''; } catch { return ''; }
}
function saveToken(t) {
    try { localStorage.setItem('gh_token', t); } catch { console.warn('localStorage indisponível'); }
}
function getGistId() {
    try { return localStorage.getItem('gh_gist_id') || ''; } catch { return ''; }
}
function saveGistId(id) {
    try { localStorage.setItem('gh_gist_id', id); } catch {}
}

// ── Busca todos os logs do Gist ──────────────────────────────
async function fetchLogsFromGist() {
    const token  = getToken();
    const gistId = getGistId();
    if (!token || !gistId) return null;

    try {
        const res = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
        });
        if (!res.ok) return null;
        const data = await res.json();
        const content = data.files?.[GIST_FILENAME]?.content;
        return content ? JSON.parse(content) : { logs: {} };
    } catch (e) {
        console.warn('Erro ao buscar gist:', e);
        return null;
    }
}

// ── Salva todos os logs no Gist ──────────────────────────────
async function saveLogsToGist(logsObj) {
    const token  = getToken();
    if (!token) return false;

    const body = {
        description: 'Diário de Aprendizado — logs automáticos',
        public: false,
        files: { [GIST_FILENAME]: { content: JSON.stringify(logsObj, null, 2) } }
    };

    const gistId = getGistId();
    const url    = gistId
        ? `https://api.github.com/gists/${gistId}`
        : 'https://api.github.com/gists';
    const method = gistId ? 'PATCH' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!res.ok) return false;
        const data = await res.json();
        if (!gistId) saveGistId(data.id);
        return true;
    } catch (e) {
        console.warn('Erro ao salvar gist:', e);
        return false;
    }
}

// ── Verifica token e busca ou cria gist ──────────────────────
async function connectGist(token) {
    saveToken(token);

    const statusEl = document.getElementById('gistStatus');
    const setStatus = (msg, cls) => {
        statusEl.textContent = msg;
        statusEl.className = 'gist-status ' + (cls || '');
    };

    setStatus('Verificando token...');

    // Testa o token
    try {
        const me = await fetch('https://api.github.com/user', {
            headers: { Authorization: `token ${token}` }
        });
        if (!me.ok) { setStatus('Token inválido. Verifique e tente de novo.', 'error'); return false; }
    } catch { setStatus('Erro de rede. Verifique sua conexão.', 'error'); return false; }

    // Busca gist existente ou cria um novo
    let gistId = getGistId();

    if (!gistId) {
        setStatus('Procurando diário existente...');
        try {
            const res  = await fetch('https://api.github.com/gists', { headers: { Authorization: `token ${token}` } });
            const list = await res.json();
            const found = list.find(g => g.files?.[GIST_FILENAME]);
            if (found) { gistId = found.id; saveGistId(gistId); }
        } catch {}
    }

    setStatus('Conectado! Carregando seus logs...', 'ok');

    const remote = await fetchLogsFromGist();
    if (remote) {
        dailyLog.logs = remote.logs || {};
    } else {
        // Cria o gist vazio
        await saveLogsToGist({ logs: dailyLog.logs });
    }

    document.getElementById('gistConfig').classList.add('hidden');
    updateGameification();
    renderActivities();
    showToast('GitHub conectado! Seus logs estão sincronizados.');
    return true;
}

// ============================================================
// DAILY LOG — gerenciamento local + sync Gist
// ============================================================
class DailyLog {
    constructor() {
        this.logs = {};
        this.loadLocal();
    }

    loadLocal() {
        try {
            const raw = localStorage.getItem('devDiaryLogs');
            this.logs = raw ? JSON.parse(raw) : {};
        } catch { this.logs = {}; }
    }

    saveLocal() {
        try { localStorage.setItem('devDiaryLogs', JSON.stringify(this.logs)); } catch {}
    }

    getToday() { return new Date().toISOString().split('T')[0]; }

    async addLog(title, description, area) { // Removi o parâmetro difficulty
        
        // --- NOVA REGRA DE XP POR TEMA ---
        const xpMap = { 
            estagio: 20,    // Rotina normal
            faculdade: 20,  // Rotina normal
            estudo: 35,     // Esforço extra (estudo por fora)
            desafio: 45,    // Superou um problema
            conquista: 60   // Algo muito especial
        };

        const log = {
            id: Date.now(),
            title, description, area,
            xp: xpMap[area] || 20, // Usa o XP do mapa, padrão é 20
            timestamp: new Date().toISOString()
        };

        const today = this.getToday();
        if (!this.logs[today]) this.logs[today] = [];
        this.logs[today].push(log);

        this.saveLocal();

        // Tenta salvar no Gist se configurado
        if (getToken() && getGistId()) {
            const ok = await saveLogsToGist({ logs: this.logs });
            return { log, synced: ok };
        }
        return { log, synced: false };
    }

    getTodayLogs() { return this.logs[this.getToday()] || []; }

    getAllLogs() {
        return Object.values(this.logs).flat()
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    getLastLog() {
        const all = this.getAllLogs();
        return all.length ? all[0] : null;
    }

    getStreak() {
        let streak = 0;
        const checkDate = new Date(this.getToday());
        for (let i = 0; i < 365; i++) {
            const ds = checkDate.toISOString().split('T')[0];
            const day = this.logs[ds];
            if (day && day.length > 0) { streak++; }
            else if (i === 0) { checkDate.setDate(checkDate.getDate() - 1); continue; }
            else break;
            checkDate.setDate(checkDate.getDate() - 1);
        }
        return streak;
    }

    getTotalXP() { return Object.values(this.logs).flat().reduce((s, l) => s + (l.xp || 0), 0); }
    getLevel()   { return Math.floor(this.getTotalXP() / 500) + 1; }

    getWeekStats() {
        let weekXP = 0, weekDays = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const ds = d.toISOString().split('T')[0];
            const day = this.logs[ds] || [];
            if (day.length) { weekDays++; weekXP += day.reduce((s, l) => s + (l.xp || 0), 0); }
        }
        return { weekDays, weekXP };
    }

    getMonthStats() {
        const now = new Date();
        let monthXP = 0, monthDays = 0;
        Object.entries(this.logs).forEach(([ds, logs]) => {
            const d = new Date(ds);
            if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && logs.length) {
                monthDays++;
                monthXP += logs.reduce((s, l) => s + (l.xp || 0), 0);
            }
        });
        return { monthDays, monthXP };
    }

    getBestDay() {
        let bestDate = '--', bestXP = 0;
        Object.entries(this.logs).forEach(([ds, logs]) => {
            const xp = logs.reduce((s, l) => s + (l.xp || 0), 0);
            if (xp > bestXP) {
                bestXP = xp;
                const d = new Date(ds);
                bestDate = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
            }
        });
        return { bestDate, bestXP };
    }
}

const dailyLog = new DailyLog();

// ============================================================
// TOAST
// ============================================================
function showToast(msg) {
    let el = document.getElementById('diary-toast');
    if (!el) { el = document.createElement('div'); el.id = 'diary-toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => el.style.opacity = '0', 3200);
}

// ============================================================
// HEARTBEAT MONITOR
// ============================================================
class HeartbeatMonitor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.maxPts = 220;
        this.scanX = 0;
        this.lastPulse = 0;
        this.points = Array(this.maxPts).fill(0);
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.start();
    }
    resize() {
        if (!this.canvas) return;
        this.canvas.width  = this.canvas.offsetWidth || 700;
        this.canvas.height = 80;
        this.baseY = this.canvas.height / 2;
    }
    triggerPulse(intensity = 1) {
        const spike = [0, -28*intensity, 58*intensity, -38*intensity, 14*intensity, -9*intensity, 4*intensity, 0];
        spike.forEach((v, i) => { this.points[(this.scanX + i) % this.maxPts] = v; });
        this.lastPulse = Date.now();
        const s = document.getElementById('heartbeatStatus');
        if (s) { s.textContent = '● Atividade detectada!'; s.classList.add('active'); }
    }
    start() {
        const draw = () => {
            if (!this.canvas) return;
            const w = this.canvas.width, h = this.canvas.height;
            this.ctx.fillStyle = 'rgba(4,0,0,0.3)';
            this.ctx.fillRect(0, 0, w, h);
            // Grade
            this.ctx.strokeStyle = 'rgba(239,68,68,0.05)';
            this.ctx.lineWidth = 0.5;
            for (let x = 0; x < w; x += 28) { this.ctx.beginPath(); this.ctx.moveTo(x,0); this.ctx.lineTo(x,h); this.ctx.stroke(); }
            for (let y = 0; y < h; y += 18) { this.ctx.beginPath(); this.ctx.moveTo(0,y); this.ctx.lineTo(w,y); this.ctx.stroke(); }
            // Linha
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(239,68,68,0.9)';
            this.ctx.lineWidth = 1.8;
            this.ctx.shadowColor = 'rgba(239,68,68,0.7)';
            this.ctx.shadowBlur = 7;
            const step = w / this.maxPts;
            for (let i = 0; i < this.maxPts; i++) {
                const idx = (this.scanX + i) % this.maxPts;
                const x = i * step;
                const fade = i > this.maxPts - 18 ? (this.maxPts - i) / 18 : 1;
                this.ctx.globalAlpha = fade * 0.9;
                const y = this.baseY + this.points[idx];
                i === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
            this.ctx.globalAlpha = 1; this.ctx.shadowBlur = 0;
            // Scanner cursor
            const cx = (this.maxPts - 1) * step;
            const g = this.ctx.createLinearGradient(cx-18,0,cx+4,0);
            g.addColorStop(0,'rgba(239,68,68,0)'); g.addColorStop(1,'rgba(239,68,68,0.45)');
            this.ctx.fillStyle = g; this.ctx.fillRect(cx-18,0,22,h);
            // Avança
            this.scanX = (this.scanX + 1) % this.maxPts;
            this.points[this.scanX] = 0;
            // Status idle
            if (this.lastPulse > 0 && Date.now() - this.lastPulse > 8000) {
                const s = document.getElementById('heartbeatStatus');
                if (s) { s.textContent = '● Em repouso'; s.classList.remove('active'); }
            }
            requestAnimationFrame(draw);
        };
        draw();
    }
    syncWithLogs() {
        const today = dailyLog.getTodayLogs();
        if (today.length) {
            const last = today[today.length - 1];
            const age  = Date.now() - new Date(last.timestamp).getTime();
            if (age < 30000) {
                const i = { easy:0.7, medium:1.1, hard:1.6 }[last.difficulty] || 1;
                this.triggerPulse(i);
            }
        }
    }
}

let heartbeat = null;

// ============================================================
// RENDER — Activities page
// ============================================================
const AREA_LABELS = {
    estagio:   'Estágio',
    faculdade: 'Faculdade',
    estudo:    'Estudo',
    desafio:   'Desafio',
    conquista: 'Conquista'
};

function renderActivities(filter = 'all') {
    const container = document.getElementById('activitiesTimeline');
    if (!container) return;

    let logs = dailyLog.getAllLogs();
    if (filter !== 'all') logs = logs.filter(l => l.area === filter);

    if (!logs.length) {
        container.innerHTML = '<p class="empty-state">Nenhuma atividade aqui ainda.</p>';
        return;
    }

    container.innerHTML = logs.map(log => {
        const d    = new Date(log.timestamp);
        const date = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
        const time = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
        const area = log.area || 'estudo';
        const areaLabel = AREA_LABELS[area] || area;
        const desc = log.description ? `<p class="ac-desc">${log.description}</p>` : '';
        return `
            <div class="activity-card area-${area}">
                <div class="ac-header">
                    <span class="ac-title">${log.title}</span>
                    <div class="ac-meta">
                        <span class="area-tag area-${area}">${areaLabel}</span>
                        <span class="ac-date">${date} ${time}</span>
                    </div>
                </div>
                ${desc}
                <div class="ac-footer">
                    <span class="ac-xp">+${log.xp} XP</span>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// GAMIFICATION UPDATE
// ============================================================
function updateGameification() {
    const el = id => document.getElementById(id);

    el('currentStreak') && (el('currentStreak').textContent = dailyLog.getStreak());
    el('totalXP')       && (el('totalXP').textContent       = dailyLog.getTotalXP());
    el('currentLevel')  && (el('currentLevel').textContent  = dailyLog.getLevel());

    const { weekDays, weekXP }   = dailyLog.getWeekStats();
    const { monthDays, monthXP } = dailyLog.getMonthStats();
    const { bestDate, bestXP }   = dailyLog.getBestDay();

    el('weekDays')     && (el('weekDays').textContent     = weekDays);
    el('weekXP')       && (el('weekXP').textContent       = `${weekXP} XP`);
    el('monthDays')    && (el('monthDays').textContent    = monthDays);
    el('monthXP')      && (el('monthXP').textContent      = `${monthXP} XP`);
    el('bestDay')      && (el('bestDay').textContent      = bestDate);
    el('bestDayValue') && (el('bestDayValue').textContent = `${bestXP} XP`);

    updateEmotionalWidget();
    updateTodayLogs();
    updateLastLogBadge();
}

function updateEmotionalWidget() {
    const streak   = dailyLog.getStreak();
    const level    = dailyLog.getLevel();
    const totalXP  = dailyLog.getTotalXP();
    const today    = dailyLog.getTodayLogs();
    const todayXP  = today.reduce((s, l) => s + (l.xp || 0), 0);

    let emoji, status, msg;
    if (!today.length)       { emoji='🦇'; status='Parado';    msg='Comece registrando o que aprendeu hoje.'; }
    else if (streak >= 7)    { emoji='🔥'; status='Lendário';  msg='Uma semana inteira! Incrível.'; }
    else if (streak >= 5)    { emoji='✨'; status='Excelente'; msg='Consistência é tudo. Continue!'; }
    else if (streak >= 3)    { emoji='💪'; status='Em alta';   msg='Ótimo ritmo. Não pare agora.'; }
    else                     { emoji='😊'; status='Iniciando'; msg='Bom começo. Volte amanhã também!'; }

    const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    set('emotionEmoji',   emoji);
    set('emotionStatus',  status);
    set('emotionMessage', msg);
    set('streakDays',     streak === 1 ? '1 dia' : `${streak} dias`);

    const xpNeeded = level * 500 - totalXP;
    set('xpToNextLevel', xpNeeded > 0 ? `${xpNeeded} XP` : 'Nível máximo!');
}

function updateTodayLogs() {
    const container = document.getElementById('todayLogs');
    if (!container) return;
    const logs = dailyLog.getTodayLogs();

    if (!logs.length) {
        container.innerHTML = '<p style="color:rgba(252,165,165,.4);text-align:center;font-size:.9rem;padding:.9rem 0;font-style:italic;">Nenhum log hoje ainda.</p>';
        return;
    }

    container.innerHTML = logs.slice().reverse().map(log => {
        const time  = new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
        const area  = log.area || 'estudo';
        const label = AREA_LABELS[area] || area;
        return `
            <div class="log-item">
                <span class="log-title">${log.title}</span>
                <div class="log-meta">
                    <span class="area-tag area-${area}">${label}</span>
                    <span class="log-time">${time}</span>
                    <span class="log-xp">+${log.xp} XP</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateLastLogBadge() {
    const el   = document.getElementById('lastLogText');
    if (!el) return;
    const last = dailyLog.getLastLog();
    if (!last) { el.textContent = 'Nenhum registro ainda'; return; }
    const d     = new Date(last.timestamp);
    const date  = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
    const time  = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
    const title = last.title.length > 24 ? last.title.slice(0, 24) + '…' : last.title;
    el.textContent = `${title} · ${date} ${time}`;
}

// ============================================================
// MODAL DE LOG
// ============================================================
function setupLogModal() {
    const modal     = document.getElementById('logModal');
    const addBtn    = document.getElementById('addLogBtn');
    const closeBtn  = document.querySelector('.close');
    const form      = document.getElementById('logForm');
    const submitBtn = document.getElementById('submitLogBtn');
    const syncEl    = document.getElementById('syncStatus');

    if (!modal || !addBtn) return;

    addBtn.addEventListener('click', () => modal.classList.add('show'));
    closeBtn?.addEventListener('click', () => modal.classList.remove('show'));
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

    form?.addEventListener('submit', async e => {
        e.preventDefault();
        const title       = document.getElementById('logTitle')?.value?.trim();
        const description = document.getElementById('logDescription')?.value?.trim();
        const area        = document.getElementById('logArea')?.value;

        if (!title) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando...';
        if (syncEl) { syncEl.style.display = 'block'; syncEl.textContent = getToken() ? 'Sincronizando com GitHub...' : 'Salvando localmente...'; }

        // Chama o addLog sem a difficulty
        const { log, synced } = await dailyLog.addLog(title, description, area);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar log';
        if (syncEl) syncEl.style.display = 'none';

        updateGameification();
        renderActivities();

        // Faz o batimento cardíaco disparar mais forte dependendo da área
        if (heartbeat) {
            const intensidadeMonitor = { estagio:1.0, faculdade:1.0, estudo:1.3, desafio:1.5, conquista:1.8 }[area] || 1;
            heartbeat.triggerPulse(intensidadeMonitor);
        }

        const syncMsg = synced ? ' · sincronizado no GitHub' : (getToken() ? ' · erro ao sincronizar' : '');
        showToast(`+${log.xp} XP registrado${syncMsg}`);

        form.reset();
        modal.classList.remove('show');
    });
}

// ============================================================
// GIST CONFIG SETUP
// ============================================================
function setupGistConfig() {
    const saveBtn = document.getElementById('saveTokenBtn');
    const input   = document.getElementById('githubToken');
    if (!saveBtn || !input) return;

    // Se já tem token, esconde o painel
    if (getToken() && getGistId()) {
        document.getElementById('gistConfig')?.classList.add('hidden');
    }

    saveBtn.addEventListener('click', async () => {
        const token = input.value.trim();
        if (!token) { document.getElementById('gistStatus').textContent = 'Cole o token antes de continuar.'; return; }
        saveBtn.disabled = true;
        saveBtn.textContent = 'Conectando...';
        await connectGist(token);
        saveBtn.disabled = false;
        saveBtn.textContent = 'Conectar';
    });
}

// ============================================================
// NAVEGAÇÃO
// ============================================================
function setupPageNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages   = document.querySelectorAll('.page');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-page');
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            pages.forEach(p => p.classList.remove('active'));
            const pg = document.querySelector(`.page[data-page="${target}"]`);
            if (pg) pg.classList.add('active');
            if (target === 'home') updateGameification();
            if (target === 'activities') renderActivities(currentFilter);
        });
    });
}

// ── Filtros da página de atividades ──
let currentFilter = 'all';
function setupActivityFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderActivities(currentFilter);
        });
    });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    document.body.classList.add('dark-mode');
    setupPageNavigation();
    setupLogModal();
    setupGistConfig();
    setupActivityFilters();

    // Se tem token + gist, carrega do GitHub
    if (getToken() && getGistId()) {
        const remote = await fetchLogsFromGist();
        if (remote) {
            dailyLog.logs = remote.logs || {};
            dailyLog.saveLocal();
        }
        document.getElementById('gistConfig')?.classList.add('hidden');
    }

    setTimeout(() => {
        heartbeat = new HeartbeatMonitor('heartbeatCanvas');
        heartbeat.syncWithLogs();
        updateGameification();
    }, 300);
});