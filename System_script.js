// ============================================
// SISTEMA DE HABITOS, ESTUDOS E FINANCEIRO
// Sistema RPG de Gerenciamento Pessoal
// ============================================

// ============================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================

const RANKS = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'Nacional', 'Z', 'Deus'];

// Sistema de Títulos Automáticos (Estilo Manhwa)
const TITLES = [
    // Títulos de Nível
    { id: 'novato', nome: 'Aquele que Inicia a Jornada', requisito: { tipo: 'nivel', valor: 5 }, descricao: 'O primeiro passo em direção à grandeza' },
    { id: 'aprendiz', nome: 'Aprendiz do Caminho', requisito: { tipo: 'nivel', valor: 10 }, descricao: 'Absorvendo conhecimento e experiência' },
    { id: 'iniciado', nome: 'Iniciado nos Mistérios', requisito: { tipo: 'nivel', valor: 20 }, descricao: 'Caminhando pelo caminho do poder' },
    { id: 'experiente', nome: 'Aquele que Conhece o Caminho', requisito: { tipo: 'nivel', valor: 30 }, descricao: 'Experiência acumulada através das provações' },
    { id: 'veterano', nome: 'Veterano das Batalhas', requisito: { tipo: 'nivel', valor: 50 }, descricao: 'Inúmeras provações superadas' },
    { id: 'mestre', nome: 'Mestre do Sistema', requisito: { tipo: 'nivel', valor: 75 }, descricao: 'Dominando as artes do crescimento' },
    { id: 'lendario', nome: 'Lenda Viva', requisito: { tipo: 'nivel', valor: 100 }, descricao: 'Uma existência que transcende o comum' },
    
    // Títulos de Treinos
    { id: 'primeiro_passo', nome: 'Aquele que Dá o Primeiro Passo', requisito: { tipo: 'treinos_completos', valor: 1 }, descricao: 'O início de uma transformação' },
    { id: 'dedicado', nome: 'Aquele que Persevera', requisito: { tipo: 'treinos_completos', valor: 10 }, descricao: 'Dedicação que move montanhas' },
    { id: 'disciplinado', nome: 'Disciplinado pela Força de Vontade', requisito: { tipo: 'treinos_completos', valor: 50 }, descricao: 'A disciplina é a chave do poder' },
    { id: 'atleta', nome: 'Atleta Invencível', requisito: { tipo: 'treinos_completos', valor: 100 }, descricao: 'Corpo forjado em treinos incessantes' },
    { id: 'guerreiro_ferro', nome: 'Guerreiro de Ferro', requisito: { tipo: 'treinos_completos', valor: 250 }, descricao: 'Corpo e mente indestrutíveis' },
    { id: 'titan', nome: 'Titã do Treinamento', requisito: { tipo: 'treinos_completos', valor: 500 }, descricao: 'Força que desafia os limites' },
    { id: 'quebrador_limites', nome: 'Quebrador de Limites', requisito: { tipo: 'treinos_completos', valor: 1000 }, descricao: 'Transcendendo todas as barreiras físicas' },
    
    // Títulos de Estudos
    { id: 'estudante', nome: 'Buscador de Conhecimento', requisito: { tipo: 'horas_estudo', valor: 10 }, descricao: 'Iniciando a busca pelo saber' },
    { id: 'estudioso', nome: 'Erudito em Ascensão', requisito: { tipo: 'horas_estudo', valor: 50 }, descricao: 'Conhecimento acumulado através da dedicação' },
    { id: 'erudito', nome: 'Erudito das Artes', requisito: { tipo: 'horas_estudo', valor: 100 }, descricao: 'Mestre do conhecimento arcano' },
    { id: 'sabio', nome: 'Sábio que Transcende', requisito: { tipo: 'horas_estudo', valor: 250 }, descricao: 'Sabedoria que ilumina o caminho' },
    { id: 'mestre_conhecimento', nome: 'Mestre do Conhecimento Infinito', requisito: { tipo: 'horas_estudo', valor: 500 }, descricao: 'Dominando todos os campos do saber' },
    { id: 'biblioteca_viva', nome: 'Biblioteca Viva', requisito: { tipo: 'horas_estudo', valor: 1000 }, descricao: 'Um repositório ambulante de conhecimento' },
    { id: 'sabio_eterno', nome: 'Sábio Eterno', requisito: { tipo: 'horas_estudo', valor: 2000 }, descricao: 'Sabedoria que atravessa eras' },
    
    // Títulos de Hábitos
    { id: 'consistente', nome: 'Aquele que Mantém a Consistência', requisito: { tipo: 'habitos_completos', valor: 30 }, descricao: 'A consistência é a mãe da maestria' },
    { id: 'disciplinado_habitos', nome: 'Disciplinado pela Rotina', requisito: { tipo: 'habitos_completos', valor: 100 }, descricao: 'Rotina que transforma em poder' },
    { id: 'mestre_habitos', nome: 'Mestre da Disciplina Diária', requisito: { tipo: 'habitos_completos', valor: 365 }, descricao: 'Um ano de dedicação inabalável' },
    { id: 'imortal_habitos', nome: 'Imortal da Consistência', requisito: { tipo: 'habitos_completos', valor: 1000 }, descricao: 'Mil dias de hábitos ininterruptos' },
    
    // Títulos de Habilidades
    { id: 'especialista', nome: 'Especialista em Ascensão', requisito: { tipo: 'habilidade_level', valor: 10 }, descricao: 'Dominando uma arte específica' },
    { id: 'mestre_habilidade', nome: 'Mestre de Habilidades', requisito: { tipo: 'habilidade_level', valor: 20 }, descricao: 'Maestria que inspira admiração' },
    { id: 'lendario_habilidade', nome: 'Lendário nas Artes', requisito: { tipo: 'habilidade_level', valor: 30 }, descricao: 'Habilidade que transcende o comum' },
    { id: 'divino_habilidade', nome: 'Divino das Habilidades', requisito: { tipo: 'habilidade_level', valor: 50 }, descricao: 'Poder que rivaliza com os deuses' },
    
    // Títulos de Runas
    { id: 'portador_runa', nome: 'Portador de Runa Ancestral', requisito: { tipo: 'runas_desbloqueadas', valor: 1 }, descricao: 'Primeira runa desbloqueada - o início do poder arcano' },
    { id: 'colecionador_runas', nome: 'Colecionador de Runas Antigas', requisito: { tipo: 'runas_desbloqueadas', valor: 5 }, descricao: 'Acumulando poder através das runas' },
    { id: 'mestre_runas', nome: 'Mestre das Runas Arcanas', requisito: { tipo: 'runas_desbloqueadas', valor: 10 }, descricao: 'Dominando múltiplas runas de poder' },
    { id: 'arquiteto_runas', nome: 'Arquiteto de Runas', requisito: { tipo: 'runas_desbloqueadas', valor: 20 }, descricao: 'Criador e dominador de runas' },
    
    // Títulos de Atributos
    { id: 'forte', nome: 'Aquele que Possui Força Descomunal', requisito: { tipo: 'atributo', atributo: 'forca', valor: 50 }, descricao: 'FORÇA que desafia os limites' },
    { id: 'inteligente', nome: 'Aquele que Possui Intelecto Supremo', requisito: { tipo: 'atributo', atributo: 'inteligencia', valor: 50 }, descricao: 'INTELIGÊNCIA que transcende o comum' },
    { id: 'agil', nome: 'Aquele que Move-se como o Vento', requisito: { tipo: 'atributo', atributo: 'agilidade', valor: 50 }, descricao: 'AGILIDADE que desafia a física' },
    { id: 'vital', nome: 'Aquele que Possui Vitalidade Infinita', requisito: { tipo: 'atributo', atributo: 'vitalidade', valor: 50 }, descricao: 'VITALIDADE que nunca se esgota' },
    { id: 'resiliente', nome: 'Aquele que Resiste a Tudo', requisito: { tipo: 'atributo', atributo: 'resistencia', valor: 50 }, descricao: 'RESISTÊNCIA que desafia a destruição' },
    { id: 'perceptivo', nome: 'Aquele que Percebe o Invisível', requisito: { tipo: 'atributo', atributo: 'percepcao', valor: 50 }, descricao: 'PERCEPÇÃO que vê além do véu' },
    { id: 'equilibrado', nome: 'Aquele que Possui Equilíbrio Perfeito', requisito: { tipo: 'atributo', atributo: 'forca', valor: 100 }, descricao: 'Todos os atributos em harmonia suprema' },
    
    // Títulos Especiais
    { id: 'sem_penalidades', nome: 'Aquele que Supera as Adversidades', requisito: { tipo: 'dias_sem_penalidade', valor: 7 }, descricao: '7 dias sem falhas - superando obstáculos' },
    { id: 'perfeito', nome: 'Aquele que Busca a Perfeição', requisito: { tipo: 'dias_sem_penalidade', valor: 30 }, descricao: '30 dias de perfeição inabalável' },
    { id: 'imaculado', nome: 'Aquele que é Imaculado', requisito: { tipo: 'dias_sem_penalidade', valor: 100 }, descricao: '100 dias sem uma única falha' },
    { id: 'transcendente', nome: 'Aquele que Transcende', requisito: { tipo: 'dias_sem_penalidade', valor: 365 }, descricao: 'Um ano completo de perfeição absoluta' },
    
    // Títulos de Conquistas Especiais
    { id: 'superador', nome: 'Superador de Limites', requisito: { tipo: 'nivel', valor: 50 }, descricao: 'Nível 50 alcançado - transcendendo barreiras' },
    { id: 'ascendente', nome: 'Ascendente do Poder', requisito: { tipo: 'nivel', valor: 75 }, descricao: 'Nível 75 - ascendendo além do mortal' },
    { id: 'imortal', nome: 'Imortal em Progresso', requisito: { tipo: 'nivel', valor: 100 }, descricao: 'Nível 100 - caminhando rumo à imortalidade' }
];

const CLASSES = {
    'Necromante': {
        name: 'Necromante',
        evolutions: [
            'Necromante', 'Invocador de Ossos', 'Teurgo da Morte', 'Mestre dos Espectros',
            'Arquiteto Cadavérico', 'Invocador Abissal', 'Sumo Necrolorde',
            'Herdeiro do Luto Eterno', 'Arconte da Ruína', 'Monarca das Sombras'
        ],
        bonusAttribute: 'all',
        coinMultiplier: { min: 5000, max: 15000 }
    },
    'Espadachim': {
        name: 'Espadachim',
        evolutions: [
            'Espadachim', 'Duelista Adepto', 'Mestre das Lâminas', 'Guardião Cortante',
            'Espadachim Imortal', 'Lâmina Dividida', 'Soberano das Espadas',
            'Senhor das Mil Lâminas', 'Imperador Afiado', 'Avatar da Lâmina Eterna'
        ],
        bonusAttribute: 'vitalidade',
        coinMultiplier: { min: 200, max: 500 }
    },
    'Guerreiro': {
        name: 'Guerreiro',
        evolutions: [
            'Guerreiro', 'Lutador de Ferro', 'Campeão Marcial', 'Guardião de Batalha',
            'Herói da Fortaleza', 'Berserker Supremo', 'Colosso de Guerra',
            'Titã do Campo de Batalha', 'Rei da Carnificina', 'Deus da Guerra Indomável'
        ],
        bonusAttribute: 'resistencia',
        coinMultiplier: { min: 300, max: 700 }
    },
    'Mago': {
        name: 'Mago',
        evolutions: [
            'Mago', 'Conjurador Iniciado', 'Feiticeiro Elemental', 'Arcanista Superior',
            'Sábio Místico', 'Arquimago Ancestral', 'Profeta Arcano',
            'Senhor dos Segredos Ocultos', 'Soberano da Realidade', 'Arcano Supremo'
        ],
        bonusAttribute: 'inteligencia',
        coinMultiplier: { min: 250, max: 600 }
    },
    'Assassino': {
        name: 'Assassino',
        evolutions: [
            'Assassino', 'Lâmina Silenciosa', 'Predador das Sombras', 'Ceifador Noturno',
            'Mãos da Morte', 'Perseguidor Fantasma', 'Mestre do Golpe Mortal',
            'Executor Abissal', 'Sombra Aniquiladora', 'Fantasma Supremo'
        ],
        bonusAttribute: 'agilidade',
        coinMultiplier: { min: 280, max: 650 }
    },
    'Paladino': {
        name: 'Paladino',
        evolutions: [
            'Paladino', 'Escudeiro Sagrado', 'Cruzado Devoto', 'Guardião da Luz',
            'Cavaleiro Consagrado', 'Campeão da Virtude', 'Vingador Radiante',
            'Arauto Celestial', 'Soberano da Luz Divina', 'Avatar do Juramento Eterno'
        ],
        bonusAttribute: 'percepcao',
        coinMultiplier: { min: 220, max: 550 }
    },
    'Bárbaro': {
        name: 'Bárbaro',
        evolutions: [
            'Bárbaro', 'Selvagem Indômito', 'Guerreiro da Fúria', 'Marauder Sangrento',
            'Andarilho do Caos', 'Carniceiro Primitivo', 'Fúria Encarnada',
            'Senhor da Devastação', 'Titã da Ira Uivante', 'Devorador de Tempestades'
        ],
        bonusAttribute: 'forca',
        coinMultiplier: { min: 350, max: 800 }
    }
};

// ============================================
// CLASSE PRINCIPAL DO SISTEMA
// ============================================

class GameSystem {
    constructor() {
        this.loadData();
        this.init();
    }

    // Carregar dados do localStorage
    loadData() {
        const saved = localStorage.getItem('gameSystemData');
        if (saved) {
            const data = JSON.parse(saved);
            this.data = {
                // Informações básicas
                nome: data.nome || '',
                apelido: data.apelido || '',
                nivel: data.nivel || 1,
                exp: data.exp || 0,
                expNecessaria: data.expNecessaria || 100,
                rank: data.rank || 'F',
                classe: data.classe || null,
                classeStage: data.classeStage || 0,
                titulo: data.titulo || null,
                titulosDesbloqueados: data.titulosDesbloqueados || [],
                
                // Atributos (valores decimais internos, exibição inteira)
                atributos: {
                    forca: data.atributos?.forca || 0,
                    inteligencia: data.atributos?.inteligencia || 0,
                    agilidade: data.atributos?.agilidade || 0,
                    vitalidade: data.atributos?.vitalidade || 0,
                    resistencia: data.atributos?.resistencia || 0,
                    percepcao: data.atributos?.percepcao || 0
                },
                
                // HP e MP
                hp: data.hp || 1000,
                hpMax: data.hpMax || 1000,
                mp: data.mp || 500,
                mpMax: data.mpMax || 500,
                lastMpRecovery: data.lastMpRecovery || Date.now(),
                
                // Moedas
                moedas: data.moedas || 0,
                
                // Treinos
                treinos: data.treinos || [],
                treinosSemana: data.treinosSemana || [],
                estudos: data.estudos || [],
                treinoMeta: data.treinoMeta || 5,
                estudoMeta: data.estudoMeta || 10,
                ultimaSemanaResistencia: data.ultimaSemanaResistencia || null,
                
                // Tarefas e Missões
                habitos: data.habitos || [],
                missoes: data.missoes || [],
                
                // Habilidades e Runas
                habilidades: data.habilidades || [],
                runas: data.runas || [],
                
                // Penalidades
                penalidades: data.penalidades || [],
                
                // Notificações
                notificacoes: data.notificacoes || [],
                
                // Configuração inicial
                configurado: (() => {
                    // Se já tem flag configurado como true, usa ele
                    if (data.configurado === true) return true;
                    // Se não tem flag ou é false, verifica se nome e apelido são válidos
                    const nomeOk = data.nome && String(data.nome).trim().length > 0;
                    const apelidoOk = data.apelido && String(data.apelido).trim().length > 0;
                    return nomeOk && apelidoOk;
                })(),
                classeSelecionada: data.classeSelecionada || false,
                
                // Títulos
                titulosDesbloqueados: data.titulosDesbloqueados || [],
                
                // Loja
                recompensas: data.recompensas || [],
                inventario: data.inventario || []
            };
        } else {
            // Dados iniciais
            this.data = {
                nome: '',
                apelido: '',
                nivel: 1,
                exp: 0,
                expNecessaria: 100,
                rank: 'F',
                classe: null,
                classeStage: 0,
                titulo: null,
                atributos: {
                    forca: 0,
                    inteligencia: 0,
                    agilidade: 0,
                    vitalidade: 0,
                    resistencia: 0,
                    percepcao: 0
                },
                hp: 1000,
                hpMax: 1000,
                mp: 500,
                mpMax: 500,
                lastMpRecovery: Date.now(),
                moedas: 0,
                treinos: [],
                treinosSemana: [],
                estudos: [],
                treinoMeta: 5,
                estudoMeta: 10,
                ultimaSemanaResistencia: null,
                habitos: [],
                missoes: [],
                habilidades: [],
                runas: [],
                penalidades: [],
                notificacoes: [],
                configurado: false,
                classeSelecionada: false,
                recompensas: [],
                inventario: [],
                titulosDesbloqueados: []
            };
        }
    }

    // Salvar dados no localStorage
    saveData() {
        localStorage.setItem('gameSystemData', JSON.stringify(this.data));
    }

    // Inicializar sistema
    init() {
        // Verificar se precisa de configuração inicial
        // Considera configurado se: flag configurado=true OU se nome e apelido já existem (não vazios)
        const nomeValido = this.data.nome && String(this.data.nome).trim().length > 0;
        const apelidoValido = this.data.apelido && String(this.data.apelido).trim().length > 0;
        const isConfigured = this.data.configurado === true || (nomeValido && apelidoValido);
        
        // Debug: verificar valores
        console.log('🔍 Debug Configuração:', {
            configurado: this.data.configurado,
            nome: this.data.nome,
            apelido: this.data.apelido,
            nomeValido,
            apelidoValido,
            isConfigured
        });
        
        // Garantir que o modal está escondido se já estiver configurado
        const initialConfigModal = document.getElementById('initialConfigModal');
        if (initialConfigModal) {
            if (isConfigured) {
                // Se já está configurado, esconder o modal
                initialConfigModal.classList.add('hidden');
            } else {
                // Se não está configurado, mostrar o modal
                this.showInitialConfig();
                return;
            }
        }

        // Verificar se precisa selecionar classe (nível 50)
        if (this.data.nivel >= 50 && !this.data.classeSelecionada && !this.data.classe) {
            this.showClassSelection();
            return;
        }

        // Inicializar recuperação de MP
        this.initMpRecovery();
        
        // Atualizar interface
        this.updateAllDisplays();
        
        // Verificar análise semanal (domingo)
        this.checkWeeklyAnalysis();

        // Verificar penalidades diárias baseadas em hábitos
        this.checkDailyPenalties();
        this.checkTitles();
    }

