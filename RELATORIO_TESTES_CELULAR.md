# Relatório de testes no celular (Xiaomi 2311DRK48G, APK debug, 2026-10-03)

Método: app dirigido via Chrome DevTools Protocol (WebView) + toques/teclado reais via adb. Dados originais restaurados ao final.

# Achados (teste no celular)
- F1 [baixo] Missão "Única" exibe tag "Diária" (tag usa recurrence.type, ignora unique).
- F2 [medio] Missão com barra de progresso conclui no 1º clique em Completar (+1 só existe na UI antiga .task-item); recompensa total sem atingir max.
- F3 [alto/seg] XSS armazenado: título com <img onerror> executa em popup/lista de notificações (notification.title/message em innerHTML sem escape). Outros sinks: treino.nome, exercicio/grupo nome, skill/runa nome, h.titulo (7608), modais 8978-9031.
- F4 [info] Título é forçado a MAIÚSCULAS ao salvar.
- OK: criar missão pela UI, completar (+XP/+moedas/+atributo, toast), diária some após completar, título vazio bloqueado.
- F5 [baixo] Título da seção fica 'Missões de Hoje' ao navegar para outro dia (Próximo/Anterior).
- F6 [baixo] Cabeçalho '0 missões pendentes' enquanto a lista de Hoje mostra 2 pendentes (a verificar).
- OK: editar, arquivar (confirm nativo ok), busca, estado vazio, nav de dia.
- F7 [baixo] Zona de Falha mostra 'DIAS SEM FALHA 366 / MELHOR SEQUÊNCIA 365' para conta nova (calc conta 400 dias para trás sem limitar ao início do rastreio).
- F8 [medio/design] Penalidade automática só avalia HÁBITOS (data.habitos); missões recorrentes não cumpridas nunca penalizam. Verificar se há UI para criar hábitos.
- F9 [seg] penalty description/notification title/message vão sem escape para innerHTML (mesmo sink do F3).
- OK: level up (XP excedente, expN x1.2, HP max +20%).
- F10 [medio] Botão 'Adicionar hábito' (#addHabitBtn) existe no DOM mas está oculto: hábitos não podem ser criados pela UI -> penalidade automática e 'Vitalidade por hábitos' ficam inacessíveis.
- OK: penalidade manual (HP, registro, notificação, totais).
- F11 [baixo] Penalidade automática lista hábitos vazios: usa h.nome mas hábitos têm .titulo.
- F12 [alto] checkDailyPenalties: new Date('YYYY-MM-DD') é UTC -> no BRT começa 1 dia ANTES (reavalia/penaliza dia já checado: -200 HP indevido). Fix: parsear data local.
- OK: penalidade automática por hábito, dedup por data.
- F13 [baixo] Treino: subtítulo diz "missões pendentes" em vez de "treinos" (texto stale).
- F14 [alto] Treino criado NÃO aparece na lista (nem ao abrir a aba): renderTreinoVideo() só roda em eventos específicos; lista fica "Nenhum treino encontrado" até outra ação.
- F15 [medio] buildTrainingCardHtmlVideo tem aspas curvas no botão editar (type=”button” class=”vid-mission-mini js-train-edit”): atributo quebrado, editar treino provavelmente não funciona.
- F15 REVISADO [CRÍTICO] System_script.js:4531-4564 (buildTrainingCardHtmlVideo): TODAS as aspas dos atributos são curvas (”). Botões Completar/Editar/Excluir/› do treino perdem classe js-train-*: treino NÃO pode ser concluído, editado nem excluído pela UI. Só o cadastro funciona.
- F16 [baixo] Cartão de treino mostra "+50 XP | +Força" fixo (texto hardcoded).
- F17 [info] completeTraining não dá moedas (PROJETO.md diz que treino gera moedas).
- OK (via função): concluir treino +50 XP, +0.15 Força, contador semanal, idempotente.
- F18 [medio/design] Preços da Loja do Tempo (8.000-35.000 G) vs ganho por missão (~20 G): economia desbalanceada (centenas de missões por item).
- F19 [baixo] "Histórico de Compras" é stub (toast "em desenvolvimento").
- F20 [baixo] Compra sem saldo: sem toast/feedback (modal só permanece aberto) - confirmar visualmente.
- OK: comprar item com quantidade (débito correto, inventário), persistência após reload do WebView.
- F20 CORRIGIDO: sem saldo usa alert() nativo ("Moedas insuficientes!") - feedback existe, mas é alert bloqueante.
- F21 [medio] Loja: modalBuy chama closeShopModal() (currentItem=null) e DEPOIS lê currentItem.name -> TypeError; compra é feita mas notificação "COMPRA REALIZADA!" não é criada.
- F22 [baixo/UX] Item personalizado (Itens de Recompensa) exige upload de imagem obrigatório (itemIcon required), sem opção emoji como nas recompensas da Loja.
- F3 CONFIRMADO em 2º sink: Matriz de Prioridades renderiza t.texto sem escape -> XSS executa (window.__x2=1).
- F23 [info] Matriz usa layout "video2" com só 2 quadrantes (q1,q2); q3/q4 existem no modelo mas não na UI.
- OK: Itens de Recompensa (adicionar item custom com imagem), Matriz (adicionar/alternar/remover, cancelar, vazio).
- F24 RETIRADO (falso alarme: dois overlays vieram de 2 cliques meus). Detalhe menor: clicar 2x em + Adicionar Item empilha modais com IDs duplicados (Salvar lê o 1º).

- F25 [CRÍTICO] Arquiteto IA nunca funciona: callOpenRouter (System_script.js:9310) envia header 'X-Title': 'System Level Up — Arquiteto IA' com travessão (U+2014, fora de ISO-8859-1). fetch() lança TypeError em TODA chamada -> catch tenta os 20 modelos e mostra "Todos os modelos gratuitos estão indisponíveis". Confirmado: com ASCII o endpoint responde (401 com chave falsa). Afeta chat, refinar missão com IA e análise de habilidades (único call site).
- OK: sem chave -> mensagem amigável; salvar chave; sugestões rápidas.
- F26 [baixo] Progresso exibe texto de desenvolvimento visível: "Alinhado ao frame".
- F27 [baixo] Botão SAIR só recarrega a página (não encerra sessão/login); FAB "+" do Painel só vai para Missões.
- OK: menu lateral (abrir/rolar/navegar por toque real), Calendário (mês/semana/hoje), Notificações (filtros/excluir), Arena, Progresso, Virtudes, Arquiteto-Personagem, Árvore (renderiza; nós bloqueados por nível).
- F28 [medio] Botão "CONFIGURAÇÕES" do rodapé do menu lateral (#settingsBtn) não tem handler: toque não faz nada (o item de lista "CONFIGURAÇÕES" funciona).
- F29 [baixo] Salvar Perfil/Metas sem toast de confirmação.
- F30 [medio] Salvar Metas aceita meta de treinos negativa (-5); metas 0 rejeitadas silenciosamente: validação inconsistente e sem mensagem.
- F31 [info] Toggles "Efeitos Sonoros"/"Voz do Arquiteto" (mock de celular na aba Config) não fazem nada.
- F32 [baixo] Card "Use o Sistema pelo WhatsApp" + "Conectar ao Arquiteto" é stub ("Integração WhatsApp em desenvolvimento") - promessa de funcionalidade inexistente.
- F33 [info] Foto de perfil vira dataURL dentro de gameSystemData (sem limite de tamanho): pode estourar localStorage e inflar o sync.
- OK: salvar perfil (reflete no Painel), metas válidas, ocultar/mostrar chave, importar/remover foto.
- F34 [medio] Abas da Loja "RECOMPENSAS/POÇÕES/INVENTÁRIO" ficam ocultas: itens comprados (ex.: SESSÃO TV x3) não aparecem em lugar nenhum e não podem ser usados/consumidos; poções de HP não existem na loja visível. Moedas gastas sem retorno.
- F35 [alto/design] Runas do catálogo (+10% XP, +3 moedas/missão "sempre ativa", etc.) não têm efeito: nenhum código aplica multiplicador em addExp/applyTaskRewards/addMoedas (só UI usa getRunaCatalogoAtiva). Ativar runa gasta MP sem benefício.
- F36 [baixo] applyTaskRewards ignora atributoValor para Vitalidade e Disciplina (chama addVitalidade()/addDisciplina() sem argumento).
- F37 [medio] Seleção de classe (nível 50) só é exibida no init (ao abrir o app). Subir para 50 durante o uso não abre o modal até reiniciar.
- F38 [medio] init() faz return ao mostrar seleção de classe: initMpRecovery/updateAllDisplays/checkWeeklyAnalysis/checkDailyPenalties/checkTitles/verificarDesafios/checkRunas NÃO rodam enquanto a classe não for escolhida.
- OK: level up múltiplo -> RANK UP duplo (E->C no nível 50), notificações levelup/rankup.
- F39 [medio/design] Bônus de classe ("Bônus em FORÇA", multiplicador de moedas do PROJETO.md) não existe: com Bárbaro, addForca(1)=+1, moedas +100=+100. addSabedoria(1) dá só +0.15 (ignora argumento) - funções de atributo inconsistentes.
- OK: modal de seleção de classe (toque real), classe/estágio gravados, notificação.
- F40 [medio] Uso de memória alto: ~555 MB PSS (dumpsys meminfo) com o app aberto no Painel; risco em aparelhos de entrada. Suspeitas: GIFs grandes, partículas, imagens do Arena sem redimensionar.
- OK: persistência após matar o processo; cold start ~6 s.
- F41 [baixo] Botão Voltar do Android fecha o app direto (sem voltar de aba / fechar modal / menu) - sem tratamento de back (Capacitor App plugin).
- F42 [baixo] Paisagem: faixa cinza à esquerda (área do notch) fora do tema escuro.
- F43 [baixo] Título de nível mostra "NÍVEL 50 - O Despertar" (nome da fase não evolui com nível/rank).
- OK: rotação paisagem sem overflow horizontal.
- F41 CONFIRMADO+: BACK com modal "Criar Missão" aberto fecha o app inteiro e descarta o formulário.
- F44 [baixo] "Sugerir (local)" para "Caminhar 30 min" preencheu EXP 47, moedas 0, sem atributo e sem segmento (sugestão fraca).
- OK: digitação com teclado Android real, modal reajusta ao teclado, botão Sugerir.
- F45 [ALTO] shouldTaskAppearToday (System_script.js ~2985) e checkDailyPenalties (~1462), loop 2112: new Date('YYYY-MM-DD') é UTC; no BRT vira o dia anterior 21h. Resultado medido: missão semanal iniciada na segunda aparece no DOMINGO; "a cada 3 dias" começando 01/10 aparece em 03 e 06 (esperado 01,04,07); semanal quinzenal nunca cai na segunda. Fix: parse local (new Date(y,m-1,d)).
- F46 [baixo] Mensal no dia 29-31 é pulada nos meses curtos (sem clamp para o último dia); anual 29/02 vira 28/02 também em ano bissexto.
- OK: lógica diária com data futura, única (aparece até concluir), inativa, completar idempotente.
- F47 [medio] Módulo de Estudos (showStudyModal/addStudyBtn) existe no código mas não há aba/entrada na UI: horas de estudo não podem ser registradas -> 7 títulos "horas_estudo" e Sabedoria por estudo ficam inalcançáveis; hábitos idem (F10). Títulos de atributo usam nomes antigos (inteligente/ágil/resiliente/perceptivo).
- F48 [baixo] Progresso: "XP ACUMULADO" mostra 4 (valor sem sentido); "CLASSIFICAÇÃO Iniciante" no nível 50.
- F49 [medio/design] Morte (HP 0): só notificação "MORTE!"; sem consequência (nem XP/nível, nem bloqueio, nem overlay): penalidades perdem peso.
- OK: Virtudes e Fragmentos do Arquiteto desbloqueiam por nível (nível 50: todas as virtudes).
- F50 [medio] Árvore de Evolução no celular: ~1000 px de espaço vazio entre os filtros de atributo e os cards (que ficam colados no fim da tela); cards só aparecem rolando muito.


## Status das correções (rodada 1)
Corrigidos e revalidados (navegador + celular): F25 (X-Title), F15/F14 (treino: botões e lista), F45/F12 (datas locais), F3/F9 (XSS: escape nos renders), F35 (efeito das runas), F36 (valor de atributo), F2 (barra de progresso), F21 (compra na loja), F28 (botão Configurações), F37/F38 (classe nível 50), F41 (botão Voltar), F11 (nomes de hábitos), F1 (tag Única).
Corrigido no sync: falso conflito a cada abertura (hash canônico do conteúdo).
Pendentes: F34 (inventário), F47/F10 (hábitos/estudos sem UI), F39 (bônus de classe), F40 (memória), F50 (Árvore), demais baixos.
