// Copia só os arquivos do app para www/ (webDir do Capacitor).
const fs = require('fs'), path = require('path');
const items = ['System.html', 'System_script.js', 'System_style.css', 'System_sync.js', 'System_mobile.js', 'System_extras.js', 'System_arquiteto.js', 'System_missoes.js', 'System_loja.js', 'System_login.js', 'sw.js', 'manifest.webmanifest', 'index.html', 'icons', 'images', 'assets', 'arena-avatars'];
fs.rmSync('www', { recursive: true, force: true });
fs.mkdirSync('www');
for (const i of items) fs.cpSync(i, path.join('www', i), { recursive: true });