    // Mostrar configuração inicial
    showInitialConfig() {
        const modal = document.getElementById('initialConfigModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Mostrar seleção de classe
    showClassSelection() {
        const modal = document.getElementById('classSelectionModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Inicializar recuperação de MP
    initMpRecovery() {
        setInterval(() => {
            if (this.data.mp < this.data.mpMax) {
                const now = Date.now();
                const minutesPassed = Math.floor((now - this.data.lastMpRecovery) / 60000);
                
                if (minutesPassed >= 10) {
                    // Recuperar 1 MP a cada 10 minutos
                    const recovery = Math.floor(minutesPassed / 10);
                    this.data.mp = Math.min(this.data.mpMax, this.data.mp + recovery);
                    this.data.lastMpRecovery = now - ((minutesPassed % 10) * 60000); // Ajustar para não perder minutos
                    this.updateMpDisplay();
                    this.saveData();
                }
            }
        }, 60000); // Verificar a cada minuto
    }

    // ============================================
    // SISTEMA DE ATRIBUTOS
    // ============================================

    // Adicionar força (treino concluído)
    addForca(value = 0.15) {
        this.data.atributos.forca += value;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Adicionar inteligência (hora de estudo)
    addInteligencia(hours = 1) {
        this.data.atributos.inteligencia += hours * 0.15;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Adicionar agilidade (KM corrido)
    addAgilidade(km = 1) {
        this.data.atributos.agilidade += km * 0.10;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Adicionar vitalidade (todos hábitos concluídos)
    addVitalidade() {
        this.data.atributos.vitalidade += 0.10;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Adicionar resistência (5 dias de treino na semana)
    addResistencia() {
        this.data.atributos.resistencia += 0.30;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Adicionar percepção (hora de estudo de psicologia)
    addPercepcao(hours = 1) {
        this.data.atributos.percepcao += hours * 0.30;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Obter atributo como inteiro (para exibição)
    getAttributeInt(attr) {
        return Math.floor(this.data.atributos[attr]);
    }

    // ============================================
    // SISTEMA DE NÍVEL E EXP
    // ============================================

    // Adicionar EXP
    addExp(amount) {
        this.data.exp += amount;
        
        // Verificar level up
        while (this.data.exp >= this.data.expNecessaria) {
            this.levelUp();
        }
        
        this.updateExpDisplay();
        this.saveData();
    }

    // Subir de nível
    levelUp() {
        this.data.exp -= this.data.expNecessaria;
        this.data.nivel++;
        
        // Calcular EXP necessária para próximo nível (20% a mais)
        this.data.expNecessaria = Math.floor(this.data.expNecessaria * 1.2);
        
        // Atualizar HP e MP (20% a mais)
        this.data.hpMax = Math.floor(this.data.hpMax * 1.2);
        this.data.hp = this.data.hpMax; // Restaurar HP ao subir de nível
        this.data.mpMax = Math.floor(this.data.mpMax * 1.2);
        this.data.mp = this.data.mpMax; // Restaurar MP ao subir de nível
        
        // Verificar evolução de classe (a cada 25 níveis)
        this.checkClassEvolution();
        
        // Verificar títulos
        this.checkTitles();
        
        // Verificar rank
        this.checkRank();
        
        // Adicionar notificação
        this.addNotification('LEVEL UP!', `Você subiu para o nível ${this.data.nivel}!`, 'levelup');
        
        this.updateAllDisplays();
        this.saveData();
    }

    // Verificar evolução de classe
    checkClassEvolution() {
        if (!this.data.classe) return;
        
        const newStage = Math.floor((this.data.nivel - 50) / 25);
        if (newStage > this.data.classeStage && newStage < 10) {
            this.data.classeStage = newStage;
            const classeData = CLASSES[this.data.classe];
            const evolutionName = classeData.evolutions[newStage];
            
            this.addNotification('EVOLUÇÃO!', `Sua classe evoluiu para: ${evolutionName}!`, 'evolution');
            this.updateAllDisplays();
        }
    }

    // Verificar rank
    checkRank() {
        const currentRankIndex = RANKS.indexOf(this.data.rank);
        if (currentRankIndex === -1 || currentRankIndex >= RANKS.length - 1) return;
        
        // Calcular nível necessário para próximo rank
        let levelsNeeded = 10;
        let totalLevels = 1; // Começa no nível 1
        
        for (let i = 0; i < currentRankIndex; i++) {
            totalLevels += levelsNeeded;
            levelsNeeded = Math.floor(levelsNeeded * 1.2);
        }
        
        // Nível necessário para o próximo rank
        const levelForNextRank = totalLevels + levelsNeeded;
        
        if (this.data.nivel >= levelForNextRank) {
            this.data.rank = RANKS[currentRankIndex + 1];
            this.addNotification('RANK UP!', `Seu rank subiu para ${this.data.rank}!`, 'rankup');
            this.updateAllDisplays();
        }
    }

    // ============================================
    // SISTEMA DE HP E MP
    // ============================================

    // Perder HP
    loseHp(amount = 200) {
        this.data.hp = Math.max(0, this.data.hp - amount);
        
        if (this.data.hp === 0) {
            this.addNotification('MORTE!', 'Você morreu! Seu HP chegou a zero.', 'death');
        }
        
        this.updateHpDisplay();
        this.saveData();
    }

    // Recuperar HP (poção)
    recoverHp(amount) {
        this.data.hp = Math.min(this.data.hpMax, this.data.hp + amount);
        this.updateHpDisplay();
        this.saveData();
    }

    // Usar MP (runa)
    useMp(amount) {
        if (this.data.mp >= amount) {
            this.data.mp -= amount;
            this.updateMpDisplay();
            this.saveData();
            return true;
        }
        return false;
    }

    // ============================================
    // SISTEMA DE MOEDAS
    // ============================================

    // Adicionar moedas
    addMoedas(amount) {
        this.data.moedas += amount;
        this.updateMoedasDisplay();
        this.addNotification('MOEDAS!', `Você ganhou ${amount.toLocaleString('pt-BR')} G!`, 'coins');
        this.saveData();
    }

    // Gastar moedas
    spendMoedas(amount) {
        if (this.data.moedas >= amount) {
            this.data.moedas -= amount;
            this.updateMoedasDisplay();
            this.saveData();
            return true;
        }
        return false;
    }

    // ============================================
    // SISTEMA DE INVENTÁRIO
    // ============================================

    // Adicionar item ao inventário
    addToInventory(item, quantity = 1) {
        if (!Array.isArray(this.data.inventario)) {
            this.data.inventario = [];
        }

        // Procurar se o item já existe no inventário (mesmo nome e tipo)
        const existingItem = this.data.inventario.find(i => 
            i.name === item.name && i.type === item.type
        );

        if (existingItem) {
            // Se já existe, apenas aumentar a quantidade
            existingItem.quantity += quantity;
        } else {
            // Se não existe, adicionar novo item
            this.data.inventario.push({
                ...item,
                quantity: quantity
            });
        }

        this.saveData();
    }

    // Gastar moedas
    spendMoedas(amount) {
        if (this.data.moedas >= amount) {
            this.data.moedas -= amount;
            this.updateMoedasDisplay();
            this.saveData();
            return true;
        }
        return false;
    }

    // Análise semanal (domingo)
    checkWeeklyAnalysis() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = domingo
        
        if (dayOfWeek === 0) {
            const lastAnalysis = localStorage.getItem('lastWeeklyAnalysis');
            const todayStr = today.toDateString();
            
            if (lastAnalysis !== todayStr) {
                this.performWeeklyAnalysis();
                localStorage.setItem('lastWeeklyAnalysis', todayStr);
            }
        }
    }

    // Realizar análise semanal
    performWeeklyAnalysis() {
        if (!this.data.classe) {
            return; // Sem classe, sem bônus
        }
        
        const classeData = CLASSES[this.data.classe];
        let moedas = 0;
        
        // Verificar requisitos baseado na classe
        if (this.data.classe === 'Necromante') {
            // Necromante: precisa de tudo (treinos, estudos, hábitos)
            const treinosOk = this.data.treinosSemana.length >= 5;
            const habitosOk = this.checkAllHabitsCompleted();
            const estudosOk = this.checkStudiesCompleted();
            
            if (treinosOk && habitosOk && estudosOk) {
                moedas = Math.floor(Math.random() * (classeData.coinMultiplier.max - classeData.coinMultiplier.min + 1)) + classeData.coinMultiplier.min;
            }
        } else {
            // Outras classes: requisitos específicos
            const bonusAttr = classeData.bonusAttribute;
            let requirementMet = false;
            
            if (bonusAttr === 'resistencia') {
                requirementMet = this.data.treinosSemana.length >= 5;
            } else if (bonusAttr === 'forca') {
                requirementMet = this.data.treinosSemana.length >= 5;
            } else if (bonusAttr === 'inteligencia') {
                requirementMet = this.checkStudiesCompleted();
            } else if (bonusAttr === 'agilidade') {
                requirementMet = this.data.treinosSemana.some(t => t.tipo === 'Cardio');
            } else if (bonusAttr === 'vitalidade') {
                requirementMet = this.checkAllHabitsCompleted();
            } else if (bonusAttr === 'percepcao') {
                requirementMet = this.checkPsychologyStudies();
            }
            
            if (requirementMet) {
                moedas = Math.floor(Math.random() * (classeData.coinMultiplier.max - classeData.coinMultiplier.min + 1)) + classeData.coinMultiplier.min;
            }
        }
        
        if (moedas > 0) {
            this.addMoedas(moedas);
            this.addNotification('ANÁLISE SEMANAL', `Você recebeu ${moedas.toLocaleString('pt-BR')} G pela análise semanal!`, 'weekly');
        }
    }

    // Verificar se todos os hábitos foram completados (baseado em recorrência)
    checkAllHabitsCompleted() {
        const todayKey = getTodayKey();
        if (!Array.isArray(this.data.habitos) || this.data.habitos.length === 0) return false;
        return this.data.habitos.every(habito => {
            if (!habito.completions || !Array.isArray(habito.completions)) return false;
            return habito.completions.includes(todayKey);
        });
    }

    // Verificar se estudos foram completados
    checkStudiesCompleted() {
        if (!Array.isArray(this.data.estudos) || this.data.estudos.length === 0) return false;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

        const totalMinutes = this.data.estudos
            .filter(e => {
                const d = new Date(e.data);
                return d >= sevenDaysAgo && d <= now;
            })
            .reduce((sum, e) => sum + (e.minutos || 0), 0);

        // Considera estudos "completos" se houve pelo menos 180 minutos (3h) na semana
        return totalMinutes >= 180;
    }

    // Verificar estudos de psicologia
    checkPsychologyStudies() {
        if (!Array.isArray(this.data.estudos) || this.data.estudos.length === 0) return false;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

        const totalMinutes = this.data.estudos
            .filter(e => {
                if (e.tipo !== 'psicologia') return false;
                const d = new Date(e.data);
                return d >= sevenDaysAgo && d <= now;
            })
            .reduce((sum, e) => sum + (e.minutos || 0), 0);

        // Considera "estudos de psicologia completos" se houve pelo menos 120 minutos (2h) na semana
        return totalMinutes >= 120;
    }

    // ============================================
    // SISTEMA DE HABILIDADES
    // ============================================

    // Calcular XP necessário para um level
    getSkillXpForLevel(level) {
        if (level <= 1) return 500;
        let xp = 500;
        for (let i = 2; i <= level; i++) {
            xp = Math.floor(xp * 1.2); // +20% a cada level
        }
        return xp;
    }

    // Adicionar XP a uma habilidade (por nome)
    addSkillXp(skillName, hours, skillType = 'estudo') {
        if (!Array.isArray(this.data.habilidades)) {
            this.data.habilidades = [];
        }

        // Buscar habilidade por nome e tipo (case-insensitive)
        let skill = this.data.habilidades.find(h => 
            h.nome && h.nome.toUpperCase() === skillName.toUpperCase() && h.tipo === skillType
        );

        if (!skill) {
            // Criar habilidade se não existir
            skill = {
                id: Date.now(),
                nome: skillName.toUpperCase(),
                tipo: skillType,
                level: 1,
                xp: 0,
                xpNextLevel: 500,
                atributoVinculado: skillType === 'combate' ? 'forca' : null,
                runaId: null,
                runaDesbloqueada: false
            };
            this.data.habilidades.push(skill);
        }

        // Adicionar XP (10 XP por hora)
        const xpGained = Math.floor(hours * 10);
        skill.xp += xpGained;

        // Verificar level up
        while (skill.xp >= skill.xpNextLevel) {
            skill.xp -= skill.xpNextLevel;
            const oldLevel = skill.level;
            skill.level++;
            skill.xpNextLevel = this.getSkillXpForLevel(skill.level);
            
            // Notificação de level up
            this.addNotification(
                'HABILIDADE UP!',
                `${skill.nome} subiu para o nível ${skill.level}!`,
                'evolution'
            );
            
            // Verificar se chegou no level 5 e desbloquear runa
            if (skill.level === 5 && skill.runaId && !skill.runaDesbloqueada) {
                const runa = (this.data.runas || []).find(r => r.id === skill.runaId);
                if (runa) {
                    runa.desbloqueada = true;
                    skill.runaDesbloqueada = true;
                    this.addNotification(
                        'RUNA DESBLOQUEADA!',
                        `Runa "${runa.nome}" foi desbloqueada! Use-a na seção de Runas.`,
                        'evolution'
                    );
                    this.checkTitles();
                }
            }
        }

        this.saveData();
        return skill;
    }

    // Criar/cadastrar habilidade manualmente
    createSkill(nome, tipo = 'estudo', atributoVinculado = null, runeData = null) {
        if (!Array.isArray(this.data.habilidades)) {
            this.data.habilidades = [];
        }

        // Verificar se já existe
        const exists = this.data.habilidades.some(h => 
            h.nome && h.nome.toUpperCase() === nome.toUpperCase()
        );

        if (exists) {
            return null; // Já existe
        }

        const skillId = Date.now();
        const skill = {
            id: skillId,
            nome: nome.toUpperCase(),
            tipo: tipo,
            level: 1,
            xp: 0,
            xpNextLevel: 500,
            atributoVinculado: atributoVinculado,
            runaId: null, // Será preenchido se runaData existir
            runaDesbloqueada: false
        };

        // Criar runa se dados foram fornecidos
        if (runeData && runeData.nome) {
            if (!Array.isArray(this.data.runas)) {
                this.data.runas = [];
            }

            const runa = {
                id: Date.now() + 1,
                skillId: skillId,
                nome: runeData.nome.toUpperCase(),
                descricao: runeData.descricao || '',
                mpCost: runeData.mpCost || 50,
                duration: runeData.duration || 60, // em minutos
                buffType: runeData.buffType || 'exp_multiplier',
                buffValue: runeData.buffValue || 20,
                desbloqueada: false, // Desbloqueia quando skill chegar no level 5
                ativa: false,
                activeUntil: null
            };

            this.data.runas.push(runa);
            skill.runaId = runa.id;
        }

        this.data.habilidades.push(skill);
        this.saveData();
        return skill;
    }

    // ============================================
    // SISTEMA DE PENALIDADES DIÁRIAS
    // ============================================

    checkDailyPenalties() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Sempre avaliamos até o dia de ontem
        const yesterday = new Date(today.getTime() - 86400000);
        const yesterdayKey = getDateKey(yesterday);

        // Se for o primeiro dia de uso, não há dia anterior para penalizar
        const firstRunMarker = localStorage.getItem('penaltySystemInitialized');
        if (!firstRunMarker) {
            localStorage.setItem('penaltySystemInitialized', 'true');
            localStorage.setItem('lastPenaltyCheckDate', yesterdayKey);
            return;
        }

        const lastCheckStr = localStorage.getItem('lastPenaltyCheckDate');
        if (lastCheckStr && lastCheckStr >= yesterdayKey) {
            // Já avaliamos até ontem
            return;
        }

        let startDate;
        if (lastCheckStr) {
            // Começa no dia seguinte ao último dia verificado
            startDate = new Date(lastCheckStr);
            startDate.setHours(0, 0, 0, 0);
            startDate = new Date(startDate.getTime() + 86400000);
        } else {
            // Sem histórico: começa diretamente em ontem
            startDate = new Date(yesterday.getTime());
        }

        for (let d = new Date(startDate.getTime()); d <= yesterday; d.setTime(d.getTime() + 86400000)) {
            const dateKey = getDateKey(d);
            this.evaluateHabitsForDate(dateKey, new Date(d.getTime()));
        }

        localStorage.setItem('lastPenaltyCheckDate', yesterdayKey);
        this.updatePenaltiesDisplay();
        this.saveData();
    }

    evaluateHabitsForDate(dateKey, dateObj) {
        if (!Array.isArray(this.data.habitos) || this.data.habitos.length === 0) return;

        const habitsForThatDay = this.data.habitos.filter(h => shouldTaskAppearToday(h, dateObj));

        // Se não havia hábitos programados para aquele dia, nada a penalizar
        if (habitsForThatDay.length === 0) return;

        const incompleteHabits = habitsForThatDay.filter(h => {
            if (!h.completions || !Array.isArray(h.completions)) return true;
            return !h.completions.includes(dateKey);
        });

        if (incompleteHabits.length > 0) {
            this.applyPenaltyForDate(dateKey, incompleteHabits.map(h => h.nome));
        }
    }

    applyPenaltyForDate(dateKey, incompleteHabits = []) {
        if (!Array.isArray(this.data.penalidades)) {
            this.data.penalidades = [];
        }

        // Evitar penalidade duplicada para a mesma data
        const alreadyPenalized = this.data.penalidades.some(p => p.dateKey === dateKey && p.type === 'habitos_nao_concluidos');
        if (alreadyPenalized) return;

        // Definição simples de penalidade: perda fixa de HP
        const hpLoss = 200;

        this.loseHp(hpLoss);

        const penalty = {
            id: Date.now(),
            dateKey,
            type: 'habitos_nao_concluidos',
            hpLoss,
            coinsLoss: 0,
            description: 'Você não concluiu todos os hábitos deste dia.',
            incompleteHabits: incompleteHabits,
            isManual: false
        };

        this.data.penalidades.push(penalty);

        const [year, month, day] = dateKey.split('-');
        const formatted = `${day}/${month}/${year}`;

        this.addNotification(
            'PENALIDADE!',
            `Você não concluiu todos os hábitos do dia ${formatted}. HP -${hpLoss}.`,
            'death'
        );
    }

    applyManualPenalty(hpLoss, description, reason = '') {
        if (!Array.isArray(this.data.penalidades)) {
            this.data.penalidades = [];
        }

        const today = new Date();
        const dateKey = getDateKey(today);

        this.loseHp(hpLoss);

        const penalty = {
            id: Date.now(),
            dateKey,
            type: 'manual',
            hpLoss,
            coinsLoss: 0,
            description: description || 'Penalidade manual aplicada.',
            reason: reason,
            incompleteHabits: [],
            isManual: true
        };

        this.data.penalidades.push(penalty);
        this.saveData();
        this.updatePenaltiesDisplay();

        this.addNotification(
            'PENALIDADE MANUAL!',
            `${description || 'Penalidade aplicada'}. HP -${hpLoss}.`,
            'death'
        );
    }

    // ============================================
    // SISTEMA DE NOTIFICAÇÕES
    // ============================================

    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now(),
            title: title,
            message: message,
            type: type,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toISOString()
        };
        
        this.data.notificacoes.unshift(notification);
        
        // Não há limite - manter todo o histórico
        
        // Mostrar popup no centro da tela
        this.showNotificationPopup(notification);
        
        this.updateNotificationsDisplay();
        this.saveData();
    }

    showNotificationPopup(notification) {
        // Criar popup de notificação no centro da tela
        const popup = document.createElement('div');
        popup.className = 'notification-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            padding: 20px;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
            animation: notificationPopupIn 0.3s ease-out;
        `;

        const icon = this.getNotificationIcon(notification.type);
        const iconColors = {
            'info': '#44aaff',
            'levelup': '#44ff44',
            'rankup': '#ffaa44',
            'evolution': '#ff44ff',
            'coins': '#ffd700',
            'weekly': '#44aaff',
            'death': '#ff4444'
        };
        const iconColor = iconColors[notification.type] || '#ffffff';

        popup.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <div style="font-size: 32px; color: ${iconColor}; text-shadow: 0 0 10px ${iconColor};">
                    ${icon}
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: bold; color: #ffffff; margin-bottom: 5px;">
                        ${notification.title}
                    </div>
                    <div style="font-size: 13px; color: rgba(255, 255, 255, 0.8);">
                        ${notification.message}
                    </div>
                </div>
                <button class="notification-popup-close" style="background: none; border: none; color: rgba(255,255,255,0.6); font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
            <div style="font-size: 11px; color: rgba(255, 255, 255, 0.5); text-align: right;">
                ${notification.time}
            </div>
        `;

        document.body.appendChild(popup);

        // Adicionar animação CSS
        if (!document.getElementById('notificationPopupStyle')) {
            const style = document.createElement('style');
            style.id = 'notificationPopupStyle';
            style.textContent = `
                @keyframes notificationPopupIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
                @keyframes notificationPopupOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                }
                .notification-popup-close:hover {
                    color: #ffffff !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Fechar popup
        const closePopup = () => {
            popup.style.animation = 'notificationPopupOut 0.3s ease-out';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        };

        popup.querySelector('.notification-popup-close').addEventListener('click', closePopup);

        // Fechar automaticamente após 5 segundos
        setTimeout(closePopup, 5000);
    }

    // ============================================
    // ATUALIZAÇÃO DE DISPLAY
    // ============================================

    updateAllDisplays() {
        this.updateStatusDisplay();
        this.updateAttributesDisplay();
        this.updateHpDisplay();
        this.updateMpDisplay();
        this.updateExpDisplay();
        this.updateMoedasDisplay();
        this.updateHexagonChart();
        this.updatePenaltiesDisplay();
        if (typeof updateSkillsDisplay === 'function') {
            updateSkillsDisplay();
        }
        if (typeof updateRunesDisplay === 'function') {
            updateRunesDisplay();
        }
        this.updateTitlesDisplay();
        this.updateProgressInfo();
    }

    updateProgressInfo() {
        const progressInfo = document.getElementById('progressInfo');
        if (!progressInfo) return;

        // 1. XP necessário para próximo nível
        const expAtual = this.data.exp;
        const expNecessaria = this.data.expNecessaria;
        const expRestante = Math.max(0, expNecessaria - expAtual);
        const expPercentage = expNecessaria > 0 ? (expAtual / expNecessaria) * 100 : 0;

        // 2. Próxima evolução de classe
        let nextEvolutionInfo = 'NENHUMA CLASSE SELECIONADA';
        if (this.data.classe) {
            const classeData = CLASSES[this.data.classe];
            const currentStage = this.data.classeStage || 0;
            const nextStage = currentStage + 1;
            
            if (nextStage < classeData.evolutions.length) {
                const nextEvolutionName = classeData.evolutions[nextStage];
                // Evoluções acontecem a cada 25 níveis após o nível 50
                const levelForNextEvolution = 50 + (nextStage * 25);
                const levelsNeeded = Math.max(0, levelForNextEvolution - this.data.nivel);
                nextEvolutionInfo = `${nextEvolutionName} (Nível ${levelForNextEvolution})`;
            } else {
                nextEvolutionInfo = 'EVOLUÇÃO MÁXIMA ALCANÇADA';
            }
        }

        // 3. Progresso até próximo rank
        const currentRankIndex = RANKS.indexOf(this.data.rank);
        let nextRankInfo = 'RANK MÁXIMO ALCANÇADO';
        let levelsNeededForRank = 0;
        let levelForNextRank = 0;
        
        if (currentRankIndex >= 0 && currentRankIndex < RANKS.length - 1) {
            const nextRank = RANKS[currentRankIndex + 1];
            
            // Calcular nível necessário para próximo rank (mesma lógica do checkRank)
            let levelsNeeded = 10;
            let totalLevels = 1;
            
            for (let i = 0; i < currentRankIndex; i++) {
                totalLevels += levelsNeeded;
                levelsNeeded = Math.floor(levelsNeeded * 1.2);
            }
            
            levelForNextRank = totalLevels + levelsNeeded;
            levelsNeededForRank = Math.max(0, levelForNextRank - this.data.nivel);
            
            nextRankInfo = `${nextRank} (Nível ${levelForNextRank})`;
        }

        const rankPercentage = levelForNextRank > 0 ? Math.min(100, (this.data.nivel / levelForNextRank) * 100) : 0;

        progressInfo.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 8px;">
                    PRÓXIMA EVOLUÇÃO DE CLASSE
                </div>
                <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 10px;">
                    <div style="font-size: 13px; color: rgba(255,255,255,0.9); margin-bottom: 5px;">
                        ${nextEvolutionInfo.includes('NENHUMA') || nextEvolutionInfo.includes('MÁXIMA') 
                            ? nextEvolutionInfo 
                            : nextEvolutionInfo.split(' (')[0]}
                    </div>
                    ${!nextEvolutionInfo.includes('NENHUMA') && !nextEvolutionInfo.includes('MÁXIMA') ? `
                        <div style="font-size: 11px; color: rgba(255,255,255,0.7);">
                            ${nextEvolutionInfo.split('(')[1] ? `Nível necessário: ${nextEvolutionInfo.split('(')[1].replace(')', '')}` : ''}
                            ${this.data.classe && this.data.nivel < 50 + ((this.data.classeStage || 0) + 1) * 25 
                                ? ` | Faltam ${Math.max(0, (50 + ((this.data.classeStage || 0) + 1) * 25) - this.data.nivel)} níveis` 
                                : ''}
                        </div>
                    ` : ''}
                </div>
            </div>

            <div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 8px;">
                    PRÓXIMO RANK
                </div>
                ${nextRankInfo.includes('MÁXIMO') ? `
                    <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 10px;">
                        <div style="font-size: 13px; color: rgba(255,255,255,0.9);">
                            ${nextRankInfo}
                        </div>
                    </div>
                ` : `
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 11px; color: rgba(255,255,255,0.7);">
                            ${levelsNeededForRank > 0 ? `Faltam ${levelsNeededForRank} níveis` : ''}
                        </div>
                        <div class="bar-content">
                            <div class="bar-wrapper">
                                <div class="bar-fill exp-bar" style="width: ${rankPercentage}%;"></div>
                            </div>
                            <div class="bar-value" style="text-align: right; margin-top: 4px; font-size: 12px; color: rgba(255,255,255,0.9);">
                                Nível ${this.data.nivel} / ${levelForNextRank}
                            </div>
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    updateStatusDisplay() {
        // Atualizar informações básicas
        const nomeEl = document.querySelector('#statusSection .char-info-details .char-info-line:nth-child(1) .char-value');
        const apelidoEl = document.querySelector('#statusSection .char-info-details .char-info-line:nth-child(2) .char-value');
        const classeEl = document.querySelector('#statusSection .char-info-details .char-info-line:nth-child(3) .char-value');
        const levelText = document.getElementById('levelText');
        const rankText = document.getElementById('rankText');
        const currentTitleText = document.getElementById('currentTitleText');
        const tituloEl = document.querySelector('#statusSection .section-content .section-text');
        
        if (nomeEl) nomeEl.textContent = this.data.nome || 'NÃO DEFINIDO';
        if (apelidoEl) apelidoEl.textContent = this.data.apelido || 'NÃO DEFINIDO';
        if (classeEl) classeEl.textContent = this.data.classe ? this.getCurrentClassEvolution() : 'NENHUMA';
        if (levelText) levelText.textContent = `${this.data.nivel}`;
        if (rankText) rankText.textContent = this.data.rank;
        if (currentTitleText) {
            if (this.data.titulo) {
                const titleData = TITLES.find(t => t.id === this.data.titulo);
                currentTitleText.textContent = (titleData ? titleData.nome : this.data.titulo).toUpperCase();
            } else {
                currentTitleText.textContent = 'NENHUM';
            }
        }
        if (tituloEl) tituloEl.textContent = this.data.titulo || 'NENHUM';
    }

    getCurrentClassEvolution() {
        if (!this.data.classe) return 'NENHUMA';
        const classeData = CLASSES[this.data.classe];
        return classeData.evolutions[this.data.classeStage] || classeData.name;
    }

    updateAttributesDisplay() {
        const attrs = ['forca', 'inteligencia', 'agilidade', 'vitalidade', 'resistencia', 'percepcao'];
        const labels = ['FORÇA', 'INTELIGÊNCIA', 'AGILIDADE', 'VITALIDADE', 'RESISTÊNCIA', 'PERCEPÇÃO'];
        
        attrs.forEach((attr, index) => {
            const elements = document.querySelectorAll(`[data-attr="${attr}"]`);
            elements.forEach(el => {
                if (el.classList.contains('attr-value')) {
                    el.textContent = this.getAttributeInt(attr);
                } else if (el.classList.contains('attr-label')) {
                    el.textContent = labels[index] + ' +';
                }
            });
        });
    }

    updateHpDisplay() {
        const hpBar = document.getElementById('hpBar');
        const hpText = document.getElementById('hpText');
        
        if (hpBar) {
            const percentage = (this.data.hp / this.data.hpMax) * 100;
            hpBar.style.width = percentage + '%';
        }
        
        if (hpText) {
            hpText.textContent = `${Math.floor(this.data.hp)}/${Math.floor(this.data.hpMax)}`;
        }
    }

    updateMpDisplay() {
        const mpBar = document.getElementById('mpBar');
        const mpText = document.getElementById('mpText');
        
        if (mpBar) {
            const percentage = (this.data.mp / this.data.mpMax) * 100;
            mpBar.style.width = percentage + '%';
        }
        
        if (mpText) {
            mpText.textContent = `${Math.floor(this.data.mp)}/${Math.floor(this.data.mpMax)}`;
        }
    }

    updateExpDisplay() {
        const expBar = document.getElementById('expBar');
        const expText = document.getElementById('expText');
        const levelText = document.getElementById('levelText');
        
        if (expBar) {
            const percentage = (this.data.exp / this.data.expNecessaria) * 100;
            expBar.style.width = percentage + '%';
        }
        
        if (expText) {
            expText.textContent = `${this.data.exp}/${this.data.expNecessaria}`;
        }
        
        if (levelText) {
            levelText.textContent = `${this.data.nivel}`;
        }
        
        // Atualizar título atual
        const currentTitleText = document.getElementById('currentTitleText');
        if (currentTitleText) {
            if (this.data.titulo) {
                const titleData = TITLES.find(t => t.id === this.data.titulo);
                currentTitleText.textContent = (titleData ? titleData.nome : this.data.titulo).toUpperCase();
            } else {
                currentTitleText.textContent = 'NENHUM';
            }
        }
    }

    updateMoedasDisplay() {
        const elements = document.querySelectorAll('.shop-currency-amount, #modalBalance');
        elements.forEach(el => {
            el.textContent = this.data.moedas.toLocaleString('pt-BR');
        });
    }

    updateNotificationsDisplay() {
        const container = document.querySelector('#notificationSection .notification-container');
        if (!container) return;

        const notificacoes = Array.isArray(this.data.notificacoes) ? this.data.notificacoes : [];
        const total = notificacoes.length;

        // Calcular estatísticas por tipo
        const statsByType = {};
        notificacoes.forEach(notif => {
            statsByType[notif.type] = (statsByType[notif.type] || 0) + 1;
        });

        // Filtro selecionado (será gerenciado pelo JavaScript)
        const filterType = container.dataset.filterType || 'all';

        // Filtrar notificações
        let filtered = notificacoes;
        if (filterType !== 'all') {
            filtered = notificacoes.filter(n => n.type === filterType);
        }

        // Ordenar por data (mais recente primeiro)
        filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 15px;">
                    <div class="stat-item" style="background: rgba(68, 170, 255, 0.1); border: 1px solid rgba(68, 170, 255, 0.3); padding: 10px; border-radius: 4px;">
                        <span class="label" style="font-size: 11px;">TOTAL:</span>
                        <span class="value" style="font-size: 18px; color: #44aaff;">${total}</span>
                    </div>
                    ${Object.keys(statsByType).map(type => {
                        const count = statsByType[type];
                        const typeNames = {
                            'info': 'INFO',
                            'levelup': 'LEVEL UP',
                            'rankup': 'RANK UP',
                            'evolution': 'EVOLUÇÃO',
                            'coins': 'MOEDAS',
                            'weekly': 'SEMANAL',
                            'death': 'MORTE'
                        };
                        const typeColors = {
                            'info': '#44aaff',
                            'levelup': '#44ff44',
                            'rankup': '#ffaa44',
                            'evolution': '#ff44ff',
                            'coins': '#ffd700',
                            'weekly': '#44aaff',
                            'death': '#ff4444'
                        };
                        return `
                            <div class="stat-item" style="background: rgba(68, 170, 255, 0.1); border: 1px solid rgba(68, 170, 255, 0.3); padding: 10px; border-radius: 4px;">
                                <span class="label" style="font-size: 11px;">${typeNames[type] || type}:</span>
                                <span class="value" style="font-size: 18px; color: ${typeColors[type] || '#ffffff'};">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="section-header">
                    <span class="section-header-text">&lt;FILTROS&gt;</span>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'all' ? 'submit-btn' : ''}" data-filter="all">TODAS</button>
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'info' ? 'submit-btn' : ''}" data-filter="info">INFO</button>
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'levelup' ? 'submit-btn' : ''}" data-filter="levelup">LEVEL UP</button>
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'rankup' ? 'submit-btn' : ''}" data-filter="rankup">RANK UP</button>
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'evolution' ? 'submit-btn' : ''}" data-filter="evolution">EVOLUÇÃO</button>
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'coins' ? 'submit-btn' : ''}" data-filter="coins">MOEDAS</button>
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'weekly' ? 'submit-btn' : ''}" data-filter="weekly">SEMANAL</button>
                    <button class="form-btn task-small-btn filter-notif-btn ${filterType === 'death' ? 'submit-btn' : ''}" data-filter="death">MORTE</button>
                </div>
            </div>

            <div class="notification-list" style="margin-top: 15px;">
                ${filtered.length > 0 ? filtered.map(notif => {
                    const iconColors = {
                        'info': '#44aaff',
                        'levelup': '#44ff44',
                        'rankup': '#ffaa44',
                        'evolution': '#ff44ff',
                        'coins': '#ffd700',
                        'weekly': '#44aaff',
                        'death': '#ff4444'
                    };
                    const iconColor = iconColors[notif.type] || '#ffffff';
                    return `
                        <div class="notification-window" style="position: relative;">
                            <button class="notification-delete-btn" onclick="deleteNotification(${notif.id})" style="position: absolute; top: 5px; right: 5px; background: rgba(255, 68, 68, 0.3); border: 1px solid rgba(255, 68, 68, 0.5); color: #ff4444; border-radius: 3px; width: 20px; height: 20px; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0;">×</button>
                            <div class="notification-content-section">
                                <div class="notification-title-section">
                                    <div class="notification-title-text">${notif.title}</div>
                                    <div class="notification-icon-frame" style="border-color: ${iconColor};">
                                        <div class="notification-icon" style="color: ${iconColor}; text-shadow: 0 0 5px ${iconColor};">
                                            ${this.getNotificationIcon(notif.type)}
                                        </div>
                                    </div>
                                </div>
                                <div class="notification-message">${notif.message}</div>
                                <div class="notification-time">${notif.time}</div>
                            </div>
                        </div>
                    `;
                }).join('') : '<div class="section-text">Nenhuma notificação encontrada.</div>'}
            </div>
        `;

        // Salvar filtro atual
        container.dataset.filterType = filterType;

        // Re-adicionar event listeners para filtros
        setTimeout(() => {
            document.querySelectorAll('#notificationSection .filter-notif-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const filter = this.dataset.filter;
                    const container = document.querySelector('#notificationSection .notification-container');
                    if (container) {
                        container.dataset.filterType = filter;
                    }
                    gameSystem.updateNotificationsDisplay();
                });
            });
        }, 100);
    }

    deleteNotification(notificationId) {
        if (!Array.isArray(this.data.notificacoes)) return;
        
        const index = this.data.notificacoes.findIndex(n => n.id === notificationId);
        if (index >= 0) {
            this.data.notificacoes.splice(index, 1);
            this.saveData();
            this.updateNotificationsDisplay();
        }
    }

    getNotificationIcon(type) {
        const icons = {
            'info': '!',
            'levelup': '↑',
            'rankup': '★',
            'evolution': '⚡',
            'coins': 'G',
            'weekly': '📊',
            'death': '💀'
        };
        return icons[type] || '!';
    }

    updatePenaltiesDisplay() {
        const container = document.querySelector('#penalitySection .penality-info');
        if (!container) return;

        const penalidades = Array.isArray(this.data.penalidades) ? this.data.penalidades : [];
        const total = penalidades.length;
        
        // Ordenar por data (mais recente primeiro)
        const sortedPenalties = [...penalidades].sort((a, b) => {
            const dateA = new Date(a.dateKey.split('-').reverse().join('-'));
            const dateB = new Date(b.dateKey.split('-').reverse().join('-'));
            return dateB - dateA;
        });

        // Calcular estatísticas
        const totalHpLost = penalidades.reduce((sum, p) => sum + (p.hpLoss || 0), 0);
        const manualPenalties = penalidades.filter(p => p.isManual).length;
        const autoPenalties = penalidades.filter(p => !p.isManual).length;
        
        // Calcular sequência atual sem penalidade
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let daysWithoutPenalty = 0;
        for (let d = new Date(today); d >= new Date(today.getTime() - 365 * 86400000); d.setTime(d.getTime() - 86400000)) {
            const dateKey = getDateKey(d);
            const hasPenalty = penalidades.some(p => p.dateKey === dateKey);
            if (hasPenalty) break;
            daysWithoutPenalty++;
        }

        // Calcular melhor sequência
        let bestStreak = 0;
        let currentStreak = 0;
        const datesWithPenalties = new Set(penalidades.map(p => p.dateKey));
        const startDate = new Date();
        startDate.setTime(startDate.getTime() - 365 * 86400000);
        for (let d = new Date(startDate); d <= today; d.setTime(d.getTime() + 86400000)) {
            const dateKey = getDateKey(d);
            if (datesWithPenalties.has(dateKey)) {
                currentStreak = 0;
            } else {
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
            }
        }

        // Calcular penalidades por mês (últimos 6 meses)
        const monthlyPenalties = {};
        const now = new Date();
        for (let i = 0; i < 6; i++) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${monthDate.getMonth() + 1}/${monthDate.getFullYear()}`;
            monthlyPenalties[monthKey] = 0;
        }
        penalidades.forEach(p => {
            const [y, m] = p.dateKey.split('-');
            const monthKey = `${parseInt(m)}/${y}`;
            if (monthlyPenalties.hasOwnProperty(monthKey)) {
                monthlyPenalties[monthKey]++;
            }
        });

        // Filtro selecionado (será gerenciado pelo JavaScript)
        const filterPeriod = container.dataset.filterPeriod || 'all';

        container.innerHTML = `
            <div style="margin-bottom: 20px;">
                <button class="form-btn submit-btn" id="addManualPenaltyBtn" style="width: 100%;">APLICAR PENALIDADE MANUAL</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;">
                <div class="stat-item" style="background: rgba(255, 68, 68, 0.1); border: 1px solid rgba(255, 68, 68, 0.3); padding: 10px; border-radius: 4px;">
                    <span class="label" style="font-size: 11px;">TOTAL DE PENALIDADES:</span>
                    <span class="value" style="font-size: 18px; color: #ff4444;">${total}</span>
                </div>
                <div class="stat-item" style="background: rgba(255, 68, 68, 0.1); border: 1px solid rgba(255, 68, 68, 0.3); padding: 10px; border-radius: 4px;">
                    <span class="label" style="font-size: 11px;">HP PERDIDO:</span>
                    <span class="value" style="font-size: 18px; color: #ff4444;">-${totalHpLost}</span>
                </div>
                <div class="stat-item" style="background: rgba(68, 255, 68, 0.1); border: 1px solid rgba(68, 255, 68, 0.3); padding: 10px; border-radius: 4px;">
                    <span class="label" style="font-size: 11px;">DIAS SEM PENALIDADE:</span>
                    <span class="value" style="font-size: 18px; color: #44ff44;">${daysWithoutPenalty}</span>
                </div>
                <div class="stat-item" style="background: rgba(68, 255, 68, 0.1); border: 1px solid rgba(68, 255, 68, 0.3); padding: 10px; border-radius: 4px;">
                    <span class="label" style="font-size: 11px;">MELHOR SEQUÊNCIA:</span>
                    <span class="value" style="font-size: 18px; color: #44ff44;">${bestStreak} dias</span>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div class="stat-item" style="justify-content: space-between; margin-bottom: 8px;">
                    <span class="label">PENALIDADES AUTOMÁTICAS:</span>
                    <span class="value">${autoPenalties}</span>
                </div>
                <div class="stat-item" style="justify-content: space-between;">
                    <span class="label">PENALIDADES MANUAIS:</span>
                    <span class="value">${manualPenalties}</span>
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;GRÁFICO DE PENALIDADES (ÚLTIMOS 6 MESES)&gt;</span>
                </div>
                <canvas id="penaltiesChart" width="600" height="150" style="max-width: 100%; height: auto; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 10px; margin-top: 10px;"></canvas>
            </div>

            <div style="margin-bottom: 15px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;FILTROS&gt;</span>
                </div>
                <div style="display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap;">
                    <button class="form-btn task-small-btn filter-btn ${filterPeriod === 'all' ? 'submit-btn' : ''}" data-filter="all">TODAS</button>
                    <button class="form-btn task-small-btn filter-btn ${filterPeriod === 'week' ? 'submit-btn' : ''}" data-filter="week">ÚLTIMA SEMANA</button>
                    <button class="form-btn task-small-btn filter-btn ${filterPeriod === 'month' ? 'submit-btn' : ''}" data-filter="month">ÚLTIMO MÊS</button>
                    <button class="form-btn task-small-btn filter-btn ${filterPeriod === 'manual' ? 'submit-btn' : ''}" data-filter="manual">APENAS MANUAIS</button>
                    <button class="form-btn task-small-btn filter-btn ${filterPeriod === 'auto' ? 'submit-btn' : ''}" data-filter="auto">APENAS AUTOMÁTICAS</button>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;LISTA DE PENALIDADES&gt;</span>
                </div>
                <div id="penaltiesList" style="margin-top: 10px; max-height: 400px; overflow-y: auto;">
                    ${this.renderPenaltiesList(sortedPenalties, filterPeriod)}
                </div>
            </div>
        `;

        // Event listeners
        setTimeout(() => {
            const addBtn = document.getElementById('addManualPenaltyBtn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    showManualPenaltyModal();
                });
            }

            // Filtros
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const filter = this.dataset.filter;
                    container.dataset.filterPeriod = filter;
                    gameSystem.updatePenaltiesDisplay();
                });
            });

            // Desenhar gráfico
            gameSystem.drawPenaltiesChart(monthlyPenalties);
        }, 100);
    }

    renderPenaltiesList(penalties, filterPeriod = 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(today.getTime() - 7 * 86400000);
        const monthAgo = new Date(today.getTime() - 30 * 86400000);

        let filtered = penalties;

        if (filterPeriod === 'week') {
            filtered = penalties.filter(p => {
                const [y, m, d] = p.dateKey.split('-');
                const pDate = new Date(y, m - 1, d);
                return pDate >= weekAgo;
            });
        } else if (filterPeriod === 'month') {
            filtered = penalties.filter(p => {
                const [y, m, d] = p.dateKey.split('-');
                const pDate = new Date(y, m - 1, d);
                return pDate >= monthAgo;
            });
        } else if (filterPeriod === 'manual') {
            filtered = penalties.filter(p => p.isManual);
        } else if (filterPeriod === 'auto') {
            filtered = penalties.filter(p => !p.isManual);
        }

        if (filtered.length === 0) {
            return '<div class="section-text">Nenhuma penalidade encontrada.</div>';
        }

        return filtered.map(p => {
            const [y, m, d] = p.dateKey.split('-');
            const formattedDate = `${d}/${m}/${y}`;
            const typeLabel = p.isManual ? 'MANUAL' : 'AUTOMÁTICA';
            const typeColor = p.isManual ? '#ffaa44' : '#ff4444';
            
            let habitsInfo = '';
            if (p.incompleteHabits && p.incompleteHabits.length > 0) {
                habitsInfo = `
                    <div style="margin-top: 5px; font-size: 10px; color: rgba(255,255,255,0.7);">
                        Hábitos não concluídos: ${p.incompleteHabits.join(', ')}
                    </div>
                `;
            }
            
            let reasonInfo = '';
            if (p.reason) {
                reasonInfo = `
                    <div style="margin-top: 5px; font-size: 10px; color: rgba(255,255,255,0.7);">
                        Motivo: ${p.reason}
                    </div>
                `;
            }

            return `
                <div class="training-item" style="margin-bottom: 10px; border-left: 3px solid ${typeColor};">
                    <div class="training-header">
                        <span class="training-name">${formattedDate}</span>
                        <span class="training-type" style="color: ${typeColor};">[${typeLabel}]</span>
                    </div>
                    <div class="training-details">
                        <span style="color: #ff4444;">HP -${p.hpLoss}</span>
                        <span style="margin-left: 10px; color: rgba(255,255,255,0.8);">${p.description}</span>
                    </div>
                    ${habitsInfo}
                    ${reasonInfo}
                </div>
            `;
        }).join('');
    }

    drawPenaltiesChart(monthlyData) {
        const canvas = document.getElementById('penaltiesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        // Fundo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

        const months = Object.keys(monthlyData).reverse();
        const values = months.map(m => monthlyData[m]);
        const maxValue = Math.max(1, ...values);
        const barWidth = chartWidth / months.length;

        // Desenhar barras
        months.forEach((month, index) => {
            const valor = monthlyData[month];
            const x = padding + index * barWidth + barWidth * 0.1;
            const barHeight = (valor / maxValue) * chartHeight;
            const y = padding + chartHeight - barHeight;

            // Barra
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#ff4444');
            gradient.addColorStop(1, '#ff6666');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth * 0.8, barHeight);

            // Borda
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth * 0.8, barHeight);

            // Valor
            if (valor > 0) {
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(valor.toString(), x + barWidth * 0.4, y - 5);
            }

            // Mês
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '9px Arial';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x + barWidth * 0.4, height - 15);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(month, 0, 0);
            ctx.restore();
        });

        // Eixo Y
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '9px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= maxValue; i++) {
            const y = padding + chartHeight - (i / maxValue) * chartHeight;
            ctx.fillText(i.toString(), padding - 5, y + 3);
        }
    }

    // ============================================
    // SISTEMA DE TÍTULOS AUTOMÁTICOS
    // ============================================
    checkTitles() {
        if (!Array.isArray(this.data.titulosDesbloqueados)) {
            this.data.titulosDesbloqueados = [];
        }

        TITLES.forEach(title => {
            // Verificar se já foi desbloqueado
            if (this.data.titulosDesbloqueados.includes(title.id)) {
                return;
            }

            let unlocked = false;
            const req = title.requisito;

            switch (req.tipo) {
                case 'nivel':
                    if (this.data.nivel >= req.valor) {
                        unlocked = true;
                    }
                    break;

                case 'treinos_completos':
                    const treinosCompletos = (this.data.treinos || []).filter(t => t.concluido).length;
                    if (treinosCompletos >= req.valor) {
                        unlocked = true;
                    }
                    break;

                case 'horas_estudo':
                    const totalMinutos = (this.data.estudos || []).reduce((sum, e) => sum + (e.minutos || 0), 0);
                    const totalHoras = totalMinutos / 60;
                    if (totalHoras >= req.valor) {
                        unlocked = true;
                    }
                    break;

                case 'habitos_completos':
                    const habitosCompletos = (this.data.habitos || []).reduce((sum, h) => {
                        return sum + (h.completions ? Object.keys(h.completions).length : 0);
                    }, 0);
                    if (habitosCompletos >= req.valor) {
                        unlocked = true;
                    }
                    break;

                case 'habilidade_level':
                    const maxLevel = Math.max(...(this.data.habilidades || []).map(h => h.level || 1), 0);
                    if (maxLevel >= req.valor) {
                        unlocked = true;
                    }
                    break;

                case 'runas_desbloqueadas':
                    const runasDesbloqueadas = (this.data.runas || []).filter(r => r.desbloqueada).length;
                    if (runasDesbloqueadas >= req.valor) {
                        unlocked = true;
                    }
                    break;

                case 'atributo':
                    const atributoValue = this.data.atributos[req.atributo] || 0;
                    if (atributoValue >= req.valor) {
                        unlocked = true;
                    }
                    break;

                case 'dias_sem_penalidade':
                    // Contar dias consecutivos sem penalidade (verificar últimos N dias)
                    const hoje = new Date();
                    let diasSemPenalidade = 0;
                    for (let i = 0; i < req.valor; i++) {
                        const data = new Date(hoje);
                        data.setDate(data.getDate() - i);
                        const dateKey = this.getDateKey(data);
                        const temPenalidade = (this.data.penalidades || []).some(p => p.dateKey === dateKey);
                        if (!temPenalidade) {
                            diasSemPenalidade++;
                        } else {
                            break;
                        }
                    }
                    if (diasSemPenalidade >= req.valor) {
                        unlocked = true;
                    }
                    break;
            }

            if (unlocked) {
                this.data.titulosDesbloqueados.push(title.id);
                this.addNotification(
                    'TÍTULO DESBLOQUEADO!',
                    `Você ganhou o título: "${title.nome}" - ${title.descricao}`,
                    'evolution'
                );
            }
        });

        this.saveData();
    }

    getDateKey(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    updateTitlesDisplay() {
        const titlesSection = document.querySelector('.attribute-section .section-content');
        if (!titlesSection) return;
        
        // Procurar a seção de TÍTULO especificamente
        const titleSection = Array.from(document.querySelectorAll('.attribute-section')).find(section => {
            const header = section.querySelector('.section-header-text');
            return header && header.textContent.includes('TÍTULO');
        });
        
        if (!titleSection) return;
        
        const content = titleSection.querySelector('.section-content');
        if (!content) return;

        const titulosDesbloqueados = this.data.titulosDesbloqueados || [];
        
        if (titulosDesbloqueados.length === 0) {
            content.innerHTML = '<div class="section-text">NENHUM TÍTULO DESBLOQUEADO</div>';
            return;
        }

        const titulos = TITLES.filter(t => titulosDesbloqueados.includes(t.id));
        const tituloAtual = this.data.titulo;

        content.innerHTML = `
            <div class="section-text" style="font-size: 12px; margin-bottom: 8px;">TÍTULOS DESBLOQUEADOS (${titulos.length}):</div>
            <div style="max-height: 200px; overflow-y: auto;">
                ${titulos.map(t => `
                    <div style="margin-bottom: 6px; padding: 6px; background: rgba(0,0,0,0.3); border-radius: 4px; cursor: pointer; ${tituloAtual === t.id ? 'border: 1px solid rgba(68,255,68,0.5);' : ''}" onclick="selectTitle('${t.id}')">
                        <div style="font-size: 12px; font-weight: bold; color: rgba(255,255,255,0.9);">${t.nome}</div>
                        <div style="font-size: 10px; color: rgba(255,255,255,0.7);">${t.descricao}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ============================================
    // GRÁFICO HEXAGONAL
    // ============================================

    updateHexagonChart() {
        const canvas = document.getElementById('hexagonChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 50;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Obter valores dos atributos
        const attrs = ['forca', 'inteligencia', 'agilidade', 'vitalidade', 'resistencia', 'percepcao'];
        const values = attrs.map(attr => this.getAttributeInt(attr));
        
        // Calcular máximo (atributo mais alto + 2, mínimo 5)
        const max = Math.max(Math.max(...values, 1) + 2, 5);
        
        // Desenhar hexágono base
        this.drawHexagon(ctx, centerX, centerY, radius, max, values);
    }

    drawHexagon(ctx, centerX, centerY, radius, max, values) {
        const points = 6;
        const angleStep = (2 * Math.PI) / points;
        
        // Desenhar grade de fundo (hexágonos concêntricos)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        
        const gridLevels = Math.min(max, 5);
        for (let i = 1; i <= gridLevels; i++) {
            const r = (radius * i) / gridLevels;
            ctx.beginPath();
            for (let j = 0; j < points; j++) {
                const angle = (j * angleStep) - (Math.PI / 2);
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // Desenhar linhas dos eixos (do centro até a borda)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        for (let j = 0; j < points; j++) {
            const angle = (j * angleStep) - (Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
            ctx.stroke();
        }
        
        // Desenhar área dos atributos com gradiente
        const labels = ['FORÇA', 'INTELIGÊNCIA', 'AGILIDADE', 'VITALIDADE', 'RESISTÊNCIA', 'PERCEPÇÃO'];
        const colors = [
            'rgba(255, 100, 100, 0.4)',   // FORÇA - Vermelho
            'rgba(100, 150, 255, 0.4)',  // INTELIGÊNCIA - Azul
            'rgba(100, 255, 150, 0.4)',  // AGILIDADE - Verde
            'rgba(255, 200, 100, 0.4)',  // VITALIDADE - Laranja
            'rgba(200, 100, 255, 0.4)',  // RESISTÊNCIA - Roxo
            'rgba(255, 255, 100, 0.4)'   // PERCEPÇÃO - Amarelo
        ];
        
        // Criar gradiente para preenchimento
        const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
        gradient.addColorStop(0, 'rgba(100, 150, 255, 0.35)');
        gradient.addColorStop(0.5, 'rgba(100, 255, 150, 0.35)');
        gradient.addColorStop(1, 'rgba(255, 200, 100, 0.35)');
        
        // Desenhar área preenchida
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        for (let j = 0; j < points; j++) {
            const angle = (j * angleStep) - (Math.PI / 2);
            const value = values[j] || 0;
            const r = (radius * value) / max;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.fill();
        
        // Desenhar borda da área
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        
        // Desenhar pontos nos valores
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        for (let j = 0; j < points; j++) {
            const angle = (j * angleStep) - (Math.PI / 2);
            const value = values[j] || 0;
            const r = (radius * value) / max;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            
            // Círculo externo (borda)
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
            
            // Círculo interno (preenchimento)
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = colors[j];
            ctx.fill();
        }
        
        // Desenhar labels
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        
        for (let j = 0; j < points; j++) {
            const angle = (j * angleStep) - (Math.PI / 2);
            const labelX = centerX + (radius + 30) * Math.cos(angle);
            const labelY = centerY + (radius + 30) * Math.sin(angle);
            
            ctx.fillText(labels[j], labelX, labelY);
        }
    }
}

// ============================================
// TAREFAS, HÁBITOS E MISSÕES - HELPERS
// ============================================

// Normaliza data para chave YYYY-MM-DD
function getTodayKey() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
}

function getDateKey(date) {
    if (typeof date === 'string') return date.slice(0, 10);
    return date.toISOString().slice(0, 10);
}

// Verifica se uma tarefa recorrente deve aparecer hoje
function shouldTaskAppearToday(task, today = new Date()) {
    if (!task.ativo) return false;

    const todayKey = getDateKey(today);

    // MISSÃO ÚNICA: aparece de startDate até ser concluída uma vez
    if (task.tipo === 'missao' && task.unique) {
        const startKey = getDateKey(task.startDate || task.recurrence?.startDate || getTodayKey());
        if (todayKey < startKey) return false;
        const alreadyCompleted = task.completions && task.completions.length > 0;
        return !alreadyCompleted && todayKey >= startKey;
    }

    // Demais casos: recorrentes
    if (!task.recurrence) return false;

    const start = new Date(task.recurrence.startDate || getTodayKey());
    const todayCopy = new Date(today.getTime());
    const startCopy = new Date(start.getTime());

    const startKey = getDateKey(startCopy);
    if (todayKey < startKey) return false;

    todayCopy.setHours(0, 0, 0, 0);
    startCopy.setHours(0, 0, 0, 0);

    const diffMs = todayCopy - startCopy;
    const diffDays = Math.floor(diffMs / 86400000);
    const interval = task.recurrence.interval || 1;

    switch (task.recurrence.type) {
        case 'daily':
            return diffDays >= 0;
        case 'interval_days':
            return diffDays >= 0 && diffDays % interval === 0;
        case 'weekly':
            return diffDays >= 0 && diffDays % (7 * interval) === 0;
        case 'monthly': {
            const startMonth = startCopy.getFullYear() * 12 + startCopy.getMonth();
            const todayMonth = todayCopy.getFullYear() * 12 + todayCopy.getMonth();
            const diffMonths = todayMonth - startMonth;
            return diffMonths >= 0 && diffMonths % interval === 0 && todayCopy.getDate() === startCopy.getDate();
        }
        case 'yearly': {
            const diffYears = todayCopy.getFullYear() - startCopy.getFullYear();
            return diffYears >= 0 &&
                diffYears % interval === 0 &&
                todayCopy.getMonth() === startCopy.getMonth() &&
                todayCopy.getDate() === startCopy.getDate();
        }
        default:
            return false;
    }
}

// Marca conclusão de tarefa para hoje
function completeRecurringTask(task) {
    const todayKey = getTodayKey();
    if (!task.completions) task.completions = [];
    if (!task.completions.includes(todayKey)) {
        task.completions.push(todayKey);
    }
}

// ============================================
// INICIALIZAÇÃO GLOBAL
// ============================================

let gameSystem;

document.addEventListener('DOMContentLoaded', function() {
    // Esconder modal de configuração inicial por padrão (será mostrado se necessário)
    const initialConfigModal = document.getElementById('initialConfigModal');
    if (initialConfigModal) {
        initialConfigModal.classList.add('hidden');
    }
    
    // Inicializar sistema
    gameSystem = new GameSystem();
    
    // Inicializar navegação de abas
    initTabNavigation();
    
    // Inicializar partículas
    initAllParticles();
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        // Inicializar seções colapsáveis
        initCollapsibleSections();
        
        // Inicializar sistemas específicos
        initTrainingSystem();
        initTasksSystem();
        initSkillsSystem();
        initShopSystem();
        initPenaltySystem();
        
        // Inicializar modais
        initModals();
        
        // Atualizar gráfico hexagonal se já estiver na seção de status
        if (gameSystem && document.getElementById('statusSection').classList.contains('active')) {
            setTimeout(() => {
                gameSystem.updateHexagonChart();
            }, 500);
        }
        
        // Atualizar gráfico hexagonal periodicamente
        setInterval(() => {
            if (gameSystem && document.getElementById('statusSection').classList.contains('active')) {
                gameSystem.updateHexagonChart();
            }
        }, 2000);
    }, 100);
});

// ============================================
// FUNÇÕES DE NAVEGAÇÃO E UI
// ============================================

function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab-icon-btn');
    const sections = document.querySelectorAll('.content-section');
    const windowContent = document.getElementById('windowContent');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            if (this.classList.contains('active')) return;

            windowContent.classList.add('hidden');

            setTimeout(() => {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                sections.forEach(section => {
                    section.classList.remove('active');
                });

                const targetSection = document.getElementById(targetTab + 'Section');
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    const particleContainer = targetSection.querySelector('.star-particles');
                    if (particleContainer) {
                        createStarParticles(particleContainer);
                    }
                    
                    // Atualizar gráfico se for a seção de status
                    if (targetTab === 'status' && gameSystem) {
                        setTimeout(() => {
                            gameSystem.updateHexagonChart();
                            if (typeof updateSkillsDisplay === 'function') {
                                updateSkillsDisplay();
                            }
                        }, 100);
                    }
                    
                    // Atualizar habilidades em TRAINNE se for a seção de treinamento
                    if (targetTab === 'trainne' && gameSystem) {
                        setTimeout(() => {
                            if (typeof renderSkillsInTraining === 'function') {
                                renderSkillsInTraining();
                            }
                        }, 200);
                    }
                }

                setTimeout(() => {
                    windowContent.classList.remove('hidden');
                }, 200);
            }, 300);
        });
    });
}

// Sistema de Partículas
function createStarParticles(container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    const starCount = 120;
    const avgDuration = 15;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        let leftPercent;
        if (Math.random() < 0.5) {
            leftPercent = Math.random() * 20;
        } else {
            leftPercent = 80 + Math.random() * 20;
        }
        
        star.style.left = leftPercent + '%';
        
        const initialProgress = Math.random();
        const animationDuration = Math.random() * 8 + 12;
        const containerHeight = 600;
        const initialOffset = -initialProgress * containerHeight;
        
        star.style.setProperty('--initial-offset', `${initialOffset}px`);
        const delay = (i / starCount) * avgDuration;
        star.style.animationDelay = delay + 's';
        star.style.bottom = '0px';
        star.style.opacity = '0';
        star.style.visibility = 'hidden';
        star.style.animationDuration = animationDuration + 's';
        
        container.appendChild(star);
    }
}

function initAllParticles() {
    const particleContainers = document.querySelectorAll('.star-particles');
    particleContainers.forEach(container => {
        createStarParticles(container);
    });
}

function initCollapsibleSections() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        const content = header.nextElementSibling;
        if (!content || !content.classList.contains('section-content')) return;
        
        // Verificar se a seção de atributos está dentro de uma div com a classe attributes-always-expanded
        const attributeSection = header.closest('.attributes-always-expanded');
        
        // Se for a seção de atributos, sempre manter expandida
        if (attributeSection) {
            content.style.display = 'block';
            header.classList.remove('collapsed');
            const chevron = header.querySelector('.section-chevron');
            if (chevron) chevron.textContent = '▼';
            return; // Não adiciona o listener de click para esta seção
        }
        
        const chevron = header.querySelector('.section-chevron');
        
        content.style.display = 'none';
        header.classList.add('collapsed');
        
        header.addEventListener('click', function() {
            const isCollapsed = this.classList.contains('collapsed');
            
            if (isCollapsed) {
                content.style.display = 'block';
                this.classList.remove('collapsed');
                if (chevron) chevron.textContent = '▼';
            } else {
                content.style.display = 'none';
                this.classList.add('collapsed');
                if (chevron) chevron.textContent = '▲';
            }
        });
    });
}

// ============================================
// SISTEMAS ESPECÍFICOS
// ============================================

function initModals() {
    // Modal de Configuração Inicial
    const initialConfigForm = document.getElementById('initialConfigForm');
    if (initialConfigForm) {
        initialConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('initialName').value.trim();
            const apelido = document.getElementById('initialApelido').value.trim();
            
            if (nome && apelido && gameSystem) {
                gameSystem.data.nome = nome.toUpperCase();
                gameSystem.data.apelido = apelido.toUpperCase();
                gameSystem.data.configurado = true;
                gameSystem.saveData();
                gameSystem.updateAllDisplays();
                
                document.getElementById('initialConfigModal').classList.add('hidden');
                gameSystem.addNotification('BEM-VINDO!', `Bem-vindo ao sistema, ${nome}!`, 'info');
            }
        });
    }
    
    // Modal de Seleção de Classe
    const classSelectionModal = document.getElementById('classSelectionModal');
    const classSelectionClose = document.getElementById('classSelectionClose');
    
    if (classSelectionClose) {
        classSelectionClose.addEventListener('click', () => {
            classSelectionModal.classList.add('hidden');
        });
    }
    
    // Renderizar classes
    renderClasses();
}

function renderClasses() {
    const classesGrid = document.getElementById('classesGrid');
    if (!classesGrid) return;
    
    const classNames = Object.keys(CLASSES);
    classesGrid.innerHTML = classNames.map(className => {
        const classeData = CLASSES[className];
        return `
            <div class="class-card" data-class="${className}">
                <div class="class-name">${classeData.name}</div>
                <div class="class-description">Bônus em: ${getBonusAttributeName(classeData.bonusAttribute)}</div>
            </div>
        `;
    }).join('');
    
    // Adicionar event listeners
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', function() {
            const className = this.getAttribute('data-class');
            if (gameSystem && gameSystem.data.nivel >= 50) {
                gameSystem.data.classe = className;
                gameSystem.data.classeSelecionada = true;
                gameSystem.data.classeStage = 0;
                gameSystem.saveData();
                gameSystem.updateAllDisplays();
                
                document.getElementById('classSelectionModal').classList.add('hidden');
                gameSystem.addNotification('CLASSE SELECIONADA!', `Você escolheu a classe: ${className}!`, 'evolution');
            }
        });
    });
}

function getBonusAttributeName(bonus) {
    const names = {
        'forca': 'FORÇA',
        'inteligencia': 'INTELIGÊNCIA',
        'agilidade': 'AGILIDADE',
        'vitalidade': 'VITALIDADE',
        'resistencia': 'RESISTÊNCIA',
        'percepcao': 'PERCEPÇÃO',
        'all': 'TODOS OS ATRIBUTOS'
    };
    return names[bonus] || bonus;
}

function initTrainingSystem() {
    // Botão para adicionar treino
    const addTrainingBtn = document.getElementById('addTrainingBtn');
    if (addTrainingBtn) {
        addTrainingBtn.addEventListener('click', () => {
            showTrainingModal();
        });
    }
    
    // Renderizar treinos e estudos
    renderTrainings();
    renderStudies();
}

function showTrainingModal(existingTraining = null) {
    // Criar modal de treino dinamicamente
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'trainingModal';
    const isEditing = existingTraining !== null;
    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 800px;">
            <div class="settings-header">
                <h3 class="settings-title">${isEditing ? 'EDITAR TREINO' : 'ADICIONAR TREINO'}</h3>
                <button class="settings-close" id="trainingModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="trainingForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Tipo de Treino:</label>
                        <select id="trainingType" class="form-select" required>
                            <option value="Hipertrofia">Hipertrofia</option>
                            <option value="Força">Força</option>
                            <option value="Calistenia">Calistenia</option>
                            <option value="Cardio">Cardio</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Nome do Exercício:</label>
                        <input type="text" id="exerciseName" class="form-input" required>
                    </div>
                    <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label class="form-label">Séries:</label>
                            <input type="number" id="exerciseSeries" class="form-input" min="1" required>
                        </div>
                        <div>
                            <label class="form-label">Repetições:</label>
                            <input type="number" id="exerciseReps" class="form-input" min="1" required>
                        </div>
                    </div>
                    <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label class="form-label">Carga (kg):</label>
                            <input type="number" id="exerciseWeight" class="form-input" min="0" step="0.5">
                        </div>
                        <div>
                            <label class="form-label">Descanso (segundos):</label>
                            <input type="number" id="exerciseRest" class="form-input" min="0" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Preview do Movimento (Imagem/GIF/Vídeo):</label>
                        <input type="file" id="exercisePreview" class="form-file-input" accept="image/*,video/*">
                        <div class="icon-preview" id="exercisePreviewDisplay">
                            <span class="preview-placeholder">Preview do movimento</span>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="trainingCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">ADICIONAR</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('trainingModalClose').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('trainingCancelBtn').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.settings-backdrop').addEventListener('click', () => {
        modal.remove();
    });
    
    // Preview do arquivo
    document.getElementById('exercisePreview').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById('exercisePreviewDisplay');
                if (file.type.startsWith('video/')) {
                    preview.innerHTML = `<video src="${event.target.result}" controls style="max-width: 100%; max-height: 200px;"></video>`;
                } else {
                    preview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; object-fit: contain;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Preencher campos se for edição
    if (existingTraining) {
        document.getElementById('trainingType').value = existingTraining.tipo || 'Hipertrofia';
        document.getElementById('exerciseName').value = existingTraining.nome || '';
        document.getElementById('exerciseSeries').value = existingTraining.series || 1;
        document.getElementById('exerciseReps').value = existingTraining.repeticoes || 1;
        document.getElementById('exerciseWeight').value = existingTraining.carga || 0;
        document.getElementById('exerciseRest').value = existingTraining.descanso || 0;
        if (existingTraining.preview) {
            const preview = document.getElementById('exercisePreviewDisplay');
            if (existingTraining.preview.startsWith('data:video')) {
                preview.innerHTML = `<video src="${existingTraining.preview}" controls style="max-width: 100%; max-height: 200px;"></video>`;
            } else {
                preview.innerHTML = `<img src="${existingTraining.preview}" alt="Preview" style="max-width: 100%; max-height: 200px; object-fit: contain;">`;
            }
        }
    }
    
    // Submit do formulário
    document.getElementById('trainingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = document.getElementById('exercisePreview').files[0];
        let previewData = existingTraining?.preview || null;
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewData = event.target.result;
                saveTraining(previewData, existingTraining);
            };
            reader.readAsDataURL(file);
        } else {
            saveTraining(previewData, existingTraining);
        }
    });
}

function saveTraining(previewData, existingTraining = null) {
    if (!gameSystem) return;
    
    const isEditing = existingTraining !== null;
    
    // Validação: se está editando um treino concluído, avisar o usuário
    if (isEditing && existingTraining.concluido) {
        if (!confirm('ATENÇÃO: Este treino já foi concluído. Ao editar, o XP e atributos já ganhos não serão recalculados. Deseja continuar?')) {
            return;
        }
    }
    
    const tipoAntigo = isEditing ? existingTraining.tipo : null;
    const tipoNovo = document.getElementById('trainingType').value;
    
    const training = {
        id: isEditing ? existingTraining.id : Date.now(),
        tipo: tipoNovo,
        nome: document.getElementById('exerciseName').value.toUpperCase(),
        series: parseInt(document.getElementById('exerciseSeries').value),
        repeticoes: parseInt(document.getElementById('exerciseReps').value),
        carga: parseFloat(document.getElementById('exerciseWeight').value) || 0,
        descanso: parseInt(document.getElementById('exerciseRest').value),
        preview: previewData,
        previewPosition: isEditing && existingTraining.previewPosition ? existingTraining.previewPosition : 'center center',
        data: isEditing ? existingTraining.data : new Date().toISOString(),
        concluido: isEditing ? existingTraining.concluido : false
    };
    
    if (isEditing) {
        const index = gameSystem.data.treinos.findIndex(t => t.id === existingTraining.id);
        if (index >= 0) {
            // Se mudou o tipo e o treino não foi concluído, recalcular XP de habilidade
            if (!existingTraining.concluido && tipoAntigo !== tipoNovo) {
                // Remover XP da habilidade antiga (0.5 horas = 5 XP)
                const skillAntiga = (gameSystem.data.habilidades || []).find(s => 
                    s.nome.toUpperCase() === tipoAntigo.toUpperCase() && s.tipo === 'combate'
                );
                if (skillAntiga) {
                    skillAntiga.xp = Math.max(0, skillAntiga.xp - 5);
                }
                
                // Adicionar XP na nova habilidade
                gameSystem.addSkillXp(tipoNovo, 0.5, 'combate');
            }
            
            gameSystem.data.treinos[index] = training;
        }
    } else {
        gameSystem.data.treinos.push(training);
    }
    
    gameSystem.saveData();
    renderTrainings();
    if (typeof renderProgressCharts === 'function') {
        setTimeout(() => renderProgressCharts(), 100);
    }
    if (typeof renderPerformanceChart === 'function') {
        setTimeout(() => renderPerformanceChart(), 150);
    }
    
    document.getElementById('trainingModal').remove();
    gameSystem.addNotification(
        isEditing ? 'TREINO ATUALIZADO!' : 'TREINO ADICIONADO!',
        `Treino "${training.nome}" ${isEditing ? 'atualizado' : 'adicionado'} com sucesso!`,
        'info'
    );
}

function openTrainingPositionEditor(trainingId) {
    if (!gameSystem) return;
    
    const treino = gameSystem.data.treinos.find(t => t.id === trainingId);
    if (!treino || !treino.preview || treino.preview.startsWith('data:video')) return;
    
    const trainingItem = document.querySelector(`.training-item[data-id="${trainingId}"]`);
    if (!trainingItem) return;
    
    const previewBox = trainingItem.querySelector('.training-preview-box');
    const media = previewBox.querySelector('.training-media');
    if (!media) return;
    
    // Criar overlay de edição
    const overlay = document.createElement('div');
    overlay.className = 'training-position-overlay';
    overlay.innerHTML = `
        <div class="training-position-controls">
            <div class="training-position-info">Ajuste a visualização da imagem</div>
            <div class="training-position-buttons">
                <button class="training-pos-btn training-pos-up" data-direction="up" title="Mover para cima">↑</button>
                <div class="training-pos-horizontal">
                    <button class="training-pos-btn training-pos-left" data-direction="left" title="Mover para esquerda">←</button>
                    <button class="training-pos-btn training-pos-center" data-direction="center" title="Centralizar">○</button>
                    <button class="training-pos-btn training-pos-right" data-direction="right" title="Mover para direita">→</button>
                </div>
                <button class="training-pos-btn training-pos-down" data-direction="down" title="Mover para baixo">↓</button>
            </div>
            <div class="training-position-actions">
                <button class="training-pos-confirm">CONFIRMAR</button>
                <button class="training-pos-cancel">CANCELAR</button>
            </div>
        </div>
    `;
    
    previewBox.appendChild(overlay);
    
    // Posição inicial (usar salva ou padrão center center)
    let currentX = 50;
    let currentY = 50;
    
    // Parse da posição atual
    const currentPosition = treino.previewPosition || 'center center';
    if (currentPosition.includes('%')) {
        const parts = currentPosition.split(' ');
        if (parts.length >= 2) {
            currentX = parseFloat(parts[0]) || 50;
            currentY = parseFloat(parts[1]) || 50;
        }
    }
    
    // Aplicar posição atual
    const updatePosition = () => {
        media.style.objectPosition = `${currentX}% ${currentY}%`;
    };
    
    updatePosition();
    
    // Event listeners para os botões
    overlay.querySelectorAll('.training-pos-btn[data-direction]').forEach(btn => {
        btn.addEventListener('click', function() {
            const direction = this.getAttribute('data-direction');
            const step = 5; // Movimento de 5% por vez
            
            switch(direction) {
                case 'up':
                    currentY = Math.max(0, currentY - step);
                    break;
                case 'down':
                    currentY = Math.min(100, currentY + step);
                    break;
                case 'left':
                    currentX = Math.max(0, currentX - step);
                    break;
                case 'right':
                    currentX = Math.min(100, currentX + step);
                    break;
                case 'center':
                    currentX = 50;
                    currentY = 50;
                    break;
            }
            updatePosition();
        });
    });
    
    // Confirmar
    overlay.querySelector('.training-pos-confirm').addEventListener('click', () => {
        treino.previewPosition = `${currentX}% ${currentY}%`;
        gameSystem.saveData();
        overlay.remove();
        renderTrainings(); // Re-renderizar para aplicar a posição salva
    });
    
    // Cancelar
    overlay.querySelector('.training-pos-cancel').addEventListener('click', () => {
        // Restaurar posição original
        media.style.objectPosition = currentPosition;
        overlay.remove();
    });
}

function renderTrainings() {
    const container = document.querySelector('#trainneSection .trainne-info');
    if (!container || !gameSystem) return;
    
    const treinos = gameSystem.data.treinos.filter(t => {
        const treinoDate = new Date(t.data);
        const today = new Date();
        return treinoDate.toDateString() === today.toDateString();
    });
    
    // Calcular progresso semanal de treinos (filtrar apenas semana atual)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    const treinosSemanaAtual = (gameSystem.data.treinosSemana || []).filter(t => {
        const tDate = new Date(t.data);
        return tDate >= sevenDaysAgo && tDate <= now;
    });
    const treinosSemanaCount = treinosSemanaAtual.length;
    const treinoMeta = gameSystem.data.treinoMeta || 5;
    const treinoProgress = Math.min(100, Math.floor((treinosSemanaCount / treinoMeta) * 100));
    
    container.innerHTML = `
        <div class="stat-item">
            <span class="label">TREINOS DE HOJE:</span>
            <span class="value">${treinos.length}</span>
        </div>
        <div class="stat-item">
            <span class="label">TREINOS COMPLETADOS ESTA SEMANA:</span>
            <span class="value">${treinosSemanaCount} / ${treinoMeta}</span>
        </div>
        <div style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="label" style="font-size: 12px;">META SEMANAL DE TREINOS:</span>
                <span class="value" style="font-size: 12px;">${treinoProgress}%</span>
            </div>
            <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; height: 20px; position: relative; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #ff4444, #ff6666); height: 100%; width: ${treinoProgress}%; transition: width 0.3s;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffffff; font-size: 11px; font-weight: bold; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">
                    ${treinosSemanaCount} / ${treinoMeta}
                </div>
            </div>
            <button class="form-btn task-small-btn" id="editTreinoMetaBtn" style="margin-top: 5px; width: 100%; font-size: 11px; padding: 5px;">AJUSTAR META</button>
        </div>
        <div style="margin-top: 20px;">
            <button class="form-btn submit-btn" id="addTrainingBtn" style="width: 100%;">ADICIONAR TREINO</button>
        </div>
        <div class="trainings-list" style="margin-top: 20px;">
            ${treinos.length > 0 ? treinos.map(treino => `
                <div class="training-item" data-id="${treino.id}">
                    <div class="training-preview-box">
                        ${treino.preview && !treino.preview.startsWith('data:video') ? `<button class="training-view-toggle" data-training-id="${treino.id}" title="Ajustar visualização">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2v20M2 12h20"></path>
                            </svg>
                        </button>` : ''}
                        ${treino.preview ? (treino.preview.startsWith('data:video') 
                            ? `<video src="${treino.preview}" controls class="training-media"></video>` 
                            : `<img src="${treino.preview}" alt="Preview" class="training-media" style="object-position: ${treino.previewPosition || 'center center'};" />`) 
                            : '<div class="training-preview-placeholder">SEM IMAGEM</div>'}
                    </div>
                    <div class="training-info-grid">
                        <div class="training-info-item">
                            <span class="training-info-label">NOME:</span>
                            <span class="training-info-value">${treino.nome}</span>
                        </div>
                        <div class="training-info-item">
                            <span class="training-info-label">TIPO:</span>
                            <span class="training-info-value">${treino.tipo}</span>
                        </div>
                        <div class="training-info-item">
                            <span class="training-info-label">SÉRIES:</span>
                            <span class="training-info-value">${treino.series}</span>
                        </div>
                        <div class="training-info-item">
                            <span class="training-info-label">REPS:</span>
                            <span class="training-info-value">${treino.repeticoes}</span>
                        </div>
                        <div class="training-info-item">
                            <span class="training-info-label">CARGA:</span>
                            <span class="training-info-value">${treino.carga}kg</span>
                        </div>
                        <div class="training-info-item">
                            <span class="training-info-label">DESCANSO:</span>
                            <span class="training-info-value">${treino.descanso}s</span>
                        </div>
                    </div>
                    <div class="training-actions">
                        <button class="form-btn submit-btn task-small-btn" onclick="completeTraining(${treino.id})" ${treino.concluido ? 'disabled' : ''} style="flex: 1;">${treino.concluido ? 'CONCLUÍDO' : 'FINALIZAR'}</button>
                        <button class="form-btn task-small-btn task-edit-btn" onclick="editTraining(${treino.id})" style="flex: 0 0 auto;">EDITAR</button>
                        <button class="form-btn task-small-btn task-delete-btn" onclick="deleteTraining(${treino.id})" style="flex: 0 0 auto;">X</button>
                    </div>
                </div>
            `).join('') : '<div class="section-text">Nenhum treino registrado hoje.</div>'}
        </div>
        <div style="margin-top: 30px;">
            <div class="section-divider"></div>
        </div>
        <div id="studiesSection" style="margin-top: 10px;"></div>
    `;
    
    // Re-adicionar event listeners
    const addBtn = document.getElementById('addTrainingBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            showTrainingModal();
        });
    }
    
    // Adicionar event listeners para os botões de ajuste de visualização
    document.querySelectorAll('.training-view-toggle').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const trainingId = parseInt(this.getAttribute('data-training-id'));
            openTrainingPositionEditor(trainingId);
        });
    });
    
    const editMetaBtn = document.getElementById('editTreinoMetaBtn');
    if (editMetaBtn) {
        editMetaBtn.addEventListener('click', () => {
            showMetaModal('treino');
        });
    }
    
    // Renderizar estudos, habilidades e gráficos
    renderStudies();
    if (typeof renderSkillsInTraining === 'function') {
        setTimeout(() => renderSkillsInTraining(), 200);
    }
    if (typeof renderProgressCharts === 'function') {
        setTimeout(() => renderProgressCharts(), 300);
    }
    if (typeof renderPerformanceChart === 'function') {
        setTimeout(() => renderPerformanceChart(), 400);
    }
}

function completeTraining(trainingId) {
    if (!gameSystem) return;
    
    const treino = gameSystem.data.treinos.find(t => t.id === trainingId);
    if (!treino || treino.concluido) return;
    
    treino.concluido = true;
    
    // Adicionar força
    gameSystem.addForca(0.15);
    
    // Adicionar EXP
    gameSystem.addExp(50);
    
    // Adicionar XP à habilidade de combate correspondente ao tipo de treino
    // Considerando 1 treino = 0.5 horas de "treino" para XP (equivalente a 5 XP)
    gameSystem.addSkillXp(treino.tipo, 0.5, 'combate');
    
    // Verificar se é dia útil (segunda a sexta)
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Adicionar à semana se ainda não foi adicionado hoje
        const todayStr = today.toDateString();
        const alreadyAdded = gameSystem.data.treinosSemana.some(t => {
            const tDate = new Date(t.data);
            return tDate.toDateString() === todayStr;
        });
        
        if (!alreadyAdded) {
            gameSystem.data.treinosSemana.push({
                data: today.toISOString(),
                treinoId: trainingId
            });
            
            // Verificar se completou 5 dias na semana (filtrar apenas semana atual)
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
            const treinosSemanaAtual = (gameSystem.data.treinosSemana || []).filter(t => {
                const tDate = new Date(t.data);
                return tDate >= sevenDaysAgo && tDate <= now;
            });
            
            if (treinosSemanaAtual.length >= 5) {
                // Verificar se já recebeu o bônus esta semana
                const ultimaSemana = gameSystem.data.ultimaSemanaResistencia || null;
                const inicioSemana = new Date(now);
                inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay()); // Domingo da semana
                inicioSemana.setHours(0, 0, 0, 0);
                
                if (!ultimaSemana || new Date(ultimaSemana) < inicioSemana) {
                    gameSystem.addResistencia();
                    gameSystem.data.ultimaSemanaResistencia = inicioSemana.toISOString();
                    gameSystem.addNotification('RESISTÊNCIA!', 'Você completou 5 dias de treino na semana!', 'info');
                }
            }
        }
    }
    
    gameSystem.saveData();
    renderTrainings();
    if (typeof renderProgressCharts === 'function') {
        setTimeout(() => renderProgressCharts(), 100);
    }
    if (typeof renderPerformanceChart === 'function') {
        setTimeout(() => renderPerformanceChart(), 150);
    }
    gameSystem.checkTitles();
    gameSystem.addNotification('TREINO CONCLUÍDO!', `Treino "${treino.nome}" finalizado!`, 'info');
}

function renderStudies() {
    const section = document.getElementById('studiesSection');
    if (!section || !gameSystem) return;

    const today = new Date();
    const todayKey = today.toDateString();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

    const estudosHoje = (gameSystem.data.estudos || []).filter(e => {
        const d = new Date(e.data);
        return d.toDateString() === todayKey;
    });

    const totalMinutosHoje = estudosHoje.reduce((sum, e) => sum + (e.minutos || 0), 0);
    const totalHorasHoje = (totalMinutosHoje / 60).toFixed(1);

    // Calcular horas estudadas na semana
    const estudosSemana = (gameSystem.data.estudos || []).filter(e => {
        const d = new Date(e.data);
        return d >= sevenDaysAgo && d <= now;
    });
    const totalMinutosSemana = estudosSemana.reduce((sum, e) => sum + (e.minutos || 0), 0);
    const totalHorasSemana = (totalMinutosSemana / 60).toFixed(1);
    const estudoMeta = gameSystem.data.estudoMeta || 10;
    const estudoProgress = Math.min(100, Math.floor((parseFloat(totalHorasSemana) / estudoMeta) * 100));

    section.innerHTML = `
        <div class="stat-item">
            <span class="label">ESTUDOS HOJE (min):</span>
            <span class="value">${totalMinutosHoje}</span>
        </div>
        <div class="stat-item">
            <span class="label">ESTUDOS HOJE (horas):</span>
            <span class="value">${totalHorasHoje}</span>
        </div>
        <div class="stat-item">
            <span class="label">ESTUDOS ESTA SEMANA (horas):</span>
            <span class="value">${totalHorasSemana} / ${estudoMeta}</span>
        </div>
        <div style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="label" style="font-size: 12px;">META SEMANAL DE ESTUDOS:</span>
                <span class="value" style="font-size: 12px;">${estudoProgress}%</span>
            </div>
            <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; height: 20px; position: relative; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #4444ff, #6666ff); height: 100%; width: ${estudoProgress}%; transition: width 0.3s;"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffffff; font-size: 11px; font-weight: bold; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">
                    ${totalHorasSemana}h / ${estudoMeta}h
                </div>
            </div>
            <button class="form-btn task-small-btn" id="editEstudoMetaBtn" style="margin-top: 5px; width: 100%; font-size: 11px; padding: 5px;">AJUSTAR META</button>
        </div>
        <div style="margin-top: 10px;">
            <button class="form-btn submit-btn" id="addStudyBtn" style="width: 100%;">ADICIONAR ESTUDO</button>
        </div>
        <div class="trainings-list" style="margin-top: 15px;">
            ${estudosHoje.length ? estudosHoje.map(estudo => `
                <div class="training-item" data-id="${estudo.id}">
                    <div class="training-header">
                        <span class="training-name">${estudo.materia}</span>
                        <span class="training-type">[${estudo.tipo === 'psicologia' ? 'PSICOLOGIA' : 'GERAL'}]</span>
                    </div>
                    <div class="training-details">
                        <span>Duração: ${estudo.minutos} min</span>
                    </div>
                    <div style="display: flex; gap: 5px; margin-top: 10px;">
                        <button class="form-btn task-small-btn task-edit-btn" onclick="editStudy(${estudo.id})" style="flex: 1;">EDITAR</button>
                        <button class="form-btn task-small-btn task-delete-btn" onclick="deleteStudy(${estudo.id})" style="flex: 1;">EXCLUIR</button>
                    </div>
                </div>
            `).join('') : '<div class="section-text">Nenhum estudo registrado hoje.</div>'}
        </div>
    `;

    const addBtn = document.getElementById('addStudyBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            showStudyModal();
        });
    }

    const editMetaBtn = document.getElementById('editEstudoMetaBtn');
    if (editMetaBtn) {
        editMetaBtn.addEventListener('click', () => {
            showMetaModal('estudo');
        });
    }
}

function showStudyModal(existingStudy = null) {
    if (!gameSystem) return;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'studyModal';
    const isEditing = existingStudy !== null;

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 700px;">
            <div class="settings-header">
                <h3 class="settings-title">${isEditing ? 'EDITAR ESTUDO' : 'ADICIONAR ESTUDO'}</h3>
                <button class="settings-close" id="studyModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="studyForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Tipo de Estudo:</label>
                        <select id="studyType" class="form-select" required>
                            <option value="geral">Geral (INTELIGÊNCIA)</option>
                            <option value="psicologia">Psicologia (PERCEPÇÃO)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Matéria / Assunto:</label>
                        <input type="text" id="studySubject" class="form-input" placeholder="Ex: PROGRAMAÇÃO, INGLÊS, PSICOLOGIA COGNITIVA" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Duração (minutos):</label>
                        <input type="number" id="studyMinutes" class="form-input" min="1" value="60" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="studyCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">${isEditing ? 'SALVAR' : 'ADICIONAR'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('studyModalClose').addEventListener('click', close);
    document.getElementById('studyCancelBtn').addEventListener('click', close);

    // Preencher campos se for edição
    if (existingStudy) {
        document.getElementById('studyType').value = existingStudy.tipo || 'geral';
        document.getElementById('studySubject').value = existingStudy.materia || '';
        document.getElementById('studyMinutes').value = existingStudy.minutos || 60;
    }

    document.getElementById('studyForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const tipo = document.getElementById('studyType').value;
        const materia = document.getElementById('studySubject').value.trim().toUpperCase();
        const minutos = parseInt(document.getElementById('studyMinutes').value, 10) || 0;

        if (!materia || minutos <= 0) return;

        if (isEditing) {
            // Atualizar estudo existente
            const index = gameSystem.data.estudos.findIndex(e => e.id === existingStudy.id);
            if (index >= 0) {
                // Recalcular atributos: remover o valor antigo e adicionar o novo
                const horasAntigas = existingStudy.minutos / 60;
                const horasNovas = minutos / 60;
                
                // Remover atributos do estudo antigo
                if (existingStudy.tipo === 'psicologia') {
                    gameSystem.data.percepcao = Math.max(0, gameSystem.data.percepcao - horasAntigas);
                } else {
                    gameSystem.data.inteligencia = Math.max(0, gameSystem.data.inteligencia - horasAntigas);
                }
                
                // Adicionar atributos do estudo novo
                if (tipo === 'psicologia') {
                    gameSystem.addPercepcao(horasNovas);
                } else {
                    gameSystem.addInteligencia(horasNovas);
                }
                
                // Recalcular XP de habilidade: remover XP antigo e adicionar novo
                if (existingStudy.materia && existingStudy.materia !== materia) {
                    // Se mudou a matéria, remover XP da habilidade antiga
                    const horasAntigasEstudo = horasAntigas;
                    const skillAntiga = (gameSystem.data.habilidades || []).find(s => 
                        s.nome.toUpperCase() === existingStudy.materia.toUpperCase() && s.tipo === 'estudo'
                    );
                    if (skillAntiga) {
                        // Remover XP proporcional (mínimo 0)
                        skillAntiga.xp = Math.max(0, skillAntiga.xp - (horasAntigasEstudo * 10));
                    }
                }
                
                // Atualizar estudo
                gameSystem.data.estudos[index] = {
                    ...existingStudy,
                    tipo,
                    materia,
                    minutos
                };
                
                // Adicionar XP na nova habilidade
                gameSystem.addSkillXp(materia, horasNovas);
            }
        } else {
            // Criar novo estudo
            const estudo = {
                id: Date.now(),
                tipo,
                materia,
                minutos,
                data: new Date().toISOString()
            };

            if (!Array.isArray(gameSystem.data.estudos)) {
                gameSystem.data.estudos = [];
            }
            gameSystem.data.estudos.push(estudo);

            // Converter minutos em horas para atributos (só para novos estudos)
            const horas = minutos / 60;
            if (tipo === 'psicologia') {
                gameSystem.addPercepcao(horas);
            } else {
                gameSystem.addInteligencia(horas);
            }

            // Adicionar XP na habilidade se o nome da matéria bater com uma habilidade
            gameSystem.addSkillXp(materia, horas);
        }

        gameSystem.saveData();
        renderStudies();
        if (typeof renderProgressCharts === 'function') {
            setTimeout(() => renderProgressCharts(), 100);
        }
        gameSystem.checkTitles();
        
        // Atualizar habilidades após adicionar/editar estudo
        if (typeof updateSkillsDisplay === 'function') {
            updateSkillsDisplay();
        }
        if (typeof renderSkillsInTraining === 'function') {
            renderSkillsInTraining();
        }

        gameSystem.addNotification(
            isEditing ? 'ESTUDO ATUALIZADO!' : 'ESTUDO REGISTRADO!',
            `Estudo "${materia}" ${isEditing ? 'atualizado' : 'registrado'} (${minutos} min, ${tipo === 'psicologia' ? 'PSICOLOGIA' : 'GERAL'}).`,
            'info'
        );

        close();
    });
}

function initTasksSystem() {
    if (!gameSystem) return;

    const addHabitBtn = document.getElementById('addHabitBtn');
    const addMissionBtn = document.getElementById('addMissionBtn');
    const viewAllTasksBtn = document.getElementById('viewAllTasksBtn');

    addHabitBtn && addHabitBtn.addEventListener('click', () => {
        showTaskModal('habito');
    });

    addMissionBtn && addMissionBtn.addEventListener('click', () => {
        showTaskModal('missao');
    });

    viewAllTasksBtn && viewAllTasksBtn.addEventListener('click', () => {
        showAllTasksModal();
    });

    renderTasks();
}

function initSkillsSystem() {
    if (!gameSystem) return;
    
    // Renderizar habilidades na seção de STATUS
    updateSkillsDisplay();
    
    // Renderizar runas na seção de STATUS
    updateRunesDisplay();
    
    // Renderizar habilidades em TRAINNE
    renderSkillsInTraining();
}

function updateSkillsDisplay() {
    const skillsList = document.getElementById('skillsList');
    if (!skillsList || !gameSystem) return;

    const habilidades = (gameSystem.data.habilidades || []).filter(h => h.tipo === 'estudo' || h.tipo === 'combate');

    if (habilidades.length === 0) {
        skillsList.innerHTML = '<div class="section-text">NENHUMA HABILIDADE CADASTRADA</div>';
        return;
    }

    skillsList.innerHTML = habilidades.map(skill => {
        const percentage = (skill.xp / skill.xpNextLevel) * 100;
        return `
            <div class="skill-item" style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span class="skill-name">${skill.nome}</span>
                    <span class="skill-level">NÍVEL ${skill.level}</span>
                </div>
                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; height: 20px; position: relative; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #44ff44, #66ff66); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffffff; font-size: 11px; font-weight: bold; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">
                        ${skill.xp} / ${skill.xpNextLevel} XP
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateRunesDisplay() {
    const runesList = document.getElementById('runesList');
    if (!runesList || !gameSystem) return;

    const runas = (gameSystem.data.runas || []).filter(r => r.desbloqueada);

    if (runas.length === 0) {
        runesList.innerHTML = '<div class="section-text">NENHUMA RUNA DESBLOQUEADA</div>';
        return;
    }

    runesList.innerHTML = runas.map(runa => {
        const skill = (gameSystem.data.habilidades || []).find(s => s.runaId === runa.id);
        const isActive = runa.ativa && runa.activeUntil && new Date(runa.activeUntil) > new Date();
        const timeLeft = isActive ? Math.ceil((new Date(runa.activeUntil) - new Date()) / 60000) : 0;
        
        return `
            <div class="skill-item" style="margin-bottom: 12px; ${isActive ? 'border: 1px solid rgba(68, 255, 68, 0.5); padding: 8px; border-radius: 4px;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span class="skill-name">${runa.nome}</span>
                    <span class="skill-level" style="font-size: 11px;">${skill ? `Habilidade: ${skill.nome} (Lv ${skill.level})` : ''}</span>
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.8); margin-bottom: 6px;">
                    ${runa.descricao || 'Sem descrição'}
                </div>
                <div style="display: flex; gap: 5px; align-items: center; font-size: 11px; margin-bottom: 6px;">
                    <span>MP: ${runa.mpCost}</span>
                    <span>|</span>
                    <span>Duração: ${runa.duration} min</span>
                    ${isActive ? `<span style="color: #44ff44;">| ATIVA (${timeLeft} min restantes)</span>` : ''}
                </div>
                <button class="form-btn submit-btn task-small-btn" onclick="useRune(${runa.id})" ${isActive || gameSystem.data.mp < runa.mpCost ? 'disabled' : ''} style="width: 100%; font-size: 11px; padding: 5px;">
                    ${isActive ? 'ATIVA' : gameSystem.data.mp < runa.mpCost ? 'MP INSUFICIENTE' : 'ATIVAR RUNA'}
                </button>
            </div>
        `;
    }).join('');
}

function useRune(runeId) {
    if (!gameSystem) return;
    
    const runa = (gameSystem.data.runas || []).find(r => r.id === runeId);
    if (!runa || !runa.desbloqueada) return;
    
    // Verificar se já está ativa
    if (runa.ativa && runa.activeUntil && new Date(runa.activeUntil) > new Date()) {
        alert('Esta runa já está ativa!');
        return;
    }
    
    // Verificar MP
    if (gameSystem.data.mp < runa.mpCost) {
        alert('MP insuficiente!');
        return;
    }
    
    // Gastar MP
    gameSystem.useMp(runa.mpCost);
    
    // Ativar runa
    const now = new Date();
    runa.ativa = true;
    runa.activeUntil = new Date(now.getTime() + runa.duration * 60000).toISOString();
    
    gameSystem.saveData();
    updateRunesDisplay();
    gameSystem.addNotification(
        'RUNA ATIVADA!',
        `Runa "${runa.nome}" foi ativada por ${runa.duration} minutos!`,
        'info'
    );
}

// Verificar runas ativas periodicamente
setInterval(() => {
    if (!gameSystem) return;
    
    const now = new Date();
    let updated = false;
    
    (gameSystem.data.runas || []).forEach(runa => {
        if (runa.ativa && runa.activeUntil) {
            if (new Date(runa.activeUntil) <= now) {
                runa.ativa = false;
                runa.activeUntil = null;
                updated = true;
            }
        }
    });
    
    if (updated) {
        gameSystem.saveData();
        updateRunesDisplay();
    }
}, 60000); // Verificar a cada minuto

function renderSkillsInTraining() {
    const container = document.querySelector('#trainneSection .trainne-info');
    if (!container || !gameSystem) return;

    // Aguardar um pouco para garantir que renderStudies já executou
    setTimeout(() => {
        const studiesSection = document.getElementById('studiesSection');
        if (!studiesSection) return;

        // Remover seção de habilidades existente se houver
        const existingSkillsSection = document.getElementById('skillsInTrainingSection');
        if (existingSkillsSection) {
            existingSkillsSection.remove();
        }

        const habilidadesEstudo = (gameSystem.data.habilidades || []).filter(h => h.tipo === 'estudo');
        const habilidadesCombate = (gameSystem.data.habilidades || []).filter(h => h.tipo === 'combate');
        const totalHabilidades = habilidadesEstudo.length + habilidadesCombate.length;

        const skillsHtml = `
            <div id="skillsInTrainingSection" style="margin-top: 30px;">
                <div class="section-divider"></div>
                <div style="margin-top: 10px;">
                    <div class="stat-item">
                        <span class="label">HABILIDADES CADASTRADAS:</span>
                        <span class="value">${totalHabilidades}</span>
                    </div>
                    <div style="margin-top: 10px;">
                        <button class="form-btn submit-btn" id="addSkillBtn" style="width: 100%;">CADASTRAR HABILIDADE</button>
                    </div>
                    
                    ${habilidadesEstudo.length > 0 ? `
                        <div style="margin-top: 20px;">
                            <div class="section-header">
                                <span class="section-header-text">&lt;HABILIDADES DE ESTUDO&gt;</span>
                            </div>
                            <div class="trainings-list" style="margin-top: 10px;">
                                ${habilidadesEstudo.map(skill => {
                                    const percentage = (skill.xp / skill.xpNextLevel) * 100;
                                    return `
                                        <div class="training-item" data-skill-id="${skill.id}">
                                            <div class="training-header">
                                                <span class="training-name">${skill.nome}</span>
                                                <span class="training-type">[NÍVEL ${skill.level}]</span>
                                            </div>
                                            <div class="training-details">
                                                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; height: 18px; position: relative; overflow: hidden; margin-top: 8px;">
                                                    <div style="background: linear-gradient(90deg, #44ff44, #66ff66); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffffff; font-size: 10px; font-weight: bold; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">
                                                        ${skill.xp} / ${skill.xpNextLevel} XP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${habilidadesCombate.length > 0 ? `
                        <div style="margin-top: 20px;">
                            <div class="section-header">
                                <span class="section-header-text">&lt;HABILIDADES DE COMBATE&gt;</span>
                            </div>
                            <div class="trainings-list" style="margin-top: 10px;">
                                ${habilidadesCombate.map(skill => {
                                    const percentage = (skill.xp / skill.xpNextLevel) * 100;
                                    return `
                                        <div class="training-item" data-skill-id="${skill.id}">
                                            <div class="training-header">
                                                <span class="training-name">${skill.nome}</span>
                                                <span class="training-type">[NÍVEL ${skill.level}]</span>
                                            </div>
                                            <div class="training-details">
                                                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; height: 18px; position: relative; overflow: hidden; margin-top: 8px;">
                                                    <div style="background: linear-gradient(90deg, #ff4444, #ff6666); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffffff; font-size: 10px; font-weight: bold; text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000000, -1px 1px 0 #000000, 1px 1px 0 #000000;">
                                                        ${skill.xp} / ${skill.xpNextLevel} XP
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        studiesSection.insertAdjacentHTML('afterend', skillsHtml);

        // Event listener para botão de cadastrar habilidade
        const addSkillBtn = document.getElementById('addSkillBtn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                showSkillModal();
            });
        }
    }, 100);
}

function renderProgressCharts() {
    const container = document.querySelector('#trainneSection .trainne-info');
    if (!container || !gameSystem) return;

    // Remover gráficos existentes se houver
    const existingCharts = document.getElementById('progressChartsSection');
    if (existingCharts) {
        existingCharts.remove();
    }

    // Calcular dados dos últimos 7 dias
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
    
    // Dados de treinos por dia
    const treinosPorDia = [];
    const estudosPorDia = [];
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 86400000);
        const dateKey = date.toDateString();
        
        // Contar treinos do dia
        const treinosDia = gameSystem.data.treinos.filter(t => {
            const tDate = new Date(t.data);
            return tDate.toDateString() === dateKey;
        }).length;
        
        // Contar horas de estudo do dia
        const estudosDia = (gameSystem.data.estudos || []).filter(e => {
            const eDate = new Date(e.data);
            return eDate.toDateString() === dateKey;
        }).reduce((sum, e) => sum + (e.minutos || 0), 0) / 60; // Converter para horas
        
        treinosPorDia.push(treinosDia);
        estudosPorDia.push(parseFloat(estudosDia.toFixed(1)));
    }

    const maxTreinos = Math.max(1, ...treinosPorDia);
    const maxEstudos = Math.max(1, ...estudosPorDia);

    const chartsHtml = `
        <div id="progressChartsSection" style="margin-top: 30px;">
            <div class="section-divider"></div>
            <div style="margin-top: 15px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;GRÁFICOS DE PROGRESSO SEMANAL&gt;</span>
                </div>
                
                <div style="margin-top: 15px;">
                    <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-bottom: 8px; font-weight: bold;">TREINOS POR DIA (ÚLTIMOS 7 DIAS):</div>
                    <canvas id="treinosChart" width="600" height="150" style="max-width: 100%; height: auto; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 10px;"></canvas>
                </div>
                
                <div style="margin-top: 20px;">
                    <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-bottom: 8px; font-weight: bold;">ESTUDOS POR DIA (ÚLTIMOS 7 DIAS) - HORAS:</div>
                    <canvas id="estudosChart" width="600" height="150" style="max-width: 100%; height: auto; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 10px;"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar gráfico de desempenho de carga
    setTimeout(() => {
        renderPerformanceChart();
    }, 200);

    const skillsSection = document.getElementById('skillsInTrainingSection');
    if (skillsSection) {
        skillsSection.insertAdjacentHTML('afterend', chartsHtml);
    } else {
        const studiesSection = document.getElementById('studiesSection');
        if (studiesSection) {
            studiesSection.insertAdjacentHTML('afterend', chartsHtml);
        }
    }

    // Aguardar um pouco para garantir que o HTML foi inserido
    setTimeout(() => {
        // Desenhar gráfico de treinos
        const treinosCanvas = document.getElementById('treinosChart');
        if (treinosCanvas) {
            const ctx = treinosCanvas.getContext('2d');
            const width = treinosCanvas.width;
            const height = treinosCanvas.height;
            const padding = 40;
            const chartWidth = width - padding * 2;
            const chartHeight = height - padding * 2;
            const barWidth = chartWidth / 7;
            
            // Limpar canvas
            ctx.clearRect(0, 0, width, height);
            
            // Fundo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, width, height);
            
            // Desenhar barras
            treinosPorDia.forEach((valor, index) => {
                const x = padding + index * barWidth + barWidth * 0.1;
                const barHeight = (valor / maxTreinos) * chartHeight;
                const y = padding + chartHeight - barHeight;
                
                // Barra
                const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
                gradient.addColorStop(0, '#ff4444');
                gradient.addColorStop(1, '#ff6666');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth * 0.8, barHeight);
                
                // Borda
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, barWidth * 0.8, barHeight);
                
                // Valor no topo da barra
                if (valor > 0) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 11px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(valor.toString(), x + barWidth * 0.4, y - 5);
                }
                
                // Dia da semana
                let dayIndex = (now.getDay() - 6 + index) % 7;
                if (dayIndex < 0) dayIndex += 7;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(diasSemana[dayIndex], x + barWidth * 0.4, height - 10);
            });
            
            // Eixo Y (valores)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '9px Arial';
            ctx.textAlign = 'right';
            for (let i = 0; i <= maxTreinos; i++) {
                const y = padding + chartHeight - (i / maxTreinos) * chartHeight;
                ctx.fillText(i.toString(), padding - 5, y + 3);
            }
        }

        // Desenhar gráfico de estudos
        const estudosCanvas = document.getElementById('estudosChart');
        if (estudosCanvas) {
            const ctx = estudosCanvas.getContext('2d');
            const width = estudosCanvas.width;
            const height = estudosCanvas.height;
            const padding = 40;
            const chartWidth = width - padding * 2;
            const chartHeight = height - padding * 2;
            const barWidth = chartWidth / 7;
            
            // Limpar canvas
            ctx.clearRect(0, 0, width, height);
            
            // Fundo
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, width, height);
            
            // Desenhar barras
            estudosPorDia.forEach((valor, index) => {
                const x = padding + index * barWidth + barWidth * 0.1;
                const barHeight = (valor / maxEstudos) * chartHeight;
                const y = padding + chartHeight - barHeight;
                
                // Barra
                const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
                gradient.addColorStop(0, '#4444ff');
                gradient.addColorStop(1, '#6666ff');
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y, barWidth * 0.8, barHeight);
                
                // Borda
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, barWidth * 0.8, barHeight);
                
                // Valor no topo da barra
                if (valor > 0) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 11px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(valor.toFixed(1) + 'h', x + barWidth * 0.4, y - 5);
                }
                
                // Dia da semana
                let dayIndex = (now.getDay() - 6 + index) % 7;
                if (dayIndex < 0) dayIndex += 7;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(diasSemana[dayIndex], x + barWidth * 0.4, height - 10);
            });
            
            // Eixo Y (valores)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '9px Arial';
            ctx.textAlign = 'right';
            for (let i = 0; i <= Math.ceil(maxEstudos); i++) {
                const y = padding + chartHeight - (i / maxEstudos) * chartHeight;
                ctx.fillText(i.toString(), padding - 5, y + 3);
            }
        }
    }, 100);
}

function renderPerformanceChart() {
    const container = document.querySelector('#trainneSection .trainne-info');
    if (!container || !gameSystem) return;

    // Remover gráfico de desempenho existente se houver
    const existingChart = document.getElementById('performanceChartSection');
    if (existingChart) {
        existingChart.remove();
    }

    // Pegar todos os treinos concluídos, ordenados por data
    const treinosConcluidos = gameSystem.data.treinos
        .filter(t => t.concluido && t.carga > 0)
        .sort((a, b) => new Date(a.data) - new Date(b.data));

    if (treinosConcluidos.length === 0) {
        return; // Não mostrar gráfico se não houver treinos concluídos com carga
    }

    // Agrupar por nome do exercício
    const exerciciosMap = {};
    treinosConcluidos.forEach(treino => {
        const nome = treino.nome;
        if (!exerciciosMap[nome]) {
            exerciciosMap[nome] = [];
        }
        exerciciosMap[nome].push({
            data: new Date(treino.data),
            carga: treino.carga,
            series: treino.series,
            repeticoes: treino.repeticoes
        });
    });

    // Ordenar cada grupo por data
    Object.keys(exerciciosMap).forEach(nome => {
        exerciciosMap[nome].sort((a, b) => a.data - b.data);
    });

    const exerciciosNomes = Object.keys(exerciciosMap);
    
    // Criar HTML do gráfico
    const chartHtml = `
        <div id="performanceChartSection" style="margin-top: 30px;">
            <div class="section-divider"></div>
            <div style="margin-top: 15px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;GRÁFICO DE DESEMPENHO - PROGRESSÃO DE CARGA&gt;</span>
                </div>
                
                ${exerciciosNomes.length > 0 ? `
                    <div style="margin-top: 15px;">
                        <label class="form-label" style="font-size: 12px; margin-bottom: 8px; display: block;">Selecione o exercício:</label>
                        <select id="exerciseSelector" class="form-select" style="width: 100%; margin-bottom: 10px;">
                            ${exerciciosNomes.map(nome => `<option value="${nome}">${nome}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div style="margin-top: 10px;">
                        <canvas id="performanceChart" width="600" height="200" style="max-width: 100%; height: auto; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; padding: 10px;"></canvas>
                    </div>
                ` : '<div class="section-text">Nenhum treino concluído com carga registrada ainda.</div>'}
            </div>
        </div>
    `;

    const progressChartsSection = document.getElementById('progressChartsSection');
    if (progressChartsSection) {
        progressChartsSection.insertAdjacentHTML('afterend', chartHtml);
    }

    // Função para desenhar o gráfico
    const drawPerformanceChart = (exercicioNome) => {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const dados = exerciciosMap[exercicioNome];
        if (!dados || dados.length === 0) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 50;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        // Fundo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // Calcular valores máximos e mínimos
        const cargas = dados.map(d => d.carga);
        const maxCarga = Math.max(...cargas);
        const minCarga = Math.min(...cargas);
        const rangeCarga = maxCarga - minCarga || 1;

        // Desenhar grade
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Desenhar linha de progressão
        ctx.strokeStyle = '#ffaa44';
        ctx.lineWidth = 2;
        ctx.beginPath();

        dados.forEach((dado, index) => {
            const x = padding + (chartWidth / (dados.length - 1 || 1)) * index;
            const y = padding + chartHeight - ((dado.carga - minCarga) / rangeCarga) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Desenhar pontos
        dados.forEach((dado, index) => {
            const x = padding + (chartWidth / (dados.length - 1 || 1)) * index;
            const y = padding + chartHeight - ((dado.carga - minCarga) / rangeCarga) * chartHeight;

            // Círculo
            ctx.fillStyle = '#ffaa44';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Borda
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Valor da carga
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${dado.carga}kg`, x, y - 10);

            // Data (formato curto)
            const dataStr = dado.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '9px Arial';
            ctx.fillText(dataStr, x, height - 15);
        });

        // Eixo Y (carga)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '9px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const valor = minCarga + (rangeCarga / 5) * i;
            const y = padding + chartHeight - (i / 5) * chartHeight;
            ctx.fillText(valor.toFixed(1) + 'kg', padding - 5, y + 3);
        }

        // Título do eixo Y
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CARGA (kg)', 0, 0);
        ctx.restore();

        // Informações adicionais
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        const ultimoDado = dados[dados.length - 1];
        ctx.fillText(`Séries: ${ultimoDado.series} | Reps: ${ultimoDado.repeticoes}`, padding, height - 5);
    };

    // Aguardar um pouco para garantir que o HTML foi inserido
    setTimeout(() => {
        const selector = document.getElementById('exerciseSelector');
        if (selector && exerciciosNomes.length > 0) {
            // Desenhar gráfico inicial
            drawPerformanceChart(exerciciosNomes[0]);

            // Event listener para mudança de exercício
            selector.addEventListener('change', function() {
                drawPerformanceChart(this.value);
            });
        }
    }, 100);
}

function showSkillModal() {
    if (!gameSystem) return;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'skillModal';

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 600px;">
            <div class="settings-header">
                <h3 class="settings-title">CADASTRAR HABILIDADE</h3>
                <button class="settings-close" id="skillModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="skillForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Nome da Habilidade:</label>
                        <input type="text" id="skillName" class="form-input" placeholder="Ex: PROGRAMAÇÃO, INGLÊS, PSICOLOGIA COGNITIVA" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tipo:</label>
                        <select id="skillType" class="form-select" required>
                            <option value="estudo" selected>Estudo</option>
                            <option value="combate">Combate</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Atributo Vinculado (opcional):</label>
                        <select id="skillAttribute" class="form-select">
                            <option value="">Nenhum</option>
                            <option value="inteligencia">INTELIGÊNCIA</option>
                            <option value="percepcao">PERCEPÇÃO</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <label class="form-label" style="font-weight: bold; color: rgba(255,255,255,0.9);">RUNA DA HABILIDADE (desbloqueia no nível 5):</label>
                        <div class="form-group" style="margin-top: 10px;">
                            <label class="form-label">Nome da Runa:</label>
                            <input type="text" id="runeName" class="form-input" placeholder="Ex: RUNA DE PROGRAMAÇÃO">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descrição do Buff:</label>
                            <textarea id="runeDescription" class="form-input" rows="2" placeholder="Ex: Aumenta ganho de EXP em estudos de programação em 20%"></textarea>
                        </div>
                        <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>
                                <label class="form-label">Custo de MP:</label>
                                <input type="number" id="runeMpCost" class="form-input" min="1" value="50">
                            </div>
                            <div>
                                <label class="form-label">Duração (minutos):</label>
                                <input type="number" id="runeDuration" class="form-input" min="1" value="60">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Tipo de Buff:</label>
                            <select id="runeBuffType" class="form-select">
                                <option value="exp_multiplier">Multiplicador de EXP</option>
                                <option value="attribute_boost">Bônus de Atributo</option>
                                <option value="coin_multiplier">Multiplicador de Moedas</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Valor do Buff (% ou valor fixo):</label>
                            <input type="number" id="runeBuffValue" class="form-input" min="0" step="0.1" value="20" placeholder="Ex: 20 para +20%">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="skillCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">CADASTRAR</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('skillModalClose').addEventListener('click', close);
    document.getElementById('skillCancelBtn').addEventListener('click', close);

    document.getElementById('skillForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('skillName').value.trim().toUpperCase();
        const tipo = document.getElementById('skillType').value;
        const atributo = document.getElementById('skillAttribute').value || null;

        if (!nome) return;

        // Coletar dados da runa (se preenchidos)
        const runeName = document.getElementById('runeName').value.trim();
        let runeData = null;
        
        if (runeName) {
            runeData = {
                nome: runeName,
                descricao: document.getElementById('runeDescription').value.trim() || '',
                mpCost: parseInt(document.getElementById('runeMpCost').value, 10) || 50,
                duration: parseInt(document.getElementById('runeDuration').value, 10) || 60,
                buffType: document.getElementById('runeBuffType').value || 'exp_multiplier',
                buffValue: parseFloat(document.getElementById('runeBuffValue').value) || 20
            };
        }

        const skill = gameSystem.createSkill(nome, tipo, atributo, runeData);

        if (!skill) {
            alert('Esta habilidade já está cadastrada!');
            return;
        }

        let message = `Habilidade "${nome}" foi adicionada ao seu sistema.`;
        if (runeData) {
            message += ` Runa será desbloqueada no nível 5.`;
        }

        gameSystem.addNotification(
            'HABILIDADE CADASTRADA!',
            message,
            'info'
        );

        updateSkillsDisplay();
        updateRunesDisplay();
        renderSkillsInTraining();
        close();
    });
}

function initShopSystem() {
    const shopTabBtns = document.querySelectorAll('.shop-tab-btn');
    const shopItemsList = document.getElementById('shopItemsList');
    
    if (!shopItemsList || !gameSystem) return;
    
    // Inicializar recompensas se não existir
    if (!Array.isArray(gameSystem.data.recompensas)) {
        gameSystem.data.recompensas = [];
    }
    if (!Array.isArray(gameSystem.data.inventario)) {
        gameSystem.data.inventario = [];
    }
    
    const shopData = {
        recompensas: gameSystem.data.recompensas || [],
        pocoes: [
            { icon: '🧪', name: 'POÇÃO DE CURA PEQUENA', price: 12000, hpRecovery: 200, type: 'pocao' },
            { icon: '🧪', name: 'POÇÃO DE CURA MÉDIA', price: 25000, hpRecovery: 500, type: 'pocao' },
            { icon: '🧪', name: 'POÇÃO DE CURA GRANDE', price: 50000, hpRecovery: 1000, type: 'pocao' },
            { icon: '🧪', name: 'ELIXIR RARO', price: 120000, hpRecovery: 2000, type: 'pocao' }
        ]
    };
    
    window.shopData = shopData;
    
    function renderInventory() {
        const inventario = gameSystem.data.inventario || [];
        
        // Agrupar itens por tipo
        const pocoes = inventario.filter(i => i.type === 'pocao');
        const recompensas = inventario.filter(i => i.type === 'recompensa');
        
        shopItemsList.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;POÇÕES (${pocoes.length})&gt;</span>
                </div>
                ${pocoes.length > 0 ? pocoes.map((item, index) => {
                    const realIndex = inventario.indexOf(item);
                    const iconHtml = item.iconImage 
                        ? `<img src="${item.iconImage}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain;">`
                        : (item.icon || '🧪');
                    return `
                        <div class="shop-item-box" style="margin-bottom: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="font-size: 32px;">${iconHtml}</div>
                                <div style="flex: 1;">
                                    <div class="shop-item-name">${item.name}</div>
                                    <div style="font-size: 11px; color: rgba(255,255,255,0.7);">Quantidade: ${item.quantity}</div>
                                    ${item.hpRecovery ? `<div style="font-size: 10px; color: rgba(68,255,68,0.8);">+${item.hpRecovery} HP</div>` : ''}
                                </div>
                                <button class="form-btn submit-btn task-small-btn" onclick="useInventoryItem(${realIndex})" style="font-size: 10px; padding: 6px;">USAR</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<div class="section-text">Nenhuma poção no inventário.</div>'}
            </div>
            
            <div style="margin-top: 30px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;RECOMPENSAS/GIFTS (${recompensas.length})&gt;</span>
                </div>
                ${recompensas.length > 0 ? recompensas.map((item, index) => {
                    const realIndex = inventario.indexOf(item);
                    const iconHtml = item.iconImage 
                        ? `<img src="${item.iconImage}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain;">`
                        : (item.icon || '🎁');
                    return `
                        <div class="shop-item-box" style="margin-bottom: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="font-size: 32px;">${iconHtml}</div>
                                <div style="flex: 1;">
                                    <div class="shop-item-name">${item.name}</div>
                                    <div style="font-size: 11px; color: rgba(255,255,255,0.7);">Quantidade: ${item.quantity}</div>
                                </div>
                                <button class="form-btn submit-btn task-small-btn" onclick="useInventoryItem(${realIndex})" style="font-size: 10px; padding: 6px;">USAR</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<div class="section-text">Nenhuma recompensa no inventário.</div>'}
            </div>
        `;
    }
    
    function renderShopItems(category) {
        if (category === 'inventario') {
            renderInventory();
            return;
        }
        
        const items = shopData[category] || [];
        
        if (category === 'recompensas') {
            shopItemsList.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <button class="form-btn submit-btn" id="addRewardBtn" style="width: 100%;">ADICIONAR RECOMPENSA</button>
                </div>
                ${items.length > 0 ? items.map((item, index) => {
                    const iconHtml = item.iconImage 
                        ? `<img src="${item.iconImage}" alt="${item.name}" class="shop-item-icon-img">`
                        : (item.icon || '🎁');
                    return `
                        <div class="shop-item-box" data-item-index="${index}" data-item-name="${item.name}" data-item-price="${item.price}" data-item-icon="${item.icon || ''}" data-item-icon-image="${item.iconImage || ''}" data-item-type="recompensa">
                            <div class="shop-item-icon">${iconHtml}</div>
                            <div class="shop-item-name">${item.name}</div>
                            <div class="shop-item-price">${item.price.toLocaleString('pt-BR')} G</div>
                            <div style="display: flex; gap: 5px; margin-top: 8px;">
                                <button class="form-btn task-small-btn task-edit-btn" onclick="editReward(${index})" style="flex: 1; font-size: 10px; padding: 4px;">EDITAR</button>
                                <button class="form-btn task-small-btn task-delete-btn" onclick="deleteReward(${index})" style="flex: 1; font-size: 10px; padding: 4px;">EXCLUIR</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<div class="section-text">Nenhuma recompensa cadastrada. Clique em "ADICIONAR RECOMPENSA" para criar uma.</div>'}
            `;
        } else {
            shopItemsList.innerHTML = items.map(item => {
                const iconHtml = item.iconImage 
                    ? `<img src="${item.iconImage}" alt="${item.name}" class="shop-item-icon-img">`
                    : item.icon;
                return `
                    <div class="shop-item-box" data-item-name="${item.name}" data-item-price="${item.price}" data-item-icon="${item.icon || ''}" data-item-icon-image="${item.iconImage || ''}" data-item-hp="${item.hpRecovery || 0}" data-item-type="${item.type || 'pocao'}">
                        <div class="shop-item-icon">${iconHtml}</div>
                        <div class="shop-item-name">${item.name}</div>
                        <div class="shop-item-price">${item.price.toLocaleString('pt-BR')} G</div>
                        ${item.hpRecovery ? `<div style="font-size: 10px; color: rgba(68,255,68,0.8); margin-top: 4px;">+${item.hpRecovery} HP</div>` : ''}
                    </div>
                `;
            }).join('');
        }
        
        bindShopItemClicks();
        
        // Event listener para botão de adicionar recompensa
        if (category === 'recompensas') {
            const addBtn = document.getElementById('addRewardBtn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    showRewardModal();
                });
            }
        }
    }
    
    function renderInventory() {
        const inventario = gameSystem.data.inventario || [];
        
        // Agrupar itens por tipo
        const pocoes = inventario.filter(i => i.type === 'pocao');
        const recompensas = inventario.filter(i => i.type === 'recompensa');
        
        shopItemsList.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;POÇÕES (${pocoes.length})&gt;</span>
                </div>
                ${pocoes.length > 0 ? pocoes.map((item) => {
                    const realIndex = inventario.indexOf(item);
                    const iconHtml = item.iconImage 
                        ? `<img src="${item.iconImage}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain;">`
                        : (item.icon || '🧪');
                    return `
                        <div class="shop-item-box" style="margin-bottom: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="font-size: 32px;">${iconHtml}</div>
                                <div style="flex: 1;">
                                    <div class="shop-item-name">${item.name}</div>
                                    <div style="font-size: 11px; color: rgba(255,255,255,0.7);">Quantidade: ${item.quantity}</div>
                                    ${item.hpRecovery ? `<div style="font-size: 10px; color: rgba(68,255,68,0.8);">+${item.hpRecovery} HP</div>` : ''}
                                </div>
                                <button class="form-btn submit-btn task-small-btn" onclick="useInventoryItem(${realIndex})" style="font-size: 10px; padding: 6px;">USAR</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<div class="section-text">Nenhuma poção no inventário.</div>'}
            </div>
            
            <div style="margin-top: 30px;">
                <div class="section-header">
                    <span class="section-header-text">&lt;RECOMPENSAS/GIFTS (${recompensas.length})&gt;</span>
                </div>
                ${recompensas.length > 0 ? recompensas.map((item) => {
                    const realIndex = inventario.indexOf(item);
                    const iconHtml = item.iconImage 
                        ? `<img src="${item.iconImage}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain;">`
                        : (item.icon || '🎁');
                    return `
                        <div class="shop-item-box" style="margin-bottom: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="font-size: 32px;">${iconHtml}</div>
                                <div style="flex: 1;">
                                    <div class="shop-item-name">${item.name}</div>
                                    <div style="font-size: 11px; color: rgba(255,255,255,0.7);">Quantidade: ${item.quantity}</div>
                                </div>
                                <button class="form-btn submit-btn task-small-btn" onclick="useInventoryItem(${realIndex})" style="font-size: 10px; padding: 6px;">USAR</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<div class="section-text">Nenhuma recompensa no inventário.</div>'}
            </div>
        `;
    }
    
    function bindShopItemClicks() {
        const boxes = document.querySelectorAll('.shop-item-box');
        boxes.forEach(box => {
            box.addEventListener('click', () => openShopModal(box));
        });
    }
    
    shopTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            shopTabBtns.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            const shopTab = this.getAttribute('data-shop-tab');
            if (shopTab === 'inventario') {
                renderInventory();
            } else {
                renderShopItems(shopTab);
            }
        });
    });
    
    renderShopItems('recompensas');
    
    // Tornar funções acessíveis globalmente
    window.renderShopItems = renderShopItems;
    window.renderInventory = renderInventory;
    window.editReward = editReward;
    window.deleteReward = deleteReward;
    window.useInventoryItem = useInventoryItem;
    window.showRewardModal = showRewardModal;
    
    // Modal de compra
    const shopModal = document.getElementById('shopModal');
    const modalItemName = document.getElementById('modalItemName');
    const modalItemIcon = document.getElementById('modalItemIcon');
    const modalItemPrice = document.getElementById('modalItemPrice');
    const modalQty = document.getElementById('modalQty');
    const modalCancel = document.getElementById('modalCancel');
    const modalBuy = document.getElementById('modalBuy');
    
    let currentItem = null;
    
    function formatGold(value) {
        return value.toLocaleString('pt-BR') + ' G';
    }
    
    function openShopModal(itemBox) {
        const name = itemBox.getAttribute('data-item-name');
        const price = Number(itemBox.getAttribute('data-item-price'));
        const icon = itemBox.getAttribute('data-item-icon') || '';
        const iconImage = itemBox.getAttribute('data-item-icon-image') || '';
        const hpRecovery = Number(itemBox.getAttribute('data-item-hp') || 0);
        const type = itemBox.getAttribute('data-item-type') || 'recompensa';
        
        currentItem = { name, price, icon, iconImage, hpRecovery, type };
        modalItemName.textContent = '[' + name + ']';
        
        if (iconImage) {
            modalItemIcon.innerHTML = `<img src="${iconImage}" alt="${name}" style="width: 100%; height: 100%; object-fit: contain;">`;
        } else {
            modalItemIcon.textContent = icon;
        }
        
        modalQty.value = 1;
        modalItemPrice.textContent = formatGold(price);
        
        // Atualizar saldo de moedas no modal
        const modalBalance = document.getElementById('modalBalance');
        if (modalBalance && gameSystem) {
            modalBalance.textContent = gameSystem.data.moedas.toLocaleString('pt-BR');
        }
        
        shopModal.classList.remove('hidden');
    }
    
    window.openShopModal = openShopModal;
    
    function closeShopModal() {
        shopModal.classList.add('hidden');
        currentItem = null;
    }
    
    modalQty && modalQty.addEventListener('input', () => {
        if (!currentItem) return;
        const qty = Math.max(1, Number(modalQty.value || 1));
        modalQty.value = qty;
        modalItemPrice.textContent = formatGold(currentItem.price * qty);
    });
    
    modalCancel && modalCancel.addEventListener('click', closeShopModal);
    shopModal && shopModal.addEventListener('click', (e) => {
        if (e.target.id === 'shopModal' || e.target.classList.contains('shop-modal-backdrop')) {
            closeShopModal();
        }
    });
    
    modalBuy && modalBuy.addEventListener('click', () => {
        if (!currentItem || !gameSystem) return;
        const qty = Number(modalQty.value || 1);
        const total = currentItem.price * qty;
        
        if (gameSystem.spendMoedas(total)) {
            // Adicionar ao inventário
            gameSystem.addToInventory({
                name: currentItem.name,
                icon: currentItem.icon,
                iconImage: currentItem.iconImage,
                hpRecovery: currentItem.hpRecovery || 0,
                type: currentItem.type || 'recompensa',
                price: currentItem.price
            }, qty);
            
            closeShopModal();
            gameSystem.addNotification('COMPRA REALIZADA!', `Você comprou ${qty}x ${currentItem.name}! Os itens foram adicionados ao inventário.`, 'coins');
            
            // Atualizar display se estiver na aba inventário
            const activeTab = document.querySelector('.shop-tab-btn.active');
            if (activeTab && activeTab.getAttribute('data-shop-tab') === 'inventario') {
                if (typeof window.renderInventory === 'function') {
                    window.renderInventory();
                }
            }
        } else {
            alert('Moedas insuficientes!');
        }
    });
}

// Funções para gerenciar recompensas (fora do initShopSystem para serem acessíveis)
function showRewardModal(existingReward = null, index = null) {
    if (!gameSystem) return;
    
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'rewardModal';
    const isEditing = existingReward !== null;
    
    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 600px;">
            <div class="settings-header">
                <h3 class="settings-title">${isEditing ? 'EDITAR RECOMPENSA' : 'ADICIONAR RECOMPENSA'}</h3>
                <button class="settings-close" id="rewardModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="rewardForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Nome da Recompensa:</label>
                        <input type="text" id="rewardName" class="form-input" placeholder="Ex: Ir ao cinema, Comprar um livro, Comer um doce" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ícone (emoji ou texto):</label>
                        <input type="text" id="rewardIcon" class="form-input" placeholder="Ex: 🎬, 📚, 🍰" value="🎁">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Preço (moedas):</label>
                        <input type="number" id="rewardPrice" class="form-input" min="1" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="rewardCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">${isEditing ? 'SALVAR' : 'ADICIONAR'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const close = () => modal.remove();
    
    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('rewardModalClose').addEventListener('click', close);
    document.getElementById('rewardCancelBtn').addEventListener('click', close);
    
    if (existingReward) {
        document.getElementById('rewardName').value = existingReward.name || '';
        document.getElementById('rewardIcon').value = existingReward.icon || '🎁';
        document.getElementById('rewardPrice').value = existingReward.price || 0;
    }
    
    document.getElementById('rewardForm').addEventListener('submit', function (e) {
        e.preventDefault();
        
        const name = document.getElementById('rewardName').value.trim().toUpperCase();
        const icon = document.getElementById('rewardIcon').value.trim() || '🎁';
        const price = parseInt(document.getElementById('rewardPrice').value, 10) || 0;
        
        if (!name || price <= 0) {
            alert('Preencha todos os campos corretamente!');
            return;
        }
        
        if (isEditing && index !== null) {
            gameSystem.data.recompensas[index] = { name, icon, price, type: 'recompensa' };
        } else {
            gameSystem.data.recompensas.push({ name, icon, price, type: 'recompensa' });
        }
        
        gameSystem.saveData();
        if (window.shopData) {
            window.shopData.recompensas = gameSystem.data.recompensas;
        }
        
        // Re-renderizar aba de recompensas
        const activeTab = document.querySelector('.shop-tab-btn.active');
        if (activeTab && activeTab.getAttribute('data-shop-tab') === 'recompensas') {
            if (typeof window.renderShopItems === 'function') {
                window.renderShopItems('recompensas');
            }
        }
        
        gameSystem.addNotification(
            isEditing ? 'RECOMPENSA ATUALIZADA!' : 'RECOMPENSA ADICIONADA!',
            `Recompensa "${name}" ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`,
            'info'
        );
        
        close();
    });
}

function editReward(index) {
    if (!gameSystem || !gameSystem.data.recompensas[index]) return;
    showRewardModal(gameSystem.data.recompensas[index], index);
}

function deleteReward(index) {
    if (!gameSystem || !gameSystem.data.recompensas[index]) return;
    if (!confirm('Deseja realmente excluir esta recompensa?')) return;
    
    const removed = gameSystem.data.recompensas.splice(index, 1)[0];
    gameSystem.saveData();
    if (window.shopData) {
        window.shopData.recompensas = gameSystem.data.recompensas;
    }
    
    // Re-renderizar aba de recompensas
    const activeTab = document.querySelector('.shop-tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-shop-tab') === 'recompensas') {
        if (typeof window.renderShopItems === 'function') {
            window.renderShopItems('recompensas');
        }
    }
    
    gameSystem.addNotification('RECOMPENSA REMOVIDA', `Recompensa "${removed.name}" foi removida.`, 'info');
}

function useInventoryItem(index) {
    if (!gameSystem) return;
    
    const inventario = gameSystem.data.inventario || [];
    if (!inventario[index] || inventario[index].quantity <= 0) return;
    
    const item = inventario[index];
    
    if (item.type === 'pocao' && item.hpRecovery > 0) {
        // Usar poção
        gameSystem.recoverHp(item.hpRecovery);
        item.quantity--;
        
        if (item.quantity <= 0) {
            inventario.splice(index, 1);
        }
        
        gameSystem.saveData();
        gameSystem.addNotification('POÇÃO USADA!', `Você recuperou ${item.hpRecovery} de HP!`, 'info');
        
        // Re-renderizar inventário
        if (typeof window.renderInventory === 'function') {
            window.renderInventory();
        }
    } else if (item.type === 'recompensa') {
        // Usar recompensa (gift)
        item.quantity--;
        
        if (item.quantity <= 0) {
            inventario.splice(index, 1);
        }
        
        gameSystem.saveData();
        gameSystem.addNotification('RECOMPENSA USADA!', `Você usou "${item.name}"! Aproveite!`, 'info');
        
        // Re-renderizar inventário
        if (typeof window.renderInventory === 'function') {
            window.renderInventory();
        }
    }
}

// Funções para gerenciar recompensas
function showRewardModal(existingReward = null, index = null) {
    if (!gameSystem) return;
    
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'rewardModal';
    const isEditing = existingReward !== null;
    
    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 600px;">
            <div class="settings-header">
                <h3 class="settings-title">${isEditing ? 'EDITAR RECOMPENSA' : 'ADICIONAR RECOMPENSA'}</h3>
                <button class="settings-close" id="rewardModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="rewardForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Nome da Recompensa:</label>
                        <input type="text" id="rewardName" class="form-input" placeholder="Ex: Ir ao cinema, Comprar um livro, Comer um doce" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ícone (emoji ou texto):</label>
                        <input type="text" id="rewardIcon" class="form-input" placeholder="Ex: 🎬, 📚, 🍰" value="🎁">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Preço (moedas):</label>
                        <input type="number" id="rewardPrice" class="form-input" min="1" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="rewardCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">${isEditing ? 'SALVAR' : 'ADICIONAR'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const close = () => modal.remove();
    
    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('rewardModalClose').addEventListener('click', close);
    document.getElementById('rewardCancelBtn').addEventListener('click', close);
    
    if (existingReward) {
        document.getElementById('rewardName').value = existingReward.name || '';
        document.getElementById('rewardIcon').value = existingReward.icon || '🎁';
        document.getElementById('rewardPrice').value = existingReward.price || 0;
    }
    
    document.getElementById('rewardForm').addEventListener('submit', function (e) {
        e.preventDefault();
        
        const name = document.getElementById('rewardName').value.trim().toUpperCase();
        const icon = document.getElementById('rewardIcon').value.trim() || '🎁';
        const price = parseInt(document.getElementById('rewardPrice').value, 10) || 0;
        
        if (!name || price <= 0) {
            alert('Preencha todos os campos corretamente!');
            return;
        }
        
        if (isEditing && index !== null) {
            gameSystem.data.recompensas[index] = { name, icon, price, type: 'recompensa' };
        } else {
            gameSystem.data.recompensas.push({ name, icon, price, type: 'recompensa' });
        }
        
        gameSystem.saveData();
        window.shopData.recompensas = gameSystem.data.recompensas;
        
        // Re-renderizar aba de recompensas
        const activeTab = document.querySelector('.shop-tab-btn.active');
        if (activeTab && activeTab.getAttribute('data-shop-tab') === 'recompensas') {
            renderShopItems('recompensas');
        }
        
        gameSystem.addNotification(
            isEditing ? 'RECOMPENSA ATUALIZADA!' : 'RECOMPENSA ADICIONADA!',
            `Recompensa "${name}" ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`,
            'info'
        );
        
        close();
    });
}

function editReward(index) {
    if (!gameSystem || !gameSystem.data.recompensas[index]) return;
    showRewardModal(gameSystem.data.recompensas[index], index);
}

function deleteReward(index) {
    if (!gameSystem || !gameSystem.data.recompensas[index]) return;
    if (!confirm('Deseja realmente excluir esta recompensa?')) return;
    
    const removed = gameSystem.data.recompensas.splice(index, 1)[0];
    gameSystem.saveData();
    window.shopData.recompensas = gameSystem.data.recompensas;
    
    // Re-renderizar aba de recompensas
    const activeTab = document.querySelector('.shop-tab-btn.active');
    if (activeTab && activeTab.getAttribute('data-shop-tab') === 'recompensas') {
        if (typeof window.renderShopItems === 'function') {
            window.renderShopItems('recompensas');
        }
    }
    
    gameSystem.addNotification('RECOMPENSA REMOVIDA', `Recompensa "${removed.name}" foi removida.`, 'info');
}

function useInventoryItem(index) {
    if (!gameSystem) return;
    
    const inventario = gameSystem.data.inventario || [];
    if (!inventario[index] || inventario[index].quantity <= 0) return;
    
    const item = inventario[index];
    
    if (item.type === 'pocao' && item.hpRecovery > 0) {
        // Usar poção
        gameSystem.recoverHp(item.hpRecovery);
        item.quantity--;
        
        if (item.quantity <= 0) {
            inventario.splice(index, 1);
        }
        
        gameSystem.saveData();
        gameSystem.addNotification('POÇÃO USADA!', `Você recuperou ${item.hpRecovery} de HP!`, 'info');
        
        // Re-renderizar inventário
        if (typeof window.renderInventory === 'function') {
            window.renderInventory();
        }
    } else if (item.type === 'recompensa') {
        // Usar recompensa (gift)
        item.quantity--;
        
        if (item.quantity <= 0) {
            inventario.splice(index, 1);
        }
        
        gameSystem.saveData();
        gameSystem.addNotification('RECOMPENSA USADA!', `Você usou "${item.name}"! Aproveite!`, 'info');
        
        // Re-renderizar inventário
        if (typeof window.renderInventory === 'function') {
            window.renderInventory();
        }
    }
}

function initPenaltySystem() {
    // Sistema já inicializado através de updatePenaltiesDisplay
}

function showManualPenaltyModal() {
    if (!gameSystem) return;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'manualPenaltyModal';

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 600px;">
            <div class="settings-header">
                <h3 class="settings-title">APLICAR PENALIDADE MANUAL</h3>
                <button class="settings-close" id="manualPenaltyModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="manualPenaltyForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Motivo da Penalidade:</label>
                        <select id="penaltyReason" class="form-select">
                            <option value="">Selecione um motivo comum...</option>
                            <option value="Fast Food">Fast Food / Comida não saudável</option>
                            <option value="Procrastinação">Procrastinação</option>
                            <option value="Falta de disciplina">Falta de disciplina</option>
                            <option value="Gastos desnecessários">Gastos desnecessários</option>
                            <option value="Falta de foco">Falta de foco</option>
                            <option value="Outro">Outro (especificar abaixo)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descrição (opcional):</label>
                        <textarea id="penaltyDescription" class="form-input" rows="3" placeholder="Descreva o que aconteceu..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Perda de HP:</label>
                        <input type="number" id="penaltyHpLoss" class="form-input" min="1" max="1000" value="200" required>
                        <div style="font-size: 10px; color: rgba(255,255,255,0.6); margin-top: 4px;">
                            Valor padrão: 200 HP (mesmo das penalidades automáticas)
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="manualPenaltyCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn" style="background: #ff4444;">APLICAR PENALIDADE</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('manualPenaltyModalClose').addEventListener('click', close);
    document.getElementById('manualPenaltyCancelBtn').addEventListener('click', close);

    // Atualizar descrição quando motivo mudar
    document.getElementById('penaltyReason').addEventListener('change', function() {
        const description = document.getElementById('penaltyDescription');
        if (this.value && this.value !== 'Outro') {
            description.value = `Penalidade aplicada por: ${this.value}`;
        } else if (this.value === 'Outro') {
            description.value = '';
            description.placeholder = 'Descreva o motivo da penalidade...';
        }
    });

    document.getElementById('manualPenaltyForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const reason = document.getElementById('penaltyReason').value;
        const description = document.getElementById('penaltyDescription').value.trim();
        const hpLoss = parseInt(document.getElementById('penaltyHpLoss').value, 10) || 200;

        if (hpLoss <= 0) {
            alert('A perda de HP deve ser maior que 0!');
            return;
        }

        if (hpLoss > gameSystem.data.hp) {
            if (!confirm(`ATENÇÃO: Você tem apenas ${gameSystem.data.hp} HP. Aplicar esta penalidade deixará você com ${gameSystem.data.hp - hpLoss} HP. Deseja continuar?`)) {
                return;
            }
        }

        const finalDescription = description || (reason ? `Penalidade aplicada por: ${reason}` : 'Penalidade manual aplicada.');

        gameSystem.applyManualPenalty(hpLoss, finalDescription, reason);

        close();
    });
}

function selectTitle(titleId) {
    if (!gameSystem) return;
    if (!gameSystem.data.titulosDesbloqueados.includes(titleId)) return;
    
    gameSystem.data.titulo = titleId;
    gameSystem.saveData();
    gameSystem.updateTitlesDisplay();
    gameSystem.updateStatusDisplay(); // Atualizar também o título no character-info-section
    const title = TITLES.find(t => t.id === titleId);
    gameSystem.addNotification(
        'TÍTULO SELECIONADO!',
        `Você está usando o título: "${title?.nome}"`,
        'info'
    );
}

// Exportar para uso global
window.gameSystem = gameSystem;
window.deleteNotification = (id) => gameSystem.deleteNotification(id);
window.completeTraining = completeTraining;
window.renderTasks = renderTasks;
window.showTaskModal = showTaskModal;
window.showAllTasksModal = showAllTasksModal;
window.useRune = useRune;
window.editTraining = editTraining;
window.deleteTraining = deleteTraining;
window.editStudy = editStudy;
window.deleteStudy = deleteStudy;
window.selectTitle = selectTitle;

// ============================================
// TAREFAS, HÁBITOS E MISSÕES - UI & LÓGICA
// ============================================

function getTaskRewardsFromForm() {
    const exp = parseInt(document.getElementById('taskRewardExp').value, 10) || 0;
    const moedas = parseInt(document.getElementById('taskRewardCoins').value, 10) || 0;
    const atributo = document.getElementById('taskRewardAttr').value || null;
    const atributoValor = parseFloat(document.getElementById('taskRewardAttrValue').value) || 0;

    return {
        exp,
        moedas,
        atributo: atributo || null,
        atributoValor
    };
}

function applyTaskRewards(task) {
    if (!gameSystem || !task.rewards) return;

    const { exp, moedas, atributo, atributoValor } = task.rewards;

    if (exp && exp > 0) {
        gameSystem.addExp(exp);
    }
    if (moedas && moedas > 0) {
        gameSystem.addMoedas(moedas);
    }
    if (atributo && atributoValor && atributoValor > 0) {
        const attrMap = {
            forca: 'addForca',
            inteligencia: 'addInteligencia',
            agilidade: 'addAgilidade',
            vitalidade: 'addVitalidade',
            resistencia: 'addResistencia',
            percepcao: 'addPercepcao'
        };
        const fnName = attrMap[atributo];
        if (fnName && typeof gameSystem[fnName] === 'function') {
            if (fnName === 'addVitalidade' || fnName === 'addResistencia') {
                gameSystem[fnName]();
            } else {
                gameSystem[fnName](atributoValor);
            }
        }
    }
}

function renderTasks() {
    if (!gameSystem) return;

    const today = new Date();
    const todayKey = getTodayKey();

    const tasksDailyList = document.getElementById('tasksDailyList');
    const missionsList = document.getElementById('missionsList');

    if (!tasksDailyList || !missionsList) return;

    const habitosHoje = (gameSystem.data.habitos || []).filter(h => shouldTaskAppearToday(h, new Date(today)));
    const missoesHoje = (gameSystem.data.missoes || []).filter(m => shouldTaskAppearToday(m, new Date(today)));

    const buildTaskItem = (task, tipo) => {
        const completed = task.completions && task.completions.includes(todayKey);
        const progressText = completed ? 'CONCLUÍDO' : 'PENDENTE';

        const isUniqueMission = tipo === 'missao' && task.unique;
        const priorityLabel = isUniqueMission ? (task.priority || 'normal') : null;
        const categoryLabel = isUniqueMission ? (task.category || '') : '';

        let progressSection = '';
        if (task.progress && task.progress.enabled && task.progress.max > 0) {
            const byDate = task.progress.byDate || {};
            const currentValue = byDate[todayKey] || 0;
            const max = task.progress.max;
            progressSection = `
                <div class="task-progress-inline">
                    <span>${currentValue} / ${max}</span>
                    <button type="button" class="form-btn task-small-btn task-progress-add-btn">+ PROGRESSO</button>
                    <button type="button" class="form-btn task-small-btn task-progress-reset-btn">RESETAR HOJE</button>
                </div>
            `;
        }

        return `
            <div class="task-item" data-id="${task.id}" data-tipo="${tipo}">
                <div class="task-main">
                    <label class="task-checkbox-wrapper">
                        <input type="checkbox" class="task-complete-checkbox" ${completed ? 'checked disabled' : ''}>
                        <span class="task-name">${task.titulo}</span>
                    </label>
                    <span class="task-tag">${tipo === 'habito' ? 'HÁBITO' : 'MISSÃO'}</span>
                </div>
                <div class="task-meta">
                    <span class="task-recurring">${getRecurrenceLabel(task.recurrence)}</span>
                    <span class="task-progress ${completed ? 'completed' : ''}">${progressText}</span>
                    ${isUniqueMission && priorityLabel ? `<span class="task-priority ${priorityLabel}">${priorityLabel.toUpperCase()}</span>` : ''}
                    ${isUniqueMission && categoryLabel ? `<span class="task-category">${categoryLabel}</span>` : ''}
                    ${progressSection}
                    <div class="task-actions">
                        <button class="form-btn task-small-btn task-edit-btn">EDITAR</button>
                        <button class="form-btn task-small-btn task-delete-btn">X</button>
                    </div>
                </div>
            </div>
        `;
    };

    tasksDailyList.innerHTML = habitosHoje.length
        ? habitosHoje.map(h => buildTaskItem(h, 'habito')).join('')
        : '<div class="section-text">Nenhum hábito para hoje.</div>';

    missionsList.innerHTML = missoesHoje.length
        ? missoesHoje.map(m => buildTaskItem(m, 'missao')).join('')
        : '<div class="section-text">Nenhuma missão para hoje.</div>';

    document.querySelectorAll('.task-complete-checkbox').forEach(cb => {
        cb.addEventListener('change', function () {
            if (!this.checked) return; // não suportamos "desconcluir" por enquanto

            const item = this.closest('.task-item');
            const id = Number(item.getAttribute('data-id'));
            const tipo = item.getAttribute('data-tipo');

            const list = tipo === 'habito' ? gameSystem.data.habitos : gameSystem.data.missoes;
            const task = list.find(t => t.id === id);
            if (!task) return;

            const todayKeyLocal = getTodayKey();
            const alreadyCompleted = task.completions && task.completions.includes(todayKeyLocal);
            if (!alreadyCompleted) {
                completeRecurringTask(task);
                applyTaskRewards(task);
                gameSystem.saveData();
                gameSystem.addNotification(
                    tipo === 'habito' ? 'HÁBITO CONCLUÍDO!' : 'MISSÃO CONCLUÍDA!',
                    `"${task.titulo}" foi marcado como concluído hoje.`,
                    'info'
                );
            }

            // trava o checkbox para não ficar clicando várias vezes
            this.disabled = true;
            renderTasks();
        });
    });

    document.querySelectorAll('.task-edit-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.task-item');
            const id = Number(item.getAttribute('data-id'));
            const tipo = item.getAttribute('data-tipo');
            showTaskModal(tipo, id);
        });
    });

    document.querySelectorAll('.task-delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.task-item');
            const id = Number(item.getAttribute('data-id'));
            const tipo = item.getAttribute('data-tipo');

            if (!confirm('Deseja realmente excluir esta tarefa?')) return;

            const listName = tipo === 'habito' ? 'habitos' : 'missoes';
            const list = gameSystem.data[listName] || [];
            const index = list.findIndex(t => t.id === id);
            if (index >= 0) {
                const [removed] = list.splice(index, 1);
                gameSystem.data[listName] = list;
                gameSystem.saveData();
                renderTasks();
                gameSystem.addNotification(
                    'TAREFA REMOVIDA',
                    `"${removed.titulo}" foi removida.`,
                    'info'
                );
            }
        });
    });

    document.querySelectorAll('.task-progress-add-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.task-item');
            const id = Number(item.getAttribute('data-id'));
            const tipo = item.getAttribute('data-tipo');

            const list = tipo === 'habito' ? gameSystem.data.habitos : gameSystem.data.missoes;
            const task = list.find(t => t.id === id);
            if (!task || !task.progress || !task.progress.enabled || task.progress.max <= 0) return;

            const todayKeyLocal = getTodayKey();
            if (!task.progress.byDate) task.progress.byDate = {};
            const current = task.progress.byDate[todayKeyLocal] || 0;
            let next = current + 1;
            if (next > task.progress.max) next = task.progress.max;
            task.progress.byDate[todayKeyLocal] = next;

            const alreadyCompleted = task.completions && task.completions.includes(todayKeyLocal);
            if (next >= task.progress.max && !alreadyCompleted) {
                completeRecurringTask(task);
                applyTaskRewards(task);
                gameSystem.addNotification(
                    tipo === 'habito' ? 'HÁBITO CONCLUÍDO!' : 'MISSÃO CONCLUÍDA!',
                    `"${task.titulo}" atingiu o progresso máximo e foi concluída.`,
                    'info'
                );
            }

            gameSystem.saveData();
            renderTasks();
        });
    });

    document.querySelectorAll('.task-progress-reset-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.task-item');
            const id = Number(item.getAttribute('data-id'));
            const tipo = item.getAttribute('data-tipo');

            const list = tipo === 'habito' ? gameSystem.data.habitos : gameSystem.data.missoes;
            const task = list.find(t => t.id === id);
            if (!task || !task.progress || !task.progress.enabled || task.progress.max <= 0) return;

            const todayKeyLocal = getTodayKey();

            // Se já foi concluída hoje, não permitimos reset (mantém integridade da penalidade/recompensa)
            const alreadyCompleted = task.completions && task.completions.includes(todayKeyLocal);
            if (alreadyCompleted) return;

            if (!task.progress.byDate) task.progress.byDate = {};
            task.progress.byDate[todayKeyLocal] = 0;

            gameSystem.saveData();
            renderTasks();
        });
    });
}

