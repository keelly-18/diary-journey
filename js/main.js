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
            if (target === 'skills') renderSkillsDashboard();
            if (target === 'projects') renderProjectsDashboard();
            
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

// Substitua a renderActivities no seu main.js
function renderActivities(filter = 'all') {
    const container = document.getElementById('activitiesTimeline');
    if (!container) return;
    
    let allLogs = dailyLog.getAllLogsFlat();
    if (filter !== 'all') allLogs = allLogs.filter(log => log.area === filter);

    if (allLogs.length === 0) {
        container.innerHTML = '<p class="empty-state">O grimório está em branco.</p>'; 
        return;
    }

    // Lógica de Agrupamento Temporal
    const now = new Date();
    const groups = {
        "Hoje": [],
        "Ontem": [],
        "Sussurros da Semana": [],
        "Ecos do Mês": [],
        "Inscrições Antigas": []
    };

    allLogs.forEach(log => {
        const logDate = new Date(log.timestamp);
        const diffDays = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) groups["Hoje"].push(log);
        else if (diffDays === 1) groups["Ontem"].push(log);
        else if (diffDays < 7) groups["Sussurros da Semana"].push(log);
        else if (diffDays < 30) groups["Ecos do Mês"].push(log);
        else groups["Inscrições Antigas"].push(log);
    });

    const emotionIcons = { 
    'empolgada': 'img/empolgada.svg', 
    'frustrada': 'img/frustrada.svg', 
    'exausta': 'img/exausta.svg', 
    'focada': 'img/focada.svg' 
};

    let html = '';
    for (const [title, logs] of Object.entries(groups)) {
        if (logs.length === 0) continue;
        
        html += `<h3 class="timeline-group-header">${title}</h3>`;
        html += `<div class="activities-cards-grid">`;
        
        html += logs.map(log => {
            const emoSrc = emotionIcons[log.emotion || 'focada'];
            const emoIcon = emoSrc
                ? `<img src="${emoSrc}" alt="${log.emotion || 'focada'}" class="card-tarot-emotion-img" style="width:90px;height:90px;object-fit:contain;">`
                : '🔮';
            const time = new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const dateShort = new Date(log.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            const areaName = AREA_LABELS[log.area] || log.area;

            // Labels legíveis do humor
            const emotionLabels = { empolgada: 'Empolgada', frustrada: 'Frustrada', exausta: 'Exausta', focada: 'Focada' };
            const emoLabel = emotionLabels[log.emotion || 'focada'];

            // Indicadores de conteúdo extra
            const hasRepo    = !!log.repoUrl;
            const hasDesc    = !!(log.description && log.description.trim());
            const hasPurpose = !!(log.reason && log.reason.trim());

            const badges = [
                hasRepo    ? `<span class="card-badge card-badge-repo" title="Repositório vinculado">⛓</span>` : '',
                hasDesc    ? `<span class="card-badge card-badge-desc" title="Tem descrição">✦</span>` : '',
                hasPurpose ? `<span class="card-badge card-badge-purpose" title="Propósito registrado">⛧</span>` : '',
            ].join('');

            return `
                <div class="magic-card-tarot moldura-gotica area-${log.area}" onclick="showLogDetail(${log.id})">
                    <div class="card-tarot-header">
                        <span class="area-tag area-${log.area}">${areaName}</span>
                        <div class="card-tarot-header-right">
                            <div class="card-tarot-time">${dateShort} · ${time}</div>
                        </div>
                    </div>
                    <div class="card-tarot-center">
                        <div class="card-tarot-icon">${emoIcon}</div>
                        <span class="card-tarot-emotion-label">${emoLabel}</span>
                        <h3 class="card-tarot-title">${log.title}</h3>
                    </div>
                    <div class="card-tarot-footer">
                        <div class="card-tarot-xp">+${log.xp} XP</div>
                        <div class="card-tarot-badges">${badges}</div>
                    </div>
                </div>`;
        }).join('');
        html += `</div>`;
    }
    container.innerHTML = html;
}

