/* Ajustes de abas: Progresso (gráfico), Notificações (histórico) e Matriz de Prioridades (filtro). */
(function () {
    'use strict';
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const gs = () => (typeof gameSystem !== 'undefined' ? gameSystem : null);
    const keyOf = (d) => gs().getDateKey(d);

    /* ---------- Progresso: gráfico de linha de 14 dias, escala ajustada ao maior valor ---------- */
    function niceMax(v) {
        if (v <= 10) return 10;
        const p = Math.pow(10, Math.floor(Math.log10(v)));
        const f = [1, 2, 4, 6, 8, 10].find((m) => m * p >= v);
        return f * p;
    }
    window.drawActivityChart = function () {
        const canvas = document.getElementById('pgActivityChart');
        if (!canvas || !canvas.getContext || !gs()) return;
        const DAYS = 14, W = Math.max(240, canvas.parentElement.clientWidth - 24), H = 190;
        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        canvas.width = W * dpr; canvas.height = H * dpr;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const keys = [];
        for (let i = DAYS - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); keys.push(keyOf(d)); }
        const tasks = [].concat(gs().data.missoes || [], gs().data.habitos || []);
        const xp = keys.map((k) => tasks.reduce((s, t) => {
            const v = (t.rewards && Number(t.rewards.exp)) || Number(t.xp) || 0;
            const n = (Array.isArray(t.completions) ? t.completions : []).filter((c) => typeof c === 'string' && c.slice(0, 10) === k).length;
            return s + n * v;
        }, 0));
        const max = niceMax(Math.max.apply(null, xp));
        const L = 34, R = 22, T = 14, B = 24, cw = W - L - R, ch = H - T - B;
        const X = (i) => L + (cw * i) / (DAYS - 1), Y = (v) => T + ch - (v / max) * ch;
        ctx.clearRect(0, 0, W, H);
        ctx.font = '10px Inter, sans-serif'; ctx.textBaseline = 'middle';
        [0, 0.5, 1].forEach((f) => {
            const y = T + ch - ch * f;
            ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - R, y); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.textAlign = 'right'; ctx.fillText(String(Math.round(max * f)), L - 6, y);
        });
        const g = ctx.createLinearGradient(0, T, 0, T + ch);
        g.addColorStop(0, 'rgba(0,229,255,0.35)'); g.addColorStop(1, 'rgba(0,229,255,0)');
        ctx.beginPath(); ctx.moveTo(X(0), Y(xp[0]));
        xp.forEach((v, i) => ctx.lineTo(X(i), Y(v)));
        ctx.lineTo(X(DAYS - 1), T + ch); ctx.lineTo(X(0), T + ch); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); xp.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))));
        ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
        ctx.textAlign = 'center';
        xp.forEach((v, i) => {
            ctx.beginPath(); ctx.arc(X(i), Y(v), v > 0 ? 3.2 : 2, 0, 7); ctx.fillStyle = v > 0 ? '#00e5ff' : 'rgba(255,255,255,0.25)'; ctx.fill();
            if (i % 2 === (DAYS - 1) % 2) { ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fillText(keys[i].slice(8) + '/' + keys[i].slice(5, 7), X(i), H - 8); }
        });
        const last = xp[DAYS - 1];
        if (last > 0) { ctx.fillStyle = '#fff'; ctx.fillText('+' + last, Math.min(X(DAYS - 1), W - 18), Math.max(Y(last) - 10, 8)); }
    };
    let rz;
    window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (document.getElementById('progressoSection')?.classList.contains('active')) window.drawActivityChart(); }, 150); });

    /* ---------- Notificações: histórico agrupado por dia, com filtros de conquistas e penalidades ---------- */
    const GROUPS = {
        conquista: { nome: 'Conquistas', cor: '#4ade80', types: ['levelup', 'rankup', 'evolution'] },
        penal: { nome: 'Penalidades', cor: '#f87171', types: ['death'] },
        moedas: { nome: 'Moedas', cor: '#fbbf24', types: ['coins'] },
        sistema: { nome: 'Sistema', cor: '#60a5fa', types: null }
    };
    const groupOf = (t) => Object.keys(GROUPS).find((k) => GROUPS[k].types && GROUPS[k].types.includes(t)) || 'sistema';
    const ICON = { conquista: '▲', penal: '⚠', moedas: '◎', sistema: '✦' };
    let nFilter = 'all';
    function dayLabel(k) {
        const t = keyOf(new Date()), y = keyOf(new Date(Date.now() - 864e5));
        return k === t ? 'HOJE' : k === y ? 'ONTEM' : k.split('-').reverse().join('/');
    }
    function renderNotifs() {
        const box = document.querySelector('#notificationSection .notification-container');
        if (!box || !gs()) return;
        const all = (Array.isArray(gs().data.notificacoes) ? gs().data.notificacoes : []).filter(Boolean);
        const cnt = {};
        all.forEach((n) => { const g = groupOf(n.type); cnt[g] = (cnt[g] || 0) + 1; });
        const list = all.filter((n) => nFilter === 'all' || groupOf(n.type) === nFilter).sort((a, b) => new Date(b.date) - new Date(a.date));
        const chips = [['all', 'Todas', all.length, '#00e5ff']].concat(Object.keys(GROUPS).map((k) => [k, GROUPS[k].nome, cnt[k] || 0, GROUPS[k].cor]))
            .map((c) => `<button type="button" class="nt2-chip${nFilter === c[0] ? ' is-on' : ''}" style="--c:${c[3]}" data-nf="${c[0]}">${c[1]} <b>${c[2]}</b></button>`).join('');
        let html = '', cur = '';
        list.forEach((n) => {
            const k = n.date ? keyOf(new Date(n.date)) : '';
            if (k !== cur) { cur = k; html += `<h3 class="nt2-day">${k ? dayLabel(k) : 'SEM DATA'}</h3>`; }
            const g = groupOf(n.type), c = GROUPS[g].cor;
            const hora = n.date ? new Date(n.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
            html += `<div class="nt2-card" style="--c:${c}"><span class="nt2-ico">${ICON[g]}</span><div class="nt2-body"><strong>${esc(n.title)}</strong><p>${esc(n.message)}</p></div><div class="nt2-side"><small>${hora}</small><button type="button" class="nt2-del" data-del="${n.id}" aria-label="Apagar">×</button></div></div>`;
        });
        box.innerHTML = `<div class="nt2"><div class="nt2-chips">${chips}</div>${html || '<p class="nt2-empty">Nenhuma notificação neste filtro.</p>'}</div>`;
        if (!box.dataset.nt2) {
            box.dataset.nt2 = '1';
            box.addEventListener('click', (e) => {
                const f = e.target.closest('[data-nf]'), d = e.target.closest('[data-del]');
                if (f) { nFilter = f.dataset.nf; renderNotifs(); }
                else if (d) gs().deleteNotification(Number(d.dataset.del));
            });
        }
    }
    function hookNotifs() {
        if (typeof GameSystem === 'undefined') return false;
        GameSystem.prototype.updateNotificationsDisplay = renderNotifs;
        return true;
    }
    hookNotifs();

    /* ---------- Matriz de Prioridades: filtro de alta / média / baixa sobre missões e hábitos ---------- */
    const PRIO = { alta: { nome: 'Alta', cor: '#ef4444' }, media: { nome: 'Média', cor: '#facc15' }, baixa: { nome: 'Baixa', cor: '#22c55e' } };
    let pFilter = 'alta';
    function renderMatriz() {
        const sec = document.getElementById('matrizPrioridadesSection');
        if (!sec || !gs()) return;
        let host = document.getElementById('mzPrio');
        if (!host) {
            const old = sec.querySelector('.mz-grid'); if (old) old.style.display = 'none';
            host = document.createElement('div'); host.id = 'mzPrio'; sec.appendChild(host);
            host.addEventListener('click', (e) => { const b = e.target.closest('[data-pf]'); if (b) { pFilter = b.dataset.pf; renderMatriz(); } });
        }
        const today = keyOf(new Date());
        const items = [];
        [['Missão', gs().data.missoes], ['Hábito', gs().data.habitos]].forEach(([tipo, arr]) => (arr || []).forEach((t) => {
            if (!t || t.ativo === false) return;
            const done = Array.isArray(t.completions) && (t.unique ? t.completions.length > 0 : t.completions.some((c) => String(c).slice(0, 10) === today));
            items.push({ t, tipo, p: PRIO[t.priority] ? t.priority : 'media', done });
        }));
        const count = (p) => items.filter((i) => p === 'all' || i.p === p).length;
        const chips = [['alta', 'Alta'], ['media', 'Média'], ['baixa', 'Baixa'], ['all', 'Todas']].map((c) =>
            `<button type="button" class="mz2-chip${pFilter === c[0] ? ' is-on' : ''}" style="--c:${(PRIO[c[0]] || { cor: '#00e5ff' }).cor}" data-pf="${c[0]}">${c[1]} <b>${count(c[0])}</b></button>`).join('');
        const shown = items.filter((i) => pFilter === 'all' || i.p === pFilter).sort((a, b) => a.done - b.done || ['alta', 'media', 'baixa'].indexOf(a.p) - ['alta', 'media', 'baixa'].indexOf(b.p));
        const cards = shown.map((i) => {
            const rw = i.t.rewards || {}, meta = [i.tipo, rw.exp ? '+' + rw.exp + ' XP' : '', i.t.endDate ? 'até ' + String(i.t.endDate).slice(0, 10).split('-').reverse().join('/') : ''].filter(Boolean).join(' · ');
            return `<div class="mz2-card${i.done ? ' is-done' : ''}" style="--c:${PRIO[i.p].cor}"><span class="mz2-tag">${PRIO[i.p].nome.toUpperCase()}</span><div><strong>${esc(i.t.titulo || i.t.nome)}</strong><small>${esc(meta)}</small></div><span class="mz2-st">${i.done ? '✓' : '○'}</span></div>`;
        }).join('');
        host.innerHTML = `<div class="mz2-chips">${chips}</div><div class="mz2-list">${cards || '<p class="mz2-empty">Nenhuma tarefa com esta prioridade.</p>'}</div>`;
    }
    window.renderMatrizPrioridade = renderMatriz;

    /* re-renderiza ao abrir a aba */
    const WATCH = [['notificationSection', renderNotifs], ['matrizPrioridadesSection', renderMatriz], ['progressoSection', () => window.drawActivityChart()]];
    WATCH.forEach(([id, fn]) => {
        const el = document.getElementById(id);
        if (el) new MutationObserver(() => { if (el.classList.contains('active')) setTimeout(fn, 60); }).observe(el, { attributes: true, attributeFilter: ['class'] });
    });
})();
