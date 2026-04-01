// ============================================================================
// [01] SISTEMA DO FANTASMA (HUMOR, FALAS E ANIMAÇÕES)
// ============================================================================
function updateGhostMood() {
    const statusEl = document.getElementById('emotionStatus');
    const messageEl = document.getElementById('emotionMessage');
    if (!statusEl || !messageEl) return;

    const streak = dailyLog.getStreak();
    const xpHojes = dailyLog.getTodayLogs().reduce((sum, log) => sum + (log.xp || 0), 0);
    const nivel = dailyLog.getLevel().level;

    let moodKey = ""; let statusText = ""; let phrases = [];

    // [ESTADO 1] ZERO XP: O fantasma é brutal, esmaga a procrastinação.
    if (xpHojes === 0) {
        moodKey = "morto"; statusText = "Ecos do Vazio";
        phrases = [
            "Zero XP? O seu futuro no mercado de trabalho está mais morto do que eu.",
            "Mais um dia desperdiçado. A mediocridade é um abismo silencioso, e você está pulando de cabeça nele.",
            "Eu tenho a eternidade para esperar você codar. Você tem boletos para pagar. Mexa-se, mortal!",
            "A sua barra de progresso é uma ofensa à arquitetura das trevas. Escreva uma linha de código ou aceite o limbo.",
            "Você acha que o sucesso vai se materializar do nada? Invoque o seu grimório e trabalhe de verdade.",
            "Procrastinar é assinar o próprio atestado de óbito profissional. Pare de perder tempo com ilusões e vá estudar.",
            "O silêncio das suas teclas é o som da sua carreira afundando. Vai ficar aí parada a olhar para a tela?"
        ];
    } 
    // [ESTADO 2] MUITO XP (FRENESI): Ele enaltece o esforço obsessivo.
    else if (xpHojes > 120 || streak > 7) {
        moodKey = "frenesi"; statusText = "Frenesi Sombrio!";
        phrases = [
            "Isso! Sangre no teclado! O código flui e o Códice devora o seu esforço com voracidade!",
            "Frenesi Absoluto! Suas teclas soam como ossos quebrando, e eu adoro isso. Não ouse parar agora!",
            "O ritual está no ápice! Continue programando até que os seus olhos ardam e seus dedos implorem por misericórdia.",
            "Você está a esmagar a mediocridade. Cada nova linha de código é um prego no caixão da sua concorrência.",
            "Sinta o poder a ferver! A máquina curva-se diante da sua obsessão doentia pela evolução."
        ];
    } 
    // [ESTADO 3] NÍVEL ALTO: O fantasma reconhece o seu domínio.
    else if (nivel > 5 && xpHojes > 40) {
        moodKey = "anciao"; statusText = "Espírito Ancião";
        phrases = [
            "Você deixou de ser uma mortal comum. A sua disciplina implacável forjou uma mente letal.",
            "O grimório pulsa com a sua maestria oculta. Você já dita as leis do submundo binário.",
            "A sua constância é uma arma de destruição em massa contra a ignorância. Os fracos ficam para trás.",
            "Você não está apenas a codar. Você está a esculpir o seu próprio império nas sombras com as próprias mãos."
        ];
    } 
    // [ESTADO 4] POUCO XP: Ele empurra-te para fazeres mais e não te contentares com pouco.
    else {
        moodKey = "penado"; statusText = "Alma em Evolução";
        phrases = [
            "Um registro miserável não vai salvar a sua carreira do desemprego. Cave muito mais fundo.",
            "Está lento. O mercado vai mastigar você viva se esse for o seu 'esforço máximo'. Acelere o ritmo.",
            "Evoluir dói. Reclamar não paga as contas. Sele mais registros neste códice imediatamente.",
            "Você fez o mínimo absoluto hoje. Não espere confetes nem aplausos por fazer a sua obrigação diária.",
            "Uma pequena faísca no escuro não aquece ninguém. Alimente essa chama com mais código ou ela vai apagar-se de vez."
        ];
    }

    statusEl.textContent = statusText;
    
    // Força a atualização se o texto mudar, para garantir que as novas frases aparecem
    if (lastGhostMood !== moodKey) {
        lastGhostMood = moodKey;
        startGhostConversation(messageEl, phrases);
    }
}

async function startGhostConversation(element, phrases) {
    if (ghostTalkTimeout) clearTimeout(ghostTalkTimeout);

    async function cycle() {
        const statusEl = document.getElementById('emotionStatus');
        const widgetEl = element.closest('.emotional-widget');
        
        if (Math.random() < 0.03) {
            await triggerJumpScare(statusEl, element, widgetEl);
            ghostTalkTimeout = setTimeout(cycle, 5000);
            return;
        }

        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        if (element.textContent.length > 0) {
            await eraseEffect(element);
            await new Promise(r => setTimeout(r, 600));
        }
        await typeWriterEffect(element, randomPhrase);
        ghostTalkTimeout = setTimeout(cycle, 10000);
    }
    cycle();
}

