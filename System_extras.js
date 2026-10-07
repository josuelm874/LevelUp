// System_extras.js — inventário usável, Escudo 24H, histórico de compras e penalidade por missão recorrente.
(function () {
    'use strict';
    const esc = s => (typeof _escapeHtml === 'function' ? _escapeHtml(s) : String(s));
    const gs = () => (typeof gameSystem !== 'undefined' ? gameSystem : null);
    const $ = id => document.getElementById(id);

    // ---------- Histórico de compras ----------
    function mountHistory() {
        // captura no document: o app atribui b.onclick (stub "em desenvolvimento") depois do nosso mount
        document.addEventListener('click', e => {
            if (!e.target.closest('#vidShopHistoryBtn')) return;
            e.stopImmediatePropagation();
            const rows = (gs().data.notificacoes || []).filter(n => n.title === 'COMPRA REALIZADA!');
            const m = document.createElement('div'); m.className = 'settings-modal';
            m.innerHTML = `<div class="settings-backdrop"></div><div class="settings-box" style="max-width:520px">
                <div class="settings-header"><h3 class="settings-title">HISTÓRICO DE COMPRAS</h3><button type="button" class="settings-close">×</button></div>
                <div class="settings-content">${rows.length ? rows.map(n => `<div class="vsi-row"><span class="vsi-name">${esc(n.message)}</span><span class="vsi-time">${new Date(n.date).toLocaleDateString('pt-BR')} ${esc(n.time)}</span></div>`).join('') : '<div class="vsi-empty">Nenhuma compra ainda.</div>'}</div></div>`;
            document.body.appendChild(m);
            const close = () => m.remove();
            m.querySelector('.settings-close').onclick = close; m.querySelector('.settings-backdrop').onclick = close;
        }, true);
    }

    // ---------- Escudo + penalidade por missão recorrente ----------
    // Patch no prototype AGORA: checkDailyPenalties roda no construtor do GameSystem (antes do DOMContentLoaded).
    function patchPenalties() {
        const P = GameSystem.prototype;
        const apply = P.applyPenaltyForDate;
        P.applyPenaltyForDate = function (dateKey, names) {
            if (this.data.escudoAte > Date.now()) return; // Escudo 24H ativo
            return apply.call(this, dateKey, names);
        };
        // Avalia também missões recorrentes (não únicas) que deveriam ter sido feitas no dia
        P.evaluateHabitsForDate = function (dateKey, dateObj) {
            const d = this.data, late = [];
            (d.habitos || []).filter(h => shouldTaskAppearToday(h, dateObj)).forEach(h => {
                if (!(h.completions || []).includes(dateKey)) late.push(h.titulo || h.nome);
            });
            if (d.penalizarMissoes !== false) {
                (d.missoes || []).filter(m => !m.unique && m.ativo !== false && shouldTaskAppearToday(m, dateObj)).forEach(m => {
                    if (!(m.completions || []).includes(dateKey)) late.push(m.titulo);
                });
            }
            if (late.length) this.applyPenaltyForDate(dateKey, late);
        };
    }

    // ---------- Config: liga/desliga penalidade por missão ----------
    function mountToggle() {
        const host = document.querySelector('#configuracoesSection .cfg-sections'); if (!host || $('cfgPenMissoes')) return;
        const d = document.createElement('div'); d.className = 'sys-sync-card';
        d.innerHTML = `<h3>Regras</h3><label style="display:flex;gap:.6rem;align-items:center"><input type="checkbox" id="cfgPenMissoes">
            Penalizar missões recorrentes não cumpridas (−200 HP por dia com pendência)</label>`;
        host.appendChild(d);
        const c = $('cfgPenMissoes'); c.checked = gs().data.penalizarMissoes !== false;
        c.onchange = () => { gs().data.penalizarMissoes = c.checked; gs().saveData(); };
    }

    patchPenalties();
    document.addEventListener('DOMContentLoaded', () => {
        if (!gs()) return;
        mountHistory(); mountToggle();
    });
})();
