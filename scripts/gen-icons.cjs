// Gera ícones PWA/Android e splash a partir de assets/logo-src.jpg (fundo preto). Uso: node scripts/gen-icons.cjs
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const SRC = 'assets/logo-src.jpg', RES = 'android/app/src/main/res';
const BG = { r: 0, g: 0, b: 0, alpha: 1 };
// logo centrada em quadrado preto; scale = fração do lado ocupada
async function square(size, scale) {
    const inner = Math.round(size * scale);
    const logo = await sharp(SRC).resize(inner, inner).toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: BG } })
        .composite([{ input: logo, gravity: 'center' }]).png();
}
(async () => {
    await (await square(512, 1)).toFile('assets/logo.png');
    await (await square(192, 1)).toFile('icons/icon-192.png');
    await (await square(512, 1)).toFile('icons/icon-512.png');
    await (await square(512, 0.72)).toFile('icons/icon-maskable-512.png');
    const dens = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
    for (const [d, s] of Object.entries(dens)) {
        const dir = path.join(RES, 'mipmap-' + d);
        await (await square(s, 1)).toFile(path.join(dir, 'ic_launcher.png'));
        const round = await (await square(s, 1)).toBuffer();
        const mask = Buffer.from(`<svg width="${s}" height="${s}"><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}"/></svg>`);
        await sharp(round).composite([{ input: mask, blend: 'dest-in' }]).png().toFile(path.join(dir, 'ic_launcher_round.png'));
        await (await square(Math.round(s * 2.25), 0.62)).toFile(path.join(dir, 'ic_launcher_foreground.png'));
    }
    for (const dir of fs.readdirSync(RES).filter(n => /^drawable(-(land|port)-\w+)?$/.test(n))) {
        const f = path.join(RES, dir, 'splash.png'); if (!fs.existsSync(f)) continue;
        const { width: w, height: h } = await sharp(f).metadata();
        const lg = Math.round(Math.min(w, h) * 0.45);
        const logo = await sharp(SRC).resize(lg, lg).toBuffer();
        await sharp({ create: { width: w, height: h, channels: 4, background: BG } }).composite([{ input: logo, gravity: 'center' }]).png().toFile(f + '.tmp');
        fs.renameSync(f + '.tmp', f);
    }
    fs.writeFileSync(path.join(RES, 'values/ic_launcher_background.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#000000</color>\n</resources>\n');
    console.log('ok');
})();
