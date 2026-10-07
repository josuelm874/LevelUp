// System_mobile.js — botão Voltar do Android/PWA: fecha modal/menu, depois volta ao Painel; só então sai.
(function () {
    'use strict';
    const OVERLAYS = ['.mz-task-modal-overlay', '.it-modal-overlay', '.settings-modal', '.shop-modal:not(.hidden)', '.lj-overlay', '#taskModal'];
    // offsetParent é null em position:fixed (modais): usa getClientRects
    const visible = el => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';

    function closeTopLayer() {
        if (document.querySelector('.sys-app--sidebar-open')) { document.getElementById('sysSidebarCloseBtn')?.click(); return true; }
        for (const sel of OVERLAYS) {
            const els = [...document.querySelectorAll(sel)].filter(visible);
            const el = els[els.length - 1];
            if (!el) continue;
            const btn = el.querySelector('.settings-close, .btn-modal-cancel, .shop-modal-btn.outline, [id$="Close"]');
            if (btn) btn.click(); else el.remove();
            return true;
        }
        return false;
    }

    function goHome() {
        const active = document.querySelector('.content-section.active');
        if (!active || active.id === 'statusSection') return false;
        document.querySelector('.sys-nav-item[data-tab="status"]')?.click();
        return true;
    }

    const back = () => {
        if (closeTopLayer() || goHome()) return true;
        return false; // já no Painel sem camadas: deixa sair
    };

    const App = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (App && App.addListener) {
        // APK (Capacitor): com listener registrado o app não fecha sozinho; sai só no Painel sem camadas.
        App.addListener('backButton', () => { if (!back()) App.exitApp(); });
    } else {
        // PWA/navegador: usa o histórico
        const arm = () => history.pushState({ sys: 1 }, '');
        arm();
        window.addEventListener('popstate', () => { if (back()) arm(); });
    }
})();