async function triggerJumpScare(statusEl, messageEl, widgetEl) {
    const originalStatus = statusEl.textContent;
    const flash = document.createElement('div');
    flash.className = 'screen-glitch-flash'; document.body.appendChild(flash);
    
    widgetEl.classList.add('jumpscare-shake');
    statusEl.textContent = "EU ESTOU A VER-TE"; statusEl.style.color = "white";
    messageEl.textContent = "NÃO TE ATREVAS A SAIR..."; messageEl.style.color = "white";
    
    await new Promise(r => setTimeout(r, 800));
    
    flash.remove(); widgetEl.classList.remove('jumpscare-shake');
    statusEl.textContent = originalStatus; statusEl.style.color = "";
    messageEl.textContent = ""; messageEl.style.color = "";
}

async function eraseEffect(element) {
    let text = element.textContent;
    while (text.length > 0) {
        text = text.slice(0, -1); element.textContent = text;
        await new Promise(r => setTimeout(r, 20));
    }
}

async function typeWriterEffect(element, text) {
    element.classList.add('show-cursor', 'ghost-typing');
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        const delay = Math.random() * (100 - 40) + 40;
        if (Math.random() > 0.96) {
            element.classList.add('glitch-flicker');
            await new Promise(r => setTimeout(r, 100));
            element.classList.remove('glitch-flicker');
        }
        await new Promise(r => setTimeout(r, delay));
    }
    element.classList.remove('show-cursor', 'ghost-typing');
}

// ============================================================================
// [02] EFEITOS ESPECIAIS (CANVAS HEARTBEAT)
// ============================================================================
function setupActivityHeartbeat() {
    const canvas = document.getElementById('heartbeatCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr; canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const width = canvas.offsetWidth; const height = canvas.offsetHeight;

    let points = []; const maxPoints = 120; 

    function getHeartbeatY(x) {
        const midY = height / 2; let y = midY + Math.sin(x * 0.05) * 2; 
        const logsHoje = window.heartbeatBeats || 0;
        if (logsHoje === 0) return y; 

        const beats = Math.min(logsHoje, 6); const xPulse = x % maxPoints;
        for (let i = 0; i < beats; i++) {
            const pulseStart = 20 + (i * 15); 
            if (xPulse > pulseStart && xPulse < pulseStart + 10) { y = midY + 5 - Math.sin(((xPulse - pulseStart) / 10) * Math.PI) * 35; } 
            else if (xPulse > pulseStart + 5 && xPulse < pulseStart + 8) { y += 10; }
        }
        return y;
    }

    for (let i = 0; i < maxPoints; i++) points.push({ x: i * (width / maxPoints), y: height / 2 });


    let frameCount = 0;
    function animate() {
        frameCount++; points.shift();
        points.push({ x: (points.length) * (width / maxPoints), y: getHeartbeatY(frameCount) });
        points.forEach((p, i) => p.x = i * (width / maxPoints));
        
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath(); ctx.lineWidth = 1.8; ctx.strokeStyle = '#ef4444'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        for (let i = 0; i < points.length; i++) { if (i === 0) ctx.moveTo(points[i].x, points[i].y); else ctx.lineTo(points[i].x, points[i].y); }
        ctx.stroke();

        ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
        ctx.beginPath(); ctx.arc(points[points.length - 1].x, points[points.length - 1].y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 15; ctx.shadowColor = '#fff'; ctx.fill(); ctx.shadowBlur = 0; 
        
        setTimeout(() => {
    requestAnimationFrame(animate);
    }, 25);
    }
    animate();
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
            statusEl.textContent = 'Sem Sinais Vitais...'; statusEl.style.color = 'var(--text-soft)'; statusEl.style.textShadow = 'none';
            if(syncEl) { syncEl.textContent = 'Nula'; syncEl.style.color = 'var(--text-soft)'; }
            if(freqEl) { freqEl.textContent = '0.0Hz'; freqEl.style.color = 'var(--text-soft)'; }
            if(powerEl) { powerEl.textContent = '0%'; powerEl.style.color = 'var(--text-soft)'; }
        } else if (logsHoje <= 2) {
            statusEl.textContent = 'Ressuscitando...'; statusEl.style.color = '#fca5a5'; statusEl.style.textShadow = 'none';
            if(syncEl) { syncEl.textContent = 'Fraca'; syncEl.style.color = '#fca5a5'; }
            if(freqEl) { freqEl.textContent = (logsHoje * 2.4).toFixed(1) + 'Hz'; freqEl.style.color = '#fca5a5'; }
            if(powerEl) { powerEl.textContent = (logsHoje * 25) + '%'; powerEl.style.color = '#fca5a5'; }
        } else {
            statusEl.textContent = 'Frenesi Sombrio!'; statusEl.style.color = '#ef4444'; statusEl.style.textShadow = '0 0 8px rgba(239,68,68,0.6)'; 
            if(syncEl) { syncEl.textContent = 'Máxima!'; syncEl.style.color = '#ef4444'; }
            if(freqEl) { freqEl.textContent = (logsHoje * 3.8).toFixed(1) + 'Hz'; freqEl.style.color = '#ef4444'; }
            if(powerEl) { powerEl.textContent = Math.min(logsHoje * 30, 100) + '%'; powerEl.style.color = '#ef4444'; }
        }
    }
}