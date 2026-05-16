# System Level Up

> Sistema de gerenciamento pessoal gamificado inspirado em RPGs e manhwas, especialmente "Solo Leveling". Transforma atividades do dia a dia em progressão de personagem.

---

## Índice

1. [O que é este sistema](#1-o-que-é-este-sistema)
2. [Como acessar e usar](#2-como-acessar-e-usar)
3. [Estrutura de arquivos](#3-estrutura-de-arquivos)
4. [Arquitetura e funcionamento](#4-arquitetura-e-funcionamento)
5. [Sistemas e mecânicas](#5-sistemas-e-mecânicas)
6. [Dados e armazenamento](#6-dados-e-armazenamento)
7. [Tecnologias utilizadas](#7-tecnologias-utilizadas)
8. [Guia educativo — entenda cada parte](#8-guia-educativo--entenda-cada-parte)
9. [Como dar continuidade ao projeto](#9-como-dar-continuidade-ao-projeto)

---

## 1. O que é este sistema

O **System Level Up** é um sistema de produtividade pessoal que transforma a vida real em um RPG. Você cria um personagem que representa você mesmo e evolui ele completando atividades reais: fazer academia, estudar, completar hábitos diários.

**Em linguagem simples:** cada vez que você completa um treino, ganha EXP e sobe de nível. Cada hora de estudo aumenta seu atributo de Inteligência. Cada vez que completa todos seus hábitos do dia, ganha vitalidade. O sistema registra tudo, exibe um painel de status estilo RPG, e te recompensa com moedas, títulos e evolução de classe.

### O que ele resolve

- Falta de motivação para manter rotinas e hábitos
- Dificuldade de visualizar progresso em atividades do dia a dia
- Ausência de recompensas imediatas em metas de longo prazo
- Necessidade de um sistema de acompanhamento pessoal divertido

---

## 2. Como acessar e usar

O sistema é um arquivo HTML único — não precisa de instalação nem servidor.

```bash
# Opção 1: Abrir diretamente no navegador
# Clique duas vezes em System.html

# Opção 2: Via servidor local (recomendado para evitar limitações do navegador)
npx serve .
# Acesse: http://localhost:3000/System.html
```

> **Atenção:** os dados são salvos no localStorage do navegador. Se limpar o cache ou usar outro navegador, os dados não estarão disponíveis. Faça backups periódicos exportando os dados pelo menu do sistema.

---

## 3. Estrutura de arquivos

```
system-level-up/
│
├── System.html               # Interface principal — o sistema inteiro em um HTML
├── System_script.js          # Lógica completa (~11.591 linhas)
├── System_style.css          # Estilos visuais (~11.392 linhas)
│
├── System.html.bak           # Backup da versão anterior do HTML
├── System_script.js.bak      # Backup da versão anterior do script
├── System_style.css.bak      # Backup da versão anterior do CSS
│
├── index.html                # Redirecionamento para System.html (deploy)
│
├── arena-avatars/            # Imagens dos personagens da arena de batalha
│   ├── SUNG JINWOO.jpg       # Personagem principal (Solo Leveling)
│   ├── ASHBORN.png           # Monarca das Sombras
│   ├── CHRISTOPHER REED.png
│   └── ... (25+ avatares)
│
├── assets/
│   └── media/
│       ├── evolution.gif     # Animação de evolução de rank
│       ├── raining-coins.gif # Animação de recompensa de moedas
│       └── virtues.gif       # Animação de conquista
│
├── images/                   # Ícones das abas da interface
│   ├── status.png            # Ícone da aba Status
│   ├── notification.png      # Ícone de notificações
│   ├── trainne.png           # Ícone de treinos
│   ├── ability.png           # Ícone de habilidades
│   ├── buy.png               # Ícone da loja
│   └── penality.png          # Ícone de penalidades
│
└── PROJETO.md                # Este arquivo
```

---

## 4. Arquitetura e funcionamento

### Visão geral

O sistema é uma **Single Page Application (SPA)** — tudo roda em uma única página HTML, e JavaScript manipula o que aparece na tela sem recarregar a página.

```
System.html (estrutura da tela)
    │
    ├── System_style.css (aparência visual)
    │
    └── System_script.js (toda a lógica)
         │
         ├── Estado do personagem (objeto JS na memória)
         │
         ├── localStorage (persistência entre sessões)
         │
         └── Funções de cada sistema:
             ├── levelUp(), ganharExp()
             ├── completarTreino(), completarHabito()
             ├── comprarItem(), aplicarPenalidade()
             ├── verificarTitulos()
             └── renderizarPainel()
```

### Fluxo de uma ação do usuário

```
Usuário clica "Completar Treino"
        │
        ▼
completarTreino()
  ├── Adiciona EXP ao personagem
  ├── Adiciona Força (+0.15)
  ├── Gera moedas (baseado na classe)
  ├── Verifica se subiu de nível → levelUp()
  ├── Verifica títulos desbloqueados → verificarTitulos()
  ├── Salva no localStorage → salvarDados()
  └── Atualiza a tela → renderizarStatus()
```

---

## 5. Sistemas e mecânicas

### Sistema de Níveis e EXP

O personagem começa no nível 1 e pode chegar ao nível 100+.

| Nível | EXP necessária |
|-------|----------------|
| 1 → 2 | 100 EXP |
| 2 → 3 | 120 EXP (+20%) |
| 3 → 4 | 144 EXP (+20%) |
| N → N+1 | expAnterior × 1.2 |

**Fórmula:** `expNecessaria = 100 × (1.2 ^ (nivel - 1))`

A cada level up, o personagem ganha +20% de HP e MP máximos.

### Ranks (Classificação Geral)

```
F → E → D → C → B → A → S → SS → SSS → Nacional → Z → Deus
```

A cada 10 níveis, o rank avança automaticamente.

### Atributos

| Atributo | Como aumenta | Ganho por ação |
|----------|-------------|----------------|
| Força | Treinos concluídos | +0.15 por treino |
| Inteligência | Horas de estudo | +0.15 por hora |
| Agilidade | Quilômetros corridos | +0.10 por KM |
| Vitalidade | Todos hábitos do dia completos | +0.10 por dia completo |
| Resistência | 5 treinos na semana | +0.30 por meta semanal |
| Percepção | Horas de estudo de psicologia | +0.30 por hora |

Os atributos são armazenados com casas decimais (ex: 15.75) mas exibidos como inteiros (ex: 15).

### Classes (desbloqueadas no nível 50)

| Classe | Bônus de atributo | Multiplicador de moedas |
|--------|-------------------|------------------------|
| Necromante | Todos os atributos | 5.000 – 15.000 |
| Bárbaro | Força | 350 – 800 |
| Guerreiro | Resistência | 300 – 700 |
| Assassino | Agilidade | 280 – 650 |
| Mago | Inteligência | 250 – 600 |
| Paladino | Percepção | 220 – 550 |
| Espadachim | Vitalidade | 200 – 500 |

Cada classe tem 10 estágios de evolução, avançando a cada 25 níveis após o nível 50 (nível 50, 75, 100, 125...). O nome do estágio muda para algo épico — por exemplo, Necromante no estágio 10 vira "Monarca das Sombras".

### Sistema de Títulos

Títulos são conquistas desbloqueadas automaticamente ao atingir marcos:

**Por nível:** Novato (5), Aprendiz (10), Iniciado (20), Experiente (30), Veterano (50), Mestre (75), Lendário (100).

**Por treinos:** Primeiro Passo (1), Dedicado (10), Disciplinado (50), Atleta (100), Guerreiro de Ferro (250), Titã (500), Quebrador de Limites (1000).

**Por estudos:** Estudante (10h), Estudioso (50h), Erudito (100h), Sábio (250h), Mestre do Conhecimento (500h), Biblioteca Viva (1000h), Sábio Eterno (2000h).

**Por consistência (dias sem falhas):** Sem Penalidades (7 dias), Perfeito (30), Imaculado (100), Transcendente (365).

**Por atributos:** Títulos especiais quando atributos atingem 50 e 100 pontos.

### HP e MP

| Stat | Valor inicial | Crescimento | Recuperação |
|------|--------------|-------------|-------------|
| HP | 1.000 | +20% por nível | Poções da loja |
| MP | 500 | +20% por nível | +1 MP a cada 10 minutos |

HP é reduzido por penalidades. MP é reservado para funcionalidades futuras.

### Sistema de Treinos

- Cadastro de treinos com nome, tipo e mídia (imagem ou vídeo)
- Ao finalizar: ganha EXP + moedas + Força +0.15
- Meta semanal padrão: 5 treinos por semana
- Reset automático toda segunda-feira

### Sistema de Estudos

- Registro de horas de estudo por matéria
- Cada hora de estudo geral: +0.15 de Inteligência
- Horas de psicologia: +0.30 de Percepção

### Sistema de Hábitos

- Hábitos diários configuráveis pelo usuário
- Completar todos os hábitos do dia: +0.10 de Vitalidade + EXP bônus
- Rastreamento de streak (sequência de dias completos)

### Loja e Moedas

- Moedas são ganhas ao completar atividades
- A quantidade varia pela classe e pelo acaso (dentro do range da classe)
- Itens disponíveis na loja: poções de HP, recompensas especiais

### Sistema de Penalidades

- Penalidades reduzem HP do personagem
- Aplicadas manualmente ou automaticamente por metas não atingidas

### Arena

- Sistema de batalhas contra personagens do manhwa Solo Leveling
- Personagens com avatares reais dos personagens da história
- Mecânica de combate baseada nos atributos do personagem

---

## 6. Dados e armazenamento

O sistema usa **exclusivamente localStorage** para persistência. Não há banco de dados externo.

### Principais chaves do localStorage

| Chave | Conteúdo |
|-------|----------|
| `playerData` | Todos os dados do personagem (nível, EXP, atributos, classe, título) |
| `habitos` | Lista de hábitos e status diário |
| `treinos` | Histórico de treinos completados |
| `estudos` | Registro de horas de estudo |
| `loja` | Itens comprados |
| `penalidades` | Histórico de penalidades aplicadas |
| `arenaHistory` | Histórico de batalhas na arena |

### Importante sobre localStorage

Os dados ficam apenas no navegador do dispositivo atual. Para não perder progresso:

1. **Não limpe o cache do navegador** sem exportar os dados antes
2. Use sempre o mesmo navegador no mesmo dispositivo
3. Exporte os dados periodicamente pelo menu do sistema (função de backup)

---

## 7. Tecnologias utilizadas

| Tecnologia | Função | Por que foi escolhida |
|------------|--------|-----------------------|
| HTML5 | Estrutura da interface | Base de qualquer sistema web |
| CSS3 | Visual estilo Solo Leveling (tema escuro + dourado) | Controle total do design sem dependências |
| JavaScript Vanilla | Toda a lógica do sistema | Sistema complexo sem overhead de frameworks |
| localStorage | Persistência dos dados | Simples, rápido, sem necessidade de servidor |
| Canvas API | Gráfico hexagonal de atributos | Renderização de gráficos nativamente no browser |

---

## 8. Guia educativo — entenda cada parte

### O que é uma SPA (Single Page Application)?

Uma SPA é um site onde toda a navegação acontece sem recarregar a página. Em vez de ir para outra página ao clicar em um link, o JavaScript esconde uma parte da tela e mostra outra. O System Level Up funciona assim: é um único arquivo HTML, e todas as "telas" (status, treinos, loja, arena) são `<div>` que são mostradas ou escondidas conforme a aba selecionada.

```javascript
// Exemplo simplificado
function mostrarAba(nomeDaAba) {
  // Esconde todas as abas
  document.querySelectorAll('.aba').forEach(a => a.style.display = 'none');
  // Mostra só a selecionada
  document.getElementById(nomeDaAba).style.display = 'block';
}
```

### O que é localStorage?

localStorage é um espaço de armazenamento que o navegador oferece. Você pode guardar dados lá e eles ficam salvos mesmo depois de fechar o navegador.

```javascript
// Salvar dados do personagem
localStorage.setItem('playerData', JSON.stringify({ nivel: 15, exp: 340 }));

// Recuperar os dados
const jogador = JSON.parse(localStorage.getItem('playerData'));
console.log(jogador.nivel); // 15
```

### Como funciona a progressão de nível?

A fórmula usa progressão geométrica — cada nível custa 20% mais que o anterior. Isso cria uma curva de dificuldade crescente natural:

```javascript
function calcularExpNecessaria(nivel) {
  let exp = 100;
  for (let i = 1; i < nivel; i++) {
    exp = exp * 1.2;
  }
  return Math.floor(exp);
}
```

Para o nível 10, a conta fica: `100 × 1.2⁹ ≈ 516 EXP`. Quanto mais alto o nível, mais difícil subir.

### Como funciona o Canvas (gráfico hexagonal)?

A Canvas API permite desenhar gráficos e formas diretamente no HTML. Para o hexágono de atributos, o código calcula as posições dos 6 pontos de um hexágono e desenha linhas entre eles, preenchendo conforme o valor de cada atributo:

```javascript
// Simplificado — como desenhar um ponto de um atributo
const angulo = (i * 2 * Math.PI / 6) - Math.PI / 2;
const x = centroX + raio * valorAtributo * Math.cos(angulo);
const y = centroY + raio * valorAtributo * Math.sin(angulo);
```

### O que são GIFs de animação?

Os GIFs (`evolution.gif`, `raining-coins.gif`) são imagens animadas que aparecem em momentos específicos do sistema — ao subir de nível, ao ganhar moedas. O JavaScript exibe e esconde essas imagens em momentos calculados:

```javascript
function mostrarAnimacaoLevelUp() {
  document.getElementById('gif-evolution').style.display = 'block';
  setTimeout(() => {
    document.getElementById('gif-evolution').style.display = 'none';
  }, 3000); // esconde depois de 3 segundos
}
```

---

## 9. Como dar continuidade ao projeto

### Para um novo desenvolvedor começar

1. Abra `System.html` no navegador
2. Abra `System_script.js` em qualquer editor de código
3. Procure pela função `DOMContentLoaded` — é onde tudo começa
4. As funções principais estão organizadas por sistema (treinos, estudos, hábitos, etc.)
5. Use o DevTools do navegador (F12) para inspecionar o localStorage e ver os dados salvos

### Onde estão as principais partes do código

| O que procurar | Onde encontrar |
|----------------|----------------|
| Dados iniciais do personagem | Busque por `playerData` ou `estadoInicial` |
| Lógica de level up | Busque pela função `levelUp` |
| Sistema de atributos | Busque por `FORCA`, `INTELIGENCIA` |
| Render da tela | Busque por `renderizar` ou `atualizar` |
| Loja | Busque pela função `comprar` |
| Arena | Busque por `arena` ou `batalha` |

### Próximos passos naturais para evolução

- **Sincronização na nuvem:** migrar de localStorage para Supabase para não perder dados ao trocar de dispositivo
- **App mobile:** transformar em PWA (Progressive Web App) para instalar no celular
- **Missões automáticas:** gerar missões diárias/semanais automaticamente com recompensas
- **Multiplayer:** ranking entre amigos com comparação de atributos
- **Integração com fitness:** conectar com Google Fit ou Apple Health para registrar treinos automaticamente
- **Notificações:** lembretes para completar hábitos diários

---

*Documento gerado em maio de 2026 — System Level Up*
