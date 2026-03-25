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
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    // Limpa o timeout anterior se houver
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
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

    // --- NOVA REGRA DE ADICIONAR LOG (XP POR ÁREA) ---
    async addLog(title, description, area) {
        // Mapa de XP: Gamificação Gótica
        const xpMap = { 
            estagio: 20,    // Rotina normal
            faculdade: 20,  // Rotina normal
            estudo: 35,     // Esforço extra (estudo por fora)
            desafio: 45,    // Superou um problema
            conquista: 60   // Algo muito especial
        };

        const log = {
            id: Date.now(),
            title,
            description,
            area,
            xp: xpMap[area] || 20, // Padrão é 20 se der erro
            timestamp: new Date().toISOString()
        };

        const today = this.getToday();
        if (!this.logs[today]) this.logs[today] = [];
        this.logs[today].push(log);

        this.saveLocal();

        // Tenta salvar no GitHub Gist se configurado (retorna true/false)
        if (getToken() && getGistId()) {
            const ok = await saveLogsToGist({ logs: this.logs });
            return { log, synced: ok };
        }
        return { log, synced: false };
    }

    // --- NOVA FUNÇÃO DE APAGAR LOG (CORE) ---
    async deleteLog(idLog) {
        let logDeletado = false;
        
        // Procura em todos os dias pelo log com esse ID
        for (const data in this.logs) {
            const tamanhoOriginal = this.logs[data].length;
            // Filtra removendo o log que queremos apagar
            this.logs[data] = this.logs[data].filter(log => log.id !== idLog);
            
            // Se o tamanho diminuiu, é porque achou e apagou
            if (this.logs[data].length < tamanhoOriginal) {
                logDeletado = true;
                // Se o dia ficou vazio sem logs, remove o dia do objeto para não ocupar espaço
                if (this.logs[data].length === 0) {
                    delete this.logs[data];
                }
                break; // Sai do loop assim que achar
            }
        }

        if (logDeletado) {
            this.saveLocal();
            // Atualiza no GitHub Gist se estiver conectado
            if (getToken() && getGistId()) {
                await saveLogsToGist({ logs: this.logs });
            }
        }
        return logDeletado; // Retorna true se conseguiu apagar
    }

    // --- Cálculos de Gamificação ---
    getTotalXP() {
        return Object.values(this.logs).flat().reduce((sum, log) => sum + (log.xp || 0), 0);
    }

    getLevel() {
        const totalXP = this.getTotalXP();
        // Lógica simples: nível sobe a cada 500 XP
        const level = Math.floor(totalXP / 500) + 1;
        const xpInCurrentLevel = totalXP % 500;
        const xpToNextLevel = 500 - xpInCurrentLevel;
        const progressPercentage = (xpInCurrentLevel / 500) * 100;
        return { level, progressPercentage, xpToNextLevel };
    }

    getStreak() {
        let streak = 0;
        let currentDate = new Date();
        
        // Verifica se tem logs hoje
        if (this.getTodayLogs().length > 0) streak = 1;
        
        // Se não tem logs hoje, verifica se teve ontem para manter o streak ativo por um dia
        currentDate.setDate(currentDate.getDate() - (streak === 1 ? 1 : 0));
        
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (this.logs[dateStr] && this.logs[dateStr].length > 0) {
                if (streak === 0) streak = 1; // Começou a contar
                else streak++; // Incrementa
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break; // Quebrou a sequência
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

        // Melhor dia (XP máximo num único dia)
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

// --- Lógica de Navegação entre Páginas (Abas) ---
function setupPageNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages   = document.querySelectorAll('.page');
    const sidebar = document.getElementById('sidebar');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-page');
            
            // Remove active de todos os botões e adiciona no clicado
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Remove active de todas as páginas e adiciona na alvo
            pages.forEach(p => p.classList.remove('active'));
            const pg = document.querySelector(`.page[data-page="${target}"]`);
            if (pg) pg.classList.add('active');
            
            // Renderiza conteúdos específicos
            if (target === 'home') updateGameification();
            if (target === 'activities') renderActivities(currentFilter);
            if (target === 'languages') animateSkillBars();
            
            // Fecha a sidebar no mobile após clicar
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.style.width = '75px'; // Largura fechada mobile
                setTimeout(() => sidebar.style.width = '', 10); // Reseta pra regra CSS
            }
        });
    });
}