function renderSkills() {
    const container = document.querySelector('.page[data-page="skills"] .activities-section');
    if (!container) return;
    
    const skills = dailyLog.getSkills();
    const skillsContainer = container.querySelector('div');
    
    if (!skillsContainer) return;

    if (skills.length === 0) {
        skillsContainer.innerHTML = '<div style="text-align: center; padding: 3rem; border: 1.5px dashed var(--border); border-radius: .5rem; color: var(--text-soft);"><p>🔮 Nenhuma habilidade registrada ainda.</p><p style="font-size: 0.85rem; margin-top: 1rem;">Adicione suas habilidades para compilar seu grimório pessoal.</p></div>';
        return;
    }

    skillsContainer.innerHTML = `
        <div class="skills-grid">
            ${skills.map(skill => `
                <div class="skill-card aura-abissal area-estudo">
                    <div class="skill-header">
                        <h3 style="margin: 0; color: #5eead4;">${skill.title}</h3>
                        <button class="delete-log-btn" onclick="deleteSkill(${skill.id})" title="Remover habilidade">×</button>
                    </div>
                    <p style="margin: 0.5rem 0; color: var(--text-soft); font-size: 0.9rem;">${skill.description}</p>
                    <div style="margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 0.75rem; color: rgba(45, 212, 191, 0.6);">Nível:</span>
                        <div style="display: flex; gap: 0.3rem;">
                            ${Array(5).fill('⭐').map((star, i) => `<span style="opacity: ${i < skill.level ? '1' : '0.2'}">${star}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderProjects() {
    const container = document.querySelector('.page[data-page="projects"] .activities-section');
    if (!container) return;
    
    const projects = dailyLog.getProjects();
    const projectsContainer = container.querySelector('div');
    
    if (!projectsContainer) return;

    if (projects.length === 0) {
        projectsContainer.innerHTML = '<div style="text-align: center; padding: 3rem; border: 1.5px dashed var(--border); border-radius: .5rem; color: var(--text-soft);"><p>🔮 Nenhum projeto registrado ainda.</p><p style="font-size: 0.85rem; margin-top: 1rem;">Compartilhe seus artefatos e conquistas mágicas.</p></div>';
        return;
    }

    const statusColors = { 'em_progresso': 'area-desafio', 'concluído': 'area-faculdade', 'planejado': 'area-estudo' };
    const statusLabels = { 'em_progresso': '⚔️ Em Progresso', 'concluído': '✨ Concluído', 'planejado': '📋 Planejado' };

    projectsContainer.innerHTML = `
        <div class="projects-grid">
            ${projects.map(project => `
                <div class="project-card aura-abissal ${statusColors[project.status] || 'area-estudo'}">
                    <div class="project-header">
                        <h3 style="margin: 0; color: #fca5a5;">${project.title}</h3>
                        <button class="delete-log-btn" onclick="deleteProject(${project.id})" title="Remover projeto">×</button>
                    </div>
                    <p style="margin: 0.5rem 0; color: var(--text-soft); font-size: 0.9rem;">${project.description}</p>
                    <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <span class="area-tag ${statusColors[project.status] || 'area-estudo'}">${statusLabels[project.status]}</span>
                        ${project.link ? `<a href="${project.link}" target="_blank" style="font-size: 0.75rem; color: #a0aaaa; text-decoration: none; border-bottom: 1px dashed #a0aaaa;">Ver Código</a>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function deleteFromDetail(logId) {
    const modal = document.getElementById('detailsModal');
    const log = dailyLog.getAllLogsFlat().find(l => l.id === logId);
    if (!log) return;

    // Anima o modal antes de fechar
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
        content.style.transform = 'scale(0.95)';
        content.style.opacity = '0';
    }

    setTimeout(() => {
        modal.classList.remove('show');
        if (content) { content.style.transform = ''; content.style.opacity = ''; }

        // Usa o modal de confirmação existente
        const confirmModal = document.getElementById('deleteConfirmModal');
        if (confirmModal) {
            confirmModal.classList.add('show');
            document.getElementById('confirmDeleteBtn').onclick = () => {
                dailyLog.deleteLog(logId);
                confirmModal.classList.remove('show');
                renderActivities(currentFilter);
                updateGameification();
                showToast('⛧ Registro expurgado para o vazio.');
            };
            document.getElementById('cancelDeleteBtn').onclick = () => {
                confirmModal.classList.remove('show');
            };
        }
    }, 250);
}

function deleteSkill(skillId) {
    if (confirm('Deseja remover esta habilidade?')) {
        dailyLog.deleteSkill(skillId);
        renderSkillsDashboard();
        showToast('Habilidade expurgada dos registros.');
    }
}

function deleteProject(projectId) {
    if (confirm('Deseja remover este projeto?')) {
        dailyLog.deleteProject(projectId);
        renderProjects();
        showToast('Projeto removido do grimório.');
    }
}

function showLogDetail(logId) {
    const log = dailyLog.getAllLogsFlat().find(l => l.id === logId);
    if (!log) return;

    const modal   = document.getElementById('detailsModal');
    const content = document.getElementById('detailsContent');

    const date = new Date(log.timestamp).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    const time = new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const emotionIcons = {
        'empolgada': 'img/empolgada.svg',
        'frustrada':  'img/frustrada.svg',
        'exausta':    'img/exausta.svg',
        'focada':     'img/focada.svg'
    };
    const emotionLabels = {
        'empolgada': 'Empolgada',
        'frustrada':  'Frustrada',
        'exausta':    'Exausta',
        'focada':     'Focada'
    };

    const emoSrc   = emotionIcons[log.emotion || 'focada'];
    const emoLabel = emotionLabels[log.emotion || 'focada'];

    const hasRepo    = !!log.repoUrl;
    const hasDesc    = !!(log.description && log.description.trim());
    const hasPurpose = !!(log.reason && log.reason.trim());

    content.innerHTML = `
        <div class="card-detail area-${log.area}">

            <!-- MOLDURA INTERNA (efeito tarot) -->
            <div class="card-detail-frame"></div>

            <!-- [1] TOPO: tipo + título + XP -->
            <div class="card-detail-top">
                <div class="card-detail-top-left">
                    <span class="card-detail-type area-${log.area}">${AREA_LABELS[log.area]}</span>
                    <h2 class="card-detail-title">${log.title}</h2>
                </div>
                <div class="card-detail-xp-box">
                    <span class="card-detail-xp-label">XP</span>
                    <span class="card-detail-xp-value">+${log.xp}</span>
                </div>
            </div>

            <!-- [2] ARTE: ícone de humor centralizado -->
            <div class="card-detail-art area-${log.area}">
                <div class="card-detail-art-glow area-${log.area}"></div>
                <div class="card-detail-emotion-mask area-${log.area}" style="-webkit-mask-image: url('${emoSrc}'); mask-image: url('${emoSrc}');"></div>
                <div class="card-detail-art-caption">
                    <span class="card-detail-emotion-label">${emoLabel}</span>
                    <span class="card-detail-datetime">${date} · ${time}</span>
                </div>
            </div>

            <!-- [3] SEPARADOR -->
            <div class="card-detail-divider">
                <span class="card-detail-divider-symbol">✦</span>
            </div>

            <!-- [4] ATAQUES / CONTEÚDO -->
            <div class="card-detail-moves">
                ${hasDesc ? `
                <div class="card-detail-move">
                    <div class="card-detail-move-top">
                        <span class="card-detail-move-name">✦ Inscrição</span>
                    </div>
                    <p class="card-detail-move-desc">${log.description}</p>
                </div>` : ''}

                <div class="card-detail-move">
                    <div class="card-detail-move-top">
                        <span class="card-detail-move-name">⛧ Propósito</span>
                    </div>
                    <p class="card-detail-move-desc italic">${log.reason || 'Nenhum propósito declarado.'}</p>
                </div>

                ${hasRepo ? `
                <div class="card-detail-move">
                    <div class="card-detail-move-top">
                        <span class="card-detail-move-name">⛓ Artefato</span>
                    </div>
                    <a href="${log.repoUrl}" target="_blank" class="card-detail-repo-link">Ver Código no GitHub →</a>
                </div>` : ''}
            </div>

            <!-- [5] RODAPÉ DA CARTA -->
            <div class="card-detail-footer">
                <span class="card-detail-footer-text">Códice das Sombras · Registro Selado</span>
                <button class="card-detail-delete-btn" onclick="deleteFromDetail(${log.id})">⛧ Expurgar</button>
            </div>

        </div>
    `;

    modal.classList.add('show');
}

// Fechar Modal
document.getElementById('closeDetailsModal').onclick = () => document.getElementById('detailsModal').classList.remove('show');

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
    const repoUrl = document.getElementById('logRepo')?.value?.trim(); // Nova linha capturada

    if (!title) return;

    const btnSubmit = document.getElementById('submitLogBtnFinal');
    btnSubmit.disabled = true; btnSubmit.textContent = 'Materializando...';

    // Passamos o repoUrl como o último argumento
    const { log, synced } = await dailyLog.addLog(
        title, 
        document.getElementById('logDescription')?.value?.trim(), 
        document.getElementById('logArea')?.value, 
        document.getElementById('logEmotion')?.value || 'focada', 
        document.getElementById('logReason')?.value?.trim(),
        repoUrl // <--- O novo parâmetro enviado para o dados.js
    );

    btnSubmit.disabled = false; btnSubmit.textContent = '⛧ Selar no Códice';
    
    // Reset do campo após envio
    if(document.getElementById('logRepo')) document.getElementById('logRepo').value = '';
    
    updateGameification();
    renderActivities(currentFilter);
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
    seedInitialData();
    updateDailyQuest(); 

    if (getToken()) await downloadLogsFromGist();

    setupPageNavigation();
    setupLogModal();
    setupDeleteModal(); 
    setupQuestModal(); 
    setupActivitiesFilters();
    setupHistorySection();
    setupGistConfig();
    setupGothicDropdown();
    setupHumorSelector();
    setupSkillsDashboard();
    setupProjectsDashboard();
    
    updateGameification();
    renderActivities(currentFilter);
    setupActivityHeartbeat();

    if(typeof gsap !== 'undefined') {
        gsap.from('.sidebar', { x: -100, opacity: 0, duration: 0.8, ease: 'power2.out' });
        gsap.from('.home-hero', { y: 30, opacity: 0, duration: 1, delay: 0.3, ease: 'power2.out' });
        gsap.from('.gamification-section', { opacity: 0, duration: 1, delay: 0.5 });
    }
});

// --- SETUP DO DROPDOWN DE ÁREAS (ESTÁGIO, FACULDADE, ETC) ---
function setupGothicDropdown() {
    const dropdown = document.getElementById('gothicDropdown');
    if (!dropdown) return;

    const selectedContainer = dropdown.querySelector('.dropdown-selected');
    const selectedSpan = dropdown.querySelector('.dropdown-selected span');
    const hiddenInput = document.getElementById('logArea');
    const options = dropdown.querySelectorAll('.dropdown-list li');

    // Abre e fecha o menu
    selectedContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open'); // Nota: se o seu CSS usar 'open', troque 'active' por 'open'
    });

    // Seleciona a opção
    options.forEach(opt => {
        opt.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 1. Copia a imagem e o texto para o topo
            if (selectedSpan) {
                selectedSpan.innerHTML = this.innerHTML;
            }
            
            // 2. Transfere o valor EXATO para o input escondido (fundamental para salvar)
            if (hiddenInput) {
                hiddenInput.value = this.getAttribute('data-value');
            }
            
            // Fecha o menu
            dropdown.classList.remove('open'); 
        });
    });

    // Fecha se clicar fora
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

