// System_loja.js — Itens de Recompensa (= inventário), Loja do Tempo e janela de compra.
// Depende de System_script.js (gameSystem, useInventoryItem, shopData) e System_extras.js (Escudo 24H via data.escudoAte).
(function () {
    'use strict';
    const gs = () => (typeof gameSystem !== 'undefined' ? gameSystem : null);
    const esc = s => (typeof _escapeHtml === 'function' ? _escapeHtml(s) : String(s));
    const fmt = n => Number(n || 0).toLocaleString('pt-BR');
    const $ = id => document.getElementById(id);

    const ITENS_TEMPO = [
        { icon: '🛡️', name: 'Escudo 24H', desc: 'Proteção contra punições por 24 horas. Missões não realizadas não causam dano.', time: '24h', price: 12000, efeito: 'Bloqueia penalidades por 24 horas' },
        { icon: '📺', name: 'Sessão TV', desc: '1 episódio de série ou filme. Aproveite.', time: '1h', price: 8000, efeito: 'Pausa merecida' },
        { icon: '🛏️', name: 'Descanso Total', desc: 'Um dia inteiro de descanso regenerativo.', time: '1 dia', price: 35000, efeito: 'Recuperação completa' },
        { icon: '🍽️', name: 'Refeição Livre', desc: 'Uma refeição livre para comer o que quiser.', time: '1 refeição', price: 12000, efeito: 'Sem culpa' },
        { icon: '🎮', name: 'Jogar Videogame', desc: '1 hora de gameplay consciente. Sem culpa.', time: '1h', price: 9000, efeito: 'Pausa merecida' },
        { icon: '👥', name: 'Saída Social', desc: 'Tempo de qualidade com amigos ou socialização.', time: '2h', price: 15000, efeito: 'Conexão e equilíbrio' }
    ].map(i => Object.assign(i, { type: 'recompensa', name: i.name.toUpperCase() }));

    const pocoes = () => ((window.shopData && window.shopData.pocoes) || []).map(p => ({
        icon: p.icon || '🧪', name: p.name, desc: 'Recupera ' + fmt(p.hpRecovery) + ' de HP imediatamente.', time: 'instantâneo', price: p.price,
        efeito: '+' + fmt(p.hpRecovery) + ' HP', type: 'pocao', hpRecovery: p.hpRecovery
    }));

    const catalog = () => ITENS_TEMPO.concat(pocoes());
    const totalItens = () => ((gs().data.inventario || []).reduce((s, i) => s + (i.quantity || 0), 0));

    // ---------- Loja ----------
    function renderLoja() {
        const g = gs(), host = $('vidShopGrid');
        if (!g || !host) return;
        const bal = g.data.moedas || 0;
        const el = $('vidShopBalance'); if (el) el.textContent = fmt(bal);
        host.className = 'lj-wrap';
        host.onclick = null;
        const card = (it, i) => `<button type="button" class="lj-card${bal >= it.price ? '' : ' lj-card--poor'}" data-i="${i}">
            <span class="lj-card-ico" aria-hidden="true">${esc(it.icon)}</span>
            <span class="lj-card-name">${esc(it.name)}</span>
            <span class="lj-card-desc">${esc(it.desc)}</span>
            <span class="lj-card-foot"><span class="lj-time">${esc(it.time)}</span><span class="lj-price">G ${fmt(it.price)}</span></span>
        </button>`;
        const all = catalog(), nT = ITENS_TEMPO.length;
        host.innerHTML = '<h3 class="lj-sec">ITENS DE TEMPO</h3><div class="lj-grid">' + all.slice(0, nT).map((it, i) => card(it, i)).join('') + '</div>'
            + (all.length > nT ? '<h3 class="lj-sec">POÇÕES</h3><div class="lj-grid">' + all.slice(nT).map((it, i) => card(it, i + nT)).join('') + '</div>' : '');
        if (!host.dataset.bound) { host.dataset.bound = '1'; host.addEventListener('click', onShopClick); }
        let link = $('ljInvLink');
        if (!link) {
            link = document.createElement('button');
            link.type = 'button'; link.id = 'ljInvLink'; link.className = 'vid-shop-history lj-invlink';
            const hist = $('vidShopHistoryBtn');
            if (hist) hist.insertAdjacentElement('afterend', link); else host.parentElement.insertBefore(link, host);
            link.addEventListener('click', () => { const t = document.querySelector('[data-tab="itensRecompensa"]'); if (t) t.click(); });
        }
        link.textContent = 'Meu inventário (' + totalItens() + ')';
    }

    function onShopClick(e) {
        const c = e.target.closest('.lj-card');
        if (c) openBuy(catalog()[+c.dataset.i]);
    }

    // ---------- janela de compra ----------
    function openBuy(it) {
        const g = gs();
        if (!it || !g || $('ljBuy')) return;
        const ov = document.createElement('div');
        ov.className = 'lj-overlay'; ov.id = 'ljBuy';
        ov.innerHTML = `<div class="lj-sheet" role="dialog" aria-label="Comprar ${esc(it.name)}">
            <button type="button" class="lj-x" id="ljClose" aria-label="Fechar">×</button>
            <div class="lj-hero"><div class="lj-ico">${esc(it.icon)}</div></div>
            <h3 class="lj-name">${esc(it.name)}</h3>
            <p class="lj-desc">${esc(it.desc)}</p>
            <div class="lj-badges"><span>⏱ ${esc(it.time)}</span><span>✦ ${esc(it.efeito)}</span></div>
            <div class="lj-buyrow">
                <div class="lj-unit"><small>PREÇO</small><b>G ${fmt(it.price)}</b></div>
                <div class="lj-qty"><button type="button" id="ljMinus" aria-label="Menos">−</button><input id="ljQty" type="number" inputmode="numeric" min="1" max="99" value="1"><button type="button" id="ljPlus" aria-label="Mais">+</button></div>
            </div>
            <div class="lj-sum"><div><span>Seu saldo</span><b id="ljBal"></b></div><div><span>Saldo após a compra</span><b id="ljAfter"></b></div></div>
            <button type="button" class="lj-buy" id="ljBuyBtn"></button>
        </div>`;
        document.body.appendChild(ov);
        const close = () => ov.remove();
        const qtyEl = ov.querySelector('#ljQty'), btn = ov.querySelector('#ljBuyBtn');
        const qty = () => Math.max(1, Math.min(99, parseInt(qtyEl.value, 10) || 1));
        const refresh = () => {
            const q = qty(), bal = g.data.moedas || 0, total = it.price * q, after = bal - total;
            qtyEl.value = q;
            ov.querySelector('#ljBal').textContent = 'G ' + fmt(bal);
            const a = ov.querySelector('#ljAfter'); a.textContent = 'G ' + fmt(after); a.classList.toggle('lj-neg', after < 0);
            btn.disabled = after < 0;
            btn.textContent = after < 0 ? 'Faltam G ' + fmt(-after) : 'COMPRAR · G ' + fmt(total);
        };
        ov.querySelector('#ljMinus').onclick = () => { qtyEl.value = qty() - 1; refresh(); };
        ov.querySelector('#ljPlus').onclick = () => { qtyEl.value = qty() + 1; refresh(); };
        qtyEl.addEventListener('input', refresh);
        ov.addEventListener('click', e => { if (e.target === ov) close(); });
        ov.querySelector('#ljClose').onclick = close;
        btn.onclick = () => {
            const q = qty(), total = it.price * q;
            if (!g.spendMoedas(total)) { refresh(); return; }
            g.addToInventory({ name: it.name, icon: it.icon, type: it.type, hpRecovery: it.hpRecovery || 0, price: it.price, origem: 'loja', em: new Date().toISOString() }, q);
            g.addNotification('COMPRA REALIZADA!', 'Você comprou ' + q + 'x ' + it.name + '! Os itens foram adicionados ao inventário.', 'coins');
            ov.querySelector('.lj-sheet').innerHTML = `<div class="lj-ok"><div class="lj-ok-ico">✔</div><h3 class="lj-name">Comprado!</h3>
                <p class="lj-desc">${q}× ${esc(it.name)} no seu inventário.</p>
                <div class="lj-actions"><button type="button" class="lj-buy" id="ljGoInv">VER INVENTÁRIO</button><button type="button" class="lj-ghost" id="ljDone">Fechar</button></div></div>`;
            ov.querySelector('#ljDone').onclick = close;
            ov.querySelector('#ljGoInv').onclick = () => { close(); const t = document.querySelector('[data-tab="itensRecompensa"]'); if (t) t.click(); };
            renderLoja(); renderItens();
        };
        refresh();
    }
    window.openShopModal = function (box) { // compatibilidade com chamadas antigas
        const name = (box.getAttribute('data-item-name') || '').toUpperCase();
        const it = catalog().find(x => x.name === name);
        if (it) openBuy(it);
    };

    // ---------- Itens de Recompensa = inventário ----------
    const ORIGEM = { loja: 'LOJA', arquiteto: 'ARQUITETO' };

    function useItem(i) {
        const g = gs(), it = (g.data.inventario || [])[i];
        if (!it || it.quantity <= 0) return;
        if (/ESCUDO/i.test(it.name)) {
            if (g.data.escudoAte > Date.now()) { showToast('O Escudo já está ativo.', 'info'); return; }
            g.data.escudoAte = Date.now() + 24 * 3600 * 1000;
            it.quantity--;
            if (it.quantity <= 0) g.data.inventario.splice(i, 1);
            g.saveData();
            g.addNotification('ESCUDO ATIVADO!', 'Penalidades automáticas bloqueadas por 24 horas.', 'info');
        } else {
            useInventoryItem(i); // poções e recompensas: lógica existente
        }
        renderItens(); renderLoja();
    }

    function renderItens() {
        const g = gs(), box = $('itensTotalBox'), grid = $('itensGrid');
        if (!g || !box || !grid) return;
        const inv = g.data.inventario || [];
        const shield = g.data.escudoAte > Date.now() ? `<div class="it2-shield">🛡️ Escudo ativo até ${new Date(g.data.escudoAte).toLocaleString('pt-BR')}</div>` : '';
        box.innerHTML = `<div class="it2-total-main"><div class="it2-num">${totalItens()}</div><div class="it2-lbl">ITENS NO INVENTÁRIO</div></div>
            <button type="button" class="it2-info" id="it2Info" aria-label="Como desbloquear itens" aria-expanded="false">!</button>`;
        $('itensShield').innerHTML = shield;
        grid.innerHTML = inv.length ? inv.map((it, i) => `<div class="it2-card">
            <div class="it2-ico">${esc(it.icon || '🎁')}</div>
            <div class="it2-body"><div class="it2-name">${esc(it.name)} <b>×${it.quantity}</b></div>
                <div class="it2-meta">${it.origem ? '<span class="it2-chip it2-chip--' + esc(it.origem) + '">' + esc(ORIGEM[it.origem] || it.origem.toUpperCase()) + '</span>' : ''}${it.em ? '<span>' + new Date(it.em).toLocaleDateString('pt-BR') + '</span>' : ''}${it.hpRecovery ? '<span>+' + fmt(it.hpRecovery) + ' HP</span>' : ''}</div></div>
            <button type="button" class="it2-use" data-i="${i}">USAR</button></div>`).join('')
            : '<div class="it2-empty">Seu inventário está vazio.<br>Compre na <b>Loja do Tempo</b> ou conclua missões especiais do Arquiteto.</div>';
        const link = $('ljInvLink'); if (link) link.textContent = 'Meu inventário (' + totalItens() + ')';
    }

    window.renderItensRecompensa = renderItens; // o handler de abertura da aba chama esse nome (catálogo antigo removido)
    window.initItensRecompensa = function () {
        const sec = $('itensRecompensaSection');
        if (!sec) return;
        if (!sec.dataset.bound) {
            sec.dataset.bound = '1';
            sec.addEventListener('click', e => {
                const info = e.target.closest('#it2Info');
                if (info) { const p = $('itensInfoPanel'); p.hidden = !p.hidden; info.setAttribute('aria-expanded', String(!p.hidden)); return; }
                const u = e.target.closest('.it2-use');
                if (u) useItem(+u.dataset.i);
            });
        }
        renderItens();
    };

    document.addEventListener('DOMContentLoaded', function () {
        if (!gs()) return;
        renderLoja(); initItensRecompensa();
        // atualiza ao abrir as abas e quando o inventário/saldo mudam
        ['shop', 'itensRecompensa'].forEach(t => { const b = document.querySelector('[data-tab="' + t + '"]'); if (b) b.addEventListener('click', () => setTimeout(() => { renderLoja(); renderItens(); }, 120)); });
        const add = gs().addToInventory.bind(gs());
        gs().addToInventory = function () { const r = add.apply(null, arguments); renderItens(); renderLoja(); return r; };
        const addM = gs().addMoedas && gs().addMoedas.bind(gs());
        if (addM) gs().addMoedas = function () { const r = addM.apply(null, arguments); renderLoja(); return r; };
    });
})();
