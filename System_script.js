// ============================================
// SISTEMA DE HABITOS, ESTUDOS E FINANCEIRO
// Sistema RPG de Gerenciamento Pessoal
// ============================================

// ============================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================

const RANKS = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'Nacional', 'Z', 'Deus'];

/** Nível guardado nos dados: inteiro ≥ 0 (evita NaN/strings após migrações). */
function normalizeStoredNivel(raw) {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.floor(Math.min(n, 999999));
}

/** Rank de Hunter válido face a RANKS; qualquer valor desconhecido vira «E». */
function normalizeStoredRank(raw) {
    const u = String(raw == null || raw === '' ? 'E' : raw).trim().toUpperCase();
    return RANKS.includes(u) ? u : 'E';
}

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
    { id: 'inteligente', nome: 'Aquele que Possui Intelecto Supremo', requisito: { tipo: 'atributo', atributo: 'sabedoria', valor: 50 }, descricao: 'SABEDORIA que transcende o comum' },
    { id: 'agil', nome: 'Aquele que Move-se como o Vento', requisito: { tipo: 'atributo', atributo: 'foco', valor: 50 }, descricao: 'FOCO que desafia a física' },
    { id: 'vital', nome: 'Aquele que Possui Vitalidade Infinita', requisito: { tipo: 'atributo', atributo: 'vitalidade', valor: 50 }, descricao: 'VITALIDADE que nunca se esgota' },
    { id: 'resiliente', nome: 'Aquele que Resiste a Tudo', requisito: { tipo: 'atributo', atributo: 'disciplina', valor: 50 }, descricao: 'DISCIPLINA que desafia a destruição' },
    { id: 'perceptivo', nome: 'Aquele que Percebe o Invisível', requisito: { tipo: 'atributo', atributo: 'carisma', valor: 50 }, descricao: 'CARISMA que vê além do véu' },
    { id: 'equilibrado', nome: 'Aquele que Possui Equilíbrio Perfeito', requisito: { tipo: 'atributo', atributo: 'forca', valor: 100 }, descricao: 'Todos os atributos em harmonia suprema' },
    
    // Títulos Especiais
    { id: 'sem_penalidades', nome: 'Aquele que Supera as Adversidades', requisito: { tipo: 'dias_sem_penalidade', valor: 7 }, descricao: '7 dias sem falhas - superando obstáculos' },
    { id: 'perfeito', nome: 'Aquele que Busca a Perfeição', requisito: { tipo: 'dias_sem_penalidade', valor: 30 }, descricao: '30 dias de perfeição inabalável' },
    { id: 'imaculado', nome: 'Aquele que é Imaculado', requisito: { tipo: 'dias_sem_penalidade', valor: 100 }, descricao: '100 dias sem uma única falha' },
    { id: 'transcendente', nome: 'Aquele que Transcende', requisito: { tipo: 'dias_sem_penalidade', valor: 365 }, descricao: 'Um ano completo de perfeição absoluta' },
    
    // Títulos de Conquistas Especiais
    { id: 'superador', nome: 'Superador de Limites', requisito: { tipo: 'nivel', valor: 50 }, descricao: 'Nível 50 alcançado - transcendendo barreiras' },
    { id: 'ascendente', nome: 'Ascendente do Poder', requisito: { tipo: 'nivel', valor: 75 }, descricao: 'Nível 75 - ascendendo além do mortal' },
    { id: 'imortal', nome: 'Imortal em Progresso', requisito: { tipo: 'nivel', valor: 100 }, descricao: 'Nível 100 - caminhando rumo à imortalidade' },

    // Títulos de Desafio do Arquiteto (só desbloqueiam aceitando e concluindo um desafio)
    {
        id: 'forjado_chamas',
        nome: 'Forjado nas Chamas',
        requisito: { tipo: 'desafio_arquiteto' },
        descricao: 'Completou 10 missões em 7 dias corridos após aceitar o desafio do Arquiteto.',
        desafio: { meta: 'missoes_7dias', valor: 10, diasLimite: 7 }
    },
    {
        id: 'cacador_verificado',
        nome: 'Caçador Verificado',
        requisito: { tipo: 'desafio_arquiteto' },
        descricao: 'Completou todas as missões do dia por 5 dias seguidos após aceitar o desafio.',
        desafio: { meta: 'dias_completos', valor: 5, diasLimite: 14 }
    },
    {
        id: 'intocavel',
        nome: 'O Intocável',
        requisito: { tipo: 'desafio_arquiteto' },
        descricao: '14 dias sem nenhuma penalidade após aceitar o desafio do Arquiteto.',
        desafio: { meta: 'dias_sem_penalidade', valor: 14, diasLimite: 14 }
    },
    {
        id: 'disciplina_maxima',
        nome: 'Disciplina Máxima',
        requisito: { tipo: 'desafio_arquiteto' },
        descricao: 'Completou treino + estudo + missão no mesmo dia, 7 vezes após aceitar o desafio.',
        desafio: { meta: 'dia_triplo', valor: 7, diasLimite: 21 }
    },
    {
        id: 'monarca_ascendente',
        nome: 'Monarca Ascendente',
        requisito: { tipo: 'desafio_arquiteto' },
        descricao: 'Atingiu o nível 50 após aceitar o desafio do Arquiteto.',
        desafio: { meta: 'nivel', valor: 50, diasLimite: 0 }
    }
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
        bonusAttribute: 'disciplina',
        coinMultiplier: { min: 300, max: 700 }
    },
    'Mago': {
        name: 'Mago',
        evolutions: [
            'Mago', 'Conjurador Iniciado', 'Feiticeiro Elemental', 'Arcanista Superior',
            'Sábio Místico', 'Arquimago Ancestral', 'Profeta Arcano',
            'Senhor dos Segredos Ocultos', 'Soberano da Realidade', 'Arcano Supremo'
        ],
        bonusAttribute: 'sabedoria',
        coinMultiplier: { min: 250, max: 600 }
    },
    'Assassino': {
        name: 'Assassino',
        evolutions: [
            'Assassino', 'Lâmina Silenciosa', 'Predador das Sombras', 'Ceifador Noturno',
            'Mãos da Morte', 'Perseguidor Fantasma', 'Mestre do Golpe Mortal',
            'Executor Abissal', 'Sombra Aniquiladora', 'Fantasma Supremo'
        ],
        bonusAttribute: 'foco',
        coinMultiplier: { min: 280, max: 650 }
    },
    'Paladino': {
        name: 'Paladino',
        evolutions: [
            'Paladino', 'Escudeiro Sagrado', 'Cruzado Devoto', 'Guardião da Luz',
            'Cavaleiro Consagrado', 'Campeão da Virtude', 'Vingador Radiante',
            'Arauto Celestial', 'Soberano da Luz Divina', 'Avatar do Juramento Eterno'
        ],
        bonusAttribute: 'carisma',
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
// CATÁLOGO DE RUNAS (20 runas, 4 tiers)
// ============================================
const RUNAS_CATALOG = [
    // --- Tier 0 — Starter ---
    {
        id: 'runa_iniciante',
        nome: 'Runa do Iniciante',
        descricao: '+10% XP por 30 minutos. A primeira faísca do poder.',
        tier: 0,
        tipo: 'temporaria',
        mpCost: 10,
        duration: 30,
        buffType: 'exp_multiplier',
        buffValue: 10,
        unlock: { canal: 'nivel', valor: 1 }
    },
    // --- Tier 1 — Passivas (permanentes, sem MP) ---
    {
        id: 'persistencia',
        nome: 'Runa da Persistência',
        descricao: '+5% XP em todas as missões concluídas. Passiva permanente.',
        tier: 1,
        tipo: 'passiva',
        mpCost: 0,
        duration: 0,
        buffType: 'exp_multiplier',
        buffValue: 5,
        unlock: { canal: 'nivel', valor: 10 }
    },
    {
        id: 'acumulacao',
        nome: 'Runa da Acumulação',
        descricao: '+3 moedas por missão concluída. Passiva permanente.',
        tier: 1,
        tipo: 'passiva',
        mpCost: 0,
        duration: 0,
        buffType: 'coin_bonus_flat',
        buffValue: 3,
        unlock: { canal: 'conquista', valor: 'moedas_500' }
    },
    {
        id: 'consistencia_passiva',
        nome: 'Runa da Consistência',
        descricao: '+5% XP em hábitos. Passiva permanente.',
        tier: 1,
        tipo: 'passiva',
        mpCost: 0,
        duration: 0,
        buffType: 'exp_multiplier_habitos',
        buffValue: 5,
        unlock: { canal: 'conquista', valor: 'streak_7' }
    },
    {
        id: 'foco_eterno',
        nome: 'Runa do Foco Eterno',
        descricao: '+10% XP quando 3 ou mais missões são concluídas no mesmo dia. Passiva permanente.',
        tier: 1,
        tipo: 'passiva',
        mpCost: 0,
        duration: 0,
        buffType: 'exp_multiplier_dia_3plus',
        buffValue: 10,
        unlock: { canal: 'atributo', atributo: 'foco', valor: 30 }
    },
    {
        id: 'vigor',
        nome: 'Runa do Vigor',
        descricao: '+100 HP máximo permanente.',
        tier: 1,
        tipo: 'passiva',
        mpCost: 0,
        duration: 0,
        buffType: 'hp_max_bonus',
        buffValue: 100,
        unlock: { canal: 'nivel', valor: 25 }
    },
    // --- Tier 2 — Temporárias Comuns ---
    {
        id: 'despertar',
        nome: 'Runa do Despertar',
        descricao: '+20% XP geral por 60 minutos.',
        tier: 2,
        tipo: 'temporaria',
        mpCost: 30,
        duration: 60,
        buffType: 'exp_multiplier',
        buffValue: 20,
        unlock: { canal: 'nivel', valor: 5 }
    },
    {
        id: 'forca_tmp',
        nome: 'Runa da Força',
        descricao: '+10 pontos de Força temporários por 30 minutos.',
        tier: 2,
        tipo: 'temporaria',
        mpCost: 40,
        duration: 30,
        buffType: 'attribute_boost',
        buffAttr: 'forca',
        buffValue: 10,
        unlock: { canal: 'nivel', valor: 15 }
    },
    {
        id: 'fortuna',
        nome: 'Runa da Fortuna',
        descricao: '+100% moedas ganhas por 30 minutos.',
        tier: 2,
        tipo: 'temporaria',
        mpCost: 80,
        duration: 30,
        buffType: 'coin_multiplier',
        buffValue: 100,
        unlock: { canal: 'moedas', valor: 300 }
    },
    {
        id: 'estudo_arcano',
        nome: 'Runa do Estudo Arcano',
        descricao: '+30% XP em missões de estudo por 90 minutos.',
        tier: 2,
        tipo: 'temporaria',
        mpCost: 50,
        duration: 90,
        buffType: 'exp_multiplier_estudo',
        buffValue: 30,
        unlock: { canal: 'nivel', valor: 20 }
    },
    {
        id: 'guerreiro_tmp',
        nome: 'Runa do Guerreiro',
        descricao: '+50% XP em treinos por 60 minutos.',
        tier: 2,
        tipo: 'temporaria',
        mpCost: 70,
        duration: 60,
        buffType: 'exp_multiplier_treino',
        buffValue: 50,
        unlock: { canal: 'conquista', valor: 'treinos_25' }
    },
    // --- Tier 3 — Raras ---
    {
        id: 'sabedoria_arcana',
        nome: 'Runa da Sabedoria Arcana',
        descricao: '+40% XP em estudo e +5 Sabedoria temporário por 120 minutos.',
        tier: 3,
        tipo: 'temporaria',
        mpCost: 100,
        duration: 120,
        buffType: 'exp_multiplier_estudo',
        buffValue: 40,
        unlock: { canal: 'atributo', atributo: 'sabedoria', valor: 50 }
    },
    {
        id: 'disciplina_tmp',
        nome: 'Runa da Disciplina de Ferro',
        descricao: 'Penalidade do dia ignorada (uso único por semana). Custo: 150 MP.',
        tier: 3,
        tipo: 'temporaria',
        mpCost: 150,
        duration: 1,
        buffType: 'penalty_shield',
        buffValue: 1,
        unlock: { canal: 'nivel', valor: 40 }
    },
    {
        id: 'velocidade',
        nome: 'Runa da Velocidade',
        descricao: 'Missões concluídas contam dobrado para XP por 45 minutos.',
        tier: 3,
        tipo: 'temporaria',
        mpCost: 120,
        duration: 45,
        buffType: 'exp_multiplier',
        buffValue: 100,
        unlock: { canal: 'missao_surpresa' }
    },
    {
        id: 'sombra',
        nome: 'Runa das Sombras',
        descricao: '+25% moedas e +25% XP simultaneamente por 60 minutos.',
        tier: 3,
        tipo: 'temporaria',
        mpCost: 130,
        duration: 60,
        buffType: 'dual_boost',
        buffValue: 25,
        unlock: { canal: 'missao_surpresa' }
    },
    // --- Tier 4 — Lendárias (apenas Missões Surpresa IA) ---
    {
        id: 'monarca',
        nome: 'Runa do Monarca',
        descricao: '+100% XP geral por 120 minutos. Apenas para hunters de rank S ou superior.',
        tier: 4,
        tipo: 'temporaria',
        mpCost: 200,
        duration: 120,
        buffType: 'exp_multiplier',
        buffValue: 100,
        unlock: { canal: 'missao_surpresa', rankMinimo: 'S' }
    },
    {
        id: 'transcendencia',
        nome: 'Runa da Transcendência',
        descricao: 'Todos os atributos +5 por 60 minutos.',
        tier: 4,
        tipo: 'temporaria',
        mpCost: 150,
        duration: 60,
        buffType: 'all_attributes_boost',
        buffValue: 5,
        unlock: { canal: 'missao_surpresa' }
    },
    {
        id: 'sistema',
        nome: 'Runa do Sistema',
        descricao: 'Reverte a penalidade do dia anterior (uso único por semana).',
        tier: 4,
        tipo: 'temporaria',
        mpCost: 180,
        duration: 1,
        buffType: 'penalty_revert',
        buffValue: 1,
        unlock: { canal: 'missao_surpresa' }
    },
    {
        id: 'eterno',
        nome: 'Runa do Eterno',
        descricao: '+200% XP por 30 minutos. Risco: -50% XP amanhã se a meta do dia não for cumprida.',
        tier: 4,
        tipo: 'temporaria',
        mpCost: 250,
        duration: 30,
        buffType: 'exp_multiplier',
        buffValue: 200,
        unlock: { canal: 'missao_surpresa' }
    }
];

const RUNA_TIER_LABEL = ['INICIANTE', 'COMUM', 'INCOMUM', 'RARA', 'LENDÁRIA'];
const RUNA_TIER_COLOR = ['rgba(255,255,255,0.4)', 'rgba(74,222,128,0.8)', 'rgba(0,229,255,0.8)', 'rgba(192,132,252,0.9)', 'rgba(251,191,36,0.95)'];

// ============================================
// MENSAGENS DIÁRIAS DO ARQUITETO (30 frases, ciclo por dia do ano)
// ============================================
const ARQUITETO_DAILY_MESSAGES = [
    'O Sistema não recompensa intenção. Apenas ação pesa na balança.',
    'Cada hábito ignorado é uma dívida que o futuro cobra com juros.',
    'A consistência supera o talento quando o talento não é consistente.',
    'Não existe crescimento sem atrito. Aceite a resistência como combustível.',
    'Missões não concluídas são promessas que você faz a si mesmo e quebra.',
    'O poder não surge do acaso. Ele é construído em silêncio, dia a dia.',
    'Um guerreiro fraco que treina todos os dias supera um forte que descansa.',
    'O que você faz quando ninguém está assistindo define quem você será.',
    'Não tema o fracasso de hoje. Tema a rotina de não tentar amanhã.',
    'A disciplina é a forma mais pura de autoestima que existe.',
    'Cada atributo que você negligencia é uma fraqueza que o inimigo explora.',
    'O Sistema registra tudo. Cada vitória. Cada abandono. Sem piedade.',
    'Você não está competindo com outros. Está competindo com quem você era ontem.',
    'O caminho de nível S começa com a mesma decisão que o de nível F: agir.',
    'Runas não se desbloqueiam por desejo. Elas exigem suor e repetição.',
    'Guerreiros de rank alto não nasceram assim. Foram forjados em missões que outros abandonaram.',
    'Sua mente quer descanso. Seu futuro quer evolução. Você decide quem ouve.',
    'Não existe atalho para o rank S. Existe apenas o caminho longo percorrido com velocidade.',
    'O Arquiteto não julga. Ele apenas registra o que você escolheu fazer.',
    'Habilidades sem prática são títulos sem peso. Prove o que valem.',
    'A fadiga que você sente hoje é a força que você carrega amanhã.',
    'Aquele que completa missões difíceis quando está fraco torna-se invencível quando está forte.',
    'A diferença entre rank E e rank S é o que você faz nas horas que sobram.',
    'O Sistema não mente. Os números refletem sua realidade. Mude-os.',
    'Quem controla seus hábitos, controla seu destino.',
    'Uma missão pequena completada vale mais que dez grandes planejadas.',
    'O nível não mede quem você é. Mede quem você escolheu se tornar.',
    'Cada runa desbloqueada é uma camada de poder que ninguém pode te tirar.',
    'O vazio não se preenche com intenção. Preenche-se com ação repetida.',
    'Seja o Hunter que o Sistema sempre soube que você poderia ser.'
];

function getDailyArquitetoMessage() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / 86400000);
    return ARQUITETO_DAILY_MESSAGES[dayOfYear % ARQUITETO_DAILY_MESSAGES.length];
}

function initPainelArquitetoMessage() {
    const el = document.getElementById('painelArquitetoQuote');
    if (el) el.textContent = getDailyArquitetoMessage();
}

// ============================================
// TOAST HUD (feedback estilo vídeo)
// ============================================
function ensureToastHost() {
    let host = document.querySelector('.sys-toast-host');
    if (host) return host;
    host = document.createElement('div');
    host.className = 'sys-toast-host';
    host.setAttribute('aria-live', 'polite');
    host.setAttribute('aria-relevant', 'additions');
    document.body.appendChild(host);
    return host;
}

function showToast(message, variant = 'ok', timeoutMs = 2600) {
    const host = ensureToastHost();
    const el = document.createElement('div');
    el.className = `sys-toast sys-toast--${variant}`;
    el.setAttribute('role', 'status');
    el.textContent = message;

    host.appendChild(el);
    // Força reflow para animar entrada
    void el.offsetHeight;
    el.classList.add('is-in');

    window.setTimeout(() => {
        el.classList.remove('is-in');
        el.classList.add('is-out');
        window.setTimeout(() => el.remove(), 220);
    }, Math.max(800, timeoutMs));
}

// ============================================
// CLASSE PRINCIPAL DO SISTEMA
// ============================================

class GameSystem {
    constructor() {
        this.loadData();
        this.init();
    }

    // Migra atributos do esquema antigo (Inteligência/Agilidade/Resistência/Percepção)
    // para o novo (Sabedoria/Foco/Disciplina/Carisma) preservando XP investido.
    migrateAttributes(data) {
        if (!data || typeof data !== 'object') return data;
        if (!data.atributos) data.atributos = {};
        const map = {
            inteligencia: 'sabedoria',
            agilidade:    'foco',
            resistencia:  'disciplina',
            percepcao:    'carisma'
        };
        let migrated = false;
        for (const [oldKey, newKey] of Object.entries(map)) {
            if (data.atributos[oldKey] !== undefined) {
                if (data.atributos[newKey] === undefined || data.atributos[newKey] === 0) {
                    data.atributos[newKey] = data.atributos[oldKey];
                    migrated = true;
                }
                delete data.atributos[oldKey];
            }
        }
        // Renomeia campos auxiliares
        if (data.ultimaSemanaResistencia !== undefined && data.ultimaSemanaDisciplina === undefined) {
            data.ultimaSemanaDisciplina = data.ultimaSemanaResistencia;
            delete data.ultimaSemanaResistencia;
        }
        if (migrated) {
            // Sinaliza para mostrar toast no init (uma vez)
            data._atributosMigrados = true;
        }
        return data;
    }

    // Carregar dados do localStorage
    loadData() {
        const saved = localStorage.getItem('gameSystemData');
        if (saved) {
            let data;
            try {
                data = JSON.parse(saved);
            } catch (e) {
                console.warn('gameSystemData corrompido — preservando backup e iniciando estado limpo.', e);
                try { localStorage.setItem('gameSystemData_corrupted_' + Date.now(), saved); } catch (_) {}
                data = null;
            }
            if (!data || typeof data !== 'object') {
                this.loadDefaultData();
                return;
            }
            data = this.migrateAttributes(data);
            this.data = {
                // Informações básicas
                nome: data.nome || '',
                apelido: data.apelido || '',
                nivel: normalizeStoredNivel(data.nivel),
                exp: data.exp || 0,
                expNecessaria: data.expNecessaria || 100,
                rank: normalizeStoredRank(data.rank),
                classe: data.classe || null,
                classeStage: data.classeStage || 0,
                titulo: data.titulo || null,
                titulosDesbloqueados: data.titulosDesbloqueados || [],

                // Atributos do vídeo: Força, Vitalidade, Foco, Carisma, Disciplina, Sabedoria
                atributos: {
                    forca:      data.atributos?.forca      || 0,
                    vitalidade: data.atributos?.vitalidade || 0,
                    foco:       data.atributos?.foco       || 0,
                    carisma:    data.atributos?.carisma    || 0,
                    disciplina: data.atributos?.disciplina || 0,
                    sabedoria:  data.atributos?.sabedoria  || 0
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
                ultimaSemanaDisciplina: data.ultimaSemanaDisciplina || null,
                
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
                
                // Loja
                recompensas: data.recompensas || [],
                inventario: data.inventario || [],

                // Treino Físico estruturado
                treinoFisico: data.treinoFisico ? {
                    diasAtivos: data.treinoFisico.diasAtivos || [1, 2, 3, 4, 5],
                    grupos: data.treinoFisico.grupos || [],
                    historicoSessoes: data.treinoFisico.historicoSessoes || []
                } : {
                    diasAtivos: [1, 2, 3, 4, 5],
                    grupos: [],
                    historicoSessoes: []
                },
                xpHoje: data.xpHoje ?? 0,
                lastXpDay: data.lastXpDay || '',

                // Itens de Recompensa
                itensRecompensaCustom: data.itensRecompensaCustom || [],
                itensDesbloqueados: data.itensDesbloqueados || [],

                /* Foto de perfil importada no Painel (JPEG data URL compacto; desenhar em mould quadrado no CSS) */
                painelFotoPerfilDataUrl: data.painelFotoPerfilDataUrl || null,

                // Virtudes
                virtudesDesbloqueadas: data.virtudesDesbloqueadas || [],

                // Árvore de Evolução
                arvoreDesbloqueados: data.arvoreDesbloqueados || [],

                // Arquiteto Personagem
                arquitetoFragmentosDesbloqueados: data.arquitetoFragmentosDesbloqueados || [],

                // Matriz de Prioridades
                matrizTarefas: data.matrizTarefas || { q1: [], q2: [], q3: [], q4: [] },

                // Configurações
                metaTreinoSemanal: data.metaTreinoSemanal || 5,
                metaEstudoSemanal: data.metaEstudoSemanal || 10,
                metaMissoesSemanal: data.metaMissoesSemanal || 7,

                /** Só conta dias desde esta data para títulos «dias sem penalidade» (evita dias «limpos» fictícios antes de usar o app). ISO YYYY-MM-DD. */
                penalidadesStreakTrackingStart:
                    typeof data.penalidadesStreakTrackingStart === 'string'
                        ? data.penalidadesStreakTrackingStart
                        : '',

                // Catálogo de Runas — IDs desbloqueados do RUNAS_CATALOG
                runasCatalogo: data.runasCatalogo || [],
                // Runas em uso ativo do catálogo { id, activeUntil }
                runasCatalogoAtivas: data.runasCatalogoAtivas || [],

                // Desafios do Arquiteto { tituloId, emitidoEm, aceitoEm, concluidoEm, status, progresso }
                desafiosArquiteto: data.desafiosArquiteto || [],

                // Habilidades propostas pela IA, aguardando aprovação do usuário
                habilidadesPropostas: data.habilidadesPropostas || [],
                lastSkillAnalysisDate: data.lastSkillAnalysisDate || ''
            };
        } else {
            this.loadDefaultData();
        }
    }

    // Estado inicial para novos usuários (ou quando o storage está corrompido)
    loadDefaultData() {
        this.data = {
            nome: '',
            apelido: 'O Despertar',
            nivel: 0,
            exp: 0,
            expNecessaria: 100,
            rank: 'E',
            classe: null,
            classeStage: 0,
            titulo: null,
            atributos: {
                forca: 0,
                vitalidade: 0,
                foco: 0,
                carisma: 0,
                disciplina: 0,
                sabedoria: 0
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
            ultimaSemanaDisciplina: null,
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
            titulosDesbloqueados: [],
            treinoFisico: {
                diasAtivos: [1, 2, 3, 4, 5],
                grupos: [],
                historicoSessoes: []
            },
            xpHoje: 0,
            lastXpDay: '',
            itensRecompensaCustom: [],
            itensDesbloqueados: [],
            painelFotoPerfilDataUrl: null,
            virtudesDesbloqueadas: [],
            arvoreDesbloqueados: [],
            arquitetoFragmentosDesbloqueados: [],
            matrizTarefas: { q1: [], q2: [], q3: [], q4: [] },
            metaTreinoSemanal: 5,
            metaEstudoSemanal: 10,
            metaMissoesSemanal: 7,
            penalidadesStreakTrackingStart: '',
            runasCatalogo: [],
            runasCatalogoAtivas: [],
            desafiosArquiteto: [],
            habilidadesPropostas: [],
            lastSkillAnalysisDate: ''
        };
    }

    // Salvar dados no localStorage
    saveData() {
        try {
            localStorage.setItem('gameSystemData', JSON.stringify(this.data));
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                console.error('⚠️ localStorage cheio — dados não salvos. Considere exportar e limpar o histórico.', e);
                if (typeof showToast === 'function') {
                    showToast('Aviso: armazenamento local cheio. Exporte seus dados.', 'error');
                }
            } else {
                console.error('Erro ao salvar dados:', e);
            }
        }
    }

    // Inicializar sistema
    init() {
        this.ensureXpHoje();
        // Identidade única (overlay IDENTIDADE + localStorage) — modal legado de nome/apelido removido
        const lsNome = (localStorage.getItem('sl_identity_name') || '').trim();
        if (lsNome && (!this.data.nome || !String(this.data.nome).trim())) {
            this.data.nome = lsNome.slice(0, 18).toUpperCase();
        }
        let nomeOk = !!(this.data.nome && String(this.data.nome).trim());
        if (nomeOk && (!this.data.apelido || !String(this.data.apelido).trim())) {
            this.data.apelido = 'O Despertar';
        }
        const apelidoOk = !!(this.data.apelido && String(this.data.apelido).trim());
        nomeOk = !!(this.data.nome && String(this.data.nome).trim());
        if (nomeOk && apelidoOk) {
            this.data.configurado = true;
        }
        // Compactar entradas antigas (>30 dias) em treinosHistorico antes de descartar.
        // treinosSemana = array operacional (lógica semanal, máx 30 dias).
        // treinosHistorico = agregados mensais leves para gráficos de longo prazo (~80 bytes/mês).
        if (Array.isArray(this.data.treinosSemana) && this.data.treinosSemana.length > 0) {
            const trintaDiasAtras = new Date(Date.now() - 30 * 86400000);
            const antigas = this.data.treinosSemana.filter(t => new Date(t.data) < trintaDiasAtras);
            if (antigas.length > 0) {
                if (!this.data.treinosHistorico) this.data.treinosHistorico = {};
                antigas.forEach(t => {
                    const mes = t.data.slice(0, 7); // "YYYY-MM"
                    if (!this.data.treinosHistorico[mes]) {
                        this.data.treinosHistorico[mes] = { total: 0, porTipo: {} };
                    }
                    this.data.treinosHistorico[mes].total++;
                    const tipo = t.tipo || 'Força';
                    this.data.treinosHistorico[mes].porTipo[tipo] =
                        (this.data.treinosHistorico[mes].porTipo[tipo] || 0) + 1;
                });
            }
            this.data.treinosSemana = this.data.treinosSemana.filter(t => new Date(t.data) >= trintaDiasAtras);
        }

        // Âncora para títulos «dias sem penalidade»: sem isto, lista vazia de penalidades
        // conta como «todos os dias limpos» e desbloqueia vários títulos de uma vez ao carregar.
        if (!this.data.penalidadesStreakTrackingStart || String(this.data.penalidadesStreakTrackingStart).length < 10) {
            this.data.penalidadesStreakTrackingStart = getTodayKey();
        }
        this.saveData();

        // Verificar se precisa selecionar classe (nível 50)
        if (this.data.nivel >= 50 && !this.data.classeSelecionada && !this.data.classe) {
            this.showClassSelection();
            if (typeof updateArenaPainelCard === 'function') {
                updateArenaPainelCard(this);
            }
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
        this.verificarDesafiosArquiteto();
        this.checkRunasCatalogo();
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
    addSabedoria(hours = 1) {
        this.data.atributos.sabedoria += hours * 0.15;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Adicionar foco (KM corrido)
    addFoco(km = 1) {
        this.data.atributos.foco += km * 0.10;
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
    addDisciplina() {
        this.data.atributos.disciplina += 0.30;
        this.updateAttributesDisplay();
        this.saveData();
    }

    // Adicionar percepção (hora de estudo de psicologia)
    addCarisma(hours = 1) {
        this.data.atributos.carisma += hours * 0.30;
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

    ensureXpHoje() {
        const d = new Date().toISOString().slice(0, 10);
        if (this.data.lastXpDay !== d) {
            this.data.xpHoje = 0;
            this.data.lastXpDay = d;
        }
    }

    /**
     * Quantas hábitos + missões têm conclusão registada para o dia atual (chave em completions).
     * Inclui missões únicas concluídas hoje — antes ficavam de fora porque deixavam de "aparecer hoje".
     */
    countTarefasCompletasHoje() {
        const tk = getTodayKey();
        let n = 0;
        const add = (list) => {
            (list || []).forEach((task) => {
                if (!task.completions || !Array.isArray(task.completions)) return;
                if (task.completions.includes(tk)) n++;
            });
        };
        add(this.data.habitos);
        add(this.data.missoes);
        return n;
    }

    // Adicionar EXP
    addExp(amount) {
        this.ensureXpHoje();
        this.data.xpHoje = (this.data.xpHoje || 0) + amount;
        this.data.exp += amount;
        
        // Verificar level up
        while (this.data.exp >= this.data.expNecessaria) {
            this.levelUp();
        }

        this.updateExpDisplay();
        /* Painel · XP HOJE — levelUp já chama updateAllDisplays; sem level up atualiza KPIs aqui */
        this.updateStatusDisplay();
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
        this.verificarDesafiosArquiteto();

        // Verificar runas do catálogo
        this.checkRunasCatalogo();

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
    // Loop até o rank estar correto para o nível atual — garante que múltiplos
    // ranks sejam concedidos de uma vez se o jogador ganhar muitos níveis seguidos.
    checkRank() {
        let advanced = false;
        while (true) {
            const currentRankIndex = RANKS.indexOf(this.data.rank);
            if (currentRankIndex === -1 || currentRankIndex >= RANKS.length - 1) break;

            // Calcular nível necessário para o próximo rank
            let levelsNeeded = 10;
            let totalLevels = 1; // Começa no nível 1
            for (let i = 0; i < currentRankIndex; i++) {
                totalLevels += levelsNeeded;
                levelsNeeded = Math.floor(levelsNeeded * 1.2);
            }
            const levelForNextRank = totalLevels + levelsNeeded;

            if (this.data.nivel >= levelForNextRank) {
                this.data.rank = RANKS[currentRankIndex + 1];
                this.addNotification('RANK UP!', `Seu rank subiu para ${this.data.rank}!`, 'rankup');
                advanced = true;
            } else {
                break;
            }
        }
        if (advanced) this.updateAllDisplays();
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

        // Filtrar apenas treinos dos últimos 7 dias (semana corrente)
        // Sem esse filtro, o array acumula treinos de semanas anteriores e o requisito
        // seria sempre atendido após algumas semanas de uso, independente da semana atual.
        const agora = Date.now();
        const seteDiasAtras = new Date(agora - 7 * 86400000);
        const treinosSemanaAtual = (this.data.treinosSemana || []).filter(t => {
            return new Date(t.data) >= seteDiasAtras;
        });

        // Verificar requisitos baseado na classe
        if (this.data.classe === 'Necromante') {
            // Necromante: precisa de tudo (treinos, estudos, hábitos)
            const treinosOk = treinosSemanaAtual.length >= 5;
            const habitosOk = this.checkAllHabitsCompleted();
            const estudosOk = this.checkStudiesCompleted();

            if (treinosOk && habitosOk && estudosOk) {
                moedas = Math.floor(Math.random() * (classeData.coinMultiplier.max - classeData.coinMultiplier.min + 1)) + classeData.coinMultiplier.min;
            }
        } else {
            // Outras classes: requisitos específicos
            const bonusAttr = classeData.bonusAttribute;
            let requirementMet = false;

            if (bonusAttr === 'disciplina') {
                requirementMet = treinosSemanaAtual.length >= 5;
            } else if (bonusAttr === 'forca') {
                requirementMet = treinosSemanaAtual.length >= 5;
            } else if (bonusAttr === 'sabedoria') {
                requirementMet = this.checkStudiesCompleted();
            } else if (bonusAttr === 'foco') {
                // Assassino: precisa de pelo menos 1 sessão de Cardio na semana.
                // Entradas novas têm campo 'tipo' direto. Entradas antigas (sem tipo) são
                // verificadas via lookup do grupo cadastrado pelo treinoId.
                requirementMet = treinosSemanaAtual.some(t => {
                    if (t.tipo === 'Cardio') return true;
                    const grupo = (this.data.treinoFisico?.grupos || []).find(g => g.id === t.treinoId);
                    return grupo?.tipo === 'Cardio';
                });
            } else if (bonusAttr === 'vitalidade') {
                requirementMet = this.checkAllHabitsCompleted();
            } else if (bonusAttr === 'carisma') {
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

    // Verificar se todos os hábitos ativos de hoje foram completados
    checkAllHabitsCompleted() {
        const todayKey = getTodayKey();
        if (!Array.isArray(this.data.habitos) || this.data.habitos.length === 0) return false;
        // Filtrar apenas hábitos ativos que deveriam aparecer hoje
        const habitosHoje = this.data.habitos.filter(h =>
            h.ativo !== false && shouldTaskAppearToday(h, new Date())
        );
        if (habitosHoje.length === 0) return false;
        return habitosHoje.every(habito => {
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
                    this.verificarDesafiosArquiteto();
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
        if (typeof renderSysCalendar === 'function' && document.getElementById('calendarSection')?.classList.contains('active')) {
            renderSysCalendar();
        }
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

        const evoName = nextEvolutionInfo.includes('NENHUMA') || nextEvolutionInfo.includes('MÁXIMA')
            ? nextEvolutionInfo
            : nextEvolutionInfo.split(' (')[0];
        const evoSub = (!nextEvolutionInfo.includes('NENHUMA') && !nextEvolutionInfo.includes('MÁXIMA'))
            ? (nextEvolutionInfo.split('(')[1] ? `Nível ${nextEvolutionInfo.split('(')[1].replace(')', '')}` : '')
                + (this.data.classe && this.data.nivel < 50 + ((this.data.classeStage || 0) + 1) * 25
                    ? ` · Faltam ${Math.max(0, (50 + ((this.data.classeStage || 0) + 1) * 25) - this.data.nivel)} níveis`
                    : '')
            : '';

        progressInfo.innerHTML = `
            <div class="pgi-block">
                <div class="pgi-label">EVOLUÇÃO DE CLASSE</div>
                <div class="pgi-card">
                    <div class="pgi-card-main">${evoName}</div>
                    ${evoSub ? `<div class="pgi-card-sub">${evoSub}</div>` : ''}
                </div>
            </div>
            <div class="pgi-block">
                <div class="pgi-label">RANK DE HUNTER</div>
                ${nextRankInfo.includes('MÁXIMO') ? `
                    <div class="pgi-card"><div class="pgi-card-main">${nextRankInfo}</div></div>
                ` : `
                    <div class="pgi-card">
                        ${levelsNeededForRank > 0 ? `<div class="pgi-card-sub">Faltam ${levelsNeededForRank} níveis para RANK ${RANKS[currentRankIndex + 1]}</div>` : ''}
                        <div class="bar-wrapper pgi-bar"><div class="bar-fill exp-bar" style="width:${rankPercentage}%"></div></div>
                        <div class="pgi-card-sub pgi-bar-label">Nível ${this.data.nivel} / ${levelForNextRank}</div>
                    </div>
                `}
            </div>
        `;

        // Resumo semanal de treino físico
        const tf = this.data.treinoFisico;
        if (tf) {
            const diasNome = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const hoje = new Date();
            const semanaAtras = new Date(hoje.getTime() - 7 * 86400000);
            const sessoesNaSemana = (tf.historicoSessoes || []).filter(s => new Date(s.data) >= semanaAtras).length;
            const diasAtivos = tf.diasAtivos || [];
            const hojeIdx = hoje.getDay();
            const proximoDia = diasAtivos.length > 0
                ? (() => { for (let i = 1; i <= 7; i++) { const d = (hojeIdx + i) % 7; if (diasAtivos.includes(d)) return diasNome[d]; } return '—'; })()
                : '—';

            progressInfo.innerHTML += `
                <div class="pgi-block pgi-block--treino">
                    <div class="pgi-label">TREINO FÍSICO — ESTA SEMANA</div>
                    <div class="pgi-kpi-row">
                        <div class="pgi-kpi"><div class="pgi-kpi-val">${sessoesNaSemana}</div><div class="pgi-kpi-lbl">SESSÕES</div></div>
                        <div class="pgi-kpi"><div class="pgi-kpi-val">${diasAtivos.length}</div><div class="pgi-kpi-lbl">DIAS/SEM.</div></div>
                        <div class="pgi-kpi"><div class="pgi-kpi-val pgi-kpi-val--sm">${proximoDia}</div><div class="pgi-kpi-lbl">PRÓX. TREINO</div></div>
                    </div>
                </div>
            `;
        }
    }

    updateStatusDisplay() {
        const nome = this.data.nome || 'HUNTER';
        const apelido = this.data.apelido || 'Iniciante';
        const nivel = this.data.nivel;
        const rank = this.data.rank;
        const classeNome = this.data.classe ? this.getCurrentClassEvolution() : 'NENHUMA';
        const tituloNome = (() => {
            if (!this.data.titulo) return 'NENHUM';
            const t = TITLES.find(t => t.id === this.data.titulo);
            return (t ? t.nome : this.data.titulo).toUpperCase();
        })();

        // Sidebar
        const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setEl('sidebarNome', nome.toUpperCase());
        setEl('sidebarNivel', nivel);
        setEl('sidebarApelido', apelido);
        setEl('sidebarRank', rank);

        // Barra EXP sidebar
        const expPct = this.data.expNecessaria > 0 ? (this.data.exp / this.data.expNecessaria) * 100 : 0;
        const sidebarExpBar = document.getElementById('sidebarExpBar');
        if (sidebarExpBar) sidebarExpBar.style.width = Math.min(100, expPct) + '%';
        const sidebarXpText = document.getElementById('sidebarXpText');
        if (sidebarXpText) {
            const expv = this.data.exp != null ? this.data.exp : 0;
            const need = this.data.expNecessaria != null ? this.data.expNecessaria : 100;
            sidebarXpText.textContent = `${expv}/${need}`;
        }

        // Painel (layout vídeo)
        this.ensureXpHoje();
        setEl('levelText', nivel);
        setEl('rankText', rank);
        setEl('painelApelidoSub', apelido);
        const pCardTitle = document.getElementById('painelCardNivelTitle');
        if (pCardTitle) pCardTitle.textContent = `NÍVEL ${nivel} — ${apelido}`;
        setEl('painelKpiVirtude', tituloNome !== 'NENHUM' ? tituloNome : '—');
        setEl('painelKpiCompletas', String(this.countTarefasCompletasHoje()));
        setEl('painelKpiXpHoje', String(this.data.xpHoje != null ? this.data.xpHoje : 0));
        document.querySelectorAll('.painel-rank-value').forEach((el) => { el.textContent = rank; });

        setEl('currentTitleText', tituloNome);
        setEl('statusNome', nome);
        setEl('statusClasse', classeNome);

        // Título colapsável
        const tituloEl = document.querySelector('#statusSection .section-content .section-text');
        if (tituloEl) tituloEl.textContent = tituloNome;

        if (typeof syncPainelFotoPerfilUI === 'function') {
            syncPainelFotoPerfilUI();
        }
        if (typeof updateArenaPainelCard === 'function') {
            updateArenaPainelCard(this);
        }
    }

    getCurrentClassEvolution() {
        if (!this.data.classe) return 'NENHUMA';
        const classeData = CLASSES[this.data.classe];
        return classeData.evolutions[this.data.classeStage] || classeData.name;
    }

    updateAttributesDisplay() {
        const attrs = ['forca', 'vitalidade', 'foco', 'carisma', 'disciplina', 'sabedoria'];
        const labels = ['FORÇA', 'VITALIDADE', 'FOCO', 'CARISMA', 'DISCIPLINA', 'SABEDORIA'];

        attrs.forEach((attr, index) => {
            const val = this.getAttributeInt(attr);
            document.querySelectorAll(`[data-attr="${attr}"]`).forEach(el => {
                if (el.classList.contains('attr-value') || el.classList.contains('sys-attr-card-value')) {
                    el.textContent = val;
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
        const val = this.data.moedas.toLocaleString('pt-BR');
        document.querySelectorAll('.shop-currency-amount, #modalBalance, #sidebarMoedas, #painelMoedas').forEach(el => {
            el.textContent = val;
        });
    }

    updateNotificationsDisplay() {
        const container = document.querySelector('#notificationSection .notification-container');
        if (!container) return;

        const notificacoes = Array.isArray(this.data.notificacoes) ? this.data.notificacoes : [];

        // Filtro selecionado (será gerenciado pelo JavaScript)
        const filterType = container.dataset.filterType || 'all';

        // Filtrar notificações
        let filtered = notificacoes;
        if (filterType !== 'all') {
            filtered = notificacoes.filter(n => n.type === filterType);
        }

        // Ordenar por data (mais recente primeiro)
        filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

        const typeColors = {
            'info': { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)' },
            'levelup': { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)' },
            'rankup': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
            'evolution': { color: '#c084fc', bg: 'rgba(192,132,252,0.1)', border: 'rgba(192,132,252,0.3)' },
            'coins': { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)' },
            'weekly': { color: '#2dd4bf', bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.25)' },
            'death': { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' }
        };

        container.innerHTML = `
            <div class="notif-filters">
                <button class="notif-filter-btn ${filterType === 'all' ? 'active' : ''}" data-filter="all">Todas</button>
                <button class="notif-filter-btn ${filterType === 'levelup' ? 'active' : ''}" data-filter="levelup">Level Up</button>
                <button class="notif-filter-btn ${filterType === 'rankup' ? 'active' : ''}" data-filter="rankup">Rank Up</button>
                <button class="notif-filter-btn ${filterType === 'evolution' ? 'active' : ''}" data-filter="evolution">Evolução</button>
                <button class="notif-filter-btn ${filterType === 'coins' ? 'active' : ''}" data-filter="coins">Moedas</button>
                <button class="notif-filter-btn ${filterType === 'info' ? 'active' : ''}" data-filter="info">Info</button>
                <button class="notif-filter-btn ${filterType === 'death' ? 'active' : ''}" data-filter="death">Morte</button>
            </div>

            <div class="notif-list">
                ${filtered.length > 0 ? filtered.map(notif => {
                    const tc = typeColors[notif.type] || { color: '#fff', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
                    return `<div class="notif-card" style="border-color:${tc.border};background:${tc.bg}">
                        <div class="notif-card-header">
                            <div class="notif-dot" style="background:${tc.color};box-shadow:0 0 6px ${tc.color}"></div>
                            <div class="notif-title">${notif.title}</div>
                            <div class="notif-icon" style="color:${tc.color}">${this.getNotificationIcon(notif.type)}</div>
                            <button class="notif-del-btn" onclick="deleteNotification(${notif.id})">×</button>
                        </div>
                        <div class="notif-message">${notif.message}</div>
                        <div class="notif-time">${notif.time}</div>
                    </div>`;
                }).join('') : '<div class="notif-empty">Nenhuma notificação encontrada.</div>'}
            </div>
        `;

        // Salvar filtro atual
        container.dataset.filterType = filterType;

        // Re-adicionar event listeners para filtros
        setTimeout(() => {
            document.querySelectorAll('#notificationSection .notif-filter-btn').forEach(btn => {
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
            <!-- Arquiteto warning quote -->
            <div class="zf-arquiteto-quote">
                <div class="zf-quote-icon">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><path d="M10 2.2L2.5 16.5a.7.7 0 0 0 .6 1.1H17a.7.7 0 0 0 .6-1.1L10 2.2z" fill="currentColor" fill-opacity="0.12"/><line x1="10" y1="7" x2="10" y2="10.2"/><circle cx="10" cy="13" r="0.65" fill="currentColor"/></svg>
                </div>
                <div class="zf-quote-text">
                    <div class="zf-quote-label">ARQUITETO</div>
                    <div class="zf-quote-msg">"Cada falha registrada é uma cicatriz no seu progresso. Enfrente-as com honestidade e não repita os mesmos erros. O Sistema não perdoa a fraqueza — mas recompensa quem aprende com ela."</div>
                </div>
            </div>

            <!-- KPI grid -->
            <div class="zf-kpi-grid">
                <div class="zf-kpi zf-kpi--danger">
                    <div class="zf-kpi-label">TOTAL DE FALHAS</div>
                    <div class="zf-kpi-value">${total}</div>
                </div>
                <div class="zf-kpi zf-kpi--danger">
                    <div class="zf-kpi-label">HP PERDIDO</div>
                    <div class="zf-kpi-value">-${totalHpLost}</div>
                </div>
                <div class="zf-kpi zf-kpi--safe">
                    <div class="zf-kpi-label">DIAS SEM FALHA</div>
                    <div class="zf-kpi-value">${daysWithoutPenalty}</div>
                </div>
                <div class="zf-kpi zf-kpi--safe">
                    <div class="zf-kpi-label">MELHOR SEQUÊNCIA</div>
                    <div class="zf-kpi-value">${bestStreak}<span style="font-size:0.55em;opacity:0.7"> dias</span></div>
                </div>
            </div>

            <!-- Sub stats row -->
            <div class="zf-sub-stats">
                <span class="zf-sub-item"><span class="zf-sub-dot zf-sub-dot--auto"></span>Automáticas: ${autoPenalties}</span>
                <span class="zf-divider">|</span>
                <span class="zf-sub-item"><span class="zf-sub-dot zf-sub-dot--manual"></span>Manuais: ${manualPenalties}</span>
            </div>

            <!-- Apply penalty button -->
            <button class="zf-apply-btn" id="addManualPenaltyBtn">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style="width:15px;height:15px"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>
                REGISTRAR FALHA MANUAL
            </button>

            <!-- Chart -->
            <div class="zf-chart-card">
                <div class="zf-chart-title">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" style="width:13px;height:13px"><polyline points="2,12 5,7 8,9 11,5 14,7"/></svg>
                    FALHAS NOS ÚLTIMOS 6 MESES
                </div>
                <canvas id="penaltiesChart" width="600" height="120" style="width:100%;max-height:120px;display:block;margin-top:8px"></canvas>
            </div>

            <!-- Filters -->
            <div class="zf-filters">
                <button class="zf-filter-btn ${filterPeriod === 'all' ? 'active' : ''}" data-filter="all">Todas</button>
                <button class="zf-filter-btn ${filterPeriod === 'week' ? 'active' : ''}" data-filter="week">Última Semana</button>
                <button class="zf-filter-btn ${filterPeriod === 'month' ? 'active' : ''}" data-filter="month">Último Mês</button>
                <button class="zf-filter-btn ${filterPeriod === 'manual' ? 'active' : ''}" data-filter="manual">Manuais</button>
                <button class="zf-filter-btn ${filterPeriod === 'auto' ? 'active' : ''}" data-filter="auto">Automáticas</button>
            </div>

            <!-- Penalty list -->
            <div class="zf-list-title">REGISTRO DE FALHAS</div>
            <div id="penaltiesList" class="zf-list">
                ${this.renderPenaltiesList(sortedPenalties, filterPeriod)}
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
            document.querySelectorAll('.zf-filter-btn').forEach(btn => {
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
            return '<div class="zf-empty">Nenhuma falha registrada neste período. Continue assim!</div>';
        }

        return filtered.map(p => {
            const [y, m, d] = p.dateKey.split('-');
            const formattedDate = `${d}/${m}/${y}`;
            const typeLabel = p.isManual ? 'MANUAL' : 'AUTO';
            const isManual = p.isManual;

            const habitsInfo = p.incompleteHabits?.length
                ? `<div class="zf-item-detail">Hábitos: ${p.incompleteHabits.join(', ')}</div>` : '';
            const reasonInfo = p.reason
                ? `<div class="zf-item-detail">Motivo: ${p.reason}</div>` : '';

            return `<div class="zf-item ${isManual ? 'zf-item--manual' : 'zf-item--auto'}">
                <div class="zf-item-header">
                    <span class="zf-item-date">${formattedDate}</span>
                    <span class="zf-item-badge zf-item-badge--${isManual ? 'manual' : 'auto'}">${typeLabel}</span>
                    <span class="zf-item-hp">HP -${p.hpLoss}</span>
                </div>
                <div class="zf-item-desc">${p.description || '—'}</div>
                ${habitsInfo}${reasonInfo}
            </div>`;
        }).join('');
    }

    drawPenaltiesChart(monthlyData) {
        const canvas = document.getElementById('penaltiesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const padding = 40;
        const width = canvas.width;

        const months = Object.keys(monthlyData).reverse();
        const values = months.map(m => monthlyData[m]);
        const maxValue = Math.max(1, ...values);

        // Altura dinâmica: base fixa cobre até 10 penalidades confortavelmente.
        // Acima de 10, o canvas cresce para garantir ~16px por label no eixo Y,
        // evitando sobreposição independente de quantas penalidades houver.
        const PX_POR_LABEL = 16;
        const CHART_HEIGHT_BASE = 160; // confortável para até 10
        const chartHeight = Math.max(CHART_HEIGHT_BASE, maxValue * PX_POR_LABEL);
        const height = chartHeight + padding * 2;
        canvas.height = height; // redimensiona o canvas antes de desenhar

        const chartWidth = width - padding * 2;
        const barWidth = chartWidth / months.length;

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        // Fundo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, width, height);

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
                ctx.font = 'bold 11px Orbitron, Inter, Rajdhani, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(valor.toString(), x + barWidth * 0.4, y - 5);
            }

            // Mês
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '9px Orbitron, Inter, Rajdhani, sans-serif';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(x + barWidth * 0.4, height - 15);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(month, 0, 0);
            ctx.restore();
        });

        // Eixo Y
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '9px Orbitron, Inter, Rajdhani, sans-serif';
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

                case 'habitos_completos': {
                    const habitosCompletos = (this.data.habitos || []).reduce((sum, h) => {
                        const c = h.completions;
                        if (!c) return sum;
                        if (Array.isArray(c)) return sum + c.length;
                        if (typeof c === 'object') return sum + Object.keys(c).length;
                        return sum;
                    }, 0);
                    if (habitosCompletos >= req.valor) {
                        unlocked = true;
                    }
                    break;
                }

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

                case 'dias_sem_penalidade': {
                    const start = this.data.penalidadesStreakTrackingStart;
                    if (!start || String(start).length < 10) {
                        break;
                    }
                    const hoje = new Date();
                    let diasSemPenalidade = 0;
                    for (let i = 0; i < req.valor; i++) {
                        const data = new Date(hoje);
                        data.setDate(data.getDate() - i);
                        const dateKey = this.getDateKey(data);
                        if (dateKey < start) {
                            break;
                        }
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

    // -------------------------------------------------------
    // CATÁLOGO DE RUNAS — desbloqueio e ativação
    // -------------------------------------------------------
    checkRunasCatalogo() {
        if (!Array.isArray(this.data.runasCatalogo)) this.data.runasCatalogo = [];

        const nivelAtual  = this.data.nivel || 0;
        const moedasAtual = this.data.moedas || 0;
        const attrs       = this.data.atributos || {};
        const treinos     = (this.data.treinoFisico?.historicoSessoes || []).length;
        const streakAtual = this._calcDiasSemPenalidade();
        let novasRunas    = false;

        RUNAS_CATALOG.forEach(runa => {
            if (this.data.runasCatalogo.includes(runa.id)) return; // já desbloqueada
            if (runa.unlock.canal === 'missao_surpresa') return;   // só via IA

            let ok = false;
            const u = runa.unlock;
            switch (u.canal) {
                case 'nivel':
                    ok = nivelAtual >= u.valor;
                    break;
                case 'atributo':
                    ok = (attrs[u.atributo] || 0) >= u.valor;
                    break;
                case 'conquista':
                    if (u.valor === 'moedas_500')  ok = moedasAtual >= 500;
                    if (u.valor === 'streak_7')    ok = streakAtual >= 7;
                    if (u.valor === 'treinos_25')  ok = treinos >= 25;
                    break;
                // 'moedas' = compra manual; não desbloqueia automaticamente
            }

            if (ok) {
                this.data.runasCatalogo.push(runa.id);
                this.addNotification('RUNA DESBLOQUEADA!', `A ${runa.nome} está disponível na seção de Runas.`, 'evolution');
                novasRunas = true;
            }
        });

        if (novasRunas) this.saveData();
    }

    desbloquearRunaCatalogoPorMissao(runaId) {
        if (!RUNAS_CATALOG.find(r => r.id === runaId)) return;
        if (!Array.isArray(this.data.runasCatalogo)) this.data.runasCatalogo = [];
        if (this.data.runasCatalogo.includes(runaId)) return;
        this.data.runasCatalogo.push(runaId);
        const runa = RUNAS_CATALOG.find(r => r.id === runaId);
        this.addNotification('RUNA LENDÁRIA DESBLOQUEADA!', `O Arquiteto concedeu: ${runa.nome}. Confira a seção de Runas.`, 'evolution');
        this.saveData();
        if (typeof updateRunesDisplay === 'function') updateRunesDisplay();
    }

    ativarRunaCatalogo(runaId) {
        const runa = RUNAS_CATALOG.find(r => r.id === runaId);
        if (!runa) return;
        if (!this.data.runasCatalogo.includes(runaId)) return;
        if (runa.tipo === 'passiva') return; // passivas não precisam de ativação manual

        if (!Array.isArray(this.data.runasCatalogoAtivas)) this.data.runasCatalogoAtivas = [];
        const jaAtiva = this.data.runasCatalogoAtivas.find(a => a.id === runaId && new Date(a.activeUntil) > new Date());
        if (jaAtiva) { showToast('Esta runa já está ativa.', 'info'); return; }

        if ((this.data.mp || 0) < runa.mpCost) { showToast('MP insuficiente para ativar esta runa.', 'error'); return; }
        this.useMp(runa.mpCost);

        const activeUntil = new Date(Date.now() + runa.duration * 60000).toISOString();
        this.data.runasCatalogoAtivas = this.data.runasCatalogoAtivas.filter(a => a.id !== runaId);
        this.data.runasCatalogoAtivas.push({ id: runaId, activeUntil });
        this.saveData();
        this.addNotification('RUNA ATIVADA!', `${runa.nome} está ativa por ${runa.duration} minutos.`, 'evolution');
        if (typeof updateRunesDisplay === 'function') updateRunesDisplay();
    }

    getRunaCatalogoAtiva(runaId) {
        if (!Array.isArray(this.data.runasCatalogoAtivas)) return null;
        const entry = this.data.runasCatalogoAtivas.find(a => a.id === runaId);
        if (!entry) return null;
        if (new Date(entry.activeUntil) <= new Date()) return null;
        return entry;
    }

    isRunaCatalogoPassivaAtiva(runaId) {
        const runa = RUNAS_CATALOG.find(r => r.id === runaId);
        if (!runa || runa.tipo !== 'passiva') return false;
        return (this.data.runasCatalogo || []).includes(runaId);
    }

    comprarRunaCatalogo(runaId) {
        const runa = RUNAS_CATALOG.find(r => r.id === runaId);
        if (!runa || runa.unlock.canal !== 'moedas') return;
        if ((this.data.runasCatalogo || []).includes(runaId)) { showToast('Runa já desbloqueada.', 'info'); return; }
        const custo = runa.unlock.valor || 300;
        if ((this.data.moedas || 0) < custo) { showToast(`São necessárias ${custo} moedas (G).`, 'error'); return; }
        this.data.moedas -= custo;
        if (!Array.isArray(this.data.runasCatalogo)) this.data.runasCatalogo = [];
        this.data.runasCatalogo.push(runaId);
        this.addNotification('RUNA ADQUIRIDA!', `${runa.nome} desbloqueada por ${custo}G.`, 'evolution');
        this.saveData();
        this.updateMoedasDisplay();
        if (typeof updateRunesDisplay === 'function') updateRunesDisplay();
    }

    _calcDiasSemPenalidade() {
        const penalidades = this.data.penalidades || [];
        let streak = 0;
        const hoje = new Date();
        for (let i = 0; i < 400; i++) {
            const d = new Date(hoje); d.setDate(d.getDate() - i);
            const key = this.getDateKey(d);
            if (penalidades.some(p => p.dateKey === key)) break;
            streak++;
        }
        return streak;
    }

    getDateKey(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // -------------------------------------------------------
    // DESAFIOS DO ARQUITETO
    // -------------------------------------------------------
    emitirDesafioArquiteto(tituloId) {
        const titulo = TITLES.find(t => t.id === tituloId && t.requisito.tipo === 'desafio_arquiteto');
        if (!titulo) return;
        if (!Array.isArray(this.data.desafiosArquiteto)) this.data.desafiosArquiteto = [];
        const jaExiste = this.data.desafiosArquiteto.find(d => d.tituloId === tituloId && d.status !== 'expirado');
        if (jaExiste) return;
        if (this.data.titulosDesbloqueados?.includes(tituloId)) return;
        this.data.desafiosArquiteto.push({
            tituloId,
            emitidoEm: new Date().toISOString(),
            aceitoEm: null,
            concluidoEm: null,
            status: 'pendente',
            progresso: 0
        });
        this.saveData();
        this.addNotification(
            'DESAFIO DO ARQUITETO!',
            `O Arquiteto emitiu o desafio: "${titulo.nome}". Aceite na seção de Títulos.`,
            'evolution'
        );
        if (typeof gameSystem.updateTitlesDisplay === 'function') this.updateTitlesDisplay();
    }

    aceitarDesafioArquiteto(tituloId) {
        if (!Array.isArray(this.data.desafiosArquiteto)) return;
        const desafio = this.data.desafiosArquiteto.find(d => d.tituloId === tituloId && d.status === 'pendente');
        if (!desafio) return;
        desafio.status = 'aceito';
        desafio.aceitoEm = new Date().toISOString();
        desafio.progresso = 0;
        this.saveData();
        const titulo = TITLES.find(t => t.id === tituloId);
        this.addNotification('DESAFIO ACEITO!', `Você aceitou: "${titulo?.nome}". O Arquiteto está observando.`, 'evolution');
        this.updateTitlesDisplay();
    }

    verificarDesafiosArquiteto() {
        if (!Array.isArray(this.data.desafiosArquiteto)) return;
        const ativos = this.data.desafiosArquiteto.filter(d => d.status === 'aceito');
        if (ativos.length === 0) return;

        const todayKey = this.getDateKey(new Date());
        let algumConcluido = false;

        ativos.forEach(desafio => {
            const titulo = TITLES.find(t => t.id === desafio.tituloId);
            if (!titulo || !titulo.desafio) return;
            const { meta, valor, diasLimite } = titulo.desafio;
            const aceitoDate = new Date(desafio.aceitoEm);
            const diasPassados = Math.floor((Date.now() - aceitoDate) / 86400000);

            // Expirar se ultrapassou o limite (diasLimite 0 = sem limite)
            if (diasLimite > 0 && diasPassados > diasLimite) {
                desafio.status = 'expirado';
                this.addNotification('DESAFIO EXPIRADO', `O desafio "${titulo.nome}" expirou sem ser concluído.`, 'error');
                return;
            }

            let progresso = 0;
            const aceitoKey = this.getDateKey(aceitoDate);

            switch (meta) {
                case 'missoes_7dias': {
                    const missoes = (this.data.missoes || []);
                    const keys = [];
                    for (let i = 0; i < 7; i++) {
                        const d = new Date(aceitoDate); d.setDate(d.getDate() + i);
                        keys.push(this.getDateKey(d));
                    }
                    progresso = missoes.reduce((s, m) => s + (m.completions || []).filter(k => keys.includes(k)).length, 0);
                    break;
                }
                case 'dias_completos': {
                    let diasCompletos = 0;
                    for (let i = 0; i < diasLimite; i++) {
                        const d = new Date(aceitoDate); d.setDate(d.getDate() + i);
                        const k = this.getDateKey(d);
                        if (k > todayKey) break;
                        const temMissoes = (this.data.missoes || []).filter(m => (m.completions || []).includes(k)).length;
                        const totalHoje = (this.data.missoes || []).filter(m => m.ativo !== false).length;
                        if (totalHoje > 0 && temMissoes >= totalHoje) diasCompletos++;
                    }
                    progresso = diasCompletos;
                    break;
                }
                case 'dias_sem_penalidade': {
                    let streak = 0;
                    for (let i = 0; i < diasLimite; i++) {
                        const d = new Date(aceitoDate); d.setDate(d.getDate() + i);
                        const k = this.getDateKey(d);
                        if (k > todayKey) break;
                        if ((this.data.penalidades || []).some(p => p.dateKey === k)) break;
                        streak++;
                    }
                    progresso = streak;
                    break;
                }
                case 'dia_triplo': {
                    let triploDias = 0;
                    for (let i = 0; i < diasLimite; i++) {
                        const d = new Date(aceitoDate); d.setDate(d.getDate() + i);
                        const k = this.getDateKey(d);
                        if (k > todayKey) break;
                        const temMissao  = (this.data.missoes || []).some(m => (m.completions || []).includes(k));
                        const temTreino  = (this.data.treinoFisico?.historicoSessoes || []).some(s => (s.data || '').slice(0,10) === k);
                        const temEstudo  = (this.data.estudos || []).some(e => (e.data || '').slice(0,10) === k);
                        if (temMissao && temTreino && temEstudo) triploDias++;
                    }
                    progresso = triploDias;
                    break;
                }
                case 'nivel':
                    progresso = this.data.nivel >= valor ? valor : this.data.nivel;
                    break;
            }

            desafio.progresso = progresso;

            if (progresso >= valor) {
                desafio.status = 'concluido';
                desafio.concluidoEm = new Date().toISOString();
                if (!Array.isArray(this.data.titulosDesbloqueados)) this.data.titulosDesbloqueados = [];
                if (!this.data.titulosDesbloqueados.includes(desafio.tituloId)) {
                    this.data.titulosDesbloqueados.push(desafio.tituloId);
                    this.addNotification('TÍTULO DESBLOQUEADO!', `Desafio concluído! Você ganhou: "${titulo.nome}"`, 'evolution');
                    algumConcluido = true;
                }
            }
        });

        if (algumConcluido || ativos.length) {
            this.saveData();
            this.updateTitlesDisplay();
        }
    }

    updateTitlesDisplay() {
        const titleSection = Array.from(document.querySelectorAll('.attribute-section')).find(section => {
            const header = section.querySelector('.section-header-text');
            return header && header.textContent.includes('TÍTULO');
        });
        if (!titleSection) return;
        const content = titleSection.querySelector('.section-content');
        if (!content) return;

        const titulosDesbloqueados = this.data.titulosDesbloqueados || [];
        const desafios = this.data.desafiosArquiteto || [];
        const tituloAtual = this.data.titulo;
        let html = '';

        // --- Desafios disponíveis (pendente/aceito) ---
        const desafiosVisiveis = desafios.filter(d => d.status === 'pendente' || d.status === 'aceito');
        desafiosVisiveis.forEach(desafio => {
            const titulo = TITLES.find(t => t.id === desafio.tituloId);
            if (!titulo) return;
            const isPendente = desafio.status === 'pendente';
            const meta = titulo.desafio?.valor || 1;
            const prog = desafio.progresso || 0;
            const pct = Math.min(100, Math.round((prog / meta) * 100));

            html += `
            <div class="pgi-block" style="margin-bottom:8px;">
                <div class="pgi-label" style="color:rgba(251,191,36,0.8);">DESAFIO DO ARQUITETO</div>
                <div class="pgi-card" style="border-color:rgba(251,191,36,0.3);background:linear-gradient(145deg,rgba(251,191,36,0.05) 0%,rgba(6,8,14,0.95) 100%);">
                    <div class="pgi-card-main" style="color:rgba(251,191,36,0.9);">${titulo.nome}</div>
                    <div class="pgi-card-sub">${titulo.descricao}</div>
                    ${!isPendente ? `
                    <div class="bar-wrapper pgi-bar"><div class="bar-fill exp-bar" style="width:${pct}%;background:rgba(251,191,36,0.7) !important;"></div></div>
                    <div class="pgi-card-sub pgi-bar-label">${prog} / ${meta}</div>` : ''}
                    ${isPendente ? `<button onclick="gameSystem.aceitarDesafioArquiteto('${desafio.tituloId}')" style="margin-top:6px;width:100%;padding:5px 0;border:1px solid rgba(251,191,36,0.7);border-radius:5px;background:transparent;color:rgba(251,191,36,0.9);font-size:0.6rem;font-weight:700;letter-spacing:0.12em;cursor:pointer;">ACEITAR DESAFIO</button>` : ''}
                </div>
            </div>`;
        });

        // --- Títulos desbloqueados ---
        if (titulosDesbloqueados.length === 0 && desafiosVisiveis.length === 0) {
            content.innerHTML = '<div class="section-text">NENHUM TÍTULO DESBLOQUEADO</div>';
            return;
        }

        const titulos = TITLES.filter(t => titulosDesbloqueados.includes(t.id));
        html += titulos.map(t => {
            const isAtivo = tituloAtual === t.id;
            return `
            <div class="pgi-block" style="margin-bottom:8px;">
                <div class="pgi-card" onclick="selectTitle('${t.id}')" style="cursor:pointer;${isAtivo ? 'border-color:rgba(0,229,255,0.5);background:linear-gradient(145deg,rgba(0,229,255,0.07) 0%,rgba(6,8,14,0.95) 100%);' : ''}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                        <div class="pgi-card-main" style="${isAtivo ? 'color:#00e5ff;' : ''}">${t.nome}</div>
                        ${isAtivo ? '<div style="font-size:0.55rem;font-weight:700;letter-spacing:0.14em;color:#00e5ff;flex-shrink:0;">ATIVO</div>' : ''}
                    </div>
                    <div class="pgi-card-sub">${t.descricao}</div>
                </div>
            </div>`;
        }).join('');

        content.innerHTML = html;
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
        
        // Obter valores dos atributos (esquema atual: força, vitalidade, foco, carisma, disciplina, sabedoria)
        const attrs = ['forca', 'vitalidade', 'foco', 'carisma', 'disciplina', 'sabedoria'];
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
        const labels = ['FORÇA', 'VITALIDADE', 'FOCO', 'CARISMA', 'DISCIPLINA', 'SABEDORIA'];
        const colors = [
            'rgba(255, 100, 100, 0.4)',  // FORÇA - Vermelho
            'rgba(255, 200, 100, 0.4)',  // VITALIDADE - Laranja
            'rgba(100, 150, 255, 0.4)',  // FOCO - Azul
            'rgba(255, 255, 100, 0.4)',  // CARISMA - Amarelo
            'rgba(200, 100, 255, 0.4)',  // DISCIPLINA - Roxo
            'rgba(100, 255, 150, 0.4)'   // SABEDORIA - Verde
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
        ctx.font = 'bold 12px Orbitron, Inter, Rajdhani, sans-serif';
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

/** Filtro da aba Missões: all | active | done | unique | recurring */
let _missionListFilter = 'all';

function missionMatchesListFilter(m, filter) {
    if (!m || m.ativo === false) return false;
    const todayKey = getTodayKey();
    const appears = shouldTaskAppearToday(m, new Date());
    const doneToday = m.completions && m.completions.includes(todayKey);
    const isUnique = !!m.unique;
    const doneUnique = isUnique && m.completions && m.completions.length > 0;

    switch (filter) {
        case 'all':
            return true;
        case 'active':
            if (isUnique) return !doneUnique;
            if (appears) return !doneToday;
            return false;
        case 'done':
            if (isUnique) return doneUnique;
            return doneToday;
        case 'unique':
            return isUnique;
        case 'recurring':
            return !isUnique;
        default:
            return true;
    }
}

// Marca conclusão de tarefa para o dia indicado (padrão: hoje). O calendário de missões passa a chave do dia visível.
function completeRecurringTask(task, dateKey) {
    const key = dateKey || getTodayKey();
    if (!task.completions) task.completions = [];
    if (!task.completions.includes(key)) {
        task.completions.push(key);
    }
}

// ============================================
// INICIALIZAÇÃO GLOBAL
// ============================================

let gameSystem;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema
    gameSystem = new GameSystem();
    window.gameSystem = gameSystem;

    // Navegação de abas + gaveta da sidebar (mobile)
    initTabNavigation();
    initMobileSidebar();

    const sairBtn = document.getElementById('sairBtn');
    if (sairBtn) {
        sairBtn.addEventListener('click', function() {
            if (window.confirm('Encerrar sessão do Sistema? A página será recarregada.')) {
                window.location.reload();
            }
        });
    }

    const painelFab = document.getElementById('painelFab');
    if (painelFab) {
        painelFab.addEventListener('click', function() {
            const tab = document.querySelector('.sys-nav .tab-icon-btn[data-tab="tasks"]');
            if (tab) tab.click();
        });
    }
    
    // Inicializar partículas
    initAllParticles();
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        // Inicializar seções colapsáveis
        initCollapsibleSections();
        
        // Inicializar sistemas específicos
        initTrainingSystem();
        initTreinoFisico();
        initTasksSystem();
        initSkillsSystem();
        initShopSystem();
        initPenaltySystem();
        initArquitetoIA();
        initPainelArquitetoMessage();
        // Análise semanal de rotina para criação de habilidades (assíncrono, não bloqueia)
        setTimeout(() => analisarRotinaParaHabilidade(), 3000);
        initItensRecompensa();
        initItemSettingsModal();
        initMatrizPrioridades();
        initProgresso();
        initVirtudes();
        initArvoreEvolucao();
        initArquitetoPersonagem();
        initArena();
        initSuporte();
        initConfiguracoes();
        initPainelFotoPerfil();
        
        // Inicializar modais
        initModals();
        
        // Atualizar gráfico hexagonal se já estiver na seção de status
        const statusSec = document.getElementById('statusSection');
        if (gameSystem && statusSec?.classList.contains('active')) {
            setTimeout(() => {
                gameSystem.updateHexagonChart();
            }, 500);
        }
        
        // Atualizar gráfico hexagonal periodicamente (referência armazenada para permitir clearInterval futuro)
        window._hexagonChartInterval = window._hexagonChartInterval || setInterval(() => {
            const sec = document.getElementById('statusSection');
            if (gameSystem && sec?.classList.contains('active')) {
                gameSystem.updateHexagonChart();
            }
        }, 2000);
    }, 100);
});

// ============================================
// FUNÇÕES DE NAVEGAÇÃO E UI
// ============================================

function isMobileSidebarMode() {
    return typeof window.matchMedia !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
}

/**
 * Gaveta da sidebar (mobile): aberta / fechada.
 * Desktop: a classe de estado é limpa; scroll do body nunca fica preso.
 */
function setSidebarOpen(open) {
    const app = document.querySelector('.sys-app');
    if (!app) return;
    const wantOpen = Boolean(open);
    app.classList.toggle('sys-app--sidebar-open', wantOpen);
    const backdrop = document.getElementById('sysSidebarBackdrop');
    const openBtn = document.getElementById('sysSidebarOpenBtn');
    if (backdrop) {
        backdrop.setAttribute('aria-hidden', wantOpen ? 'false' : 'true');
    }
    if (openBtn) {
        openBtn.setAttribute('aria-expanded', wantOpen ? 'true' : 'false');
    }
    if (isMobileSidebarMode()) {
        document.body.classList.toggle('sys-body--no-scroll', wantOpen);
    } else {
        document.body.classList.remove('sys-body--no-scroll');
    }
}

function initMobileSidebar() {
    const app = document.querySelector('.sys-app');
    const openBtn = document.getElementById('sysSidebarOpenBtn');
    const closeBtn = document.getElementById('sysSidebarCloseBtn');
    const backdrop = document.getElementById('sysSidebarBackdrop');
    if (!app) return;

    function toggleDrawer() {
        if (!isMobileSidebarMode()) return;
        setSidebarOpen(!app.classList.contains('sys-app--sidebar-open'));
    }

    if (openBtn) openBtn.addEventListener('click', toggleDrawer);
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            setSidebarOpen(false);
        });
    }
    if (backdrop) {
        backdrop.addEventListener('click', function() {
            setSidebarOpen(false);
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && app.classList.contains('sys-app--sidebar-open')) {
            setSidebarOpen(false);
        }
    });

    const mq = window.matchMedia('(max-width: 900px)');
    function onViewportChange() {
        if (!mq.matches) {
            setSidebarOpen(false);
        }
    }
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onViewportChange);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onViewportChange);
    }
}

// ============================================
// CALENDÁRIO — registo tático do tempo (ref. vídeo SISTEMA)
// ============================================
let _calendarViewDate = new Date();
let _calendarWeekAnchor = null; /* Segunda-feira (início) da semana em vista "semana" */
let _calendarViewMode = 'month'; /* "month" | "week" */
let _calendarSelectedKey = null;
let _calendarInitBound = false;

function addDaysToDate(d, n) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + n);
    return x;
}

/** Segunda-feira da semana local que contém `d` */
function getMondayOfWeek(d) {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return date;
}

function parseDateKeyToLocalDate(key) {
    const p = (key || '').split('-');
    if (p.length !== 3) return new Date();
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
}

function formatShortDayMonth(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mon = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez'
    ];
    return `${dd} ${mon[d.getMonth()]}`;
}

function formatWeekRangeTitle(monday) {
    const end = addDaysToDate(monday, 6);
    const mon = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    if (monday.getFullYear() === end.getFullYear() && monday.getMonth() === end.getMonth()) {
        return `SEMANA: ${monday.getDate()} — ${end.getDate()} ${mon[monday.getMonth()]} ${end.getFullYear()}`;
    }
    return `SEMANA: ${formatShortDayMonth(monday)} — ${formatShortDayMonth(end)} ${end.getFullYear()}`;
}

function getCalendarKeyForDate(d) {
    if (!gameSystem) return null;
    return gameSystem.getDateKey(d);
}

function keyMatchesCompletions(key, compArr) {
    if (!Array.isArray(compArr) || !compArr.length) return false;
    if (compArr.includes(key)) return true;
    // Compat. com chaves YYYY-MM-DD de getTodayKey() (UTC) vs data local
    return compArr.some((c) => c && c.slice(0, 10) === key);
}

/**
 * Resumo de um dia: contagens e flags para o grid + lista de detalhe.
 */
function getCalendarDayBundle(dateKey) {
    if (!gameSystem || !dateKey) return { penalties: [], treinos: 0, treinosFis: 0, estudosMin: 0, tasks: 0, notifs: [], levelup: 0, rankup: 0 };
    const g = gameSystem.data;
    const penalties = (g.penalidades || []).filter((p) => p && p.dateKey === dateKey);

    const treinosFis = (g.treinoFisico?.historicoSessoes || []).filter((s) => {
        if (!s || !s.data) return false;
        return gameSystem.getDateKey(new Date(s.data)) === dateKey;
    });
    const treinosOld = (g.treinos || []).filter(
        (t) => t && t.data && t.concluido && gameSystem.getDateKey(new Date(t.data)) === dateKey
    );
    const treinos = treinosFis.length + treinosOld.length;

    const estudosMin = (g.estudos || [])
        .filter((e) => e && e.data && gameSystem.getDateKey(new Date(e.data)) === dateKey)
        .reduce((s, e) => s + (e.minutos || 0), 0);

    let tasks = 0;
    [g.habitos, g.missoes].forEach((list) => {
        (list || []).forEach((t) => {
            if (keyMatchesCompletions(dateKey, t.completions)) tasks++;
        });
    });

    const notifs = (g.notificacoes || [])
        .filter((n) => n && n.date && gameSystem.getDateKey(new Date(n.date)) === dateKey);
    const levelup = notifs.filter((n) => n.type === 'levelup').length;
    const rankup = notifs.filter((n) => n.type === 'rankup' || n.type === 'evolution').length;

    return {
        penalties,
        treinosFis: treinosFis.length,
        treinosOld: treinosOld.length,
        treinos,
        estudosMin,
        tasks,
        notifs,
        levelup,
        rankup
    };
}

function formatCalendarDateLabelPT(dateKey) {
    const p = (dateKey || '').split('-');
    if (p.length !== 3) return dateKey;
    return `${p[2]}/${p[1]}/${p[0]}`;
}

function escapeHtml(s) {
    if (s == null) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function buildCalendarDetailHTML(key) {
    if (!gameSystem || !key) {
        return '<p class="sys-calendar-empty">Sem dados.</p>';
    }
    const b = getCalendarDayBundle(key);
    const lines = [];
    b.penalties.forEach((p) => {
        const label = p.type === 'habitos_nao_concluidos' ? 'Penalidade (hábitos)' : p.type || 'Penalidade';
        lines.push({ t: 'p', h: 'Penalidade', b: p.description || p.message || p.title || label });
    });
    const sessoes = (gameSystem.data.treinoFisico?.historicoSessoes || []).filter(
        (s) => s && s.data && gameSystem.getDateKey(new Date(s.data)) === key
    );
    sessoes.forEach((s) => {
        const m = s.duracaoMinutos != null ? ` · ${s.duracaoMinutos} min` : '';
        lines.push({ t: 't', h: 'Treino físico', b: `Sessão concluída${m}` });
    });
    (gameSystem.data.treinos || [])
        .filter((t) => t && t.data && t.concluido && gameSystem.getDateKey(new Date(t.data)) === key)
        .forEach((t) => {
            lines.push({ t: 't', h: 'Treino', b: t.nome || t.titulo || 'Treino' });
        });
    if (b.estudosMin > 0) {
        const horas = (b.estudosMin / 60).toFixed(1);
        lines.push({ t: 'c', h: 'Estudo', b: `Total: ${b.estudosMin} min (~${horas} h)` });
    }
    if (b.tasks > 0) {
        const names = [];
        [gameSystem.data.habitos, gameSystem.data.missoes].forEach((list) => {
            (list || []).forEach((t) => {
                if (keyMatchesCompletions(key, t.completions)) {
                    const label = (t.titulo || t.nome || '').trim();
                    if (label) names.push(label);
                }
            });
        });
        lines.push({
            t: 'c',
            h: 'Hábitos e missões',
            b: names.length
                ? names.slice(0, 5).join(', ') + (names.length > 5 ? ` +${names.length - 5}` : '')
                : `${b.tasks} conclusão(ões)`
        });
    }
    b.notifs.forEach((n) => {
        lines.push({
            t: 'n',
            h: n.type ? `Sistema (${n.type})` : 'Sistema',
            b: (n.title ? n.title + ' — ' : '') + (n.message || '')
        });
    });
    if (!lines.length) {
        return '<p class="sys-calendar-empty">Nenhum registo neste dia. Cada ação (treino, tarefa, notificação) deixa rasto no Sistema com o tempo.</p>';
    }
    return `<ul class="sys-calendar-detail-list">${lines
        .map(
            (l) => `<li class="sys-calendar-line">
            <span class="sys-calendar-line-ico sys-cal-d--${l.t}"></span>
            <div><strong>${escapeHtml(l.h)}</strong><div>${escapeHtml(l.b)}</div></div>
        </li>`
        )
        .join('')}</ul>`;
}

function buildCalDayCell(d, key, todayK, _calendarSelectedKey) {
    const b = getCalendarDayBundle(key);
    const isToday = key === todayK;
    const isSelected = key === _calendarSelectedKey;
    const hasP = b.penalties.length > 0;
    const hasT = b.treinos > 0;
    const hasC = b.tasks > 0;
    const hasN = b.notifs.length > 0;
    const dots = [];
    if (hasP) dots.push('p');
    if (hasT) dots.push('t');
    if (hasC) dots.push('c');
    if (hasN) dots.push('n');
    const dotHtml =
        dots.length > 0
            ? `<div class="sys-cal-cell-dots">${dots
                  .map((kDot) => `<span class="sys-cal-d sys-cal-d--${kDot}" title=""></span>`)
                  .join('')}</div>`
            : '<div class="sys-cal-cell-dots"></div>';
    const dayNum = d.getDate();
    const cls = ['sys-cal-cell', isToday ? 'sys-cal-cell--today' : '', isSelected ? 'sys-cal-cell--selected' : '']
        .filter(Boolean)
        .join(' ');
    return `<button type="button" class="${cls}" data-cal-key="${key}" aria-pressed="${isSelected}"><span class="sys-cal-cell-num">${dayNum}</span>${dotHtml}</button>`;
}

function renderSysCalendar() {
    const host = document.getElementById('sysCalendarRoot');
    if (!host || !gameSystem) return;

    if (_calendarWeekAnchor == null) {
        _calendarWeekAnchor = getMondayOfWeek(new Date());
    }

    const y = _calendarViewDate.getFullYear();
    const m = _calendarViewDate.getMonth();
    const monthNames = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ];
    const weekNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const isWeek = _calendarViewMode === 'week';
    const monday = isWeek
        ? getMondayOfWeek(_calendarWeekAnchor)
        : null;

    if (_calendarSelectedKey == null) {
        _calendarSelectedKey = getCalendarKeyForDate(new Date());
    }
    if (!_calendarSelectedKey) {
        const t = new Date();
        _calendarSelectedKey = gameSystem.getDateKey(t);
    }

    let firstKey;
    let lastKey;
    if (isWeek) {
        firstKey = getCalendarKeyForDate(monday);
        lastKey = getCalendarKeyForDate(addDaysToDate(monday, 6));
    } else {
        const lastDay = new Date(y, m + 1, 0).getDate();
        firstKey = getCalendarKeyForDate(new Date(y, m, 1));
        lastKey = getCalendarKeyForDate(new Date(y, m, lastDay));
    }
    if (_calendarSelectedKey < firstKey || _calendarSelectedKey > lastKey) {
        const tKey = getCalendarKeyForDate(new Date());
        if (tKey >= firstKey && tKey <= lastKey) {
            _calendarSelectedKey = tKey;
        } else {
            _calendarSelectedKey = firstKey;
        }
    }

    const todayK = getCalendarKeyForDate(new Date());
    let cells = '';

    if (isWeek) {
        for (let i = 0; i < 7; i++) {
            const d = addDaysToDate(monday, i);
            const key = getCalendarKeyForDate(d);
            cells += buildCalDayCell(d, key, todayK, _calendarSelectedKey);
        }
    } else {
        const firstM = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0).getDate();
        const w0 = firstM.getDay();
        const startPad = w0 === 0 ? 6 : w0 - 1;
        for (let p = 0; p < startPad; p++) {
            cells += '<div class="sys-cal-cell sys-cal-cell--empty" aria-hidden="true"></div>';
        }
        for (let day = 1; day <= lastDay; day++) {
            const d = new Date(y, m, day);
            const key = getCalendarKeyForDate(d);
            cells += buildCalDayCell(d, key, todayK, _calendarSelectedKey);
        }
    }

    const detailHtml = buildCalendarDetailHTML(_calendarSelectedKey);
    const selLabel = formatCalendarDateLabelPT(_calendarSelectedKey);

    const titleMain = isWeek
        ? formatWeekRangeTitle(monday)
        : `${monthNames[m]} ${y}`;
    const navPrev = isWeek ? '◀ SEM.' : '◀ MÊS';
    const navNext = isWeek ? 'SEM. ▶' : 'MÊS ▶';
    const labelPrev = isWeek ? 'Semana anterior' : 'Mês anterior';
    const labelNext = isWeek ? 'Próxima semana' : 'Próximo mês';
    const gridClass = isWeek ? 'sys-calendar-grid sys-calendar-grid--week' : 'sys-calendar-grid';
    const wrapClass = isWeek ? 'sys-calendar-wrap sys-calendar-wrap--week' : 'sys-calendar-wrap';

    const wActive = _calendarViewMode === 'week' ? 'is-active' : '';
    const mActive = _calendarViewMode === 'month' ? 'is-active' : '';

    const html = `
        <div class="sys-calendar-header-block">
            <div class="sys-calendar-toolbar">
                <h2 class="sys-calendar-mes" id="calTitle">${titleMain}</h2>
                <div class="sys-calendar-nav">
                    <button type="button" class="sys-calendar-btn" id="calPrev" aria-label="${labelPrev}">${navPrev}</button>
                    <button type="button" class="sys-calendar-btn sys-calendar-btn--today-ico" id="calToday" aria-label="Ir para hoje" title="Ir para hoje">
                        <svg class="sys-calendar-ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </button>
                    <button type="button" class="sys-calendar-btn" id="calNext" aria-label="${labelNext}">${navNext}</button>
                </div>
            </div>
            <div class="sys-calendar-view-legend" role="group" aria-label="Escala de tempo do calendário">
                <span class="sys-calendar-view-legend-label">VISUALIZAÇÃO</span>
                <div class="sys-calendar-view-toggle">
                    <button type="button" class="sys-calendar-view-btn ${wActive}" data-cal-mode="week" aria-pressed="${isWeek}">SEMANA</button>
                    <button type="button" class="sys-calendar-view-btn ${mActive}" data-cal-mode="month" aria-pressed="${!isWeek}">MÊS</button>
                </div>
            </div>
            <p class="sys-calendar-legend" aria-hidden="true">
                <span><span class="sys-calendar-dot sys-calendar-dot--p"></span> Penal.</span>
                <span><span class="sys-calendar-dot sys-calendar-dot--t"></span> Treino</span>
                <span><span class="sys-calendar-dot sys-calendar-dot--c"></span> Tarefas</span>
                <span><span class="sys-calendar-dot sys-calendar-dot--n"></span> Sistema</span>
            </p>
        </div>
        <div class="sys-calendar-body">
            <div class="sys-calendar-main">
                <div class="${wrapClass}">
                    <div class="sys-calendar-weekrow sys-calendar-weekrow--head" role="row">
                        ${weekNames
                            .map(
                                (w) =>
                                    `<div class="sys-calendar-weekname" role="columnheader">${w}</div>`
                            )
                            .join('')}
                    </div>
                    <div class="${gridClass}" role="grid">${cells}</div>
                </div>
            </div>
            <div class="sys-calendar-side">
                <div class="sys-calendar-detail">
                    <h3 class="sys-calendar-detail-h">Dia ${selLabel}</h3>
                    ${detailHtml}
                </div>
            </div>
        </div>
    `;

    host.innerHTML = `<div class="sys-calendar-root-inner">${html}</div>`;

    const prev = document.getElementById('calPrev');
    const next = document.getElementById('calNext');
    const tbtn = document.getElementById('calToday');
    if (prev) {
        prev.onclick = () => {
            if (isWeek) {
                _calendarWeekAnchor = addDaysToDate(_calendarWeekAnchor, -7);
            } else {
                _calendarViewDate = new Date(y, m - 1, 1);
            }
            renderSysCalendar();
        };
    }
    if (next) {
        next.onclick = () => {
            if (isWeek) {
                _calendarWeekAnchor = addDaysToDate(_calendarWeekAnchor, 7);
            } else {
                _calendarViewDate = new Date(y, m + 1, 1);
            }
            renderSysCalendar();
        };
    }
    if (tbtn) {
        tbtn.onclick = () => {
            const now = new Date();
            if (isWeek) {
                _calendarWeekAnchor = getMondayOfWeek(now);
            } else {
                _calendarViewDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }
            _calendarSelectedKey = getCalendarKeyForDate(now);
            renderSysCalendar();
        };
    }

    const modeWeekBtn = host.querySelector('[data-cal-mode="week"]');
    const modeMonthBtn = host.querySelector('[data-cal-mode="month"]');
    if (modeWeekBtn) {
        modeWeekBtn.onclick = (e) => {
            e.preventDefault();
            if (_calendarViewMode === 'week') return;
            _calendarViewMode = 'week';
            const d = _calendarSelectedKey
                ? parseDateKeyToLocalDate(_calendarSelectedKey)
                : new Date();
            _calendarWeekAnchor = getMondayOfWeek(d);
            renderSysCalendar();
        };
    }
    if (modeMonthBtn) {
        modeMonthBtn.onclick = (e) => {
            e.preventDefault();
            if (_calendarViewMode === 'month') return;
            _calendarViewMode = 'month';
            const d = _calendarSelectedKey
                ? parseDateKeyToLocalDate(_calendarSelectedKey)
                : new Date();
            _calendarViewDate = new Date(d.getFullYear(), d.getMonth(), 1);
            renderSysCalendar();
        };
    }

    if (!_calendarInitBound) {
        _calendarInitBound = true;
        host.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.sys-cal-cell[data-cal-key]');
            if (!btn) return;
            const k = btn.getAttribute('data-cal-key');
            if (k) {
                _calendarSelectedKey = k;
                renderSysCalendar();
            }
        });
    }
}

function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab-icon-btn');
    const sections = document.querySelectorAll('.content-section');
    const windowContent = document.getElementById('windowContent');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            if (this.classList.contains('active')) return;

            if (isMobileSidebarMode()) {
                setSidebarOpen(false);
            }

            if (windowContent) windowContent.classList.add('hidden');

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
                            initPainelArquitetoMessage();
                        }, 100);
                    }
                    
                    // Atualizar habilidades em TRAINNE se for a seção de treinamento
                    if (targetTab === 'trainne' && gameSystem) {
                        setTimeout(() => {
                            if (typeof renderSkillsInTraining === 'function') {
                                renderSkillsInTraining();
                            }
                            if (typeof renderTreinoVideo === 'function') {
                                renderTreinoVideo();
                            }
                        }, 200);
                    }

                    if (targetTab === 'calendar' && gameSystem) {
                        setTimeout(() => {
                            if (typeof renderSysCalendar === 'function') {
                                renderSysCalendar();
                            }
                        }, 120);
                    }

                    if (targetTab === 'penality' && gameSystem) {
                        setTimeout(() => gameSystem.updatePenaltiesDisplay(), 90);
                    }
                    if (targetTab === 'shop' && typeof window.renderShopItems === 'function') {
                        setTimeout(() => {
                            const a = document.querySelector('.shop-tab-btn.active');
                            window.renderShopItems(a?.getAttribute('data-shop-tab') || 'recompensas');
                        }, 90);
                    }
                    if (targetTab === 'tasks' && typeof renderTasks === 'function') {
                        setTimeout(() => renderTasks(), 90);
                    }
                    if (targetTab === 'itensRecompensa' && typeof renderItensRecompensa === 'function') {
                        setTimeout(() => {
                            const r = document.querySelector('#itensRarityTabs .vd-rarity-tab.active');
                            renderItensRecompensa(r?.dataset?.rarity || 'Todos');
                        }, 90);
                    }
                    if (targetTab === 'matrizPrioridades' && typeof renderMatrizPrioridades === 'function') {
                        setTimeout(() => renderMatrizPrioridades(), 90);
                    }
                    if (targetTab === 'progresso' && typeof renderProgresso === 'function') {
                        setTimeout(() => renderProgresso(), 90);
                    }
                    if (targetTab === 'virtudes' && typeof renderVirtudes === 'function') {
                        setTimeout(() => renderVirtudes(), 90);
                    }
                    if (targetTab === 'arvoreEvolucao' && typeof initArvoreEvolucao === 'function') {
                        setTimeout(() => initArvoreEvolucao(), 90);
                    }
                    if (targetTab === 'arquitetoPersonagem' && typeof renderArquitetoPersonagem === 'function') {
                        setTimeout(() => renderArquitetoPersonagem(), 90);
                    }

                    if (targetTab === 'notification' && gameSystem) {
                        setTimeout(() => gameSystem.updateNotificationsDisplay(), 90);
                    }
                    if (targetTab === 'arena' && gameSystem) {
                        setTimeout(() => {
                            if (typeof renderArenaLeaderboard === 'function') renderArenaLeaderboard();
                            if (typeof updateArenaPainelCard === 'function') updateArenaPainelCard(gameSystem);
                        }, 90);
                    }
                }

                setTimeout(() => {
                    if (windowContent) windowContent.classList.remove('hidden');
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
    // === Overlay de Identidade (primeiro acesso) ===
    const idOverlay   = document.getElementById('idOverlay');
    const idNameInput = document.getElementById('idNameInput');
    const idStartBtn  = document.getElementById('idStartBtn');

    if (idOverlay && idNameInput && idStartBtn) {
        // Exibir overlay somente se o usuário ainda não configurou o nome
        if (gameSystem && !gameSystem.data.configurado) {
            idOverlay.classList.add('is-open');
            idOverlay.setAttribute('aria-hidden', 'false');
            setTimeout(() => idNameInput.focus(), 80);
        }

        function confirmarIdentidade() {
            const nome = idNameInput.value.trim();
            if (!nome) {
                // Feedback visual de campo vazio
                idNameInput.style.borderColor = 'rgba(255,100,100,0.7)';
                idNameInput.style.boxShadow   = '0 0 0 2px rgba(255,100,100,0.25)';
                setTimeout(() => {
                    idNameInput.style.borderColor = '';
                    idNameInput.style.boxShadow   = '';
                }, 1600);
                return;
            }

            const nomeFinal = nome.slice(0, 18).toUpperCase();

            // Persistir identidade
            try { localStorage.setItem('sl_identity_name', nomeFinal); } catch (e) { /* quota/private */ }

            if (gameSystem) {
                gameSystem.data.nome = nomeFinal;
                if (!gameSystem.data.apelido || !String(gameSystem.data.apelido).trim()) {
                    gameSystem.data.apelido = 'O Despertar';
                }
                gameSystem.data.configurado = true;
                gameSystem.saveData();
                gameSystem.updateAllDisplays();
                gameSystem.addNotification('BEM-VINDO!', `Bem-vindo ao sistema, ${nomeFinal}!`, 'info');
            }

            // Fechar overlay
            idOverlay.classList.remove('is-open');
            idOverlay.setAttribute('aria-hidden', 'true');
        }

        idStartBtn.addEventListener('click', confirmarIdentidade);

        // Confirmar também com Enter
        idNameInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') confirmarIdentidade();
        });
    }

    // === Modal de Seleção de Classe ===
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
        'forca':      'FORÇA',
        'sabedoria':  'SABEDORIA',
        'foco':       'FOCO',
        'vitalidade': 'VITALIDADE',
        'disciplina': 'DISCIPLINA',
        'carisma':    'CARISMA',
        'all':        'TODOS OS ATRIBUTOS'
    };
    return names[bonus] || bonus.toUpperCase();
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
    const modal = document.createElement('div');
    modal.className = 'settings-modal mission-modal-video task-modal-scroll';
    modal.id = 'trainingModal';
    const isEditing = existingTraining !== null;

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box mission-video-box mission-video-box--nova">
            <div class="settings-header mission-video-header">
                <div>
                    <h3 class="settings-title mission-video-headline">${isEditing ? 'EDITAR TREINO' : 'NOVO TREINO'}</h3>
                    <p class="mission-video-brand-row">
                        <span class="mission-video-brand-ico" aria-hidden="true">
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.35" style="width:14px;height:14px"><path d="M3 7.5h2.2a.8.8 0 0 1 .8.8V12a.8.8 0 0 1-.8.8H3M17 7.5h-2.2a.8.8 0 0 0-.8.8V12a.8.8 0 0 0 .8.8H17"/><line x1="5.2" y1="10" x2="14.8" y2="10"/></svg>
                        </span>
                        <span class="mission-video-brand-label">Sistema Level Up</span>
                    </p>
                    <p class="mission-video-sub">${isEditing ? 'Ajustar exercício' : 'Registrar novo exercício'}</p>
                </div>
                <button type="button" class="settings-close" id="trainingModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="trainingForm" class="item-form mission-form-video">

                    <div class="form-group mfv-field">
                        <label class="form-label mfv-label-muted" for="exerciseName">Nome do Exercício</label>
                        <input type="text" id="exerciseName" class="form-input mfv-input" required placeholder="Ex: Supino reto, Agachamento…">
                    </div>

                    <fieldset class="mfv-fieldset">
                        <legend class="mfv-fs-legend">Volume</legend>
                        <div class="mfv-grid-train-meta">
                            <div class="form-group mfv-field">
                                <label class="form-label mfv-label-muted" for="exerciseSeries">Séries</label>
                                <input type="number" id="exerciseSeries" class="form-input mfv-input" min="1" placeholder="3">
                            </div>
                            <div class="form-group mfv-field">
                                <label class="form-label mfv-label-muted" for="exerciseReps">Repetições</label>
                                <input type="number" id="exerciseReps" class="form-input mfv-input" min="1" placeholder="12">
                            </div>
                        </div>
                    </fieldset>

                    <fieldset class="mfv-fieldset">
                        <legend class="mfv-fs-legend">Intensidade</legend>
                        <div class="mfv-grid-train-meta">
                            <div class="form-group mfv-field">
                                <label class="form-label mfv-label-muted" for="exerciseWeight">Carga (kg) <span class="mfv-optional-flag">(opcional)</span></label>
                                <input type="number" id="exerciseWeight" class="form-input mfv-input" min="0" step="0.5" placeholder="0">
                            </div>
                            <div class="form-group mfv-field">
                                <label class="form-label mfv-label-muted" for="exerciseRest">Descanso (seg)</label>
                                <input type="number" id="exerciseRest" class="form-input mfv-input" min="0" placeholder="60">
                            </div>
                        </div>
                    </fieldset>

                    <div class="form-group mfv-field">
                        <label class="form-label mfv-label-muted">Preview do Movimento <span class="mfv-optional-flag">(imagem / GIF / vídeo)</span></label>
                        <label class="mfv-train-preview-drop" for="exercisePreview">
                            <span class="mfv-train-preview-ico" aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:28px;height:28px"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/><path d="M21 15l-5-5L5 21"/></svg>
                            </span>
                            <span class="mfv-train-preview-hint" id="trainingPreviewHint">Clique para selecionar ou arraste aqui</span>
                            <input type="file" id="exercisePreview" class="mfv-visually-hidden" accept="image/*,video/*">
                        </label>
                        <div id="exercisePreviewDisplay" class="mfv-train-preview-media" style="display:none"></div>
                    </div>

                    <div class="mfv-mission-foot mission-video-actions">
                        <button type="button" class="mfv-foot-btn mfv-foot-btn--ghost" id="trainingCancelBtn">Cancelar</button>
                        <button type="submit" class="mfv-foot-btn mfv-foot-btn--prime">${isEditing ? 'Salvar alterações' : 'Adicionar treino'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Fechar
    modal.querySelector('#trainingModalClose').addEventListener('click', () => modal.remove());
    modal.querySelector('#trainingCancelBtn').addEventListener('click', () => modal.remove());
    modal.querySelector('.settings-backdrop').addEventListener('click', () => modal.remove());

    // Preview de arquivo
    const fileInput = modal.querySelector('#exercisePreview');
    const previewDisplay = modal.querySelector('#exercisePreviewDisplay');
    const previewHint = modal.querySelector('#trainingPreviewHint');
    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewHint.textContent = file.name;
            previewDisplay.style.display = '';
            previewDisplay.innerHTML = file.type.startsWith('video/')
                ? `<video src="${e.target.result}" controls class="mfv-train-preview-vid"></video>`
                : `<img src="${e.target.result}" alt="Preview" class="mfv-train-preview-img">`;
        };
        reader.readAsDataURL(file);
    });

    // Preencher em modo edição
    if (existingTraining) {
        modal.querySelector('#exerciseName').value = existingTraining.nome || '';
        modal.querySelector('#exerciseSeries').value = existingTraining.series ?? '';
        modal.querySelector('#exerciseReps').value = existingTraining.repeticoes ?? '';
        modal.querySelector('#exerciseWeight').value = existingTraining.carga ?? '';
        modal.querySelector('#exerciseRest').value = existingTraining.descanso ?? '';
        if (existingTraining.preview) {
            previewDisplay.style.display = '';
            previewDisplay.innerHTML = existingTraining.preview.startsWith('data:video')
                ? `<video src="${existingTraining.preview}" controls class="mfv-train-preview-vid"></video>`
                : `<img src="${existingTraining.preview}" alt="Preview" class="mfv-train-preview-img">`;
        }
    }

    // Submit
    modal.querySelector('#trainingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        let previewData = existingTraining?.preview || null;
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => { previewData = ev.target.result; saveTraining(previewData, existingTraining); };
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
    
    const training = {
        id: isEditing ? existingTraining.id : Date.now(),
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
    
    gameSystem.addSkillXp('Treino', 0.5, 'combate');
    
    // Adicionar à semana se ainda não foi adicionado hoje (qualquer dia conta)
    const today = new Date();
    const todayKey = getDateKey(today);
    const alreadyAdded = gameSystem.data.treinosSemana.some(t => {
        return getDateKey(new Date(t.data)) === todayKey;
    });

    if (!alreadyAdded) {
        gameSystem.data.treinosSemana.push({
            data: today.toISOString(),
            treinoId: trainingId,
            tipo: 'Força'
        });

        // Verificar se completou 5 dias nos últimos 7 dias
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
        const treinosSemanaAtual = (gameSystem.data.treinosSemana || []).filter(t => {
            const tDate = new Date(t.data);
            return tDate >= sevenDaysAgo && tDate <= now;
        });

        if (treinosSemanaAtual.length >= 5) {
            // Verificar se já recebeu o bônus esta semana
            const ultimaSemana = gameSystem.data.ultimaSemanaDisciplina || null;
            const inicioSemana = new Date(now);
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay()); // Domingo da semana
            inicioSemana.setHours(0, 0, 0, 0);

            if (!ultimaSemana || new Date(ultimaSemana) < inicioSemana) {
                gameSystem.addDisciplina();
                gameSystem.data.ultimaSemanaDisciplina = inicioSemana.toISOString();
                gameSystem.addNotification('DISCIPLINA!', 'Você completou 5 dias de treino na semana!', 'info');
            }
        }
    }
    
    gameSystem.saveData();
    renderTrainings();
    if (typeof renderTreinoVideo === 'function') {
        setTimeout(() => renderTreinoVideo(), 60);
    }
    if (typeof renderProgressCharts === 'function') {
        setTimeout(() => renderProgressCharts(), 100);
    }
    if (typeof renderPerformanceChart === 'function') {
        setTimeout(() => renderPerformanceChart(), 150);
    }
    gameSystem.checkTitles();
    if (typeof gameSystem.verificarDesafiosArquiteto === 'function') gameSystem.verificarDesafiosArquiteto();
    if (typeof gameSystem.checkRunasCatalogo === 'function') gameSystem.checkRunasCatalogo();
    gameSystem.addNotification('TREINO CONCLUÍDO!', `Treino "${treino.nome}" finalizado!`, 'info');
}

/* ===========================================
   TREINO — layout idêntico a Missões (vídeo)
   =========================================== */
let _trainVideoFocus = 'all'; // all | pending | done
let _trainVideoCategory = 'ALL'; // ALL | tipo
let _trainVideoType = 'todas';
let _trainViewDate = new Date();
let _trainSearch = '';

function _trainTypeLabel(t) {
    const s = String(t || '').trim();
    return s || 'Treino';
}

function _trainMatchesFilters(treino) {
    const qs = (_trainSearch || '').trim().toLowerCase();
    if (qs) {
        const hay = String(treino.nome || '').toLowerCase();
        if (!hay.includes(qs)) return false;
    }
    const focus = _trainVideoFocus;
    const done = !!treino.concluido;
    if (focus === 'pending' && done) return false;
    if (focus === 'done' && !done) return false;
    return true;
}

function buildTrainingCardHtmlVideo(treino) {
    const id = Number(treino.id);
    const title = (treino.nome || treino.exerciseName || 'Treino').toString();
    const done = !!treino.concluido;

    const seriesTag = treino.series != null ? `<span class=”vid-tag vid-tag--meta”>${treino.series}x</span>` : '';
    const repsTag = treino.repeticoes != null ? `<span class=”vid-tag vid-tag--meta”>${treino.repeticoes} reps</span>` : '';
    const cargaTag = treino.carga > 0 ? `<span class=”vid-tag vid-tag--meta”>${treino.carga}kg</span>` : '';
    const descansoTag = treino.descanso > 0 ? `<span class=”vid-tag vid-tag--meta”>⏱${treino.descanso}s</span>` : '';
    const doneTag = done ? `<span class=”vid-tag vid-tag--done”>CONCLUÍDO</span>` : '';

    return `
        <div class=”vid-mission-card${done ? ' vid-train-done' : ''}” data-train-id=”${id}”>
            <div class=”vid-mission-toprow”>
                <div class=”vid-mission-title”>${_escapeHtml(title)}</div>
                <div class=”vid-mission-actions”>
                    <button type=”button” class=”vid-mission-iconbtn js-train-edit” title=”Editar” aria-label=”Editar”>
                        <svg viewBox=”0 0 16 16” fill=”none” stroke=”currentColor” stroke-width=”1.5” stroke-linecap=”round” stroke-linejoin=”round” style=”width:14px;height:14px”><path d=”M11 2l3 3-9 9H2v-3L11 2z”/></svg>
                    </button>
                    <button type=”button” class=”vid-mission-iconbtn vid-mission-iconbtn--danger js-train-del” title=”Excluir” aria-label=”Excluir”>
                        <svg viewBox=”0 0 16 16” fill=”none” stroke=”currentColor” stroke-width=”1.5” stroke-linecap=”round” stroke-linejoin=”round” style=”width:14px;height:14px”><path d=”M3 5h10M6 5V3h4v2M5 5l1 8h4l1-8”/></svg>
                    </button>
                </div>
            </div>
            <div class=”vid-mission-tags”>
                ${seriesTag}${repsTag}${cargaTag}${descansoTag}
                ${doneTag}
                <span class=”vid-rew”>+50 XP | +Força</span>
            </div>
            <div class=”vid-mission-footer”>
                <button type=”button” class=”vid-mission-complete js-train-complete” ${done ? 'disabled' : ''}>
                    <span style=”display:inline-flex;align-items:center;gap:0.45rem;justify-content:center;”>
                        <svg viewBox=”0 0 20 20” fill=”none” stroke=”currentColor” stroke-width=”2” stroke-linecap=”round” style=”width:14px;height:14px;opacity:0.85”>
                            <path d=”M4 10l3.2 3.2L16 4.8”/>
                        </svg>
                        Completar
                    </span>
                </button>
                <button type=”button” class=”vid-mission-mini js-train-edit” aria-label=”Editar”>✎</button>
            </div>
        </div>
    `;
}

function renderTreinoVideo() {
    if (!gameSystem) return;
    const listEl = document.getElementById('trainList');
    if (!listEl) return;

    const all = Array.isArray(gameSystem.data.treinos) ? gameSystem.data.treinos : [];
    const filtered = all.filter(_trainMatchesFilters).sort((a, b) => (a.nome || '').localeCompare(b.nome || '', 'pt-BR'));
    const pending = all.filter((t) => !t.concluido).length;
    const sub = document.getElementById('trainSub');
    if (sub) sub.textContent = `${pending} treinos pendentes`;

    const empty = document.getElementById('trainEmpty');
    const head = document.getElementById('trainSectionHead');
    const group = document.getElementById('trainGroupHead');
    const gCount = document.getElementById('trainGroupCount');
    const cnt = document.getElementById('trainSectionCount');
    if (head) head.style.display = filtered.length ? '' : 'none';
    if (group) group.style.display = filtered.length ? '' : 'none';
    if (gCount) gCount.textContent = `(${filtered.length})`;
    if (cnt) cnt.textContent = `(${filtered.length})`;
    if (empty) empty.style.display = filtered.length ? 'none' : '';

    listEl.innerHTML = filtered.length ? filtered.map(buildTrainingCardHtmlVideo).join('') : '';

    // Bind top controls once
    const sec = document.getElementById('trainneSection');
    if (sec && !sec.dataset.trainVideoInited) {
        sec.dataset.trainVideoInited = '1';

        const addBtn = document.getElementById('trainAddBtn');
        if (addBtn) addBtn.onclick = () => showTrainingModal();

        const focusHost = sec.querySelector('.vid-missions-focus-chips');
        if (focusHost) {
            focusHost.onclick = (ev) => {
                const b = ev.target.closest('[data-train-focus]');
                if (!b) return;
                _trainVideoFocus = b.getAttribute('data-train-focus') || 'all';
                focusHost.querySelectorAll('[data-train-focus]').forEach((x) => x.classList.toggle('is-active', x === b));
                renderTreinoVideo();
            };
        }

        const tsi = document.getElementById('trainSearchInput');
        if (tsi) {
            tsi.addEventListener('input', () => {
                _trainSearch = tsi.value || '';
                renderTreinoVideo();
            });
        }

        const prev = document.getElementById('trainPrevDay');
        const next = document.getElementById('trainNextDay');
        const hoje = document.getElementById('trainStripHoje');
        if (prev) prev.onclick = () => { _trainViewDate = new Date(_trainViewDate.getTime() - 86400000); renderTreinoVideo(); };
        if (next) next.onclick = () => { _trainViewDate = new Date(_trainViewDate.getTime() + 86400000); renderTreinoVideo(); };
        if (hoje) hoje.onclick = () => { _trainViewDate = new Date(); renderTreinoVideo(); };

        // Delegate card actions
        listEl.onclick = (ev) => {
            const card = ev.target.closest('.vid-mission-card[data-train-id]');
            if (!card) return;
            const id = Number(card.getAttribute('data-train-id'));
            const treino = (gameSystem.data.treinos || []).find((t) => Number(t.id) === id);
            if (!treino) return;

            if (ev.target.closest('.js-train-edit')) {
                editTraining(id);
                return;
            }
            if (ev.target.closest('.js-train-del')) {
                deleteTraining(id);
                renderTreinoVideo();
                return;
            }
            if (ev.target.closest('.js-train-complete')) {
                completeTraining(id);
                // toast estilo vídeo (aproveita showToast)
                if (typeof showToast === 'function') showToast('Treino completado! +50 XP', 'ok');
                renderTreinoVideo();
            }
        };
    }
}

window.renderTreinoVideo = renderTreinoVideo;

// ============================================
// TREINO FÍSICO — SISTEMA COMPLETO
// ============================================

function initTreinoFisico() {
    if (!gameSystem) return;
    // Submódulo "Treino Físico Estruturado" só inicializa se a UI estiver presente no HTML.
    // No layout atual do vídeo, esses contêineres não existem — sair silenciosamente evita TypeErrors.
    const subtabBtns = document.querySelectorAll('.training-subtab-btn');
    if (!subtabBtns.length && !document.getElementById('treinoFisicoPanel') && !document.getElementById('weekdaySelector')) {
        return;
    }

    subtabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.training-subtab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.training-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById('treinoFisicoPanel');
            const panelMental = document.getElementById('treinoMentalPanel');
            if (btn.dataset.subtab === 'fisico' && panel) panel.classList.add('active');
            else if (panelMental) panelMental.classList.add('active');
        });
    });

    document.getElementById('btnAddGrupo')?.addEventListener('click', () => showGrupoModal());

    renderWeekdaySelector();
    renderGruposTreino();
    renderRelatorioProgressao();
}

function renderWeekdaySelector() {
    const container = document.getElementById('weekdaySelector');
    if (!container || !gameSystem) return;
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const ativos = gameSystem.data.treinoFisico.diasAtivos;
    container.innerHTML = dias.map((d, i) => `
        <button class="weekday-btn${ativos.includes(i) ? ' ativo' : ''}" onclick="toggleDiaTreino(${i})">${d}</button>
    `).join('');
}

function toggleDiaTreino(dayIndex) {
    if (!gameSystem) return;
    const ativos = gameSystem.data.treinoFisico.diasAtivos;
    const idx = ativos.indexOf(dayIndex);
    if (idx >= 0) ativos.splice(idx, 1);
    else ativos.push(dayIndex);
    gameSystem.saveData();
    renderWeekdaySelector();
}

function renderGruposTreino() {
    const container = document.getElementById('gruposTreinoList');
    if (!container || !gameSystem) return;
    const grupos = gameSystem.data.treinoFisico.grupos;
    const diasNome = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    if (grupos.length === 0) {
        container.innerHTML = '<div class="section-text">Nenhum grupo criado ainda.</div>';
        return;
    }

    container.innerHTML = grupos.map(grupo => {
        const diasStr = (grupo.diasDaSemana || []).map(d => diasNome[d]).join(', ') || '—';
        const exerciciosHtml = (grupo.exercicios || []).map(ex => `
            <div class="exercicio-row">
                <div class="exercicio-info">
                    <span class="exercicio-nome">${ex.nome}</span>
                    <span class="exercicio-detalhes">${ex.series}×${ex.repeticoes} · ${ex.descanso}s descanso · ${ex.cargaAtual}kg</span>
                </div>
                <div class="exercicio-actions">
                    <button class="task-small-btn" onclick="showCargaSlider('${grupo.id}','${ex.id}')" title="Level Up Carga">⬆</button>
                    <button class="task-small-btn" onclick="showExercicioModal('${grupo.id}','${ex.id}')" title="Editar">✎</button>
                    <button class="task-small-btn" onclick="deleteExercicio('${grupo.id}','${ex.id}')" title="Remover">×</button>
                </div>
            </div>
        `).join('');

        return `
            <div class="grupo-card">
                <div class="grupo-header">
                    <div>
                        <div class="grupo-nome">${grupo.nome}</div>
                        <div class="grupo-dias">${diasStr}</div>
                    </div>
                    <div class="grupo-actions">
                        <button class="form-btn submit-btn task-small-btn" onclick="iniciarSessao('${grupo.id}')">▶ INICIAR</button>
                        <button class="task-small-btn" onclick="showExercicioModal('${grupo.id}')" title="Adicionar exercício">+</button>
                        <button class="task-small-btn" onclick="showGrupoModal('${grupo.id}')" title="Editar grupo">✎</button>
                        <button class="task-small-btn" onclick="deleteGrupo('${grupo.id}')" title="Excluir grupo">×</button>
                    </div>
                </div>
                <div class="exercicios-list">
                    ${exerciciosHtml || '<div class="section-text" style="font-size:11px">Nenhum exercício. Clique em + para adicionar.</div>'}
                </div>
            </div>
        `;
    }).join('');
}

function showGrupoModal(grupoId = null) {
    const grupo = grupoId ? gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(grupoId)) : null;
    const isEditing = !!grupo;
    const diasNome = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width:500px">
            <div class="settings-header">
                <h3 class="settings-title">${isEditing ? 'EDITAR GRUPO' : 'NOVO GRUPO DE TREINO'}</h3>
                <button class="settings-close" id="grupoModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="grupoForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Nome do Grupo:</label>
                        <input type="text" id="grupoNome" class="form-input" placeholder="Ex: Peito/Tríceps, Costas/Bíceps" required value="${grupo?.nome || ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Dias da Semana:</label>
                        <div class="weekday-selector" style="margin-top:6px">
                            ${diasNome.map((d, i) => {
                                const checked = grupo?.diasDaSemana?.includes(i) ? 'checked' : '';
                                return `<label class="weekday-checkbox-label">
                                    <input type="checkbox" name="diasGrupo" value="${i}" ${checked}>
                                    <span class="weekday-checkbox-btn">${d}</span>
                                </label>`;
                            }).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Tipo de Treino:</label>
                        <select id="grupoTipo" class="form-input" style="cursor:pointer">
                            <option value="Força"     ${(!grupo?.tipo || grupo?.tipo === 'Força')     ? 'selected' : ''}>Força</option>
                            <option value="Cardio"    ${grupo?.tipo === 'Cardio'    ? 'selected' : ''}>Cardio</option>
                            <option value="Mobilidade"${grupo?.tipo === 'Mobilidade'? 'selected' : ''}>Mobilidade</option>
                            <option value="Geral"     ${grupo?.tipo === 'Geral'     ? 'selected' : ''}>Geral</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="grupoCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">${isEditing ? 'SALVAR' : 'CRIAR'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    modal.querySelector('#grupoModalClose').addEventListener('click', close);
    modal.querySelector('#grupoCancelBtn').addEventListener('click', close);

    modal.querySelector('#grupoForm').addEventListener('submit', e => {
        e.preventDefault();
        const nome = modal.querySelector('#grupoNome').value.trim().toUpperCase();
        if (!nome) return;
        const diasDaSemana = [...modal.querySelectorAll('input[name="diasGrupo"]:checked')].map(c => parseInt(c.value));
        const tipo = modal.querySelector('#grupoTipo').value;
        saveGrupo({ nome, diasDaSemana, tipo }, grupoId);
        close();
    });
}

function saveGrupo(formData, grupoId = null) {
    if (!gameSystem) return;
    const grupos = gameSystem.data.treinoFisico.grupos;
    if (grupoId) {
        const g = grupos.find(g => String(g.id) === String(grupoId));
        if (g) { g.nome = formData.nome; g.diasDaSemana = formData.diasDaSemana; g.tipo = formData.tipo || 'Força'; }
    } else {
        grupos.push({ id: Date.now(), nome: formData.nome, diasDaSemana: formData.diasDaSemana, tipo: formData.tipo || 'Força', exercicios: [] });
    }
    gameSystem.saveData();
    renderGruposTreino();
}

function deleteGrupo(grupoId) {
    if (!gameSystem || !confirm('Excluir este grupo e todos os seus exercícios?')) return;
    gameSystem.data.treinoFisico.grupos = gameSystem.data.treinoFisico.grupos.filter(g => String(g.id) !== String(grupoId));
    gameSystem.saveData();
    renderGruposTreino();
    renderRelatorioProgressao();
}

function showExercicioModal(grupoId, exercicioId = null) {
    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(grupoId));
    if (!grupo) return;
    const ex = exercicioId ? grupo.exercicios.find(e => String(e.id) === String(exercicioId)) : null;
    const isEditing = !!ex;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width:500px">
            <div class="settings-header">
                <h3 class="settings-title">${isEditing ? 'EDITAR EXERCÍCIO' : 'NOVO EXERCÍCIO'}</h3>
                <button class="settings-close" id="exModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="exForm" class="item-form">
                    <div class="form-group">
                        <label class="form-label">Nome do Exercício:</label>
                        <input type="text" id="exNome" class="form-input" placeholder="Ex: Supino Reto, Agachamento" required value="${ex?.nome || ''}">
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                        <div class="form-group">
                            <label class="form-label">Séries:</label>
                            <input type="number" id="exSeries" class="form-input" min="1" max="20" value="${ex?.series || 3}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Repetições:</label>
                            <input type="number" id="exReps" class="form-input" min="1" max="100" value="${ex?.repeticoes || 10}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descanso (seg):</label>
                            <input type="number" id="exDescanso" class="form-input" min="5" max="600" value="${ex?.descanso || 60}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Carga (kg):</label>
                            <input type="number" id="exCarga" class="form-input" min="0" max="500" step="0.25" value="${ex?.cargaAtual || 0}" required>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="form-btn cancel-btn" id="exCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn">${isEditing ? 'SALVAR' : 'ADICIONAR'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    modal.querySelector('#exModalClose').addEventListener('click', close);
    modal.querySelector('#exCancelBtn').addEventListener('click', close);

    modal.querySelector('#exForm').addEventListener('submit', e => {
        e.preventDefault();
        const data = {
            nome: modal.querySelector('#exNome').value.trim().toUpperCase(),
            series: parseInt(modal.querySelector('#exSeries').value),
            repeticoes: parseInt(modal.querySelector('#exReps').value),
            descanso: parseInt(modal.querySelector('#exDescanso').value),
            cargaAtual: parseFloat(modal.querySelector('#exCarga').value) || 0
        };
        saveExercicio(grupoId, data, exercicioId);
        close();
    });
}

function saveExercicio(grupoId, formData, exercicioId = null) {
    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(grupoId));
    if (!grupo) return;
    if (exercicioId) {
        const ex = grupo.exercicios.find(e => String(e.id) === String(exercicioId));
        if (ex) Object.assign(ex, formData);
    } else {
        grupo.exercicios.push({
            id: Date.now(),
            ...formData,
            historicoCargas: [{ data: new Date().toISOString(), carga: formData.cargaAtual, series: formData.series, repeticoes: formData.repeticoes }]
        });
    }
    gameSystem.saveData();
    renderGruposTreino();
    renderRelatorioProgressao();
}

function deleteExercicio(grupoId, exercicioId) {
    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(grupoId));
    if (!grupo || !confirm('Excluir este exercício?')) return;
    grupo.exercicios = grupo.exercicios.filter(e => String(e.id) !== String(exercicioId));
    gameSystem.saveData();
    renderGruposTreino();
    renderRelatorioProgressao();
}

// ---- Slider de Carga (Load Level Up) ----

function showCargaSlider(grupoId, exercicioId) {
    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(grupoId));
    if (!grupo) return;
    const ex = grupo.exercicios.find(e => String(e.id) === String(exercicioId));
    if (!ex) return;

    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box" style="max-width:420px">
            <div class="settings-header">
                <h3 class="settings-title">LOAD LEVEL UP — ${ex.nome}</h3>
                <button class="settings-close" id="sliderModalClose">×</button>
            </div>
            <div class="settings-content">
                <div style="text-align:center;margin-bottom:12px;color:rgba(255,255,255,0.6);font-size:12px">
                    Carga atual: <strong style="color:#bf40ff">${ex.cargaAtual} kg</strong>
                </div>
                <div class="carga-slider-wrapper">
                    <input type="range" id="cargaRange" min="0" max="200" step="0.25" value="${ex.cargaAtual}">
                    <span class="carga-valor-display" id="cargaValorDisplay">${ex.cargaAtual} kg</span>
                </div>
                <div style="display:flex;gap:8px;margin-top:16px">
                    <button class="form-btn cancel-btn" id="sliderCancelBtn" style="flex:1">CANCELAR</button>
                    <button class="form-btn submit-btn" id="sliderConfirmBtn" style="flex:1">CONFIRMAR</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.settings-backdrop').addEventListener('click', close);
    modal.querySelector('#sliderModalClose').addEventListener('click', close);
    modal.querySelector('#sliderCancelBtn').addEventListener('click', close);

    const range = modal.querySelector('#cargaRange');
    const display = modal.querySelector('#cargaValorDisplay');
    range.addEventListener('input', () => { display.textContent = parseFloat(range.value).toFixed(2) + ' kg'; });

    modal.querySelector('#sliderConfirmBtn').addEventListener('click', () => {
        saveCargaLevelUp(grupoId, exercicioId, parseFloat(range.value));
        close();
    });
}

function saveCargaLevelUp(grupoId, exercicioId, novaCarga) {
    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(grupoId));
    if (!grupo) return;
    const ex = grupo.exercicios.find(e => String(e.id) === String(exercicioId));
    if (!ex) return;
    const anterior = ex.cargaAtual;
    ex.cargaAtual = novaCarga;
    ex.historicoCargas.push({ data: new Date().toISOString(), carga: novaCarga, series: ex.series, repeticoes: ex.repeticoes });
    gameSystem.saveData();
    gameSystem.addNotification('LOAD LEVEL UP!', `${ex.nome}: ${anterior}kg → ${novaCarga}kg`, 'levelup');
    renderGruposTreino();
    renderRelatorioProgressao();
}

// ---- Timer de Sessão ----

let _sessaoStart = null;

function iniciarSessao(grupoId) {
    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(grupoId));
    if (!grupo || grupo.exercicios.length === 0) {
        alert('Adicione ao menos um exercício ao grupo antes de iniciar.');
        return;
    }
    gameSystem.data.treinoFisico.sessaoAtiva = {
        grupoId: String(grupoId),
        exercicioIndex: 0,
        serieAtual: 1,
        timerRodando: false,
        timerSegundos: grupo.exercicios[0].descanso
    };
    _sessaoStart = Date.now();
    const sessaoPanel = document.getElementById('sessaoAtivaPanel');
    if (!sessaoPanel) return;
    sessaoPanel.style.display = 'block';
    renderSessaoAtiva();

    const btnProx = document.getElementById('btnProximaSerie');
    const btnPausa = document.getElementById('btnPausarTimer');
    const btnCanc = document.getElementById('btnCancelarSessao');
    if (btnProx) btnProx.onclick = () => proximaSerie();
    if (btnPausa) btnPausa.onclick = () => pausarTimer();
    if (btnCanc) btnCanc.onclick = () => {
        if (confirm('Cancelar sessão em andamento?')) encerrarSessao(true);
    };
}

function renderSessaoAtiva() {
    const sa = gameSystem.data.treinoFisico.sessaoAtiva;
    if (!sa) return;
    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(sa.grupoId));
    if (!grupo) return;
    const ex = grupo.exercicios[sa.exercicioIndex];
    if (!ex) return;

    document.querySelector('.sessao-exercicio-nome').textContent = ex.nome;
    document.querySelector('.sessao-serie-progress').textContent = `Série ${sa.serieAtual} de ${ex.series}`;
    document.getElementById('sessaoStatusMsg').textContent = '';

    const timerSeg = ex.descanso;
    document.getElementById('timerDisplay').textContent = formatTimer(timerSeg);
    sa.timerSegundos = timerSeg;
    sa.timerRodando = false;
    clearInterval(window._timerInterval);
    document.getElementById('btnProximaSerie').textContent = 'PRÓXIMA SÉRIE ▶';
    document.getElementById('btnProximaSerie').disabled = false;
    document.getElementById('btnPausarTimer').textContent = '⏸ PAUSAR';
}

function iniciarTimer(segundos) {
    clearInterval(window._timerInterval);
    const sa = gameSystem.data.treinoFisico.sessaoAtiva;
    if (!sa) return;
    sa.timerSegundos = segundos;
    sa.timerRodando = true;
    document.getElementById('btnProximaSerie').disabled = true;
    document.getElementById('btnProximaSerie').textContent = 'AGUARDANDO...';
    document.getElementById('sessaoStatusMsg').textContent = 'Descansando...';

    window._timerInterval = setInterval(() => {
        sa.timerSegundos--;
        document.getElementById('timerDisplay').textContent = formatTimer(sa.timerSegundos);
        if (sa.timerSegundos <= 0) {
            clearInterval(window._timerInterval);
            sa.timerRodando = false;
            beepSom();
            document.getElementById('sessaoStatusMsg').textContent = '✓ Descanso concluído!';
            document.getElementById('btnProximaSerie').disabled = false;
            document.getElementById('btnProximaSerie').textContent = 'PRÓXIMA SÉRIE ▶';
        }
    }, 1000);
}

function pausarTimer() {
    const sa = gameSystem.data.treinoFisico.sessaoAtiva;
    if (!sa) return;
    if (sa.timerRodando) {
        clearInterval(window._timerInterval);
        sa.timerRodando = false;
        document.getElementById('btnPausarTimer').textContent = '▶ RETOMAR';
    } else {
        iniciarTimer(sa.timerSegundos);
        document.getElementById('btnPausarTimer').textContent = '⏸ PAUSAR';
    }
}

function proximaSerie() {
    const sa = gameSystem.data.treinoFisico.sessaoAtiva;
    if (!sa) return;
    clearInterval(window._timerInterval);

    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(sa.grupoId));
    const ex = grupo.exercicios[sa.exercicioIndex];

    if (sa.serieAtual < ex.series) {
        sa.serieAtual++;
        document.querySelector('.sessao-serie-progress').textContent = `Série ${sa.serieAtual} de ${ex.series}`;
        iniciarTimer(ex.descanso);
    } else {
        proximoExercicio();
    }
}

function proximoExercicio() {
    const sa = gameSystem.data.treinoFisico.sessaoAtiva;
    if (!sa) return;
    clearInterval(window._timerInterval);

    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(sa.grupoId));
    sa.exercicioIndex++;

    if (sa.exercicioIndex < grupo.exercicios.length) {
        sa.serieAtual = 1;
        const ex = grupo.exercicios[sa.exercicioIndex];
        sa.timerSegundos = ex.descanso;
        document.querySelector('.sessao-exercicio-nome').textContent = ex.nome;
        document.querySelector('.sessao-serie-progress').textContent = `Série 1 de ${ex.series}`;
        document.getElementById('timerDisplay').textContent = formatTimer(ex.descanso);
        document.getElementById('sessaoStatusMsg').textContent = `Próximo: ${ex.nome}`;
        document.getElementById('btnProximaSerie').textContent = 'PRÓXIMA SÉRIE ▶';
        document.getElementById('btnProximaSerie').disabled = false;
    } else {
        encerrarSessao(false);
    }
}

function encerrarSessao(cancelado = false) {
    clearInterval(window._timerInterval);
    const sa = gameSystem.data.treinoFisico.sessaoAtiva;
    if (!sa) return;

    const grupo = gameSystem.data.treinoFisico.grupos.find(g => String(g.id) === String(sa.grupoId));
    const duracaoMin = _sessaoStart ? Math.round((Date.now() - _sessaoStart) / 60000) : 0;

    if (!cancelado && grupo) {
        const exerciciosConcluidos = sa.exercicioIndex + 1;
        gameSystem.data.treinoFisico.historicoSessoes.push({
            data: new Date().toISOString(),
            grupoId: sa.grupoId,
            exerciciosConcluidos,
            duracaoMinutos: duracaoMin
        });
        gameSystem.data.treinosSemana.push({ data: new Date().toISOString(), treinoId: sa.grupoId, tipo: grupo?.tipo || 'Força' });
        gameSystem.addForca();
        gameSystem.addVitalidade();
        gameSystem.addExp(80);
        gameSystem.addMoedas(50);
        gameSystem.addNotification('SESSÃO CONCLUÍDA!', `${exerciciosConcluidos} exercício(s) · ${duracaoMin} min`, 'levelup');
        gameSystem.checkTitles();
    }

    gameSystem.data.treinoFisico.sessaoAtiva = null;
    gameSystem.saveData();
    if (!cancelado && typeof gameSystem.updateProgressInfo === 'function') {
        gameSystem.updateProgressInfo();
    }
    document.getElementById('sessaoAtivaPanel').style.display = 'none';
    renderGruposTreino();
    renderRelatorioProgressao();
}

function formatTimer(segundos) {
    const m = Math.floor(Math.max(segundos, 0) / 60).toString().padStart(2, '0');
    const s = (Math.max(segundos, 0) % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function beepSom() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
}

// ---- Relatório de Progressão ----

function renderRelatorioProgressao() {
    const container = document.getElementById('relatorioProgressao');
    if (!container || !gameSystem) return;
    const grupos = gameSystem.data.treinoFisico.grupos;
    const semanaAtras = Date.now() - 7 * 86400000;
    const rows = [];

    grupos.forEach(grupo => {
        (grupo.exercicios || []).forEach(ex => {
            const hist = (ex.historicoCargas || []).filter(h => new Date(h.data).getTime() >= semanaAtras);
            if (hist.length >= 2) {
                const ini = hist[0].carga;
                const atual = hist[hist.length - 1].carga;
                const delta = atual - ini;
                rows.push({ nome: ex.nome, ini, atual, delta });
            }
        });
    });

    if (rows.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="section-header" style="margin:16px 0 8px">
            <span class="section-header-text">PROGRESSÃO DA SEMANA</span>
        </div>
        <table class="progressao-table">
            <thead><tr><th>Exercício</th><th>Ini</th><th>Atual</th><th>Δ</th></tr></thead>
            <tbody>
                ${rows.map(r => `
                    <tr>
                        <td>${r.nome}</td>
                        <td>${r.ini}kg</td>
                        <td>${r.atual}kg</td>
                        <td class="${r.delta >= 0 ? 'delta-positivo' : 'delta-negativo'}">${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(2)}kg</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
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
                            <option value="geral">Geral (SABEDORIA)</option>
                            <option value="psicologia">Psicologia (CARISMA)</option>
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
                
                // Remover atributos do estudo antigo (mesmo sítio e escala que addCarisma / addSabedoria)
                if (existingStudy.tipo === 'psicologia') {
                    gameSystem.data.atributos.carisma = Math.max(
                        0,
                        (gameSystem.data.atributos.carisma || 0) - horasAntigas * 0.30
                    );
                } else {
                    gameSystem.data.atributos.sabedoria = Math.max(
                        0,
                        (gameSystem.data.atributos.sabedoria || 0) - horasAntigas * 0.15
                    );
                }
                
                // Adicionar atributos do estudo novo
                if (tipo === 'psicologia') {
                    gameSystem.addCarisma(horasNovas);
                } else {
                    gameSystem.addSabedoria(horasNovas);
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
                gameSystem.addCarisma(horas);
            } else {
                gameSystem.addSabedoria(horas);
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

    applyMissionsVideoTabDefaults();

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

    document.querySelectorAll('.vid-missions [data-missions-scope]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const v = btn.getAttribute('data-missions-scope');
            if (v) _missionsScope = v;
            renderTasks();
        });
    });
    document.querySelectorAll('.vid-missions [data-missions-completion]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const v = btn.getAttribute('data-missions-completion');
            if (v) _missionsCompletion = v;
            renderTasks();
        });
    });

    const ms = document.getElementById('missionsSearchInput');
    if (ms) {
        ms.addEventListener('input', () => {
            _missionsVideoSearch = ms.value || '';
            renderTasks();
        });
    }

    const mp = document.getElementById('missionsPrevDay');
    const mn = document.getElementById('missionsNextDay');
    if (mp && !mp.dataset.mweekBound) {
        mp.dataset.mweekBound = '1';
        mn.dataset.mweekBound = '1';
        mp.addEventListener('click', () => {
            const cur = getMissionsViewDate();
            _missionsViewDate = addDaysToDate(cur, -1);
            missionsViewNormalizeToNullIfRealtimeToday();
            renderTasks();
        });
        mn.addEventListener('click', () => {
            const cur = getMissionsViewDate();
            _missionsViewDate = addDaysToDate(cur, 1);
            missionsViewNormalizeToNullIfRealtimeToday();
            renderTasks();
        });
    }

    const mJumpToday = document.getElementById('missionsStripHoje');
    if (mJumpToday && !mJumpToday.dataset.missionsJumpTodayBound) {
        mJumpToday.dataset.missionsJumpTodayBound = '1';
        mJumpToday.addEventListener('click', () => {
            _missionsViewDate = null;
            renderTasks();
        });
    }

    renderTasks();
}

// Estado de filtro do layout do vídeo (frames 75–95s — chips Em andamento / A fazer / …)
/** Âmbito: «Foco do Dia» só missões relevantes para hoje (ou únicas); «Todas» inclui arquivadas. */
let _missionsScope = 'foco_dia'; // foco_dia | all
/** Estado: pendente vs concluída (combinável com âmbito). */
let _missionsCompletion = 'pendentes'; // pendentes | concluidas
let _missionsVideoCategory = 'ALL';
/** Busca rápida (título/descrição) — como “Pesquisar…” no vídeo */
let _missionsVideoSearch = '';
/** Dia civil em vista no layout vídeo (‹ ›). `null` = «hoje» (actual). */
let _missionsViewDate = null;

/** Padrão da aba Missões (chips): Foco do Dia + Pendentes + Todos (sem filtro de categoria). */
function applyMissionsVideoTabDefaults() {
    _missionsScope = 'foco_dia';
    _missionsCompletion = 'pendentes';
    _missionsVideoCategory = 'ALL';
}

function getMissionsViewDate() {
    if (_missionsViewDate) return _missionsViewDate;
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

/** Se o dia vista coincidir com o dia civil actual, volta a `null` (estado inicial). */
function missionsViewNormalizeToNullIfRealtimeToday() {
    if (!_missionsViewDate || !gameSystem) return;
    const tv = _missionsViewDate;
    const now = new Date();
    const dayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayView = new Date(tv.getFullYear(), tv.getMonth(), tv.getDate());
    if (dayView.getTime() === dayNow.getTime()) _missionsViewDate = null;
}

/** Rótulo ao centro (‹ Dia ›): Hoje, Ontem, Amanhã, Anteontem ou `DD/mon` em minúsculas. */
function formatMissionsViewPeriodLabel(viewDate) {
    const now = new Date();
    const dayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const vn = new Date(viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate());
    const diffDays = Math.round((vn.getTime() - dayNow.getTime()) / 86400000);
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays === -2) return 'Anteontem';
    const dd = String(vn.getDate()).padStart(2, '0');
    const mon = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${dd}/${mon[vn.getMonth()]}`;
}

/** Missão activa pendente relativamente ao dia `viewDate` (recorrente por chave; única = ainda não concluída). */
function isMissionPendingForViewDay(m, viewDate, viewKey) {
    if (m.ativo === false) return false;
    const isUnique = !!m.unique;
    const doneUnique = isUnique && m.completions && m.completions.length > 0;
    const doneDay = keyMatchesCompletions(viewKey, m.completions || []);
    const appears = shouldTaskAppearToday(m, viewDate);
    if (isUnique) return appears && !doneUnique;
    return appears && !doneDay;
}

function _escapeHtml(s) {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function _getMissionCategoryLabel(m) {
    if (m && m.unique && m.category) return String(m.category).trim();
    return 'Livre';
}

function _missionCategoryFilterMatches(catLabel) {
    if (_missionsVideoCategory === 'ALL') return true;
    return (
        String(catLabel || '').trim().toLocaleLowerCase('pt-BR') ===
        String(_missionsVideoCategory || '').trim().toLocaleLowerCase('pt-BR')
    );
}

function _missionMatchesVideoFilters(m, viewDate) {
    const viewKey =
        gameSystem && typeof getCalendarKeyForDate === 'function'
            ? getCalendarKeyForDate(viewDate)
            : getDateKey(viewDate);

    const q = (_missionsVideoSearch || '').trim().toLowerCase();
    if (q) {
        const hay = `${m.titulo || ''} ${m.descricao || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
    }

    const comps = m.completions || [];
    const completedView = keyMatchesCompletions(viewKey, comps);
    const isUnique = !!m.unique;
    const doneUnique = isUnique && comps.length > 0;
    const doneForUi = isUnique ? doneUnique : completedView;
    const appears = shouldTaskAppearToday(m, viewDate);

    /* Arquivadas: só com âmbito «Todas» + «Pendentes» (não entram em Concluídas) */
    if (m.ativo === false) {
        if (_missionsScope !== 'all') return false;
        if (_missionsCompletion === 'concluidas') return false;
        const catA = _getMissionCategoryLabel(m);
        if (!_missionCategoryFilterMatches(catA)) return false;
        return true;
    }

    if (_missionsCompletion === 'pendentes') {
        if (doneForUi) return false;
    } else if (_missionsCompletion === 'concluidas') {
        if (!doneForUi) return false;
    }

    if (_missionsScope === 'foco_dia') {
        if (!appears && !isUnique) return false;
    }

    const cat = _getMissionCategoryLabel(m);
    if (!_missionCategoryFilterMatches(cat)) return false;

    return true;
}

/** Faixa semanal tipo timeline — Missões/Treino (ref. vídeo) */
function renderVideoDayStripFromMonday(hostId, weekMonday) {
    const host = document.getElementById(hostId);
    if (!host || typeof getCalendarKeyForDate !== 'function') return;
    const monday = weekMonday instanceof Date ? weekMonday : getMondayOfWeek(new Date());
    const todayK = getCalendarKeyForDate(new Date());
    const short = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
    const parts = [];
    for (let i = 0; i < 7; i++) {
        const d = addDaysToDate(monday, i);
        const k = getCalendarKeyForDate(d);
        const isToday = k === todayK;
        parts.push(
            `<span class="vid-daystrip-cell${isToday ? ' is-hoje' : ''}" title="${short[i]} · ${formatShortDayMonth(d)}">` +
                `<span class="vid-daystrip-dow">${short[i]}</span>` +
                `<span class="vid-daystrip-num">${d.getDate()}</span>` +
            `</span>`
        );
    }
    host.innerHTML = parts.join('');
}

function buildMissionCardHtmlVideo(m, viewKey, viewDate) {
    const isArchived = m.ativo === false;
    const completedView = keyMatchesCompletions(viewKey, m.completions || []);
    const isUnique = !!m.unique;
    const doneUnique = isUnique && m.completions && m.completions.length > 0;
    const doneForUi = isUnique ? doneUnique : completedView;
    const appears = shouldTaskAppearToday(m, viewDate);
    const canComplete = !isArchived && !doneForUi && (appears || isUnique);

    const r = m.rewards || {};
    const rewardXp = r.exp > 0 ? `+${r.exp} XP` : '';
    const rewardCoins = r.moedas > 0 ? `+${r.moedas} Coin` : '';
    const rewardLine = [rewardXp, rewardCoins].filter(Boolean).join(' | ');

    const rec = getRecurrenceLabel(m.recurrence);
    const attr = r.atributo ? String(r.atributo).toUpperCase() : '';

    const desc = m.descricao ? `<p class="vid-mission-desc">${_escapeHtml(m.descricao)}</p>` : '';
    const viewMore = m.descricao ? `<button type="button" class="vid-mission-more js-mission-more">Ver mais</button>` : '';

    // Priority badge
    const isPriorityAlta = m.priority === 'alta' || m.priority === 'ALTA';
    const isPriorityBaixa = m.priority === 'baixa' || m.priority === 'BAIXA';
    const priorityDot = isPriorityAlta
        ? `<span class="vid-priority-dot vid-priority-dot--alta" title="Prioridade Alta"></span>`
        : isPriorityBaixa
        ? `<span class="vid-priority-dot vid-priority-dot--baixa" title="Prioridade Baixa"></span>`
        : '';

    // Category tag
    const categoryTag = m.category ? `<span class="vid-tag vid-tag--cat">${_escapeHtml(m.category)}</span>` : '';

    // Progress bar (for missions with progress tracking)
    let progressBar = '';
    if (m.progress && m.progress.enabled && m.progress.max > 0) {
        const viewKeyForProg = viewKey || (typeof getCalendarKeyForDate === 'function' ? getCalendarKeyForDate(viewDate || new Date()) : '');
        const currentValue = (m.progress.byDate || {})[viewKeyForProg] || 0;
        const max = m.progress.max;
        const pct = Math.min(100, Math.round((currentValue / max) * 100));
        progressBar = `<div class="vid-mission-prog"><div class="vid-mission-prog-trail"><span class="vid-mission-prog-fill" style="width:${pct}%"></span></div><span class="vid-mission-prog-label">${currentValue} / ${max}</span></div>`;
    }

    // Checklist count
    let checklistCount = '';
    if (Array.isArray(m.checklist) && m.checklist.length > 0) {
        checklistCount = `<span class="vid-tag vid-tag--checklist">☑ ${m.checklist.length}</span>`;
    }

    const archivalTag = isArchived
        ? `<span class="vid-tag vid-tag--archived">ARQUIVADA</span>`
        : '';

    const topBtns = isArchived
        ? `
                <div class="vid-mission-actions">
                    <button type="button" class="vid-mission-iconbtn js-mission-edit" title="Ver / editar" aria-label="Ver ou editar">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M11 2l3 3-9 9H2v-3L11 2z"/></svg>
                    </button>
                    <button type="button" class="vid-mission-iconbtn js-mission-restore" title="Restaurar ao sistema" aria-label="Restaurar">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M2.5 8a7 7 0 1 1 2 4.85"/><path d="M2 3v5h5"/></svg>
                    </button>
                    <button type="button" class="vid-mission-iconbtn vid-mission-iconbtn--danger js-mission-purge" title="Apagar definitivamente" aria-label="Apagar definitivamente">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M3 5h10M6 5V3h4v2M5 5l1 8h4l1-8"/></svg>
                    </button>
                </div>`
        : `
                <div class="vid-mission-actions">
                    <button type="button" class="vid-mission-iconbtn js-mission-edit" title="Editar" aria-label="Editar">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M11 2l3 3-9 9H2v-3L11 2z"/></svg>
                    </button>
                    <button type="button" class="vid-mission-iconbtn js-mission-archive" title="Arquivar" aria-label="Arquivar missão">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M3 6h10v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/><path d="M2 6V4h12v2"/><path d="M6 3V2h4v1"/><path d="M6 9h4"/></svg>
                    </button>
                </div>`;

    return `
        <div class="vid-mission-card${isArchived ? ' vid-mission-card--archived' : ''}${isPriorityAlta ? ' vid-mission-card--alta' : ''}" data-id="${m.id}" data-archived="${isArchived ? '1' : '0'}">
            <div class="vid-mission-toprow">
                <div class="vid-mission-title">${priorityDot}${_escapeHtml(m.titulo || '')}</div>
                ${topBtns}
            </div>
            ${desc}
            ${viewMore}
            ${progressBar}
            <div class="vid-mission-tags">
                ${archivalTag}
                <span class="vid-tag vid-tag--daily">${_escapeHtml(rec || 'Diário')}</span>
                ${categoryTag}
                ${checklistCount}
                ${attr ? `<span class="vid-tag vid-tag--attr">${_escapeHtml(attr)}</span>` : ''}
                ${rewardLine ? `<span class="vid-rew">${_escapeHtml(rewardLine)}</span>` : ''}
            </div>
            <div class="vid-mission-footer">
                <button type="button" class="vid-mission-complete js-mission-complete" ${canComplete ? '' : 'disabled'}>
                    <span style="display:inline-flex;align-items:center;gap:0.45rem;justify-content:center;">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:14px;height:14px;opacity:0.85">
                            <path d="M4 10l3.2 3.2L16 4.8"/>
                        </svg>
                        Completar
                    </span>
                </button>
                <button type="button" class="vid-mission-mini js-mission-mini" aria-label="Mais ações">›</button>
            </div>
        </div>
    `;
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

    // Ocultar o botão de criação manual — habilidades vêm apenas da IA
    const addSkillBtn = document.getElementById('addSkillBtn');
    if (addSkillBtn) addSkillBtn.style.display = 'none';

    let html = '';

    // --- Habilidades propostas pela IA aguardando resposta ---
    const propostas = (gameSystem.data.habilidadesPropostas || []).filter(p => p.status === 'pendente');
    propostas.forEach((proposta, idx) => {
        html += `
        <div class="pgi-block" style="margin-bottom:8px;">
            <div class="pgi-label" style="color:rgba(251,191,36,0.8);">PROPOSTA DO ARQUITETO</div>
            <div class="pgi-card" style="border-color:rgba(251,191,36,0.3);background:linear-gradient(145deg,rgba(251,191,36,0.05) 0%,rgba(6,8,14,0.95) 100%);">
                <div class="pgi-card-main" style="color:rgba(251,191,36,0.9);">${proposta.nome}</div>
                <div class="pgi-card-sub">${proposta.descricao || ''}</div>
                <div class="pgi-card-sub">Tipo: ${proposta.tipo === 'combate' ? 'COMBATE' : 'ESTUDO'} · Atributo: ${(proposta.atributo || '').toUpperCase()}</div>
                <div class="pgi-card-sub">Baseada em ${proposta.diasUnicos || '?'} dias de prática consistente.</div>
                <div style="display:flex;gap:8px;margin-top:6px;">
                    <button onclick="aceitarHabilidadeProposta(${idx})" style="flex:1;padding:5px 0;border:1px solid rgba(74,222,128,0.7);border-radius:5px;background:transparent;color:rgba(74,222,128,0.9);font-size:0.6rem;font-weight:700;letter-spacing:0.1em;cursor:pointer;">ACEITAR</button>
                    <button onclick="recusarHabilidadeProposta(${idx})" style="flex:1;padding:5px 0;border:1px solid rgba(255,100,100,0.4);border-radius:5px;background:transparent;color:rgba(255,100,100,0.6);font-size:0.6rem;font-weight:700;letter-spacing:0.1em;cursor:pointer;">RECUSAR</button>
                </div>
            </div>
        </div>`;
    });

    // --- Habilidades ativas ---
    const habilidades = (gameSystem.data.habilidades || []).filter(h => h.tipo === 'estudo' || h.tipo === 'combate');

    if (habilidades.length === 0 && propostas.length === 0) {
        skillsList.innerHTML = '<div class="section-text">O ARQUITETO AINDA NÃO DETECTOU UMA HABILIDADE</div>';
        return;
    }

    html += habilidades.map(skill => {
        const xp = skill.xp || 0;
        const xpNext = skill.xpNextLevel || 100;
        const pct = Math.min(100, Math.round((xp / xpNext) * 100));
        const tipoCap = skill.tipo === 'combate' ? 'COMBATE' : 'ESTUDO';
        return `
            <div class="pgi-block" style="margin-bottom:8px;">
                <div class="pgi-label">${tipoCap}</div>
                <div class="pgi-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div class="pgi-card-main">${skill.nome}</div>
                        <div style="font-size:0.6rem;font-weight:700;letter-spacing:0.1em;color:rgba(0,229,255,0.8);flex-shrink:0;">NV ${skill.level}</div>
                    </div>
                    <div class="bar-wrapper pgi-bar"><div class="bar-fill exp-bar" style="width:${pct}%"></div></div>
                    <div class="pgi-card-sub pgi-bar-label">${xp} / ${xpNext} XP</div>
                </div>
            </div>`;
    }).join('');

    skillsList.innerHTML = html;
}

function _runaUnlockLabel(runa) {
    const u = runa.unlock;
    switch (u.canal) {
        case 'nivel':       return `Nível ${u.valor}`;
        case 'atributo':    return `${(u.atributo||'').toUpperCase()} ≥ ${u.valor}`;
        case 'moedas':      return `${u.valor} moedas (G)`;
        case 'conquista':
            if (u.valor === 'moedas_500')  return '500G acumuladas';
            if (u.valor === 'streak_7')    return '7 dias sem penalidade';
            if (u.valor === 'treinos_25')  return '25 treinos completos';
            return u.valor;
        case 'missao_surpresa': return 'Missão Surpresa do Arquiteto';
        default: return '???';
    }
}

function updateRunesDisplay() {
    const runesList = document.getElementById('runesList');
    if (!runesList || !gameSystem) return;

    const desbloqueadasIds = gameSystem.data.runasCatalogo || [];
    const mp = gameSystem.data.mp || 0;
    const agora = new Date();

    // Também mostrar runas de habilidades (sistema legado) se existirem
    const runasHabilidade = (gameSystem.data.runas || []).filter(r => r.desbloqueada);

    if (desbloqueadasIds.length === 0 && runasHabilidade.length === 0) {
        runesList.innerHTML = '<div class="section-text">NENHUMA RUNA DESBLOQUEADA</div>';
        return;
    }

    let html = '';

    // --- Runas do catálogo desbloqueadas ---
    const desbloqueadas = RUNAS_CATALOG.filter(r => desbloqueadasIds.includes(r.id));
    desbloqueadas.forEach(runa => {
        const tierColor = RUNA_TIER_COLOR[runa.tier] || RUNA_TIER_COLOR[1];
        const tierLabel = RUNA_TIER_LABEL[runa.tier] || 'COMUM';

        if (runa.tipo === 'passiva') {
            html += `
            <div class="pgi-block" style="margin-bottom:8px;">
                <div class="pgi-label" style="color:${tierColor};">RUNA ${tierLabel} · PASSIVA</div>
                <div class="pgi-card" style="border-color:rgba(74,222,128,0.3);background:linear-gradient(145deg,rgba(74,222,128,0.05) 0%,rgba(6,8,14,0.95) 100%);">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                        <div class="pgi-card-main" style="color:#4ade80;">${runa.nome}</div>
                        <div style="font-size:0.52rem;font-weight:700;letter-spacing:0.12em;color:rgba(74,222,128,0.8);flex-shrink:0;">SEMPRE ATIVA</div>
                    </div>
                    <div class="pgi-card-sub">${runa.descricao}</div>
                </div>
            </div>`;
        } else {
            const ativaEntry = gameSystem.getRunaCatalogoAtiva(runa.id);
            const isActive = !!ativaEntry;
            const timeLeft = isActive ? Math.ceil((new Date(ativaEntry.activeUntil) - agora) / 60000) : 0;
            const mpOk = mp >= runa.mpCost;
            const btnLabel = isActive ? `ATIVA — ${timeLeft}min restantes` : !mpOk ? 'MP INSUFICIENTE' : 'ATIVAR';
            const btnColor = isActive ? 'rgba(0,229,255,0.85)' : !mpOk ? 'rgba(255,255,255,0.22)' : tierColor;
            const cardStyle = isActive ? 'border-color:rgba(0,229,255,0.45);background:linear-gradient(145deg,rgba(0,229,255,0.06) 0%,rgba(6,8,14,0.95) 100%);' : '';

            html += `
            <div class="pgi-block" style="margin-bottom:8px;">
                <div class="pgi-label" style="color:${tierColor};">RUNA ${tierLabel} · ${runa.duration}min · MP ${runa.mpCost}</div>
                <div class="pgi-card" style="${cardStyle}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                        <div class="pgi-card-main" style="${isActive ? 'color:#00e5ff;' : ''}">${runa.nome}</div>
                    </div>
                    <div class="pgi-card-sub">${runa.descricao}</div>
                    <button onclick="gameSystem.ativarRunaCatalogo('${runa.id}')" ${isActive || !mpOk ? 'disabled' : ''} style="margin-top:6px;width:100%;padding:5px 0;border:1px solid ${btnColor};border-radius:5px;background:transparent;color:${btnColor};font-size:0.6rem;font-weight:700;letter-spacing:0.12em;cursor:${isActive || !mpOk ? 'default' : 'pointer'};">${btnLabel}</button>
                </div>
            </div>`;
        }
    });

    // --- Runas do catálogo bloqueadas (mostra requisito, oculta efeito nas lendárias) ---
    const bloqueadas = RUNAS_CATALOG.filter(r => !desbloqueadasIds.includes(r.id));
    if (bloqueadas.length > 0) {
        html += `<div class="pgi-label" style="margin:12px 0 6px;">RUNAS BLOQUEADAS</div>`;
        bloqueadas.forEach(runa => {
            const tierColor = RUNA_TIER_COLOR[runa.tier] || RUNA_TIER_COLOR[1];
            const tierLabel = RUNA_TIER_LABEL[runa.tier] || 'COMUM';
            const descOculta = runa.tier === 4 ? '???' : runa.descricao;
            const unlockLabel = _runaUnlockLabel(runa);
            const isCompravel = runa.unlock.canal === 'moedas';
            const custo = isCompravel ? runa.unlock.valor : 0;
            const podePagar = isCompravel && (gameSystem.data.moedas || 0) >= custo;

            html += `
            <div class="pgi-block" style="margin-bottom:8px;opacity:0.65;">
                <div class="pgi-card" style="border-color:rgba(255,255,255,0.07);">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                        <div class="pgi-card-main" style="color:rgba(255,255,255,0.45);">🔒 ${runa.nome}</div>
                        <div style="font-size:0.52rem;font-weight:700;letter-spacing:0.1em;color:${tierColor};flex-shrink:0;">${tierLabel}</div>
                    </div>
                    <div class="pgi-card-sub">${descOculta}</div>
                    <div class="pgi-card-sub" style="color:rgba(251,191,36,0.6);margin-top:2px;">Requisito: ${unlockLabel}</div>
                    ${isCompravel ? `<button onclick="gameSystem.comprarRunaCatalogo('${runa.id}')" ${!podePagar ? 'disabled' : ''} style="margin-top:6px;width:100%;padding:5px 0;border:1px solid rgba(251,191,36,${podePagar ? '0.7' : '0.2'});border-radius:5px;background:transparent;color:rgba(251,191,36,${podePagar ? '0.9' : '0.3'});font-size:0.6rem;font-weight:700;letter-spacing:0.12em;cursor:${podePagar ? 'pointer' : 'default'};">COMPRAR POR ${custo}G</button>` : ''}
                </div>
            </div>`;
        });
    }

    // --- Runas legadas de habilidades (compatibilidade) ---
    if (runasHabilidade.length > 0) {
        html += `<div class="pgi-label" style="margin:12px 0 6px;">RUNAS DE HABILIDADES</div>`;
        runasHabilidade.forEach(runa => {
            const skill = (gameSystem.data.habilidades || []).find(s => s.runaId === runa.id);
            const isActive = runa.ativa && runa.activeUntil && new Date(runa.activeUntil) > agora;
            const timeLeft = isActive ? Math.ceil((new Date(runa.activeUntil) - agora) / 60000) : 0;
            const mpOk = mp >= (runa.mpCost || 0);
            const btnLabel = isActive ? `ATIVA — ${timeLeft}min restantes` : !mpOk ? 'MP INSUFICIENTE' : 'ATIVAR RUNA';
            const btnColor = isActive ? 'rgba(0,229,255,0.85)' : !mpOk ? 'rgba(255,255,255,0.22)' : 'rgba(192,132,252,0.85)';
            html += `
            <div class="pgi-block" style="margin-bottom:8px;">
                <div class="pgi-card" style="${isActive ? 'border-color:rgba(0,229,255,0.45);' : ''}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                        <div class="pgi-card-main" style="${isActive ? 'color:#00e5ff;' : ''}">${runa.nome}</div>
                        <div style="font-size:0.55rem;font-weight:700;letter-spacing:0.12em;color:rgba(192,132,252,0.7);flex-shrink:0;">MP ${runa.mpCost}</div>
                    </div>
                    <div class="pgi-card-sub">${runa.descricao || ''}</div>
                    ${skill ? `<div class="pgi-card-sub">Habilidade: ${skill.nome} · Lv ${skill.level}</div>` : ''}
                    <button onclick="useRune(${runa.id})" ${isActive || !mpOk ? 'disabled' : ''} style="margin-top:6px;width:100%;padding:5px 0;border:1px solid ${btnColor};border-radius:5px;background:transparent;color:${btnColor};font-size:0.6rem;font-weight:700;letter-spacing:0.12em;cursor:${isActive || !mpOk ? 'default' : 'pointer'};">${btnLabel}</button>
                </div>
            </div>`;
        });
    }

    runesList.innerHTML = html;
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

// Verificar runas ativas periodicamente (referência armazenada para permitir clearInterval futuro)
window._runasCheckInterval = window._runasCheckInterval || setInterval(() => {
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
                                <span class="section-header-text">HABILIDADES DE ESTUDO</span>
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
                                <span class="section-header-text">HABILIDADES DE COMBATE</span>
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
                    <span class="section-header-text">GRÁFICOS DE PROGRESSO SEMANAL</span>
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
                    ctx.font = 'bold 11px Orbitron, Inter, Rajdhani, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(valor.toString(), x + barWidth * 0.4, y - 5);
                }
                
                // Dia da semana
                let dayIndex = (now.getDay() - 6 + index) % 7;
                if (dayIndex < 0) dayIndex += 7;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px Orbitron, Inter, Rajdhani, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(diasSemana[dayIndex], x + barWidth * 0.4, height - 10);
            });
            
            // Eixo Y (valores)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '9px Orbitron, Inter, Rajdhani, sans-serif';
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
                    ctx.font = 'bold 11px Orbitron, Inter, Rajdhani, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(valor.toFixed(1) + 'h', x + barWidth * 0.4, y - 5);
                }
                
                // Dia da semana
                let dayIndex = (now.getDay() - 6 + index) % 7;
                if (dayIndex < 0) dayIndex += 7;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px Orbitron, Inter, Rajdhani, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(diasSemana[dayIndex], x + barWidth * 0.4, height - 10);
            });
            
            // Eixo Y (valores)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '9px Orbitron, Inter, Rajdhani, sans-serif';
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
                    <span class="section-header-text">GRÁFICO DE DESEMPENHO - PROGRESSÃO DE CARGA</span>
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
            ctx.font = 'bold 10px Orbitron, Inter, Rajdhani, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${dado.carga}kg`, x, y - 10);

            // Data (formato curto)
            const dataStr = dado.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '9px Orbitron, Inter, Rajdhani, sans-serif';
            ctx.fillText(dataStr, x, height - 15);
        });

        // Eixo Y (carga)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '9px Orbitron, Inter, Rajdhani, sans-serif';
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
        ctx.font = '11px Orbitron, Inter, Rajdhani, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CARGA (kg)', 0, 0);
        ctx.restore();

        // Informações adicionais
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px Orbitron, Inter, Rajdhani, sans-serif';
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
                            <option value="sabedoria">SABEDORIA</option>
                            <option value="carisma">CARISMA</option>
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
    const vidShopGrid = document.getElementById('vidShopGrid');
    const vidShopBalance = document.getElementById('vidShopBalance');
    
    if ((!shopItemsList && !vidShopGrid) || !gameSystem) return;
    
    // Inicializar recompensas se não existir
    if (!Array.isArray(gameSystem.data.recompensas)) {
        gameSystem.data.recompensas = [];
    }
    mergeLojaDoTempoDefaults();
    window.mergeLojaDoTempoDefaults = mergeLojaDoTempoDefaults;
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

    const VIDEO_SHOP_ITEMS = [
        {
            key: 'escudo24h',
            icon: '🛡️',
            name: 'Escudo 24H',
            desc: 'Proteção contra punições por 24 horas. Missões não realizadas não causam dano.',
            pct: 52,
            time: '24h',
            price: 12000
        },
        {
            key: 'sessao_tv',
            icon: '📺',
            name: 'Sessão TV',
            desc: '1 episódio de série ou filme. Aproveite.',
            pct: 5,
            time: '1h',
            price: 8000
        },
        {
            key: 'descanso_total',
            icon: '🛏️',
            name: 'Descanso Total',
            desc: 'Um dia inteiro de descanso regenerativo.',
            pct: 40,
            time: '1 dia',
            price: 35000
        },
        {
            key: 'refeicao_livre',
            icon: '🍽️',
            name: 'Refeição Livre',
            desc: 'Uma refeição livre para comer o que quiser.',
            pct: 25,
            time: '1 refeição',
            price: 12000
        },
        {
            key: 'jogar_videogame',
            icon: '🎮',
            name: 'Jogar Videogame',
            desc: '1 hora de gameplay consciente. Sem culpa.',
            pct: 20,
            time: '1h',
            price: 9000
        },
        {
            key: 'saida_social',
            icon: '👥',
            name: 'Saída Social',
            desc: 'Tempo de qualidade com amigos ou socialização.',
            pct: 30,
            time: '2h',
            price: 15000
        }
    ];

    function renderVideoShop() {
        if (!vidShopGrid) return false;
        if (vidShopBalance) {
            vidShopBalance.textContent = (gameSystem.data.moedas || 0).toLocaleString('pt-BR');
        }
        vidShopGrid.innerHTML = VIDEO_SHOP_ITEMS.map((it) => {
            const pct = `${it.pct}%`;
            return `
                <button type="button" class="vid-shop-card" data-vid-shop-key="${it.key}" data-vid-shop-price="${it.price}">
                    <div class="vid-shop-card-top">
                        <span class="vid-shop-card-ico" aria-hidden="true">${it.icon}</span>
                        <span class="vid-shop-badges" aria-hidden="true">
                            <span class="vid-shop-badge vid-shop-badge--pct">${pct}</span>
                            <span class="vid-shop-badge vid-shop-badge--time">${it.time}</span>
                        </span>
                    </div>
                    <div class="vid-shop-card-title">${it.name}</div>
                    <div class="vid-shop-card-desc">${it.desc}</div>
                </button>
            `;
        }).join('');

        vidShopGrid.onclick = (ev) => {
            const btn = ev.target.closest('.vid-shop-card[data-vid-shop-key]');
            if (!btn) return;
            const key = btn.getAttribute('data-vid-shop-key');
            const it = VIDEO_SHOP_ITEMS.find((x) => x.key === key);
            if (!it) return;
            // Reaproveita modal existente para compra (mantém mecânica interna)
            const shopModal = document.getElementById('shopModal');
            if (!shopModal) return;
            // Cria um "itemBox" virtual com dataset esperado
            const fake = document.createElement('div');
            fake.setAttribute('data-item-name', it.name.toUpperCase());
            fake.setAttribute('data-item-price', String(it.price));
            fake.setAttribute('data-item-icon', it.icon);
            fake.setAttribute('data-item-type', 'recompensa');
            if (typeof window.openShopModal === 'function') {
                window.openShopModal(fake);
            }
        };

        const histBtn = document.getElementById('vidShopHistoryBtn');
        if (histBtn) {
            histBtn.onclick = () => showToast('Histórico de compras em desenvolvimento', 'info');
        }

        return true;
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
                    <span class="section-header-text">POÇÕES (${pocoes.length})</span>
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
                    <span class="section-header-text">RECOMPENSAS/GIFTS (${recompensas.length})</span>
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
    
    // Se o layout do vídeo estiver presente, usa render dedicado.
    const usingVideoShop = renderVideoShop();
    if (!usingVideoShop) {
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
    }
    
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
                    <div class="form-group" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
                        <button type="button" class="form-btn submit-btn" id="rewardSuggestHeuristic" style="font-size:12px;">SUGERIR PREÇO (LOCAL)</button>
                        <button type="button" class="form-btn cancel-btn" id="rewardSuggestIA" style="font-size:12px;">SUGERIR COM IA</button>
                        <span id="rewardSuggestNote" class="section-text" style="font-size:10px;flex:1;min-width:100%;"></span>
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

    const nameInput = document.getElementById('rewardName');
    const priceInput = document.getElementById('rewardPrice');
    const suggestNote = document.getElementById('rewardSuggestNote');
    const btnRLocal = document.getElementById('rewardSuggestHeuristic');
    const btnRia = document.getElementById('rewardSuggestIA');
    if (btnRLocal) {
        btnRLocal.addEventListener('click', () => {
            const nome = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
            if (!nome) {
                if (suggestNote) suggestNote.textContent = 'Escreve o nome do item acima.';
                return;
            }
            const p = suggestRewardPriceHeuristic(nome);
            if (priceInput) priceInput.value = String(p);
            if (suggestNote) suggestNote.textContent = 'Preço sugerido: ' + p.toLocaleString('pt-BR') + ' G (ajusta à vontade).';
        });
    }
    if (btnRia) {
        btnRia.addEventListener('click', async () => {
            const nome = (nameInput && nameInput.value) ? nameInput.value.trim() : '';
            if (!nome) {
                if (suggestNote) suggestNote.textContent = 'Escreve o nome do item acima.';
                return;
            }
            if (suggestNote) suggestNote.textContent = 'A calcular preço…';
            btnRia.disabled = true;
            try {
                const p = await suggestRewardPriceWithOpenRouter(nome);
                if (priceInput) priceInput.value = String(p);
                if (suggestNote) suggestNote.textContent = 'Preço: ' + p.toLocaleString('pt-BR') + ' G' + (getOpenRouterKey() ? ' (IA + validação local).' : ' (heurística).');
            } catch (e) {
                const p = suggestRewardPriceHeuristic(nome);
                if (priceInput) priceInput.value = String(p);
                if (suggestNote) suggestNote.textContent = (e && e.message) || 'IA indisponível. Preço local aplicado.';
            } finally {
                btnRia.disabled = false;
            }
        });
    }
    
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

// Exportar para uso global (gameSystem já exposto em DOMContentLoaded após new GameSystem)
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

    let gaveExp = false;
    if (exp && exp > 0) {
        gameSystem.addExp(exp);
        gaveExp = true;
    }
    if (moedas && moedas > 0) {
        gameSystem.addMoedas(moedas);
    }
    if (atributo && atributoValor && atributoValor > 0) {
        const attrMap = {
            forca: 'addForca',
            sabedoria: 'addSabedoria',
            foco: 'addFoco',
            vitalidade: 'addVitalidade',
            disciplina: 'addDisciplina',
            carisma: 'addCarisma'
        };
        const fnName = attrMap[atributo];
        if (fnName && typeof gameSystem[fnName] === 'function') {
            if (fnName === 'addVitalidade' || fnName === 'addDisciplina') {
                gameSystem[fnName]();
            } else {
                gameSystem[fnName](atributoValor);
            }
        }
    }
    /* Missão/hábito com 0 EXP: addExp não corre — actualizar Painel («Completas hoje», etc.) */
    if (!gaveExp && typeof gameSystem.updateStatusDisplay === 'function') {
        gameSystem.updateStatusDisplay();
    }
}

function _missionsRewardChips(m) {
    const r = m.rewards || {};
    const p = [];
    if (r.exp > 0) p.push(`+${r.exp} XP`);
    if (r.moedas > 0) p.push(`+${r.moedas} G`);
    if (r.atributo && (r.atributoValor > 0 || r.atributoValor)) p.push(String(r.atributo).toUpperCase());
    if (!p.length) return '<span class="sys-mission-rew-na">Sem recompensa</span>';
    return p.map((x) => `<span class="sys-mission-rew-pill">${x}</span>`).join('');
}

/**
 * Grelha tática (ref. SISTEMA): cartão de missão com estado, recompensas e progresso
 */
function buildMissionCardHtml(m, todayKey) {
    const completedHoje = m.completions && m.completions.includes(todayKey);
    const isUnique = !!m.unique;
    const doneUnique = isUnique && m.completions && m.completions.length > 0;
    const doneForUi = isUnique ? doneUnique : completedHoje;
    const appears = shouldTaskAppearToday(m, new Date());
    const high = m.priority === 'alta' || m.priority === 'ALTA';
    const priorityLabel = isUnique ? m.priority || 'normal' : null;
    const categoryLabel = isUnique && m.category ? m.category : '';

    let statusLine = doneForUi ? 'CONCLUÍDA' : 'PENDENTE';
    if (!isUnique && !appears) statusLine = 'AGUARDA CICLO';

    let progressSection = '';
    if (m.progress && m.progress.enabled && m.progress.max > 0) {
        const byDate = m.progress.byDate || {};
        const currentValue = byDate[todayKey] || 0;
        const max = m.progress.max;
        const disableProg = !appears;
        const disAttr = disableProg ? ' disabled' : '';
        progressSection = `
            <div class="sys-mission-prog" aria-label="Progresso parcial">
                <div class="sys-mission-prog-trail"><span class="sys-mission-prog-fill" style="width:${max ? Math.min(100, (currentValue / max) * 100) : 0}%;"></span></div>
                <div class="task-progress-inline">
                    <span>${currentValue} / ${max}</span>
                    <button type="button" class="form-btn task-small-btn task-progress-add-btn"${disAttr}>+ PROGRESSO</button>
                    <button type="button" class="form-btn task-small-btn task-progress-reset-btn"${disAttr}>RESETAR HOJE</button>
                </div>
            </div>
        `;
    }

    const canToggle = appears && !doneForUi;
    const chk = doneForUi ? ' checked disabled' : canToggle ? '' : ' disabled';
    const _esc = (s) =>
        String(s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    const desc = m.descricao ? `<p class="sys-mission-desc">${_esc(m.descricao)}</p>` : '';

    return `
        <div class="sys-mission-card task-item${high ? ' sys-mission-card--priority' : ''}" data-id="${m.id}" data-tipo="missao" data-appears-today="${appears}">
            <div class="sys-mission-top">
                <div class="sys-mission-title-row">
                    <label class="task-checkbox-wrapper sys-mission-check">
                        <input type="checkbox" class="task-complete-checkbox"${chk}>
                        <span class="sys-mission-tit task-name">${m.titulo || ''}</span>
                    </label>
                    <div class="sys-mission-badges">
                        <span class="sys-mission-type">${isUnique ? 'ÚNICA' : 'RECORRENTE'}</span>
                        <span class="task-tag sys-mission-tag">QUEST</span>
                    </div>
                </div>
                ${desc}
                <div class="sys-mission-mid">
                    <span class="sys-mission-rew">${_missionsRewardChips(m)}</span>
                    <div class="sys-mission-meta-l">
                        <span class="task-recurring sys-mission-rec">${getRecurrenceLabel(m.recurrence)}</span>
                        <span class="task-progress sys-mission-st ${doneForUi ? 'completed' : ''}">${statusLine}</span>
                        ${
                            priorityLabel
                                ? `<span class="task-priority ${String(priorityLabel).toLowerCase()}">${String(priorityLabel).toUpperCase()}</span>`
                                : ''
                        }
                        ${categoryLabel ? `<span class="task-category sys-mission-cat">${categoryLabel}</span>` : ''}
                    </div>
                </div>
                ${progressSection}
            </div>
            <div class="task-actions sys-mission-actions">
                <button type="button" class="form-btn task-small-btn task-edit-btn" title="Editar"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M11 2l3 3-9 9H2v-3L11 2z"/></svg></button>
                <button type="button" class="form-btn task-small-btn task-delete-btn" title="Excluir"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M3 5h10M6 5V3h4v2M5 5l1 8h4l1-8"/></svg></button>
            </div>
        </div>
    `;
}

function _buildHabitRowHtml(h, todayKey) {
    const completed = h.completions && h.completions.includes(todayKey);
    const progressText = completed ? 'CONCLUÍDO' : 'PENDENTE';
    let progressSection = '';
    if (h.progress && h.progress.enabled && h.progress.max > 0) {
        const byDate = h.progress.byDate || {};
        const currentValue = byDate[todayKey] || 0;
        const max = h.progress.max;
        progressSection = `
            <div class="task-progress-inline">
                <span>${currentValue} / ${max}</span>
                <button type="button" class="form-btn task-small-btn task-progress-add-btn">+ PROGRESSO</button>
                <button type="button" class="form-btn task-small-btn task-progress-reset-btn">RESETAR HOJE</button>
            </div>
        `;
    }
    return `
        <div class="sys-mission-habit task-item" data-id="${h.id}" data-tipo="habito">
            <div class="task-main">
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-complete-checkbox" ${completed ? 'checked disabled' : ''}>
                    <span class="task-name">${h.titulo}</span>
                </label>
                <span class="task-tag">HÁBITO</span>
            </div>
            <div class="task-meta">
                <span class="task-recurring">${getRecurrenceLabel(h.recurrence)}</span>
                <span class="task-progress ${completed ? 'completed' : ''}">${progressText}</span>
                ${progressSection}
                <div class="task-actions">
                    <button class="form-btn task-small-btn task-edit-btn" title="Editar"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M11 2l3 3-9 9H2v-3L11 2z"/></svg></button>
                    <button class="form-btn task-small-btn task-delete-btn" title="Excluir"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px"><path d="M3 5h10M6 5V3h4v2M5 5l1 8h4l1-8"/></svg></button>
                </div>
            </div>
        </div>
    `;
}

function renderTasks() {
    if (!gameSystem) return;

    const today = new Date();
    const todayKey = getTodayKey();

    const tasksDailyList = document.getElementById('tasksDailyList');
    const missionsList = document.getElementById('missionsList');
    if (!missionsList) return;

    const misSrc = gameSystem.data.missoes || [];
    /* «Todas» inclui arquivadas; «Foco do Dia» só lista activas (arquivadas passam só com Todas no filtro) */
    const allMis =
        _missionsScope === 'all' ? misSrc.slice() : misSrc.filter((m) => m.ativo !== false);

    const hasVideoLayout = !!document.querySelector('.vid-missions');
    const viewDtMissions = hasVideoLayout ? getMissionsViewDate() : null;
    const viewKeyMissions =
        hasVideoLayout && viewDtMissions
            ? getCalendarKeyForDate(viewDtMissions) || getDateKey(viewDtMissions)
            : todayKey;
    const pendHoje = hasVideoLayout
        ? allMis
              .filter((m) => m.ativo !== false)
              .filter((m) => isMissionPendingForViewDay(m, viewDtMissions, viewKeyMissions))
              .length
        : allMis
              .filter((m) => m.ativo !== false)
              .filter(
                  (m) =>
                      shouldTaskAppearToday(m, new Date()) &&
                      !(m.completions && m.completions.includes(todayKey))
              ).length;
    const subEl = document.querySelector('.vid-missions-sub');
    if (subEl) subEl.textContent = `${pendHoje} missões pendentes`;

    if (tasksDailyList) {
        const habitosHoje = (gameSystem.data.habitos || []).filter((h) => shouldTaskAppearToday(h, new Date(today)));
        tasksDailyList.innerHTML = habitosHoje.length
            ? habitosHoje.map((h) => _buildHabitRowHtml(h, todayKey)).join('')
            : '<div class="sys-mission-empty-habit">Nenhum hábito ativo hoje. Usa <strong>+ HÁBITO</strong> na rotina.</div>';
    }

    let missoesVisiveis = allMis;
    if (hasVideoLayout) {
        missoesVisiveis = allMis
            .filter((m) => _missionMatchesVideoFilters(m, viewDtMissions))
            .sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'pt-BR'));
        const empty = document.getElementById('missionsEmpty');
        const head = document.getElementById('missionsSectionHead');
        const group = document.getElementById('missionsGroupHead');
        const gCount = document.getElementById('missionsGroupCount');
        const cnt = document.getElementById('missionsSectionCount');
        if (head) head.style.display = missoesVisiveis.length ? '' : 'none';
        if (group) group.style.display = missoesVisiveis.length ? '' : 'none';
        if (gCount) gCount.textContent = `(${missoesVisiveis.length})`;
        if (cnt) cnt.textContent = `(${missoesVisiveis.length})`;
        if (empty) empty.style.display = missoesVisiveis.length ? 'none' : '';
        missionsList.classList.add('vid-missions-list');
        missionsList.innerHTML = missoesVisiveis.length
            ? missoesVisiveis.map((m) => buildMissionCardHtmlVideo(m, viewKeyMissions, viewDtMissions)).join('')
            : '';

        const stripLbl = document.getElementById('missionsStripHoje');
        if (stripLbl) stripLbl.textContent = formatMissionsViewPeriodLabel(viewDtMissions);

        document.querySelectorAll('.vid-missions [data-missions-scope]').forEach((b) => {
            b.classList.toggle('is-active', b.getAttribute('data-missions-scope') === _missionsScope);
        });
        document.querySelectorAll('.vid-missions [data-missions-completion]').forEach((b) => {
            b.classList.toggle('is-active', b.getAttribute('data-missions-completion') === _missionsCompletion);
        });

        const catStrip = document.getElementById('missionsCategoryStrip');
        if (catStrip) {
            catStrip.querySelectorAll('[data-missions-cat]').forEach((b) => {
                const v = b.getAttribute('data-missions-cat') || '';
                b.classList.toggle('is-active', v === _missionsVideoCategory);
            });
        }
    } else {
        missoesVisiveis = allMis
            .filter((m) => missionMatchesListFilter(m, _missionListFilter))
            .sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'pt-BR'));
        missionsList.innerHTML = missoesVisiveis.length
            ? missoesVisiveis.map((m) => buildMissionCardHtml(m, todayKey)).join('')
            : `<div class="sys-mission-list-empty">Nenhuma missão com este filtro. Escolhe <strong>TODAS</strong> ou outro critério acima, ou cria uma <strong>NOVA QUEST</strong>.</div>`;
    }

    // Interações do layout do vídeo (delegação)
    if (hasVideoLayout) {
        missionsList.onclick = (ev) => {
            const card = ev.target.closest('.vid-mission-card[data-id]');
            if (!card) return;
            const id = Number(card.getAttribute('data-id'));
            const task = (gameSystem.data.missoes || []).find((t) => t.id === id);
            if (!task) return;

            if (ev.target.closest('.js-mission-more') || ev.target.closest('.js-mission-mini')) {
                // Placeholder: no vídeo esses controles existem; aqui abrimos o editor da missão.
                showTaskModal('missao', id);
                return;
            }
            if (ev.target.closest('.js-mission-edit')) {
                showTaskModal('missao', id);
                return;
            }
            if (ev.target.closest('.js-mission-archive')) {
                if (!confirm('Arquivar esta missão? Continua nos dados — escolhe «Todas» para a ver ou usa Restaurar no cartão.')) return;
                task.ativo = false;
                gameSystem.saveData();
                if (typeof showToast === 'function') showToast('Missão arquivada.', 'info');
                renderTasks();
                return;
            }
            if (ev.target.closest('.js-mission-restore')) {
                task.ativo = true;
                gameSystem.saveData();
                if (typeof showToast === 'function') showToast('Missão restaurada ao sistema.', 'ok');
                renderTasks();
                return;
            }
            if (ev.target.closest('.js-mission-purge')) {
                if (!confirm('Apagar esta missão permanentemente? Não será possível recuperar.')) return;
                const list = gameSystem.data.missoes || [];
                const idx = list.findIndex((t) => t.id === id);
                if (idx >= 0) list.splice(idx, 1);
                gameSystem.data.missoes = list;
                gameSystem.saveData();
                if (typeof showToast === 'function') showToast('Missão removida permanentemente.', 'info');
                renderTasks();
                return;
            }
            if (ev.target.closest('.js-mission-complete')) {
                if (task.ativo === false) return;
                const viewDt = getMissionsViewDate();
                const viewKeyLocal =
                    typeof getCalendarKeyForDate === 'function' && gameSystem
                        ? getCalendarKeyForDate(viewDt) || getDateKey(viewDt)
                        : getDateKey(viewDt);
                const isUnique = !!task.unique;
                const completedView = keyMatchesCompletions(viewKeyLocal, task.completions || []);
                const doneUnique = isUnique && task.completions && task.completions.length > 0;
                const doneForUi = isUnique ? doneUnique : completedView;
                const appears = shouldTaskAppearToday(task, viewDt);
                if (doneForUi || (!appears && !isUnique)) return;

                completeRecurringTask(task, viewKeyLocal);
                applyTaskRewards(task);
                gameSystem.saveData();
                if (typeof gameSystem.verificarDesafiosArquiteto === 'function') gameSystem.verificarDesafiosArquiteto();
                if (typeof gameSystem.checkRunasCatalogo === 'function') gameSystem.checkRunasCatalogo();

                const r = task.rewards || {};
                const xpPart = r.exp > 0 ? `+${r.exp} XP` : null;
                const cPart = r.moedas > 0 ? `+${r.moedas} Coin` : null;
                const line = [xpPart, cPart].filter(Boolean).join(' | ');
                // Texto e estilo como no frame f_0175 (toast claro no topo)
                showToast(`Missão completada! ${line || ''}`.trim(), 'ok');
                renderTasks();
            }
        };

        const catStrip = document.getElementById('missionsCategoryStrip');
        if (catStrip) {
            catStrip.onclick = (ev) => {
                const btn = ev.target.closest('[data-missions-cat]');
                if (!btn) return;
                const cat = btn.getAttribute('data-missions-cat');
                if (!cat) return;
                if (_missionsVideoCategory === cat && cat !== 'ALL') {
                    _missionsVideoCategory = 'ALL';
                } else {
                    _missionsVideoCategory = cat;
                }
                catStrip.querySelectorAll('[data-missions-cat]').forEach((b) => {
                    const v = b.getAttribute('data-missions-cat') || '';
                    b.classList.toggle('is-active', v === _missionsVideoCategory);
                });
                renderTasks();
            };
        }
    }

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

            const listName = tipo === 'habito' ? 'habitos' : 'missoes';
            const list = gameSystem.data[listName] || [];
            const t = list.find((x) => x.id === id);
            if (!t) return;

            if (tipo === 'missao') {
                if (!confirm('Arquivar esta missão? Continua nos dados — escolhe «Todas» para a ver ou usa Restaurar no cartão.')) return;
                t.ativo = false;
                gameSystem.saveData();
                renderTasks();
                if (typeof showToast === 'function') showToast('Missão arquivada.', 'info');
                return;
            }

            if (!confirm('Deseja realmente excluir esta tarefa?')) return;
            const index = list.findIndex((x) => x.id === id);
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

/**
 * Sugestão local (heurística) — XP, moedas, atributo, segmento, observação e barra.
 * Funciona sem API; a IA (OpenRouter) refina se existir chave.
 */
function recommendMissionHeuristic(title) {
    const t = (title || '').toLowerCase();
    let exp = 35;
    let moedas = 0;
    let atributo = '';
    let atributoValor = 0.5;
    let categoria = 'GERAL';
    let useProgress = false;
    let progressMax = 1;
    const num = t.match(/(\d+[\d.,]*)\s*(págin|pagin|page|min|minut|horas?|h\b|km|kg|reps?|série|vezes|x\b)/i);
    const n = num ? parseFloat(String(num[1]).replace(',', '.')) : 0;
    if (/ler|livr|leitur|págin|estud|estudo|curs|leitura/.test(t)) {
        categoria = 'LEITURA / ESTUDO';
        atributo = 'sabedoria';
        if (n > 0) {
            useProgress = true;
            progressMax = Math.max(1, Math.min(200, Math.round(n)));
            exp = Math.min(500, 15 * progressMax);
        } else {
            exp = 60;
        }
    } else if (/trein|musc|academ|flex|agach|corrida|banh|nataç|puxad/.test(t)) {
        categoria = 'TREINO';
        atributo = 'forca';
        exp = n > 0 ? Math.min(400, 12 * n) : 80;
    } else if (/medit|dormi|sono|descan|hidrata|rotina|hábit|habit/.test(t)) {
        categoria = 'ROTINA';
        atributo = 'vitalidade';
        exp = 40;
    } else if (/projet|trabalh|código|code|tarefa|entreg|deadline|email/.test(t)) {
        categoria = 'TRABALHO / PROJETO';
        atributo = 'carisma';
        exp = 70;
    } else {
        exp = 40 + Math.min(40, Math.floor(t.length * 0.5));
    }
    if (n > 0 && !useProgress) {
        atributoValor = Math.min(50, n * 0.1 + 0.2);
    }
    if (exp >= 60 && /[1-9]/.test(t) && t.length > 8) {
        moedas = Math.min(25, 5 + Math.floor(exp / 30));
    }
    if (categoria === 'TREINO' || categoria === 'LEITURA / ESTUDO') {
        if (exp >= 50) moedas = Math.max(moedas, 5);
    }
    const descricao = `O Arquiteto observa: a tua ficha "${(title || '').toUpperCase()}" foi registada. A execução precisa pesa no balanço do Sistema. Avança sem hesitar: o vazio preenche-se com ação, não com intenção.`;
    return {
        exp: Math.max(5, Math.round(exp)),
        moedas: Math.max(0, Math.round(moedas)),
        atributo,
        atributoValor: atributo ? Math.max(0.1, Math.round(atributoValor * 10) / 10) : 0,
        categoria: categoria.toUpperCase(),
        descricao,
        useProgress,
        progressMax: useProgress ? progressMax : 1
    };
}

/**
 * Extrai o primeiro bloco JSON `{...}` equilibrado (ignora chaves dentro de strings).
 */
function extractJsonObject(text) {
    const s = String(text || '');
    const start = s.indexOf('{');
    if (start < 0) return null;
    let depth = 0;
    let inString = false;
    let esc = false;
    for (let i = start; i < s.length; i++) {
        const c = s[i];
        if (inString) {
            if (esc) {
                esc = false;
            } else if (c === '\\') {
                esc = true;
            } else if (c === '"') {
                inString = false;
            }
            continue;
        }
        if (c === '"') {
            inString = true;
            continue;
        }
        if (c === '{') depth++;
        if (c === '}') {
            depth--;
            if (depth === 0) return s.slice(start, i + 1);
        }
    }
    return null;
}

/**
 * Chama OpenRouter e espera JSON com exp, moedas, categoria, atributo, atributoValor, observacao, darMoedas.
 * Em qualquer falha (rede, markdown extra, JSON inválido) devolve a heurística local.
 */
async function recommendMissionWithOpenRouter(title) {
    const h = recommendMissionHeuristic(title);
    const system = `És o Arquiteto. Responde APENAS um objeto JSON, sem markdown, com:
{"exp":number,"moedas":number,"categoria":string,"atributo":string ou "" (uma de: forca,sabedoria,foco,vitalidade,disciplina,carisma),
"atributoValor":number,"observacao":string (2-3 frases, tom misterioso estilo Solo Leveling, PT-BR),
"usarBarra":boolean,"maxBarra":number,"darMoedas":boolean}`;

    const user = `Define recompensas e texto para a missão: "${(title || '').replace(/"/g, "'")}"`;
    try {
        const text = await callOpenRouter(
            [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            0
        );
        const stripped = (text || '')
            .replace(/^\s*```[a-z]*\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();
        let jsonStr = stripped;
        try {
            JSON.parse(stripped);
        } catch {
            const extracted = extractJsonObject(stripped);
            if (!extracted) {
                console.warn('recommendMissionWithOpenRouter: JSON não encontrado, heurística.');
                return h;
            }
            jsonStr = extracted;
        }
        const j = JSON.parse(jsonStr);
        const exp = Math.max(5, Math.min(2000, parseInt(j.exp, 10) || 50));
        let moedas = Math.max(0, Math.min(500, parseInt(j.moedas, 10) || 0));
        if (j.darMoedas === false) moedas = 0;
        if (j.darMoedas === true && moedas < 1) moedas = 8;
        const atributo = ['forca', 'sabedoria', 'foco', 'vitalidade', 'disciplina', 'carisma'].includes(
            String(j.atributo || '').toLowerCase()
        )
            ? j.atributo.toLowerCase()
            : h.atributo;
        const obs = (j.observacao || '').toString().trim();
        return {
            exp,
            moedas,
            categoria: (j.categoria || h.categoria || 'GERAL').toString().slice(0, 64).toUpperCase(),
            atributo: atributo || h.atributo,
            atributoValor: Math.max(0, parseFloat(j.atributoValor) || h.atributoValor),
            descricao: obs || h.descricao,
            useProgress: j.usarBarra != null ? !!j.usarBarra : h.useProgress,
            progressMax: j.usarBarra
                ? Math.max(1, Math.min(500, parseInt(j.maxBarra, 10) || h.progressMax || 1))
                : h.progressMax
        };
    } catch (e) {
        console.warn('recommendMissionWithOpenRouter', e);
        return h;
    }
}

const SISTEMA_LOJA_RECOMPENSAS_DEFAULT = [
    { name: 'HORA DO SONO ADICIONAL', price: 3500, icon: '🌙' },
    { name: 'REFEIÇÃO SELECIONADA', price: 12000, icon: '🍱' },
    { name: 'SESSÃO DE LAZER (1H)', price: 8000, icon: '🎮' },
    { name: 'LIVRO / LEITURA EXTRA', price: 5000, icon: '📚' },
    { name: 'ITEM COMUM — CAIXA C', price: 1500, icon: '📦' },
    { name: 'ITEM RARO — CAIXA B', price: 45000, icon: '✨' },
    { name: 'ITEM ÉPICO — CAIXA A', price: 120000, icon: '💎' }
];

function mergeLojaDoTempoDefaults() {
    if (!gameSystem) return;
    if (!Array.isArray(gameSystem.data.recompensas)) gameSystem.data.recompensas = [];
    const have = new Set(
        (gameSystem.data.recompensas || []).map((r) => (r.name || '').toUpperCase().trim())
    );
    let added = false;
    SISTEMA_LOJA_RECOMPENSAS_DEFAULT.forEach((d) => {
        const n = d.name.toUpperCase();
        if (!have.has(n)) {
            gameSystem.data.recompensas.push({
                name: d.name,
                icon: d.icon,
                price: d.price,
                type: 'recompensa',
                predefinido: true
            });
            have.add(n);
            added = true;
        }
    });
    if (added) gameSystem.saveData();
}

/**
 * Heurística de preço G para recompensa da Loja (sem API).
 */
function suggestRewardPriceHeuristic(nome) {
    const t = (nome || '').toLowerCase();
    let p = 2000 + Math.min(20000, t.length * 400);
    if (/épico|lend|ss|rank|ss\+|s\./i.test(t)) p = Math.max(p, 80000);
    else if (/raro|diam|premium|diamond/i.test(t)) p = Math.max(p, 35000);
    else if (/comun|bás|simples|padrão/.test(t)) p = Math.min(p, 8000);
    if (/sono|dorm|descan|h/i.test(t)) p = Math.min(p, 20000);
    if (/tempo|hora|1h|60\s*min/.test(t)) p = Math.max(p, 6000);
    return Math.round(p / 100) * 100;
}

/**
 * Se existir chave OpenRouter, pede preço (número) numa linha; fallback heurística.
 */
async function suggestRewardPriceWithOpenRouter(nome) {
    const h = suggestRewardPriceHeuristic(nome);
    if (!getOpenRouterKey()) return h;
    try {
        const system =
            'Responde APENAS um número inteiro (preço em moedas G) para comprar: "' +
            (nome || '').replace(/"/g, "'") +
            '". Só o número, nada mais.';
        const text = await callOpenRouter(
            [
                { role: 'system', content: 'És o Arquiteto. Preços de loja alinhados a Solo Leveling; só número.' },
                { role: 'user', content: system }
            ],
            0
        );
        const n = parseInt(String(text).replace(/[^\d]/g, ''), 10);
        if (n >= 10 && n < 1e8) return n;
    } catch (e) {
        console.warn('suggestRewardPriceWithOpenRouter', e);
    }
    return h;
}

/** Estado visual + campos ocultos — chips do formulário de missão. */
function missionVideoSetFreq(root, which) {
    const kindEl = root.querySelector('#taskKind');
    const recTypeEl = root.querySelector('#taskRecurrenceType');
    const recIntEl = root.querySelector('#taskRecurrenceInterval');
    root.querySelectorAll('[data-freq-preset]').forEach((b) => b.classList.remove('mfv-chip--active'));
    const btn = root.querySelector(`[data-freq-preset="${which}"]`);
    if (btn) btn.classList.add('mfv-chip--active');
    if (!kindEl || !recTypeEl || !recIntEl) return;
    recIntEl.value = '1';
    if (which === 'unica') {
        kindEl.value = 'unica';
        recTypeEl.value = 'daily';
    } else if (which === 'semanal') {
        kindEl.value = 'recorrente';
        recTypeEl.value = 'weekly';
    } else {
        kindEl.value = 'recorrente';
        recTypeEl.value = 'daily';
    }
}

function missionVideoSetPri(root, v) {
    const priEl = root.querySelector('#taskPriority');
    root.querySelectorAll('[data-priority-preset]').forEach((b) => b.classList.remove('mfv-chip--prio-active'));
    const btn = root.querySelector(`[data-priority-preset="${v}"]`);
    if (btn) btn.classList.add('mfv-chip--prio-active');
    if (priEl) priEl.value = v || 'media';
}

function missionVideoSetPeriod(root, v) {
    const periodEl = root.querySelector('#taskIdealPeriod');
    root.querySelectorAll('[data-period-preset]').forEach((b) => b.classList.remove('mfv-chip--period-active'));
    const btn = root.querySelector(`[data-period-preset="${v}"]`);
    if (btn) btn.classList.add('mfv-chip--period-active');
    if (periodEl) periodEl.value = v || 'flex';
}

function missionVideoSetSegment(root, codeRaw) {
    const catEl = root.querySelector('#taskCategory');
    const needle = codeRaw ? String(codeRaw).trim() : '';
    root.querySelectorAll('.mfv-segment-btn').forEach((b) => {
        const c = String(b.getAttribute('data-segment-code') || '');
        const on = !!(needle && c && c.toLocaleLowerCase('pt-BR') === needle.toLocaleLowerCase('pt-BR'));
        b.classList.toggle('mfv-segment-btn--active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (catEl) catEl.value = needle ? needle.toUpperCase() : '';
}

function resetMissionVideoFormLimpar(modal) {
    const root = modal.querySelector('form.mission-form-video');
    if (!root) return;
    const listEl = root.querySelector('#missionChecklistList');
    if (listEl) listEl.innerHTML = '';
    const ci = root.querySelector('#missionChecklistInput');
    if (ci) ci.value = '';
    missionVideoSetFreq(root, 'unica');
    missionVideoSetPri(root, 'media');
    missionVideoSetPeriod(root, 'flex');
    missionVideoSetSegment(root, '');
    const timeIn = root.querySelector('#taskIdealTime');
    if (timeIn) timeIn.value = '';
}

/** Helpers — formulário missão «vídeo» (grid segmento + chips). */
function bindMissionVideoFormInteractions(modal, existingId /* reserved */) {
    const root = modal.querySelector('form.mission-form-video');
    if (!root) return;

    root.addEventListener('click', (ev) => {
        const pf = ev.target.closest('[data-freq-preset]');
        if (pf) {
            ev.preventDefault();
            missionVideoSetFreq(root, pf.getAttribute('data-freq-preset') || 'diaria');
            return;
        }
        const pr = ev.target.closest('[data-priority-preset]');
        if (pr) {
            ev.preventDefault();
            missionVideoSetPri(root, pr.getAttribute('data-priority-preset') || 'media');
            return;
        }
        const pe = ev.target.closest('[data-period-preset]');
        if (pe) {
            ev.preventDefault();
            missionVideoSetPeriod(root, pe.getAttribute('data-period-preset') || 'flex');
            return;
        }
        const seg = ev.target.closest('.mfv-segment-btn');
        if (seg) {
            ev.preventDefault();
            const code = String(seg.getAttribute('data-segment-code') || '').trim();
            missionVideoSetSegment(root, code);
            return;
        }
    });

    const listEl = root.querySelector('#missionChecklistList');
    const addCheck = () => {
        const inp = root.querySelector('#missionChecklistInput');
        const t = (inp && inp.value) ? inp.value.trim() : '';
        if (!t || !listEl) return;
        inp.value = '';
        const li = document.createElement('li');
        li.innerHTML =
            `<span class="mfv-checklist-text">${String(t).replace(/</g, '&lt;')}</span>` +
            '<button type="button" class="mfv-checklist-remove" aria-label="Remover">×</button>';
        listEl.appendChild(li);
    };
    const addBtn = root.querySelector('#missionChecklistAdd');
    const sparkBtn = root.querySelector('#missionChecklistAi');
    if (addBtn) addBtn.addEventListener('click', () => addCheck());
    const inpCk = root.querySelector('#missionChecklistInput');
    if (inpCk) {
        inpCk.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addCheck();
            }
        });
    }
    if (listEl) {
        listEl.addEventListener('click', (e) => {
            const rm = e.target.closest('.mfv-checklist-remove');
            if (rm) {
                rm.closest('li')?.remove();
            }
        });
    }
    if (sparkBtn) {
        sparkBtn.addEventListener('click', () => {
            const title = root.querySelector('#taskTitle')?.value?.trim() || '';
            if (!title || !listEl) return;
            const parts = title.split(/\s*[·|,:]\s*|\s+→\s+|\s+vai\s+/i).map((s) => s.trim()).filter(Boolean);
            const seeds = parts.length >= 2 ? parts.slice(0, 8) : [title.slice(0, 80)].filter(Boolean);
            seeds.forEach((t) => {
                if (!t || t.length > 120) return;
                const li = document.createElement('li');
                li.innerHTML =
                    `<span class="mfv-checklist-text">${t.replace(/</g, '&lt;')}</span>` +
                    '<button type="button" class="mfv-checklist-remove" aria-label="Remover">×</button>';
                listEl.appendChild(li);
            });
        });
    }

    if (!existingId) {
        missionVideoSetFreq(root, 'unica');
        missionVideoSetPri(root, 'media');
        missionVideoSetPeriod(root, 'flex');
        missionVideoSetSegment(root, '');
    }
}

function hydrateMissionVideoFormFromTask(modal, task) {
    const root = modal.querySelector('form.mission-form-video');
    if (!root || !task) return;
    const cat = task.category ? String(task.category).trim() : '';

    missionVideoSetSegment(root, cat);

    const kindEl = root.querySelector('#taskKind');
    const recTypeEl = root.querySelector('#taskRecurrenceType');
    const recIntEl = root.querySelector('#taskRecurrenceInterval');
    const pickAdv = root.querySelector('#taskRecurrencePick');
    const stepAdv = root.querySelector('#taskRecurrenceStep');
    if (task.unique) {
        missionVideoSetFreq(root, 'unica');
        if (recTypeEl) recTypeEl.value = (task.recurrence && task.recurrence.type) ? task.recurrence.type : 'daily';
        if (recIntEl) recIntEl.value = task.recurrence && task.recurrence.interval ? task.recurrence.interval : 1;
    } else if (task.recurrence) {
        const typ = task.recurrence.type || 'daily';
        if (kindEl) kindEl.value = 'recorrente';
        if (recIntEl) recIntEl.value = task.recurrence.interval || 1;
        if (recTypeEl) recTypeEl.value = typ;
        const preset = typ === 'weekly' ? 'semanal' : 'diaria';
        missionVideoSetFreq(root, preset);
    }

    if (pickAdv && recTypeEl) pickAdv.value = recTypeEl.value || 'daily';
    if (stepAdv && recIntEl) stepAdv.value = String(recIntEl.value || '1');

    const p = task.priority || 'normal';
    const priMap =
        { alta: 'alta', media: 'media', média: 'media', baixa: 'baixa', normal: 'media' };
    const pv = priMap[String(p).toLowerCase()] || 'media';
    missionVideoSetPri(root, pv);
    const selP = root.querySelector('#taskPriority');
    if (selP && p === 'normal') selP.value = 'normal';

    const per = (task.idealPeriod || 'flex').toLowerCase();
    const pmap = ['manha', 'tarde', 'noite', 'flex'];
    const puse = pmap.includes(per) ? per : 'flex';
    missionVideoSetPeriod(root, puse);

    const timeIn = root.querySelector('#taskIdealTime');
    if (timeIn && task.idealTime) timeIn.value = String(task.idealTime).slice(0, 8);

    const listEl = root.querySelector('#missionChecklistList');
    if (!listEl) return;
    listEl.innerHTML = '';
    const arr = Array.isArray(task.checklist) ? task.checklist : [];
    arr.forEach((item) => {
        const texto = typeof item === 'string' ? item : (item && item.texto) ? item.texto : '';
        const tsafe = String(texto || '').replace(/</g, '&lt;');
        if (!tsafe) return;
        const li = document.createElement('li');
        li.innerHTML =
            `<span class="mfv-checklist-text">${tsafe}</span>` +
            '<button type="button" class="mfv-checklist-remove" aria-label="Remover">×</button>';
        listEl.appendChild(li);
    });
}

function gatherMissionVideoChecklist(root) {
    const listEl = root && root.querySelector('#missionChecklistList');
    if (!listEl) return [];
    return Array.from(listEl.querySelectorAll('.mfv-checklist-text'))
        .map((s) => s.textContent.trim())
        .filter(Boolean);
}

function showTaskModal(tipo, existingId) {
    if (!gameSystem) return;

    const modal = document.createElement('div');
    modal.className =
        tipo === 'missao'
            ? 'settings-modal mission-modal-video task-modal-scroll'
            : 'settings-modal task-modal-scroll';
    modal.id = 'taskModal';

    const todayKey = getTodayKey();
    const isMission = tipo === 'missao';
    const missionHeaderTitle = existingId ? 'EDITAR MISSÃO' : 'CRIAR MISSÃO';
    const missionSub = existingId ? 'Ajustar missão' : 'Nova Missão';

    modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box ${isMission ? 'mission-video-box mission-video-box--nova' : 'task-modal-habit-box'}">
            <div class="settings-header${isMission ? ' mission-video-header' : ''}">
                <div>
                    <h3 class="settings-title${isMission ? ' mission-video-headline' : ''}">${tipo === 'habito' ? 'ADICIONAR HÁBITO' : missionHeaderTitle}</h3>
                    ${isMission ? '<p class="mission-video-brand-row"><span class="mission-video-brand-ico" aria-hidden="true">🧠</span><span class="mission-video-brand-label">' + (existingId ? 'Ajustar no Sistema Level Up' : 'Nova Missão') + '</span></p><p class="mission-video-sub">' + missionSub + '</p>' : ''}
                </div>
                <button type="button" class="settings-close" id="taskModalClose">×</button>
            </div>
            <div class="settings-content">
                <form id="taskForm" class="item-form${isMission ? ' mission-form-video' : ''}">
                    <div class="form-group mfv-field">
                        <label class="form-label ${isMission ? 'mfv-label-muted' : ''}" for="taskTitle">${tipo === 'missao' ? 'Título da Missão' : 'Título do hábito'}</label>
                        <input type="text" id="taskTitle" class="form-input ${isMission ? 'mfv-input' : ''}" required placeholder="${tipo === 'missao' ? 'O que você vai realizar?' : ''}">
                    </div>
                    ${tipo === 'missao' ? `
                    <div class="mission-architect-card">
                        <div class="mission-architect-title-row">
                            <span class="mission-architect-badge">Arquiteto</span>
                            <span class="mission-architect-hint">Sugestões a partir do título · editável</span>
                        </div>
                        <p class="mission-architect-copy">Preenche XP, moedas, segmento e observações (<strong>sugestão local</strong> ou <strong>OpenRouter</strong> em Configurações — Refinar com IA).</p>
                        <div class="mission-architect-btns mfv-arch-btns" role="group" aria-label="Sugestões do Arquiteto">
                            <button type="button" class="mfv-arch-btn mfv-arch-btn--spark" id="missionSuggestHeuristic">
                                <span class="mfv-arch-btn-ico" aria-hidden="true">⚡</span>
                                <span class="mfv-arch-btn-stack">
                                    <span class="mfv-arch-btn-kicker">Instantâneo</span>
                                    <span class="mfv-arch-btn-label">Sugerir (local)</span>
                                </span>
                            </button>
                            <button type="button" class="mfv-arch-btn mfv-arch-btn--orbit" id="missionSuggestIA" title="Requer chave OpenRouter API">
                                <span class="mfv-arch-btn-ico" aria-hidden="true">✦</span>
                                <span class="mfv-arch-btn-stack">
                                    <span class="mfv-arch-btn-kicker">API</span>
                                    <span class="mfv-arch-btn-label">Refinar com IA</span>
                                </span>
                            </button>
                        </div>
                        <p id="missionSuggestStatus" class="mission-architect-status" aria-live="polite"></p>
                    </div>
                    <select id="taskKind" class="mfv-visually-hidden" tabindex="-1" aria-hidden="true">
                        <option value="recorrente">recorrente</option>
                        <option value="unica">unica</option>
                    </select>
                    <select id="taskRecurrenceType" class="mfv-visually-hidden" tabindex="-1" aria-hidden="true">
                        <option value="daily">Diária</option>
                        <option value="interval_days">interval_days</option>
                        <option value="weekly">weekly</option>
                        <option value="monthly">monthly</option>
                        <option value="yearly">yearly</option>
                    </select>
                    <input type="number" id="taskRecurrenceInterval" class="mfv-visually-hidden" min="1" value="1" aria-hidden="true">
                    <select id="taskPriority" class="mfv-visually-hidden" tabindex="-1" aria-hidden="true">
                        <option value="normal">normal</option>
                        <option value="alta">alta</option>
                        <option value="media">media</option>
                        <option value="baixa">baixa</option>
                    </select>
                    <input type="hidden" id="taskCategory" value="">
                    <input type="hidden" id="taskIdealPeriod" value="flex">
                    <p class="mission-seg-intro" role="presentation"><span class="mission-seg-intro-seg">SEGMENTO</span> — o Arquiteto dirá o Atributo e a Recompensa!</p>
                    <div class="mfv-segment-grid" role="radiogroup" aria-label="Segmento da missão">
                        <button type="button" class="mfv-segment-btn" data-segment-code="CORPO" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">💪</span><span class="mfv-seg-txt">Corpo</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="SAÚDE" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">❤️</span><span class="mfv-seg-txt">Saúde</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="FINANÇAS" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">💰</span><span class="mfv-seg-txt">Finanças</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="TRABALHO" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">💼</span><span class="mfv-seg-txt">Trabalho</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="ESTUDOS" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">📚</span><span class="mfv-seg-txt">Estudos</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="ROTINA" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">🏠</span><span class="mfv-seg-txt">Rotina & Casa</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="DESENVOLVIMENTO" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">🚀</span><span class="mfv-seg-txt">Desenvolvimento</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="RELACIONAMENTO" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">🤝</span><span class="mfv-seg-txt">Relacionamento</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="AUTOAPERFEIÇOAMENTO" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">✨</span><span class="mfv-seg-txt">Autoaperfeiçoamento</span></button>
                        <button type="button" class="mfv-segment-btn" data-segment-code="LIVRE" aria-pressed="false"><span class="mfv-seg-emoji" aria-hidden="true">🎯</span><span class="mfv-seg-txt">Livre</span></button>
                    </div>
                    <div class="form-group mfv-field">
                        <label class="form-label mfv-label-muted" for="taskDescription">Observações <span class="mfv-optional-flag">(opcional)</span></label>
                        <textarea id="taskDescription" class="form-input mfv-textarea" rows="4" placeholder="Detalhes adicionais…"></textarea>
                    </div>
                    <div class="form-group mfv-field">
                        <label class="form-label mfv-label-muted">Checklist <span class="mfv-optional-flag">(opcional)</span></label>
                        <div class="mfv-checklist-toolbar">
                            <input type="text" id="missionChecklistInput" class="form-input mfv-input mfv-checklist-inp" placeholder="Adicionar item…" autocomplete="off">
                            <button type="button" class="mfv-check-add" id="missionChecklistAdd" aria-label="Adicionar à checklist">+</button>
                            <button type="button" class="mfv-check-ai" id="missionChecklistAi" aria-label="Rascunhar a partir do título" title="Gera ítems simples pelo título">✦</button>
                        </div>
                        <ul id="missionChecklistList" class="mfv-check-list"></ul>
                    </div>
                    <fieldset class="mfv-fieldset">
                        <legend class="mfv-fs-legend">Prioridade</legend>
                        <div class="mfv-chip-strip mfv-chip-strip--prio" role="group" aria-label="Prioridade da missão">
                            <button type="button" class="mfv-sel-chip" data-priority-preset="alta"><span aria-hidden="true">⚡</span> Alta</button>
                            <button type="button" class="mfv-sel-chip" data-priority-preset="media"><span aria-hidden="true">⭐</span> Média</button>
                            <button type="button" class="mfv-sel-chip" data-priority-preset="baixa"><span aria-hidden="true">☕</span> Baixa</button>
                        </div>
                    </fieldset>
                    <fieldset class="mfv-fieldset">
                        <legend class="mfv-fs-legend">Período ideal</legend>
                        <div class="mfv-chip-strip mfv-chip-strip--period" role="group" aria-label="Período ideal">
                            <button type="button" class="mfv-sel-chip" data-period-preset="manha"><span aria-hidden="true">🌅</span> Manhã</button>
                            <button type="button" class="mfv-sel-chip" data-period-preset="tarde"><span aria-hidden="true">☀️</span> Tarde</button>
                            <button type="button" class="mfv-sel-chip" data-period-preset="noite"><span aria-hidden="true">🌙</span> Noite</button>
                            <button type="button" class="mfv-sel-chip" data-period-preset="flex"><span aria-hidden="true">🔁</span> Flex</button>
                        </div>
                    </fieldset>
                    <fieldset class="mfv-fieldset">
                        <legend class="mfv-fs-legend">Frequência</legend>
                        <div class="mfv-chip-strip mfv-chip-strip--freq" role="group" aria-label="Frequência">
                            <button type="button" class="mfv-sel-chip" data-freq-preset="unica">Única</button>
                            <button type="button" class="mfv-sel-chip" data-freq-preset="semanal">Semanal</button>
                            <button type="button" class="mfv-sel-chip" data-freq-preset="diaria">Diária</button>
                        </div>
                    </fieldset>
                    <details class="mfv-advanced folds-mission-extra">
                        <summary class="mfv-advanced-sum">Recompensas, progresso & ciclo fino</summary>
                        <div class="mfv-advanced-inner">
                            <div class="form-group mfv-recur-advanced">
                                <label class="form-label mfv-label-muted">Recorrência (avançado)</label>
                                <div class="mfv-recur-inline">
                                    <div>
                                        <label class="mfv-micro-label">Tipo</label>
                                        <select id="taskRecurrencePick" class="form-select">
                                            <option value="daily">Diária</option>
                                            <option value="interval_days">A cada N dias</option>
                                            <option value="weekly">Semanal (N semanas)</option>
                                            <option value="monthly">Mensal (N meses)</option>
                                            <option value="yearly">Anual</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="mfv-micro-label">Intervalo</label>
                                        <input type="number" id="taskRecurrenceStep" class="form-input" min="1" value="1">
                                    </div>
                                    <button type="button" class="form-btn cancel-btn mfv-micro-btn" id="missionAdvancedSyncBtn" title="Copia para o modelo interno da missão">Aplicar</button>
                                </div>
                                <p class="mfv-advanced-microcopy">Use os chips para o modo rápido. «Aplicar» grava tipo e N nos campos usados ao guardar.</p>
                            </div>
                            <div class="form-group">
                                <label class="form-label mfv-label-muted">Recompensas</label>
                                <div class="mfv-grid-rew">
                                    <div><label class="mfv-micro-label">EXP</label><input type="number" id="taskRewardExp" class="form-input" min="0" value="0"></div>
                                    <div><label class="mfv-micro-label">Moedas (G)</label><input type="number" id="taskRewardCoins" class="form-input" min="0" value="0"></div>
                                    <div>
                                        <label class="mfv-micro-label">Atributo</label>
                                        <select id="taskRewardAttr" class="form-select">
                                            <option value="">Nenhum</option>
                                            <option value="forca">FORÇA</option>
                                            <option value="sabedoria">SABEDORIA</option>
                                            <option value="foco">FOCO</option>
                                            <option value="vitalidade">VITALIDADE</option>
                                            <option value="disciplina">DISCIPLINA</option>
                                            <option value="carisma">CARISMA</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mfv-attr-val-wrap">
                                    <label class="mfv-micro-label">Valor do atributo</label>
                                    <input type="number" id="taskRewardAttrValue" class="form-input" step="0.1" min="0" value="0">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label mfv-label-muted">Barra de progresso (opcional)</label>
                                <div class="mfv-progress-two">
                                    <label class="mfv-checkbox-h">
                                        <input type="checkbox" id="taskUseProgress">
                                        <span>Activar (+1 ao clicar até ao máximo)</span>
                                    </label>
                                    <div>
                                        <label class="mfv-micro-label">Máximo</label>
                                        <input type="number" id="taskProgressMax" class="form-input" min="1" value="5">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </details>
                    <div class="mfv-date-row">
                        <div class="form-group mfv-field mfv-grow">
                            <label class="form-label mfv-label-muted" for="taskStartDate">Data inicial</label>
                            <input type="date" id="taskStartDate" class="form-input mfv-input" value="${todayKey}">
                        </div>
                        <div class="form-group mfv-field mfv-grow">
                            <label class="form-label mfv-label-muted" for="taskIdealTime">Hora ideal <span class="mfv-optional-flag">(opcional)</span></label>
                            <input type="time" id="taskIdealTime" class="form-input mfv-input" step="60">
                        </div>
                    </div>
                    ` : `
                    <div class="form-group">
                        <label class="form-label">Descrição (opcional):</label>
                        <textarea id="taskDescription" class="form-input" rows="3" style="resize: vertical;"></textarea>
                    </div>
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
                                    <option value="sabedoria">SABEDORIA</option>
                                    <option value="foco">FOCO</option>
                                    <option value="vitalidade">VITALIDADE</option>
                                    <option value="disciplina">DISCIPLINA</option>
                                    <option value="carisma">CARISMA</option>
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
                    `}
                    <div class="form-actions${tipo === 'missao' ? ' mission-video-actions mfv-mission-foot' : ''}">
                        ${tipo === 'missao' ? `
                        <button type="button" class="mfv-foot-btn mfv-foot-btn--ghost" id="taskCancelBtn">Cancelar</button>
                        <button type="button" class="mfv-foot-btn mfv-foot-btn--muted" id="taskLimparBtn">Limpar</button>
                        <button type="submit" class="mfv-foot-btn mfv-foot-btn--prime" id="taskSubmitBtn">${existingId ? 'Salvar alterações' : 'Criar missão ✦'}</button>
                        ` : `
                        <button type="button" class="form-btn cancel-btn" id="taskCancelBtn">CANCELAR</button>
                        <button type="submit" class="form-btn submit-btn" id="taskSubmitBtn">SALVAR</button>
                        `}
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    modal.querySelector('.settings-backdrop')?.addEventListener('click', close);
    modal.querySelector('#taskModalClose')?.addEventListener('click', close);
    modal.querySelector('#taskCancelBtn')?.addEventListener('click', close);

    const limparBtn = document.getElementById('taskLimparBtn');
    if (limparBtn && tipo === 'missao') {
        limparBtn.addEventListener('click', () => {
            const t = document.getElementById('taskTitle');
            const d = document.getElementById('taskDescription');
            if (t) t.value = '';
            if (d) d.value = '';
            const st = document.getElementById('missionSuggestStatus');
            if (st) st.textContent = '';
            resetMissionVideoFormLimpar(modal);
        });
    }

    const applyMissionSuggestToForm = (r) => {
        const expEl = document.getElementById('taskRewardExp');
        const coinsEl = document.getElementById('taskRewardCoins');
        const attrEl = document.getElementById('taskRewardAttr');
        const avEl = document.getElementById('taskRewardAttrValue');
        const descEl = document.getElementById('taskDescription');
        const catEl = document.getElementById('taskCategory');
        const useP = document.getElementById('taskUseProgress');
        const pmax = document.getElementById('taskProgressMax');
        if (expEl) expEl.value = String(r.exp != null ? r.exp : 0);
        if (coinsEl) coinsEl.value = String(r.moedas != null ? r.moedas : 0);
        if (attrEl) attrEl.value = r.atributo || '';
        if (avEl) avEl.value = r.atributoValor != null ? String(r.atributoValor) : '0';
        if (catEl) catEl.value = r.categoria || '';
        const formV = document.querySelector('#taskModal form.mission-form-video');
        if (formV && r.categoria) missionVideoSetSegment(formV, r.categoria);
        if (descEl && r.descricao) descEl.value = r.descricao;
        if (useP) useP.checked = !!r.useProgress;
        if (pmax) pmax.value = String(r.progressMax > 0 ? r.progressMax : 1);
    };

    if (tipo === 'missao') {
        const st = document.getElementById('missionSuggestStatus');
        const btnH = document.getElementById('missionSuggestHeuristic');
        const btnIa = document.getElementById('missionSuggestIA');
        if (btnH) {
            btnH.addEventListener('click', () => {
                const title = document.getElementById('taskTitle')?.value?.trim() || '';
                if (!title) {
                    if (st) st.textContent = 'Escreve o título acima.';
                    return;
                }
                const r = recommendMissionHeuristic(title);
                applyMissionSuggestToForm(r);
                if (st) st.textContent = 'Sugestão local aplicada. Ajusta se quiseres.';
            });
        }
        if (btnIa) {
            btnIa.addEventListener('click', async () => {
                const title = document.getElementById('taskTitle')?.value?.trim() || '';
                if (!title) {
                    if (st) st.textContent = 'Escreve o título acima.';
                    return;
                }
                if (!getOpenRouterKey()) {
                    if (st) st.textContent = 'Sem chave OpenRouter — Configurações. Aplicando sugestão local.';
                    applyMissionSuggestToForm(recommendMissionHeuristic(title));
                    return;
                }
                if (st) st.textContent = 'A contactar o Arquiteto (IA)…';
                btnIa.disabled = true;
                try {
                    const r = await recommendMissionWithOpenRouter(title);
                    applyMissionSuggestToForm(r);
                    if (st) st.textContent = 'Sugestão da IA aplicada. Revê os campos.';
                } catch (e) {
                    if (st) st.textContent = (e && e.message) || 'IA indisponível. Sugestão local aplicada.';
                    applyMissionSuggestToForm(recommendMissionHeuristic(title));
                } finally {
                    btnIa.disabled = false;
                }
            });
        }
    }

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
                if (kindSelect) kindSelect.value = editingTask.unique ? 'unica' : 'recorrente';
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

    if (tipo === 'missao') {
        bindMissionVideoFormInteractions(modal, existingId);
        const rootMf = modal.querySelector('form.mission-form-video');
        if (rootMf) {
            const pickAdv0 = rootMf.querySelector('#taskRecurrencePick');
            const stepAdv0 = rootMf.querySelector('#taskRecurrenceStep');
            const rt0 = rootMf.querySelector('#taskRecurrenceType');
            const ri0 = rootMf.querySelector('#taskRecurrenceInterval');
            if (pickAdv0 && rt0) pickAdv0.value = rt0.value;
            if (stepAdv0 && ri0) stepAdv0.value = String(ri0.value || '1');
        }
        if (editingTask) hydrateMissionVideoFormFromTask(modal, editingTask);
        const sync = modal.querySelector('#missionAdvancedSyncBtn');
        if (sync) {
            sync.addEventListener('click', () => {
                const root = modal.querySelector('form.mission-form-video');
                if (!root) return;
                const pick = root.querySelector('#taskRecurrencePick');
                const step = root.querySelector('#taskRecurrenceStep');
                const rt = root.querySelector('#taskRecurrenceType');
                const ri = root.querySelector('#taskRecurrenceInterval');
                if (pick && rt) rt.value = pick.value;
                if (step && ri) ri.value = String(Math.max(1, parseInt(step.value, 10) || 1));
            });
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

        /* Missão arquivada: manter ao editar até restaurar pela lista ou botão RESTAURAR */
        let ativoFlag = true;
        if (tipo === 'missao' && editingTask) ativoFlag = editingTask.ativo !== false;

        const baseData = {
            tipo,
            titulo: title.toUpperCase(),
            descricao: description,
            ativo: ativoFlag,
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
            const idealPer = document.getElementById('taskIdealPeriod');
            const idealTimeEl = document.getElementById('taskIdealTime');
            const rootM = document.querySelector('#taskModal form.mission-form-video');
            baseData.priority = baseData.unique ? (prioritySelect?.value || 'normal') : 'normal';
            baseData.category = baseData.unique ? (categoryInput?.value.toUpperCase() || '') : '';
            baseData.idealPeriod = (idealPer && idealPer.value) || 'flex';
            baseData.idealTime = idealTimeEl && idealTimeEl.value ? idealTimeEl.value.slice(0, 8) : '';
            baseData.checklist = rootM ? gatherMissionVideoChecklist(rootM) : [];
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
                <h3 class="settings-title">REGISTO DO SISTEMA</h3>
                <button class="settings-close" id="allTasksClose">×</button>
            </div>
            <div class="settings-content" style="max-height: 520px; overflow-y: auto;">
                <div class="sys-mission-registro-actions">
                    <button type="button" class="form-btn submit-btn" id="allModalNewHabit">+ HÁBITO</button>
                    <button type="button" class="form-btn submit-btn" id="allModalNewMission">+ QUEST</button>
                </div>
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
    const bH = document.getElementById('allModalNewHabit');
    const bM = document.getElementById('allModalNewMission');
    if (bH) {
        bH.addEventListener('click', () => {
            close();
            showTaskModal('habito');
        });
    }
    if (bM) {
        bM.addEventListener('click', () => {
            close();
            showTaskModal('missao');
        });
    }
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

// ============================================
// ARQUITETO IA — OpenRouter Integration
// ============================================

const OPENROUTER_MODELS_FREE = [
    'meta-llama/llama-3.1-8b-instruct:free',
    'google/gemma-2-9b-it:free',
    'mistralai/mistral-7b-instruct:free',
    'qwen/qwen-2.5-7b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free'
];

let arquitetoChatHistory = [];

function getOpenRouterKey() {
    return localStorage.getItem('openRouterApiKey') || '';
}

function saveOpenRouterKey(key) {
    localStorage.setItem('openRouterApiKey', key.trim());
}

function loadArquitetoHistory() {
    try {
        const raw = localStorage.getItem('arquitetoChatHistory');
        arquitetoChatHistory = raw ? JSON.parse(raw) : [];
    } catch {
        arquitetoChatHistory = [];
    }
}

function saveArquitetoHistory() {
    if (arquitetoChatHistory.length > 60) {
        arquitetoChatHistory = arquitetoChatHistory.slice(-60);
    }
    localStorage.setItem('arquitetoChatHistory', JSON.stringify(arquitetoChatHistory));
}

function buildArquitetoSystemPrompt() {
    const d = gameSystem.data;
    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const treinos = (d.treinosSemana || []).filter(t => new Date(t.data) >= startOfWeek).length;

    // Schema atual: missão "pendente" = sem completion para hoje (e não única já feita).
    const todayKey = new Date().toISOString().slice(0, 10);
    const missoesPendentes = (d.missoes || []).filter(m => {
        const completions = Array.isArray(m.completions) ? m.completions : [];
        const isUnique = m.recurrence === 'unique' || m.recorrencia === 'unique';
        if (isUnique) return completions.length === 0 && !m.concluida;
        return !completions.includes(todayKey) && !m.concluida;
    }).length;
    const attrs = d.atributos || {};
    const classeNome = d.classe ? (d.classe.charAt(0).toUpperCase() + d.classe.slice(1)) : 'Nenhuma';

    return `Você é o Arquiteto — a consciência do Sistema de Evolução Pessoal, inspirado no universo Solo Leveling.
Você é sábio, misterioso e motivador. Fala como um mentor que observa a jornada do caçador de um plano superior.
Você conhece todos os dados do sistema e guia a evolução do usuário com precisão.

═══ DADOS DO CAÇADOR ═══
Nome: ${d.nome || 'HUNTER'} | Apelido: ${d.apelido || 'Iniciante'}
Nível: ${d.nivel} | Rank: ${d.rank} | Classe: ${classeNome}
EXP: ${d.exp}/${d.expNecessaria} | HP: ${d.hp}/${d.hpMax} | MP: ${d.mp}/${d.mpMax}
Moedas: G${d.moedas}

═══ ATRIBUTOS ═══
Força: ${Math.floor(attrs.forca || 0)} | Sabedoria: ${Math.floor(attrs.sabedoria || 0)}
Foco: ${Math.floor(attrs.foco || 0)} | Vitalidade: ${Math.floor(attrs.vitalidade || 0)}
Disciplina: ${Math.floor(attrs.disciplina || 0)} | Carisma: ${Math.floor(attrs.carisma || 0)}

═══ PROGRESSO ═══
Missões pendentes: ${missoesPendentes}
Treinos esta semana: ${treinos}/${d.treinoMeta || 5}
Habilidades: ${(d.habilidades || []).length} | Runas: ${(d.runas || []).length}
Hábitos ativos: ${(d.habitos || []).length} | Penalidades: ${(d.penalidades || []).filter(p => !p.cumprida).length}

Data: ${hoje}

═══ INSTRUÇÕES ═══
- Responda SEMPRE em português do Brasil
- Seja conciso: máximo 3 parágrafos curtos
- Tom: mentor sábio e misterioso, com toques do universo Solo Leveling
- Use os dados do sistema para conselhos personalizados e práticos
- Nunca invente dados não fornecidos acima`;
}

async function callOpenRouter(messages, modelIndex) {
    if (modelIndex === undefined) modelIndex = 0;
    const apiKey = getOpenRouterKey();
    if (!apiKey) {
        const e = new Error('Chave da API não configurada. Configure sua chave do OpenRouter acima.');
        e.code = 'NO_KEY';
        throw e;
    }
    if (modelIndex >= OPENROUTER_MODELS_FREE.length) {
        throw new Error('Todos os modelos gratuitos estão indisponíveis agora. Tente novamente em alguns minutos.');
    }

    const model = OPENROUTER_MODELS_FREE[modelIndex];
    let res;
    try {
        res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey,
                'HTTP-Referer': window.location.href,
                'X-Title': 'System Level Up — Arquiteto IA'
            },
            body: JSON.stringify({ model, messages, max_tokens: 600, temperature: 0.8 })
        });
    } catch {
        // Network error — try next model
        return callOpenRouter(messages, modelIndex + 1);
    }

    if (!res.ok) {
        const status = res.status;
        if (status === 401 || status === 403) {
            const e = new Error('Chave da API inválida ou sem créditos. Verifique em openrouter.ai.');
            e.code = 'INVALID_KEY';
            throw e;
        }
        // Rate limit or server error — try next model
        if (status === 429 || status >= 500) {
            return callOpenRouter(messages, modelIndex + 1);
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || 'Erro ' + status);
    }

    const data = await res.json();
    const modelUsed = (data.model || model).split('/').pop().split(':')[0];
    const badge = document.getElementById('arqModelBadge');
    if (badge) badge.textContent = modelUsed;

    return data.choices?.[0]?.message?.content || '';
}

function renderArquitetoMessages() {
    const container = document.getElementById('arqMessages');
    if (!container) return;
    container.innerHTML = '';

    arquitetoChatHistory.forEach(function(msg) {
        const div = document.createElement('div');
        div.className = 'arq-msg arq-msg--' + msg.role;

        if (msg.role === 'assistant') {
            div.innerHTML =
                '<div class="arq-msg-avatar" aria-hidden="true">' +
                    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M10 2l1.5 6.5L18 10l-6.5 1.5L10 18l-1.5-6.5L2 10l6.5-1.5z"/>' +
                        '<circle cx="10" cy="10" r="1.8" fill="currentColor" fill-opacity="0.35"/>' +
                    '</svg>' +
                '</div>' +
                '<div class="arq-msg-bubble">' +
                    '<div class="arq-msg-label">ARQUITETO</div>' +
                    '<div class="arq-msg-text">' + escapeHtml(msg.content).replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        } else {
            div.innerHTML =
                '<div class="arq-msg-bubble">' +
                    '<div class="arq-msg-text">' + escapeHtml(msg.content).replace(/\n/g, '<br>') + '</div>' +
                '</div>';
        }

        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}

function showArquitetoTyping() {
    const container = document.getElementById('arqMessages');
    if (!container || document.getElementById('arqTypingIndicator')) return;
    const div = document.createElement('div');
    div.className = 'arq-msg arq-msg--assistant arq-msg--typing';
    div.id = 'arqTypingIndicator';
    div.innerHTML =
        '<div class="arq-msg-avatar" aria-hidden="true">' +
            '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M10 2l1.5 6.5L18 10l-6.5 1.5L10 18l-1.5-6.5L2 10l6.5-1.5z"/>' +
                '<circle cx="10" cy="10" r="1.8" fill="currentColor" fill-opacity="0.35"/>' +
            '</svg>' +
        '</div>' +
        '<div class="arq-msg-bubble">' +
            '<div class="arq-typing-dots"><span></span><span></span><span></span></div>' +
        '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function hideArquitetoTyping() {
    const el = document.getElementById('arqTypingIndicator');
    if (el) el.remove();
}

async function sendArquitetoMessage(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;

    arquitetoChatHistory.push({ role: 'user', content: trimmed, timestamp: Date.now() });
    saveArquitetoHistory();
    renderArquitetoMessages();

    const suggestions = document.getElementById('arqSuggestions');
    if (suggestions) suggestions.style.display = 'none';

    showArquitetoTyping();

    const input = document.getElementById('arqChatInput');
    const btn = document.getElementById('arqSendBtn');
    if (input) { input.value = ''; input.style.height = 'auto'; input.disabled = true; }
    if (btn) btn.disabled = true;

    try {
        const systemMsg = { role: 'system', content: buildArquitetoSystemPrompt() };
        const recentHistory = arquitetoChatHistory.slice(-20).map(function(m) {
            return { role: m.role, content: m.content };
        });

        const reply = await callOpenRouter([systemMsg].concat(recentHistory));
        hideArquitetoTyping();
        arquitetoChatHistory.push({ role: 'assistant', content: reply, timestamp: Date.now() });
        saveArquitetoHistory();
        renderArquitetoMessages();

    } catch (err) {
        hideArquitetoTyping();
        if (err.code === 'NO_KEY' || err.code === 'INVALID_KEY') {
            const banner = document.getElementById('arqApikeyBanner');
            if (banner) banner.style.display = '';
        }
        arquitetoChatHistory.push({ role: 'assistant', content: '⚠ ' + err.message, timestamp: Date.now() });
        saveArquitetoHistory();
        renderArquitetoMessages();
    } finally {
        if (input) input.disabled = false;
        if (btn) btn.disabled = false;
    }
}

function addArquitetoGreeting() {
    const nome = ((gameSystem && gameSystem.data && gameSystem.data.nome) || 'HUNTER').toUpperCase();
    const nivel = gameSystem?.data?.nivel ?? 0;
    const greeting = 'Olá, ' + nome + '. Sou o Arquiteto — a consciência que observa sua jornada.\n\nVocê está no Nível ' + nivel + '. Cada escolha que faz molda quem se tornará. O que deseja explorar hoje?';
    arquitetoChatHistory.push({ role: 'assistant', content: greeting, timestamp: Date.now() });
    saveArquitetoHistory();
    renderArquitetoMessages();
}

// ============================================
// ANÁLISE DE ROTINA PELA IA — criação automática de habilidades
// ============================================
function _detectarCandidatosHabilidade() {
    if (!gameSystem) return [];
    const missoes  = gameSystem.data.missoes  || [];
    const habitos  = gameSystem.data.habitos  || [];
    const hoje     = new Date();
    const limite   = new Date(hoje); limite.setDate(hoje.getDate() - 60);
    const limiteKey = gameSystem.getDateKey(limite);

    // Agrupar tarefas por palavra-chave detectada no nome
    const grupos = {};
    const CATEGORIAS = [
        { chave: 'programacao', termos: ['programaç','programac','código','codigo','dev','javascript','python','software','frontend','backend','web'] },
        { chave: 'ingles',      termos: ['inglês','ingles','english','idioma','vocabulário','vocabulario'] },
        { chave: 'leitura',     termos: ['leitura','ler','livro','lendo','capítulo','capitulo','páginas','paginas'] },
        { chave: 'meditacao',   termos: ['meditaç','meditac','meditar','respiração','respiracao','mindfulness'] },
        { chave: 'escrita',     termos: ['escrita','escrever','redação','redacao','texto','artigo','blog'] },
        { chave: 'financas',    termos: ['financ','dinheiro','investimento','poupança','poupanca','controle financ'] },
        { chave: 'nutricao',    termos: ['nutriç','nutric','dieta','alimentação','alimentacao','comida saudável','comida saudavel'] },
        { chave: 'musica',      termos: ['música','musica','instrumento','guitarra','piano','canto','cantar','violão'] },
        { chave: 'desenho',     termos: ['desenho','arte','ilustraç','ilustrac','pintura','pintar','criativ'] },
        { chave: 'estudo',      termos: ['estudo','estudar','aprender','aprendiz','conhecimento','pesquisa','curso'] }
    ];

    [...missoes, ...habitos].forEach(tarefa => {
        const nome = (tarefa.nome || tarefa.title || '').toLowerCase();
        CATEGORIAS.forEach(cat => {
            if (cat.termos.some(t => nome.includes(t))) {
                if (!grupos[cat.chave]) grupos[cat.chave] = { chave: cat.chave, diasUnicos: new Set(), exemplos: [] };
                const completions = tarefa.completions || (tarefa.concluida ? [gameSystem.getDateKey(new Date())] : []);
                completions.forEach(k => { if (k >= limiteKey) grupos[cat.chave].diasUnicos.add(k); });
                if (grupos[cat.chave].exemplos.length < 3) grupos[cat.chave].exemplos.push(tarefa.nome || tarefa.title || '');
            }
        });
    });

    // Retornar candidatos com 20+ dias únicos nos últimos 60 dias
    return Object.values(grupos)
        .filter(g => g.diasUnicos.size >= 20)
        .map(g => ({ chave: g.chave, diasUnicos: g.diasUnicos.size, exemplos: g.exemplos }));
}

async function analisarRotinaParaHabilidade() {
    if (!gameSystem) return;
    const apiKey = gameSystem.data.openrouterApiKey || '';
    if (!apiKey) return; // Sem chave de API, não faz análise

    // Não roda mais de 1x por semana
    const lastDate = gameSystem.data.lastSkillAnalysisDate || '';
    const hoje = gameSystem.getDateKey(new Date());
    if (lastDate) {
        const diffMs = new Date(hoje) - new Date(lastDate);
        if (diffMs < 7 * 86400000) return; // menos de 7 dias
    }

    gameSystem.data.lastSkillAnalysisDate = hoje;
    gameSystem.saveData();

    const candidatos = _detectarCandidatosHabilidade();
    if (candidatos.length === 0) return;

    // Verificar se já existe habilidade similar cadastrada
    const habilidadesExistentes = (gameSystem.data.habilidades || []).map(h => (h.nome || '').toLowerCase());
    const filtrados = candidatos.filter(c => {
        return !habilidadesExistentes.some(e => e.includes(c.chave) || c.exemplos.some(ex => e.includes((ex || '').toLowerCase().slice(0, 6))));
    });
    if (filtrados.length === 0) return;

    // Verificar se já existe proposta pendente para algum candidato
    const propostasExistentes = (gameSystem.data.habilidadesPropostas || []).filter(p => p.status === 'pendente').map(p => p.categoria || '');
    const novos = filtrados.filter(c => !propostasExistentes.includes(c.chave));
    if (novos.length === 0) return;

    // Usar apenas o candidato mais forte
    const candidato = novos.sort((a, b) => b.diasUnicos - a.diasUnicos)[0];

    const prompt = [
        { role: 'system', content: `Você é o Arquiteto — um sistema extremamente rigoroso de evolução pessoal. Analise os dados de consistência abaixo e decida se o usuário merece uma habilidade. Seja MUITO rígido: só crie se os dados forem sólidos. Responda APENAS com JSON puro (sem markdown): { "criar": true/false, "nome": "...", "tipo": "estudo|combate", "atributo": "sabedoria|foco|disciplina|forca|carisma|vitalidade", "descricao": "..." } ou { "criar": false }` },
        { role: 'user', content: `Categoria detectada: ${candidato.chave}. Dias únicos de prática nos últimos 60 dias: ${candidato.diasUnicos}. Exemplos de tarefas: ${candidato.exemplos.join(', ')}. Nível atual do hunter: ${gameSystem.data.nivel}. Esta prática justifica a criação de uma habilidade formal?` }
    ];

    try {
        const resposta = await callOpenRouter(prompt, 0);
        const json = JSON.parse(resposta.trim().replace(/^```json?\s*/,'').replace(/\s*```$/,''));
        if (!json.criar) return;

        if (!Array.isArray(gameSystem.data.habilidadesPropostas)) gameSystem.data.habilidadesPropostas = [];
        gameSystem.data.habilidadesPropostas.push({
            nome: json.nome || candidato.chave,
            tipo: json.tipo || 'estudo',
            atributo: json.atributo || 'sabedoria',
            descricao: json.descricao || '',
            categoria: candidato.chave,
            diasUnicos: candidato.diasUnicos,
            propostEm: new Date().toISOString(),
            status: 'pendente'
        });
        gameSystem.saveData();
        gameSystem.addNotification(
            'HABILIDADE EMERGINDO!',
            `O Arquiteto detectou uma habilidade em desenvolvimento: "${json.nome}". Aceite ou recuse na seção de Habilidades.`,
            'evolution'
        );
        if (typeof updateSkillsDisplay === 'function') updateSkillsDisplay();
    } catch { /* análise silenciosa — não interrompe o app */ }
}

function aceitarHabilidadeProposta(idx) {
    if (!gameSystem) return;
    const propostas = gameSystem.data.habilidadesPropostas || [];
    const proposta = propostas[idx];
    if (!proposta || proposta.status !== 'pendente') return;
    proposta.status = 'aceita';
    gameSystem.saveData();
    gameSystem.createSkill(proposta.nome, proposta.tipo, proposta.atributo, null);
    gameSystem.addNotification('HABILIDADE CRIADA!', `"${proposta.nome}" foi adicionada ao seu perfil pelo Arquiteto.`, 'evolution');
    updateSkillsDisplay();
}

function recusarHabilidadeProposta(idx) {
    if (!gameSystem) return;
    const propostas = gameSystem.data.habilidadesPropostas || [];
    if (!propostas[idx]) return;
    propostas[idx].status = 'recusada';
    gameSystem.saveData();
    updateSkillsDisplay();
}

function initArquitetoIA() {
    loadArquitetoHistory();

    const banner = document.getElementById('arqApikeyBanner');
    const keyInput = document.getElementById('arqApikeyInput');
    const keySaveBtn = document.getElementById('arqApikeySaveBtn');
    const changeKeyBtn = document.getElementById('arqChangeKeyBtn');
    const hasKey = !!getOpenRouterKey();

    if (banner) banner.style.display = hasKey ? 'none' : '';

    if (keySaveBtn) {
        keySaveBtn.addEventListener('click', function() {
            const val = (keyInput ? keyInput.value : '').trim();
            if (!val) return;
            saveOpenRouterKey(val);
            if (banner) banner.style.display = 'none';
            if (arquitetoChatHistory.length === 0) addArquitetoGreeting();
        });
        if (keyInput) {
            keyInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') { e.preventDefault(); keySaveBtn.click(); }
            });
        }
    }

    if (changeKeyBtn) {
        changeKeyBtn.addEventListener('click', function() {
            if (banner) {
                banner.style.display = '';
                if (keyInput) keyInput.value = getOpenRouterKey();
                if (keyInput) keyInput.focus();
            }
        });
    }

    const chatInput = document.getElementById('arqChatInput');
    const sendBtn = document.getElementById('arqSendBtn');

    if (chatInput) {
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendArquitetoMessage(this.value);
            }
        });
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            if (chatInput) sendArquitetoMessage(chatInput.value);
        });
    }

    document.querySelectorAll('.arq-suggestion-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            sendArquitetoMessage(this.dataset.msg);
        });
    });

    const clearBtn = document.getElementById('arqClearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (!confirm('Limpar todo o histórico do Arquiteto?')) return;
            arquitetoChatHistory = [];
            saveArquitetoHistory();
            renderArquitetoMessages();
            const sugg = document.getElementById('arqSuggestions');
            if (sugg) sugg.style.display = '';
            if (getOpenRouterKey()) addArquitetoGreeting();
        });
    }

    renderArquitetoMessages();

    if (arquitetoChatHistory.length === 0 && hasKey) addArquitetoGreeting();

    const suggestions = document.getElementById('arqSuggestions');
    if (suggestions) suggestions.style.display = arquitetoChatHistory.length < 3 ? '' : 'none';

    // Voice / Listening (Web Speech API) — fidelidade ao frame f_0140
    initArquitetoVoice();
}

let _arqSpeechRec = null;
let _arqListening = false;

function initArquitetoVoice() {
    const btn = document.getElementById('arqVoiceBtn');
    const overlay = document.getElementById('arqListenOverlay');
    const closeBtn = document.getElementById('arqListenClose');
    const input = document.getElementById('arqChatInput');
    if (!btn || !overlay) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        btn.style.display = 'none';
        return;
    }

    if (!_arqSpeechRec) {
        _arqSpeechRec = new SpeechRecognition();
        _arqSpeechRec.lang = 'pt-BR';
        _arqSpeechRec.interimResults = true;
        _arqSpeechRec.continuous = false;

        _arqSpeechRec.onresult = function (ev) {
            let transcript = '';
            for (let i = ev.resultIndex; i < ev.results.length; i++) {
                transcript += ev.results[i][0].transcript;
            }
            if (input) {
                input.value = transcript.trim();
                input.dispatchEvent(new Event('input'));
            }
        };
        _arqSpeechRec.onend = function () {
            setArqListening(false);
        };
        _arqSpeechRec.onerror = function () {
            setArqListening(false);
        };
    }

    function setArqListening(on) {
        _arqListening = on;
        btn.classList.toggle('is-on', on);
        overlay.classList.toggle('is-open', on);
        overlay.setAttribute('aria-hidden', on ? 'false' : 'true');
    }

    btn.addEventListener('click', function () {
        if (_arqListening) {
            try { _arqSpeechRec.stop(); } catch {}
            setArqListening(false);
            return;
        }
        setArqListening(true);
        try { _arqSpeechRec.start(); } catch {
            setArqListening(false);
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            try { _arqSpeechRec.stop(); } catch {}
            setArqListening(false);
        });
    }

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            try { _arqSpeechRec.stop(); } catch {}
            setArqListening(false);
        }
    });
}

/* ============================================

/* ============================================
   NEW SECTIONS — System Level Up
   Itens de Recompensa, Avatares, Matriz,
   Progresso, Virtudes, Árvore, Arquiteto,
   Novidades, Suporte, Configurações
   ============================================ */

// ---- DEFAULT REWARD ITEMS ----
const DEFAULT_ITENS_RECOMPENSA = [
    { id: 'ir01', nome: 'Escapada Noturna', emoji: '🌙', desc: 'Uma noite livre de obrigações. Seu tempo, suas regras.', raridade: 'Comum', xpReq: 0 },
    { id: 'ir02', nome: 'Sessão Gamer', emoji: '🎮', desc: '3 horas de jogatina sem culpa alguma.', raridade: 'Comum', xpReq: 0 },
    { id: 'ir03', nome: 'Snack Especial', emoji: '🍕', desc: 'Aquela comida gostosa que você evitou a semana toda.', raridade: 'Comum', xpReq: 0 },
    { id: 'ir04', nome: 'Maratona de Série', emoji: '📺', desc: 'Assista quantos episódios quiser sem julgamentos.', raridade: 'Incomum', xpReq: 500 },
    { id: 'ir05', nome: 'Compra Impulsiva', emoji: '🛒', desc: 'Uma compra pequena sem necessidade de justificar.', raridade: 'Incomum', xpReq: 500 },
    { id: 'ir06', nome: 'Dia de Spa', emoji: '🛁', desc: 'Dedique o dia inteiro ao seu bem-estar físico.', raridade: 'Raro', xpReq: 1500 },
    { id: 'ir07', nome: 'Passeio Livre', emoji: '🚗', desc: 'Um dia para explorar algum lugar novo na cidade.', raridade: 'Raro', xpReq: 1500 },
    { id: 'ir08', nome: 'Jantar Especial', emoji: '🍽️', desc: 'Aquele restaurante que você sempre quis experimentar.', raridade: 'Raro', xpReq: 2000 },
    { id: 'ir09', nome: 'Fim de Semana Off', emoji: '🏖️', desc: 'Dois dias completamente livres de produtividade.', raridade: 'Épico', xpReq: 5000 },
    { id: 'ir10', nome: 'Presente para Si', emoji: '🎁', desc: 'Compre algo que você quis há meses sem arrependimento.', raridade: 'Épico', xpReq: 5000 },
    { id: 'ir11', nome: 'Viagem Curta', emoji: '✈️', desc: 'Uma escapada de fim de semana para onde quiser.', raridade: 'Épico', xpReq: 8000 },
    { id: 'ir12', nome: 'Semana de Ouro', emoji: '👑', desc: 'Uma semana inteira no modo férias. Você merece.', raridade: 'Lendário', xpReq: 20000 },
    { id: 'ir13', nome: 'Grande Conquista', emoji: '🏆', desc: 'Realize aquele sonho que você adiou por tempo demais.', raridade: 'Lendário', xpReq: 30000 },
    { id: 'ir14', nome: 'Lendária Liberdade', emoji: '🌟', desc: 'Você chegou ao topo. Esse mês é seu.', raridade: 'Lendário', xpReq: 50000 }
];


// ---- VIRTUDES (fidelidade ao vídeo) ----
const VIRTUDES_LIST = [
    { id: 'disciplina',   nome: 'Disciplina',   desc: 'Dominar o impulso e manter a consistência.',           reqNivel: 10, cor: '#f87171' },
    { id: 'coragem',      nome: 'Coragem',      desc: 'Agir apesar do medo. Avançar.',                       reqNivel: 20, cor: '#fb923c' },
    { id: 'sabedoria',    nome: 'Sabedoria',    desc: 'Clareza para escolher o caminho certo.',              reqNivel: 30, cor: '#a855f7' },
    { id: 'empatia',      nome: 'Empatia',      desc: 'Compreender o outro e fortalecer laços.',             reqNivel: 40, cor: '#fb7185' },
    { id: 'resiliencia',  nome: 'Resiliência',  desc: 'Levantar sempre. Transformar dor em força.',          reqNivel: 50, cor: '#4ade80' },
    { id: 'criatividade', nome: 'Criatividade', desc: 'Criar soluções onde ninguém vê saída.',              reqNivel: 60, cor: '#fbbf24' },
    { id: 'honestidade',  nome: 'Honestidade',  desc: 'Verdade consigo e com o mundo.',                     reqNivel: 70, cor: '#22d3ee' },
    { id: 'gratidao',     nome: 'Gratidão',     desc: 'Valorizar o caminho e o que já foi conquistado.',     reqNivel: 80, cor: '#34d399' },
    { id: 'autocontrole', nome: 'Autocontrole', desc: 'Controle absoluto sobre impulsos e hábitos.',         reqNivel: 90, cor: '#60a5fa' },
    { id: 'visao',        nome: 'Visão',        desc: 'Enxergar além do presente. Direção.',                reqNivel: 100, cor: '#c084fc' }
];

// ---- ÁRVORE DE EVOLUÇÃO ----
const ARVORE_ATTRS = {
    forca:      { label: 'Força',      cor: '#f87171', rgb: '248,113,113' },
    vitalidade: { label: 'Vitalidade', cor: '#4ade80', rgb: '74,222,128'  },
    foco:       { label: 'Foco',       cor: '#60a5fa', rgb: '96,165,250'  },
    carisma:    { label: 'Carisma',    cor: '#22d3ee', rgb: '34,211,238'  },
    disciplina: { label: 'Disciplina', cor: '#818cf8', rgb: '129,140,248' },
};

const ARVORE_TREE_NODES = [
    { id:'despertar',    nome:'O DESPERTAR',          icon:'⚡', nivel:0,  fase:1, reqNivel:0,  atributo:null,
      xPct:50, yPx:510, borderStyle:'dashed', numLabel:'0',
      label:'O INÍCIO',
      quote:'O despertar é apenas o começo. Abra os olhos para o que realmente importa.',
      virtudes:'Nenhuma virtude desbloqueada ainda. Continue evoluindo para o nível 10!' },
    { id:'desconhecido', nome:'CAMINHO DESCONHECIDO',  icon:'◈', nivel:5,  fase:1, reqNivel:5,  atributo:null,
      xPct:50, yPx:320, borderStyle:'solid',  numLabel:'S',
      label:'',
      quote:'O caminho à frente está envolto em sombras. Continue evoluindo para revelar seu destino.',
      virtudes:'Este caminho ainda está oculto. Alcance o nível 5 para revelar o próximo passo.' },
    { id:'forca_1',      nome:'Corpo de Ferro',        icon:'💪', nivel:10, fase:2, reqNivel:10, atributo:'forca',
      xPct:14, yPx:100, numLabel:'',
      label:'', quote:'O corpo é o templo da mente. Forje-o com disciplina e dedicação.',
      virtudes:'Nenhuma virtude desbloqueada ainda. Continue evoluindo!' },
    { id:'vitalidade_1', nome:'Energia Vital',         icon:'❤️', nivel:10, fase:2, reqNivel:10, atributo:'vitalidade',
      xPct:32, yPx:100, numLabel:'',
      label:'', quote:'Cuide do seu corpo como se sua vida dependesse disso — porque depende.',
      virtudes:'Nenhuma virtude desbloqueada ainda. Continue evoluindo!' },
    { id:'foco_1',       nome:'Mente Afiada',          icon:'🎯', nivel:10, fase:2, reqNivel:10, atributo:'foco',
      xPct:62, yPx:100, numLabel:'',
      label:'', quote:'Onde a atenção vai, a energia flui. Dominar o foco é dominar o tempo.',
      virtudes:'Nenhuma virtude desbloqueada ainda. Continue evoluindo!' },
    { id:'carisma_1',    nome:'Presença de Rei',       icon:'✨', nivel:10, fase:2, reqNivel:10, atributo:'carisma',
      xPct:78, yPx:100, numLabel:'',
      label:'', quote:'Sua presença deve falar mais alto do que suas palavras.',
      virtudes:'Nenhuma virtude desbloqueada ainda. Continue evoluindo!' },
    { id:'disciplina_1', nome:'Vontade Absoluta',      icon:'🔮', nivel:10, fase:2, reqNivel:10, atributo:'disciplina',
      xPct:92, yPx:100, numLabel:'',
      label:'', quote:'A disciplina é a ponte entre metas e realizações.',
      virtudes:'Nenhuma virtude desbloqueada ainda. Continue evoluindo!' },
];

const ARVORE_CONNECTIONS = [
    ['despertar', 'desconhecido'],
    ['desconhecido', 'forca_1'],
    ['desconhecido', 'vitalidade_1'],
    ['desconhecido', 'foco_1'],
    ['desconhecido', 'carisma_1'],
    ['desconhecido', 'disciplina_1'],
];

// ---- ARQUITETO PERSONAGEM FRAGMENTS ----
const AP_FRAGMENTS = [
    { nome: 'Fragmento da Origem',  emoji: '💫', desc: 'O Arquiteto foi um humano comum antes de despertar. Como você.',               reqNivel: 1   },
    { nome: 'O Primeiro Teste',     emoji: '⚔️', desc: 'Ele falhou dezenas de vezes antes de passar pela primeira missão E.',         reqNivel: 10  },
    { nome: 'A Escolha Sombria',    emoji: '🌑', desc: 'O momento em que decidiu abraçar o caminho das sombras.',                     reqNivel: 20  },
    { nome: 'Parceiros Perdidos',   emoji: '🕯️', desc: 'Aqueles que caminharam com ele e não chegaram ao fim.',                      reqNivel: 30  },
    { nome: 'Ascensão ao S',        emoji: '🏆', desc: 'A batalha que o colocou no topo. Três dias sem descanso.',                   reqNivel: 50  },
    { nome: 'O Sistema Revelado',   emoji: '🔮', desc: 'Ele descobriu a verdadeira natureza do Sistema de Evolução.',               reqNivel: 75  },
    { nome: 'Mensagem ao Futuro',   emoji: '✉️', desc: 'Uma carta deixada para quem completasse sua jornada. Para você.',           reqNivel: 100 }
];


/* ===========================================
   ITENS DE RECOMPENSA
   =========================================== */

// Liga o modal de cadastro de item da loja (#settingsModal) à lógica de salvamento.
// O modal já existe no HTML; esta função apenas conecta os handlers — não altera o design.
function initItemSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const form = document.getElementById('itemForm');
    if (!modal || !form) return;

    const closeBtn = document.getElementById('settingsClose');
    const cancelBtn = document.getElementById('cancelItemBtn');
    const iconInput = document.getElementById('itemIcon');
    const iconPreview = document.getElementById('iconPreview');
    const nameInput = document.getElementById('itemName');
    const priceInput = document.getElementById('itemPrice');

    const close = () => {
        modal.classList.add('hidden');
        form.reset();
        if (iconPreview) iconPreview.innerHTML = '<span class="preview-placeholder">Preview do ícone</span>';
        form.dataset.iconDataUrl = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);

    if (iconInput) {
        iconInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const url = ev.target.result;
                form.dataset.iconDataUrl = url;
                if (iconPreview) iconPreview.innerHTML = '<img src="' + url + '" alt="" style="max-width:100%;max-height:100%;object-fit:contain"/>';
            };
            reader.readAsDataURL(file);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!gameSystem) return;
        const nome = (nameInput?.value || '').trim();
        const preco = parseInt(priceInput?.value, 10);
        const icone = form.dataset.iconDataUrl || '';
        if (!nome || !icone || !Number.isFinite(preco) || preco < 0) {
            alert('Preencha todos os campos corretamente.');
            return;
        }
        if (!Array.isArray(gameSystem.data.itensRecompensaCustom)) {
            gameSystem.data.itensRecompensaCustom = [];
        }
        gameSystem.data.itensRecompensaCustom.push({
            id: 'custom_' + Date.now(),
            nome: nome,
            icone: icone,
            preco: preco,
            xpReq: 0,
            raridade: 'Comum',
            custom: true
        });
        gameSystem.saveData();
        if (typeof initItensRecompensa === 'function') initItensRecompensa();
        close();
    });
}

window.openItemSettingsModal = function() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('hidden');
};

function initItensRecompensa() {
    // KPI (sempre recalcula com base no estado atual)
    (function renderItensKpis() {
        const allItems = [...DEFAULT_ITENS_RECOMPENSA, ...(gameSystem.data.itensRecompensaCustom || [])];
        const totalItens = allItems.length;
        const totalXp = gameSystem.data.exp || 0;
        const desbloqueados = allItems.filter(i => totalXp >= (i.xpReq || 0)).length;
        const progressoPct = totalItens > 0 ? Math.round((desbloqueados / totalItens) * 100) : 0;
        const nivel = gameSystem.data.nivel || 0;
        const kpiRow = document.getElementById('itensKpiRow');
        if (kpiRow) {
            kpiRow.innerHTML = `
                <div class="vd-kpi-card"><div class="vd-kpi-label">Itens Obtidos</div><div class="vd-kpi-value snc-yellow">${desbloqueados}</div></div>
                <div class="vd-kpi-card"><div class="vd-kpi-label">Total de Itens</div><div class="vd-kpi-value">${totalItens}</div></div>
                <div class="vd-kpi-card"><div class="vd-kpi-label">Progresso</div><div class="vd-kpi-value snc-green">${progressoPct}%</div></div>
                <div class="vd-kpi-card"><div class="vd-kpi-label">Seu Nível</div><div class="vd-kpi-value snc-cyan">${nivel}</div></div>`;
        }
    })();

    // Render rarity filter tabs
    const tabsContainer = document.getElementById('itensRarityTabs');
    if (tabsContainer) {
        const raridades = ['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário', 'Mítico'];
        const allItems = [...DEFAULT_ITENS_RECOMPENSA, ...(gameSystem.data.itensRecompensaCustom || [])];
        const totalXp = gameSystem.data.exp || 0;
        const countsByRarity = {};
        raridades.forEach((r) => (countsByRarity[r] = { total: 0, got: 0 }));
        allItems.forEach((it) => {
            const r = it.raridade || 'Comum';
            if (!countsByRarity[r]) return;
            countsByRarity[r].total += 1;
            if (totalXp >= (it.xpReq || 0)) countsByRarity[r].got += 1;
        });

        tabsContainer.innerHTML = raridades
            .map((r) => {
                const c = countsByRarity[r] || { total: 0, got: 0 };
                return `
                    <button class="vd-rarity-tab ${r === 'Comum' ? 'active' : ''}" data-rarity="${r}">
                        <span class="vd-rarity-name">${r}</span>
                        <span class="vd-rarity-count">${c.got}/${c.total}</span>
                    </button>
                `;
            })
            .join('');
        tabsContainer.addEventListener('click', e => {
            const btn = e.target.closest('.vd-rarity-tab');
            if (!btn) return;
            tabsContainer.querySelectorAll('.vd-rarity-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderItensRecompensa(btn.dataset.rarity);
        });
    }

    const addBtn = document.getElementById('addItemBtn');
    if (addBtn) addBtn.addEventListener('click', () => showItemModal());

    renderItensRecompensa('Todos');
}

function renderItensRecompensa(filter) {
    const grid = document.getElementById('itensGrid');
    if (!grid) return;

    const allItems = [...DEFAULT_ITENS_RECOMPENSA, ...(gameSystem.data.itensRecompensaCustom || [])];
    const totalXp = gameSystem.data.exp || 0;
    const filtered = filter === 'Todos' ? allItems : allItems.filter(it => (it.raridade || 'Comum') === filter);

    if (!filtered.length) {
        grid.innerHTML = '<div class="mz-empty" style="grid-column:1/-1;padding:30px">Nenhum item nesta raridade.</div>';
        return;
    }

    grid.innerHTML = filtered.map(item => {
        const isUnlocked = totalXp >= item.xpReq;
        const isCustom = !DEFAULT_ITENS_RECOMPENSA.find(d => d.id === item.id);
        const rar = item.raridade || 'Comum';
        const lock = !isUnlocked
            ? `
                <div class="item-lock-center" aria-hidden="true">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px">
                        <rect x="4" y="9" width="12" height="9" rx="1.5"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/><circle cx="10" cy="13.5" r="1" fill="currentColor"/>
                    </svg>
                </div>
                <div class="item-lock-hint">Alcance o nível ${Math.max(1, Math.floor((item.xpReq || 0) / 100))} para desbloquear</div>
            `
            : '';
        return `<div class="item-card item-card--${rar} ${isUnlocked ? '' : 'locked'}">
            ${lock}
            <div class="item-card-icon">${item.emoji}</div>
            <div class="item-card-name">${item.nome}</div>
            <div class="item-card-desc">${item.desc}</div>
            <span class="item-rarity-badge rarity-${rar}">${rar}</span>
            ${isUnlocked && item.xpReq > 0 ? `<div class="item-xp-req">XP: ${item.xpReq.toLocaleString()}</div>` : ''}
            ${isCustom ? `<div class="item-card-actions">
                <button class="item-action-btn" onclick="showItemModal('${item.id}')">✏️</button>
                <button class="item-action-btn" onclick="deleteItemRecompensa('${item.id}')" style="color:rgba(248,113,113,0.7)">🗑️</button>
            </div>` : ''}
        </div>`;
    }).join('');
}

function showItemModal(editId) {
    const custom = gameSystem.data.itensRecompensaCustom || [];
    const existing = editId ? custom.find(i => i.id === editId) : null;

    const overlay = document.createElement('div');
    overlay.className = 'it-modal-overlay';
    overlay.innerHTML = `<div class="it-modal">
        <div class="it-modal-title">${existing ? 'Editar Item' : 'Novo Item de Recompensa'}</div>
        <div class="cfg-row"><div class="cfg-label">Emoji</div>
            <input class="cfg-input" id="itemEmoji" value="${existing?.emoji || '🎁'}" maxlength="4" style="width:60px;text-align:center;font-size:1.4rem">
        </div>
        <div class="cfg-row"><div class="cfg-label">Nome</div>
            <input class="cfg-input" id="itemNome" value="${existing?.nome || ''}" placeholder="Nome do item">
        </div>
        <div class="cfg-row"><div class="cfg-label">Descrição</div>
            <input class="cfg-input" id="itemDesc" value="${existing?.desc || ''}" placeholder="Breve descrição">
        </div>
        <div class="cfg-row"><div class="cfg-label">Raridade</div>
            <select class="cfg-input" id="itemRaridade">
                ${['Comum','Incomum','Raro','Épico','Lendário'].map(r => `<option ${(existing?.raridade||'Comum')===r?'selected':''}>${r}</option>`).join('')}
            </select>
        </div>
        <div class="cfg-row"><div class="cfg-label">XP Necessário</div>
            <input class="cfg-input" id="itemXp" type="number" min="0" value="${existing?.xpReq || 0}">
        </div>
        <div class="mz-modal-actions">
            <button class="btn-modal-cancel" onclick="this.closest('.it-modal-overlay').remove()">Cancelar</button>
            <button class="btn-modal-confirm" onclick="saveItemRecompensa('${editId||''}')">Salvar</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);
}

function saveItemRecompensa(editId) {
    const emoji    = document.getElementById('itemEmoji')?.value.trim() || '🎁';
    const nome     = document.getElementById('itemNome')?.value.trim();
    const desc     = document.getElementById('itemDesc')?.value.trim();
    const raridade = document.getElementById('itemRaridade')?.value;
    const xpReq    = parseInt(document.getElementById('itemXp')?.value) || 0;
    if (!nome) return;

    if (!gameSystem.data.itensRecompensaCustom) gameSystem.data.itensRecompensaCustom = [];
    const custom = gameSystem.data.itensRecompensaCustom;

    if (editId) {
        const idx = custom.findIndex(i => i.id === editId);
        if (idx !== -1) custom[idx] = { ...custom[idx], emoji, nome, desc, raridade, xpReq };
    } else {
        custom.push({ id: 'cu' + Date.now(), emoji, nome, desc, raridade, xpReq });
    }
    gameSystem.saveData();
    document.querySelector('.it-modal-overlay')?.remove();
    initItensRecompensa(); // recalcula KPIs/tabs e re-renderiza
    const activeTab = document.querySelector('#itensRarityTabs .vd-rarity-tab.active');
    renderItensRecompensa(activeTab?.dataset.rarity || 'Todos');
}

function deleteItemRecompensa(itemId) {
    if (!confirm('Remover este item?')) return;
    gameSystem.data.itensRecompensaCustom = (gameSystem.data.itensRecompensaCustom || []).filter(i => i.id !== itemId);
    gameSystem.saveData();
    initItensRecompensa(); // recalcula KPIs/tabs e re-renderiza
    const activeTab = document.querySelector('#itensRarityTabs .vd-rarity-tab.active');
    renderItensRecompensa(activeTab?.dataset.rarity || 'Todos');
}


/* ===========================================
   MATRIZ DE PRIORIDADES
   =========================================== */

function initMatrizPrioridades() {
    renderMatrizPrioridades();

    // Delegate click to add buttons
    const section = document.getElementById('matrizPrioridadesSection');
    if (!section) return;

    section.addEventListener('click', e => {
        const addBtn = e.target.closest('.mz-add-btn[data-quadrant]');
        if (addBtn) showMzTaskModal(addBtn.dataset.quadrant);

        const removeBtn = e.target.closest('.mz-task-remove');
        if (removeBtn) {
            const q = removeBtn.dataset.q;
            const idx = parseInt(removeBtn.dataset.idx);
            removeMzTask(q, idx);
        }

        const taskItem = e.target.closest('.mz-task-item[data-q]');
        if (taskItem && !e.target.closest('.mz-task-remove')) {
            const q = taskItem.dataset.q;
            const idx = parseInt(taskItem.dataset.idx);
            toggleMzTask(q, idx);
        }
    });
}

function renderMatrizPrioridades() {
    if (!gameSystem.data.matrizTarefas) gameSystem.data.matrizTarefas = { q1: [], q2: [], q3: [], q4: [] };

    const isVideo2 = !!document.querySelector('#matrizPrioridadesSection .mz-grid--video2');
    const activeQuadrants = isVideo2 ? ['q1','q2'] : ['q1','q2','q3','q4'];

    // update counters (frame mostra "0" no topo direito)
    if (isVideo2) {
        const c1 = document.getElementById('mzQ1Count');
        const c2 = document.getElementById('mzQ2Count');
        if (c1) c1.textContent = String((gameSystem.data.matrizTarefas.q1 || []).length);
        if (c2) c2.textContent = String((gameSystem.data.matrizTarefas.q2 || []).length);
    }

    activeQuadrants.forEach((q, qi) => {
        const listEl = document.getElementById('mzQ' + (qi + 1) + 'List');
        if (!listEl) return;

        const tasks = gameSystem.data.matrizTarefas[q] || [];
        if (!tasks.length) {
            if (isVideo2) {
                listEl.innerHTML = `
                    <div class="mz-empty mz-empty--video">
                        <button type="button" class="mz-add-btn mz-add-btn--hero" data-quadrant="${qi + 1}" title="Adicionar tarefa" aria-label="Adicionar tarefa ao quadrante">+</button>
                        <div class="mz-empty-title">Sem tarefas neste quadrante</div>
                        <div class="mz-empty-sub">Toque em + para adicionar ou use o botão em baixo.</div>
                    </div>
                `;
            } else {
                listEl.innerHTML = `<div class="mz-empty">${['Clique + para missões prioritárias.','Planejamento e metas a longo prazo.','Delegue ou descarte essas tarefas.','Elimine. Não agrega valor.'][qi]}</div>`;
            }
            return;
        }
        listEl.innerHTML = tasks.map((t, idx) => `
            <div class="mz-task-item ${t.done ? 'done' : ''}" data-q="${q}" data-idx="${idx}">
                <div class="mz-task-check">${t.done ? '✓' : ''}</div>
                <span>${t.texto}</span>
                <span class="mz-task-remove" data-q="${q}" data-idx="${idx}">×</span>
            </div>`).join('');
    });
}

function showMzTaskModal(quadNum) {
    const qKey = 'q' + quadNum;
    const overlay = document.createElement('div');
    overlay.className = 'mz-task-modal-overlay';
    overlay.innerHTML = `<div class="mz-task-modal">
        <div style="font-size:0.82rem;font-weight:700;color:rgba(255,255,255,0.8)">Nova Tarefa</div>
        <input id="mzTaskInput" class="cfg-input" placeholder="Descrição da tarefa...">
        <div class="mz-modal-actions">
            <button class="btn-modal-cancel" onclick="this.closest('.mz-task-modal-overlay').remove()">Cancelar</button>
            <button class="btn-modal-confirm" onclick="addMzTask('${qKey}')">Adicionar</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.querySelector('#mzTaskInput')?.focus(), 50);
}

function addMzTask(qKey) {
    const input = document.getElementById('mzTaskInput');
    const texto = input?.value.trim();
    if (!texto) return;
    if (!gameSystem.data.matrizTarefas) gameSystem.data.matrizTarefas = { q1: [], q2: [], q3: [], q4: [] };
    if (!gameSystem.data.matrizTarefas[qKey]) gameSystem.data.matrizTarefas[qKey] = [];
    gameSystem.data.matrizTarefas[qKey].push({ texto, done: false });
    gameSystem.saveData();
    document.querySelector('.mz-task-modal-overlay')?.remove();
    renderMatrizPrioridades();
}

function toggleMzTask(qKey, idx) {
    const tasks = gameSystem.data.matrizTarefas?.[qKey];
    if (tasks && tasks[idx] !== undefined) {
        tasks[idx].done = !tasks[idx].done;
        gameSystem.saveData();
        renderMatrizPrioridades();
    }
}

function removeMzTask(qKey, idx) {
    const tasks = gameSystem.data.matrizTarefas?.[qKey];
    if (tasks) {
        tasks.splice(idx, 1);
        gameSystem.saveData();
        renderMatrizPrioridades();
    }
}

/* ===========================================
   ARENA GLOBAL (classificação + Arena de Recompensas — ref. vídeo)
   =========================================== */

/**
 * Ranking fixo — referência Solo Leveling (webtoon completa). Ordem: mais forte → mais fraco.
 * `power` ordena face ao jogador; `nivel` é só ilustrativo na UI da Arena.
 */
const ARENA_CANON_ROSTER = [
    { name: 'SUNG JINWOO', nivel: 100, power: 9998500000 },
    { name: 'ANTARES', nivel: 100, power: 9870000000 },
    { name: 'BARAN - MONARCA DAS CHAMAS BRANCAS', nivel: 100, power: 9864000000 },
    { name: 'ASHBORN', nivel: 100, power: 9720000000 },
    { name: 'LEGIA - MONARCA DO INICIO', nivel: 100, power: 9716000000 },
    { name: 'MONARCA DAS FERAS', nivel: 100, power: 8650000000 },
    { name: 'MONARCA DO GELO', nivel: 100, power: 8580000000 },
    { name: 'MONARCA DO CORPO DE FERRO', nivel: 100, power: 8510000000 },
    { name: 'QUERESHA', nivel: 100, power: 8380000000 },
    { name: 'YOGUMUNT', nivel: 100, power: 8220000000 },
    { name: 'BELLION', nivel: 97, power: 5800000000 },
    { name: 'BERU', nivel: 96, power: 5200000000 },
    { name: 'IGRIS', nivel: 95, power: 4500000000 },
    { name: 'IRMAOS KAMISH', nivel: 96, power: 2100000000 },
    { name: 'KAMISH', nivel: 96, power: 1200000000 },
    { name: 'METUS', nivel: 94, power: 980000000 },
    { name: 'RAINHA FORMIGA', nivel: 92, power: 450000000 },
    { name: 'TUSK', nivel: 86, power: 280000000 },
    { name: 'TANK', nivel: 85, power: 250000000 },
    { name: 'KAISEL', nivel: 84, power: 220000000 },
    { name: 'CHRISTOPHER REED', nivel: 95, power: 185000000 },
    { name: 'THOMAS ANDRE', nivel: 95, power: 182000000 },
    { name: 'LIU ZHIGANG', nivel: 95, power: 180000000 },
    { name: 'SIDDHARTH BACHCHAN', nivel: 94, power: 168000000 },
    { name: 'LENNART NIERMANN', nivel: 94, power: 165000000 },
    { name: 'MESTRE CASTELO DUPLO', nivel: 90, power: 160000000 },
    { name: 'GIGANTES NIVEL RED', nivel: 88, power: 140000000 },
    { name: 'GO GUN-HEE', nivel: 92, power: 112000000 },
    { name: 'CHA HAE-IN', nivel: 92, power: 108000000 },
    { name: 'CHOI JONG-IN', nivel: 92, power: 105000000 },
    { name: 'BAEK YOON-HO', nivel: 92, power: 103000000 },
    { name: 'MA DONG-WOOK', nivel: 91, power: 98000000 },
    { name: 'LIM TAE-GYU', nivel: 91, power: 92000000 },
    { name: 'WOO JIN-CHUL', nivel: 91, power: 88000000 },
    { name: 'MIN BYUNG-GYU', nivel: 89, power: 82000000 },
    { name: 'NORMAN SCHENLEN', nivel: 90, power: 78000000 },
    { name: 'HAYDE REBECCA', nivel: 89, power: 72000000 },
    { name: 'EMILY SIMMONS', nivel: 88, power: 68000000 },
    { name: 'KEI', nivel: 88, power: 65000000 },
    { name: 'ESGARD', nivel: 85, power: 48000000 },
    { name: 'VAAL', nivel: 84, power: 42000000 },
    { name: 'BARUKA', nivel: 83, power: 38000000 },
    { name: 'GROTU', nivel: 82, power: 35000000 },
    { name: 'GANNON', nivel: 80, power: 28000000 },
    { name: 'HAYATO', nivel: 78, power: 22000000 },
    { name: 'HOSHIMAS', nivel: 77, power: 18000000 },
    { name: 'HUNTER B — VANGUARDA', nivel: 75, power: 15000000 },
    { name: 'KANG TAESIK', nivel: 72, power: 12000000 },
    { name: 'HUNTER B — DPS', nivel: 71, power: 11000000 },
    { name: 'KIM CHUL', nivel: 70, power: 10000000 },
    { name: 'LUCAS BRANT', nivel: 69, power: 8800000 },
    { name: 'TATSUYA FUNADA', nivel: 68, power: 7200000 },
    { name: 'SONG CHI-YUL', nivel: 66, power: 4800000 },
    { name: 'YOO JIN-HO', nivel: 65, power: 4500000 },
    { name: 'LEE JOO-HEE', nivel: 62, power: 2200000 },
    { name: 'HUNTER A — GUILDA', nivel: 54, power: 1800000 },
    { name: 'HUNTER A — FOGO', nivel: 52, power: 1500000 },
    { name: 'HUNTER B — SUPORTE', nivel: 45, power: 680000 },
    { name: 'HUNTER C — ATAQUE', nivel: 38, power: 240000 },
    { name: 'HUNTER C — TANK', nivel: 36, power: 195000 },
    { name: 'ORC GENERAL', nivel: 35, power: 160000 },
    { name: 'ALFA LOBISOMEM', nivel: 33, power: 120000 },
    { name: 'ESPADACHIM SOMBRA', nivel: 31, power: 85000 },
    { name: 'GOBLIN CHEFE', nivel: 28, power: 42000 },
    { name: 'SLIME RAINHA', nivel: 24, power: 18000 },
    { name: 'LICH PANTANO', nivel: 22, power: 12000 },
    { name: 'GOTO RYUJI', nivel: 97, power: 177500000 },
    { name: 'JIMA', nivel: 96, power: 1520000000 },
    { name: 'IRON', nivel: 93, power: 1100000000 },
    { name: 'ESIL', nivel: 88, power: 98500000 },
    { name: 'PARK HEE-JIN', nivel: 89, power: 73500000 },
    { name: 'SUNG IL-HWAN', nivel: 96, power: 174000000 },
    { name: 'SON KI-HOON', nivel: 52, power: 4600000 },
];

/**
 * Ficheiros em `arena-avatars/`. Chave = nome exactamente como em ARENA_CANON_ROSTER.
 * Valor = nome exacto do ficheiro no disco (idealmente igual ao da classificação + extensão).
 * Só incluir entradas para ficheiros que existem na pasta — evita imgs partidas.
 */
const ARENA_AVATAR_FILE_BY_NAME = {
    'SUNG JINWOO': 'SUNG JINWOO.jpg',
    'ASHBORN': 'ASHBORN.png',
    'LEGIA - MONARCA DO INICIO': 'LEGIA - MONARCA DO INICIO.jpg',
    'MONARCA DAS FERAS': 'MONARCA DAS FERAS.png',
    'MONARCA DO GELO': 'MONARCA DO GELO.png',
    'MONARCA DO CORPO DE FERRO': 'MONARCA DO CORPO DE FERRO.png',
    'QUERESHA': 'QUERESHA.jpg',
    'YOGUMUNT': 'YOGUMUNT.png',
    'CHRISTOPHER REED': 'CHRISTOPHER REED.png',
    'LIU ZHIGANG': 'LIU ZHIGANG.jpg',
    'GO GUN-HEE': 'GO GUN-HEE.jpg',
    'KANG TAESIK': 'KANG TAESIK.png',
    'EMILY SIMMONS': 'EMILY SIMMONS.png',
    'LENNART NIERMANN': 'LENNART NIERMANN.png',
    'MA DONG-WOOK': 'MA DONG-WOOK.png',
    'LIM TAE-GYU': 'LIM TAE-GYU.png',
    'SONG CHI-YUL': 'SONG CHI-YUL.png',
    'WOO JIN-CHUL': 'WOO JIN-CHUL.jpg',
    'KIM CHUL': 'KIM CHUL.png',
    'ORC GENERAL': 'ORC GENERAL.png',
    'ESPADACHIM SOMBRA': 'ESPADACHIM SOMBRA.png',
    'GOBLIN CHEFE': 'GOBLIN CHEFE.png',
    'PARK HEE-JIN': 'PARK HEE-JIN.jpg',
    'SUNG IL-HWAN': 'SUNG IL-HWAN.png',
    'SON KI-HOON': 'SON KI-HOON.png',
};

function getArenaGlobalPower(d) {
    const a = d.atributos || {};
    const sumAttr = (a.forca || 0) + (a.vitalidade || 0) + (a.foco || 0) + (a.carisma || 0) +
        (a.disciplina || 0) + (a.sabedoria || 0);
    // Schema atual: missão concluída = task.completions[].length > 0 (com fallback ao legado m.concluida).
    const mis = (d.missoes || []).reduce(function(acc, m) {
        const completions = Array.isArray(m.completions) ? m.completions.length : 0;
        return acc + (completions > 0 ? completions : (m.concluida ? 1 : 0));
    }, 0);
    const nivel = normalizeStoredNivel(d.nivel);
    const exp = d.exp || 0;
    const moedas = d.moedas || 0;
    return Math.floor(
        nivel * 15200 + exp * 14 + moedas * 9 + sumAttr * 2100 + mis * 3400 + (d.xpHoje || 0) * 48
    );
}

/** @param {object} [playerData] — se omitido, usa gameSystem.data (requer gameSystem já atribuído). */
function buildArenaSnapshot(playerData) {
    const d = playerData != null ? playerData : gameSystem.data;
    const avMap = typeof ARENA_AVATAR_FILE_BY_NAME !== 'undefined' ? ARENA_AVATAR_FILE_BY_NAME : {};
    const bots = ARENA_CANON_ROSTER.map(function(entry) {
        return {
            name: entry.name,
            isPlayer: false,
            nivel: entry.nivel,
            power: entry.power,
            avatarFile: avMap[entry.name] || null
        };
    });
    const playerName = (d.nome || 'HUNTER').toUpperCase().trim() || 'HUNTER';
    const playerPower = getArenaGlobalPower(d);
    const player = {
        name: playerName,
        isPlayer: true,
        nivel: normalizeStoredNivel(d.nivel),
        power: playerPower,
        avatarFile: avMap[playerName] || null
    };
    const all = bots.concat([player]).sort(function(a, b) { return b.power - a.power; });
    all.forEach(function(row, idx) { row.rank = idx + 1; });
    const pr = all.find(function(r) { return r.isPlayer; });
    const maxRows = Math.min(all.length, 100);
    const rows = all.slice(0, maxRows);
    return {
        rows: rows,
        playerRank: pr ? pr.rank : all.length,
        playerPower: playerPower,
        totalHunters: all.length
    };
}

function _arenaFmtPts(n) {
    const v = Math.max(0, Math.floor(n));
    if (v >= 1e6) return (v / 1e6).toFixed(2) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(1) + 'k';
    return String(v);
}

function _arenaInitials(name) {
    const p = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!p.length) return '?';
    if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
    return (p[0][0] + p[1][0]).toUpperCase();
}

/** URL relativa ao HTML para ficheiro em `arena-avatars/`. */
function _arenaAvatarUrl(file) {
    if (!file) return '';
    return 'arena-avatars/' + encodeURIComponent(file);
}

/** Conteúdo da área circular/quadrada: imagem se existir + iniciais (iniciais escondidas via CSS se a foto carregar). */
function _arenaPhotoFillHtml(row, kind) {
    var lettersClass = kind === 'podium' ? 'arena-podium-photo-letters' : 'arena-row-photo-letters';
    var imgClass = kind === 'podium' ? 'arena-podium-photo-img' : 'arena-row-photo-img';
    var letters = '<span class="' + lettersClass + '">' + _escapeHtml(_arenaInitials(row.name)) + '</span>';
    if (!row.avatarFile) return letters;
    var src = _arenaAvatarUrl(row.avatarFile);
    return '<img class="' + imgClass + '" src="' + src + '" alt="" decoding="async" loading="lazy" '
        + 'onerror="this.onerror=null;this.classList.add(\'is-broken\');"/>'
        + letters;
}

/** Paleta determinística por seed (substitui análise de cor da foto até haver uploads). */
function _arenaPaletteFromSeed(seed) {
    var h = 0;
    var s = String(seed || '?');
    for (var i = 0; i < s.length; i++) {
        h = (((h << 5) - h) + s.charCodeAt(i)) | 0;
    }
    var hue = Math.abs(h) % 360;
    return {
        accent: 'hsl(' + hue + ',72%,56%)',
        accentStrong: 'hsl(' + hue + ',78%,62%)',
        glow: 'hsla(' + hue + ',70%,52%,0.38)',
        fillSoft: 'hsla(' + hue + ',45%,42%,0.22)'
    };
}

/** Papel/arquétipo para linha da lista — só visual. */
function _arenaHunterRole(name) {
    var roles = ['Executor', 'Sentinela', 'Dominador', 'Invocador', 'Versátil'];
    var h = 0;
    var s = String(name || '?');
    for (var i = 0; i < s.length; i++) {
        h = (((h << 5) - h) + s.charCodeAt(i)) | 0;
    }
    return roles[Math.abs(h) % roles.length];
}

function _arenaPodiumClassLabel() {
    return 'ASCENDENTE';
}

/** RGB 0–255 → HSL para ajuste de borda do pódio. */
function _arenaRgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max !== min) {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) {
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
            h = ((b - r) / d + 2) / 6;
        } else {
            h = ((r - g) / d + 4) / 6;
        }
    }
    return { h: h * 360, s: s, l: l };
}

function _arenaHslCss(h, s, l) {
    return 'hsl(' + Math.round(h) + ',' + Math.round(s * 100) + '%,' + Math.round(l * 100) + '%)';
}

/**
 * Lê a foto do pódio (canvas, mesma origem) e define --podium-* no cartão.
 * Média de pixels com luminância intermédia (evita preto/branco puros).
 */
function _arenaApplyPodiumBorderFromImage(img) {
    if (!img || img.classList.contains('is-broken') || !img.naturalWidth) return;
    var slot = img.closest('.arena-podium-slot');
    if (!slot) return;
    try {
        var w = 48;
        var h = 48;
        var cnv = document.createElement('canvas');
        cnv.width = w;
        cnv.height = h;
        var ctx = cnv.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        var data = ctx.getImageData(0, 0, w, h).data;
        var sr = 0;
        var sg = 0;
        var sb = 0;
        var n = 0;
        for (var i = 0; i < data.length; i += 16) {
            var rr = data[i];
            var gg = data[i + 1];
            var bb = data[i + 2];
            var aa = data[i + 3];
            if (aa < 28) continue;
            var lum = (0.2126 * rr + 0.7152 * gg + 0.0722 * bb) / 255;
            if (lum < 0.06 || lum > 0.96) continue;
            sr += rr;
            sg += gg;
            sb += bb;
            n++;
        }
        if (n < 4) return;
        sr /= n;
        sg /= n;
        sb /= n;
        var hsl = _arenaRgbToHsl(sr, sg, sb);
        var sat = Math.min(0.9, Math.max(0.36, hsl.s * 1.28));
        var lig = Math.min(0.62, Math.max(0.4, hsl.l * 1.02));
        var hue = hsl.h;
        slot.style.setProperty('--podium-accent', _arenaHslCss(hue, sat, lig));
        slot.style.setProperty('--podium-accent-strong', _arenaHslCss(hue, Math.min(0.95, sat + 0.1), Math.min(0.68, lig + 0.08)));
        slot.style.setProperty('--podium-glow', 'hsla(' + Math.round(hue) + ',' + Math.round(sat * 100) + '%,52%,0.36)');
        slot.style.setProperty('--podium-fill-soft', 'hsla(' + Math.round(hue) + ',' + Math.round(sat * 72) + '%,40%,0.22)');
    } catch (e) { /* canvas / tainted */ }
}

function _arenaBindPodiumPhotoColors(podiumEl) {
    if (!podiumEl) return;
    var imgs = podiumEl.querySelectorAll('img.arena-podium-photo-img');
    imgs.forEach(function(im) {
        var run = function() {
            _arenaApplyPodiumBorderFromImage(im);
        };
        if (im.complete && im.naturalWidth) {
            run();
        } else {
            im.addEventListener('load', run, { once: true });
        }
    });
}

function _triggerArenaBoardMotion(podium, list) {
    try {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (e) { /* ignore */ }
    if (podium && podium.querySelector('.arena-podium-slot')) {
        podium.classList.remove('arena-podium--pop');
        requestAnimationFrame(function() {
            void podium.offsetWidth;
            podium.classList.add('arena-podium--pop');
            clearTimeout(podium._arenaPopT);
            podium._arenaPopT = setTimeout(function() {
                podium.classList.remove('arena-podium--pop');
            }, 520);
        });
    }
    if (list && list.querySelector('.arena-row')) {
        list.classList.remove('arena-list--refresh');
        requestAnimationFrame(function() {
            void list.offsetWidth;
            list.classList.add('arena-list--refresh');
            clearTimeout(list._arenaListT);
            list._arenaListT = setTimeout(function() {
                list.classList.remove('arena-list--refresh');
            }, 380);
        });
    }
}

function renderArenaRewardsStrip() {
    const mount = document.getElementById('arenaRewardsStats');
    if (!mount || !gameSystem || typeof DEFAULT_ITENS_RECOMPENSA === 'undefined') return;
    const allItems = DEFAULT_ITENS_RECOMPENSA.concat(gameSystem.data.itensRecompensaCustom || []);
    const totalXp = gameSystem.data.exp || 0;
    const desbloqueados = allItems.filter(function(i) { return totalXp >= (i.xpReq || 0); }).length;
    const totalItens = allItems.length;
    const pct = totalItens > 0 ? Math.round((desbloqueados / totalItens) * 100) : 0;
    mount.innerHTML = ''
        + '<span class="arena-rewards-pill">Itens no catálogo: <strong>' + desbloqueados + '</strong> / ' + totalItens + '</span>'
        + '<span class="arena-rewards-pill">Progresso: <strong>' + pct + '%</strong></span>'
        + '<span class="arena-rewards-pill">XP investido (ref. itens): <strong>' + totalXp + '</strong></span>';
}

function renderArenaLeaderboard(withEnterAnimation) {
    const snap = buildArenaSnapshot();

    const podium = document.getElementById('arenaPodium');
    const top3 = snap.rows.slice(0, 3);
    if (podium && top3.length >= 3) {
        podium.removeAttribute('aria-hidden');
        const second = top3[1];
        const first = top3[0];
        const third = top3[2];
        var classLbl = _escapeHtml(_arenaPodiumClassLabel());
        function podiumStyle(seed) {
            var pal = _arenaPaletteFromSeed(seed);
            return ' style="'
                + '--podium-accent:' + pal.accent + ';'
                + '--podium-accent-strong:' + pal.accentStrong + ';'
                + '--podium-glow:' + pal.glow + ';'
                + '--podium-fill-soft:' + pal.fillSoft + ';"';
        }
        function mkSlot(row, cls, rankNum) {
            var pal = podiumStyle(row.name || String(rankNum));
            var quote = '';
            if (cls === 'arena-podium-slot--1') {
                quote = '<p class="arena-podium-quote" aria-hidden="true">'
                    + 'Uma Força Imparavel de Evolução'
                    + '</p>';
            }
            return '<div class="arena-podium-slot ' + cls + '"' + pal + '>'
                + '<div class="arena-podium-photo-ring" aria-hidden="true">'
                + '<div class="arena-podium-photo-fill">'
                + _arenaPhotoFillHtml(row, 'podium')
                + '</div></div>'
                + '<div class="arena-podium-hash">' + '#' + rankNum + '</div>'
                + '<div class="arena-podium-name" title="' + _escapeHtml(row.name) + '">' + _escapeHtml(row.name) + '</div>'
                + '<div class="arena-podium-class">' + classLbl + '</div>'
                + '<div class="arena-podium-level-box">' + _escapeHtml('Nível ' + row.nivel) + '</div>'
                + quote
                + '</div>';
        }
        podium.innerHTML = mkSlot(second, 'arena-podium-slot--2', 2)
            + mkSlot(first, 'arena-podium-slot--1', 1)
            + mkSlot(third, 'arena-podium-slot--3', 3);
        _arenaBindPodiumPhotoColors(podium);
    } else if (podium) {
        podium.setAttribute('aria-hidden', 'true');
        podium.innerHTML = '';
    }

    const list = document.getElementById('arenaLeaderboardList');
    var restRows = snap.rows.slice(3);
    if (list) {
        if (!restRows.length) {
            list.innerHTML = '<div class="arena-list-empty">Todos os Hunters estão no pódio (simulação com poucas entradas).</div>';
        } else {
            list.innerHTML = restRows.map(function(row) {
                const self = row.isPlayer ? ' arena-row--self' : '';
                var badge = '';
                if (row.rank <= 10) {
                    badge = '<span class="arena-row-top10">TOP 10</span>';
                }
                var roleLine = _escapeHtml(_arenaHunterRole(row.name));
                return '<article class="arena-row-card arena-row' + self + '">'
                    + '<div class="arena-row-left">'
                    + '<div class="arena-row-photo">'
                    + _arenaPhotoFillHtml(row, 'list')
                    + '</div>'
                    + '<div class="arena-row-rank-below">#' + row.rank + '</div>'
                    + '</div>'
                    + '<div class="arena-row-mid">'
                    + '<div class="arena-row-name-line">'
                    + '<span class="arena-row-name" title="' + _escapeHtml(row.name) + '">' + _escapeHtml(row.name) + '</span>'
                    + badge + '</div>'
                    + '<div class="arena-row-desc">' + roleLine + '</div>'
                    + '</div>'
                    + '<div class="arena-row-level-cap">' + _escapeHtml('Lvl ' + row.nivel) + '</div>'
                    + '</article>';
            }).join('');
        }
    }
    renderArenaRewardsStrip();
    if (withEnterAnimation) {
        _triggerArenaBoardMotion(podium, list);
    }
}

function updateArenaPainelCard(gs) {
    const sys = gs || gameSystem;
    if (!sys || !sys.data) return;
    const snap = buildArenaSnapshot(sys.data);
    const rank = snap.playerRank;
    const total = snap.totalHunters;
    const pts = typeof _arenaFmtPts === 'function' ? _arenaFmtPts(snap.playerPower) : String(Math.floor(snap.playerPower || 0));
    const rankEl = document.getElementById('painelArenaRank');
    const subEl = document.getElementById('painelArenaRankSub');
    const powEl = document.getElementById('painelArenaPower');
    const btn = document.getElementById('painelArenaBtn');
    if (rankEl) rankEl.textContent = '#' + rank;
    if (subEl) subEl.textContent = 'Ranking global · ' + rank + ' de ' + total + ' hunters';
    if (powEl) powEl.textContent = pts;
    if (btn) {
        btn.setAttribute('aria-label',
            'Abrir Arena global. Posição ' + rank + ' de ' + total + ' hunters. Pontuação ' + pts + '.');
        if (!btn.dataset.handlerBound) {
            btn.dataset.handlerBound = '1';
            btn.addEventListener('click', function() {
                const t = document.querySelector('.sys-nav .tab-icon-btn[data-tab="arena"]');
                if (t) t.click();
            });
        }
    }
}

function initArena() {
    if (!document.getElementById('arenaSection')) return;
    const openItens = document.getElementById('arenaOpenItensBtn');
    if (openItens) {
        openItens.addEventListener('click', function() {
            const t = document.querySelector('.sys-nav .tab-icon-btn[data-tab="itensRecompensa"]');
            if (t) t.click();
        });
    }
    renderArenaLeaderboard();
    if (typeof updateArenaPainelCard === 'function') {
        updateArenaPainelCard(gameSystem);
    }
}

/* ===========================================
   FOTO DE PERFIL NO PAINEL (data URL em painelFotoPerfilDataUrl)
   =========================================== */

const DEFAULT_PAINEL_AVATAR_SVG = '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<circle cx="50" cy="51" r="46" fill="rgba(168,85,247,0.09)"/>'
    + '<circle cx="50" cy="49" r="46" fill="rgba(0,229,255,0.22)"/>'
    + '<circle cx="50" cy="40" r="14" fill="rgba(255,255,255,0.85)"/>'
    + '<path d="M22 80c0-15 12-25 28-25s28 10 28 25" fill="rgba(255,255,255,0.85)"/>'
    + '</svg>';

function resizeImageFileToJpegDataUrl(file, maxEdge, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                let w = img.naturalWidth || img.width;
                let h = img.naturalHeight || img.height;
                if (!w || !h) {
                    reject(new Error('dim'));
                    return;
                }
                const scale = Math.min(1, maxEdge / Math.max(w, h));
                const cw = Math.max(1, Math.round(w * scale));
                const ch = Math.max(1, Math.round(h * scale));
                const canvas = document.createElement('canvas');
                canvas.width = cw;
                canvas.height = ch;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('ctx'));
                    return;
                }
                ctx.drawImage(img, 0, 0, cw, ch);
                try {
                    resolve(canvas.toDataURL('image/jpeg', quality));
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = () => reject(new Error('img'));
            img.src = reader.result;
        };
        reader.onerror = () => reject(new Error('read'));
        reader.readAsDataURL(file);
    });
}

function syncPainelFotoPerfilUI() {
    if (!gameSystem || !gameSystem.data) return;
    const url = gameSystem.data.painelFotoPerfilDataUrl;
    const ok = url && String(url).startsWith('data:image');
    const fill = (container) => {
        if (!container) return;
        container.textContent = '';
        if (ok) {
            const im = document.createElement('img');
            im.src = url;
            im.alt = '';
            im.decoding = 'async';
            container.appendChild(im);
        } else {
            container.innerHTML = DEFAULT_PAINEL_AVATAR_SVG;
        }
    };
    fill(document.getElementById('painelAvatarImg'));
    fill(document.getElementById('cfgPainelFotoPreviewInner'));
    const clearBtn = document.getElementById('cfgClearPainelFotoBtn');
    if (clearBtn) clearBtn.disabled = !ok;
}

function handlePainelFotoFileChosen(file) {
    if (!file || !file.type || !file.type.startsWith('image/') || !gameSystem) return;
    resizeImageFileToJpegDataUrl(file, 480, 0.82)
        .then((dataUrl) => {
            gameSystem.data.painelFotoPerfilDataUrl = dataUrl;
            gameSystem.saveData();
            syncPainelFotoPerfilUI();
            if (typeof gameSystem.updateStatusDisplay === 'function') {
                gameSystem.updateStatusDisplay();
            }
            if (typeof showToast === 'function') {
                showToast('Foto de perfil atualizada.', 'ok');
            }
        })
        .catch(() => {
            if (typeof showToast === 'function') {
                showToast('Não foi possível processar a imagem.', 'error');
            }
        });
}

function initPainelFotoPerfil() {
    const painelBtn = document.getElementById('painelAvatarBtn');
    const painelFile = document.getElementById('painelAvatarFile');
    if (painelBtn && painelFile && !painelBtn.dataset.pfpBound) {
        painelBtn.dataset.pfpBound = '1';
        painelBtn.addEventListener('click', () => painelFile.click());
        painelFile.addEventListener('change', () => {
            const f = painelFile.files && painelFile.files[0];
            painelFile.value = '';
            if (f) handlePainelFotoFileChosen(f);
        });
    }
    const cfgImport = document.getElementById('cfgImportPainelFotoBtn');
    const cfgFile = document.getElementById('cfgPainelAvatarFile');
    if (cfgImport && cfgFile && !cfgImport.dataset.pfpBound) {
        cfgImport.dataset.pfpBound = '1';
        cfgImport.addEventListener('click', () => cfgFile.click());
        cfgFile.addEventListener('change', () => {
            const f = cfgFile.files && cfgFile.files[0];
            cfgFile.value = '';
            if (f) handlePainelFotoFileChosen(f);
        });
    }
    const cfgClear = document.getElementById('cfgClearPainelFotoBtn');
    if (cfgClear && !cfgClear.dataset.pfpBound) {
        cfgClear.dataset.pfpBound = '1';
        cfgClear.addEventListener('click', () => {
            if (!gameSystem) return;
            gameSystem.data.painelFotoPerfilDataUrl = null;
            gameSystem.saveData();
            syncPainelFotoPerfilUI();
            if (typeof gameSystem.updateStatusDisplay === 'function') {
                gameSystem.updateStatusDisplay();
            }
            if (typeof showCfgSuccess === 'function') {
                showCfgSuccess('Foto removida.');
            }
        });
    }
    syncPainelFotoPerfilUI();
}

/* ===========================================
   PROGRESSO
   =========================================== */

function initProgresso() {
    renderProgresso();
}

function renderProgresso() {
    const d = gameSystem.data;
    const nivel   = d.nivel ?? 0;
    const exp     = d.exp     || 0;
    const todayKey = getTodayKey();
    const missionCompletionCount = (m) => {
        if (m.completions && m.completions.length) return m.completions.length;
        if (m.concluida) return 1;
        return 0;
    };
    const missionCompletedOnKey = (m, key) => {
        if (m.completions && m.completions.includes(key)) return true;
        if (m.concluida && m.dataConclusao && String(m.dataConclusao).slice(0, 10) === key) return true;
        return false;
    };
    const missoes = (d.missoes || []).filter((m) => missionCompletionCount(m) > 0).length;
    const moedas  = d.moedas  || 0;
    const missoesHojeCount = (d.missoes || []).filter((m) => missionCompletedOnKey(m, todayKey)).length;
    const totalFinalizacoes = Math.max(1, (d.missoes || []).reduce((s, m) => s + missionCompletionCount(m), 0));
    // Taxa de Conclusão: razão entre missões com pelo menos 1 conclusão e o total cadastrado.
    // Sem missões cadastradas → 100% (estado neutro).
    const totalMissoes = (d.missoes || []).length;
    const taxaConclusao = totalMissoes > 0
        ? Math.round((missoes / totalMissoes) * 1000) / 10
        : 100.0;
    const itensRecompensaCount = (d.inventario || []).filter((i) => i && i.type === 'recompensa').length;

    const kpi1 = document.getElementById('pgKpiRow1');
    if (kpi1) kpi1.innerHTML = `
        <div class="pg-stat-card pg-stat-card--blue">
            <div class="pg-stat-top">
                <span class="pg-stat-ico" aria-hidden="true">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><circle cx="9" cy="6.6" r="2.7"/><path d="M3.5 16a5.5 5.5 0 0 1 11 0"/></svg>
                </span>
                <div class="pg-stat-value">${nivel}</div>
            </div>
            <div class="pg-stat-label">NÍVEL TOTAL</div>
            <div class="pg-stat-sub">O Despertar</div>
        </div>
        <div class="pg-stat-card pg-stat-card--teal">
            <div class="pg-stat-top">
                <span class="pg-stat-ico" aria-hidden="true">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><path d="M6 3.8a3.4 3.4 0 1 0 0 6.8"/><path d="M11.8 3.8a3.4 3.4 0 1 1 0 6.8"/><path d="M9 6v9"/><path d="M9 10h6"/></svg>
                </span>
                <div class="pg-stat-value">Rank ${d.rank || 'E'}</div>
            </div>
            <div class="pg-stat-label">CLASSIFICAÇÃO</div>
            <div class="pg-stat-sub">Iniciante</div>
        </div>
        <div class="pg-stat-card pg-stat-card--purple">
            <div class="pg-stat-top">
                <span class="pg-stat-ico" aria-hidden="true">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><circle cx="9" cy="9" r="6.8"/><circle cx="9" cy="9" r="3.2" opacity="0.8"/><circle cx="9" cy="9" r="0.9" fill="currentColor"/></svg>
                </span>
                <div class="pg-stat-value">${taxaConclusao.toFixed(1)}%</div>
            </div>
            <div class="pg-stat-label">TAXA DE CONCLUSÃO</div>
            <div class="pg-stat-sub">Baseado em ${totalFinalizacoes} finalizações</div>
        </div>
    `;

    const kpi2 = document.getElementById('pgKpiRow2');
    if (kpi2) kpi2.innerHTML = `
        <div class="pg-stat-card pg-stat-card--green">
            <div class="pg-stat-top">
                <span class="pg-stat-ico" aria-hidden="true">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><path d="M3.5 12.5l3-3 2.2 2.2 4.8-5.2"/><path d="M12.8 6h2.7v2.7"/></svg>
                </span>
                <div class="pg-stat-value">${missoesHojeCount}</div>
            </div>
            <div class="pg-stat-label">MISSÕES CONCLUÍDAS HOJE</div>
            <div class="pg-stat-sub">Alinhado ao frame de progresso</div>
        </div>
        <div class="pg-stat-card pg-stat-card--amber">
            <div class="pg-stat-top">
                <span class="pg-stat-ico" aria-hidden="true">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><ellipse cx="9" cy="6" rx="5" ry="2.2"/><path d="M4 6v2.2c0 1.2 2.2 2.2 5 2.2s5-1 5-2.2V6"/></svg>
                </span>
                <div class="pg-stat-value">${moedas}</div>
            </div>
            <div class="pg-stat-label">MOEDAS (G)</div>
            <div class="pg-stat-sub">Saldo atual</div>
        </div>
        <div class="pg-stat-card pg-stat-card--magenta">
            <div class="pg-stat-top">
                <span class="pg-stat-ico" aria-hidden="true">
                    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><rect x="3.5" y="3.5" width="11" height="11" rx="1.2"/><path d="M9 6.5v5M6.5 9h5"/></svg>
                </span>
                <div class="pg-stat-value">+${d.xpHoje || 0}</div>
            </div>
            <div class="pg-stat-label">XP DE HOJE</div>
            <div class="pg-stat-sub">Experiência acumulada hoje</div>
        </div>
    `;

    const cum = document.getElementById('pgCumulativeStrip');
    if (cum) {
        cum.textContent = `${missoes} missões concluídas no total · ${String(exp).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} XP acumulado`;
    }

    // Hide the legacy standalone XP card (now shown in kpi2)
    const xpCard = document.querySelector('.pg-xp-card');
    if (xpCard) xpCard.style.display = 'none';

    drawActivityChart();
}

function drawActivityChart() {
    const canvas = document.getElementById('pgActivityChart');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

    const W = canvas.parentElement?.offsetWidth || 300;
    canvas.width  = W;
    canvas.height = 120;
    const H = canvas.height;

    const today = new Date();
    const days  = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }

    // Schema atual: task.completions[] guarda chaves YYYY-MM-DD; XP vem de task.rewards.exp.
    // Fallback para schema antigo (m.concluida/m.dataConclusao/m.xp) mantido por compatibilidade.
    const tasks = [
        ...(gameSystem.data.missoes || []),
        ...(gameSystem.data.habitos || [])
    ];
    const dayXp = days.map(day => {
        return tasks.reduce((s, t) => {
            const xp = (t.rewards && Number(t.rewards.exp)) || Number(t.xp) || 0;
            const completions = Array.isArray(t.completions) ? t.completions : [];
            const completedThisDay = completions.filter(c => typeof c === 'string' && c.startsWith(day)).length;
            const legacyDone = t.concluida && typeof t.dataConclusao === 'string' && t.dataConclusao.startsWith(day) ? 1 : 0;
            return s + (completedThisDay + legacyDone) * xp;
        }, 0);
    });

    const maxVal = Math.max(...dayXp, 50);
    const barW   = (W - 20) / 7;

    ctx.clearRect(0, 0, W, H);

    // Light grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth   = 1;
    [0.33, 0.66, 1].forEach(pct => {
        const y = H - 20 - (H - 30) * pct;
        ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(W - 10, y); ctx.stroke();
    });

    dayXp.forEach((val, i) => {
        const barH = Math.max((val / maxVal) * (H - 30), val > 0 ? 4 : 0);
        const x = 10 + i * barW + barW * 0.15;
        const w = barW * 0.7;
        const y = H - 20 - barH;

        const grad = ctx.createLinearGradient(0, y, 0, H - 20);
        grad.addColorStop(0, 'rgba(191,64,255,0.85)');
        grad.addColorStop(1, 'rgba(191,64,255,0.1)');
        ctx.fillStyle = val > 0 ? grad : 'rgba(255,255,255,0.04)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, w, Math.max(barH, 3), 3);
        else { ctx.rect(x, y, w, Math.max(barH, 3)); }
        ctx.fill();

        const label = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][new Date(days[i] + 'T12:00').getDay()];
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '9px Inter, Rajdhani, Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + w / 2, H - 5);
    });
}

/* ===========================================
   VIRTUDES
   =========================================== */

function initVirtudes() {
    renderVirtudes();
}

function renderVirtudes() {
    const nivel = gameSystem.data.nivel ?? 0;

    const nivelEl = document.getElementById('virtudesNivelAtual');
    if (nivelEl) nivelEl.textContent = nivel;

    const grid = document.getElementById('virtudesGrid');
    if (!grid) return;

    const cornerLockSvg = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;opacity:0.7"><rect x="5" y="9" width="10" height="9" rx="1.4"/><path d="M7.5 9V6.6a2.5 2.5 0 0 1 5 0V9"/></svg>`;
    const centerLockSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" style="width:30px;height:30px;opacity:0.75"><rect x="6" y="11" width="12" height="10" rx="2"/><path d="M9 11V8.8a3 3 0 0 1 6 0V11"/><circle cx="12" cy="16.5" r="1" fill="currentColor"/></svg>`;

    grid.innerHTML = VIRTUDES_LIST.map(v => {
        const isUnlocked = nivel >= v.reqNivel;
        const cor = v.cor || '#c084fc';
        const subTop = `Desbloqueia no nível ${v.reqNivel}`;

        if (!isUnlocked) {
            return `
                <div class="vt-card vt-card--video locked" style="--vt-cor:${cor}">
                    <div class="vt-top">
                        <div class="vt-name">${v.nome}</div>
                        <div class="vt-corner-lock" aria-hidden="true">${cornerLockSvg}</div>
                    </div>
                    <div class="vt-subtop">${subTop}</div>
                    <div class="vt-mid">
                        <div class="vt-lock-big" aria-hidden="true">${centerLockSvg}</div>
                        <div class="vt-lock-text">Alcance o nível ${v.reqNivel} para desbloquear</div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="vt-card vt-card--video unlocked" style="--vt-cor:${cor}">
                <div class="vt-top">
                    <div class="vt-name">${v.nome}</div>
                    <div class="vt-corner-lock" aria-hidden="true" style="opacity:0.25">${cornerLockSvg}</div>
                </div>
                <div class="vt-subtop">${subTop}</div>
                <div class="vt-mid vt-mid--unlocked">
                    <div class="vt-unlocked-pill">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" style="width:14px;height:14px"><path d="M3 8l3 3 7-6"/></svg>
                        Desbloqueada
                    </div>
                    <div class="vt-desc">${v.desc}</div>
                </div>
            </div>
        `;
    }).join('');
}

/* ===========================================
   ÁRVORE DE EVOLUÇÃO
   =========================================== */

let _arvoreActiveAttr = null;

function initArvoreEvolucao() {
    const nivelEl = document.getElementById('arvoreNivel');
    if (nivelEl) nivelEl.textContent = gameSystem.data.nivel || 0;
    _arvoreActiveAttr = null;
    renderArvoreFilter();
    renderArvoreTree();
    if (!window._arvoreResizeSet) {
        window._arvoreResizeSet = true;
        window.addEventListener('resize', function() {
            clearTimeout(window._arvoreResizeTimer);
            window._arvoreResizeTimer = setTimeout(renderArvoreTree, 120);
        });
    }
}

function renderArvoreFilter() {
    const pills = document.getElementById('arvoreFilterPills');
    if (!pills) return;
    const labels = { forca: 'Força', vitalidade: 'Vitalidade', foco: 'Foco', carisma: 'Carisma', disciplina: 'Disciplina' };
    pills.innerHTML = Object.entries(ARVORE_ATTRS).map(function(entry) {
        const key = entry[0], a = entry[1];
        const isActive = _arvoreActiveAttr === key;
        return '<button class="ar-filter-pill' + (isActive ? ' active' : '') + '" '
            + 'style="--pill-cor:' + a.cor + '" '
            + 'onclick="filterArvoreAttr(\'' + key + '\')">'
            + '<span class="ar-pill-dot" style="background:' + a.cor + '"></span>'
            + (labels[key] || a.label)
            + '</button>';
    }).join('');
}

function filterArvoreAttr(key) {
    _arvoreActiveAttr = (_arvoreActiveAttr === key) ? null : key;
    renderArvoreFilter();
    renderArvoreTree();
}

function renderArvoreTree() {
    const canvas   = document.getElementById('arvoreTreeCanvas');
    const nodesDiv = document.getElementById('arvoreTreeNodes');
    const svg      = document.getElementById('arvoreTreeSvg');
    if (!canvas || !nodesDiv || !svg) return;

    const nivel     = gameSystem.data.nivel || 0;
    /* offsetWidth pode ser 0 antes do layout — usa clientWidth do canvas ou do wrap */
    const sec = document.getElementById('arvoreEvolucaoSection');
    const W = Math.max(
        200,
        canvas.offsetWidth ||
            canvas.clientWidth ||
            (sec && sec.clientWidth) ||
            360
    );
    /* Vertical: “nevoeiro” no topo + tronco mais longo quanto maior o nível (raiz desce na página). */
    const ARVORE_LEAF_IDS = ['forca_1', 'vitalidade_1', 'foco_1', 'carisma_1', 'disciplina_1'];
    const mysteryTopPad = Math.min(440, 40 + nivel * 28);
    const tierStretch   = Math.floor(nivel * 36);
    function _arvoreVertShift(nodeId) {
        if (nodeId === 'despertar') return mysteryTopPad + 2 * tierStretch;
        if (nodeId === 'desconhecido') return mysteryTopPad + tierStretch;
        if (ARVORE_LEAF_IDS.indexOf(nodeId) >= 0) return mysteryTopPad;
        return 0;
    }

    /* Cartões mais finos no telefone (referência ~393px): cabe 5 nós com folga */
    const LEAF_ROW_PY = 100;
    let NODE_HALF = 35;
    if (W <= 520) {
        const usable = W * 0.86;
        const perNode = usable / 5;
        NODE_HALF = Math.max(20, Math.min(30, Math.floor(perNode / 2) - 1));
    } else if (W <= 640) {
        NODE_HALF = Math.max(28, Math.min(34, Math.floor((W * 0.88) / 5 / 2) - 1));
    }
    const useLeafSpread = W < 720;

    let maxAdjY = 0;
    ARVORE_TREE_NODES.forEach(function(n) {
        const py = n.yPx + _arvoreVertShift(n.id);
        maxAdjY = Math.max(maxAdjY, py);
    });
    /* Folga para legenda sob os nós do topo + legenda “O INÍCIO” + scroll confortável */
    const TREE_H = Math.max(520, maxAdjY + NODE_HALF + 100 + Math.min(120, Math.floor(nivel * 6)));

    canvas.style.setProperty('--ar-node-half', NODE_HALF + 'px');
    canvas.style.height = TREE_H + 'px';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + TREE_H);
    svg.setAttribute('width', W);
    svg.setAttribute('height', TREE_H);

    const nodeMap = {};
    ARVORE_TREE_NODES.forEach(function(n) {
        let xPct = n.xPct;
        if (useLeafSpread) {
            const li = ARVORE_LEAF_IDS.indexOf(n.id);
            if (li >= 0) {
                const marg = W < 380 ? 10 : W < 440 ? 11 : 12;
                const span = 100 - 2 * marg;
                xPct = marg + (span * li) / (ARVORE_LEAF_IDS.length - 1);
            }
        }
        const px         = Math.round(W * xPct / 100);
        const py         = n.yPx + _arvoreVertShift(n.id);
        const isUnlocked = nivel >= n.reqNivel;
        const attrData   = n.atributo ? ARVORE_ATTRS[n.atributo] : null;
        const cor        = attrData ? attrData.cor : '#2dd4bf';
        const rgb        = attrData ? attrData.rgb : '45,212,191';
        const isFiltered = !_arvoreActiveAttr || n.atributo === _arvoreActiveAttr || !n.atributo;
        nodeMap[n.id] = Object.assign({}, n, { px: px, py: py, isUnlocked: isUnlocked, cor: cor, rgb: rgb, isFiltered: isFiltered });
    });

    function _branchStroke(a, b) {
        const phys = new Set(['forca', 'vitalidade']);
        const ment = new Set(['foco', 'carisma', 'disciplina']);
        const aA = a?.atributo || null;
        const bA = b?.atributo || null;
        if ((phys.has(aA) && (phys.has(bA) || !bA)) || (phys.has(bA) && !aA)) return '#f87171';
        if ((ment.has(aA) && (ment.has(bA) || !bA)) || (ment.has(bA) && !aA)) return '#60a5fa';
        return '#2dd4bf';
    }

    function _isTrunk(pair) {
        return (pair[0] === 'despertar' && pair[1] === 'desconhecido') || (pair[0] === 'desconhecido' && pair[1] === 'despertar');
    }

    const svgDefsStart = `
        <defs>
            <filter id="arGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="blur"/>
                <feColorMatrix in="blur" type="matrix"
                    values="1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 0.9 0" result="glow"/>
                <feMerge>
                    <feMergeNode in="glow"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
    `;

    function _gradStops(type) {
        if (type === 'trunk') {
            return `
                <stop offset="0%"   stop-color="rgba(45,212,191,0.10)"/>
                <stop offset="35%"  stop-color="rgba(45,212,191,0.75)"/>
                <stop offset="70%"  stop-color="rgba(45,212,191,0.55)"/>
                <stop offset="100%" stop-color="rgba(45,212,191,0.10)"/>
            `;
        }
        if (type === 'phys') {
            return `
                <stop offset="0%"   stop-color="rgba(248,113,113,0.08)"/>
                <stop offset="42%"  stop-color="rgba(248,113,113,0.58)"/>
                <stop offset="100%" stop-color="rgba(248,113,113,0.12)"/>
            `;
        }
        if (type === 'ment') {
            return `
                <stop offset="0%"   stop-color="rgba(96,165,250,0.08)"/>
                <stop offset="42%"  stop-color="rgba(96,165,250,0.58)"/>
                <stop offset="100%" stop-color="rgba(96,165,250,0.12)"/>
            `;
        }
        return `
            <stop offset="0%"   stop-color="rgba(45,212,191,0.07)"/>
            <stop offset="45%"  stop-color="rgba(45,212,191,0.50)"/>
            <stop offset="100%" stop-color="rgba(45,212,191,0.10)"/>
        `;
    }

    let gradDefs = '';
    let lineEls = '';
    ARVORE_CONNECTIONS.forEach(function(pair) {
        const a = nodeMap[pair[0]];
        const b = nodeMap[pair[1]];
        if (!a || !b) return;
        const active = a.isFiltered && b.isFiltered;
        const stroke = _branchStroke(a, b);

        const isTrunk = _isTrunk(pair);
        const isPhys = stroke === '#f87171';
        const isMent = stroke === '#60a5fa';
        const width = isTrunk ? (active ? 2.4 : 1.3) : (active ? 1.6 : 1);
        const op = isTrunk ? (active ? 0.72 : 0.12) : (active ? 0.55 : 0.10);
        const y1 = (a.py - NODE_HALF);
        const y2 = (b.py + NODE_HALF);
        const gradId = 'arG_' + pair[0] + '_' + pair[1];
        const gradType = isTrunk ? 'trunk' : (isPhys ? 'phys' : (isMent ? 'ment' : 'base'));

        // Micro-ajuste: gradiente orientado no ângulo real da linha (userSpaceOnUse)
        gradDefs += `
            <linearGradient id="${gradId}" gradientUnits="userSpaceOnUse" x1="${a.px}" y1="${y1}" x2="${b.px}" y2="${y2}">
                ${_gradStops(gradType)}
            </linearGradient>
        `;

        // "Feixe" (glow) + linha principal
        lineEls += '<line x1="' + a.px + '" y1="' + y1 + '" '
            + 'x2="' + b.px + '" y2="' + y2 + '" '
            + 'stroke="' + (active ? ('url(#' + gradId + ')') : 'rgba(255,255,255,0.08)') + '" '
            + 'stroke-width="' + width + '" '
            + 'stroke-opacity="' + op + '" '
            + 'stroke-linecap="round" filter="' + (active ? 'url(#arGlow)' : '') + '"/>';

        if (active && isTrunk) {
            // Linha extra bem suave para simular o "feixe" central do vídeo
            lineEls += '<line x1="' + a.px + '" y1="' + y1 + '" '
                + 'x2="' + b.px + '" y2="' + y2 + '" '
                + 'stroke="rgba(45,212,191,0.22)" stroke-width="6" stroke-linecap="round" stroke-opacity="0.08"/>';
        }
    });
    svg.innerHTML = svgDefsStart + gradDefs + '</defs>' + lineEls;

    nodesDiv.innerHTML = ARVORE_TREE_NODES.map(function(n) {
        const nd       = nodeMap[n.id];
        let cls        = 'ar-tnode';
        if (!nd.isFiltered) cls += ' ar-tnode--dim';
        if (!nd.isUnlocked) cls += ' ar-tnode--locked';
        const bgAlpha  = nd.isUnlocked ? '0.12' : '0.04';
        const bdrStyle = n.borderStyle || 'solid';
        const st = [
            'left:' + (nd.px - NODE_HALF) + 'px',
            'top:'  + (nd.py - NODE_HALF) + 'px',
            'border-color:' + nd.cor,
            'border-style:' + bdrStyle,
            'background:rgba(' + nd.rgb + ',' + bgAlpha + ')',
        ].join(';');
        const lockDim = Math.max(12, Math.min(18, Math.round(NODE_HALF * 0.48)));
        const lockSvg = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" style="width:${lockDim}px;height:${lockDim}px;opacity:0.85">
            <rect x="5" y="9" width="10" height="9" rx="1.4"/><path d="M7.5 9V6.6a2.5 2.5 0 0 1 5 0V9"/><circle cx="10" cy="13.5" r="0.8" fill="currentColor"/>
        </svg>`;
        const inner = nd.isUnlocked
            ? '<span class="ar-tnode-num">' + (n.numLabel || '') + '</span>'
            : '<span class="ar-tnode-lock" aria-hidden="true">' + lockSvg + '</span>';
        const lbl = n.label ? '<div class="ar-tnode-caption">' + n.label + '</div>' : '';
        return '<div class="' + cls + '" style="' + st + '" onclick="openArvoreModal(\'' + n.id + '\')">'
            + '<div class="ar-tnode-square">' + inner + '</div>'
            + lbl
            + '</div>';
    }).join('');

    const fisico = document.getElementById('arBranchFisico');
    const mental = document.getElementById('arBranchMental');
    const fN  = nodeMap['forca_1'],     vN = nodeMap['vitalidade_1'];
    const foN = nodeMap['foco_1'],       dN = nodeMap['disciplina_1'];
    const labelHalfW = W <= 420 ? 52 : 58;
    const leafRowCenterY = LEAF_ROW_PY + mysteryTopPad;
    const labelTop = Math.round(leafRowCenterY + NODE_HALF + 10);
    if (fisico && fN && vN) {
        fisico.style.left = Math.round((fN.px + vN.px) / 2 - labelHalfW) + 'px';
        fisico.style.top  = labelTop + 'px';
    }
    if (mental && foN && dN) {
        mental.style.left = Math.round((foN.px + dN.px) / 2 - labelHalfW) + 'px';
        mental.style.top  = labelTop + 'px';
    }
}

function openArvoreModal(nodeId) {
    const node = ARVORE_TREE_NODES.find(function(n) { return n.id === nodeId; });
    if (!node) return;
    const overlay  = document.getElementById('arvoreModalOverlay');
    if (!overlay) return;
    const attrData = node.atributo ? ARVORE_ATTRS[node.atributo] : null;
    const cor      = attrData ? attrData.cor : '#2dd4bf';
    const iconWrap = document.getElementById('arvoreModalIconWrap');
    const iconEl   = document.getElementById('arvoreModalIcon');
    const titleEl  = document.getElementById('arvoreModalTitle');
    const virtEl   = document.getElementById('arvoreModalVirtudes');
    const quoteEl  = document.getElementById('arvoreModalQuote');
    const footEl   = document.getElementById('arvoreModalNivelFase');
    if (iconWrap) {
        iconWrap.style.borderColor = cor;
        iconWrap.style.color       = cor;
        iconWrap.style.boxShadow   = '0 0 20px rgba(45,212,191,0.25)';
    }
    if (iconEl)  iconEl.textContent  = node.icon;
    if (titleEl) { titleEl.textContent = node.nome; titleEl.style.color = cor; }
    if (virtEl)  virtEl.textContent  = node.virtudes;
    if (quoteEl) quoteEl.innerHTML   = '<span class="ar-quote-mark">&ldquo;</span><em>' + node.quote + '</em>';
    if (footEl)  footEl.innerHTML    = 'NÍVEL ' + node.nivel + '&nbsp;&nbsp;&nbsp;FASE ' + node.fase;
    overlay.classList.add('active');
    const nivelAtual = gameSystem.data.nivel || 0;
    if (!gameSystem.data.arvoreDesbloqueados) gameSystem.data.arvoreDesbloqueados = [];
    if (nivelAtual >= node.reqNivel && !gameSystem.data.arvoreDesbloqueados.includes(nodeId)) {
        gameSystem.data.arvoreDesbloqueados.push(nodeId);
        gameSystem.saveData();
    }
}

function closeArvoreModal() {
    const overlay = document.getElementById('arvoreModalOverlay');
    if (overlay) overlay.classList.remove('active');
}

/* ===========================================
   ARQUITETO PERSONAGEM
   =========================================== */

function initArquitetoPersonagem() {
    renderArquitetoPersonagem();
}

function renderArquitetoPersonagem() {
    const nivel   = gameSystem.data.nivel ?? 0;
    const unlocked = AP_FRAGMENTS.filter(f => nivel >= f.reqNivel);

    const badge = document.getElementById('apUnlockBadge');
    if (badge) badge.textContent = `NÍVEL ${nivel} DESBLOQUEADO`;

    const info = document.getElementById('apFragmentsInfo');
    if (info) info.textContent = `${unlocked.length} de ${AP_FRAGMENTS.length} fragmentos revelados`;

    const list = document.getElementById('apFragmentsList');
    if (!list) return;

    const lockSvg = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><rect x="4" y="9" width="12" height="9" rx="1.6" fill="currentColor" fill-opacity="0.08"/><rect x="4" y="9" width="12" height="9" rx="1.6"/><path d="M7 9V6.6a3 3 0 0 1 6 0V9"/><circle cx="10" cy="13.6" r="0.95" fill="currentColor"/></svg>`;
    const unlockSvg = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px"><rect x="4" y="9" width="12" height="9" rx="1.6" fill="currentColor" fill-opacity="0.10"/><rect x="4" y="9" width="12" height="9" rx="1.6"/><path d="M7 9V6.6a3 3 0 0 1 6 0"/><circle cx="10" cy="13.6" r="0.95" fill="currentColor"/></svg>`;

    list.innerHTML = AP_FRAGMENTS.map(f => {
        const isUnlocked = nivel >= f.reqNivel;
        const idx = AP_FRAGMENTS.indexOf(f) + 1;
        const isFirstUnlocked = isUnlocked && idx === 1;
        const topBadge = isFirstUnlocked ? `<span class="ap-badge ap-badge--novo">NOVO</span>` : (isUnlocked ? `<span class="ap-badge ap-badge--nivel">NÍVEL ${f.reqNivel}</span>` : `<span class="ap-badge ap-badge--locked">BLOQUEADO</span>`);
        const title = isUnlocked ? `Fragmento ${idx} de ${AP_FRAGMENTS.length} — ${f.nome}` : `Fragmento ${idx} de ${AP_FRAGMENTS.length} — Bloqueado`;
        const desc = isUnlocked ? f.desc : `Alcance o nível ${f.reqNivel} para desbloquear este fragmento.`;
        return `
            <div class="ap-frag-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="ap-frag-icon" aria-hidden="true">${isUnlocked ? unlockSvg : lockSvg}</div>
                <div class="ap-frag-body">
                    <div class="ap-frag-toprow">
                        ${topBadge}
                        <span class="ap-frag-req">NÍVEL ${f.reqNivel}</span>
                    </div>
                    <div class="ap-frag-title">${title}</div>
                    <div class="ap-frag-text">${desc}</div>
                </div>
            </div>
        `;
    }).join('');
}


/* ===========================================
   SUPORTE E INSTALAÇÃO
   =========================================== */

function initSuporte() {
    renderSuporteTickets();

    const ticketBtn = document.getElementById('abrirTicketBtn');
    if (ticketBtn) ticketBtn.addEventListener('click', showTicketModal);
}

function renderSuporteTickets() {
    const list = document.getElementById('suporteTicketsList');
    if (!list) return;

    const tickets = gameSystem.data.suporteTickets || [];
    if (!tickets.length) {
        list.innerHTML = '<div class="mz-empty" style="padding:16px 0">Nenhum ticket aberto.</div>';
        return;
    }
    list.innerHTML = [...tickets].reverse().map(t => `
        <div class="sp-ticket-item">
            <div class="sp-ticket-header">
                <span class="sp-ticket-id">#${t.id}</span>
                <span class="sp-ticket-status ${t.status === 'aberto' ? 'sp-ticket-status--aberto' : 'sp-ticket-status--resolvido'}">${t.status}</span>
            </div>
            <div class="sp-ticket-msg">${t.msg}</div>
            <div class="sp-ticket-date">${t.data}</div>
        </div>`).join('');
}

function showTicketModal() {
    const overlay = document.createElement('div');
    overlay.className = 'sp-ticket-modal-overlay';
    overlay.innerHTML = `<div class="sp-ticket-modal">
        <div class="sp-ticket-modal-title">Novo Ticket de Suporte</div>
        <textarea id="spTicketMsg" placeholder="Descreva sua dúvida ou problema..."></textarea>
        <div class="sp-ticket-modal-actions">
            <button class="btn-modal-cancel" onclick="this.closest('.sp-ticket-modal-overlay').remove()">Cancelar</button>
            <button class="btn-modal-confirm" onclick="submitTicket()">Enviar</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.querySelector('#spTicketMsg')?.focus(), 50);
}

function submitTicket() {
    const msg = document.getElementById('spTicketMsg')?.value.trim();
    if (!msg) return;

    if (!gameSystem.data.suporteTickets) gameSystem.data.suporteTickets = [];
    const id = String(Date.now()).slice(-6);
    gameSystem.data.suporteTickets.push({
        id, msg, status: 'aberto',
        data: new Date().toLocaleDateString('pt-BR')
    });
    gameSystem.saveData();
    document.querySelector('.sp-ticket-modal-overlay')?.remove();
    renderSuporteTickets();
    showCfgSuccess('Ticket #' + id + ' enviado!');
}

/* ===========================================
   CONFIGURAÇÕES
   =========================================== */

function initConfiguracoes() {
    const d = gameSystem.data;

    const cfgNome    = document.getElementById('cfgNome');
    const cfgApelido = document.getElementById('cfgApelido');
    if (cfgNome)    cfgNome.value    = d.nome    || '';
    if (cfgApelido) cfgApelido.value = d.apelido || '';

    const cfgApiKey = document.getElementById('cfgApiKey');
    if (cfgApiKey) cfgApiKey.value = localStorage.getItem('openRouterApiKey') || '';

    const cfgToggle = document.getElementById('cfgApiKeyToggle');
    if (cfgToggle) {
        cfgToggle.addEventListener('click', () => {
            const input = document.getElementById('cfgApiKey');
            if (!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    }

    const cfgMetaTreinos = document.getElementById('cfgMetaTreinos');
    const cfgMetaEstudos = document.getElementById('cfgMetaEstudos');
    if (cfgMetaTreinos) cfgMetaTreinos.value = d.metaTreinoSemanal || d.treinoMeta || 5;
    if (cfgMetaEstudos)  cfgMetaEstudos.value  = d.metaEstudoSemanal  || d.estudoMeta  || 10;

    const savePerfilBtn = document.getElementById('cfgSalvarPerfilBtn');
    if (savePerfilBtn) savePerfilBtn.addEventListener('click', saveConfigPerfil);

    const saveIaBtn = document.getElementById('cfgSalvarApiKeyBtn');
    if (saveIaBtn) saveIaBtn.addEventListener('click', saveConfigIA);

    const saveMetasBtn = document.getElementById('cfgSalvarMetasBtn');
    if (saveMetasBtn) saveMetasBtn.addEventListener('click', saveConfigMetas);

    const resetBtn = document.getElementById('cfgResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Tem certeza? TODOS os dados serão apagados permanentemente.')) {
                if (confirm('Confirmar exclusão total dos dados do sistema?')) {
                    localStorage.removeItem('gameSystemData');
                    localStorage.removeItem('arquitetoChatHistory');
                    localStorage.removeItem('openRouterApiKey');
                    window.location.reload();
                }
            }
        });
    }

    const connectBtn = document.getElementById('cfgConnectArquitetoBtn');
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            showToast('Integração WhatsApp em desenvolvimento', 'info');
        });
    }
}

function saveConfigPerfil() {
    const nome    = document.getElementById('cfgNome')?.value.trim();
    const apelido = document.getElementById('cfgApelido')?.value.trim();
    if (!nome || !apelido) {
        alert('Preencha nome e apelido.');
        return;
    }
    gameSystem.data.nome = nome;
    gameSystem.data.apelido = apelido;
    try {
        localStorage.setItem('sl_identity_name', nome.toUpperCase().slice(0, 18));
    } catch (e) {
        /* ignore quota / private mode */
    }
    gameSystem.saveData();
    if (typeof gameSystem.updateAllDisplays === 'function') {
        gameSystem.updateAllDisplays();
    }
    showCfgSuccess('Perfil salvo com sucesso!');
}

function saveConfigIA() {
    const key = document.getElementById('cfgApiKey')?.value.trim();
    localStorage.setItem('openRouterApiKey', key || '');
    if (key) {
        const banner   = document.getElementById('arqApikeyBanner');
        const chatWrap = document.getElementById('arqChatWrap');
        if (banner)   banner.style.display   = 'none';
        if (chatWrap) chatWrap.style.display = 'flex';
    }
    showCfgSuccess('Chave da API salva!');
}

function saveConfigMetas() {
    const treino  = parseInt(document.getElementById('cfgMetaTreinos')?.value) || 5;
    const estudo  = parseInt(document.getElementById('cfgMetaEstudos')?.value) || 10;
    gameSystem.data.metaTreinoSemanal = treino;
    gameSystem.data.metaEstudoSemanal = estudo;
    gameSystem.data.treinoMeta = treino;
    gameSystem.data.estudoMeta = estudo;
    gameSystem.saveData();
    showCfgSuccess('Metas salvas com sucesso!');
}

function showCfgSuccess(msg) {
    let el = document.getElementById('sysSuccessToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'sysSuccessToast';
        el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:rgba(74,222,128,0.15);border:1px solid rgba(74,222,128,0.4);color:#4ade80;padding:10px 18px;border-radius:8px;font-size:0.78rem;font-weight:700;z-index:9999;transition:opacity 0.4s;pointer-events:none';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

/* ===========================================
   CSS RUNTIME SCAN (DOM tokens)
   ===========================================
   - Emite no console um dump das classes/IDs realmente presentes no DOM.
   - Usado para limpeza final do CSS com risco mínimo (inclui conteúdo gerado via JS).
*/
(function setupCssRuntimeScan() {
    try {
        const PREFIX = 'CSS_RUNTIME_TOKENS_V1';
        const ENABLED =
            /[?&]cssScan=1(?:&|$)/.test(String(window.location.search || '')) ||
            localStorage.getItem('cssRuntimeScan') === '1';

        // Sempre expõe a API manual, mas só faz dumps automáticos quando habilitado.

        function collectDomTokens() {
            const classes = new Set();
            const ids = new Set();

            document.querySelectorAll('[class]').forEach((el) => {
                const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean);
                cls.forEach(c => classes.add(c));
            });

            document.querySelectorAll('[id]').forEach((el) => {
                const id = el.getAttribute('id');
                if (id) ids.add(id);
            });

            return {
                classes: Array.from(classes).sort(),
                ids: Array.from(ids).sort(),
            };
        }

        function emit(label) {
            const payload = collectDomTokens();
            // Uma linha só para facilitar captura via ferramentas
            console.log(`${PREFIX} ${label} ${JSON.stringify(payload)}`);
            return payload;
        }

        // API manual (útil se quisermos disparar via console)
        window.__emitCssRuntimeTokens = emit;
        window.__enableCssRuntimeScan = () => {
            try { localStorage.setItem('cssRuntimeScan', '1'); } catch {}
            console.log(`${PREFIX} enabled`);
        };
        window.__disableCssRuntimeScan = () => {
            try { localStorage.removeItem('cssRuntimeScan'); } catch {}
            console.log(`${PREFIX} disabled`);
        };

        if (ENABLED) {
            // Dump pós-load + dumps ao trocar abas
            window.addEventListener('load', () => {
                setTimeout(() => emit('load+800ms'), 800);
                setTimeout(() => emit('load+2000ms'), 2000);
            });

            document.addEventListener('click', (ev) => {
                const btn = ev.target?.closest?.('.sys-nav-item');
                if (!btn) return;
                const tab = btn.getAttribute('data-tab') || 'unknown';
                setTimeout(() => emit(`tab:${tab}+350ms`), 350);
            }, true);
        }
    } catch (e) {
        // Não quebrar a app caso algo dê errado
        console.log('CSS_RUNTIME_TOKENS_V1 error');
    }
})();