// --- Atualização da Home (Gamificação, Stats, Logs de Hoje) ---
function updateGameification() {
    // 1. Stats Básicos
    document.getElementById('totalXP').textContent = dailyLog.getTotalXP();
    const streak = dailyLog.getStreak();
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('streakDays').textContent = `${streak} dias`;

    // 2. Nível e Barra de Progresso
    const { level, xpToNextLevel } = dailyLog.getLevel();
    document.getElementById('currentLevel').textContent = level;
    document.getElementById('xpToNextLevel').textContent = `${xpToNextLevel} XP`;
    // (A animação da barra de progresso do nível pode ser feita aqui se houver uma no HTML)

    // 3. Painel de Desempenho
    const stats = dailyLog.getStats();
    document.getElementById('weekDays').textContent = stats.weekDays;
    document.getElementById('weekXP').textContent = `${stats.weekXP} XP`;
    document.getElementById('monthDays').textContent = stats.monthDays;
    document.getElementById('monthXP').textContent = `${stats.monthXP} XP`;
    document.getElementById('bestDay').textContent = stats.bestDay;
    document.getElementById('bestDayValue').textContent = `${stats.bestDayXP} XP`;

    // 4. Logs de Hoje (com Botão Excluir)
    updateTodayLogs();

    // 5. NOVA LÓGICA: Atualizar o Humor do Drácula
    updateDraculaMood();
}

// --- NOVA LÓGICA: MONITOR EMOCIONAL (DRÁCULA MOOD COM ÍCONES REAIS) ---
function updateDraculaMood() {
    const iconEl = document.getElementById('emotionIcon');
    const statusEl = document.getElementById('emotionStatus');
    const messageEl = document.getElementById('emotionMessage');

    if (!iconEl) return;

    const streak = dailyLog.getStreak();
    const logsHoje = dailyLog.getTodayLogs();
    const xpHojes = logsHoje.reduce((sum, log) => sum + (log.xp || 0), 0);
    const nivel = dailyLog.getLevel().level;

    // Definição das imagens e mensagens (usando seus novos ícones)
    let mood = {
        icon: 'dracula_8534615.png', // Humor Normal
        status: 'Avaliando sua noite...',
        message: 'A noite é longa. Comece registrando o que aprendeu hoje.'
    };

    if (xpHojes === 0) {
        // Nada feito hoje
        mood = {
            icon: 'ghost_8493864.png', // Fantasma Irritado/Triste
            status: 'Entediado...',
            message: 'O silêncio do castelo está insuportável. Nada a documentar?'
        };
    } else if (xpHojes > 120 || streak > 7) {
        // Muito produtivo hoje OU streak alto
        mood = {
            icon: 'vampiro.png', // Boca com Presas (Satisfeito/Sedento por saber)
            status: 'Sedento!',
            message: 'Sinto o poder do conhecimento fluindo! Ótimo progresso.'
        };
    } else if (nivel > 5 && xpHojes > 40) {
        // Nível alto e ativo hoje
        mood = {
            icon: 'moon_4139153.png', // Lua (Lorde experiente)
            status: 'Lorde Sabedor',
            message: 'Sua sabedoria ancestral cresce a cada registro sombrio.'
        };
    } else {
        // Produtividade normal
        mood = {
            icon: 'dracula_8534615.png', // Drácula Normal
            status: 'Satisfeito',
            message: 'Bom trabalho hoje. Documentar é garantir sua imortalidade.'
        };
    }

    // Aplica as mudanças visualmente (Ícone, Status e Mensagem)
    iconEl.src = mood.icon;
    statusEl.textContent = mood.status;
    messageEl.textContent = mood.message;
    
    // Pequena animação de pulso no ícone quando muda
    gsap.fromTo(iconEl, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
}

// --- Renderizar Logs de Hoje (com Botão Excluir) ---
function updateTodayLogs() {
    const container = document.getElementById('todayLogs');
    const lastLogTextEl = document.getElementById('lastLogText');
    if (!container) return;
    
    const logs = dailyLog.getTodayLogs();

    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-state" style="padding: 2rem 0; font-size: var(--fs-sm);">Nenhum registro hoje.</p>';
        if (lastLogTextEl) lastLogTextEl.textContent = 'Nenhum registro ainda';
        return;
    }

    if (lastLogTextEl) {
        const last = logs[logs.length - 1];
        lastLogTextEl.textContent = `Último: ${last.title}`;
    }

    // Renderiza a lista de baixo para cima (mais novo primeiro)
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

// --- Renderizar Página de Atividades (Timeline Completa com Filtros e Excluir) ---
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

    // Aplica filtro se necessário
    if (filter !== 'all') {
        logs = logs.filter(log => log.area === filter);
    }

    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhuma atividade encontrada neste filtro.</p>';
        return;
    }

    // Renderiza os Activity Cards
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
    // Reinicia a largura para 0 e anima com o GSAP (se disponível) ou CSS
    bars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%'; 
        setTimeout(() => bar.style.width = width, 100);
    });
}

