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

// --- ORÁCULO: MISSÕES DIÁRIAS ---
// --- ORÁCULO: MISSÕES DIÁRIAS ---
let currentQuestText = ""; // Guarda o texto da missão do dia

function updateDailyQuest() {
    // O Grande Tomo de Missões (Adiciona quantas quiseres aqui!)
    const quests = [
        /* ── CÓDIGO E PRÁTICA ── */
        "Foco no código: Suje as mãos. Escreva ou corrija algum script hoje, por menor que seja.",
        "Arquitetura das Trevas: Revise a estrutura de um projeto, infraestrutura ou código. Entenda como as peças se conectam.",
        "Caça aos Bugs: Enfrente aquele erro ou aviso que você tem ignorado. Resolva ou entenda por que ele acontece.",
        "Sussurros da Máquina: Leia uma documentação oficial. Não um tutorial, mas o texto sagrado original da tecnologia.",
        "Feitiço Novo: Teste um comando, atalho ou função que você nunca usou antes. Incorpore-o ao seu arsenal.",
        "Desafio prático: Tente aplicar algo que você viu no estágio num cenário só seu.",
        "Refatoração Sombria: Pegue num código antigo ou anotação sua e melhore-o. Deixe-o mais limpo e eficiente.",
        "Segurança das Trevas: Pense como um invasor. Revise algum projeto ou conceito focado em falhas de segurança.",
        "Automação: O que você faz repetidamente? Pesquise uma forma de automatizar essa dor.",
        "Mestre da Nuvem: Dedique 20 minutos para explorar um serviço da AWS ou conceito de Cloud que você ainda não domina.",
        
        /* ── FACULDADE E TEORIA ── */
        "Dia de absorver: Assista a uma aula da faculdade ou leia a matéria sem pressa, apenas para entender o conceito.",
        "Conexões Ocultas: Tente ligar o que você está a aprender na faculdade com o que você faz no estágio.",
        "De volta às bases: Revise um conceito fundamental de redes, banco de dados ou lógica que pode estar esquecido.",
        "Além do óbvio: Pesquise sobre uma ferramenta ou termo que você ouviu os seniores falarem e não sabe o que é.",
        "O Poder da Escrita: Resuma um conceito complexo que aprendeu recentemente em apenas um parágrafo. Se não conseguir, estude mais.",
        "Expandindo Horizontes: Leia um artigo ou assista a um vídeo sobre uma área da tecnologia diferente da sua.",
        "Ajuste de rota: Revise aquele conceito de Infra/Terraform que ainda está confuso na sua cabeça.",
        
        /* ── CARREIRA E SOFT SKILLS ── */
        "Visão de Mestre: Como o seu trabalho no estágio impacta o negócio da empresa? Entenda o valor do que você faz.",
        "Marca nas Sombras: Atualize o seu LinkedIn, currículo ou GitHub. A sua vitrine precisa estar impecável.",
        "Comunicação Clara: Pratique explicar um problema técnico de forma que uma pessoa leiga entenda.",
        "Mapeamento de Território: Observe como os processos funcionam na sua empresa. O que poderia ser melhorado?",
        "Alianças: Troque uma ideia ou tire uma dúvida com alguém mais experiente hoje. Absorva o conhecimento deles.",
        
        /* ── ORGANIZAÇÃO E DESCANSO ── */
        "Limpeza mental: Organize as suas anotações, feche as abas abertas e planeie o próximo ataque.",
        "Descanso estratégico: O ócio também forja guerreiros. Apenas consuma um conteúdo leve ou descanse a mente.",
        "Afiando a Lâmina: Organize o seu ambiente de estudo/trabalho físico e digital. O caos externo gera caos interno.",
        "Retrospectiva Sombria: Leia os seus logs das últimas semanas neste grimório. Veja o quanto você já evoluiu.",
        "Planeamento de Batalha: Escreva quais são os seus 3 maiores objetivos para os próximos 30 dias.",
        "Purificação: Exclua ficheiros inúteis, limpe o seu desktop e organize as pastas do seu computador.",
        "O Silêncio Ensina: Fique 15 minutos longe de ecrãs. Deixe o cérebro processar a informação que sugou durante o dia.",
        "Ritual de Foco: Hoje, estude ou code usando a técnica Pomodoro. Foco total, zero distrações.",
        "Oferenda ao Grimório: Não faça nada de novo hoje além de documentar tudo o que está pendente na sua mente."
    ];
    
    // MAGIA DE TEMPO: Calcula qual é o dia do ano (1 a 365)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Escolhe a missão baseada no dia do ano
    const indexQuest = dayOfYear % quests.length;
    currentQuestText = quests[indexQuest]; 
    
    const questEl = document.getElementById('dailyQuestText');
    const btnEl = document.getElementById('completeQuestBtn');
    
    if (questEl) {
        questEl.textContent = `"${currentQuestText}"`;
    }

    const todayStr = now.toISOString().split('T')[0];
    const questFeitaEm = localStorage.getItem('gothic_diary_quest_date');

    if (questFeitaEm === todayStr) {
        marcarMissaoComoFeita(questEl, btnEl, false);
    } else if (btnEl) {
        btnEl.classList.remove('completed');
        // A LINHA NOVA É ESTA:
        btnEl.innerHTML = '<span class="quest-btn-text">Atender</span><span class="quest-btn-icon">✦</span>';
        if (questEl) questEl.classList.remove('quest-completed-text');
        
        btnEl.onclick = () => {
            const questModal = document.getElementById('questModal');
            const modalText = document.getElementById('questModalText');
            if (modalText) modalText.textContent = `"${currentQuestText}"`;
            if (questModal) questModal.classList.add('show');
        };
    }
}
// ----------------------------------------------------

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

    loadLocal() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        try { return saved ? JSON.parse(saved) : {}; } 
        catch (e) { return {}; }
    }

    saveLocal() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    }

    getToday() { return new Date().toISOString().split('T')[0]; }
    getTodayLogs() { return this.logs[this.getToday()] || []; }

    getAllLogsFlat() {
        return Object.values(this.logs).flat().sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // --- Adicionar Log Atualizado (Com Emoções e Propósito) ---
    async addLog(title, description, area, emotion, reason) {
        const xpMap = { estagio: 20, faculdade: 20, estudo: 35, desafio: 45, conquista: 60 };

        const log = {
            id: Date.now(),
            title,
            description,
            area,
            emotion: emotion || 'focada',
            reason: reason || '',
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

    async deleteLog(idLog) {
        let logDeletado = false;
        for (const data in this.logs) {
            const tamanhoOriginal = this.logs[data].length;
            this.logs[data] = this.logs[data].filter(log => log.id !== idLog);
            if (this.logs[data].length < tamanhoOriginal) {
                logDeletado = true;
                if (this.logs[data].length === 0) delete this.logs[data];
                break;
            }
        }
        if (logDeletado) {
            this.saveLocal();
            if (getToken() && getGistId()) await saveLogsToGist({ logs: this.logs });
        }
        return logDeletado;
    }

    getTotalXP() { return Object.values(this.logs).flat().reduce((sum, log) => sum + (log.xp || 0), 0); }

    getLevel() {
        const totalXP = this.getTotalXP();
        const level = Math.floor(totalXP / 500) + 1;
        const xpInCurrentLevel = totalXP % 500;
        const xpToNextLevel = 500 - xpInCurrentLevel;
        return { level, progressPercentage: (xpInCurrentLevel / 500) * 100, xpToNextLevel };
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

        let bestDayXP = 0; let bestDayDate = '--';
        for (const data in this.logs) {
            const dayXP = this.logs[data].reduce((sum, l) => sum + (l.xp || 0), 0);
            if (dayXP > bestDayXP) {
                bestDayXP = dayXP;
                bestDayDate = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
            }
        }

        return {
            weekDays: uniqueDays(logsWeek), weekXP: logsWeek.reduce((sum, l) => sum + (l.xp || 0), 0),
            monthDays: uniqueDays(logsMonth), monthXP: logsMonth.reduce((sum, l) => sum + (l.xp || 0), 0),
            bestDay: bestDayDate, bestDayXP: bestDayXP
        };
    }
}

const dailyLog = new DailyLog();

// ============================================================
// GESTÃO DE UI & RENDERIZAÇÃO
// ============================================================

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
            
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.style.width = '75px';
                setTimeout(() => sidebar.style.width = '', 10);
            }
        });
    });
}

