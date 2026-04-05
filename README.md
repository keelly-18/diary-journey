# 📓 Códice das Sombras - Portfólio Técnico Interativo

Um portfólio moderno e temático que funciona como diário técnico, mostrando sua evolução em programação com gamificação, timeline de atividades, e galeria de projetos.

## ✨ Características Principais

- 🎨 **Design Temático** - Estética gótica/tarot minimalista
- 🌙 **Dark Mode** - Tema escuro confortável para olhos
- 📊 **Dashboard Gamificado** - Stats, XP, Streak, Level e Daily Quest
- 💻 **Skills Tracker** - Acompanhe habilidades com progressão de pontos
- 🔗 **Projetos com Links** - Galeria de projetos com imagens e links GitHub
- 📝 **Timeline de Atividades** - Registro de evolução com filtros por categoria
- ❤️ **Emotional Widget** - Acompanhe seu status emocional e insights
- 💱 **Heartbeat Monitor** - Visualização animada de progresso
- 👏 **Página de Créditos** - Reconhecimento de ferramentas e recursos
- ✨ **Selo Temático** - Footer com identidade visual
- ⚡ **Animações Suaves** - Efeitos visuais elegantes com GSAP
- 📱 **Totalmente Responsivo** - Funciona em desktop, tablet e mobile

## 🚀 Quick Start - 5 Minutos

### Opção 1: Direto no Navegador
```bash
1. Abra o arquivo index.html no seu navegador
2. Pronto! Seu portfólio está rodando
```

### Opção 2: Com Servidor Local (Recomendado)
```bash
# Python 3
python -m http.server 8000
# Acesse: http://localhost:8000

# Node.js
npx http-server
# Acesse: http://localhost:8080

# VS Code Live Server
# Clique direito em index.html → "Open with Live Server"
```

## 📖 Documentação

### 👤 Para Usuários - Comece Aqui
📖 **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** (10 minutos)
- Setup inicial
- Como usar cada seção
- Troubleshooting
- Customizações básicas

### 👨‍💻 Para Desenvolvedores
📖 **[GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md)** (referência)
- Arquitetura CSS modularizada
- Mapa de classes
- Como adicionar componentes
- Boas práticas
- Sistema de cascata

## 📚 Estrutura do Projeto

```
diary-journey/
├── index.html              ← Página principal
├── README.md               ← Este arquivo
├── INICIO_RAPIDO.md        ← Setup & troubleshooting
├── GUIA_DESENVOLVIMENTO.md ← Arquitetura & referência
├── css/
│   ├── base.css            (Variáveis & reset)
│   ├── animations.css       (Keyframes)
│   ├── sidebar.css          (Navegação lateral)
│   ├── dashboard.css        (Painel principal)
│   ├── cards.css            (Cards & grids)
│   ├── activities.css       (Timeline)
│   ├── buttons.css          (Botões)
│   ├── forms-modals.css     (Formulários)
│   ├── dropdowns.css        (Selects)
│   ├── utilities.css        (Utilitários)
│   ├── skills.css           (Dashboard skills)
│   ├── credits.css          (Página créditos)
│   ├── footer.css           (Selo final)
│   └── responsive.css       (Mobile)
├── js/
│   ├── main.js              (Lógica principal)
│   ├── dados.js             (Dados padrão)
│   └── fantasma.js          (Animações especiais)
└── img/
    └── [Ícones e imagens]
```

## 🎯 Seções Principais

### 📊 Dashboard (Home)
Visão geral do seu progresso:
- **Oracle Box** - Daily quest diária
- **Emotional Widget** - Status emocional + insights
- **Stats Panel** - XP, Streak, Level
- **Heartbeat Monitor** - Gráfico animado
- **Daily Reminder** - Últimos logs registrados

### 💻 Habilidades
Acompanhe suas skills com progressão gradual:
- Registre novas habilidades
- Ganhe pontos praticando (0.01 por registro)
- Veja barra de progresso e nível em estrelas
- Delete habilidades quando desejar

**Progressão:**
- 0-20 pts: ☆☆☆☆☆ (Novice)
- 20-40 pts: ★☆☆☆☆ (Learning)
- 40-60 pts: ★★☆☆☆ (Practicing)
- 60-80 pts: ★★★☆☆ (Proficient)
- 80-100 pts: ★★★★☆ (Advanced)
- 100+ pts: ★★★★★ (Expert)

### 🎨 Projetos
Galeria de seus projetos com imagens:
- Nome do projeto
- Link GitHub/portfolio
- Imagem do projeto (upload com preview)
- Grid responsivo
- Opção de remover

### 📝 Atividades
Timeline de sua jornada:
- Registre atividades (Estágio, Faculdade, Estudo, Desafio, Conquista)
- Filtros por categoria
- Cards coloridos por tipo
- Visualize evolução temporal

### 👏 Créditos
Página reconhecendo:
- 🤖 AI Tools (Claude, Gemini)
- ⚙️ Tecnologias (HTML5, CSS3, JS, GSAP)
- 🎭 Visual Resources (Freepik, Flaticon)
- ✍️ Typography (Cinzel, Spectral)
- 🙏 Agradecimentos

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Grid, Flexbox, variáveis CSS, animações
- **JavaScript** - Vanilla (sem frameworks)
- **GSAP** - Animações avançadas
- **localStorage** - Persistência de dados
- **Google Fonts** - Cinzel (títulos), Spectral (texto)

## 🎨 Design & Cores