// --- SETUP DO SELETOR DE HUMOR ---
function setupHumorSelector() {
    const selector = document.getElementById('humorSelector');
    if (!selector) return;

    const triggerContainer = selector.querySelector('.humor-trigger');
    const triggerSpan = selector.querySelector('.humor-trigger span');
    const hiddenInput = document.getElementById('logEmotion');
    const options = selector.querySelectorAll('.humor-option');

    // Abre e fecha o menu
    triggerContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        selector.classList.toggle('open'); // Novamente, verifique se seu CSS usa 'active' ou 'open'
    });

    // Seleciona a opção
    options.forEach(opt => {
        opt.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 1. Copia a imagem e o texto
            if (triggerSpan) {
                triggerSpan.innerHTML = this.innerHTML;
            }
            
            // 2. Salva o valor no input oculto
            if (hiddenInput) {
                hiddenInput.value = this.getAttribute('data-value');
            }

            // Fecha o menu
            selector.classList.remove('open');
        });
    });

    // Fecha se clicar fora
    document.addEventListener('click', function(e) {
        if (!selector.contains(e.target)) {
            selector.classList.remove('open');
        }
    });
}

// ============================================================================
// [07] GERENCIAMENTO DE PROJETOS (ARTEFATOS)
// ============================================================================
function setupProjectsDashboard() {
    const projectTitle = document.getElementById('projectTitle');
    const projectLink = document.getElementById('projectLink');
    const projectImage = document.getElementById('projectImage');
    const addProjectBtn = document.getElementById('addProjectBtn');

    if (!addProjectBtn) return;

    addProjectBtn.addEventListener('click', () => {
        const title = projectTitle?.value?.trim();
        const link = projectLink?.value?.trim();

        if (!title) {
            showToast('Digite o nome do artefato...');
            return;
        }

        // Se houver imagem, ler como base64
        if (projectImage?.files?.length > 0) {
            const file = projectImage.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                addProject(title, link, e.target.result);
                resetProjectForm();
            };
            
            reader.readAsDataURL(file);
        } else {
            addProject(title, link, null);
            resetProjectForm();
        }
    });

    // Enter em title para focar em link
    projectTitle?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') projectLink?.focus();
    });

    // Enter em link para submeter
    projectLink?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addProjectBtn.click();
    });

    renderProjectsDashboard();
}

