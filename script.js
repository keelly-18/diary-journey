// ============================================================
// CONFIGURAÇÕES GLOBAIS & UTILITÁRIOS
// ============================================================
const AREA_LABELS = {
    estagio: 'Estágio',
    faculdade: 'Faculdade',
    estudo: 'Estudo Extra',
    desafio: 'Desafio',
    conquista: 'Conquista'
};

// Funções para gerenciar o Toast (notificação simples)
function showToast(message, duration = 3000) {
    let toast = document.getElementById('diary-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'diary-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // Limpa o timeout anterior se houver
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    
    toast.timeoutId = setTimeout(() => {
        toast.style.opacity = '0';
    }, duration);
}

// ============================================================
// CORE: CLASSE DE GERENCIAMENTO DE LOGS (DailyLog)
// ============================================================
class DailyLog {
    constructor() {
        this.STORAGE_KEY = 'gothic_diary_logs';
        this.GIST_ID_KEY = 'gothic_diary_gist_id';
        this.TOKEN_KEY = 'gothic_diary_github_token';
        this.logs = this.loadLocal();
    }

    // --- Gestão Local (localStorage) ---
    loadLocal() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Erro ao ler localStorage:', e);
            return {};
        }
    }

    saveLocal() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    }

    // --- Utilitários de Data ---
    getToday() { return new Date().toISOString().split('T')[0]; }
    
    getTodayLogs() { return this.logs[this.getToday()] || []; }

    getAllLogsFlat() {
        return Object.values(this.logs).flat().sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // --- Adicionar Log (Gamificação Gótica) ---
    async addLog(title, description, area) {
        const xpMap = { 
            estagio: 20,
            faculdade: 20,
            estudo: 35,
            desafio: 45,
            conquista: 60
        };

        const log = {
            id: Date.now(),
            title,
            description,
            area,
            xp: xpMap[area] || 20,
            timestamp: new Date().toISOString()
        };

        const today = this.getToday();
        if (!this.logs[today]) this.logs[today] = [];
        this.logs[today].push(log);

        this.saveLocal();

        if (getToken() && getGistId()) {
            const ok = await saveLogsToGist({ logs: this.logs });
            return { log, synced: ok };
        }
        return { log, synced: false };
    }

    // --- Apagar Log ---
    async deleteLog(idLog) {
        let logDeletado = false;
        
        for (const data in this.logs) {
            const tamanhoOriginal = this.logs[data].length;
            this.logs[data] = this.logs[data].filter(log => log.id !== idLog);
            
            if (this.logs[data].length < tamanhoOriginal) {
                logDeletado = true;
                if (this.logs[data].length === 0) {
                    delete this.logs[data];
                }
                break;
            }
        }

        if (logDeletado) {
            this.saveLocal();
            if (getToken() && getGistId()) {
                await saveLogsToGist({ logs: this.logs });
            }
        }
        return logDeletado;
    }

    // --- Cálculos de Gamificação ---
    getTotalXP() {
        return Object.values(this.logs).flat().reduce((sum, log) => sum + (log.xp || 0), 0);
    }

    getLevel() {
        const totalXP = this.getTotalXP();
        const level = Math.floor(totalXP / 500) + 1;
        const xpInCurrentLevel = totalXP % 500;
        const xpToNextLevel = 500 - xpInCurrentLevel;
        const progressPercentage = (xpInCurrentLevel / 500) * 100;
        return { level, progressPercentage, xpToNextLevel };
    }

    getStreak() {
        let streak = 0;
        let currentDate = new Date();
        
        if (this.getTodayLogs().length > 0) streak = 1;
        
        currentDate.setDate(currentDate.getDate() - (streak === 1 ? 1 : 0));
        
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (this.logs[dateStr] && this.logs[dateStr].length > 0) {
                if (streak === 0) streak = 1;
                else streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }

    getStats() {
        const allFlat = this.getAllLogsFlat();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const logsWeek = allFlat.filter(l => new Date(l.timestamp) >= oneWeekAgo);
        const logsMonth = allFlat.filter(l => new Date(l.timestamp) >= oneMonthAgo);

        const uniqueDays = (logs) => new Set(logs.map(l => l.timestamp.split('T')[0])).size;

        let bestDayXP = 0;
        let bestDayDate = '--';
        for (const data in this.logs) {
            const dayXP = this.logs[data].reduce((sum, l) => sum + (l.xp || 0), 0);
            if (dayXP > bestDayXP) {
                bestDayXP = dayXP;
                bestDayDate = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
            }
        }

        return {
            weekDays: uniqueDays(logsWeek),
            weekXP: logsWeek.reduce((sum, l) => sum + (l.xp || 0), 0),
            monthDays: uniqueDays(logsMonth),
            monthXP: logsMonth.reduce((sum, l) => sum + (l.xp || 0), 0),
            bestDay: bestDayDate,
            bestDayXP: bestDayXP
        };
    }
}

const dailyLog = new DailyLog();

// ============================================================
// GESTÃO DE UI & RENDERIZAÇÃO
// ============================================================

// --- Lógica de Navegação entre Páginas ---
function setupPageNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages   = document.querySelectorAll('.page');
    const sidebar = document.getElementById('sidebar');

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
            if (target === 'languages') animateSkillBars();
            
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.style.width = '75px';
                setTimeout(() => sidebar.style.width = '', 10);
            }
        });
    });
}

