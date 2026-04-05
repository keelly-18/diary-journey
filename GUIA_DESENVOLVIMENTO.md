# 🏗️ GUIA DE DESENVOLVIMENTO - Arquitetura & Referência Técnica

## 📚 Conteúdo

1. **Arquitetura CSS** - Como está estruturado
2. **Mapa de Classes** - Onde cada estilo está localizado
3. **Sistema de Cordas** - Ordem e cascata de imports
4. **Adicionando Componentes** - Como estender

---

## 🏗️ Arquitetura Final do CSS

### Estrutura de Cascata

```
┌─────────────────────────────────────────────────────┐
│  1️⃣ base.css (VARIÁVEIS & RESET)                   │
│  ├─ :root { --font-gothic, --red, --bg, etc }      │
│  └─ Reset global, body, container                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  2️⃣ animations.css (KEYFRAMES)                      │
│  ├─ @keyframes pulseButton, cintilarMistico       │
│  └─ Todas as animações reutilizáveis              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  COMPONENTES (ordem não importa - 12 arquivos)      │
│  ├─ sidebar.css, dashboard.css, cards.css         │
│  ├─ activities.css, buttons.css, forms-modals.css │
│  ├─ dropdowns.css, utilities.css, skills.css      │
│  ├─ credits.css, footer.css                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  RESPONSIVE (OVERRIDES FINAIS)                      │
│  ├─ @media (max-width: 1024px)                    │
│  ├─ @media (max-width: 768px)                     │
│  └─ @media (max-width: 480px)                     │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Responsabilidade de Cada Arquivo CSS

### 1️⃣ base.css (~400 linhas)
**O QUE CONTÉM:**
- Variáveis CSS `:root` (colors, fonts, sizes)
- Reset CSS universal
- Estilos de body, container e página
- Classes base reutilizáveis

**NUNCA MUDE:** Sem motivo - aqui ficam as variáveis globais

### 2️⃣ animations.css (~150 linhas)
**O QUE CONTÉM:**
- `@keyframes pulseButton` - pulsação de botões
- `@keyframes cintilarMistico` - brilho místico
- `@keyframes derreterTexto` - efeito glitch
- Transitions globais

### 3️⃣ sidebar.css (~180 linhas)
**COMPONENTES:** `.sidebar`, `.nav-btn`, `.nav-icon`, `.nav-text`

### 4️⃣ dashboard.css (~350 linhas)
**COMPONENTES:** 
- Gamification: `.gamification-section`, `.oracle-box`
- Stats: `.stats-panel`, `.quick-stat`
- Emotional: `.emotional-widget`, `.emotion-content`
- Heartbeat: `.heartbeat-section`, `.heartbeat-canvas`
- Logs: `.logs-list`, `.log-item`

### 5️⃣ cards.css (~120 linhas)
**COMPONENTES:**
- `.skills-grid`, `.projects-grid`, `.skill-card`, `.project-card`
- `.magic-card` (Tarot style), `.card-tarot-*`

### 6️⃣ activities.css (~180 linhas)
**COMPONENTES:**
- `.activities-section`, `.activities-filters`, `.filter-btn`
- `.timeline-group-header`, `.activities-cards-grid`
- `.painel-de-logs` (com cores por área: roxo, azul, cyan, amarelo, coral)

### 7️⃣ buttons.css (~160 linhas)
**COMPONENTES:**
- `.btn-primary` (com pulse)
- `.btn-secondary`, `.quest-btn`, `.delete-log-btn`
- `.quest-done-badge`

### 8️⃣ forms-modals.css (~140 linhas)
**COMPONENTES:**
- `.modal`, `.modal-content`, `.form-group`
- `input`, `textarea`, `select`
- `.modal-close-btn`, `#diary-toast` (notificações)

### 9️⃣ dropdowns.css (~180 linhas)
**COMPONENTES:**
- `.gothic-dropdown`, `.humor-custom-select`
- `.opt-estagio`, `.opt-faculdade`, `.opt-estudo`, `.opt-desafio`, `.opt-conquista`

### 🔟 utilities.css (~220 linhas)
**COMPONENTES:**
- `.area-tag` (tags com cores por área)
- `.aura-abissal` (gradient + glow effect)
- `.oracle-box`, `.gist-config`
- `.brutal-motivation`, `.brutal-highlight`

