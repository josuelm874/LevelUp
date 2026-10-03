// System_sync.js — PWA, backup JSON e sync entre dispositivos (Supabase REST, sem biblioteca).
// Sincroniza só 'gameSystemData'. A chave do OpenRouter NUNCA entra em backup nem em sync.
(function () {
    'use strict';
    const DATA_KEY = 'gameSystemData';
    const CFG_KEY = 'sysSyncCfg';      // {url, anon, email, access, refresh, exp}
    const TS_KEY = 'sysSyncLocalTs';   // quando o dado local mudou
    const LAST_KEY = 'sysSyncLastTs';  // updated_at remoto da última sincronização
    const HASH_KEY = 'sysSyncDataHash'; // hash canônico do último dado sincronizado
    const BACKUP_KEYS = [DATA_KEY, 'lastPenaltyCheckDate', 'penaltySystemInitialized'];
    const rd = k => { try { return localStorage.getItem(k); } catch (_) { return null; } };
    // Projeto Supabase dedicado (chave publishable é pública por design; a segurança é a RLS da tabela saves).
    const DEFAULTS = { url: 'https://kavahwegsdnesxzddhen.supabase.co', anon: 'sb_publishable_E47Drkv9tT5IONl0Zdy6Sg_z14a80OO' };
    const cfg = () => { try { return Object.assign({}, DEFAULTS, JSON.parse(rd(CFG_KEY)) || {}); } catch (_) { return Object.assign({}, DEFAULTS); } };
    const saveCfg = c => localStorage.setItem(CFG_KEY, JSON.stringify(c));
    const toast = (m, t) => (typeof showToast === 'function' ? showToast(m, t || 'info') : console.log(m));

    // Hash independente da ordem das chaves (jsonb do Postgres reordena): só mudança REAL de conteúdo conta.
    const canon = v => Array.isArray(v) ? '[' + v.map(canon).join(',') + ']'
        : v && typeof v === 'object' ? '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}'
        : JSON.stringify(v);
    const dataHash = raw => {
        let t; try { t = canon(JSON.parse(raw)); } catch (_) { t = String(raw); }
        let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
        return String(h);
    };

    // --- marca quando o dado local muda (usa o setItem original para não recursar) ---
    let applying = false;
    const origSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
        origSet.call(this, k, v);
        if (this === localStorage && k === DATA_KEY && !applying && dataHash(v) !== rd(HASH_KEY)) {
            origSet.call(this, TS_KEY, new Date().toISOString());
            schedulePush();
        }
    };

    // --- PWA ---
    if ('serviceWorker' in navigator && location.protocol !== 'file:' && !window.Capacitor) { // APK já serve tudo local
        navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW falhou', e));
    }
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

    // --- backup ---
    function exportBackup() {
        const out = { app: 'system-level-up', v: 1, at: new Date().toISOString(), data: {} };
        BACKUP_KEYS.forEach(k => { const v = rd(k); if (v != null) out.data[k] = v; });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }));
        a.download = 'system-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }

    function importBackup(file) {
        const r = new FileReader();
        r.onload = () => {
            let o;
            try { o = JSON.parse(r.result); JSON.parse(o.data[DATA_KEY]); } catch (_) { return toast('Backup inválido.', 'error'); }
            if (o.app !== 'system-level-up') return toast('Arquivo não é um backup do System.', 'error');
            if (!confirm('Substituir TODOS os dados atuais pelo backup?')) return;
            applying = true;
            BACKUP_KEYS.forEach(k => { if (o.data[k] != null) localStorage.setItem(k, o.data[k]); });
            origSet.call(localStorage, TS_KEY, new Date().toISOString());
            location.reload();
        };
        r.readAsText(file);
    }

    // --- Supabase REST ---
    async function sb(path, opt, auth) {
        const c = cfg();
        if (!c.url || !c.anon) throw new Error('Configure URL e chave anon do Supabase.');
        const h = Object.assign({ apikey: c.anon, 'Content-Type': 'application/json' }, (opt && opt.headers) || {});
        if (auth) h.Authorization = 'Bearer ' + (await token());
        const res = await fetch(c.url.replace(/\/$/, '') + path, Object.assign({}, opt, { headers: h }));
        const j = await res.json().catch(() => null);
        if (!res.ok) throw new Error((j && (j.msg || j.error_description || j.message)) || 'HTTP ' + res.status);
        return j;
    }

    function keepSession(j) {
        const c = cfg();
        c.access = j.access_token; c.refresh = j.refresh_token; c.exp = Date.now() + (j.expires_in - 60) * 1000;
        c.uid = j.user && j.user.id || c.uid;
        saveCfg(c);
    }

    async function token() {
        const c = cfg();
        if (c.access && Date.now() < c.exp) return c.access;
        if (!c.refresh) throw new Error('Faça login na sincronização.');
        keepSession(await sb('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: c.refresh }) }));
        return cfg().access;
    }

    async function auth(mode, email, pass) {
        const c = cfg(); c.email = email; saveCfg(c);
        const path = mode === 'signup' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
        const j = await sb(path, { method: 'POST', body: JSON.stringify({ email, password: pass }) });
        if (!j.access_token) throw new Error('Conta criada. Confirme o e-mail e faça login.');
        keepSession(j);
    }

    async function pull() {
        const rows = await sb('/rest/v1/saves?select=data,updated_at', { method: 'GET' }, true);
        return rows[0] || null;
    }

    async function push() {
        const raw = rd(DATA_KEY);
        if (!raw) return;
        const ts = rd(TS_KEY) || new Date().toISOString();
        const c = cfg();
        await sb('/rest/v1/saves?on_conflict=user_id', {
            method: 'POST',
            headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify({ user_id: c.uid, data: JSON.parse(raw), updated_at: ts })
        }, true);
        origSet.call(localStorage, LAST_KEY, ts);
        origSet.call(localStorage, HASH_KEY, dataHash(raw));
    }

    let pushTimer = null;
    function schedulePush() {
        if (!cfg().refresh) return;
        clearTimeout(pushTimer);
        pushTimer = setTimeout(() => push().then(() => setStatus('Sincronizado ' + new Date().toLocaleTimeString('pt-BR'))).catch(e => setStatus('Erro: ' + e.message)), 5000);
    }

    // Decide direção: remoto mais novo e local intocado → aplica; ambos mudaram → pergunta.
    async function sync(manual) {
        if (!cfg().refresh) return;
        const remote = await pull();
        const localTs = rd(TS_KEY), last = rd(LAST_KEY);
        if (!remote) { await push(); return setStatus('Primeiro envio feito.'); }
        const remoteNew = !last || remote.updated_at > last;
        // sem mudança real de conteúdo desde a última sync, não há "alteração local"
        const sameAsSynced = rd(HASH_KEY) && dataHash(rd(DATA_KEY) || '{}') === rd(HASH_KEY);
        const localNew = !sameAsSynced && localTs && (!last || localTs > last);
        if (remoteNew && !localNew) return applyRemote(remote);
        if (remoteNew && localNew) {
            if (confirm('Há alterações neste aparelho E na nuvem.\nOK = usar a NUVEM (perde as locais)\nCancelar = enviar ESTE aparelho (sobrescreve a nuvem)')) return applyRemote(remote);
            return push().then(() => setStatus('Nuvem sobrescrita.'));
        }
        if (localNew) { await push(); return setStatus('Enviado.'); }
        if (manual) setStatus('Já está em dia.');
    }

    function applyRemote(remote) {
        applying = true;
        origSet.call(localStorage, DATA_KEY, JSON.stringify(remote.data));
        origSet.call(localStorage, HASH_KEY, dataHash(JSON.stringify(remote.data)));
        origSet.call(localStorage, LAST_KEY, remote.updated_at);
        origSet.call(localStorage, TS_KEY, remote.updated_at);
        location.reload();
    }

    // --- UI na aba Configurações ---
    let statusEl;
    function setStatus(t) { if (statusEl) statusEl.textContent = t; }

    function buildUI() {
        const host = document.querySelector('#configuracoesSection .cfg-sections') || document.getElementById('configuracoesSection'); // .cfg-sections é a área rolável
        if (!host || document.getElementById('sysSyncCard')) return;
        const c = cfg();
        const card = document.createElement('div');
        card.id = 'sysSyncCard';
        card.className = 'sys-sync-card';
        card.innerHTML =
            '<h3>Backup e sincronização</h3>' +
            '<div class="sys-sync-row"><button type="button" id="sysBkExp">Exportar backup</button>' +
            '<label class="sys-sync-btn">Importar backup<input type="file" id="sysBkImp" accept="application/json" hidden></label></div>' +
            '<h4>Sincronizar com a nuvem (Supabase)</h4>' +
            '<input id="sysSbUrl" placeholder="URL do projeto (https://xxx.supabase.co)" autocomplete="off">' +
            '<input id="sysSbAnon" placeholder="Chave anon (publishable)" autocomplete="off">' +
            '<input id="sysSbEmail" type="email" placeholder="E-mail" autocomplete="username">' +
            '<input id="sysSbPass" type="password" placeholder="Senha (mín. 6)" autocomplete="current-password">' +
            '<div class="sys-sync-row"><button type="button" id="sysSbLogin">Entrar</button><button type="button" id="sysSbSignup">Criar conta</button>' +
            '<button type="button" id="sysSbNow">Sincronizar agora</button><button type="button" id="sysSbOut">Sair</button></div>' +
            '<div id="sysSyncStatus" class="sys-sync-status" role="status"></div>';
        host.appendChild(card);
        statusEl = card.querySelector('#sysSyncStatus');
        const $ = id => card.querySelector('#' + id);
        $('sysSbUrl').value = c.url || ''; $('sysSbAnon').value = c.anon || ''; $('sysSbEmail').value = c.email || '';
        setStatus(c.refresh ? 'Conectado como ' + (c.email || '') : 'Desconectado');
        $('sysBkExp').onclick = exportBackup;
        $('sysBkImp').onchange = e => e.target.files[0] && importBackup(e.target.files[0]);
        const run = (fn) => async () => {
            const cur = cfg(); cur.url = $('sysSbUrl').value.trim(); cur.anon = $('sysSbAnon').value.trim(); saveCfg(cur);
            try { await fn(); } catch (e) { setStatus('Erro: ' + e.message); }
        };
        const login = mode => run(async () => { await auth(mode, $('sysSbEmail').value.trim(), $('sysSbPass').value); $('sysSbPass').value = ''; setStatus('Conectado.'); await sync(true); });
        $('sysSbLogin').onclick = login('login');
        $('sysSbSignup').onclick = login('signup');
        $('sysSbNow').onclick = run(async () => { setStatus('Sincronizando…'); await sync(true); });
        $('sysSbOut').onclick = () => { const k = cfg(); delete k.access; delete k.refresh; delete k.exp; delete k.uid; saveCfg(k); setStatus('Desconectado'); };
    }

    document.addEventListener('DOMContentLoaded', () => {
        buildUI();
        sync(false).catch(e => console.warn('sync:', e.message));
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(false).catch(() => {}); });
    window.addEventListener('online', () => sync(false).catch(() => {}));
})();
