/* Calendário — mostra missões, hábitos, treinos, penalidades e eventos do sistema.
   Substitui renderSysCalendar do System_script.js (chamada por nome). */
(function () {
    'use strict';
    const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const DIAS_LONGO = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const KINDS = {
        missao: { nome: 'Missões', cor: '#00e5ff', ico: '◆' },
        habito: { nome: 'Hábitos', cor: '#22c55e', ico: '↻' },
        treino: { nome: 'Treino', cor: '#fb923c', ico: '⚔' },
        penal: { nome: 'Penalidades', cor: '#ef4444', ico: '⚠' },
        sistema: { nome: 'Sistema', cor: '#a855f7', ico: '✦' }
    };
    const ORDER = ['missao', 'habito', 'treino', 'penal', 'sistema'];
    const GLYPH = { done: '✓', pending: '○', missed: '✕', planned: '◌', event: '●' };
    const STATE_LBL = { done: 'FEITA', pending: 'PENDENTE', missed: 'PERDIDA', planned: 'AGENDADA' };

    const st = { mode: 'month', view: new Date(), sel: null, filt: loadFilt() };
    st.view = new Date(st.view.getFullYear(), st.view.getMonth(), 1);

    function loadFilt() {
        const all = { missao: true, habito: true, treino: true, penal: true, sistema: true };
        try { return Object.assign(all, JSON.parse(localStorage.getItem('calFilters') || '{}')); } catch (e) { return all; }
    }
    function saveFilt() { try { localStorage.setItem('calFilters', JSON.stringify(st.filt)); } catch (e) { /* sem storage */ } }

    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const keyOf = (d) => gameSystem.getDateKey(d);
    const fromKey = (k) => { const p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
    const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
    const monday = (d) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + (x.getDay() === 0 ? -6 : 1 - x.getDay())); return x; };
    const doneOn = (t, key) => Array.isArray(t.completions) && t.completions.some((c) => c && String(c).slice(0, 10) === key);

    function isDue(t, key, date) {
        if (t.ativo === false) return false;
        if (t.unique) {
            if (t.completions && t.completions.length) return false;
            const s = String(t.startDate || (t.recurrence && t.recurrence.startDate) || '').slice(0, 10);
            const e = t.endDate ? String(t.endDate).slice(0, 10) : '';
            return key === s || (!!e && key === e);
        }
        try { return shouldTaskAppearToday(Object.assign({}, t, { ativo: true }), date); } catch (e) { return false; }
    }

    /* Todos os registros de um dia, já classificados. */
    function dayItems(key) {
        const g = gameSystem.data, date = fromKey(key), today = keyOf(new Date());
        const out = [];
        [['missao', g.missoes], ['habito', g.habitos]].forEach(([kind, list]) => {
            (list || []).forEach((t) => {
                if (!t) return;
                const done = doneOn(t, key);
                if (!done && !isDue(t, key, date)) return;
                const state = done ? 'done' : key < today ? 'missed' : key === today ? 'pending' : 'planned';
                const rw = t.rewards || {};
                const sub = [];
                if (rw.exp || rw.xp) sub.push('+' + (rw.exp || rw.xp) + ' XP');
                if (rw.moedas || rw.coins) sub.push((rw.moedas || rw.coins) + ' G');
                if (t.idealPeriod && t.idealPeriod !== 'flex') sub.push(t.idealPeriod);
                if (t.unique && t.endDate && String(t.endDate).slice(0, 10) === key && String(t.startDate || '').slice(0, 10) !== key) sub.unshift('PRAZO FINAL');
                if (t.priority === 'alta') sub.push('alta prioridade');
                out.push({ kind, state, title: t.titulo || t.nome || 'Sem título', sub: sub.join(' · ') });
            });
        });
        const tf = g.treinoFisico || {};
        const sess = (tf.historicoSessoes || []).filter((s) => s && s.data && keyOf(new Date(s.data)) === key);
        sess.forEach((s) => {
            const gr = (tf.grupos || []).find((x) => String(x.id) === String(s.grupoId));
            out.push({ kind: 'treino', state: 'done', title: gr ? gr.nome : 'Sessão de treino', sub: (s.duracaoMinutos != null ? s.duracaoMinutos + ' min' : '') + (s.exerciciosConcluidos ? ' · ' + s.exerciciosConcluidos + ' exerc.' : '') });
        });
        (g.treinos || []).filter((t) => t && t.data && t.concluido && keyOf(new Date(t.data)) === key)
            .forEach((t) => out.push({ kind: 'treino', state: 'done', title: t.nome || t.titulo || 'Treino', sub: '' }));
        if (!sess.length) {
            (tf.grupos || []).filter((gr) => (gr.diasDaSemana || []).includes(date.getDay())).forEach((gr) => {
                out.push({ kind: 'treino', state: key < today ? 'missed' : key === today ? 'pending' : 'planned', title: gr.nome, sub: gr.tipo || '' });
            });
        }
        (g.penalidades || []).filter((p) => p && p.dateKey === key).forEach((p) => {
            const hab = (p.incompleteHabits || []).map((h) => (h && (h.titulo || h.nome)) || h).filter((x) => typeof x === 'string');
            out.push({ kind: 'penal', state: 'event', title: p.description || 'Penalidade', sub: [p.hpLoss ? '-' + p.hpLoss + ' HP' : '', p.coinsLoss ? '-' + p.coinsLoss + ' G' : '', hab.length ? hab.slice(0, 3).join(', ') + (hab.length > 3 ? ' +' + (hab.length - 3) : '') : ''].filter(Boolean).join(' · ') });
        });
        const est = (g.estudos || []).filter((e) => e && e.data && keyOf(new Date(e.data)) === key).reduce((s, e) => s + (e.minutos || 0), 0);
        if (est) out.push({ kind: 'sistema', state: 'event', title: 'Estudo', sub: est + ' min' });
        (g.notificacoes || []).filter((n) => n && n.date && n.type !== 'death' && keyOf(new Date(n.date)) === key)
            .forEach((n) => out.push({ kind: 'sistema', state: 'event', title: n.title || 'Sistema', sub: n.message || '' }));
        return out;
    }

    const visible = (items) => items.filter((i) => st.filt[i.kind]);

    function cellHtml(key, date, today, items) {
        const v = visible(items);
        const kinds = ORDER.filter((k) => v.some((i) => i.kind === k));
        const dots = kinds.map((k) => {
            const arr = v.filter((i) => i.kind === k);
            const open = arr.every((i) => i.state === 'planned' || i.state === 'pending');
            const miss = arr.some((i) => i.state === 'missed');
            return `<i class="cal2-dot${open ? ' is-open' : ''}${miss ? ' is-miss' : ''}" style="--c:${KINDS[k].cor}"></i>`;
        }).join('');
        const tk = v.filter((i) => i.kind === 'missao' || i.kind === 'habito');
        const pct = tk.length ? Math.round((tk.filter((i) => i.state === 'done').length / tk.length) * 100) : -1;
        const cls = ['cal2-cell', key === today ? 'is-today' : '', key === st.sel ? 'is-sel' : '', key > today ? 'is-future' : '', v.some((i) => i.kind === 'penal') ? 'has-pen' : ''].filter(Boolean).join(' ');
        return `<button type="button" class="${cls}" data-act="sel" data-key="${key}"><b>${date.getDate()}</b><span class="cal2-dots">${dots}</span>${pct >= 0 ? `<em style="--p:${pct}%"></em>` : ''}</button>`;
    }

    function itemHtml(i) {
        const k = KINDS[i.kind];
        return `<li class="cal2-item cal2-item--${i.state}" style="--c:${k.cor}"><span class="cal2-g">${GLYPH[i.state]}</span><div class="cal2-it"><strong>${esc(i.title)}</strong>${i.sub ? `<small>${esc(i.sub)}</small>` : ''}</div>${STATE_LBL[i.state] ? `<span class="cal2-tag">${STATE_LBL[i.state]}</span>` : ''}</li>`;
    }

    function detailHtml(key) {
        const date = fromKey(key), items = visible(dayItems(key));
        const head = `<div class="cal2-dhead"><div><small>${DIAS_LONGO[date.getDay()].toUpperCase()}</small><h3>${String(date.getDate()).padStart(2, '0')} de ${MESES[date.getMonth()]}</h3></div>
            <div class="cal2-add"><button type="button" data-act="add" data-t="missao">+ MISSÃO</button><button type="button" data-act="add" data-t="habito">+ HÁBITO</button></div></div>`;
        if (!items.length) return head + '<p class="cal2-empty">Nada registrado neste dia com os filtros atuais.</p>';
        const secs = ORDER.map((k) => {
            const arr = items.filter((i) => i.kind === k);
            return arr.length ? `<div class="cal2-sec" style="--c:${KINDS[k].cor}"><h4>${KINDS[k].ico} ${KINDS[k].nome.toUpperCase()} <span>${arr.length}</span></h4><ul>${arr.map(itemHtml).join('')}</ul></div>` : '';
        }).join('');
        return head + secs;
    }

    function summary(keys) {
        let feitas = 0, treinos = 0, pen = 0, hp = 0, perdidas = 0;
        keys.forEach((k) => dayItems(k).forEach((i) => {
            if ((i.kind === 'missao' || i.kind === 'habito') && i.state === 'done') feitas++;
            if ((i.kind === 'missao' || i.kind === 'habito') && i.state === 'missed') perdidas++;
            if (i.kind === 'treino' && i.state === 'done') treinos++;
            if (i.kind === 'penal') { pen++; hp += parseInt((i.sub.match(/-(\d+) HP/) || [0, 0])[1], 10) || 0; }
        }));
        const tile = (v, l, c) => `<div class="cal2-stat" style="--c:${c}"><b>${v}</b><span>${l}</span></div>`;
        return `<div class="cal2-stats">${tile(feitas, 'FEITAS', KINDS.missao.cor)}${tile(perdidas, 'PERDIDAS', '#f87171')}${tile(treinos, 'TREINOS', KINDS.treino.cor)}${tile(pen, 'PENALIDADES', KINDS.penal.cor)}</div>`;
    }

    function render() {
        const host = document.getElementById('sysCalendarRoot');
        if (!host || typeof gameSystem === 'undefined' || !gameSystem) return;
        const today = keyOf(new Date());
        if (!st.sel) st.sel = today;
        const week = st.mode === 'week';
        let keys = [], body = '', title;
        if (week) {
            const mon = monday(fromKey(st.sel));
            const end = addDays(mon, 6);
            title = `${mon.getDate()} ${MESES[mon.getMonth()].slice(0, 3)} – ${end.getDate()} ${MESES[end.getMonth()].slice(0, 3)}`;
            for (let n = 0; n < 7; n++) keys.push(keyOf(addDays(mon, n)));
            body = '<div class="cal2-week">' + keys.map((k) => {
                const d = fromKey(k), v = visible(dayItems(k));
                const chips = v.slice(0, 6).map((i) => `<span class="cal2-chip cal2-item--${i.state}" style="--c:${KINDS[i.kind].cor}">${GLYPH[i.state]} ${esc(i.title)}</span>`).join('') + (v.length > 6 ? `<span class="cal2-chip">+${v.length - 6}</span>` : '');
                return `<button type="button" class="cal2-wrow${k === today ? ' is-today' : ''}${k === st.sel ? ' is-sel' : ''}" data-act="sel" data-key="${k}"><div class="cal2-wd"><small>${DIAS[d.getDay()].toUpperCase()}</small><b>${d.getDate()}</b></div><div class="cal2-chips">${chips || '<span class="cal2-none">livre</span>'}</div></button>`;
            }).join('') + '</div>';
        } else {
            const y = st.view.getFullYear(), m = st.view.getMonth();
            title = `${MESES[m]} ${y}`;
            const last = new Date(y, m + 1, 0).getDate();
            const pad = (new Date(y, m, 1).getDay() + 6) % 7;
            let cells = '<i class="cal2-pad"></i>'.repeat(pad);
            for (let n = 1; n <= last; n++) {
                const d = new Date(y, m, n), k = keyOf(d);
                keys.push(k);
                cells += cellHtml(k, d, today, dayItems(k));
            }
            body = `<div class="cal2-wk">${['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((w) => `<span>${w}</span>`).join('')}</div><div class="cal2-grid">${cells}</div>`;
        }
        const chips = ORDER.map((k) => `<button type="button" class="cal2-f${st.filt[k] ? ' is-on' : ''}" style="--c:${KINDS[k].cor}" data-act="filt" data-k="${k}"><i></i>${KINDS[k].nome}</button>`).join('');
        host.innerHTML = `<div class="cal2">
            <div class="cal2-top"><button type="button" class="cal2-nav" data-act="prev" aria-label="Anterior">‹</button><h2>${title}</h2><button type="button" class="cal2-nav" data-act="next" aria-label="Próximo">›</button></div>
            <div class="cal2-bar"><div class="cal2-seg"><button type="button" class="${week ? '' : 'is-on'}" data-act="mode" data-m="month">MÊS</button><button type="button" class="${week ? 'is-on' : ''}" data-act="mode" data-m="week">SEMANA</button></div><button type="button" class="cal2-today" data-act="today">HOJE</button></div>
            ${summary(keys)}
            <div class="cal2-filters">${chips}</div>
            ${body}
            <div class="cal2-legend"><span><i class="cal2-dot"></i> feito</span><span><i class="cal2-dot is-open"></i> agendado</span><span><i class="cal2-dot is-miss"></i> perdido</span></div>
            <div class="cal2-detail">${detailHtml(st.sel)}</div></div>`;
        if (!host.dataset.cal2) {
            host.dataset.cal2 = '1';
            host.addEventListener('click', onClick);
        }
    }

    function onClick(ev) {
        const b = ev.target.closest('[data-act]');
        if (!b) return;
        const a = b.dataset.act, week = st.mode === 'week';
        if (a === 'sel') { st.sel = b.dataset.key; if (!week) st.view = new Date(fromKey(st.sel).getFullYear(), fromKey(st.sel).getMonth(), 1); }
        else if (a === 'prev' || a === 'next') {
            const s = a === 'prev' ? -1 : 1;
            if (week) { st.sel = keyOf(addDays(fromKey(st.sel), 7 * s)); }
            else { st.view = new Date(st.view.getFullYear(), st.view.getMonth() + s, 1); const t = keyOf(new Date()); st.sel = (fromKey(t).getMonth() === st.view.getMonth() && fromKey(t).getFullYear() === st.view.getFullYear()) ? t : keyOf(st.view); }
        }
        else if (a === 'today') { st.sel = keyOf(new Date()); st.view = new Date(new Date().getFullYear(), new Date().getMonth(), 1); }
        else if (a === 'mode') { st.mode = b.dataset.m; st.view = new Date(fromKey(st.sel).getFullYear(), fromKey(st.sel).getMonth(), 1); }
        else if (a === 'filt') { st.filt[b.dataset.k] = !st.filt[b.dataset.k]; saveFilt(); }
        else if (a === 'add') {
            const key = st.sel;
            if (typeof window.showMissionForm === 'function') {
                window.showMissionForm(b.dataset.t);
                setTimeout(() => { const f = document.getElementById('mf2Start'); if (f) f.value = key; }, 0);
            }
            return;
        }
        render();
    }

    window.renderSysCalendar = render;
})();