function resetProjectForm() {
    const projectTitle = document.getElementById('projectTitle');
    const projectLink = document.getElementById('projectLink');
    const projectImage = document.getElementById('projectImage');
    
    if (projectTitle) projectTitle.value = '';
    if (projectLink) projectLink.value = '';
    if (projectImage) projectImage.value = '';
    projectTitle?.focus();
}

function addProject(title, link = '', imageBase64 = null) {
    const projects = dailyLog.getProjects();
    
    const project = {
        id: Date.now(),
        title: title,
        link: link || '',
        image: imageBase64 || null,
        createdAt: new Date().toISOString()
    };
    
    projects.push(project);
    dailyLog.projects = projects;
    dailyLog.saveProjects();
    
    showToast(`✨ Novo Artefato: ${title}`);
    renderProjectsDashboard();
}

function renderProjectsDashboard() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const projects = dailyLog.getProjects();

    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem;">
                <p>Nenhum artefato materializado ainda.</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.6;">
                    A sua galeria das sombras aguarda as suas criações. Registe um acima.
                </p>
            </div>
        `;
        projectsGrid.className = ''; 
        return;
    }

    projectsGrid.className = 'artifacts-grid';

    projectsGrid.innerHTML = projects.map(project => `
        <div class="artifact-card">
            <div class="artifact-image-wrapper">
                ${project.image 
                    ? `<img src="${project.image}" alt="${project.title}">` 
                    : `<div class="artifact-fallback">📜</div>` 
                }
            </div>
            
            <div class="artifact-content">
                <h3 class="artifact-title">${project.title}</h3>
                
                <div class="artifact-footer">
                    ${project.link 
                        ? `<a href="${project.link}" target="_blank" class="artifact-link">
                             <span style="font-size: 1rem;">🔗</span> Visitar
                           </a>` 
                        : '<span style="color: rgba(218,165,32,0.3); font-size: 0.75rem; font-style: italic; text-transform: uppercase;">Selo Oculto</span>'
                    }
                    <button class="artifact-delete" onclick="deleteProjectById(${project.id})" title="Expurgar Artefato">×</button>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteProjectById(projectId) {
    const projects = dailyLog.getProjects();
    const project = projects.find(p => p.id === projectId);

    if (project && confirm(`Deseja expurgar o artefato "${project.title}"?`)) {
        dailyLog.deleteProject(projectId);
        renderProjectsDashboard();
        showToast(`${project.title} foi removido do registro.`);
    }
}
function setupSkillsDashboard() {
    const skillInput = document.getElementById('skillInput');
    const addSkillBtn = document.getElementById('addSkillBtn');

    if (!skillInput || !addSkillBtn) return;

    // Adicione skill ao clicar no botão
    addSkillBtn.addEventListener('click', () => {
        const skillName = skillInput.value.trim();
        if (!skillName) {
            showToast('Digite o nome de uma habilidade ou tecnologia...');
            return;
        }

        addOrUpdateSkill(skillName);
        skillInput.value = '';
        skillInput.focus();
    });

    // Adicione skill ao pressionar Enter
    skillInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkillBtn.click();
        }
    });

    // Renderiza skills iniciais
    renderSkillsDashboard();
}

