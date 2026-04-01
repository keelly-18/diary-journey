// ============================================================================
// [01] ORÁCULO E MISSÕES DIÁRIAS
// ============================================================================
function updateDailyQuest() {
    const quests = [
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
        "Dia de absorver: Assista a uma aula da faculdade ou leia a matéria sem pressa, apenas para entender o conceito.",
        "Conexões Ocultas: Tente ligar o que você está a aprender na faculdade com o que você faz no estágio.",
        "De volta às bases: Revise um conceito fundamental de redes, banco de dados ou lógica que pode estar esquecido.",
        "Além do óbvio: Pesquise sobre uma ferramenta ou termo que você ouviu os seniores falarem e não sabe o que é.",
        "O Poder da Escrita: Resuma um conceito complexo que aprendeu recentemente em apenas um parágrafo.",
        "Expandindo Horizontes: Leia um artigo ou assista a um vídeo sobre uma área da tecnologia diferente da sua.",
        "Visão de Mestre: Como o seu trabalho no estágio impacta o negócio da empresa?",
        "Marca nas Sombras: Atualize o seu LinkedIn, currículo ou GitHub. A sua vitrine precisa estar impecável.",
        "Comunicação Clara: Pratique explicar um problema técnico de forma que uma pessoa leiga entenda.",
        "Limpeza mental: Organize as suas anotações, feche as abas abertas e planeie o próximo ataque.",
        "O Silêncio Ensina: Fique 15 minutos longe de ecrãs. Deixe o cérebro processar a informação que sugou durante o dia."
    ];
    
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    currentQuestText = quests[dayOfYear % quests.length]; 
    
    const questEl = document.getElementById('dailyQuestText');
    const btnEl = document.getElementById('completeQuestBtn');
    
    if (questEl) questEl.textContent = `"${currentQuestText}"`;

    const todayStr = now.toISOString().split('T')[0];
    const questFeitaEm = localStorage.getItem('gothic_diary_quest_date');

    if (questFeitaEm === todayStr) {
        marcarMissaoComoFeita(questEl, btnEl, false);
    } else if (btnEl) {
        btnEl.classList.remove('completed');
        btnEl.innerHTML = 'Atender'; 
        if (questEl) questEl.classList.remove('quest-completed-text');
        
        btnEl.onclick = () => {
            btnEl.classList.add('smoke-away');
            setTimeout(() => {
                const questModal = document.getElementById('questModal');
                const modalText = document.getElementById('questModalText');
                if (modalText) modalText.textContent = `"${currentQuestText}"`;
                if (questModal) questModal.classList.add('show');
            }, 600);
        };
    }
}

function marcarMissaoComoFeita(questEl, btnEl, mostrarAviso) {
    if (btnEl) { btnEl.classList.add('completed'); btnEl.onclick = null; }
    if (questEl) { questEl.classList.add('quest-completed-text'); }
    const badge = document.getElementById('questDoneBadge');
    if (badge) badge.classList.add('show');
    if (mostrarAviso) showToast("O Oráculo sorri para você. Missão cumprida!");
}

// ============================================================================
// [01.5] DECRETOS BRUTAIS DIÁRIOS
// ============================================================================
function updateBrutalHighlight() {
    const decrees = [
        "O tempo devora os indecisos. Seja intencional, ou torne-se apenas um eco esquecido no mercado.",
        "A mediocridade é um abismo silencioso. O código que você escreve hoje é a corda para escapar dele.",
        "A procrastinação é o veneno das mentes brilhantes. Sangre no teclado hoje para reinar amanhã.",
        "Nenhum Códice se compila sozinho. Cada linha de código é um prego no caixão da sua zona de conforto.",
        "O conforto é a morte da evolução. Abrace a dor da disciplina e transcenda o seu nível atual.",
        "Sua concorrência não está dormindo. Levante-se, foque-se e deixe-os nas sombras da sua ascensão.",
        "A disciplina é a única magia real que transforma o caos da intenção em poder absoluto.",
        "Descansar não é desistir, mas parar de tentar é assinar a própria sentença. Crie algo hoje.",
        "A motivação é uma ilusão para os fracos. Apenas o hábito e o ódio pelo fracasso constroem impérios."
    ];

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const highlightEl = document.getElementById('dailyBrutalHighlight');
    if (highlightEl) {
        highlightEl.textContent = decrees[dayOfYear % decrees.length];
    }
}