// --- Atualização da Home ---
function updateGameification() {
    // Stats Básicos
    document.getElementById('totalXP').textContent = dailyLog.getTotalXP();
    const streak = dailyLog.getStreak();
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('streakDays').textContent = `${streak} dias`;

    // Nível
    const { level, xpToNextLevel } = dailyLog.getLevel();
    document.getElementById('currentLevel').textContent = level;
    document.getElementById('xpToNextLevel').textContent = `${xpToNextLevel} XP`;

    // Painel de Desempenho
    const stats = dailyLog.getStats();
    document.getElementById('weekDays').textContent = stats.weekDays;
    document.getElementById('weekXP').textContent = `${stats.weekXP} XP`;
    document.getElementById('monthDays').textContent = stats.monthDays;
    document.getElementById('monthXP').textContent = `${stats.monthXP} XP`;
    document.getElementById('bestDay').textContent = stats.bestDay;
    document.getElementById('bestDayValue').textContent = `${stats.bestDayXP} XP`;

    updateTodayLogs();
    updateGhostMood();
    updateHeartbeatText();
}

// --- ATUALIZA O TEXTO DO MONITOR ESPIRITUAL E ESTATÍSTICAS ---
function updateHeartbeatText() {
    const logsHoje = dailyLog.getTodayLogs().length;
    window.heartbeatBeats = logsHoje; // Salva o número para a linha animada usar
    
    const statusEl = document.getElementById('heartbeatStatus');
    const syncEl = document.getElementById('hbSync');
    const freqEl = document.getElementById('hbFreq');
    const powerEl = document.getElementById('hbPower');

    if (statusEl) {
        if (logsHoje === 0) {
            // MÁQUINA DESLIGADA
            statusEl.textContent = 'Sem Sinais Vitais...';
            statusEl.style.color = 'var(--text-soft)';
            statusEl.style.textShadow = 'none';
            
            if(syncEl) { syncEl.textContent = 'Nula'; syncEl.style.color = 'var(--text-soft)'; }
            if(freqEl) { freqEl.textContent = '0.0Hz'; freqEl.style.color = 'var(--text-soft)'; }
            if(powerEl) { powerEl.textContent = '0%'; powerEl.style.color = 'var(--text-soft)'; }
            
        } else if (logsHoje <= 2) {
            // MÁQUINA ACORDANDO
            statusEl.textContent = 'Ressuscitando...';
            statusEl.style.color = '#fca5a5';
            statusEl.style.textShadow = 'none';
            
            if(syncEl) { syncEl.textContent = 'Fraca'; syncEl.style.color = '#fca5a5'; }
            if(freqEl) { freqEl.textContent = (logsHoje * 2.4).toFixed(1) + 'Hz'; freqEl.style.color = '#fca5a5'; }
            if(powerEl) { powerEl.textContent = (logsHoje * 25) + '%'; powerEl.style.color = '#fca5a5'; }
            
        } else {
            // FRENESI TOTAL (Máximo de 100%)
            statusEl.textContent = 'Frenesi Sombrio!';
            statusEl.style.color = '#ef4444'; 
            statusEl.style.textShadow = '0 0 8px rgba(239,68,68,0.6)'; 
            
            if(syncEl) { syncEl.textContent = 'Máxima!'; syncEl.style.color = '#ef4444'; }
            if(freqEl) { freqEl.textContent = (logsHoje * 3.8).toFixed(1) + 'Hz'; freqEl.style.color = '#ef4444'; }
            if(powerEl) { powerEl.textContent = Math.min(logsHoje * 30, 100) + '%'; powerEl.style.color = '#ef4444'; }
        }
    }
}

