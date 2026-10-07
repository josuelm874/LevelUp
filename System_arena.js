/* Arena: retratos ilustrados originais (SVG gerado) para quem não tem imagem em arena-avatars/,
   e personagens extras no ranking. Nenhuma imagem de terceiros é usada. */
(function () {
    'use strict';
    if (typeof ARENA_CANON_ROSTER === 'undefined') return;
    [
        { name: 'SUNG JIN-AH', nivel: 40, power: 900000 },
        { name: 'HWANG DONG-SOO', nivel: 58, power: 2600000 },
        { name: 'AHN SANG-MIN', nivel: 74, power: 13500000 }
    ].forEach((e) => { if (!ARENA_CANON_ROSTER.some((r) => r.name === e.name)) ARENA_CANON_ROSTER.push(e); });

    const KINDS = [
        ['crown', /MONARCA|ASHBORN|ANTARES|BARAN|LEGIA|QUERESHA|YOGUMUNT|SUNG JINWOO/],
        ['shadow', /BELLION|BERU|IGRIS|KAMISH|TUSK|KAISEL|IRON|JIMA|METUS|ESIL|^TANK$/],
        ['beast', /ORC|GOBLIN|LOBISOMEM|SLIME|LICH|FORMIGA|GIGANTES|ESPADACHIM|VAAL|BARUKA|GROTU|ESGARD|GANNON|CASTELO/]
    ];
    const kindOf = (n) => { const k = KINDS.find((x) => x[1].test(n)); return k ? k[0] : 'hunter'; };
    const hueOf = (n) => { let h = 0; for (let i = 0; i < n.length; i++) h = ((h << 5) - h + n.charCodeAt(i)) | 0; return Math.abs(h) % 360; };

    function portrait(name) {
        const h = hueOf(name), k = kindOf(name), a = `hsl(${h},85%,62%)`, id = 'g' + h;
        const emblem = {
            crown: `<path d="M42 38 L47 20 L56 32 L64 14 L72 32 L81 20 L86 38 Z" fill="${a}" opacity=".95"/>`,
            beast: `<path d="M46 40 C30 38 28 18 36 10 C38 24 46 28 52 32 Z M82 40 C98 38 100 18 92 10 C90 24 82 28 76 32 Z" fill="${a}"/>`,
            shadow: `<path d="M44 52 L44 34 C44 24 52 18 64 18 C76 18 84 24 84 34 L84 52 Z" fill="#0a0c14" stroke="${a}" stroke-width="2"/><rect x="48" y="50" width="32" height="4" fill="${a}" opacity=".6"/>`,
            hunter: `<path d="M100 14 L112 26 L58 100 L50 92 Z" fill="${a}" opacity=".85"/><rect x="40" y="98" width="22" height="5" rx="2" transform="rotate(-42 51 100)" fill="#cfd6e6"/>`
        }[k];
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><radialGradient id="${id}" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="hsl(${h},60%,26%)"/><stop offset="1" stop-color="hsl(${h},55%,5%)"/></radialGradient></defs>
<rect width="128" height="128" fill="url(#${id})"/><circle cx="64" cy="58" r="50" fill="hsla(${h},90%,60%,.16)"/>
<path d="M10 128 C10 96 38 84 64 84 C90 84 118 96 118 128 Z" fill="#0b0d14" stroke="${a}" stroke-opacity=".55" stroke-width="2"/>
<ellipse cx="64" cy="60" rx="20" ry="24" fill="#10121b" stroke="${a}" stroke-opacity=".7" stroke-width="2"/>
${emblem}<ellipse cx="56" cy="60" rx="3.6" ry="2" fill="${a}"/><ellipse cx="72" cy="60" rx="3.6" ry="2" fill="${a}"/></svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    const orig = window._arenaPhotoFillHtml;
    window._arenaPhotoFillHtml = function (row, kind) {
        if (row.avatarFile) return orig(row, kind);
        const podium = kind === 'podium';
        return `<img class="${podium ? 'arena-podium-photo-img' : 'arena-row-photo-img'}" src="${portrait(row.name)}" alt="" decoding="async" onerror="this.onerror=null;this.classList.add('is-broken');"/>` +
            `<span class="${podium ? 'arena-podium-photo-letters' : 'arena-row-photo-letters'}">${_escapeHtml(_arenaInitials(row.name))}</span>`;
    };
})();
