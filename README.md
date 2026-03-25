# 📓 Diário de Programadora

Um portfólio moderno e interativo que funciona como um **diário técnico** mostrando sua evolução na programação!

## ✨ Características

- 🎨 **Design Moderno** - Layout responsivo e atraente
- 🌙 **Dark Mode** - Toggle entre tema claro e escuro
- 📈 **Timeline de Jornada** - Visualize sua evolução passo a passo
- 💻 **Linguagens** - Showcase das linguagens aprendidas com níveis de proficiência
- 📚 **Aprendizado Atual** - O que você está aprendendo agora
- 🎯 **Projetos** - Seus projetos destacados com tecnologias usadas
- ⚡ **Animações Suaves** - Transições e efeitos visuais elegantes
- 📱 **Totalmente Responsivo** - Funciona em qualquer dispositivo

## 🚀 Como Usar

### Opção 1: Abrir diretamente no navegador
1. Abra o arquivo `index.html` no seu navegador
2. Pronto! Seu diário está funcionando

### Opção 2: Usar um servidor local (recomendado)
```bash
# Com Python 3
python -m http.server 8000

# Com Node.js (se tiver instalado)
npx http-server

# Com Live Server do VS Code
# Clique com botão direito em index.html > "Open with Live Server"
```

Então acesse `http://localhost:8000`

## 📝 Como Personalizar

### 1. Editar sua informação pessoal
Abra `script.js` e procure pelas seções marcadas:

#### Timeline (sua jornada)
```javascript
const journeyData = [
    {
        title: "Seu Título",
        description: "Sua descrição",
        date: "Mês Ano"
    },
    // ... adicione mais itens
];
```

#### Linguagens aprendidas
```javascript
const languagesLearned = [
    {
        name: "Sua Linguagem",
        icon: "Seu emoji",
        level: "Avançado/Intermediário/Iniciante",
        proficiency: 85, // 0-100
        description: "Descrição curta"
    },
    // ...
];
```

#### Atualmente aprendendo
```javascript
const learningNow = [
    {
        name: "Tecnologia",
        emoji: "emoji",
        progress: 60, // 0-100
        description: "O que você está aprendendo sobre isso"
    },
    // ...
];
```

#### Seus projetos
```javascript
const projects = [
    {
        title: "Nome do Projeto",
        icon: "emoji",
        description: "Descrição do projeto",
        technologies: ["Tech1", "Tech2", "Tech3"],
        links: {
            github: "https://github.com/seu-usuario/projeto",
            live: "https://seu-projeto.com"
        }
    },
    // ...
];
```

### 2. Editar links de contato
No arquivo `index.html`, procure pela seção "Contact Section" e atualize:
```html
<a href="https://github.com/seu-usuario" class="contact-link">GitHub</a>
<a href="https://linkedin.com/in/seu-usuario" class="contact-link">LinkedIn</a>
<a href="mailto:seu-email@email.com" class="contact-link">Email</a>
```

### 3. Customizar cores
Edite o arquivo `styles.css` e modifique as variáveis CSS no `:root`:
```css
:root {
    --primary-color: #6366f1;      /* Cor principal */
    --secondary-color: #ec4899;    /* Cor secundária */
    --accent-color: #f59e0b;       /* Cor destaque */
    /* ... */
}
```

## 🎯 Emojis Úteis para Linguagens

```
JavaScript    ⚡
Python        🐍
HTML          🏗️
CSS           🎨
React         ⚛️
Node.js       🟢
TypeScript    🔷
Java          ☕
C++           ⚙️
SQL           🗄️
Docker        🐳
Git           🔗
MongoDB       🍃
PostgreSQL    🐘
AWS           ☁️
Linux         🐧
```

## 📂 Estrutura de Arquivos

```
HomeK/
├── index.html      # Estrutura HTML
├── styles.css      # Estilos (responsivo + dark mode)
├── script.js       # Dados e interações
└── README.md       # Este arquivo
```

## 🌟 Dicas

- **Adicione mais projetos** conforme cria novos
- **Atualize sua jornada** periodicamente com novas experiências
- **Experimente novas cores** para combinar com sua personalidade
- **Adicione certificados** com links para seus certificados
- **Customize os emojis** para algo que faça sentido para você

## 🔧 Tecnologias Usadas

- HTML5
- CSS3 (com variáveis CSS e animações)
- JavaScript Vanilla (sem dependências!)
- Responsive Design
- Local Storage (para dark mode)

## 📄 Licença

Livre para usar e personalizar! 💪

---

**Feito com ❤️ para programadoras em evolução**
