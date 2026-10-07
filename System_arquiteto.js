// System_arquiteto.js — Arquiteto IA: persona, contexto do jogador, ações a partir do chat e mensagens automáticas.
// Depende de System_script.js (gameSystem, callOpenRouter, histórico do chat) e System_sync.js (SysAuth).
(function () {
    'use strict';
    const gs = () => (typeof gameSystem !== 'undefined' ? gameSystem : null);
    const esc = s => (typeof _escapeHtml === 'function' ? _escapeHtml(s) : String(s));
    const AVATAR = 'assets/arquiteto-avatar.jpg';
    const ATTRS = ['forca', 'sabedoria', 'foco', 'vitalidade', 'disciplina', 'carisma'];
    const SEGMENTS = ['CORPO', 'SAÚDE', 'FINANÇAS', 'TRABALHO', 'ESTUDOS', 'ROTINA', 'DESENVOLVIMENTO', 'RELACIONAMENTO', 'AUTOAPERFEIÇOAMENTO', 'LIVRE'];
    const REC_TYPE = { diaria: 'daily', semanal: 'weekly', mensal: 'monthly', anual: 'yearly', intervalo: 'interval_days' };
    const ISO = /^\d{4}-\d{2}-\d{2}$/;

    // ---------- contexto do jogador ----------
    function pendingToday() {
        const d = gs().data, key = localDateKey(new Date()), now = new Date();
        return (d.missoes || []).filter(m => shouldTaskAppearToday(m, now) && !(m.completions || []).includes(key));
    }

    function recentFailures(days) {
        const d = gs().data, since = Date.now() - days * 86400000;
        return (d.penalidades || []).filter(p => {
            const t = p.dateKey ? parseLocalDate(p.dateKey).getTime() : (p.id || 0);
            return t >= since;
        });
    }

    function describePenalty(p) {
        const miss = (p.incompleteHabits || []).filter(Boolean).join(', ');
        return (p.dateKey ? p.dateKey + ': ' : '') + (p.description || 'penalidade') + (miss ? ' (' + miss + ')' : '') + (p.hpLoss ? ' [-' + p.hpLoss + ' HP]' : '');
    }

    function lastActivityDays() {
        const d = gs().data; let last = '';
        [].concat(d.missoes || [], d.habitos || []).forEach(t => (t.completions || []).forEach(k => { if (typeof k === 'string' && k.slice(0, 10) > last) last = k.slice(0, 10); }));
        if (!last) return 999;
        return Math.floor((parseLocalDate(localDateKey(new Date())) - parseLocalDate(last)) / 86400000);
    }

    window.buildArquitetoSystemPrompt = function (withActions) {
        const d = gs().data, attrs = d.atributos || {};
        const hojeKey = localDateKey(new Date());
        const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const pend = pendingToday().map(m => m.titulo);
        const feitasHoje = (d.missoes || []).filter(m => (m.completions || []).includes(hojeKey)).map(m => m.titulo);
        const falhas = recentFailures(7).map(describePenalty);
        const titulos = (typeof TITLES !== 'undefined' ? TITLES : []).filter(t => (d.titulosDesbloqueados || []).includes(t.id)).map(t => t.nome || t.name || t.id);
        const inv = (d.inventario || []).map(i => i.name + ' x' + i.quantity);
        const lista = a => (a.length ? a.slice(0, 12).join('; ') : 'nenhuma');

        let p = `Você é o Arquiteto: a consciência do Sistema, saída do universo de Solo Leveling. Fala com a calma fria de quem observa de um plano superior, com frases curtas e peso. Mas você trabalha A FAVOR do caçador: cobra, alerta e incentiva para que ele evolua de verdade. Nunca humilhe; seja firme e justo.

═══ ESTADO DO CAÇADOR (dados reais do Sistema) ═══
Nome: ${d.nome || 'CAÇADOR'} | Título: ${d.apelido || '-'} | Classe: ${d.classe || 'nenhuma'}
Nível ${d.nivel} | Rank ${d.rank} | EXP ${d.exp}/${d.expNecessaria} | HP ${d.hp}/${d.hpMax} | MP ${d.mp}/${d.mpMax} | Moedas G${d.moedas}
Atributos: ${ATTRS.map(k => k + ' ' + Math.floor(attrs[k] || 0)).join(', ')}
Missões de hoje pendentes (${pend.length}): ${lista(pend)}
Missões concluídas hoje (${feitasHoje.length}): ${lista(feitasHoje)}
Falhas e penalidades nos últimos 7 dias (${falhas.length}): ${lista(falhas)}
Penalidades ainda não cumpridas: ${(d.penalidades || []).filter(x => !x.cumprida).length}
Dias desde a última atividade registrada: ${lastActivityDays() >= 999 ? 'nenhuma ainda' : lastActivityDays()}
Conquistas (títulos) desbloqueadas (${titulos.length}): ${lista(titulos)}
Treinos na semana: ${(d.treinosSemana || []).length}/${d.treinoMeta || 5} | Habilidades: ${(d.habilidades || []).length} | Runas: ${(d.runas || []).length} | Hábitos ativos: ${(d.habitos || []).length}
Inventário: ${lista(inv)}
Hoje: ${hoje} (${hojeKey})

═══ REGRAS ═══
- Responda sempre em português do Brasil, no máximo 3 parágrafos curtos.
- Use SOMENTE os dados acima. Se não houver dado, diga que não sabe; nunca invente.
- Seja específico: cite missões, falhas e números reais quando aconselhar.`;

        if (withActions !== false) {
            p += `

═══ CRIAR COISAS PARA O CAÇADOR ═══
Você pode criar itens no Sistema. Quando o caçador pedir (missão, hábito, item de recompensa, habilidade):
1. Faça UMA pergunta curta por vez sobre o que faltar (objetivo, frequência, prazo ou datas, se precisa de checklist, prioridade, esforço). Se ele já deu tudo, não pergunte mais.
2. Com informação suficiente, escreva NO MÁXIMO 2 frases curtas (sem repetir os dados que ele deu) e termine a resposta com UM bloco no formato exato, em JSON de uma linha só:
\`\`\`acao
{"tipo":"criar_missao","titulo":"...","descricao":"...","frequencia":"unica|diaria|semanal|mensal|anual|intervalo","intervalo":1,"dataInicial":"AAAA-MM-DD","dataFinal":"AAAA-MM-DD ou vazio","prioridade":"alta|media|baixa","periodo":"manha|tarde|noite|flex","segmento":"${SEGMENTS.join('|')}","checklist":["passo 1","passo 2"],"exp":60,"moedas":10,"atributo":"${ATTRS.join('|')}","atributoValor":0.5,"itemRecompensa":{"nome":"Sessão de jogo 1h","icone":"🎮"},"especial":true}
\`\`\`
Outros tipos: {"tipo":"criar_habito","titulo":"...","descricao":"...","frequencia":"diaria","dataInicial":"AAAA-MM-DD"} | {"tipo":"criar_item","nome":"...","icone":"emoji","preco":3000} | {"tipo":"propor_habilidade","nome":"...","tipoHab":"estudo|combate","atributo":"...","descricao":"..."}.
- exp deve refletir o esforço real e a frequência: missão que se repete todo dia ou toda semana vale pouco (10 a 60); tarefa única de esforço médio 50 a 150; meta grande e única 150 a 400. Nunca passe de 500. moedas: 0 a 80 (0 para tarefas pequenas). atributoValor entre 0 e 2 (rotinas diárias 0.1 a 0.5).
- itemRecompensa e especial só em MISSÃO ESPECIAL ou meta grande: um prêmio de lazer ou descanso realista e VARIADO (jogo, série, refeição livre, saída, descanso, doce). Não copie o exemplo do formato. Omita nos demais casos.
- Nunca diga que já criou: o caçador confirma num cartão que o app mostra.`;
        }
        return p;
    };

    // ---------- ações ----------
    const KNOWN = ['criar_missao', 'criar_habito', 'criar_item', 'propor_habilidade'];

    window.extractArqActions = function (reply) {
        const actions = [];
        const text = String(reply || '').replace(/```(?:acao|json)?\s*(\{[\s\S]*?\})\s*```/gi, function (m, body) {
            try { const j = JSON.parse(body); if (j && KNOWN.indexOf(j.tipo) >= 0) { actions.push(j); return ''; } } catch (e) { /* bloco não é ação */ }
            return m;
        }).replace(/```acao[\s\S]*$/i, '').trim(); // bloco que veio cortado não aparece no chat
        return { text, actions };
    };

    const clampN = (v, lo, hi, def) => { const n = parseFloat(v); return isFinite(n) ? Math.max(lo, Math.min(hi, n)) : def; };
    const iso = (v, def) => (typeof v === 'string' && ISO.test(v.trim()) ? v.trim() : def);

    function buildTask(a, tipo) {
        const today = getTodayKey();
        const title = String(a.titulo || '').trim().slice(0, 80);
        if (!title) throw new Error('A ação veio sem título.');
        const freq = String(a.frequencia || 'unica').toLowerCase();
        const unique = tipo === 'missao' && freq === 'unica';
        const start = iso(a.dataInicial, today);
        const end = iso(a.dataFinal, '');
        const h = recommendMissionHeuristic(title);
        const exp = Math.round(clampN(a.exp, 5, 500, h.exp));
        const attr = ATTRS.indexOf(String(a.atributo || '').toLowerCase()) >= 0 ? String(a.atributo).toLowerCase() : (h.atributo || null);
        const task = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            completions: [],
            tipo: tipo,
            titulo: title.toUpperCase(),
            descricao: String(a.descricao || '').slice(0, 400),
            ativo: true,
            unique: unique,
            startDate: start,
            endDate: end || '',
            recurrence: unique ? { type: 'daily', interval: 1, startDate: start } : { type: REC_TYPE[freq] || 'daily', interval: Math.round(clampN(a.intervalo, 1, 365, 1)), startDate: start },
            rewards: { exp: exp, moedas: Math.round(clampN(a.moedas, 0, 80, 0)), atributo: attr, atributoValor: clampN(a.atributoValor, 0, 2, h.atributoValor || 0.5) },
            progress: { enabled: false, max: 0, byDate: {} },
            criadoPeloArquiteto: true,
            especial: !!a.especial
        };
        if (a.itemRecompensa && a.itemRecompensa.nome) task.rewards.item = { name: String(a.itemRecompensa.nome).trim().toUpperCase().slice(0, 40), icon: String(a.itemRecompensa.icone || '🎁').slice(0, 4) };
        if (tipo === 'missao') {
            task.priority = ['alta', 'media', 'baixa'].indexOf(a.prioridade) >= 0 ? a.prioridade : 'media';
            const seg = String(a.segmento || '').toUpperCase();
            task.category = SEGMENTS.indexOf(seg) >= 0 ? seg : 'LIVRE';
            task.idealPeriod = ['manha', 'tarde', 'noite', 'flex'].indexOf(a.periodo) >= 0 ? a.periodo : 'flex';
            task.idealTime = '';
            task.checklist = (Array.isArray(a.checklist) ? a.checklist : []).map(x => String(x).trim()).filter(Boolean).slice(0, 12);
        }
        return task;
    }

    function execute(a) {
        const g = gs();
        if (a.tipo === 'criar_missao' || a.tipo === 'criar_habito') {
            const hab = a.tipo === 'criar_habito';
            const task = buildTask(a, hab ? 'habito' : 'missao');
            const key = hab ? 'habitos' : 'missoes';
            if (!Array.isArray(g.data[key])) g.data[key] = [];
            g.data[key].push(task);
            g.saveData();
            if (typeof renderTasks === 'function') renderTasks();
            g.addNotification(hab ? 'HÁBITO CRIADO PELO ARQUITETO' : 'MISSÃO CRIADA PELO ARQUITETO', '"' + task.titulo + '" foi adicionada ao seu sistema.', 'info');
            return task.titulo;
        }
        if (a.tipo === 'criar_item') {
            const name = String(a.nome || '').trim().toUpperCase().slice(0, 60);
            if (!name) throw new Error('A ação veio sem nome.');
            if (!Array.isArray(g.data.recompensas)) g.data.recompensas = [];
            g.data.recompensas.push({ name: name, icon: String(a.icone || '🎁').slice(0, 4), price: Math.round(clampN(a.preco, 100, 1000000, 3000)), type: 'recompensa' });
            g.saveData();
            g.addNotification('ITEM CRIADO PELO ARQUITETO', '"' + name + '" já está na Loja do Tempo.', 'info');
            if (typeof renderShop === 'function') { try { renderShop(); } catch (e) { /* loja ainda não montada */ } }
            return name;
        }
        if (a.tipo === 'propor_habilidade') {
            const nome = String(a.nome || '').trim().slice(0, 60);
            if (!nome) throw new Error('A ação veio sem nome.');
            if (!Array.isArray(g.data.habilidadesPropostas)) g.data.habilidadesPropostas = [];
            g.data.habilidadesPropostas.push({ nome: nome, tipo: a.tipoHab === 'combate' ? 'combate' : 'estudo', atributo: ATTRS.indexOf(a.atributo) >= 0 ? a.atributo : 'sabedoria',
                descricao: String(a.descricao || '').slice(0, 300), categoria: 'arquiteto', propostEm: new Date().toISOString(), status: 'pendente' });
            g.saveData();
            if (typeof updateSkillsDisplay === 'function') updateSkillsDisplay();
            g.addNotification('HABILIDADE PROPOSTA', 'O Arquiteto propôs "' + nome + '". Aceite ou recuse na seção de Habilidades.', 'evolution');
            return nome;
        }
        throw new Error('Ação desconhecida.');
    }

    const FREQ_LABEL = { unica: 'Única', diaria: 'Diária', semanal: 'Semanal', mensal: 'Mensal', anual: 'Anual', intervalo: 'A cada N dias' };

    function cardHtml(a, i, state) {
        const rows = [];
        let title = '';
        if (a.tipo === 'criar_missao' || a.tipo === 'criar_habito') {
            title = (a.tipo === 'criar_habito' ? 'NOVO HÁBITO: ' : 'NOVA MISSÃO: ') + esc(String(a.titulo || '').toUpperCase());
            if (a.descricao) rows.push(esc(a.descricao));
            rows.push('Frequência: ' + esc(FREQ_LABEL[a.frequencia] || a.frequencia || 'Única') + (a.dataInicial ? ' · início ' + esc(a.dataInicial) : '') + (a.dataFinal ? ' · fim ' + esc(a.dataFinal) : ''));
            if (a.tipo === 'criar_missao') {
                rows.push('Prioridade: ' + esc(a.prioridade || 'media') + (a.segmento ? ' · ' + esc(a.segmento) : ''));
                if (Array.isArray(a.checklist) && a.checklist.length) rows.push('Checklist: ' + a.checklist.map(esc).join(' › '));
            }
            if (a.itemRecompensa && a.itemRecompensa.nome) rows.push('🎁 Prêmio: ' + esc(a.itemRecompensa.nome) + (a.especial ? ' · missão especial' : ''));
            rows.push('Recompensa: ' + esc(a.exp != null ? a.exp : '?') + ' XP · ' + esc(a.moedas || 0) + ' G' + (a.atributo ? ' · +' + esc(a.atributoValor || 0.5) + ' ' + esc(a.atributo) : ''));
        } else if (a.tipo === 'criar_item') {
            title = 'NOVO ITEM: ' + esc(String(a.nome || '').toUpperCase());
            rows.push('Preço: ' + esc(a.preco) + ' G');
        } else {
            title = 'NOVA HABILIDADE: ' + esc(a.nome);
            if (a.descricao) rows.push(esc(a.descricao));
        }
        const foot = state === 'done' ? '<div class="arq-act-state arq-act-state--ok">✔ Criado e adicionado ao Sistema</div>'
            : state === 'cancelled' ? '<div class="arq-act-state">Cancelado</div>'
            : state === 'error' ? '<div class="arq-act-state arq-act-state--bad">Não foi possível criar. Peça de novo ao Arquiteto.</div>'
            : '<div class="arq-act-btns"><button type="button" class="arq-act-ok" data-ai="' + i + '">CONFIRMAR</button><button type="button" class="arq-act-no" data-ai="' + i + '">CANCELAR</button></div>';
        return '<div class="arq-act arq-act--' + (state || 'pending') + '"><div class="arq-act-title">' + title + '</div>' + rows.map(r => '<div class="arq-act-row">' + r + '</div>').join('') + foot + '</div>';
    }

    window.renderArquitetoMessages = function () {
        const box = document.getElementById('arqMessages');
        if (!box) return;
        box.innerHTML = '';
        arquitetoChatHistory.forEach(function (msg, mi) {
            const div = document.createElement('div');
            div.className = 'arq-msg arq-msg--' + msg.role;
            const text = '<div class="arq-msg-text">' + esc(msg.content).replace(/\n/g, '<br>') + '</div>';
            if (msg.role === 'assistant') {
                const acts = (msg.actions || []).map(function (a, i) { return cardHtml(a, i, a.state); }).join('');
                div.setAttribute('data-mi', mi);
                div.innerHTML = '<img class="arq-msg-avatar arq-msg-avatar--img" src="' + AVATAR + '" alt="">'
                    + '<div class="arq-msg-bubble"><div class="arq-msg-label">ARQUITETO' + (msg.auto ? ' · AVISO' : '') + '</div>' + text + acts + '</div>';
            } else {
                div.innerHTML = '<div class="arq-msg-bubble">' + text + '</div>';
            }
            box.appendChild(div);
        });
        box.scrollTop = box.scrollHeight;
    };

    function onActionClick(e) {
        const b = e.target.closest('.arq-act-ok, .arq-act-no');
        if (!b) return;
        const msg = arquitetoChatHistory[+b.closest('.arq-msg').getAttribute('data-mi')];
        const a = msg && msg.actions && msg.actions[+b.getAttribute('data-ai')];
        if (!a || a.state) return;
        if (b.classList.contains('arq-act-no')) a.state = 'cancelled';
        else { try { execute(a); a.state = 'done'; } catch (err) { console.warn('arq ação', err); a.state = 'error'; } }
        saveArquitetoHistory();
        renderArquitetoMessages();
    }

    // ---------- envio ----------
    window.sendArquitetoMessage = async function (text) {
        const trimmed = (text || '').trim();
        if (!trimmed) return;
        arquitetoChatHistory.push({ role: 'user', content: trimmed, timestamp: Date.now() });
        saveArquitetoHistory();
        renderArquitetoMessages();
        const sug = document.getElementById('arqSuggestions');
        if (sug) sug.style.display = 'none';
        showArquitetoTyping();
        const input = document.getElementById('arqChatInput'), btn = document.getElementById('arqSendBtn');
        if (input) { input.value = ''; input.style.height = 'auto'; input.disabled = true; }
        if (btn) btn.disabled = true;
        try {
            const recent = arquitetoChatHistory.slice(-20).map(function (m) { return { role: m.role, content: m.content }; });
            const base = [{ role: 'system', content: buildArquitetoSystemPrompt(true) }].concat(recent);
            let reply = await callOpenRouter(base);
            let r = extractArqActions(reply);
            if (/```acao/i.test(reply) && !r.actions.length) { // bloco cortado ou JSON inválido: uma nova tentativa, mais curta
                reply = await callOpenRouter(base.concat([{ role: 'assistant', content: reply }, { role: 'user', content: 'Seu bloco de ação veio incompleto. Responda de novo com UMA frase curta e o bloco ```acao completo, em JSON de uma linha.' }]), 1200);
                r = extractArqActions(reply);
            }
            hideArquitetoTyping();
            arquitetoChatHistory.push({ role: 'assistant', content: r.text || 'Como deseja prosseguir?', actions: r.actions, timestamp: Date.now() });
        } catch (err) {
            hideArquitetoTyping();
            arquitetoChatHistory.push({ role: 'assistant', content: '⚠ ' + err.message, timestamp: Date.now() });
        } finally {
            saveArquitetoHistory();
            renderArquitetoMessages();
            if (input) input.disabled = false;
            if (btn) btn.disabled = false;
        }
    };

    // ---------- mensagens automáticas ----------
    const AUTO_KEY = 'arqAutoState';
    const readState = () => { try { return JSON.parse(localStorage.getItem(AUTO_KEY)) || {}; } catch (e) { return {}; } };
    const writeState = s => { try { localStorage.setItem(AUTO_KEY, JSON.stringify(s)); } catch (e) { /* quota */ } };

    async function say(kind, facts, fallback) {
        const s = readState(), today = localDateKey(new Date());
        if (s.day !== today) { s.day = today; s.n = 0; }
        if (s.n >= 2) return false;
        s.n++; writeState(s);
        let msg = fallback;
        if (window.SysAuth && SysAuth.loggedIn() && navigator.onLine !== false) {
            try {
                const out = await callOpenRouter([
                    { role: 'system', content: buildArquitetoSystemPrompt(false) },
                    { role: 'user', content: '[EVENTO AUTOMÁTICO DO SISTEMA] ' + facts + ' Escreva UMA mensagem curta (no máximo 2 frases) do Arquiteto para o caçador sobre isso. Sem listas e sem blocos de ação.' }
                ]);
                const t = extractArqActions(out).text.replace(/^\s*(?:\*\*)?Arquiteto(?:\*\*)?\s*[:\-—]\s*/i, '');
                if (t) msg = t;
            } catch (e) { /* usa o texto-padrão */ }
        }
        arquitetoChatHistory.push({ role: 'assistant', content: msg, timestamp: Date.now(), auto: true });
        saveArquitetoHistory();
        renderArquitetoMessages();
        gs().addNotification('MENSAGEM DO ARQUITETO', msg, 'architect');
        return true;
    }

    async function autoCheck() {
        const g = gs();
        if (!g || !window.SysAuth || !SysAuth.loggedIn()) return;
        const d = g.data, s = readState(), today = localDateKey(new Date()), hour = new Date().getHours();
        const pens = (d.penalidades || []).length, tit = (d.titulosDesbloqueados || []).length, lvl = d.nivel;
        if (s.pen === undefined) { s.pen = pens; s.tit = tit; s.lvl = lvl; writeState(s); return; } // primeira vez: só registra a linha de base
        if (pens > s.pen) {
            const last = d.penalidades[d.penalidades.length - 1] || {};
            const ok = await say('penalty', 'O caçador recebeu uma penalidade: ' + describePenalty(last) + '.',
                'Uma falha foi registrada. O Sistema não esquece, caçador. Corrija o rumo hoje.');
            if (ok) { const t = readState(); t.pen = pens; writeState(t); }
            return;
        }
        if (lvl > s.lvl) {
            const ok = await say('levelup', 'O caçador subiu para o nível ' + lvl + '.', 'Nível ' + lvl + '. Um degrau a mais, e o caminho à frente ainda é longo.');
            if (ok) { const t = readState(); t.lvl = lvl; writeState(t); }
            return;
        }
        if (tit > s.tit) {
            const ok = await say('title', 'O caçador desbloqueou uma nova conquista (título).', 'Uma nova conquista foi gravada no Sistema. Continue.');
            if (ok) { const t = readState(); t.tit = tit; writeState(t); }
            return;
        }
        const pend = pendingToday().length;
        if (hour >= 18 && pend > 0 && s.pendDay !== today) {
            const ok = await say('pending', 'Ainda restam ' + pend + ' missões pendentes hoje e o dia está acabando.', 'Restam ' + pend + ' missões hoje. A noite se aproxima, caçador.');
            if (ok) { const t = readState(); t.pendDay = today; writeState(t); }
            return;
        }
        if (lastActivityDays() >= 2 && lastActivityDays() < 999 && (!s.inactiveAt || Date.now() - s.inactiveAt > 2 * 86400000)) {
            const ok = await say('inactive', 'O caçador está há ' + lastActivityDays() + ' dias sem concluir missões.', 'Silêncio demais. Faz ' + lastActivityDays() + ' dias sem uma conclusão. Retome hoje.');
            if (ok) { const t = readState(); t.inactiveAt = Date.now(); writeState(t); }
            return;
        }
        const wk = today.slice(0, 8) + String(Math.floor(new Date().getDate() / 7));
        if (new Date().getDay() === 0 && hour >= 17 && s.weekKey !== wk) {
            const ok = await say('weekly', 'Resumo da semana: nível ' + lvl + ', ' + recentFailures(7).length + ' falhas nos últimos 7 dias, treinos ' + (d.treinosSemana || []).length + '/' + (d.treinoMeta || 5) + '.',
                'A semana termina. Revise suas falhas e prepare a próxima.');
            if (ok) { const t = readState(); t.weekKey = wk; writeState(t); }
            return;
        }
        const pendEsp = (d.missoes || []).some(m => m.especial && m.ativo !== false && !(m.completions || []).length && (!m.endDate || m.endDate >= today));
        if (!pendEsp && (!s.especialAt || Date.now() - s.especialAt > 7 * 86400000)) {
            try { await proposeSpecial(); } catch (e) { /* tenta de novo na próxima verificação */ }
        }
    }
    async function proposeSpecial() {
        const g = gs(), s = readState(), today = localDateKey(new Date());
        if (s.day !== today) { s.day = today; s.n = 0; }
        if (s.n >= 2 || !window.SysAuth || !SysAuth.loggedIn()) return false;
        const fim = new Date(); fim.setDate(fim.getDate() + 3);
        const out = await callOpenRouter([
            { role: 'system', content: buildArquitetoSystemPrompt(true) },
            { role: 'user', content: '[EVENTO AUTOMÁTICO] Lance AGORA uma MISSÃO ESPECIAL para o caçador: tipo criar_missao, frequencia "unica", especial true, dataInicial ' + today + ', dataFinal ' + localDateKey(fim) + ' (prazo de 3 dias), com itemRecompensa. Deve ser desafiadora e realizável em 3 dias, ligada ao que os dados dele mostram (falhas, atributos baixos). Escreva UMA frase curta no tom do Arquiteto e o bloco acao completo.' }
        ], 1200);
        const r = extractArqActions(out);
        if (!r.actions.length) return false;
        r.actions[0].especial = true;
        s.n++; s.especialAt = Date.now(); writeState(s);
        const txt = r.text.replace(/^\s*(?:\*\*)?Arquiteto(?:\*\*)?\s*[:\-—]\s*/i, '');
        arquitetoChatHistory.push({ role: 'assistant', content: txt || 'Um desafio especial foi lançado.', actions: r.actions, timestamp: Date.now(), auto: true });
        saveArquitetoHistory(); renderArquitetoMessages();
        g.addNotification('DESAFIO ESPECIAL DO ARQUITETO', 'Há uma missão especial esperando sua resposta no chat do Arquiteto. Prazo: 3 dias.', 'architect');
        return true;
    }
    window.arquitetoProporEspecial = proposeSpecial;
    window.arquitetoAutoCheck = autoCheck;

    document.addEventListener('DOMContentLoaded', function () {
        const msgs = document.getElementById('arqMessages');
        if (msgs) msgs.addEventListener('click', onActionClick);

        // painéis CONVERSA / FRAGMENTOS
        document.querySelectorAll('[data-arqpane]').forEach(function (b) {
            b.addEventListener('click', function () {
                const pane = b.getAttribute('data-arqpane');
                document.querySelectorAll('[data-arqpane]').forEach(x => x.classList.toggle('active', x === b));
                document.getElementById('arqPaneChat').hidden = pane !== 'chat';
                document.getElementById('arqPaneFrag').hidden = pane !== 'frag';
                if (pane === 'frag' && typeof renderArquitetoPersonagem === 'function') renderArquitetoPersonagem();
            });
        });

        setTimeout(autoCheck, 4000);
        setInterval(autoCheck, 30 * 60 * 1000);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) setTimeout(autoCheck, 1500); });
    });
})();