function getRecurrenceLabel(recurrence) {
    if (!recurrence) return 'Sem recorrência';
    const interval = recurrence.interval || 1;
    switch (recurrence.type) {
        case 'daily':
            return 'Diária';
        case 'interval_days':
            return `A cada ${interval} dia(s)`;
        case 'weekly':
            return `A cada ${interval} semana(s)`;
        case 'monthly':
            return `A cada ${interval} mês(es)`;
        case 'yearly':
            return `A cada ${interval} ano(s)`;
        default:
            return 'Personalizada';
    }
}

function showTaskModal(tipo, existingId) {
    if (!gameSystem) return;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'taskModal';

    const todayKey = getTodayKey();

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 820px;">
            <div class="settings-header">
                <h3 class="settings-title">${tipo === 'habito' ? 'ADICIONAR HÁBITO' : 'ADICIONAR MISSÃO'}</h3>
                <button class="settings-close" id="taskModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="taskForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Título:</label>
                        <input type="text" id="taskTitle" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descrição (opcional):</label>
                        <textarea id="taskDescription" class="form-input" rows="3" style="resize: vertical;"></textarea>
                    </div>
                    ${tipo === 'missao' ? `
                    <div class="form-group">
                        <label class="form-label">Tipo de missão:</label>
                        <select id="taskKind" class="form-select">
                            <option value="recorrente" selected>Recorrente</option>
                            <option value="unica">Única (apenas uma vez)</option>
                        </select>
                    </div>
                    ` : ''}
                    <div class="form-group" style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 10px;">
                        <div>
                            <label class="form-label">Frequência:</label>
                            <select id="taskRecurrenceType" class="form-select" required>
                                <option value="daily">Diária</option>
                                <option value="interval_days">A cada N dias</option>
                                <option value="weekly">Semanal (a cada N semanas)</option>
                                <option value="monthly">Mensal (a cada N meses)</option>
                                <option value="yearly">Anual (a cada N anos)</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label">Intervalo (N):</label>
                            <input type="number" id="taskRecurrenceInterval" class="form-input" min="1" value="1">
                        </div>
                        <div>
                            <label class="form-label">Data inicial:</label>
                            <input type="date" id="taskStartDate" class="form-input" value="${todayKey}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Recompensas:</label>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                            <div>
                                <label class="form-label">EXP:</label>
                                <input type="number" id="taskRewardExp" class="form-input" min="0" value="0">
                            </div>
                            <div>
                                <label class="form-label">Moedas (G):</label>
                                <input type="number" id="taskRewardCoins" class="form-input" min="0" value="0">
                            </div>
                            <div>
                                <label class="form-label">Atributo:</label>
                                <select id="taskRewardAttr" class="form-select">
                                    <option value="">Nenhum</option>
                                    <option value="forca">FORÇA</option>
                                    <option value="inteligencia">INTELIGÊNCIA</option>
                                    <option value="agilidade">AGILIDADE</option>
                                    <option value="vitalidade">VITALIDADE</option>
                                    <option value="resistencia">RESISTÊNCIA</option>
                                    <option value="percepcao">PERCEPÇÃO</option>
                                </select>
                            </div>
                        </div>
                        <div style="margin-top: 8px; max-width: 220px;">
                            <label class="form-label">Valor do atributo (ex: horas, km, ponto):</label>
                            <input type="number" id="taskRewardAttrValue" class="form-input" step="0.1" min="0" value="0">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Barra de progresso (opcional):</label>
                        <div style="display: grid; grid-template-columns: 0.7fr 1fr; gap: 10px; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <input type="checkbox" id="taskUseProgress">
                                <span class="section-text" style="margin: 0; font-size: 11px;">Usar barra (conta +1 a cada clique)</span>
                            </div>
                            <div>
                                <label class="form-label">Valor máximo:</label>
                                <input type="number" id="taskProgressMax" class="form-input" min="1" value="1">
                            </div>
                        </div>
                    </div>
                    ${tipo === 'missao' ? `
                    <div class="form-group">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <div>
                                <label class="form-label">Prioridade (somente missões únicas):</label>
                                <select id="taskPriority" class="form-select">
                                    <option value="normal" selected>Normal</option>
                                    <option value="alta">Alta</option>
                                    <option value="media">Média</option>
                                    <option value="baixa">Baixa</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label">Categoria (somente missões únicas):</label>
                                <input type="text" id="taskCategory" class="form-input" placeholder="Ex: ESTUDO, TRABALHO">
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="taskCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">SALVAR</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('taskModalClose').addEventListener('click', close);
    document.getElementById('taskCancelBtn').addEventListener('click', close);

    // Se for edição, preencher campos
    let editingTask = null;
    if (existingId) {
        const list = tipo === 'habito' ? (gameSystem.data.habitos || []) : (gameSystem.data.missoes || []);
        editingTask = list.find(t => t.id === existingId) || null;
        if (editingTask) {
            document.getElementById('taskTitle').value = editingTask.titulo || '';
            document.getElementById('taskDescription').value = editingTask.descricao || '';

            if (editingTask.recurrence) {
                document.getElementById('taskRecurrenceType').value = editingTask.recurrence.type || 'daily';
                document.getElementById('taskRecurrenceInterval').value = editingTask.recurrence.interval || 1;
                document.getElementById('taskStartDate').value = getDateKey(editingTask.recurrence.startDate || todayKey);
            } else {
                const startInput = document.getElementById('taskStartDate');
                if (startInput) startInput.value = getDateKey(editingTask.startDate || todayKey);
            }

            if (tipo === 'missao') {
                const kindSelect = document.getElementById('taskKind');
                const prioritySelect = document.getElementById('taskPriority');
                const categoryInput = document.getElementById('taskCategory');

                if (kindSelect) kindSelect.value = editingTask.unique ? 'unica' : 'recorrente';
                if (prioritySelect && editingTask.priority) prioritySelect.value = editingTask.priority;
                if (categoryInput && editingTask.category) categoryInput.value = editingTask.category;
            }

            if (editingTask.rewards) {
                document.getElementById('taskRewardExp').value = editingTask.rewards.exp || 0;
                document.getElementById('taskRewardCoins').value = editingTask.rewards.moedas || 0;
                document.getElementById('taskRewardAttr').value = editingTask.rewards.atributo || '';
                document.getElementById('taskRewardAttrValue').value = editingTask.rewards.atributoValor || 0;
            }

            if (editingTask.progress) {
                const useProgress = document.getElementById('taskUseProgress');
                const progressMax = document.getElementById('taskProgressMax');
                if (useProgress) useProgress.checked = !!editingTask.progress.enabled;
                if (progressMax && editingTask.progress.max) progressMax.value = editingTask.progress.max;
            }
        }
    }

    document.getElementById('taskForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const recurrenceType = document.getElementById('taskRecurrenceType')?.value;
        const recurrenceInterval = parseInt(document.getElementById('taskRecurrenceInterval')?.value, 10) || 1;
        const startDate = document.getElementById('taskStartDate')?.value || todayKey;
        const taskKind = tipo === 'missao'
            ? (document.getElementById('taskKind')?.value || 'recorrente')
            : 'recorrente';

        if (!title) return;

        const rewards = getTaskRewardsFromForm();

        const useProgress = document.getElementById('taskUseProgress');
        const progressEnabled = useProgress ? useProgress.checked : false;
        const progressMaxInput = document.getElementById('taskProgressMax');
        const progressMax = progressEnabled ? (parseInt(progressMaxInput?.value || '0', 10) || 0) : 0;

        const baseData = {
            tipo,
            titulo: title.toUpperCase(),
            descricao: description,
            ativo: true,
            unique: tipo === 'missao' && taskKind === 'unica',
            startDate: startDate,
            recurrence: recurrenceType ? {
                type: recurrenceType,
                interval: recurrenceInterval,
                startDate
            } : null,
            rewards,
            progress: {
                enabled: progressEnabled && progressMax > 0,
                max: progressMax > 0 ? progressMax : 0,
                byDate: (editingTask && editingTask.progress && editingTask.progress.byDate) ? editingTask.progress.byDate : {}
            }
        };

        if (tipo === 'missao') {
            const prioritySelect = document.getElementById('taskPriority');
            const categoryInput = document.getElementById('taskCategory');
            baseData.priority = baseData.unique ? (prioritySelect?.value || 'normal') : 'normal';
            baseData.category = baseData.unique ? (categoryInput?.value.toUpperCase() || '') : '';
        }

        if (editingTask) {
            Object.assign(editingTask, baseData);
            // mantém completions existentes
        } else {
            const task = Object.assign({
                id: Date.now(),
                completions: []
            }, baseData);

            if (tipo === 'habito') {
                if (!Array.isArray(gameSystem.data.habitos)) gameSystem.data.habitos = [];
                gameSystem.data.habitos.push(task);
            } else {
                if (!Array.isArray(gameSystem.data.missoes)) gameSystem.data.missoes = [];
                gameSystem.data.missoes.push(task);
            }
        }

        gameSystem.saveData();
        renderTasks();
        const notifTitle = editingTask
            ? (tipo === 'habito' ? 'HÁBITO ATUALIZADO!' : 'MISSÃO ATUALIZADA!')
            : (tipo === 'habito' ? 'HÁBITO CADASTRADO!' : 'MISSÃO CADASTRADA!');

        const nomeTarefa = editingTask ? (editingTask.titulo || title.toUpperCase()) : title.toUpperCase();

        gameSystem.addNotification(
            notifTitle,
            `"${nomeTarefa}" foi salva no seu sistema.`,
            'info'
        );

        close();
    });
}

function showAllTasksModal() {
    if (!gameSystem) return;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'allTasksModal';

    const habitos = gameSystem.data.habitos || [];
    const missoes = gameSystem.data.missoes || [];

    const uniqueInProgress = missoes.filter(m => m.unique && (!m.completions || m.completions.length === 0));
    const uniqueCompleted = missoes.filter(m => m.unique && m.completions && m.completions.length > 0);

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 900px;">
            <div class="settings-header">
                <h3 class="settings-title">TODAS AS TAREFAS</h3>
                <button class="settings-close" id="allTasksClose">×</button>
            </div>
            <div class="settings-content" style="max-height: 520px; overflow-y: auto;">
                <h4 class="section-text">Hábitos cadastrados</h4>
                ${habitos.length ? `
                <ul class="section-text" style="list-style: none; padding-left: 0; margin-top: 8px;">
                    ${habitos.map(h => `
                        <li style="margin-bottom: 4px;">
                            - ${h.titulo}
                        </li>
                    `).join('')}
                </ul>` : '<div class="section-text">Nenhum hábito cadastrado.</div>'}

                <div class="section-divider"></div>

                <h4 class="section-text">Missões cadastradas</h4>
                ${missoes.length ? `
                <ul class="section-text" style="list-style: none; padding-left: 0; margin-top: 8px;">
                    ${missoes.map(m => `
                        <li style="margin-bottom: 4px;">
                            - ${m.titulo} ${m.unique ? '(ÚNICA)' : '(RECORRENTE)'}
                        </li>
                    `).join('')}
                </ul>` : '<div class="section-text">Nenhuma missão cadastrada.</div>'}

                <div class="section-divider"></div>

                <h4 class="section-text" style="margin-top: 20px;">Missões únicas em andamento</h4>
                ${uniqueInProgress.length ? `
                <ul class="section-text" style="list-style: none; padding-left: 0; margin-top: 8px;">
                    ${uniqueInProgress.map(m => `
                        <li style="margin-bottom: 6px;">
                            <div>${m.titulo} ${m.priority ? '[' + m.priority.toUpperCase() + ']' : ''} ${m.category ? '- ' + m.category : ''}</div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.7);">
                                Início: ${(() => {
                                    const start = m.startDate || (m.recurrence && m.recurrence.startDate);
                                    return start ? getDateKey(start).split('-').reverse().join('/') : '—';
                                })()}
                            </div>
                        </li>
                    `).join('')}
                </ul>` : '<div class="section-text">Nenhuma missão única em andamento.</div>'}

                <div class="section-divider"></div>

                <h4 class="section-text">Histórico - Missões únicas concluídas</h4>
                ${uniqueCompleted.length ? `
                <ul class="section-text" style="list-style: none; padding-left: 0; margin-top: 8px;">
                    ${uniqueCompleted.map(m => {
                        const completionsSorted = [...m.completions].sort();
                        const firstCompletion = completionsSorted[0];
                        const lastCompletion = completionsSorted[completionsSorted.length - 1];
                        const startRaw = m.startDate || (m.recurrence && m.recurrence.startDate) || firstCompletion;
                        const startKey = getDateKey(startRaw);
                        const daysWithProgress = m.progress && m.progress.byDate
                            ? Object.keys(m.progress.byDate).length
                            : 0;
                        const [sy, sm, sd] = startKey.split('-');
                        const [ey, em, ed] = getDateKey(lastCompletion).split('-');
                        return `
                        <li style="margin-bottom: 8px;">
                            <div>${m.titulo} ${m.priority ? '[' + m.priority.toUpperCase() + ']' : ''} ${m.category ? '- ' + m.category : ''}</div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.75);">
                                Início: ${sd}/${sm}/${sy} &nbsp;|&nbsp; Conclusão: ${ed}/${em}/${ey}
                            </div>
                            <div style="font-size: 11px; color: rgba(255,255,255,0.7);">
                                Dias com progresso: ${daysWithProgress}
                            </div>
                        </li>`;
                    }).join('')}
                </ul>` : '<div class="section-text">Nenhuma missão única concluída ainda.</div>'}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('allTasksClose').addEventListener('click', close);
}

// ============================================
// FUNÇÕES DE EDIÇÃO/EXCLUSÃO DE TREINOS E ESTUDOS
// ============================================

function editTraining(trainingId) {
    if (!gameSystem) return;
    const treino = gameSystem.data.treinos.find(t => t.id === trainingId);
    if (!treino) return;
    showTrainingModal(treino);
}

function deleteTraining(trainingId) {
    if (!gameSystem) return;
    if (!confirm('Deseja realmente excluir este treino?')) return;
    
    const index = gameSystem.data.treinos.findIndex(t => t.id === trainingId);
    if (index >= 0) {
        const [removed] = gameSystem.data.treinos.splice(index, 1);
        gameSystem.saveData();
        renderTrainings();
        if (typeof renderProgressCharts === 'function') {
            setTimeout(() => renderProgressCharts(), 100);
        }
        if (typeof renderPerformanceChart === 'function') {
            setTimeout(() => renderPerformanceChart(), 150);
        }
        gameSystem.addNotification('TREINO REMOVIDO', `Treino "${removed.nome}" foi removido.`, 'info');
    }
}

function editStudy(studyId) {
    if (!gameSystem) return;
    const estudo = gameSystem.data.estudos.find(e => e.id === studyId);
    if (!estudo) return;
    showStudyModal(estudo);
}

function deleteStudy(studyId) {
    if (!gameSystem) return;
    if (!confirm('Deseja realmente excluir este estudo?')) return;
    
    const index = gameSystem.data.estudos.findIndex(e => e.id === studyId);
    if (index >= 0) {
        const [removed] = gameSystem.data.estudos.splice(index, 1);
        gameSystem.saveData();
        renderStudies();
        if (typeof renderProgressCharts === 'function') {
            setTimeout(() => renderProgressCharts(), 100);
        }
        if (typeof renderSkillsInTraining === 'function') {
            renderSkillsInTraining();
        }
        gameSystem.addNotification('ESTUDO REMOVIDO', `Estudo "${removed.materia}" foi removido.`, 'info');
    }
}

function showMetaModal(tipo) {
    if (!gameSystem) return;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'metaModal';

    const currentMeta = tipo === 'treino' 
        ? (gameSystem.data.treinoMeta || 5)
        : (gameSystem.data.estudoMeta || 10);
    const label = tipo === 'treino' ? 'TREINOS' : 'HORAS DE ESTUDO';

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width: 500px;">
            <div class="settings-header">
                <h3 class="settings-title">AJUSTAR META SEMANAL - ${label}</h3>
                <button class="settings-close" id="metaModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="metaForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Meta semanal:</label>
                        <input type="number" id="metaValue" class="form-input" min="1" value="${currentMeta}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="metaCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">SALVAR</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    document.getElementById('metaModalClose').addEventListener('click', close);
    document.getElementById('metaCancelBtn').addEventListener('click', close);

    document.getElementById('metaForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const value = parseInt(document.getElementById('metaValue').value, 10) || 1;

        if (tipo === 'treino') {
            gameSystem.data.treinoMeta = value;
        } else {
            gameSystem.data.estudoMeta = value;
        }

        gameSystem.saveData();
        renderTrainings();
        renderStudies();
        if (typeof renderProgressCharts === 'function') {
            setTimeout(() => renderProgressCharts(), 100);
        }

        gameSystem.addNotification(
            'META ATUALIZADA!',
            `Meta semanal de ${label.toLowerCase()} ajustada para ${value}.`,
            'info'
        );

        close();
    });
}

// Exportar funções globais
window.editTraining = editTraining;
window.deleteTraining = deleteTraining;
window.editStudy = editStudy;
window.deleteStudy = deleteStudy;
window.showManualPenaltyModal = showManualPenaltyModal;