function updateGameification() {
    document.getElementById('totalXP').textContent = dailyLog.getTotalXP();
    const streak = dailyLog.getStreak();
    document.getElementById('currentStreak').textContent = streak;
    document.getElementById('streakDays').textContent = `${streak} dias`;

    const { level, xpToNextLevel } = dailyLog.getLevel();
    document.getElementById('currentLevel').textContent = level;
    document.getElementById('xpToNextLevel').textContent = `${xpToNextLevel} XP`;

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

function updateHeartbeatText() {
    const logsHoje = dailyLog.getTodayLogs().length;
    window.heartbeatBeats = logsHoje; 
    
    const statusEl = document.getElementById('heartbeatStatus');
    const syncEl = document.getElementById('hbSync');
    const freqEl = document.getElementById('hbFreq');
    const powerEl = document.getElementById('hbPower');

    if (statusEl) {
        if (logsHoje === 0) {
            statusEl.textContent = 'Sem Sinais Vitais...';
            statusEl.style.color = 'var(--text-soft)';
            statusEl.style.textShadow = 'none';
            if(syncEl) { syncEl.textContent = 'Nula'; syncEl.style.color = 'var(--text-soft)'; }
            if(freqEl) { freqEl.textContent = '0.0Hz'; freqEl.style.color = 'var(--text-soft)'; }
            if(powerEl) { powerEl.textContent = '0%'; powerEl.style.color = 'var(--text-soft)'; }
        } else if (logsHoje <= 2) {
            statusEl.textContent = 'Ressuscitando...';
            statusEl.style.color = '#fca5a5';
            statusEl.style.textShadow = 'none';
            if(syncEl) { syncEl.textContent = 'Fraca'; syncEl.style.color = '#fca5a5'; }
            if(freqEl) { freqEl.textContent = (logsHoje * 2.4).toFixed(1) + 'Hz'; freqEl.style.color = '#fca5a5'; }
            if(powerEl) { powerEl.textContent = (logsHoje * 25) + '%'; powerEl.style.color = '#fca5a5'; }
        } else {
            statusEl.textContent = 'Frenesi Sombrio!';
            statusEl.style.color = '#ef4444'; 
            statusEl.style.textShadow = '0 0 8px rgba(239,68,68,0.6)'; 
            if(syncEl) { syncEl.textContent = 'Máxima!'; syncEl.style.color = '#ef4444'; }
            if(freqEl) { freqEl.textContent = (logsHoje * 3.8).toFixed(1) + 'Hz'; freqEl.style.color = '#ef4444'; }
            if(powerEl) { powerEl.textContent = Math.min(logsHoje * 30, 100) + '%'; powerEl.style.color = '#ef4444'; }
        }
    }
}

function updateGhostMood() {
    const iconEl = document.getElementById('emotionIcon');
    const statusEl = document.getElementById('emotionStatus');
    const messageEl = document.getElementById('emotionMessage');
    if (!iconEl) return;

    const streak = dailyLog.getStreak();
    const xpHojes = dailyLog.getTodayLogs().reduce((sum, log) => sum + (log.xp || 0), 0);
    const nivel = dailyLog.getLevel().level;

    let mood = {};
    if (xpHojes === 0) {
        mood = { icon: 'img/teia-de-aranha.png', status: 'Morto por dentro.', message: 'Nem eu que sou um fantasma estou tão parado. Vá estudar!' };
    } else if (xpHojes > 120 || streak > 7) {
        mood = { icon: 'img/haunted-house_5421742.png', status: 'Poltergeist!', message: 'Quanta energia! Quase consigo sentir meu coração bater de novo.' };
    } else if (nivel > 5 && xpHojes > 40) {
        mood = { icon: 'img/moon_4139153.png', status: 'Espírito Ancião', message: 'Sua aura brilha mais que a lua cheia. Uma assombração de respeito.' };
    } else {
        mood = { icon: 'img/ghost_8493864.png', status: 'Alma Penada.', message: 'Um progresso fantasmagórico. Continue assim.' };
    }

    iconEl.src = mood.icon;
    statusEl.textContent = mood.status;
    messageEl.textContent = mood.message;
}

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

    if (lastLogTextEl) lastLogTextEl.textContent = `Último: ${logs[logs.length - 1].title}`;

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

// --- RENDERIZAÇÃO DAS CARTAS MÁGICAS ---
function renderActivities(filter = 'all') {
    const container = document.getElementById('activitiesTimeline');
    if (!container) return;
    
    let logs = dailyLog.getAllLogsFlat();
    if (filter !== 'all') logs = logs.filter(log => log.area === filter);

    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum feitiço registrado neste grimório ainda.</p>';
        return;
    }

    const emotionIcons = { 'empolgada': '🔥', 'frustrada': '💀', 'exausta': '🦇', 'focada': '👁️' };

    container.innerHTML = logs.map(log => {
        const d = new Date(log.timestamp);
        const date = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
        const area = log.area || 'estudo';
        const areaLabel = AREA_LABELS[area] || area;
        const emotion = log.emotion || 'focada';
        const emoIcon = emotionIcons[emotion] || '🔮';
        
        let descHtml = '';
        if (log.description) descHtml += `<p class="magic-card-desc">"${log.description}"</p>`;
        if (log.reason) descHtml += `<p class="magic-card-desc" style="color:#fca5a5; font-size:0.8rem; border-color: #fca5a5;">Propósito: ${log.reason}</p>`;

        return `
            <div class="magic-card area-${area}">
                <div class="magic-card-glow"></div>
                <div class="magic-card-header">
                    <span class="magic-card-emotion" title="${emotion}">${emoIcon}</span>
                    <span class="magic-card-date">${date}</span>
                </div>
                <h3 class="magic-card-title">${log.title}</h3>
                ${descHtml}
                <div class="magic-card-footer">
                    <span class="area-tag area-${area}">${areaLabel}</span>
                    <div class="magic-card-actions">
                        <span class="magic-card-xp">+${log.xp} XP</span>
                        <button class="delete-log-btn" data-id="${log.id}" title="Excluir este log">×</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================
// MODAIS E FORMULÁRIOS
// ============================================================

// --- Gestão do Novo Modal de 2 Passos ---
function setupLogModal() {
    const modal    = document.getElementById('logModal');
    const btn      = document.getElementById('addLogBtn');
    const closeBtn = document.getElementById('closeLogModal');
    
    const step1 = document.querySelector('.modal-step[data-step="1"]');
    const step2 = document.querySelector('.modal-step[data-step="2"]');
    const btnStep1Next = document.getElementById('btnStep1Next');
    const btnStep2Back = document.getElementById('btnStep2Back');
    const submitBtnFinal = document.getElementById('submitLogBtnFinal');

    if (!modal || !btn) return;

    // Abrir Modal e resetar campos
    btn.onclick = () => {
        document.getElementById('logTitle').value = '';
        document.getElementById('logDescription').value = '';
        document.getElementById('logReason').value = '';
        if(step1 && step2) {
            step1.style.display = 'block';
            step2.style.display = 'none';
        }
        modal.classList.add('show');
    };
    
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('show');
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

    // Avançar para Passo 2
    if(btnStep1Next) {
        btnStep1Next.addEventListener('click', (e) => {
            e.preventDefault(); // Impede de recarregar a tela
            if(document.getElementById('logTitle').value.trim() !== '') {
                step1.style.display = 'none';
                step2.style.display = 'block';
            } else {
                showToast("O grimório exige um título para o evento!");
            }
        });
    }

    // Voltar para Passo 1
    if(btnStep2Back) {
        btnStep2Back.addEventListener('click', (e) => {
            e.preventDefault();
            step2.style.display = 'none';
            step1.style.display = 'block';
        });
    }

    // Selar Registro (Finalizar)
    if(submitBtnFinal) {
        submitBtnFinal.addEventListener('click', async e => {
            e.preventDefault();
            const title       = document.getElementById('logTitle')?.value?.trim();
            const description = document.getElementById('logDescription')?.value?.trim();
            const area        = document.getElementById('logArea')?.value;
            const emotion     = document.getElementById('logEmotion')?.value || 'focada';
            const reason      = document.getElementById('logReason')?.value?.trim();

            if (!title) return;

            submitBtnFinal.disabled = true;
            submitBtnFinal.textContent = 'Materializando...';

            const { log, synced } = await dailyLog.addLog(title, description, area, emotion, reason);

            submitBtnFinal.disabled = false;
            submitBtnFinal.textContent = '⛧ Selar no Grimório';

            updateGameification(); 
            const syncMsg = synced ? ' · sincronizado no GitHub' : (getToken() ? ' · erro ao sincronizar' : '');
            showToast(`+${log.xp} XP registrado sombriamente${syncMsg}`);

            modal.classList.remove('show');
        });
    }
}

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

    cancelBtn.addEventListener('click', () => { deleteModal.classList.remove('show'); logIdToDelete = null; });

    confirmBtn.addEventListener('click', async () => {
        if (logIdToDelete === null) return;
        const textoOriginal = confirmBtn.textContent;
        confirmBtn.textContent = 'Expurgando...';
        confirmBtn.disabled = true;
        
        const botaoDelete = document.querySelector(`.delete-log-btn[data-id="${logIdToDelete}"]`);
        if (botaoDelete) {
            const caixaLog = botaoDelete.closest('.log-item') || botaoDelete.closest('.magic-card');
            if (caixaLog) {
                caixaLog.classList.add('expurgando'); 
                await new Promise(resolve => setTimeout(resolve, 450)); 
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
        if (e.target === deleteModal) { deleteModal.classList.remove('show'); logIdToDelete = null; }
    });
}

// --- CONTROLE DO MODAL DA MISSÃO (O CÉREBRO QUE FALTAVA) ---
function setupQuestModal() {
    const modal = document.getElementById('questModal');
    const closeBtn = document.getElementById('closeQuestModal');
    const saveBtn = document.getElementById('saveQuestBtn');
    const input = document.getElementById('questAnswer');

    if (!modal) return;

    // Fechar o modal ao clicar no X ou fora da caixa
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('show');
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

    // Salvar e reivindicar os pontos
    if (saveBtn) {
        saveBtn.onclick = async () => {
            const answer = input.value.trim();
            if (!answer) {
                showToast('O Oráculo exige um relato do seu feito!');
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = 'Transmutando energia...';

            // Registra a missão como uma "Conquista" valendo 60 XP
            const title = "🔮 Missão do Oráculo Cumprida";
            const fullDesc = `Sussurro: ${currentQuestText}\n\nMeu relato: ${answer}`;
            
            await dailyLog.addLog(title, fullDesc, 'conquista', 'empolgada', 'Sussurro do Oráculo atendido');

            // Marca a missão do dia como concluída no localStorage
            const todayStr = new Date().toISOString().split('T')[0];
            localStorage.setItem('gothic_diary_quest_date', todayStr);
            
            // Muda o botão principal para o brilho verde
            const questEl = document.getElementById('dailyQuestText');
            const btnEl = document.getElementById('completeQuestBtn');
            if (btnEl) {
                btnEl.classList.add('completed');
                btnEl.innerHTML = '✨'; 
                btnEl.onclick = null;   
            }
            if (questEl) {
                questEl.classList.add('quest-completed-text');
            }
            showToast("O Oráculo sorri para si. Missão cumprida!");

            // Limpa o formulário e fecha o modal
            input.value = '';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Reivindicar Recompensa (60 XP)';
            modal.classList.remove('show');
            
            // Atualiza os painéis para mostrar o XP ganho
            updateGameification();
            renderActivities(currentFilter); 
        };
    }
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
        gistLinkEl.innerHTML = `<p class="gist-info" style="color: #6ee7b7; border-color: #065f46;">✓ Sincronizado com GitHub Gist<br><button class="btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 10px; margin-top: 0.5rem;" onclick="localStorage.removeItem('${dailyLog.TOKEN_KEY}'); location.reload();">Desconectar</button></p>`;
    }

    saveBtn.onclick = async () => {
        const token = tokenInput.value.trim();
        if (!token || !token.startsWith('ghp_')) { showToast('Token inválido. Deve começar com ghp_'); return; }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Conectando...';
        statusEl.textContent = 'Validando token...';
        
        const gistId = await initializeGist(token);

        if (gistId) {
            localStorage.setItem(dailyLog.TOKEN_KEY, token);
            localStorage.setItem(dailyLog.GIST_ID_KEY, gistId);
            showToast('Conectado ao GitHub Gist!');
            setTimeout(() => location.reload(), 1500); 
        } else {
            statusEl.textContent = 'Erro de permissões (gist).';
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
            method: 'POST', headers,
            body: JSON.stringify({
                description: 'Logs do Diário de Aprendizado Gótico (Vampiro Theme)',
                public: false,
                files: { 'gothic_diary.json': { content: JSON.stringify(dailyLog.logs) } }
            })
        });
        if (!createResponse.ok) return null;
        return (await createResponse.json()).id;
    } catch (e) { return null; }
}

async function saveLogsToGist(dataToSave) {
    const token = getToken(); const gistId = getGistId();
    if (!token || !gistId) return false;
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' },
            body: JSON.stringify({ files: { 'gothic_diary.json': { content: JSON.stringify(dataToSave.logs) } } })
        });
        return response.ok;
    } catch (e) { return false; }
}

async function downloadLogsFromGist() {
    const token = getToken(); const gistId = getGistId();
    if (!token || !gistId) return;
    try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, { headers: { 'Authorization': `token ${token}` } });
        if (!response.ok) return;
        const content = (await response.json()).files['gothic_diary.json']?.content;
        if (content) {
            const gistLogs = JSON.parse(content);
            dailyLog.logs = { ...dailyLog.loadLocal(), ...gistLogs }; 
            dailyLog.saveLocal();
        }
    } catch (e) {}
}

// ============================================================
// ANIMAÇÕES & ESTÉTICA GÓTICA (GSAP & Canvas)
// ============================================================
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
        const logsHoje = window.heartbeatBeats || 0;
        if (logsHoje === 0) return y; 

        const beats = Math.min(logsHoje, 6); 
        const xPulse = x % maxPoints;
        
        for (let i = 0; i < beats; i++) {
            const pulseStart = 20 + (i * 15); 
            if (xPulse > pulseStart && xPulse < pulseStart + 10) {
                y = midY + 5 - Math.sin(((xPulse - pulseStart) / 10) * Math.PI) * 35; 
            } else if (xPulse > pulseStart + 5 && xPulse < pulseStart + 8) {
                 y += 10; 
            }
        }
        return y;
    }

    for (let i = 0; i < maxPoints; i++) points.push({ x: i * (width / maxPoints), y: height / 2 });

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.lineWidth = 1.8; ctx.strokeStyle = '#ef4444'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

        for (let i = 0; i < points.length; i++) {
            if (i === 0) ctx.moveTo(points[i].x, points[i].y);
            else ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
        const last = points[points.length - 1];
        ctx.beginPath(); ctx.arc(last.x, last.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 15; ctx.shadowColor = '#fff'; ctx.fill(); ctx.shadowBlur = 0; 
    }

    let frameCount = 0;
    function animate() {
        frameCount++;
        points.shift();
        points.push({ x: (points.length) * (width / maxPoints), y: getHeartbeatY(frameCount) });
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
    updateDailyQuest(); // Inicia o Oráculo

    if (getToken()) await downloadLogsFromGist();

    setupPageNavigation();
    setupLogModal();
    setupDeleteModal(); 
    
    // A MAGIA ESTAVA A FALHAR AQUI! O setupQuestModal tem que ser chamado.
    if (typeof setupQuestModal === "function") {
        setupQuestModal(); 
    }
    
    setupActivitiesFilters();
    setupGistConfig();
    
    updateGameification(); 
    setupActivityHeartbeat();

    if(typeof gsap !== 'undefined') {
        gsap.from('.sidebar', { x: -100, opacity: 0, duration: 0.8, ease: 'power2.out' });
        gsap.from('.home-hero', { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
        gsap.from('.gamification-section', { opacity: 0, duration: 1, delay: 0.5 });
    }
});

// --- FUNÇÃO PARA MARCAR A MISSÃO COMO CONCLUÍDA VISUALMENTE ---
function marcarMissaoComoFeita(questEl, btnEl, mostrarAviso) {
    if (btnEl) {
        btnEl.classList.add('completed');
        btnEl.innerHTML = '✨'; 
        btnEl.onclick = null;   
    }
    if (questEl) {
        questEl.classList.add('quest-completed-text');
    }
    if (mostrarAviso) {
        showToast("O Oráculo sorri para você. Missão cumprida!");
    }
}

// ============================================================
// ORÁCULO: MODAL E CONTROLE VISUAL 
// ============================================================

// 1. O feitiço que risca o texto e muda o botão
function marcarMissaoComoFeita(questEl, btnEl, mostrarAviso) {
    if (btnEl) {
        btnEl.classList.add('completed');
        btnEl.innerHTML = '✨'; 
        btnEl.onclick = null;   
    }
    if (questEl) {
        questEl.classList.add('quest-completed-text');
    }
    if (mostrarAviso) {
        showToast("O Oráculo sorri para você. Missão cumprida!");
    }
}

// 2. O feitiço que controla o pergaminho roxo e dá XP
function setupQuestModal() {
    const modal = document.getElementById('questModal');
    const closeBtn = document.getElementById('closeQuestModal');
    const saveBtn = document.getElementById('saveQuestBtn');
    const input = document.getElementById('questAnswer');

    if (!modal) return;

    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('show');
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

    if (saveBtn) {
        saveBtn.onclick = async () => {
            const answer = input.value.trim();
            if (!answer) {
                showToast('O Oráculo exige um relato do seu feito!');
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = 'Transmutando energia...';

            // Salva a conquista
            const title = "🔮 Missão do Oráculo Cumprida";
            const fullDesc = `Sussurro: ${currentQuestText}\n\nMeu relato: ${answer}`;
            await dailyLog.addLog(title, fullDesc, 'conquista', 'empolgada', 'Sussurro do Oráculo atendido');

            // Marca a missão do dia como concluída na memória
            const todayStr = new Date().toISOString().split('T')[0];
            localStorage.setItem('gothic_diary_quest_date', todayStr);
            
            // Ativa o visual de riscado na hora!
            const questEl = document.getElementById('dailyQuestText');
            const btnEl = document.getElementById('completeQuestBtn');
            marcarMissaoComoFeita(questEl, btnEl, true);

            // Limpa e fecha
            input.value = '';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Reivindicar Recompensa (60 XP)';
            modal.classList.remove('show');
            
            updateGameification();
            renderActivities(currentFilter); 
        };
    }
}

// --- ATALHO MÍSTICO PARA RESETAR MISSÃO (Shift + R) ---
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'R') {
        localStorage.removeItem('gothic_diary_quest_date');
        showToast("Memória purificada... O tempo volta atrás.");
        setTimeout(() => location.reload(), 1000);
    }
});