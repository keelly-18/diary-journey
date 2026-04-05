# ⚡ INÍCIO RÁPIDO - Setup, Testes & Troubleshooting

## 🚀 O Que é Este Projeto?

**Códice das Sombras** é um portfólio técnico interativo com:
- 📊 Dashboard de gamificação e estatísticas
- 🎯 Timeline de atividades com filtros
- 💻 Habilidades com progressão de pontos
- 🎨 Galeria de projetos com imagens
- 👏 Créditos e acknowledgments
- ✨ Selo temático no footer

---

## 5️⃣ MINUTOS - Setup Inicial

### Opção 1: Abrir Direto (Mais Rápido)
```bash
1. Abra settings/index.html no navegador
2. Pronto! Seu portfólio está rodando
```

### Opção 2: Com Servidor Local (Recomendado)
```bash
# Python 3
cd diary-journey
python -m http.server 8000
# Abra http://localhost:8000

# Node.js (npx)
npx http-server
# Abra http://localhost:8080

# VS Code Live Server
# Clique direito em index.html > Open with Live Server
```

---

## 🧪 Teste Rápido - Verifique Tudo Funciona

### 1. Verificar Carregamento CSS
```
1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Recarregue página (Ctrl+R)
4. Procure por "css/" na lista
5. Você deve ver ~14 arquivos CSS
   ✓ base.css
   ✓ animations.css
   ✓ sidebar.css
   ✓ ... (12 mais)
   ✓ responsive.css
```
**Esperado:** Todos com status 200 ✅

### 2. Verificar Console
```
1. DevTools → aba Console
2. Você NÃO deve ver erros vermelhos
3. Se ver "Failed to load", verifique caminhos
```
**Esperado:** Console limpo ✅

### 3. Verificar Visual
```
╔─────────────────────────┐
│ [Logo] Dashboard        │ ← Sidebar
├─────────────────────────┤
│                         │
│   Painel Principal      │ ← Conteúdo
│   (cards, stats, etc)   │
│                         │
├─────────────────────────┤
│     [SELO FINAL]        │ ← Footer
└─────────────────────────┘
```
**Esperado:** Layout apareça assim ✅

### 4. Testar Interação
```
[ ] Klick em botão → tem animação de hover
[ ] Abra modal → funciona e fecha
[ ] Selecione filter → muda conteúdo
[ ] Scroll → footer aparece no final
```
**Esperado:** Tudo interatlvo ✅

### 5. Testar Responsivo
```
DevTools → Toggle Device Toolbar (Ctrl+Shift+M)

Em iPhone (375px):
[ ] Conteúdo não fica quebrado
[ ] Texto é legível
[ ] Sem scroll horizontal

Em Tablet (768px):
[ ] Layout adapta
[ ] Sidebar pode ficar menor

Em Desktop (1200px+):
[ ] Multi-coluna funciona
[ ] Sidebar visível
```
**Esperado:** Responsivo em todos ✅

---

## 🎯 Como Usar Cada Seção

### 📊 Dashboard (Home)
**O que aparece:**
- Gamificação & Oracle (Daily Quest)
- Emotional Widget (Humor/insights)
- Stats Panel (XP, Streak, Level)
- Heartbeat Monitor (gráfico animado)
- Daily Reminder (últimos logs)

**Como usar:**
```
1. Registre uma atividade → ganha XP
2. Complete quest diária → prêmio
3. Check emotional status → insights
4. Monitor seu progresso → veja stats
```

### 💻 Habilidades
**O que aparece:**
- Grade de skills registradas
- Barra de progresso (0-100 pontos)
- Botões de ação (remover)
- Nível com estrelas

**Como usar:**
```
1. Clique "Adicionar Habilidade"
2. Preencha nome + tecnologia
3. Ganhe pontos praticando
4. Veja progressão gradual (0.01 por vez)
```

**Exemplo de Progressão:**
```
0 pontos   → ☆☆☆☆☆ (Novice)
20 pontos  → ★☆☆☆☆ (Learning)
40 pontos  → ★★☆☆☆ (Practicing)
60 pontos  → ★★★☆☆ (Proficient)
80 pontos  → ★★★★☆ (Advanced)
100 pontos → ★★★★★ (Expert)
```

### 🎨 Projetos
**O que aparece:**
- Formulário: Título + Link GitHub + Imagem
- Galeria em grid
- Cards com preview de imagem
- Botões de ação

**Como usar:**
```
1. Clique "Adicionar Projeto"
2. Nome do projeto
3. Link do GitHub/URL
4. Upload imagem (convertida para base64)
5. Veja na galeria abaixo
```

### 🕐 Atividades
**O que aparece:**
- Timeline com filtros (Estágio, Faculdade, Estudo, Desafio, Conquista)
- Cards coloridos por tipo
- Horas e XP ganhado

**Como usar:**
```
1. Registre atividade → aparece no timeline
2. Use filtros → veja por categoria
3. Clique para ver detalhes
4. Delete se errar
```

### 👏 Créditos
**O que aparece:**
- 🤖 AI Tools (Claude, Gemini)
- ⚙️ Tecnologias (HTML, CSS, JS, GSAP)
- 🎭 Visual Resources (Freepik, Flaticon)
- ✍️ Typography (Cinzel, Spectral)
- 🙏 Thanks (você!)

**Propósito:**
- Reconhecer ferramentas usadas
- Compartilhar recursos
- Transparência em desenvolvimento

### 📜 Footer (Selo)
**O que aparece:**
- Círculo com símbolo ⛧
- Título: Códice das Sombras
- Subtitle: Jornada de Conhecimento & Evolução
- Meta: Feito com Claude & Gemini

**Propósito:**
- Marca visual final
- Identidade do projeto