// ============================================================
// MODAIS, FORMULÁRIOS & SINCRONIZAÇÃO (GitHub)
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

    // Fecha se clicar fora da caixa
    window.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('show');
    });

    // Envio do Formulário (Substituído dificuldade por área)
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const title       = document.getElementById('logTitle')?.value?.trim();
        const description = document.getElementById('logDescription')?.value?.trim();
        const area        = document.getElementById('logArea')?.value;

        if (!title) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Salvando sombriamente...';
        if (syncEl) { syncEl.style.display = 'block'; syncEl.textContent = getToken() ? 'Sincronizando com GitHub Gist...' : 'Salvando localmente...'; }

        // Chama o addLog do core (Dificuldade foi removida)
        const { log, synced } = await dailyLog.addLog(title, description, area);

        // Feedback
        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar log';
        if (syncEl) syncEl.style.display = 'none';

        updateGameification(); // Atualiza toda a home (inclusive Drácula)

        // Dispara monitor de atividade (simula o heartbeat trigger)
        if (typeof heartbeatTrigger Pulse === 'function') {
            const intensidadeMonitor = { estagio:1.0, faculdade:1.0, estudo:1.3, desafio:1.5, conquista:1.8 }[area] || 1;
            heartbeatTriggerPulse(intensidadeMonitor);
        }

        const syncMsg = synced ? ' · sincronizado no GitHub' : (getToken() ? ' · erro ao sincronizar' : '');
        showToast(`+${log.xp} XP registrado sombriamente${syncMsg}`);

        form.reset();
        modal.classList.remove('show');
    });
}

// --- NOVO: MODAL DE CONFIRMAÇÃO DE EXCLUSÃO CUSTOMIZADO ---
function setupDeleteModal() {
    const deleteModal = document.getElementById('deleteConfirmModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    let logIdToDelete = null;

    if (!deleteModal || !confirmBtn || !cancelBtn) return;

    // 1. Abre o modal customizado ao clicar no "X" (Evento Global no Document)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-log-btn')) {
            logIdToDelete = parseInt(e.target.getAttribute('data-id'));
            deleteModal.classList.add('show');
        }
    });

    // 2. Ação de Cancelar Exclusão
    cancelBtn.addEventListener('click', () => {
        deleteModal.classList.remove('show');
        logIdToDelete = null;
    });

    // 3. Ação de Confirmar Exclusão
    confirmBtn.addEventListener('click', async () => {
        if (logIdToDelete === null) return;

        // Feedback visual no botão do modal
        const textoOriginal = confirmBtn.textContent;
        confirmBtn.textContent = 'Expurgando...';
        confirmBtn.disabled = true;
        
        // Executa a função do CORE DailyLog para apagar
        const apagou = await dailyLog.deleteLog(logIdToDelete);
        
        if (apagou) {
            showToast('Log removido do diário gótico.');
            // Atualiza toda a interface (XP, Drácula, Timeline)
            updateGameification();
            renderActivities(currentFilter);
        } else {
            showToast('Erro ao expurgar o log.');
        }

        // Reseta o botão e fecha o modal
        confirmBtn.textContent = textoOriginal;
        confirmBtn.disabled = false;
        deleteModal.classList.remove('show');
        logIdToDelete = null;
    });

    // 4. Fecha o modal se clicar fora da caixa gótica
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

// --- Configuração inicial do Token (pela UI) ---
function setupGistConfig() {
    const tokenInput = document.getElementById('githubToken');
    const saveBtn    = document.getElementById('saveTokenBtn');
    const statusEl   = document.getElementById('gistStatus');
    const gistLinkEl = document.getElementById('gistConfig');

    if (!tokenInput || !saveBtn) return;

    // Se já tiver token, esconde o config e mostra info
    if (getToken()) {
        gistLinkEl.innerHTML = `<p class="gist-info" style="color: #6ee7b7; border-color: #065f46;">✓ Sincronizado com GitHub Gist (ID: ${getGistId() || '...'})<br><button class="btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 10px; margin-top: 0.5rem;" onclick="localStorage.removeItem(dailyLog.TOKEN_KEY); location.reload();">Desconectar</button></p>`;
    }

    saveBtn.onclick = async () => {
        const token = tokenInput.value.trim();
        if (!token || !token.startsWith('ghp_')) { showToast('Token inválido. Deve começar com ghp_'); return; }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Conectando...';
        statusEl.textContent = 'Validando token e criando/buscando Gist...';
        statusEl.style.color = var(--text-muted);

        // Chama função para conectar/criar gist
        const gistId = await initializeGist(token);

        if (gistId) {
            localStorage.setItem(dailyLog.TOKEN_KEY, token);
            localStorage.setItem(dailyLog.GIST_ID_KEY, gistId);
            statusEl.textContent = 'Conectado com sucesso!';
            statusEl.style.color = '#6ee7b7';
            showToast('Conectado ao GitHub Gist!');
            setTimeout(() => location.reload(), 1500); // Recarrega para baixar logs
        } else {
            statusEl.textContent = 'Erro ao conectar ao GitHub. Verifique o token e as permissões (gist).';
            statusEl.style.color = '#fca5a5';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Conectar';
        }
    };
}