function addOrUpdateSkill(skillName) {
    const existingSkills = dailyLog.getSkills();
    const existingSkill = existingSkills.find(s => s.title.toLowerCase() === skillName.toLowerCase());

    if (existingSkill) {
        // Atualiza os pontos (+0.01)
        existingSkill.points = Math.min((existingSkill.points || 0) + 0.01, 100);
        dailyLog.saveSkills();
        showToast(`📈 ${skillName}: +0.01 pontos (${existingSkill.points.toFixed(2)}/100)`);
    } else {
        // Cria nova skill com 0.01 pontos iniciais
        const skill = {
            id: Date.now(),
            title: skillName,
            points: 0.01,
            description: '',
            createdAt: new Date().toISOString()
        };
        dailyLog.skills.push(skill);
        dailyLog.saveSkills();
        showToast(`✨ Nova Habilidade: ${skillName} (+0.01 pontos)`);
    }

    renderSkillsDashboard();
}

function renderSkillsDashboard() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid) return;

    const skills = dailyLog.getSkills();

    if (skills.length === 0) {
        skillsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; padding: 4rem 2rem;">
                <p>O seu Tomo de Conhecimento está em branco.</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem; opacity: 0.6;">
                    Adicione as suas primeiras disciplinas mágicas acima.
                </p>
            </div>
        `;
        skillsGrid.className = '';
        return;
    }

    skillsGrid.className = 'skills-grid';

    skillsGrid.innerHTML = skills.map(skill => {
        const points = skill.points || 0;
        const percentage = Math.min((points / 100) * 100, 100);
        const level = Math.ceil(percentage / 20) || 1; // 1 a 5 níveis

        // Numeração romana para dar um ar ancestral
        const romanLevels = ['I', 'II', 'III', 'IV', 'V', 'MÁX'];
        const levelDisplay = romanLevels[Math.min(level - 1, 5)];

        return `
            <div class="rune-card">
                <div class="rune-header">
                    <h3 class="rune-title">${skill.title}</h3>
                    <button class="rune-delete" onclick="deleteSkillById(${skill.id})" title="Expurgar Runa">×</button>
                </div>

                <div class="rune-body">
                    <div class="rune-circle">
                        <span class="rune-level-text">GRAU</span>
                        <span class="rune-level-number">${levelDisplay}</span>
                    </div>

                    <div class="rune-stats">
                        <div class="rune-progress-label">
                            <span>Essência</span>
                            <span>${points.toFixed(2)} / 100</span>
                        </div>
                        <div class="rune-progress-bar">
                            <div class="rune-progress-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>

                <div class="rune-footer">
                    <button class="rune-btn-infuse" onclick="incrementSkillPoints(${skill.id})">
                        <span class="infuse-icon">✨</span> Infundir Poder (+0.01)
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function incrementSkillPoints(skillId) {
    const skills = dailyLog.getSkills();
    const skill = skills.find(s => s.id === skillId);

    if (skill) {
        skill.points = Math.min((skill.points || 0) + 0.01, 100);
        dailyLog.saveSkills();
        renderSkillsDashboard();
        showToast(`📈 ${skill.title}: +0.01 pontos (${skill.points.toFixed(2)}/100)`);
    }
}

function deleteSkillById(skillId) {
    const skills = dailyLog.getSkills();
    const skill = skills.find(s => s.id === skillId);

    if (skill && confirm(`Deseja expurgar a habilidade "${skill.title}" do arsenal?`)) {
        dailyLog.deleteSkill(skillId);
        renderSkillsDashboard();
        showToast(`${skill.title} foi expurgada do arsenal.`);
    }
}