// ============================================================================
// [02] NAVEGAÇÃO E ATUALIZAÇÃO DA UI GERAL
// ============================================================================
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
    renderHomeHistory();
}

// ============================================================================
// [03] SISTEMA DE REGISTROS (RENDERIZAÇÃO NA TELA)
// ============================================================================
function updateTodayLogs() {
    const container = document.getElementById('todayLogs');
    const lastLogTextEl = document.getElementById('lastLogText');
    if (!container) return;
    
    const logs = dailyLog.getTodayLogs();

    if (logs.length === 0) {
        container.innerHTML = '<p style="padding: 1.5rem; text-align: center; color: rgba(200,180,180,0.3); font-size: 0.85rem; font-style: italic;">O Códice aguarda a sua tinta...</p>';
        if (lastLogTextEl) lastLogTextEl.textContent = 'Nenhum registro selado';
        return;
    }

    if (lastLogTextEl) lastLogTextEl.textContent = `Último: ${logs[logs.length - 1].title}`;

    // A MÁGICA DO LIMITE: Pega apenas os últimos 5 registros e inverte para o mais novo ficar no topo
    const logsToShow = logs.slice(-5).reverse();

    container.innerHTML = logsToShow.map(log => {
        const dateObj = new Date(log.timestamp);
        const time = dateObj.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
        const date = dateObj.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
        const area = log.area || 'estudo';
        
        const isOracle = log.title.includes('Oráculo');
        const verboAcao = isOracle ? 'Sussurrado' : 'Selado';
        
        return `
            <div class="log-item log-tema-${area}">
                <div class="log-content-left">
                    <span class="log-title">${log.title}</span>
                    <span class="log-time-whisper">
                        ${verboAcao} em <strong class="log-time-highlight">${date}</strong> <span class="log-separator">às</span> <strong class="log-time-highlight">${time}</strong>
                    </span>
                </div>
                
                <div class="log-content-right">
                    <span class="area-tag area-${area}">${AREA_LABELS[area] || area}</span>
                    <span class="log-xp-highlight">+${log.xp}XP</span>
                    <button class="delete-log-btn" data-id="${log.id}">×</button>
                </div>
            </div>`;
    }).join('');
}

function renderActivities(filter = 'all') {
    const container = document.getElementById('activitiesTimeline');
    if (!container) return;
    
    let logs = dailyLog.getAllLogsFlat();
    if (filter !== 'all') logs = logs.filter(log => log.area === filter);

    if (logs.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum feitiço registrado neste grimório ainda.</p>'; return;
    }

    const emotionIcons = { 'empolgada': '🔥', 'frustrada': '💀', 'exausta': '🦇', 'focada': '👁️' };

    container.innerHTML = logs.map(log => {
        const d = new Date(log.timestamp);
        const date = d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
        const area = log.area || 'estudo';
        const emoIcon = emotionIcons[log.emotion || 'focada'] || '🔮';
        
        let descHtml = '';
        if (log.description) descHtml += `<p class="magic-card-desc">"${log.description}"</p>`;
        if (log.reason) descHtml += `<p class="magic-card-desc" style="color:#fca5a5; font-size:0.8rem; border-color: #fca5a5;">Propósito: ${log.reason}</p>`;

        return `
            <div class="magic-card area-${area}">
                <div class="magic-card-glow"></div>
                <div class="magic-card-header">
                    <span class="magic-card-emotion" title="${log.emotion || 'focada'}">${emoIcon}</span>
                    <span class="magic-card-date">${date}</span>
                </div>
                <h3 class="magic-card-title">${log.title}</h3>
                ${descHtml}
                <div class="magic-card-footer">
                    <span class="area-tag area-${area}">${AREA_LABELS[area] || area}</span>
                    <div class="magic-card-actions">
                        <span class="magic-card-xp">+${log.xp} XP</span>
                        <button class="delete-log-btn" data-id="${log.id}" title="Excluir este log">×</button>
                    </div>
                </div>
            </div>`;
    }).join('');
}

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