// --- MONITOR EMOCIONAL (O FANTASMA DRAMÁTICO) ---
function updateGhostMood() {
    const iconEl = document.getElementById('emotionIcon');
    const statusEl = document.getElementById('emotionStatus');
    const messageEl = document.getElementById('emotionMessage');

    if (!iconEl) return;

    const streak = dailyLog.getStreak();
    const logsHoje = dailyLog.getTodayLogs();
    const xpHojes = logsHoje.reduce((sum, log) => sum + (log.xp || 0), 0);
    const nivel = dailyLog.getLevel().level;

    let mood = {
        icon: 'img/ghost_8493864.png', 
        status: 'Materializando...',
        message: 'Traga alguma energia vital para este diário. Estou sumindo aqui.'
    };

    if (xpHojes === 0) {
        mood = {
            icon: 'img/teia-de-aranha.png',
            status: 'Morto por dentro.',
            message: 'Nem eu que sou um fantasma estou tão parado. As aranhas já tomaram conta. Vá estudar!'
        };
    } else if (xpHojes > 120 || streak > 7) {
        mood = {
            icon: 'img/haunted-house_5421742.png',
            status: 'Poltergeist!',
            message: 'Quanta energia! Quase consigo sentir meu coração bater de novo... quase.'
        };
    } else if (nivel > 5 && xpHojes > 40) {
        mood = {
            icon: 'img/moon_4139153.png',
            status: 'Espírito Ancião',
            message: 'Sua aura brilha mais que a lua cheia. Uma assombração de respeito.'
        };
    } else {
        mood = {
            icon: 'img/ghost_8493864.png',
            status: 'Alma Penada.',
            message: 'Um progresso fantasmagórico. Continue assim e talvez você evolua para algo maior.'
        };
    }

    iconEl.src = mood.icon;
    statusEl.textContent = mood.status;
    messageEl.textContent = mood.message;
    
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(iconEl, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
    }
}

