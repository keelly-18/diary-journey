// ============================================================================
// [01] CONFIGURAÇÕES GLOBAIS E UTILITÁRIOS
// ============================================================================
const AREA_LABELS = {
    estagio: 'Estágio', faculdade: 'Faculdade', estudo: 'Estudo Extra',
    desafio: 'Desafio', conquista: 'Conquista'
};

let currentFilter = 'all';
let currentQuestText = ""; 
let lastGhostMood = "";
let ghostTalkTimeout = null; 

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
    toast.timeoutId = setTimeout(() => { toast.style.opacity = '0'; }, duration);
}

// ============================================================================
// [02] SISTEMA DE DADOS (CLASSE DAILYLOG)
// ============================================================================
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

    saveLocal() { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs)); }
    getToday() { return new Date().toISOString().split('T')[0]; }
    getTodayLogs() { return this.logs[this.getToday()] || []; }
    getAllLogsFlat() { return Object.values(this.logs).flat().sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)); }

    async addLog(title, description, area, emotion, reason) {
        const xpMap = { estagio: 20, faculdade: 20, estudo: 35, desafio: 45, conquista: 60 };
        const log = {
            id: Date.now(), title, description, area, emotion: emotion || 'focada',
            reason: reason || '', xp: xpMap[area] || 20, timestamp: new Date().toISOString()
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
        let streak = 0; let currentDate = new Date();
        if (this.getTodayLogs().length > 0) streak = 1;
        currentDate.setDate(currentDate.getDate() - (streak === 1 ? 1 : 0));
        
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (this.logs[dateStr] && this.logs[dateStr].length > 0) {
                if (streak === 0) streak = 1; else streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else { break; }
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

// ============================================================================
// [03] SISTEMA DE SINCRONIZAÇÃO (GITHUB GIST)
// ============================================================================
function getToken() { return localStorage.getItem(dailyLog.TOKEN_KEY); }
function getGistId() { return localStorage.getItem(dailyLog.GIST_ID_KEY); }

function setupGistConfig() {
    const saveBtn = document.getElementById('saveTokenBtn');
    if (!saveBtn) return;

    if (getToken()) {
        document.getElementById('gistConfig').innerHTML = `<p class="gist-info" style="color: #6ee7b7; border-color: #065f46;">✓ Sincronizado com GitHub Gist<br><button class="btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 10px; margin-top: 0.5rem;" onclick="localStorage.removeItem('${dailyLog.TOKEN_KEY}'); location.reload();">Desconectar</button></p>`;
    }

    saveBtn.onclick = async () => {
        const tokenInput = document.getElementById('githubToken');
        const token = tokenInput.value.trim();
        if (!token.startsWith('ghp_')) { showToast('Token inválido. Deve começar com ghp_'); return; }

        saveBtn.disabled = true; saveBtn.textContent = 'Canalizando magia...';
        const gistId = await initializeGist(token);

        if (gistId) {
            localStorage.setItem(dailyLog.TOKEN_KEY, token); localStorage.setItem(dailyLog.GIST_ID_KEY, gistId);
            showToast('Conectado ao GitHub Gist!'); setTimeout(() => location.reload(), 1500); 
        } else {
            document.getElementById('gistStatus').textContent = 'Erro de permissões (gist).';
            saveBtn.disabled = false; saveBtn.textContent = 'Conectar';
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
            body: JSON.stringify({ description: 'Logs do Diário de Aprendizado Gótico (Vampiro Theme)', public: false, files: { 'gothic_diary.json': { content: JSON.stringify(dailyLog.logs) } } })
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
            method: 'PATCH', headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' },
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
            dailyLog.logs = { ...dailyLog.loadLocal(), ...JSON.parse(content) }; 
            dailyLog.saveLocal();
        }
    } catch (e) {}
}