// --- Funções Auxiliares da API do GitHub ---
async function initializeGist(token) {
    const headers = { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' };
    
    // 1. Tenta buscar se já existe um gist desse diário
    try {
        const gistsResponse = await fetch('https://api.github.com/gists', { headers });
        if (!gistsResponse.ok) return null;
        const gists = await gistsResponse.json();
        
        // Procura um gist que tenha o arquivo 'gothic_diary.json'
        const existingGist = gists.find(g => g.files['gothic_diary.json']);
        
        if (existingGist) {
            console.log('Gist existente encontrado:', existingGist.id);
            return existingGist.id;
        }

        // 2. Se não existe, cria um novo Gist Privado
        console.log('Criando novo Gist privado...');
        const createResponse = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                description: 'Logs do Diário de Aprendizado Gótico (Vampiro Theme)',
                public: false, // Privado
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
            console.log('Logs baixados do GitHub.');
            // Fusão simples (GitHub ganha se houver conflito no mesmo ID)
            const localLogs = dailyLog.loadLocal();
            // (Fusão mais complexa seria necessária para produção real)
            dailyLog.logs = { ...localLogs, ...gistLogs }; 
            dailyLog.saveLocal();
        }
    } catch (e) { console.error('Erro ao baixar logs:', e); }
}

// ============================================================
// ANIMAÇÕES & ESTÉTICA GÓTICA (GSAP & Canvas)
// ============================================================

// --- Monitor de Atividade (Heartbeat Canvas) ---
function setupActivityHeartbeat() {
    const canvas = document.getElementById('heartbeatCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Ajuste de DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    let points = [];
    const maxPoints = 60;
    let baseRate = 1; // 1 segundo (normal)
    let triggerMultiplier = 1; // Pulso extra

    function getHeartbeatY(x) {
        const midY = height / 2;
        // Onda base suave
        let y = midY + Math.sin(x * 0.1 * baseRate) * 3;
        
        // Simulação do pulso QRS (o pico)
        const pulsePos = 20; // Onde o pico acontece
        const xPulse = x % maxPoints;
        if (xPulse > pulsePos && xPulse < pulsePos + 10) {
            // Desenha o pico gótico (em forma de V ou M)
            const p = (xPulse - pulsePos) / 10;
            y = midY + 5 - Math.sin(p * Math.PI) * 35 * triggerMultiplier; // Sobe
        } else if (xPulse > pulsePos + 5 && xPulse < pulsePos + 8) {
             y += 10; // Queda rápida após o pico
        }
        return y;
    }

    // Inicializa pontos
    for (let i = 0; i < maxPoints; i++) {
        points.push({ x: i * (width / maxPoints), y: height / 2 });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // Desenha a linha Carmesim Gótica
        ctx.beginPath();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = '#ef4444'; // Vermelho Neon Carmesim
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 0; i < points.length; i++) {
            if (i === 0) ctx.moveTo(points[i].x, points[i].y);
            else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Adiciona efeito de brilho (Neon Glow) na linha
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
        
        // Desenha o ponto final brilhante (o "leads" do monitor)
        const last = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0; // Reseta o brilho
    }

    let frameCount = 0;
    function animate() {
        frameCount++;
        
        // Shift points à esquerda
        points.shift();
        const newX = (points.length) * (width / maxPoints);
        const newY = getHeartbeatY(frameCount);
        points.push({ x: newX, y: newY });
        
        // Recalcula X de todos os pontos para manter espaçamento
        points.forEach((p, i) => p.x = i * (width / maxPoints));

        // Diminui o gatilho de pulso suavemente
        triggerMultiplier = gsap.utils.interpolate(triggerMultiplier, 1, 0.03);

        draw();
        requestAnimationFrame(animate);
    }

    // Função global exposta para o formulário chamar
    window.heartbeatTriggerPulse = function(intensity = 1.5) {
        triggerMultiplier = intensity;
        gsap.to({}, { duration: 0.1, onStart: () => triggerMultiplier = intensity });
    };

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
    setupDeleteModal(); // NOVO: Configurar exclusão com modal customizado
    setupActivitiesFilters();
    setupGistConfig();
    
    // 3. Renderização Inicial
    updateGameification(); // Atualiza Home, Stats, Logs de Hoje e Drácula Mood
    
    // 4. Setup Estético Gótico
    setupActivityHeartbeat();

    // Feedback visual inicial suave (GSAP)
    gsap.from('.sidebar', { x: -100, opacity: 0, duration: 0.8, ease: 'power2.out' });
    gsap.from('.home-hero', { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
    gsap.from('.gamification-section', { opacity: 0, duration: 1, delay: 0.5 });
});