---

## 🔧 Customização Comum

### Mudar Cores Ouro
```css
/* Em base.css */
:root {
  --gold: #daa520;           ← Mude para sua cor
  --gold-light: #fce68a;     ← Ou esta
  /* Todas as cores derivadas atualizam automaticamente */
}
```

### Mudar Nome do Projeto
```html
<!-- Em index.html -->
<title>Códice das Sombras</title>     ← Mude
<!-- E em footer -->
<p class="seal-title">Seu Nome</p>    ← Mude
```

### Adicionar Nova Página
```html
<!-- 1. Em sidebar (index.html) -->
<button class="nav-btn" onclick="goToPage('nova-pagina')">
  <span class="nav-icon">🆕</span>
  <span class="nav-text">Nova</span>
</button>

<!-- 2. Adicione section em pages-container -->
<section class="page" id="page-nova-pagina">
  Seu conteúdo aqui
</section>

<!-- 3. Em main.js, adicione handler -->
case 'nova-pagina':
  document.getElementById('page-nova-pagina').classList.add('active');
  break;
```

---

## 🐛 Troubleshooting

### ❌ Página em branco
```
✓ Verifique conexão internet (fontes Google)
✓ Abra DevTools (F12) → Console
✓ Procure por erro vermelho
✓ Hard refresh: Ctrl+Shift+R
```

### ❌ Estilos não aparecem
```
✓ Verifique se CSS está carregando (Network tab)
✓ Se erros 404, verifique caminhos
✓ Ordem dos <link> está correta?
✓ base.css deve ser PRIMEIRO
✓ responsive.css deve ser ÚLTIMO
```

### ❌ Botões não respondem
```
✓ Abra Console (F12) → procure erros JS
✓ Verifique main.js foi carregado
✓ Check se function nome está escrito certo
✓ Use console.log() para debugar
```

### ❌ Responsivo quebrado
```
✓ DevTools → Toggle Device Toolbar
✓ Verifique viewport meta tag em <head>
✓ Inspect element para ver media queries
✓ responsive.css aplicando corretamente?
```

### ❌ Imagens de projeto não aparecem
```
✓ Verifique localStorage (DevTools → Application)
✓ Imagem foi convertida para base64?
✓ Tamanho da imagem não é muito grande
✓ Tente recarregar página
```

---

## 📋 Checklist de Teste

Passe por cada item:

### Visual
- [ ] Header/Sidebar aparecem
- [ ] Cores estão corretas (ouro, roxo, azul, etc)
- [ ] Fonts aparecem góticas
- [ ] Footer com selo aparece
- [ ] Sem erros visuais (textos sobrepostos, etc)

### Funcional
- [ ] Navegação entre páginas funciona
- [ ] Botões primários animam no hover
- [ ] Modais abrem e fecham
- [ ] Formulários aceitam input
- [ ] Dados salvam em localStorage

### Responsivo
- [ ] Desktop (1200px+): perfeito
- [ ] Tablet (768px): adapta bem
- [ ] Mobile (375px): sem quebras
- [ ] Sem scroll horizontal em nenhum

### Performance
- [ ] Página carrega rápido (<2s)
- [ ] Animações são suaves (60fps)
- [ ] Console sem warnings
- [ ] LocalStorage funciona

---

## 🚀 Próximos Passos

### Para Desenvolvedores
1. ✅ Leia GUIA_DESENVOLVIMENTO.md (arquitetura)
2. 🔧 Customize as cores/conteúdo
3. ➕ Adicione novos componentes
4. 🚀 Deploy em GitHub Pages

### Para Usuários
1. ✅ Setup completado ✓
2. 📝 Comece a registrar atividades
3. 💪 Pratique suas skills
4. 🎉 Acompanhe seu progresso

### Para Contribuidores
1. 📖 Veja GUIA_DESENVOLVIMENTO.md
2. 🔀 Crie branch: `git checkout -b feature/sua-feature`
3. ✍️ Faça mudanças
4. 📤 Abra Pull Request

---

## 📞 Suporte Rápido

### Dúvida Comum
**P: Onde edito o conteúdo?**
R: Maioria está em `index.html` ou `js/dados.js`

**P: Como adiciono nova habilidade?**
R: Barra lateral → Habilidades → + Adicionar

**P: Dados salvam automaticamente?**
R: Sim! localStorage salva tudo no navegador

**P: Posso backup meus dados?**
R: DevTools → Application → LocalStorage → export
(Ou use a função "salvar" se houver)

**P: Como faço deploy?**
R: GitHub Pages, Netlify, Vercel -
just upload os arquivos HTML/CSS/JS

---

## 🎓 Recursos Adicionais

### Documentação
- **README.md** - Visão geral do projeto
- **GUIA_DESENVOLVIMENTO.md** - Arquitetura CSS
- Este arquivo - Setup & Troubleshooting

### Tecnologias
- HTML5 + CSS3 + JavaScript Vanilla
- GSAP para animações
- localStorage para persistência
- Google Fonts (Cinzel, Spectral)

### Ferramentas de Desenvolvimento
- VS Code (editor recomendado)
- Chrome DevTools ou similar
- Git (controle de versão)

---

## ✅ Score de Sucesso

**100% Completo** 🎉
- ✅ Setup funcionando
- ✅ Todos os testes passam
- ✅ Customizações feitas
- ✅ Pronto para usar!

**Status:** Seu portfólio está pronto! 🚀

---

**Versão:** 1.0 - Complete  
**Data:** Abril 2026  
**Tempo de Setup:** ~5 minutos  
**Tempo de Teste:** ~10 minutos

**Próximo passo:** Comece a registrar suas atividades e veja seu progresso! 