// --- Renderizar Logs de Hoje ---
function updateTodayLogs() {
    const container = document.getElementById('todayLogs');
    const lastLogTextEl = document.getElementById('lastLogText');
    if (!container) return;
    
    const logs = dailyLog.getTodayLogs();

    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-state" style="padding: 3rem 0; font-size: var(--fs-base); color: rgba(200,180,180,0.4); font-family: \'Cinzel\', serif;">As páginas aguardam sua energia vital...</p>';
        if (lastLogTextEl) lastLogTextEl.textContent = 'O silêncio impera';
        return;
    }

    if (lastLogTextEl) {
        const last = logs[logs.length - 1];
        lastLogTextEl.textContent = `Último: ${last.title}`;
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
                    <button class="delete-log-btn" data-id="${log.id}" title="Excluir este log">×</button>
                </div>
            </div>
        `;
    }).join('');
}

// --- Renderizar Página de Atividades ---
let currentFilter = 'all';

function setupActivitiesFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderActivities(currentFilter);
        });
    });
}

function renderActivities(filter = 'all') {
    const container = document.getElementById('activitiesTimeline');
    if (!container) return;
    
    let logs = dailyLog.getAllLogsFlat();

    if (filter !== 'all') {
        logs = logs.filter(log => log.area === filter);
    }

    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhuma atividade encontrada neste filtro.</p>';
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
                        <button class="delete-log-btn" data-id="${log.id}" title="Excluir este log">×</button>
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

// --- Animação das Barras de Habilidade ---
function animateSkillBars() {
    const bars = document.querySelectorAll('.progress-fill');
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%'; 
        setTimeout(() => bar.style.width = width, 100);
    });
}

// ============================================================
// MODAIS E FORMULÁRIOS
// ============================================================

// --- Gestão do Modal de Adicionar Log ---
function setupLogModal() {
    const modal    = document.getElementById('logModal');
    const btn      = document.getElementById('addLogBtn');
    const close    = modal?.querySelector('.close');
    const form     = document.getElementById('logForm');
    const submitBtn = document.getElementById('submitLogBtn');
    const syncEl   = document.getElementById('syncStatus');

    if (!modal || !btn || !form) return;

    btn.onclick = () => {
        form.reset();
        modal.classList.add('show');
    };
    
    if (close) close.onclick = () => modal.classList.remove('show');

    window.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('show');
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const title       = document.getElementById('logTitle')?.value?.trim();
        const description = document.getElementById('logDescription')?.value?.trim();
        const area        = document.getElementById('logArea')?.value;

        if (!title) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Materializando...';
        if (syncEl) { syncEl.style.display = 'block'; syncEl.textContent = getToken() ? 'Sincronizando com GitHub Gist...' : 'Salvando localmente...'; }

        const { log, synced } = await dailyLog.addLog(title, description, area);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar log';
        if (syncEl) syncEl.style.display = 'none';

        updateGameification(); // Atualiza toda a tela!

        const syncMsg = synced ? ' · sincronizado no GitHub' : (getToken() ? ' · erro ao sincronizar' : '');
        showToast(`+${log.xp} XP registrado sombriamente${syncMsg}`);

        form.reset();
        modal.classList.remove('show');
    });
}

// --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO CUSTOMIZADO ---
function setupDeleteModal() {
    const deleteModal = document.getElementById('deleteConfirmModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    let logIdToDelete = null;

    if (!deleteModal || !confirmBtn || !cancelBtn) return;

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-log-btn')) {
            logIdToDelete = parseInt(e.target.getAttribute('data-id'));
            deleteModal.classList.add('show');
        }
    });

    cancelBtn.addEventListener('click', () => {
        deleteModal.classList.remove('show');
        logIdToDelete = null;
    });

    confirmBtn.addEventListener('click', async () => {
        if (logIdToDelete === null) return;

        const textoOriginal = confirmBtn.textContent;
        confirmBtn.textContent = 'Expurgando...';
        confirmBtn.disabled = true;
        
        // ACHA O LOG NA TELA E FAZ A ANIMAÇÃO
        const botaoDelete = document.querySelector(`.delete-log-btn[data-id="${logIdToDelete}"]`);
        if (botaoDelete) {
            const caixaLog = botaoDelete.closest('.log-item') || botaoDelete.closest('.activity-card');
            if (caixaLog) {
                caixaLog.classList.add('expurgando'); 
                await new Promise(resolve => setTimeout(resolve, 450)); // Espera a animação rodar
            }
        }

        const apagou = await dailyLog.deleteLog(logIdToDelete);
        
        if (apagou) {
            showToast('Log expurgado para o além.');
            updateGameification();
            renderActivities(currentFilter);
        } else {
            showToast('Erro ao expurgar o log.');
        }

        confirmBtn.textContent = textoOriginal;
        confirmBtn.disabled = false;
        deleteModal.classList.remove('show');
        logIdToDelete = null;
    });

    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('show');
            logIdToDelete = null;
        }
    });
}

// ============================================================
// SISTEMA DE SINCRONIZAÇÃO GITHUB GIST (API)
// ============================================================
function getToken() { return localStorage.getItem(dailyLog.TOKEN_KEY); }
function getGistId() { return localStorage.getItem(dailyLog.GIST_ID_KEY); }

function setupGistConfig() {
    const tokenInput = document.getElementById('githubToken');
    const saveBtn    = document.getElementById('saveTokenBtn');
    const statusEl   = document.getElementById('gistStatus');
    const gistLinkEl = document.getElementById('gistConfig');

    if (!tokenInput || !saveBtn) return;

    if (getToken()) {
        gistLinkEl.innerHTML = `<p class="gist-info" style="color: #6ee7b7; border-color: #065f46;">✓ Sincronizado com GitHub Gist (ID: ${getGistId() || '...'})<br><button class="btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 10px; margin-top: 0.5rem;" onclick="localStorage.removeItem(dailyLog.TOKEN_KEY); location.reload();">Desconectar</button></p>`;
    }

    saveBtn.onclick = async () => {
        const token = tokenInput.value.trim();
        if (!token || !token.startsWith('ghp_')) { showToast('Token inválido. Deve começar com ghp_'); return; }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Conectando...';
        statusEl.textContent = 'Validando token e criando/buscando Gist...';
        statusEl.style.color = 'var(--text-muted)';

        const gistId = await initializeGist(token);

        if (gistId) {
            localStorage.setItem(dailyLog.TOKEN_KEY, token);
            localStorage.setItem(dailyLog.GIST_ID_KEY, gistId);
            statusEl.textContent = 'Conectado com sucesso!';
            statusEl.style.color = '#6ee7b7';
            showToast('Conectado ao GitHub Gist!');
            setTimeout(() => location.reload(), 1500); 
        } else {
            statusEl.textContent = 'Erro ao conectar ao GitHub. Verifique o token e as permissões (gist).';
            statusEl.style.color = '#fca5a5';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Conectar';
        }
    };
}

async function initializeGist(token) {
    const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
    try {
        const gistsResponse = await fetch('https://api.github.com/gists', { headers });
        if (!gistsResponse.ok) return null;
        const gists = await gistsResponse.json();
        
        const existingGist = gists.find(g => g.files['gothic_diary.json']);
        if (existingGist) return existingGist.id;

        const createResponse = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                description: 'Logs do Diário de Aprendizado Gótico (Vampiro Theme)',
                public: false,
                files: { 'gothic_diary.json': { content: JSON.stringify(dailyLog.logs) } }
            })
        });

        if (!createResponse.ok) return null;
        const newGist = await createResponse.json();
        return newGist.id;

    } catch (e) { console.error('Erro na API:', e); return null; }
}

async function saveLogsToGist(dataToSave) {
    const token = getToken();
    const gistId = getGistId();
    if (!token || !gistId) return false;

    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' },
            body: JSON.stringify({ files: { 'gothic_diary.json': { content: JSON.stringify(dataToSave.logs) } } })
        });
        return response.ok;
    } catch (e) { console.error('Erro ao salvar no Gist:', e); return false; }
}

async function downloadLogsFromGist() {
    const token = getToken();
    const gistId = getGistId();
    if (!token || !gistId) return;

    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (!response.ok) return;
        const gist = await response.json();
        const content = gist.files['gothic_diary.json']?.content;
        
        if (content) {
            const gistLogs = JSON.parse(content);
            const localLogs = dailyLog.loadLocal();
            dailyLog.logs = { ...localLogs, ...gistLogs }; 
            dailyLog.saveLocal();
        }
    } catch (e) { console.error('Erro ao baixar logs:', e); }
}

// ============================================================
// ANIMAÇÕES & ESTÉTICA GÓTICA (GSAP & Canvas)
// ============================================================

// --- Monitor de Atividade (Heartbeat Canvas Inteligente) ---
function setupActivityHeartbeat() {
    const canvas = document.getElementById('heartbeatCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    let points = [];
    const maxPoints = 120; 

    function getHeartbeatY(x) {
        const midY = height / 2;
        let y = midY + Math.sin(x * 0.05) * 2; 

        // Lê a variável global leve atualizada pela função updateHeartbeatText()
        const logsHoje = window.heartbeatBeats || 0;

        if (logsHoje === 0) return y; 

        const beats = Math.min(logsHoje, 6); 
        const xPulse = x % maxPoints;
        
        for (let i = 0; i < beats; i++) {
            const pulseStart = 20 + (i * 15); 
            
            if (xPulse > pulseStart && xPulse < pulseStart + 10) {
                const p = (xPulse - pulseStart) / 10;
                y = midY + 5 - Math.sin(p * Math.PI) * 35; 
            } else if (xPulse > pulseStart + 5 && xPulse < pulseStart + 8) {
                 y += 10; 
            }
        }
        return y;
    }

    for (let i = 0; i < maxPoints; i++) {
        points.push({ x: i * (width / maxPoints), y: height / 2 });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        ctx.beginPath();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#ef4444'; // Cor da linha (Mude para #2dd4bf se quiser Ciano)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < points.length; i++) {
            if (i === 0) ctx.moveTo(points[i].x, points[i].y);
            else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)'; // Brilho (Mude para rgba(45, 212, 191, 0.7) se for Ciano)
        
        const last = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0; 
    }

    let frameCount = 0;
    function animate() {
        frameCount++;
        
        points.shift();
        const newX = (points.length) * (width / maxPoints);
        const newY = getHeartbeatY(frameCount);
        points.push({ x: newX, y: newY });
        
        points.forEach((p, i) => p.x = i * (width / maxPoints));

        draw();
        requestAnimationFrame(animate);
    }

    animate();
}

// ============================================================
// INIT ────────────────────────────────────────────────────────
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Tenta baixar logs do GitHub (Fusão)
    if (getToken()) {
        await downloadLogsFromGist();
    }

    // 2. Setup dos Componentes da UI
    setupPageNavigation();
    setupLogModal();
    setupDeleteModal(); 
    setupActivitiesFilters();
    setupGistConfig();
    
    // 3. Renderização Inicial
    updateGameification(); 
    
    // 4. Setup Estético Gótico
    setupActivityHeartbeat();

    // Feedback visual inicial suave (GSAP)
    gsap.from('.sidebar', { x: -100, opacity: 0, duration: 0.8, ease: 'power2.out' });
    gsap.from('.home-hero', { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
    gsap.from('.gamification-section', { opacity: 0, duration: 1, delay: 0.5 });
});