### 1️⃣1️⃣ skills.css & credits.css (~300 linhas)
**COMPONENTES:**
- Skills Dashboard, Projects gallery, image upload styling
- Credits page sections with card layout

### 1️⃣2️⃣ footer.css (~150 linhas)
**COMPONENTES:**
- `.codice-footer` (container com gradient)
- `.footer-seal` (seal circle com ícone pulsante)
- `.seal-content` (título, subtitle, metadata)
- Animações de seal pulse, responsivo para mobile

### 1️⃣3️⃣ responsive.css (~100 linhas)
**BREAKPOINTS:**
- `(max-width: 1024px)` - Tablets grandes
- `(max-width: 768px)` - Tablets pequenos
- `(max-width: 480px)` - Celulares

---

## 🗺️ Mapa de Classes - Localização Rápida

### Navegação & Layout
```
sidebar.css:
  .sidebar
  .nav-btn, .nav-btn.active
  .nav-icon, .nav-text
```

### Dashboard Principal
```
dashboard.css:
  .gamification-section, .oracle-box
  .stats-panel, .quick-stat
  .emotional-widget
  .heartbeat-section, .heartbeat-canvas
  .logs-list, .log-item
```

### Cards & Grids
```
cards.css:
  .skills-grid, .projects-grid
  .skill-card, .project-card
  .magic-card, .card-tarot-icon

activities.css:
  .timeline-group-header
  .activities-cards-grid
  .painel-de-logs
```

### Timeline & Atividades
```
activities.css:
  .activities-section, .activities-filters
  .log-tema-estagio, .log-tema-faculdade, .log-tema-estudo
  .log-tema-desafio, .log-tema-conquista
```

### Botões & Interação
```
buttons.css:
  .btn-primary, .btn-secondary
  .quest-btn, .delete-log-btn
  .quest-done-badge

forms-modals.css:
  .modal, .modal-content, .form-group
  input, textarea, select
  #diary-toast

dropdowns.css:
  .gothic-dropdown, .humor-custom-select
```

### Skills & Projetos
```
skills.css:
  .projects-grid, .project-card
  .project-image-container
  .project-link-btn

credits.css:
  .credit-block, .credit-grid
  .credit-card, .credit-thanks
```

### Visual & Efeitos
```
utilities.css:
  .area-tag (cores por área)
  .aura-abissal, .oracle-box
  .brutal-motivation, .brutal-highlight

footer.css:
  .codice-footer, .footer-seal
  .seal-circle, .seal-text
  .seal-content, .seal-title
```

---

## 🔗 Como os Arquivos se Conectam

```
index.html (carrega nesta ordem)
    ↓
    ✓ base.css .................... Variáveis prontas
    ↓
    ✓ animations.css .............. Keyframes carregados
    ↓
    ✓ [12 componentes] ............ Podem usar var() e @keyframes
    ↓
    ✓ responsive.css .............. Sobrescreve anterior se @media
```

### Fluxo de Estilos
```
Elemento HTML
    ↓
Match base.css ...................... Estilos base
    ↓
Match animations.css ................ Adiciona animações
    ↓
Match componente.css ................ Estilos específicos
    ↓
@media em responsive.css ............ Sobrescreve se mobile
    ↓
Estilo Final Renderizado 🎨
```

---

## 💡 Boas Práticas

### Use Variáveis CSS
```css
/* ❌ Errado - Hardcoded */
.meu-card {
    color: #c8c8c8;
    background: rgba(18,5,5,0.95);
}

/* ✅ Certo - Com variáveis */
.meu-card {
    color: var(--text);
    background: var(--surface);
}
```

### Respeite Ordem de Import
```
1. base.css (SEMPRE PRIMEIRO)
2. animations.css (ANTES dos componentes)
3. [Componentes em qualquer ordem]
4. responsive.css (SEMPRE POR ÚLTIMO)
```

### Use Cores Padrão do Sistema
```css
/* Cores principais */
var(--gold)           /* #daa520 - primária */
var(--gold-light)     /* #fce68a - destaque */
var(--text)           /* #c8c8c8 - texto */
var(--surface)        /* rgba(8,8,8,0.95) - fundo */

/* Por área (atividades) */
#c084fc   /* estagio (roxo) */
#7dd3fc   /* faculdade (azul) */
#5eead4   /* estudo (teal) */
#fcd34d   /* desafio (âmbar) */
#fca5a5   /* conquista (vermelho) */
```