// ============================================================================
// [05] HISTÓRICO DE INSCRIÇÕES (HOME)
// ============================================================================

let historyFilter = 'all';
const HISTORY_PAGE_SIZE = 5; // grupos de dias por "página"
let historyPage = 1;

function setupHistorySection() {
    // Filtros
    const filterBtns = document.querySelectorAll('.hf-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            historyFilter = btn.getAttribute('data-filter');
            historyPage = 1;
            renderHomeHistory();
        });
    });

    // Recolher / expandir
    const collapseBtn = document.getElementById('historyCollapseBtn');
    const body        = document.getElementById('historyBody');
    const icon        = document.getElementById('historyCollapseIcon');
    if (collapseBtn && body) {
        collapseBtn.addEventListener('click', () => {
            const collapsed = body.classList.toggle('collapsed');
            icon.textContent = collapsed ? '▼' : '▲';
        });
    }

    // Carregar mais
    document.getElementById('historyLoadMore')?.addEventListener('click', () => {
        historyPage++;
        renderHomeHistory();
    });
}

function renderHomeHistory() {
    const list      = document.getElementById('historyList');
    const countEl   = document.getElementById('historyCount');
    const loadMore  = document.getElementById('historyLoadMore');
    if (!list) return;

    // Pega todos os logs e aplica filtro de área
    let allLogs = dailyLog.getAllLogsFlat();
    if (historyFilter !== 'all') allLogs = allLogs.filter(l => l.area === historyFilter);

    // Atualiza contador
    if (countEl) countEl.textContent = `${allLogs.length} registro${allLogs.length !== 1 ? 's' : ''}`;

    if (allLogs.length === 0) {
        list.innerHTML = '<p class="empty-state" style="padding: 2rem 0; color: rgba(200,180,180,0.35); font-family: var(--font-ui); text-transform: uppercase; letter-spacing: 1px; font-size: var(--fs-xs);">Nenhuma inscrição encontrada.</p>';
        if (loadMore) loadMore.style.display = 'none';
        return;
    }

    // Agrupa por data (mais recente primeiro)
    const groups = {};
    allLogs.forEach(log => {
        const dateKey = log.timestamp.split('T')[0];
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(log);
    });

    // Ordena as datas mais recentes primeiro
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    // Paginação por grupos de dias
    const visibleDates = sortedDates.slice(0, historyPage * HISTORY_PAGE_SIZE);
    const hasMore = visibleDates.length < sortedDates.length;
    if (loadMore) loadMore.style.display = hasMore ? 'block' : 'none';

    const today     = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    function labelForDate(dateStr) {
        if (dateStr === today)     return 'Hoje';
        if (dateStr === yesterday) return 'Ontem';
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    list.innerHTML = visibleDates.map(dateStr => {
        const logsDodia = groups[dateStr];
        const xpDia = logsDodia.reduce((sum, l) => sum + (l.xp || 0), 0);

        const itens = logsDodia.map(log => {
            const time = new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const area = log.area || 'estudo';
            return `
            <div class="history-log-item area-${area}">
                <span class="history-log-title">${log.title}</span>
                <div class="history-log-meta">
                    <span class="area-tag area-${area}">${AREA_LABELS[area] || area}</span>
                    <span class="history-log-time">${time}</span>
                    <span class="log-xp">+${log.xp} XP</span>
                    <button class="delete-log-btn" data-id="${log.id}" title="Expurgar">×</button>
                </div>
            </div>`;
        }).join('');

        return `
        <div class="history-day-group">
            <div class="history-day-label">
                ${labelForDate(dateStr)}
                <span class="history-day-xp">${xpDia} XP</span>
            </div>
            ${itens}
        </div>`;
    }).join('');
}

// ============================================================================
// [04] GESTÃO DE MODAIS E FORMULÁRIOS
// ============================================================================
function setupLogModal() {
    const modal = document.getElementById('logModal');
    const btn = document.getElementById('addLogBtn');
    const closeBtn = document.getElementById('closeLogModal');
    
    const step1 = document.querySelector('.modal-step[data-step="1"]');
    const step2 = document.querySelector('.modal-step[data-step="2"]');
    
    if (!modal || !btn) return;

    btn.onclick = () => {
        document.getElementById('logTitle').value = ''; document.getElementById('logDescription').value = ''; document.getElementById('logReason').value = '';
        if(step1 && step2) { step1.style.display = 'block'; step2.style.display = 'none'; }
        modal.classList.add('show');
    };
    
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('show');
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

    document.getElementById('btnStep1Next')?.addEventListener('click', (e) => {
        e.preventDefault(); 
        if(document.getElementById('logTitle').value.trim() !== '') {
            step1.style.display = 'none'; step2.style.display = 'block';
        } else { showToast("O grimório exige um título para o evento!"); }
    });

    document.getElementById('btnStep2Back')?.addEventListener('click', (e) => {
        e.preventDefault(); step2.style.display = 'none'; step1.style.display = 'block';
    });

    document.getElementById('submitLogBtnFinal')?.addEventListener('click', async e => {
        e.preventDefault();
        const title = document.getElementById('logTitle')?.value?.trim();
        if (!title) return;

        const btnSubmit = document.getElementById('submitLogBtnFinal');
        btnSubmit.disabled = true; btnSubmit.textContent = 'Materializando...';

        const { log, synced } = await dailyLog.addLog(title, document.getElementById('logDescription')?.value?.trim(), document.getElementById('logArea')?.value, document.getElementById('logEmotion')?.value || 'focada', document.getElementById('logReason')?.value?.trim());

        btnSubmit.disabled = false; btnSubmit.textContent = '⛧ Selar no Códice';
        updateGameification(); 
        showToast(`+${log.xp} XP registrado sombriamente${synced ? ' · sincronizado' : ''}`);
        modal.classList.remove('show');
    });
}

function setupDeleteModal() {
    const deleteModal = document.getElementById('deleteConfirmModal');
    let logIdToDelete = null;

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-log-btn')) {
            logIdToDelete = parseInt(e.target.getAttribute('data-id'));
            if(deleteModal) deleteModal.classList.add('show');
            else {
                if(confirm("Deseja expurgar este registro?")) {
                    dailyLog.deleteLog(logIdToDelete).then(() => { updateGameification(); renderActivities(currentFilter); });
                }
            }
        }
    });

    document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => { deleteModal.classList.remove('show'); logIdToDelete = null; });
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', async () => {
        if (logIdToDelete === null) return;
        const btn = document.getElementById('confirmDeleteBtn');
        btn.textContent = 'Expurgando...'; btn.disabled = true;
        
        await dailyLog.deleteLog(logIdToDelete);
        showToast('Log expurgado para o além.');
        updateGameification(); renderActivities(currentFilter);
        
        btn.textContent = 'Expurgar'; btn.disabled = false;
        deleteModal.classList.remove('show'); logIdToDelete = null;
    });
}

