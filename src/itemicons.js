/**
 * Code-drawn SVG icons for every shop item, kitchen snack and a few extras.
 * One distinct little illustration each (no generic stars / strawberries).
 */
const S = '#5b2a4a'; // shared outline colour
const svg = (inner) => `<svg viewBox="0 0 64 64" class="code-icon">${inner}</svg>`;
const st = (w = 3) => `stroke="${S}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

export const ITEM_ICONS = {
  // ---------------------------------------------------------------- hats / head
  princess_tiara: svg(`
    <path d="M8,46 L12,22 L23,34 L32,14 L41,34 L52,22 L56,46 Z" fill="#FFD43B" ${st()}/>
    <rect x="8" y="44" width="48" height="9" rx="4" fill="#FBBF24" ${st()}/>
    <circle cx="32" cy="22" r="4.5" fill="#FF4D8D" ${st(2.5)}/>
    <circle cx="14" cy="26" r="3" fill="#7DD3FC" ${st(2)}/><circle cx="50" cy="26" r="3" fill="#7DD3FC" ${st(2)}/>
    <circle cx="20" cy="49" r="2" fill="#FFF"/><circle cx="32" cy="49" r="2" fill="#FFF"/><circle cx="44" cy="49" r="2" fill="#FFF"/>`),
  giant_pink_bow: svg(`
    <path d="M32,32 C20,14 6,18 8,32 C10,46 22,48 32,32 Z" fill="#FF6FAE" ${st()}/>
    <path d="M32,32 C44,14 58,18 56,32 C54,46 42,48 32,32 Z" fill="#FF6FAE" ${st()}/>
    <path d="M30,30 L18,26 M30,34 L16,38 M34,30 L46,26 M34,34 L48,38" stroke="#FFC2DF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="26" y="25" width="12" height="14" rx="5" fill="#FF3D8F" ${st()}/>
    <path d="M28,40 L22,56 L30,51 Z M36,40 L42,56 L34,51 Z" fill="#FF6FAE" ${st(2.5)}/>`),
  daisy_crown: svg(`
    <path d="M6,40 Q32,56 58,40" stroke="#2F9E44" stroke-width="5" fill="none" stroke-linecap="round"/>
    <g ${st(2.2)}>
      ${[[14,36],[32,46],[50,36]].map(([x,y]) => `<g transform="translate(${x} ${y})">${[0,60,120,180,240,300].map(a => `<ellipse cx="0" cy="-7" rx="3.6" ry="6.5" fill="#FFF" transform="rotate(${a})"/>`).join('')}<circle r="4.3" fill="#FFD43B"/></g>`).join('')}
    </g>
    <circle cx="23" cy="43" r="2.5" fill="#FF85C0"/><circle cx="41" cy="43" r="2.5" fill="#FF85C0"/>`),
  unicorn_horn: svg(`
    <path d="M32,5 L46,48 Q32,57 18,48 Z" fill="#FDE68A" ${st()}/>
    <path d="M25,34 L39,30 M22,43 L42,38 M28,24 L36,22" stroke="#F472B6" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M12,46 Q10,38 18,40 M52,46 Q54,38 46,40" stroke="#C084FC" stroke-width="4" fill="none" stroke-linecap="round"/>
    <circle cx="49" cy="14" r="2.5" fill="#FFF"/><circle cx="14" cy="20" r="2" fill="#FFF"/>`),
  strawberry_beret: svg(`
    <ellipse cx="32" cy="38" rx="25" ry="15" fill="#FF3D6E" ${st()}/>
    <ellipse cx="32" cy="30" rx="18" ry="9" fill="#FF5C86" ${st(2.5)}/>
    <path d="M32,22 L27,13 M32,22 L37,13 M32,22 L32,10" stroke="#2F9E44" stroke-width="4" stroke-linecap="round"/>
    <g fill="#FFF3B0"><circle cx="20" cy="38" r="1.8"/><circle cx="30" cy="42" r="1.8"/><circle cx="42" cy="38" r="1.8"/><circle cx="48" cy="44" r="1.8"/><circle cx="14" cy="44" r="1.8"/></g>`),
  tangerine_stack: svg(`
    <circle cx="32" cy="46" r="15" fill="#FF8C1A" ${st()}/>
    <circle cx="32" cy="22" r="12" fill="#FFA33D" ${st()}/>
    <path d="M32,10 Q38,4 44,9 Q38,14 32,10" fill="#40C057" ${st(2.5)}/>
    <ellipse cx="26" cy="40" rx="4" ry="2.5" fill="#FFF" opacity=".6" transform="rotate(-25 26 40)"/>
    <ellipse cx="28" cy="17" rx="3" ry="2" fill="#FFF" opacity=".6" transform="rotate(-25 28 17)"/>`),
  propeller_beanie: svg(`
    <path d="M10,46 Q10,18 32,18 Q54,18 54,46 Z" fill="#4DABF7" ${st()}/>
    <path d="M10,46 L54,46 L54,52 L10,52 Z" fill="#FFD43B" ${st()}/>
    <path d="M32,18 L32,10" stroke="${S}" stroke-width="4" stroke-linecap="round"/>
    <path d="M32,10 L14,4 Q12,12 32,10 Z" fill="#FF4D8D" ${st(2.5)}/>
    <path d="M32,10 L50,16 Q52,8 32,10 Z" fill="#FFD43B" ${st(2.5)}/>
    <circle cx="32" cy="10" r="3" fill="#FFF" ${st(2)}/>`),
  chef_toque: svg(`
    <path d="M14,34 C2,30 4,10 20,12 C24,2 42,2 44,12 C60,10 62,30 50,34 L50,52 L14,52 Z" fill="#FFF" ${st()}/>
    <path d="M22,36 L22,52 M32,34 L32,52 M42,36 L42,52" stroke="#E5E7EB" stroke-width="3"/>
    <rect x="14" y="48" width="36" height="6" rx="3" fill="#FFE3EC" ${st(2.5)}/>`),
  // ---------------------------------------------------------------- glasses
  heart_sunglasses: svg(`
    <path d="M6,22 L58,22" stroke="${S}" stroke-width="4" stroke-linecap="round"/>
    <path d="M18,48 C4,38 6,22 16,24 C22,25 24,29 18,30 C24,29 26,25 32,30 C32,40 26,44 18,48 Z" fill="#FF4D8D" ${st()} transform="translate(0 -2)"/>
    <path d="M46,48 C32,40 32,28 38,26 C44,26 46,29 46,30 C46,29 48,26 54,26 C62,26 62,40 46,48 Z" fill="#FF4D8D" ${st()} transform="translate(0 -2)"/>
    <ellipse cx="16" cy="32" rx="3" ry="2" fill="#FFF" opacity=".7"/><ellipse cx="44" cy="32" rx="3" ry="2" fill="#FFF" opacity=".7"/>`),
  mustache_monocle: svg(`
    <circle cx="44" cy="22" r="12" fill="#BAE6FD" fill-opacity=".6" ${st()} stroke="#F59E0B"/>
    <path d="M44,34 Q44,50 38,58" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
    <path d="M6,44 C8,34 20,34 26,42 C32,34 44,34 46,44 C40,42 34,46 26,48 C18,46 12,48 6,44 Z" fill="#6B3F1D" ${st(2.5)} transform="translate(0 4)"/>`),
  cucumber_masks: svg(`
    <circle cx="20" cy="32" r="14" fill="#B2F2BB" ${st()}/><circle cx="20" cy="32" r="9" fill="#8CE99A" ${st(2)}/>
    <circle cx="44" cy="32" r="14" fill="#B2F2BB" ${st()}/><circle cx="44" cy="32" r="9" fill="#8CE99A" ${st(2)}/>
    <g fill="#51CF66"><circle cx="18" cy="30" r="1.6"/><circle cx="23" cy="35" r="1.6"/><circle cx="42" cy="30" r="1.6"/><circle cx="47" cy="35" r="1.6"/><circle cx="21" cy="28" r="1.6"/><circle cx="45" cy="28" r="1.6"/></g>`),
  star_shades: svg(`
    <path d="M6,26 L58,26" stroke="${S}" stroke-width="4" stroke-linecap="round"/>
    <polygon points="19,12 23,22 34,23 26,31 28,43 19,37 10,43 12,31 4,23 15,22" fill="#FFD43B" ${st(2.8)} transform="translate(3 3)"/>
    <polygon points="19,12 23,22 34,23 26,31 28,43 19,37 10,43 12,31 4,23 15,22" fill="#FFD43B" ${st(2.8)} transform="translate(33 3)"/>`),
  // ---------------------------------------------------------------- neck / body
  fluffy_pink_boa: svg(`
    <path d="M6,40 Q20,20 34,36 Q46,50 58,26" stroke="#FF8FC7" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M6,40 Q20,20 34,36 Q46,50 58,26" stroke="#FFC2DF" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="1 9"/>
    <g fill="#FFC2DF"><circle cx="12" cy="36" r="5"/><circle cx="24" cy="26" r="5"/><circle cx="38" cy="38" r="5"/><circle cx="50" cy="38" r="5"/></g>`),
  superhero_cape: svg(`
    <path d="M14,8 L50,8 L58,56 Q32,46 6,56 Z" fill="#E03131" ${st()}/>
    <path d="M14,8 Q32,22 50,8" fill="none" ${st(3)}/>
    <circle cx="32" cy="14" r="5" fill="#FFD43B" ${st(2.5)}/>
    <polygon points="32,26 35,34 43,35 37,40 39,48 32,44 25,48 27,40 21,35 29,34" fill="#FFD43B" ${st(2.2)}/>`),
  dino_hoodie: svg(`
    <path d="M14,56 L14,30 Q14,12 32,12 Q50,12 50,30 L50,56 Z" fill="#69DB7C" ${st()}/>
    <path d="M22,12 L26,3 L31,11 L37,3 L41,12 Z" fill="#2F9E44" ${st(2.5)}/>
    <circle cx="25" cy="26" r="4" fill="#FFF" ${st(2)}/><circle cx="39" cy="26" r="4" fill="#FFF" ${st(2)}/>
    <circle cx="25" cy="26" r="1.8" fill="${S}"/><circle cx="39" cy="26" r="1.8" fill="${S}"/>
    <path d="M24,38 Q32,46 40,38" stroke="${S}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M26,40 L27,44 L30,41 M34,41 L37,44 L38,40" fill="#FFF" stroke="${S}" stroke-width="1.5"/>`),
  ballet_tutu: svg(`
    <path d="M18,22 L46,22 L60,50 Q32,60 4,50 Z" fill="#FFB3D9" ${st()}/>
    <path d="M14,44 Q32,54 50,44 M20,34 Q32,40 44,34" stroke="#FF85C0" stroke-width="3" fill="none"/>
    <rect x="16" y="14" width="32" height="10" rx="5" fill="#FF4D8D" ${st()}/>
    <circle cx="32" cy="19" r="3" fill="#FFD43B" ${st(2)}/>`),
  pearl_collar: svg(`
    <path d="M8,18 Q32,62 56,18" stroke="#FEE2E2" stroke-width="2" fill="none"/>
    ${Array.from({length: 9}, (_, i) => { const t = i / 8; const x = 8 + 48 * t; const y = 18 + 36 * Math.sin(Math.PI * t); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#FFF7F0" ${st(2.2)}/>`; }).join('')}
    <ellipse cx="30" cy="52" rx="2" ry="1.4" fill="#FFF" opacity=".9"/>`),
  // ---------------------------------------------------------------- props
  fairy_wand: svg(`
    <path d="M14,54 L38,30" stroke="#C084FC" stroke-width="6" stroke-linecap="round"/>
    <path d="M14,54 L38,30" stroke="#FDE68A" stroke-width="2" stroke-linecap="round"/>
    <polygon points="44,6 49,18 62,19 52,27 56,40 44,33 32,40 36,27 26,19 39,18" fill="#FFD43B" ${st()}/>
    <circle cx="14" cy="14" r="2.5" fill="#FF85C0"/><circle cx="58" cy="50" r="2.5" fill="#7DD3FC"/><circle cx="22" cy="30" r="2" fill="#FFF"/>`),
  mini_ukulele: svg(`
    <path d="M30,34 C20,34 16,44 22,50 C16,56 22,62 32,60 C42,62 48,56 42,50 C48,44 44,34 34,34 Z" fill="#F59E0B" ${st()} transform="translate(-4 -6)"/>
    <circle cx="28" cy="46" r="5" fill="#7C2D12" ${st(2)}/>
    <rect x="26" y="4" width="6" height="34" rx="3" fill="#B45309" ${st(2.5)} transform="rotate(12 29 20) translate(2 0)"/>
    <rect x="30" y="2" width="9" height="8" rx="3" fill="#FF6FAE" ${st(2.5)} transform="rotate(12 34 6)"/>
    <path d="M22,40 L34,40" stroke="#FEF3C7" stroke-width="2"/>`),
  boba_tea_cup: svg(`
    <path d="M14,18 L50,18 L45,58 Q32,62 19,58 Z" fill="#FFE4F0" fill-opacity=".85" ${st()}/>
    <path d="M17,34 L47,34 L45,58 Q32,62 19,58 Z" fill="#E8A87C" ${st(2.5)}/>
    <g fill="#3B2314"><circle cx="24" cy="52" r="3.2"/><circle cx="32" cy="55" r="3.2"/><circle cx="40" cy="52" r="3.2"/><circle cx="28" cy="46" r="3.2"/><circle cx="37" cy="46" r="3.2"/></g>
    <rect x="12" y="13" width="40" height="7" rx="3.5" fill="#FF85C0" ${st(2.5)}/>
    <path d="M38,14 L44,2" stroke="#4DABF7" stroke-width="5" stroke-linecap="round"/>`),
  flower_pinwheel: svg(`
    <path d="M32,32 L32,60" stroke="#8B5E34" stroke-width="4" stroke-linecap="round"/>
    <path d="M32,32 L32,8 L48,16 Z" fill="#FF6FAE" ${st(2.5)}/>
    <path d="M32,32 L56,32 L48,48 Z" fill="#FFD43B" ${st(2.5)}/>
    <path d="M32,32 L32,56 L16,48 Z" fill="#74C0FC" ${st(2.5)}/>
    <path d="M32,32 L8,32 L16,16 Z" fill="#69DB7C" ${st(2.5)}/>
    <circle cx="32" cy="32" r="4.5" fill="#FFF" ${st(2.5)}/>`),

  // ---------------------------------------------------------------- foods
  tangerine_slice: svg(`
    <circle cx="32" cy="34" r="25" fill="#FFB347" ${st()}/>
    <circle cx="32" cy="34" r="20" fill="#FF8C1A" ${st(2)}/>
    ${[0,45,90,135,180,225,270,315].map(a => `<path d="M32,34 L32,17" stroke="#FFE0A8" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 32 34)"/>`).join('')}
    <circle cx="32" cy="34" r="3" fill="#FFE0A8"/>
    <path d="M36,9 Q44,2 50,8 Q42,14 36,9" fill="#40C057" ${st(2.5)}/>`),
  kelp_gummy: svg(`
    <path d="M10,52 Q6,34 16,26 Q26,18 22,6 Q36,10 34,26 Q32,38 42,40 Q54,42 54,54 Z" fill="#20C997" ${st()}/>
    <path d="M18,44 Q16,34 24,28 M34,48 Q30,40 38,38" stroke="#A8F5E3" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="22" r="4" fill="#63E6BE" ${st(2)}/><circle cx="12" cy="18" r="3" fill="#63E6BE" ${st(2)}/>`),
  strawberry: svg(`
    <path d="M32,56 C10,46 8,24 22,22 Q32,26 42,22 C56,24 54,46 32,56 Z" fill="#FF3D6E" ${st()}/>
    <path d="M22,22 L32,12 L42,22 Q32,26 22,22 Z" fill="#40C057" ${st(2.5)}/>
    <path d="M32,12 L32,5" stroke="#2F9E44" stroke-width="4" stroke-linecap="round"/>
    <g fill="#FFF3B0"><circle cx="24" cy="34" r="1.8"/><circle cx="34" cy="32" r="1.8"/><circle cx="40" cy="40" r="1.8"/><circle cx="28" cy="44" r="1.8"/><circle cx="34" cy="50" r="1.8"/></g>`),
  watermelon: svg(`
    <path d="M6,26 A26,26 0 0 0 58,26 Z" fill="#2F9E44" ${st()}/>
    <path d="M10,26 A22,22 0 0 0 54,26 Z" fill="#E8F5E9"/>
    <path d="M13,26 A19,19 0 0 0 51,26 Z" fill="#FF4D6D"/>
    <g fill="${S}"><ellipse cx="22" cy="33" rx="1.8" ry="3"/><ellipse cx="32" cy="37" rx="1.8" ry="3"/><ellipse cx="42" cy="33" rx="1.8" ry="3"/></g>
    <path d="M6,26 L58,26" stroke="${S}" stroke-width="3" stroke-linecap="round"/>`),
  blueberry_bowl: svg(`
    <circle cx="22" cy="28" r="9" fill="#4C6EF5" ${st(2.5)}/><circle cx="36" cy="22" r="9" fill="#5C7CFA" ${st(2.5)}/><circle cx="44" cy="32" r="9" fill="#4C6EF5" ${st(2.5)}/><circle cx="30" cy="34" r="9" fill="#748FFC" ${st(2.5)}/>
    <g fill="#364FC7"><circle cx="22" cy="26" r="2"/><circle cx="36" cy="20" r="2"/><circle cx="44" cy="30" r="2"/><circle cx="30" cy="32" r="2"/></g>
    <path d="M8,36 L56,36 Q54,56 32,58 Q10,56 8,36 Z" fill="#FFE3EC" ${st()}/>
    <path d="M14,44 Q32,50 50,44" stroke="#FF85C0" stroke-width="3" fill="none"/>`),
  bamboo_shoot: svg(`
    <rect x="22" y="6" width="20" height="50" rx="8" fill="#8CE99A" ${st()}/>
    <path d="M22,20 L42,20 M22,34 L42,34 M22,47 L42,47" stroke="${S}" stroke-width="3"/>
    <path d="M42,26 Q58,14 60,28 Q50,34 42,28 Z" fill="#40C057" ${st(2.5)}/>
    <path d="M22,40 Q8,30 6,42 Q14,48 22,43 Z" fill="#69DB7C" ${st(2.5)}/>
    <path d="M28,10 L28,54" stroke="#D3F9D8" stroke-width="3" stroke-linecap="round"/>`),
  rainbow_cupcake: svg(`
    <path d="M14,34 L50,34 L45,58 L19,58 Z" fill="#FFB3D9" ${st()}/>
    <path d="M24,34 L26,58 M32,34 L32,58 M40,34 L38,58" stroke="#FF85C0" stroke-width="2.5"/>
    <path d="M10,34 C6,22 18,18 20,16 C22,6 42,6 44,16 C58,20 56,34 52,34 Z" fill="#FFF" ${st()}/>
    <path d="M14,30 Q32,22 50,30" stroke="#FF6B6B" stroke-width="4" fill="none"/>
    <path d="M15,25 Q32,17 49,25" stroke="#FFD43B" stroke-width="4" fill="none"/>
    <path d="M19,20 Q32,13 45,20" stroke="#4DABF7" stroke-width="4" fill="none"/>
    <circle cx="32" cy="8" r="4.5" fill="#FF3D6E" ${st(2.5)}/>`),
  strawberry_boba: svg(`
    <path d="M16,14 L48,14 L44,58 Q32,62 20,58 Z" fill="#FFD6E8" fill-opacity=".9" ${st()}/>
    <path d="M18,30 L46,30 L44,58 Q32,62 20,58 Z" fill="#FF8FB8" ${st(2.5)}/>
    <g fill="#3B2314"><circle cx="25" cy="53" r="3"/><circle cx="33" cy="55" r="3"/><circle cx="40" cy="52" r="3"/><circle cx="29" cy="48" r="3"/></g>
    <rect x="13" y="10" width="38" height="7" rx="3.5" fill="#FFF" ${st(2.5)}/>
    <path d="M38,10 L44,1" stroke="#FF3D6E" stroke-width="5" stroke-linecap="round"/>
    <path d="M28,34 L30,40 L34,34 L32,28 Z" fill="#FF3D6E" opacity=".8"/>`),
  star_pancakes: svg(`
    <ellipse cx="32" cy="46" rx="26" ry="10" fill="#E8A74A" ${st()}/>
    <ellipse cx="32" cy="38" rx="24" ry="9" fill="#F5B041" ${st()}/>
    <ellipse cx="32" cy="29" rx="22" ry="8" fill="#FFCB6B" ${st()}/>
    <rect x="22" y="16" width="20" height="9" rx="3" fill="#FFE066" ${st(2.5)}/>
    <path d="M30,24 Q28,34 34,32 Q42,30 38,24" fill="#8B4513" ${st(2)}/>
    <polygon points="32,4 34,10 40,10 35,14 37,20 32,16 27,20 29,14 24,10 30,10" fill="#FFD43B" ${st(2)} transform="translate(0 0)"/>`),
  taco_supreme: svg(`
    <path d="M6,48 A26,26 0 0 1 58,48 Z" fill="#FAD390" ${st()}/>
    <path d="M12,44 Q22,22 32,22 Q42,22 52,44" fill="#69DB7C" ${st(2.5)}/>
    <path d="M18,42 Q30,26 46,42 Z" fill="#E03131" ${st(2.2)}/>
    <path d="M22,40 Q32,32 42,40" stroke="#FFD43B" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M6,48 L58,48" stroke="${S}" stroke-width="3" stroke-linecap="round"/>`),

  // ---------------------------------------------------------------- extras
  treats: svg(`
    <path d="M32,56 C12,46 10,26 22,24 Q32,28 42,24 C54,26 52,46 32,56 Z" fill="#FF3D6E" ${st()}/>
    <path d="M22,24 L32,14 L42,24 Z" fill="#40C057" ${st(2.5)}/>
    <circle cx="50" cy="14" r="8" fill="#FFD43B" ${st(2.5)}/><path d="M50,10 L50,18" stroke="#B45309" stroke-width="2.5"/>`),
  heart: svg(`<path d="M32,56 C6,38 10,12 26,14 Q32,16 32,22 Q32,16 38,14 C54,12 58,38 32,56 Z" fill="#FF4D8D" ${st()}/><ellipse cx="22" cy="24" rx="4" ry="2.5" fill="#FFF" opacity=".7" transform="rotate(-30 22 24)"/>`),
  lock: svg(`<rect x="12" y="28" width="40" height="28" rx="8" fill="#FFD43B" ${st()}/><path d="M20,28 L20,20 A12,12 0 0 1 44,20 L44,28" fill="none" ${st(4)}/><circle cx="32" cy="42" r="4" fill="${S}"/>`)
};
