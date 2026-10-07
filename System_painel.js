/* Painel: reorganiza os blocos existentes (mantém os mesmos ids, então a leitura de dados não muda).
   Ordem final: cabeçalho compacto → vitais + moedas → faixa (completas, XP, Arena) → Arquiteto → atributos → seções. */
(function () {
    'use strict';
    const $ = (id) => document.getElementById(id);
    const root = document.querySelector('#statusSection .sys-painel');
    if (!root || root.dataset.p2) return;
    root.dataset.p2 = '1';
    root.classList.add('p2');

    const hero = root.querySelector('.sys-painel-hero');
    const row = root.querySelector('.sys-painel-kpi-row');
    const mid = root.querySelector('.sys-painel-mid');
    const level = root.querySelector('.sys-painel-card--level');
    const money = root.querySelector('.sys-painel-card--currency');
    const arena = root.querySelector('.sys-painel-card--arena');
    const virtue = root.querySelector('.sys-painel-kpi--virtue');
    const arq = root.querySelector('.sys-painel-arquiteto');
    if (!hero || !row || !mid || !level || !money || !arena || !virtue) return;

    /* título ativo vai para o cabeçalho */
    hero.appendChild(virtue);

    /* faixa: Arena vira o terceiro número (mesmos ids do cartão original) */
    const rankEl = $('painelArenaRank'), subEl = $('painelArenaRankSub');
    const tile = document.createElement('div');
    tile.className = 'sys-painel-kpi sys-painel-kpi--arena';
    tile.setAttribute('role', 'button');
    tile.tabIndex = 0;
    tile.innerHTML = '<div class="sys-painel-kpi-body"><span class="sys-painel-kpi-label">ARENA</span><span class="sys-painel-kpi-value p2-arena-val"></span><span class="p2-arena-sub"></span></div>';
    tile.querySelector('.p2-arena-val').appendChild(rankEl);
    tile.querySelector('.p2-arena-sub').appendChild(subEl);
    row.appendChild(tile);
    const go = () => { const b = $('painelArenaBtn'); if (b) b.click(); };
    tile.addEventListener('click', go);
    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    arena.style.display = 'none';

    /* ordem: cabeçalho, vitais, moedas, faixa, Arquiteto */
    root.insertBefore(mid, row);
    mid.appendChild(level);
    mid.appendChild(money);
    /* anel dos atributos: fração decimal rumo ao próximo ponto (--p em %) */
    const GS = typeof GameSystem !== 'undefined' ? GameSystem : null;
    if (GS) {
        const orig = GS.prototype.updateAttributesDisplay;
        const rings = function () {
            const at = (this.data && this.data.atributos) || {};
            document.querySelectorAll('#statusSection .sys-attr-card[data-attr]').forEach((c) => {
                const v = Number(at[c.dataset.attr]) || 0;
                c.style.setProperty('--p', Math.round((v - Math.floor(v)) * 100));
            });
        };
        GS.prototype.updateAttributesDisplay = function () { orig.apply(this, arguments); rings.call(this); };
        if (typeof gameSystem !== 'undefined' && gameSystem) rings.call(gameSystem);
    }
    row.classList.add('p2-strip');
    if (arq) {
        row.after(arq);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'p2-arq-btn';
        btn.textContent = 'CONVERSAR';
        btn.addEventListener('click', () => { const t = document.querySelector('[data-tab="arquiteto"]'); if (t) t.click(); });
        arq.appendChild(btn);
    }
})();