function setupQuestModal() {
    const modal = document.getElementById('questModal');
    if (!modal) return;

    document.getElementById('closeQuestModal').onclick = () => { modal.classList.remove('show'); document.getElementById('completeQuestBtn')?.classList.remove('smoke-away'); };
    
    document.getElementById('saveQuestBtn').onclick = async () => {
        const input = document.getElementById('questAnswer');
        if (!input.value.trim()) { showToast('O Oráculo exige um relato do seu feito!'); return; }
        
        const btn = document.getElementById('saveQuestBtn');
        btn.disabled = true; btn.textContent = 'Transmutando energia...';

        await dailyLog.addLog("Missão do Oráculo Cumprida!", `Sussurro: ${currentQuestText}\n\nMeu relato: ${input.value.trim()}`, 'conquista', 'empolgada', 'Sussurro do Oráculo atendido');
        localStorage.setItem('gothic_diary_quest_date', new Date().toISOString().split('T')[0]);
        
        marcarMissaoComoFeita(document.getElementById('dailyQuestText'), document.getElementById('completeQuestBtn'), true);

        input.value = ''; btn.disabled = false; btn.textContent = 'Transmutar Energia (60 XP)';
        modal.classList.remove('show'); updateGameification(); renderActivities(currentFilter); 
    };
}