---

## 🚀 Como Adicionar um Novo Componente

### Passo 1: Criar Arquivo CSS
```bash
css/novo-componente.css
```

### Passo 2: Escrever CSS
```css
/* novo-componente.css */
.novo-componente {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1rem;
  transition: all 0.3s ease;
}

.novo-componente:hover {
  animation: cintilarMistico 1s ease-in-out;
}
```

### Passo 3: Adicionar Link no HTML
```html
<!-- Entre utilities.css e responsive.css -->
<link rel="stylesheet" href="css/utilities.css">
<link rel="stylesheet" href="css/novo-componente.css"> ← NOVO
<link rel="stylesheet" href="css/responsive.css">
```

### Passo 4: Usar no HTML
```html
<div class="novo-componente">
  Conteúdo do novo componente
</div>
```

---

## ⚠️ Erros Comuns

### ❌ Colocar responsive.css ANTES dos componentes
```html
<!-- ❌ ERRADO -->
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/buttons.css">
```
**RESULTADO:** Media queries não funcionam!

### ❌ Usar cores hardcoded em vez de var()
```css
/* ❌ ERRADO - Difícil de manter */
.button { color: #fca5a5; }
.badge { color: #fca5a5; }
.text { color: #fca5a5; }
```
**RESULTADO:** Mudança de cor = editar 3+ linhas!

### ❌ Esquecer transition no hover
```css
/* ❌ ERRADO */
.button { background: red; }
.button:hover { background: darkred; }
```
**RESULTADO:** Mudança abrupta, sem suavidade!

---

## 📚 Arquivos de Desenvolvimento

```
css/
├── base.css               (Variáveis & Reset)
├── animations.css         (Keyframes)
├── sidebar.css            (Navegação)
├── dashboard.css          (Painel principal)
├── cards.css              (Cards & Grids)
├── activities.css         (Timeline)
├── buttons.css            (Botões)
├── forms-modals.css       (Formulários)
├── dropdowns.css          (Selects)
├── utilities.css          (Utilitários)
├── skills.css             (Dashboard de Skills)
├── credits.css            (Página de Créditos)
├── footer.css             (Selo Final)
└── responsive.css         (Mobile)
```

---

## 📊 Tamanhos

```
Total: ~2.500 linhas em 14 arquivos
- Antes: components.css (1.900 linhas - difícil de navegar)
- Depois: 14 arquivos específicos (fácil de manter)
```

---

## ✅ Checklist de Desenvolvimento

### Ao Criar um Novo Arquivo CSS
- [ ] Arquivo criado em `css/novo.css`
- [ ] Tag `<link>` adicionada (entre utilities e responsive)
- [ ] Estilos usam variáveis (var())
- [ ] Breakpoints estão em responsive.css
- [ ] Nomes de classe seguem padrão (kebab-case)

### Ao Modificar um Componente
- [ ] Arquivo CSS correto identificado
- [ ] Mudança é isolada (não quebra outros arquivos)
- [ ] Cores usam var() do :root
- [ ] Animações usam keyframes de animations.css

### Ao Fazer Deploy
- [ ] Ordem dos arquivos está correta
- [ ] Responsive.css está por último
- [ ] Base.css está primeiro
- [ ] Sem erros no DevTools Console

---

## 🔍 Debugging

### CSS não carrega
```
1. Verifique caminho no <link>
2. Verifique console (F12 → Console)
3. Procure por "Failed to load resource"
```

### Estilos não aparecem
```
1. Hard refresh: Ctrl+Shift+R
2. Verifique especificidade CSS
3. Verifique ordem dos arquivos
4. Verifique se classe está no HTML
```

### Responsivo quebrado
```
1. Verifique responsive.css está por último
2. Verifique @media queries estão corretas
3. Use DevTools → Toggle Device Toolbar
```

---

## 📖 Para Saber Mais

- **Iniciantes:** Veja `INICIO_RAPIDO.md` para setup e testes
- **Usuários:** Veja README.md para instruções de uso
- **Arquitetos:** Este documento (GUIA_DESENVOLVIMENTO.md)

---

**Data:** Abril 2026  
**Versão:** 1.0 - Production  
**Status:** ✅ Completo e Pronto para Uso
