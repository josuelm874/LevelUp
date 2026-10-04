// System_sync.js — PWA, backup JSON e sync entre dispositivos (Supabase REST, sem biblioteca).
// Sincroniza só 'gameSystemData'. A chave do OpenRouter NUNCA entra em backup nem em sync.
(function () {
    'use strict';
    const DATA_KEY = 'gameSystemData';
    const CFG_KEY = 'sysSyncCfg';      // {url, anon, email, access, refresh, exp}
    const TS_KEY = 'sysSyncLocalTs';   // quando o dado local mudou
    const LAST_KEY = 'sysSyncLastTs';  // updated_at remoto da última sincronização
    const HASH_KEY = 'sysSyncDataHash'; // hash canônico do último dado sincronizado
    const OWNER_KEY = 'sysSyncOwner';  // user_id dono dos dados locais
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
        if (!res.ok) { const e = new Error((j && (j.msg || j.error_description || j.message)) || 'HTTP ' + res.status); e.status = res.status; throw e; }
        return j;
    }

    function keepSession(j) {
        const c = cfg();
        c.access = j.access_token; c.refresh = j.refresh_token; c.exp = Date.now() + (j.expires_in - 60) * 1000;
        c.uid = j.user && j.user.id || c.uid;
        if (j.user && j.user.email) c.email = j.user.email;
        saveCfg(c);
    }

    async function token() {
        const c = cfg();
        if (c.access && Date.now() < c.exp) return c.access;
        if (!c.refresh) throw new Error('Faça login na sincronização.');
        try { keepSession(await sb('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: c.refresh }) })); }
        catch (e) { if (e.status >= 400 && e.status < 500) { clearSession(); location.reload(); } throw e; } // sessão revogada: volta ao login
        return cfg().access;
    }

    function clearSession() { const k = cfg(); ['access', 'refresh', 'exp', 'uid'].forEach(f => delete k[f]); saveCfg(k); }

    // 'ok' = sessão aberta; 'confirm' = conta criada, falta confirmar o e-mail
    async function auth(mode, email, pass) {
        const path = mode === 'signup' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password';
        const j = await sb(path, { method: 'POST', body: JSON.stringify({ email, password: pass }) });
        if (!j.access_token) return 'confirm';
        keepSession(j);
        await afterLogin(j.user.id);
        return 'ok';
    }

    const recover = email => sb('/auth/v1/recover', { method: 'POST', body: JSON.stringify({ email }) });
    const setPassword = pass => sb('/auth/v1/user', { method: 'PUT', body: JSON.stringify({ password: pass }) }, true);

    // Dados locais de outra conta nunca se misturam com a conta que entrou: guarda cópia e limpa.
    function wipeLocal() {
        const bk = {}; BACKUP_KEYS.forEach(k => { const v = rd(k); if (v != null) bk[k] = v; });
        if (bk[DATA_KEY]) origSet.call(localStorage, 'sysPreLoginBackup', JSON.stringify(bk));
        BACKUP_KEYS.concat(['sl_identity_name', TS_KEY, LAST_KEY, HASH_KEY]).forEach(k => localStorage.removeItem(k));
    }

    // Conta nova: nuvem vazia, app reinicia zerado e pede o nome (tela IDENTIDADE).
    async function afterLogin(uid) {
        const sameUser = rd(OWNER_KEY) === uid;
        if (!sameUser) wipeLocal();
        origSet.call(localStorage, OWNER_KEY, uid);
        if (sameUser) await sync(true); else { const remote = await pull(); if (remote) return applyRemote(remote); }
        location.reload();
    }

    async function googleStart() {
        const s = await sb('/auth/v1/settings', { method: 'GET' });
        if (!(s.external && s.external.google)) throw new Error('Login com Google ainda não foi ativado (veja GUIA_LOGIN.md).');
        const native = !!window.Capacitor;
        const redirect = native ? 'com.systemlevelup.app://login' : location.origin + location.pathname;
        const url = cfg().url + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(redirect);
        const B = native && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser;
        if (B) B.open({ url }); else location.href = url;
    }

    // Retorno de Google / link de e-mail / recuperação: tokens vêm no #fragmento.
    async function consumeHash(hash) {
        const p = new URLSearchParams((hash || '').replace(/^#/, ''));
        if (!p.get('access_token')) return null;
        const t = { access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_in: +p.get('expires_in') || 3600 };
        keepSession(t);
        const u = await sb('/auth/v1/user', { method: 'GET' }, true);
        keepSession(Object.assign({}, t, { user: u }));
        if (p.get('type') === 'recovery') return 'recovery';
        await afterLogin(u.id);
        return 'ok';
    }
    const hashJob = location.hash.includes('access_token') ? (() => { const h = location.hash; history.replaceState(null, '', location.pathname + location.search); return consumeHash(h); })() : Promise.resolve(null);
    const A = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
    if (A && A.addListener) A.addListener('appUrlOpen', e => {
        const i = (e.url || '').indexOf('#'); if (i < 0) return;
        const B = window.Capacitor.Plugins.Browser; if (B && B.close) B.close().catch(() => {});
        consumeHash(e.url.slice(i)).catch(err => toast('Login falhou: ' + err.message, 'error'));
    });

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

    if (cfg().uid && !rd(OWNER_KEY)) origSet.call(localStorage, OWNER_KEY, cfg().uid); // sessão anterior ao login obrigatório

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
        const card = document.createElement('div');
        card.id = 'sysSyncCard';
        card.className = 'sys-sync-card';
        card.innerHTML =
            '<h3>Conta e backup</h3>' +
            '<div id="sysSyncStatus" class="sys-sync-status" role="status"></div>' +
            '<div class="sys-sync-row"><button type="button" id="sysSbNow">Sincronizar agora</button><button type="button" id="sysSbOut">Sair da conta</button></div>' +
            '<div class="sys-sync-row"><button type="button" id="sysBkExp">Exportar backup</button>' +
            '<label class="sys-sync-btn">Importar backup<input type="file" id="sysBkImp" accept="application/json" hidden></label></div>';
        host.appendChild(card);
        statusEl = card.querySelector('#sysSyncStatus');
        const $ = id => card.querySelector('#' + id);
        setStatus('Conectado como ' + (cfg().email || ''));
        $('sysBkExp').onclick = exportBackup;
        $('sysBkImp').onchange = e => e.target.files[0] && importBackup(e.target.files[0]);
        $('sysSbNow').onclick = async () => { setStatus('Sincronizando…'); try { await sync(true); } catch (e) { setStatus('Erro: ' + e.message); } };
        $('sysSbOut').onclick = () => { if (confirm('Sair da conta? Os dados continuam na nuvem.')) { clearSession(); location.reload(); } };
    }

    window.SysAuth = {
        loggedIn: () => !!cfg().refresh,
        ready: hashJob,
        login: (email, pass) => auth('login', email, pass),
        signup: (email, pass) => auth('signup', email, pass),
        recover, setPassword, google: googleStart, finishRecovery: () => afterLogin(cfg().uid)
    };

    document.addEventListener('DOMContentLoaded', () => {
        buildUI();
        sync(false).catch(e => console.warn('sync:', e.message));
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(false).catch(() => {}); });
    window.addEventListener('online', () => sync(false).catch(() => {}));
})();