// Atalho para purificar memória
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'R') {
        localStorage.removeItem('gothic_diary_quest_date');
        showToast("Memória purificada... O tempo volta atrás.");
        setTimeout(() => location.reload(), 1000);
    }
});

// ============================================================================
// [05] INICIALIZAÇÃO (DOMContentLoaded)
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    updateDailyQuest(); 

    if (getToken()) await downloadLogsFromGist();

    setupPageNavigation();
    setupLogModal();
    setupDeleteModal(); 
    setupQuestModal(); 
    setupActivitiesFilters();
    setupHistorySection();
    setupGistConfig();
    
    updateGameification(); 
    setupActivityHeartbeat();

    if(typeof gsap !== 'undefined') {
        gsap.from('.sidebar', { x: -100, opacity: 0, duration: 0.8, ease: 'power2.out' });
        gsap.from('.home-hero', { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
        gsap.from('.gamification-section', { opacity: 0, duration: 1, delay: 0.5 });
    }
});

// Adicione isto no final do seu main.js ou dentro do DOMContentLoaded
function setupGothicDropdown() {
    const dropdown = document.getElementById('gothicDropdown');
    if (!dropdown) return;

    const selected = dropdown.querySelector('.dropdown-selected');
    const input = document.getElementById('logArea');
    const options = dropdown.querySelectorAll('.dropdown-list li');

    // Abre e fecha o menu
    selected.onclick = () => dropdown.classList.toggle('open');

    // Quando clica numa opção
    options.forEach(opt => {
        opt.onclick = () => {
            selected.querySelector('span').textContent = opt.textContent;
            selected.querySelector('span').style.color = getComputedStyle(opt).color;
            input.value = opt.getAttribute('data-value');
            dropdown.classList.remove('open');
        };
    });

    // Fecha se clicar fora
    window.onclick = (e) => {
        if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
    };
}

// Chame a função na inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupGothicDropdown();
    // ... restante do seu código
});

function setupHumorSelector() {
    const selector = document.getElementById('humorSelector');
    if (!selector) return;

    const trigger = selector.querySelector('.humor-trigger');
    const inputHidden = document.getElementById('logEmotion');
    const options = selector.querySelectorAll('.humor-option');

    // 1. Abrir e fechar
    trigger.onclick = (e) => {
        e.stopPropagation(); // Impede o clique de fechar o menu na hora
        selector.classList.toggle('open');
    };

    // 2. Escolher uma opção
    options.forEach(opt => {
        opt.onclick = () => {
            const valor = opt.getAttribute('data-value');
            const texto = opt.textContent;

            // Atualiza o que o usuário vê
            trigger.querySelector('span').textContent = texto;
            
            // Atualiza o valor invisível que o seu código de dados.js usa
            inputHidden.value = valor;

            selector.classList.remove('open');
        };
    });

    // 3. Fechar se clicar fora do menu
    document.addEventListener('click', () => {
        selector.classList.remove('open');
    });
}

// Inicialize chamando a função no DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setupHumorSelector();
    // outras funções aqui...
});