### Paleta Principal
```css
--gold: #daa520              /* Primária - ouro dourado */
--gold-light: #fce68a        /* Destaque claro */
--text: #c8c8c8              /* Texto padrão */
--surface: rgba(8,8,8,0.95)  /* Fundo dos elementos */
--bg: #050505                /* Background principal */
```

### Cores por Atividade (Atividades)
```css
#c084fc   /* Estágio - roxo */
#7dd3fc   /* Faculdade - azul */
#5eead4   /* Estudo - teal */
#fcd34d   /* Desafio - amarelo */
#fca5a5   /* Conquista - coral/vermelho */
```

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente em **localStorage**:
- Habilidades registradas
- Projetos adicionados
- Atividades/logs
- Preferências

Os dados persistem mesmo após fechar o navegador!

### Backup Manual
```javascript
// Exportar dados (Cole no console)
JSON.stringify(localStorage)

// Importar dados (Cole no console depois)
// [Variações específicas por tipo de dado]
```

## 📱 Responsividade

### Breakpoints
- **Desktop** (1024px+) - Layout completo multi-coluna
- **Tablet** (768-1024px) - Layout adaptado, sidebar menor
- **Mobile** (< 768px) - Layout em coluna única, sidebar bottom

Toda a interface é otimizada para cada tamanho!

## 🚀 Deploy

### GitHub Pages (Recomendado)
```bash
1. Crie repositório no GitHub
2. Envie arquivos (git push)
3. Ative Pages em Settings → Pages
4. Seu portfólio está online!
```

### Netlify / Vercel
```bash
# Arraste a pasta para Netlify Drop
# Ou conecte seu repo GitHub
# Pronto! Deploy automático a cada push
```

### Seu Próprio Servidor
```bash
# Faça upload dos arquivos via FTP
# Certifique que index.html está na raiz
# Acesse pelo seu domínio
```

## 🎓 Customização

### Mudar Cores (Fácil)
```css
/* Em css/base.css */
:root {
  --gold: #seu-color;        /* Mude a cor primária */
  --gold-light: #seu-color;  /* Mude a cor clara */
  /* Pronto! Tudo atualiza automaticamente */
}
```

### Mudar Nome do Projeto
```html
<!-- Em index.html -->
<title>Seu Nome - Portfólio</title>
<!-- E em footer -->
<p class="seal-title">Seu Nome</p>
```

### Adicionar Nova Página
Veja [GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md) - seção "Como Adicionar Componentes"

## 📊 Arquitetura CSS

O CSS foi reorganizado em 14 arquivos modularizados:
- **base.css** - Variáveis e reset global
- **animations.css** - Keyframes reutilizáveis
- **[12 componentes]** - Cada um com sua responsabilidade
- **responsive.css** - Media queries finais

Veja [GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md) para detalhes completos.

## 🐛 Problemas Comuns

### Página em branco
1. Recarregue com Ctrl+Shift+R (hard refresh)
2. Abra DevTools (F12) → Console
3. Procure por erros

### Estilos não carregam
1. Verifique se CSS está carregando (Network tab)
2. Verifique ordem dos `<link>` no HTML
3. base.css deve ser PRIMEIRO, responsive.css ÚLTIMO

### Dados não salvam
1. Não está em modo privado? (localStorage não funciona)
2. Permite localStorage no navegador?
3. Verás DevTools → Application → LocalStorage

## ❓ FAQ

**P: Posso usar em produção?**
R: Sim! É production-ready com design profissional.

**P: Funciona offline?**
R: Sim! Tudo roda localmente (após load das fonts).

**P: Posso mudar as cores?**
R: Sim! Veja seção "Customização" acima.

**P: Como adiciono mais habilidades/projetos?**
R: Pelos botões "+ Adicionar" na interface.

**P: Os dados vão pra nenhum servidor?**
R: Correto! Tudo fica local no seu navegador (localStorage).

**P: Posso compartilhar com outras pessoas?**
R: Sim! Cada pessoa que abre seus dados são locais e independentes.

## 📞 Suporte & Recursos

### Documentação
- 📖 [INICIO_RAPIDO.md](INICIO_RAPIDO.md) - Guia de use rápido
- 📖 [GUIA_DESENVOLVIMENTO.md](GUIA_DESENVOLVIMENTO.md) - Referência técnica

### Tecnologias
- [GSAP Docs](https://greensock.com/docs/)
- [CSS Grid Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [JavaScript Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Tools
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [VS Code](https://code.visualstudio.com/)

## 📝 Licença

Este projeto está disponível para uso pessoal e comercial.
Reconheça Freepik, Flaticon, e as ferramentas de IA usadas no crédito do seu projeto.

## 🙏 Créditos

**Construído com:**
- 🤖 Claude (AI assistente)
- 🤖 Gemini (AI assistente)
- 📚 Comunidade de desenvolvedores

**Visual & Design:**
- 🎭 Freepik - Ícones e recursos
- 🎭 Flaticon - Ícones diversos
- ✍️ Google Fonts - Cinzel, Spectral

## 🎉 Vamos Começar!

1. Abra seu navegador
2. Acesse `index.html`
3. Comece a registrar suas atividades
4. Acompanhe seu progresso
5. Aproveite a jornada! 🚀

---

**Versão:** 1.0 - Production Ready  
**Última atualização:** Abril 2026  
**Status:** ✅ Completo e Funcional

**Próximo passo:** Leia [INICIO_RAPIDO.md](INICIO_RAPIDO.md) para começar! 🚀
