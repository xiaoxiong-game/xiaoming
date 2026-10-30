// Pencil-line river shared by the home page and the water side of the temple site.
window.XMRiver = (() => {
  // Wave rows repeat every 1600 units, so sliding them 1600 to the side loops without a seam.
  function wave(period, amp) {
    let d = 'M0 20Q' + period / 4 + ' ' + (20 - amp) + ' ' + period / 2 + ' 20';
    for (let x = period; x <= 3200; x += period / 2) d += 'T' + x + ' 20';
    return d;
  }
  // The defs here also hold the graphite filter that lamp() draws with.
  function waves() {
    const defs = '<svg class="defs" width="0" height="0"><filter id="xm-pencil" filterUnits="userSpaceOnUse" x="0" y="0" width="3200" height="40">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>' +
      '<filter id="xm-graphite" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="wob"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="wob" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="rough"/><feTurbulence type="fractalNoise" baseFrequency="2.2" seed="9"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 0 -.8" result="grain"/><feComposite in="rough" in2="grain" operator="in"/></filter></svg>';
    const rows = [['e', 800, 10], ['a', 400, 9], ['b', 320, 11], ['c', 200, 6], ['d', 160, 8]];
    return '<div class="waves" aria-hidden="true">' + defs + rows.map(([k, p, a]) => '<svg class="wv wv-' + k + '" viewBox="0 0 3200 40" width="3200" height="40"><path pathLength="3200" filter="url(#xm-pencil)" d="' + wave(p, a) + '"/></svg>').join('') + '</div>';
  }
  // 岸上那盏纸灯，铅笔线稿；灯签拴在底板下面，和 K7 照片里一样。
  function lamp() {
    const hatch = (n, f) => Array.from({ length: n }, (_, k) => f(k)).join('');
    const side = hatch(11, k => 'M' + (78 + k * 3.2) + ' 116L' + (100 + k * 3.2) + ' 50');
    const shade = hatch(15, k => 'M' + (39 + k * 3.3) + ' 112.4L' + (42 + k * 3.3) + ' 106') + hatch(23, k => 'M' + (32 + k * 2.6) + ' 119.6L' + (34 + k * 2.6) + ' 115.8');
    const ink = ' fill="none" stroke="#d3dfdb" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"';
    return '<div class="lamp" aria-hidden="true"><svg viewBox="4 44 132 140"><defs>' +
      '<radialGradient id="xm-glow"><stop offset="0" stop-color="#ffce82" stop-opacity=".55"/><stop offset=".4" stop-color="#ffbe6e" stop-opacity=".16"/><stop offset="1" stop-color="#ffbe6e" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="xm-side"><path d="M87 61L101.5 54L102 106L88 113Z"/></clipPath>' +
      '<linearGradient id="xm-fadeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>' +
      '<mask id="xm-fade"><rect x="0" y="121" width="140" height="69" fill="url(#xm-fadeg)"/></mask></defs>' +
      '<circle class="gl" cx="62.5" cy="84" r="46" fill="url(#xm-glow)"/><ellipse class="gl" cx="62.5" cy="138" rx="9" ry="18" fill="url(#xm-glow)"/>' +
      '<path d="M36.5 62.5L87 61L88 113L36.5 114Z" fill="#ffd696" fill-opacity=".07"/><path d="M87 61L101.5 54L102 106L88 113Z" fill="#ffd696" fill-opacity=".035"/>' +
      '<g class="fl"><path d="M62.5 79C65.8 84 66 88.6 62.5 91C59 88.6 59.2 84 62.5 79Z" fill="#ffd79a"/><path d="M62.5 84.5C63.8 86.6 63.8 88.6 62.5 89.6C61.2 88.6 61.2 86.6 62.5 84.5Z" fill="#fff4dc"/></g>' +
      '<g id="xm-lampbody" filter="url(#xm-graphite)"' + ink + '>' +
      '<path d="M35 63.5L89 61.5M87 59.5L88.5 115M34 113.8L90 112.8M37.5 60.5L36.5 115.5M86 61.5L102.5 53.5M101 52L102 107.5M87 113.5L103 105.5M49 55.3L103 53.6M37 62.5L52 54.6' +
      'M30 115.5L93 114.6M30.5 120L93.5 119.2M30.2 115.2L30.6 120.4M93 114.4L93.4 119.6M93 114.6L108 107.4M93.4 119.4L108.4 112M108 107.2L108.4 112.2M30 115.4L45 108.4"/>' +
      '<path stroke-width=".8" opacity=".55" d="M38 62.4L86 61M86.6 62L87.4 112M37 114.4L87 113.6M38.4 63L37.6 113M39 66L85 64.7M88.5 65.4L100.8 59.2M54 62.3L54.4 113.5M70.5 61.8L71 113M94.5 57.6L95.2 109.7' +
      'M58.5 95.5L58.6 111M66.5 95.5L66.4 111M58.5 95.5Q62.5 93.8 66.5 95.5M62.5 94.6L62.6 91.4"/>' +
      '<path stroke-width=".6" opacity=".4" clip-path="url(#xm-side)" d="' + side + '"/><path stroke-width=".6" opacity=".4" d="' + shade + '"/>' +
      '<path stroke-width=".8" opacity=".4" d="M44 73L50 72.6M47 70.5L47.3 80M44.6 77L50.4 76.4M45 81.5Q47.5 84 50.6 81M44.4 89L50.6 88.6M47.6 87L47.2 99M44.2 94Q47 92 50.8 95M45 98.6L50 97.8"/></g>' +
      '<g class="rf" mask="url(#xm-fade)"><g transform="translate(0 241) scale(1 -1)"><use href="#xm-lampbody"/></g></g>' +
      '<g filter="url(#xm-graphite)" opacity=".45"' + ink + '><path d="M8 122Q16 119.4 24 122T40 122M98 121Q106 118.6 114 121T130 121M20 128Q28 126 36 128T52 128M76 127.5Q84 125.5 92 127.5T108 127.5"/>' +
      '<g class="tg"><path d="M34 120.5C32.6 128 36.4 133.5 35 141M30 141L40 140.4L40.8 154L30.6 154.6ZM32.4 147.2L38.6 146.8M32.6 150.6L37.4 150.3"/></g></g></svg></div>';
  }
  return { waves, lamp };
})();
