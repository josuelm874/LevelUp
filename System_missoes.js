// System_missoes.js — formulário de Missão/Hábito. Ao criar, o Arquiteto (IA) analisa e define a recompensa.
// Depende de System_script.js (gameSystem, renderTasks, callOpenRouter, recommendMissionHeuristic) e System_arquiteto.js.
(function () {
    'use strict';
    const $ = (r, s) => r.querySelector(s);
    const esc = s => (typeof _escapeHtml === 'function' ? _escapeHtml(s) : String(s));
    const ATTRS = ['forca', 'sabedoria', 'foco', 'vitalidade', 'disciplina', 'carisma'];
    const SEGMENTS = ['CORPO', 'SAÚDE', 'FINANÇAS', 'TRABALHO', 'ESTUDOS', 'ROTINA', 'DESENVOLVIMENTO', 'RELACIONAMENTO', 'AUTOAPERFEIÇOAMENTO', 'LIVRE'];
    const FREQS = [['unica', 'Única'], ['diaria', 'Diária'], ['semanal', 'Semanal'], ['mensal', 'Mensal'], ['anual', 'Anual'], ['intervalo', 'A cada N dias']];
    const REC = { diaria: 'daily', semanal: 'weekly', mensal: 'monthly', anual: 'yearly', intervalo: 'interval_days' };
    const REC_BACK = { daily: 'diaria', weekly: 'semanal', monthly: 'mensal', yearly: 'anual', interval_days: 'intervalo' };
    const INT_LABEL = { semanal: 'semana(s)', mensal: 'mês(es)', intervalo: 'dia(s)' };

    // ---------- análise de recompensa (Arquiteto) ----------
    function caps(tipo, freq) {
        if (tipo === 'habito') return { exp: 40 };
        if (freq === 'unica') return { exp: 400 };
        if (freq === 'diaria' || freq === 'intervalo') return { exp: 80 };
        if (freq === 'semanal') return { exp: 150 };
        return { exp: 300 };
    }

    function clampRewards(r, tipo, freq) {
        const cap = caps(tipo, freq).exp;
        const exp = Math.max(5, Math.min(cap, Math.round(Number(r.exp) || 20)));
        const attr = ATTRS.indexOf(String(r.atributo || '').toLowerCase()) >= 0 ? String(r.atributo).toLowerCase() : null;
        return {
            exp: exp,
            moedas: Math.max(0, Math.min(Math.floor(exp / 4), Math.round(Number(r.moedas) || 0))),
            atributo: attr,
            atributoValor: attr ? Math.max(0, Math.min(1, Math.round((Number(r.atributoValor) || 0) * 10) / 10)) : 0
        };
    }

    function localAnalysis(d) {
        const h = recommendMissionHeuristic(d.titulo + ' ' + d.descricao);
        const seg = SEGMENTS.indexOf(String(h.categoria || '').toUpperCase()) >= 0 ? h.categoria.toUpperCase()
            : /estud|leitur|curs/i.test(h.categoria || '') ? 'ESTUDOS' : /treino|corpo|exerc/i.test(h.categoria || '') ? 'CORPO' : 'LIVRE';
        const rotina = d.tipo === 'habito' || d.freq === 'diaria' || d.freq === 'intervalo';
        return { rewards: clampRewards(Object.assign({}, h, { exp: rotina ? Math.min(h.exp, 25) : h.exp }), d.tipo, d.freq), segmento: seg, justificativa: 'Estimativa local, sem a IA do Arquiteto.', origem: 'local' };
    }

    async function analyzeReward(d) {
        const system = `Você é o Arquiteto do Sistema de Evolução Pessoal. Avalie a missão abaixo com cuidado, pensando em: (1) o que ela realmente pede; (2) o esforço e o tempo reais de CADA ocorrência; (3) a dificuldade e a frequência; (4) o que concluí-la entrega ao caçador (habilidade, saúde, dinheiro, disciplina etc.). Só depois defina a recompensa.
Calibração de XP por ocorrência: 15 min de esforço leve ≈ 10; 30 min ≈ 20; 1 h ≈ 40; 2 h ou mais ≈ 70+. Tarefa única e importante vale mais que uma rotina diária. Prioridade alta: +25%. Missão que se repete todo dia vale pouco por vez.
Moedas: 0 para tarefas pequenas ou rotineiras; só dê moedas se houver esforço real, no máximo 1/4 do XP.
atributoValor: de 0 a 1 (0 = a missão não sobe nenhum atributo; 0.1 a 0.3 rotinas; 0.5 a 1 esforços grandes). Escolha o atributo ao qual a missão realmente se refere.
Responda SOMENTE um objeto JSON de uma linha, sem markdown:
{"exp":número,"moedas":número,"atributo":"${ATTRS.join('|')}" ou "","atributoValor":número,"segmento":"${SEGMENTS.join('|')}","justificativa":"1 a 2 frases em português, tom do Arquiteto, explicando por que vale isso"}`;
        const user = `Tipo: ${d.tipo === 'habito' ? 'hábito' : 'missão'}\nTítulo: ${d.titulo}\nDescrição: ${d.descricao || '(sem descrição)'}\nFrequência: ${d.freqLabel}\nPrioridade: ${d.prio || 'media'}\nChecklist: ${d.checklist.length ? d.checklist.join('; ') : 'não'}`;
        const out = await callOpenRouter([{ role: 'system', content: system }, { role: 'user', content: user }], 1000);
        const txt = String(out).replace(/```[a-z]*/gi, '');
        const j = JSON.parse(extractJsonObject(txt) || txt.trim());
        const seg = String(j.segmento || '').toUpperCase();
        return {
            rewards: clampRewards(j, d.tipo, d.freq),
            segmento: SEGMENTS.indexOf(seg) >= 0 ? seg : 'LIVRE',
            justificativa: String(j.justificativa || '').trim().slice(0, 240) || 'Avaliado pelo Arquiteto.',
            origem: 'ia'
        };
    }
    window.analisarRecompensaArquiteto = analyzeReward;

    // ---------- formulário ----------
    const chips = (grp, opts, val) => opts.map(o => `<button type="button" class="mf2-chip${o[0] === val ? ' on' : ''}" data-grp="${grp}" data-v="${o[0]}">${o[1]}</button>`).join('');

    function showForm(tipo, existingId) {
        const g = gameSystem;
        if (!g) return;
        const hab = tipo === 'habito';
        const list = g.data[hab ? 'habitos' : 'missoes'] || [];
        const ex = existingId ? list.find(t => t.id === existingId) : null;
        const today = getTodayKey();
        const st = {
            prio: ex ? (['alta', 'media', 'baixa'].indexOf(ex.priority) >= 0 ? ex.priority : 'media') : 'media',
            period: ex && ex.idealPeriod ? ex.idealPeriod : 'flex',
            freq: ex ? (ex.unique ? 'unica' : (REC_BACK[ex.recurrence && ex.recurrence.type] || 'diaria')) : (hab ? 'diaria' : 'unica'),
            check: !!(ex && ex.checklist && ex.checklist.length),
            items: ex && ex.checklist ? ex.checklist.slice() : []
        };
        const label = hab ? 'HÁBITO' : 'MISSÃO';
        const modal = document.createElement('div');
        modal.className = 'settings-modal mission-modal-video task-modal-scroll';
        modal.id = 'taskModal';
        modal.innerHTML = `
        <div class="settings-backdrop"></div>
        <div class="settings-box mission-video-box mf2-box">
            <div class="settings-header mission-video-header">
                <div><h3 class="settings-title mission-video-headline">${ex ? 'EDITAR' : 'CRIAR'} ${label}</h3>
                <p class="mission-video-sub">O Arquiteto define a recompensa ao salvar</p></div>
                <button type="button" class="settings-close" id="mf2Close">×</button>
            </div>
            <div class="settings-content">
            <form id="mf2Form" class="item-form mission-form-video" novalidate>
                <div class="form-group mfv-field"><label class="form-label mfv-label-muted" for="mf2Title">Título</label>
                    <input type="text" id="mf2Title" class="form-input mfv-input" maxlength="80" placeholder="${hab ? 'Qual hábito você quer construir?' : 'O que você vai realizar?'}" value="${ex ? esc(ex.titulo) : ''}"></div>
                <div class="form-group mfv-field"><label class="form-label mfv-label-muted" for="mf2Desc">Descrição</label>
                    <textarea id="mf2Desc" class="form-input mfv-textarea" rows="4" maxlength="400" placeholder="Explique o que precisa ser feito. Quanto mais claro, melhor o Arquiteto avalia a recompensa.">${ex ? esc(ex.descricao || '') : ''}</textarea></div>
                ${hab ? '' : `
                <div class="mf2-switchrow"><span>Precisa de checklist?</span>
                    <label class="mf2-switch"><input type="checkbox" id="mf2Check"${st.check ? ' checked' : ''}><i></i></label></div>
                <div id="mf2CheckBox" class="mfv-field"${st.check ? '' : ' hidden'}>
                    <div class="mfv-checklist-toolbar"><input type="text" id="mf2CheckInp" class="form-input mfv-input mfv-checklist-inp" placeholder="Adicionar item…" autocomplete="off"><button type="button" class="mfv-check-add" id="mf2CheckAdd" aria-label="Adicionar">+</button></div>
                    <ul id="mf2CheckList" class="mfv-check-list"></ul></div>
                <fieldset class="mfv-fieldset"><legend class="mfv-fs-legend">Prioridade</legend><div class="mf2-chips">${chips('prio', [['alta', '⚡ Alta'], ['media', '⭐ Média'], ['baixa', '☕ Baixa']], st.prio)}</div></fieldset>
                <fieldset class="mfv-fieldset"><legend class="mfv-fs-legend">Período ideal</legend><div class="mf2-chips">${chips('period', [['manha', '🌅 Manhã'], ['tarde', '☀️ Tarde'], ['noite', '🌙 Noite'], ['flex', '🔁 Flexível']], st.period)}</div>
                    <div class="mfv-field" style="margin-top:8px"><label class="form-label mfv-label-muted" for="mf2Time">Hora ideal <span class="mfv-optional-flag">(opcional)</span></label><input type="time" id="mf2Time" class="form-input mfv-input" value="${ex && ex.idealTime ? esc(ex.idealTime.slice(0, 5)) : ''}"></div></fieldset>`}
                <fieldset class="mfv-fieldset"><legend class="mfv-fs-legend">Frequência</legend>
                    <div class="mf2-chips" id="mf2Freqs">${chips('freq', hab ? FREQS.slice(1) : FREQS, st.freq)}</div>
                    <div id="mf2IntWrap" class="mf2-int" hidden>A cada <input type="number" id="mf2Int" min="1" max="365" value="${ex && ex.recurrence ? ex.recurrence.interval || 1 : 1}"> <span id="mf2IntLbl"></span></div></fieldset>
                <div class="mfv-date-row">
                    <div class="form-group mfv-field mfv-grow"><label class="form-label mfv-label-muted" for="mf2Start" id="mf2StartLbl">Data inicial</label><input type="date" id="mf2Start" class="form-input mfv-input" value="${ex ? esc(ex.startDate || today) : today}"></div>
                    <div class="form-group mfv-field mfv-grow" id="mf2EndWrap"><label class="form-label mfv-label-muted" for="mf2End">Data final <span class="mfv-optional-flag">(opcional)</span></label><input type="date" id="mf2End" class="form-input mfv-input" value="${ex && ex.endDate ? esc(ex.endDate) : ''}"></div>
                </div>
                <p id="mf2Err" class="mf2-err" role="alert" hidden></p>
                <div class="form-actions mission-video-actions mfv-mission-foot">
                    <button type="button" class="mfv-foot-btn mfv-foot-btn--ghost" id="mf2Cancel">Cancelar</button>
                    <button type="submit" class="mfv-foot-btn mfv-foot-btn--prime" id="mf2Submit">${ex ? 'Salvar alterações' : 'Criar ' + label.toLowerCase() + ' ✦'}</button>
                </div>
            </form></div>
        </div>`;
        document.body.appendChild(modal);
        const close = () => modal.remove();
        ['.settings-backdrop', '#mf2Close', '#mf2Cancel'].forEach(s => $(modal, s).addEventListener('click', close));

        const sync = () => {
            $(modal, '#mf2IntWrap').hidden = !INT_LABEL[st.freq];
            if (INT_LABEL[st.freq]) $(modal, '#mf2IntLbl').textContent = INT_LABEL[st.freq];
            $(modal, '#mf2EndWrap').hidden = st.freq === 'unica';
            $(modal, '#mf2StartLbl').textContent = st.freq === 'unica' ? 'Data' : 'Data inicial';
        };
        modal.addEventListener('click', e => {
            const c = e.target.closest('.mf2-chip');
            if (!c) return;
            st[c.dataset.grp] = c.dataset.v;
            modal.querySelectorAll('.mf2-chip[data-grp="' + c.dataset.grp + '"]').forEach(x => x.classList.toggle('on', x === c));
            sync();
        });
        sync();

        const renderItems = () => {
            const ul = $(modal, '#mf2CheckList'); if (!ul) return;
            ul.innerHTML = st.items.map((t, i) => `<li class="mfv-check-row"><span class="mfv-checklist-text">${esc(t)}</span><button type="button" class="mf2-rm" data-i="${i}" aria-label="Remover">×</button></li>`).join('');
        };
        if (!hab) {
            renderItems();
            $(modal, '#mf2Check').addEventListener('change', e => { st.check = e.target.checked; $(modal, '#mf2CheckBox').hidden = !st.check; });
            const addItem = () => { const i = $(modal, '#mf2CheckInp'), v = i.value.trim(); if (v && st.items.length < 12) { st.items.push(v.slice(0, 80)); i.value = ''; renderItems(); } };
            $(modal, '#mf2CheckAdd').addEventListener('click', addItem);
            $(modal, '#mf2CheckInp').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } });
            $(modal, '#mf2CheckList').addEventListener('click', e => { const b = e.target.closest('.mf2-rm'); if (b) { st.items.splice(+b.dataset.i, 1); renderItems(); } });
        }

        $(modal, '#mf2Form').addEventListener('submit', async ev => {
            ev.preventDefault();
            const err = $(modal, '#mf2Err'), btn = $(modal, '#mf2Submit');
            const fail = m => { err.textContent = m; err.hidden = false; };
            err.hidden = true;
            const titulo = $(modal, '#mf2Title').value.trim();
            const descricao = $(modal, '#mf2Desc').value.trim();
            const start = $(modal, '#mf2Start').value || today;
            const end = st.freq === 'unica' ? '' : $(modal, '#mf2End').value;
            const interval = INT_LABEL[st.freq] ? Math.max(1, Math.min(365, parseInt($(modal, '#mf2Int').value, 10) || 1)) : 1;
            if (!titulo) return fail('Dê um título.');
            if (end && end < start) return fail('A data final não pode ser antes da inicial.');
            const items = hab || !st.check ? [] : st.items;
            const d = { tipo: tipo, titulo: titulo, descricao: descricao, freq: st.freq, prio: st.prio, checklist: items,
                freqLabel: (FREQS.find(f => f[0] === st.freq) || [])[1] + (INT_LABEL[st.freq] ? ' (a cada ' + interval + ' ' + INT_LABEL[st.freq] + ')' : '') + (end ? ', de ' + start + ' até ' + end : ', a partir de ' + start) };

            const changed = !ex || ex.titulo !== titulo.toUpperCase() || (ex.descricao || '') !== descricao || (ex.unique ? 'unica' : REC_BACK[ex.recurrence && ex.recurrence.type]) !== st.freq || (ex.priority || 'media') !== st.prio;
            btn.disabled = true;
            btn.textContent = 'O Arquiteto está analisando…';
            let res = null;
            if (changed) {
                try { res = await analyzeReward(d); }
                catch (e1) {
                    console.warn('análise IA (1ª tentativa)', e1);
                    try { res = await analyzeReward(d); } catch (e2) { console.warn('análise IA (2ª tentativa)', e2); res = localAnalysis(d); }
                }
            }
            const task = ex || { id: Date.now(), completions: [] };
            Object.assign(task, {
                tipo: tipo, titulo: titulo.toUpperCase(), descricao: descricao, ativo: ex ? ex.ativo !== false : true,
                unique: !hab && st.freq === 'unica', startDate: start, endDate: end,
                recurrence: st.freq === 'unica' ? { type: 'daily', interval: 1, startDate: start } : { type: REC[st.freq], interval: interval, startDate: start },
                progress: ex && ex.progress ? ex.progress : { enabled: false, max: 0, byDate: {} }
            });
            if (res) { task.rewards = res.rewards; task.analiseIA = { justificativa: res.justificativa, origem: res.origem, em: new Date().toISOString() }; if (!hab) task.category = res.segmento; }
            else if (!task.rewards) task.rewards = { exp: 0, moedas: 0, atributo: null, atributoValor: 0 };
            if (!hab) { task.priority = st.prio; task.idealPeriod = st.period; task.idealTime = ($(modal, '#mf2Time').value || '').slice(0, 8); task.checklist = items; }
            if (!ex) { const key = hab ? 'habitos' : 'missoes'; if (!Array.isArray(g.data[key])) g.data[key] = []; g.data[key].push(task); }
            g.saveData();
            renderTasks();
            const r = task.rewards;
            const resumo = res ? ' Recompensa: +' + r.exp + ' XP' + (r.moedas ? ' · +' + r.moedas + ' G' : '') + (r.atributo && r.atributoValor ? ' · +' + r.atributoValor + ' ' + r.atributo : '') + (res.origem === 'local' ? ' (estimativa local)' : '') + '.' : '';
            g.addNotification((ex ? (hab ? 'HÁBITO ATUALIZADO!' : 'MISSÃO ATUALIZADA!') : (hab ? 'HÁBITO CADASTRADO!' : 'MISSÃO CADASTRADA!')), '"' + task.titulo + '" foi salva.' + resumo, 'info');
            close();
        });
        setTimeout(() => { const t = $(modal, '#mf2Title'); if (t && !ex) t.focus(); }, 60);
    }

    window.showMissionForm = showForm;
    window.showTaskModal = showForm; // Missão e Hábito passam a usar o formulário novo
})();
