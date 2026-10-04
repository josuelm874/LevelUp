// System_login.js — portão de login (e-mail/senha, Google, recuperação). Depende de window.SysAuth (System_sync.js).
(function () {
    'use strict';
    const A = window.SysAuth;
    if (!A) return;
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const TITLES = {
        login: ['ENTRAR', 'Identifique-se para acessar o Sistema.'],
        signup: ['CRIAR CONTA', 'Registre-se para despertar.'],
        forgot: ['RECUPERAR SENHA', 'Enviaremos um link para o seu e-mail.'],
        newpass: ['NOVA SENHA', 'Defina a nova senha da sua conta.']
    };
    const GOOGLE = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.7-2.6C16.9 2.9 14.7 2 12 2 6.9 2 2.8 6.1 2.8 12S6.9 22 12 22c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"/></svg>';
    let root, step, email = '';

    function render(info) {
        const [title, sub] = TITLES[step];
        const pw = step !== 'forgot', mail = step !== 'newpass';
        root.innerHTML =
            '<div class="sl-frame"><div class="sl-panel">' +
            '<img class="sl-logo" src="assets/logo.png" alt="">' +
            '<div class="sl-head"><span class="sl-ico">!</span><h1 class="sl-title">' + title + '</h1></div>' +
            '<p class="sl-sub">' + esc(sub) + '</p>' +
            '<form class="sl-form" novalidate>' +
            (mail ? '<input class="sl-in" name="email" type="email" placeholder="E-MAIL" autocomplete="username" value="' + esc(email) + '">' : '') +
            (pw ? '<input class="sl-in" name="pass" type="password" placeholder="' + (step === 'login' ? 'SENHA' : 'NOVA SENHA (MÍN. 6)') + '" autocomplete="' + (step === 'login' ? 'current-password' : 'new-password') + '">' : '') +
            (step === 'signup' || step === 'newpass' ? '<input class="sl-in" name="pass2" type="password" placeholder="CONFIRMAR SENHA" autocomplete="new-password">' : '') +
            '<div class="sl-msg" role="status">' + (info ? esc(info) : '') + '</div>' +
            '<button class="sl-btn" type="submit">' + { login: 'ENTRAR', signup: 'CRIAR CONTA', forgot: 'ENVIAR LINK', newpass: 'SALVAR SENHA' }[step] + '</button>' +
            '</form>' +
            (step === 'login' || step === 'signup' ? '<div class="sl-or"><span>OU</span></div><button class="sl-btn sl-google" type="button">' + GOOGLE + ' CONTINUAR COM GOOGLE</button>' : '') +
            '<div class="sl-links">' +
            (step === 'login' ? '<button type="button" data-go="forgot">Esqueci a senha</button><button type="button" data-go="signup">Criar conta</button>' : '') +
            (step === 'signup' || step === 'forgot' ? '<button type="button" data-go="login">Já tenho conta</button>' : '') +
            '</div></div></div>';
        const f = root.querySelector('form'), msg = root.querySelector('.sl-msg'), btn = root.querySelector('.sl-form .sl-btn');
        const say = (t, bad) => { msg.textContent = t; msg.classList.toggle('sl-bad', !!bad); };
        const busy = b => { btn.disabled = b; root.querySelectorAll('.sl-google').forEach(x => { x.disabled = b; }); };
        root.querySelectorAll('[data-go]').forEach(b => { b.onclick = () => { email = (f.email && f.email.value.trim()) || email; step = b.dataset.go; render(); }; });
        const g = root.querySelector('.sl-google');
        if (g) g.onclick = async () => { busy(true); say(''); try { await A.google(); } catch (e) { say(e.message, true); busy(false); } };
        f.onsubmit = async ev => {
            ev.preventDefault();
            const v = n => (f[n] ? f[n].value : '');
            email = v('email').trim();
            if (f.email && !/^\S+@\S+\.\S+$/.test(email)) return say('Informe um e-mail válido.', true);
            if (f.pass && v('pass').length < 6) return say('A senha precisa ter ao menos 6 caracteres.', true);
            if (f.pass2 && v('pass') !== v('pass2')) return say('As senhas não conferem.', true);
            busy(true); say('Aguarde…');
            try {
                if (step === 'login') await A.login(email, v('pass'));
                else if (step === 'signup') {
                    if (await A.signup(email, v('pass')) === 'confirm') { step = 'login'; return render('Enviamos um link de confirmação para ' + email + '. Confirme e depois entre.'); }
                } else if (step === 'forgot') { await A.recover(email); step = 'login'; return render('Link de recuperação enviado para ' + email + '.'); }
                else { await A.setPassword(v('pass')); await A.finishRecovery(); }
            } catch (e) {
                say(/invalid login/i.test(e.message) ? 'E-mail ou senha incorretos.' : e.message, true); busy(false);
            }
        };
    }

    function mount(s, info) {
        if (!root) { root = document.createElement('div'); root.id = 'sysLogin'; root.className = 'sl-gate'; document.body.appendChild(root); }
        step = s; render(info);
    }

    if (!A.loggedIn()) mount('login');
    A.ready.then(r => { if (r === 'recovery') mount('newpass'); }).catch(e => mount('login', 'Login falhou: ' + e.message));
})();
