/**
 * Cozy Critter Salon & Spa - Code-Drawn SVG Icon Library (src/icons.js)
 * Zero emoji reliance: Every UI, HUD, station, pet, and tool icon is a crisp vector illustration.
 */

import { ITEM_ICONS } from './itemicons.js';

export const ICONS = {
  coin: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <circle cx="32" cy="32" r="27" fill="#F59E0B" stroke="#92400E" stroke-width="3.5"/>
      <circle cx="32" cy="32" r="21" fill="#FDE047" stroke="#D97706" stroke-width="2"/>
      <polygon points="32,15 36,25 47,26 39,33 41,44 32,38 23,44 25,33 17,26 28,25" fill="#F59E0B"/>
      <ellipse cx="22" cy="20" rx="5" ry="3" transform="rotate(-30 22 20)" fill="#FFF" opacity="0.8"/>
    </svg>`,

  star: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <polygon points="32,6 40,21 57,24 44,36 47,53 32,45 17,53 20,36 7,24 24,21"
               fill="#FDE047" stroke="#B45309" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="32,12 37,23 49,25 40,34 42,46 32,40 22,46 24,34 15,25 27,23" fill="#FEF08A"/>
      <circle cx="26" cy="28" r="2.8" fill="#4A154B"/>
      <circle cx="38" cy="28" r="2.8" fill="#4A154B"/>
      <path d="M28,34 Q32,38 36,34" stroke="#4A154B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`,

  home: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M12,30 L12,54 Q12,57 15,57 L49,57 Q52,57 52,54 L52,30 Z" fill="#FFF1F2" stroke="#9D174D" stroke-width="3.5"/>
      <path d="M6,32 L32,9 L58,32 Z" fill="#FF6B9D" stroke="#9D174D" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="25" y="37" width="14" height="20" rx="6" fill="#F472B6" stroke="#9D174D" stroke-width="3"/>
      <circle cx="32" cy="25" r="5" fill="#FEF08A" stroke="#9D174D" stroke-width="2.5"/>
    </svg>`,

  shop: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M22,24 C22,12 42,12 42,24" stroke="#9D174D" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M14,22 L50,22 L54,54 Q54,57 50,57 L14,57 Q10,57 10,54 Z" fill="#FF85A2" stroke="#9D174D" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M32,33 C27,27 19,33 32,45 C45,33 37,27 32,33 Z" fill="#FFF" stroke="#9D174D" stroke-width="2"/>
    </svg>`,

  clipboard: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="14" y="12" width="36" height="46" rx="7" fill="#FDBA74" stroke="#7C2D12" stroke-width="3.5"/>
      <rect x="18" y="18" width="28" height="36" rx="4" fill="#FFF"/>
      <rect x="23" y="7" width="18" height="9" rx="4" fill="#94A3B8" stroke="#334155" stroke-width="2.5"/>
      <path d="M22,28 L26,32 L33,24" stroke="#16A34A" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="36" y1="29" x2="43" y2="29" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
      <path d="M22,41 L26,45 L33,37" stroke="#16A34A" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="36" y1="42" x2="43" y2="42" stroke="#64748B" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  camera: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="8" y="18" width="48" height="36" rx="10" fill="#F472B6" stroke="#831843" stroke-width="3.5"/>
      <path d="M21,18 L25,11 L39,11 L43,18 Z" fill="#FBCFE8" stroke="#831843" stroke-width="3"/>
      <circle cx="32" cy="36" r="12" fill="#38BDF8" stroke="#831843" stroke-width="3.5"/>
      <circle cx="28" cy="32" r="4" fill="#FFF"/>
      <circle cx="46" cy="26" r="3" fill="#FEF08A"/>
    </svg>`,

  speakerOn: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M12,25 L22,25 L34,14 L34,50 L22,39 L12,39 Z" fill="#34D399" stroke="#065F46" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M41,22 Q49,32 41,42" stroke="#065F46" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M47,15 Q59,32 47,49" stroke="#065F46" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </svg>`,

  speakerOff: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M12,25 L22,25 L34,14 L34,50 L22,39 L12,39 Z" fill="#94A3B8" stroke="#334155" stroke-width="3.5" stroke-linejoin="round"/>
      <line x1="41" y1="24" x2="53" y2="38" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
      <line x1="53" y1="24" x2="41" y2="38" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
    </svg>`,

  gear: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <circle cx="32" cy="32" r="18" fill="#CBD5E1" stroke="#334155" stroke-width="4"/>
      <circle cx="32" cy="32" r="8" fill="#FFF" stroke="#334155" stroke-width="3"/>
      <g stroke="#334155" stroke-width="6" stroke-linecap="round">
        <line x1="32" y1="7" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="57"/>
        <line x1="7" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="57" y2="32"/>
        <line x1="14" y1="14" x2="18" y2="18"/><line x1="46" y1="46" x2="50" y2="50"/>
        <line x1="50" y1="14" x2="46" y2="18"/><line x1="18" y1="46" x2="14" y2="50"/>
      </g>
    </svg>`,

  close: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <circle cx="32" cy="32" r="26" fill="#FFE4E6" stroke="#E11D48" stroke-width="4"/>
      <path d="M22,22 L42,42 M42,22 L22,42" stroke="#E11D48" stroke-width="5.5" stroke-linecap="round"/>
    </svg>`,

  play: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <polygon points="18,12 52,32 18,52" fill="#FFF" stroke="#9D174D" stroke-width="3.5" stroke-linejoin="round"/>
    </svg>`,

  dice: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="10" y="10" width="44" height="44" rx="10" fill="#FEF08A" stroke="#B45309" stroke-width="3.5"/>
      <circle cx="22" cy="22" r="4" fill="#B45309"/><circle cx="42" cy="22" r="4" fill="#B45309"/>
      <circle cx="32" cy="32" r="4" fill="#E11D48"/>
      <circle cx="22" cy="42" r="4" fill="#B45309"/><circle cx="42" cy="42" r="4" fill="#B45309"/>
    </svg>`,

  pencil: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <polygon points="14,50 20,34 44,10 54,20 30,44" fill="#FBBF24" stroke="#78350F" stroke-width="3.5" stroke-linejoin="round"/>
      <polygon points="14,50 18,39 25,46" fill="#3B1E08"/>
    </svg>`,

  callPets: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M32,38 C20,24 10,34 32,52 C54,34 44,24 32,38 Z" fill="#FF6B9D" stroke="#831843" stroke-width="3"/>
      <circle cx="19" cy="22" r="5" fill="#F472B6" stroke="#831843" stroke-width="2.5"/>
      <circle cx="28" cy="16" r="5" fill="#F472B6" stroke="#831843" stroke-width="2.5"/>
      <circle cx="38" cy="16" r="5" fill="#F472B6" stroke="#831843" stroke-width="2.5"/>
      <circle cx="46" cy="22" r="5" fill="#F472B6" stroke="#831843" stroke-width="2.5"/>
    </svg>`,

  capybara: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <circle cx="18" cy="18" r="7" fill="#8D5524" stroke="#3E2009" stroke-width="2.5"/>
      <circle cx="46" cy="18" r="7" fill="#8D5524" stroke="#3E2009" stroke-width="2.5"/>
      <rect x="10" y="18" width="44" height="36" rx="18" fill="#C68642" stroke="#3E2009" stroke-width="3"/>
      <rect x="18" y="30" width="28" height="20" rx="9" fill="#9C6334" stroke="#3E2009" stroke-width="2.5"/>
      <line x1="18" y1="26" x2="25" y2="26" stroke="#23120B" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="39" y1="26" x2="46" y2="26" stroke="#23120B" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="26" cy="36" r="2.2" fill="#23120B"/><circle cx="38" cy="36" r="2.2" fill="#23120B"/>
      <circle cx="32" cy="13" r="6" fill="#FB923C" stroke="#9A3412" stroke-width="2"/>
    </svg>`,

  axolotl: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <g stroke="#E11D48" stroke-width="4" stroke-linecap="round">
        <line x1="6" y1="22" x2="16" y2="26"/><line x1="4" y1="32" x2="15" y2="33"/><line x1="7" y1="42" x2="16" y2="39"/>
        <line x1="58" y1="22" x2="48" y2="26"/><line x1="60" y1="32" x2="49" y2="33"/><line x1="57" y1="42" x2="48" y2="39"/>
      </g>
      <ellipse cx="32" cy="34" rx="20" ry="16" fill="#FFC2D4" stroke="#9D174D" stroke-width="3"/>
      <circle cx="24" cy="31" r="3.5" fill="#2D122B"/><circle cx="40" cy="31" r="3.5" fill="#2D122B"/>
      <path d="M25,38 Q32,44 39,38" stroke="#9D174D" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,

  dikdik: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <ellipse cx="14" cy="20" rx="6" ry="12" transform="rotate(-28 14 20)" fill="#D99B52" stroke="#4A2810" stroke-width="2.5"/>
      <ellipse cx="50" cy="20" rx="6" ry="12" transform="rotate(28 50 20)" fill="#D99B52" stroke="#4A2810" stroke-width="2.5"/>
      <ellipse cx="32" cy="36" rx="17" ry="16" fill="#E0A458" stroke="#4A2810" stroke-width="3"/>
      <path d="M26,20 Q32,10 38,20" fill="#B87333" stroke="#4A2810" stroke-width="2.5"/>
      <circle cx="24" cy="34" r="5" fill="#23120B"/><circle cx="40" cy="34" r="5" fill="#23120B"/>
      <circle cx="22.5" cy="32.5" r="1.8" fill="#FFF"/><circle cx="38.5" cy="32.5" r="1.8" fill="#FFF"/>
      <ellipse cx="32" cy="43" rx="4" ry="3" fill="#23120B"/>
    </svg>`,

  spa: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <circle cx="20" cy="22" r="7" fill="#E0F2FE" stroke="#0284C7" stroke-width="2.5"/>
      <circle cx="32" cy="18" r="9" fill="#E0F2FE" stroke="#0284C7" stroke-width="2.5"/>
      <circle cx="44" cy="22" r="7" fill="#E0F2FE" stroke="#0284C7" stroke-width="2.5"/>
      <path d="M8,30 L56,30 L52,48 Q50,54 42,54 L22,54 Q14,54 12,48 Z" fill="#FFF" stroke="#0284C7" stroke-width="3.5" stroke-linejoin="round"/>
    </svg>`,

  vet: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="10" y="14" width="44" height="38" rx="10" fill="#FFF" stroke="#059669" stroke-width="3.5"/>
      <rect x="27" y="21" width="10" height="24" rx="3" fill="#F43F5E"/>
      <rect x="20" y="28" width="24" height="10" rx="3" fill="#F43F5E"/>
    </svg>`,

  kitchen: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M18,24 C14,42 26,55 32,57 C38,55 50,42 46,24 C42,16 22,16 18,24 Z" fill="#FB7185" stroke="#9F1239" stroke-width="3.5"/>
      <path d="M22,18 L32,24 L42,18 L36,11 L28,11 Z" fill="#22C55E" stroke="#14532D" stroke-width="2.5"/>
      <circle cx="27" cy="32" r="2" fill="#FEF08A"/><circle cx="37" cy="32" r="2" fill="#FEF08A"/><circle cx="32" cy="42" r="2" fill="#FEF08A"/>
    </svg>`,

  lobby: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M32,22 C22,8 6,18 6,32 C6,45 32,56 32,56 C32,56 58,45 58,32 C58,18 42,8 32,22 Z" fill="#FF6B9D" stroke="#831843" stroke-width="3.5"/>
      <ellipse cx="21" cy="25" rx="6" ry="3.5" transform="rotate(-25 21 25)" fill="#FFF" opacity="0.65"/>
    </svg>`,

  yard: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <circle cx="32" cy="32" r="24" fill="#FEF08A" stroke="#831843" stroke-width="3.5"/>
      <path d="M32,8 A24,24 0 0,1 56,32 L32,32 Z" fill="#FF6B9D"/>
      <path d="M32,32 L8,32 A24,24 0 0,1 32,8 Z" fill="#38BDF8"/>
      <circle cx="32" cy="32" r="6" fill="#FFF" stroke="#831843" stroke-width="2.5"/>
    </svg>`,

  soap: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="10" y="22" width="44" height="28" rx="12" fill="#FDE047" stroke="#A16207" stroke-width="3.5"/>
      <circle cx="22" cy="34" r="3" fill="#CA8A04"/><circle cx="38" cy="39" r="3.5" fill="#CA8A04"/>
      <circle cx="44" cy="18" r="8" fill="#FBCFE8" stroke="#DB2777" stroke-width="2.5"/>
      <circle cx="28" cy="16" r="6" fill="#BAE6FD" stroke="#0284C7" stroke-width="2.5"/>
    </svg>`,

  shower: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M14,14 Q36,10 42,24" stroke="#64748B" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="42" cy="26" rx="14" ry="7" fill="#CBD5E1" stroke="#334155" stroke-width="3"/>
      <g stroke="#0284C7" stroke-width="3.5" stroke-linecap="round">
        <line x1="34" y1="36" x2="30" y2="52"/><line x1="42" y1="37" x2="42" y2="54"/><line x1="50" y1="36" x2="54" y2="52"/>
      </g>
    </svg>`,

  towel: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="10" y="18" width="44" height="30" rx="10" fill="#FBCFE8" stroke="#9D174D" stroke-width="3.5"/>
      <line x1="12" y1="28" x2="52" y2="28" stroke="#F472B6" stroke-width="4"/>
      <line x1="12" y1="38" x2="52" y2="38" stroke="#F472B6" stroke-width="4"/>
    </svg>`,

  dryer: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M12,22 L40,18 L40,34 L12,30 Z" fill="#FF6B9D" stroke="#831843" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="26" y="32" width="10" height="20" rx="4" fill="#F472B6" stroke="#831843" stroke-width="3"/>
      <path d="M46,20 Q56,22 52,26 M46,29 Q56,31 52,35" stroke="#38BDF8" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </svg>`,

  toothbrush: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="8" y="34" width="48" height="9" rx="4.5" transform="rotate(-18 32 38)" fill="#34D399" stroke="#065F46" stroke-width="3"/>
      <rect x="38" y="18" width="14" height="10" rx="3" transform="rotate(-18 45 23)" fill="#FFF" stroke="#0284C7" stroke-width="2.5"/>
    </svg>`,

  stethoscope: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M18,12 L18,28 A14,14 0 0,0 46,28 L46,12" stroke="#334155" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <path d="M32,42 L32,52" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="32" cy="52" r="8" fill="#F43F5E" stroke="#881337" stroke-width="3"/>
    </svg>`,

  tweezers: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M18,52 L44,14 L24,54" stroke="#64748B" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

  thermometer: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="26" y="8" width="12" height="38" rx="6" fill="#FFF" stroke="#334155" stroke-width="3.5"/>
      <circle cx="32" cy="48" r="10" fill="#EF4444" stroke="#7F1D1D" stroke-width="3.5"/>
      <rect x="30" y="20" width="4" height="24" fill="#EF4444"/>
    </svg>`,

  icepack: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="12" y="18" width="40" height="34" rx="12" fill="#7DD3FC" stroke="#0369A1" stroke-width="3.5"/>
      <rect x="24" y="10" width="16" height="8" rx="3" fill="#F472B6" stroke="#831843" stroke-width="2.5"/>
      <path d="M32,25 L32,45 M22,35 L42,35 M25,28 L39,42 M39,28 L25,42" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  cream: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <polygon points="18,16 46,16 40,48 24,48" fill="#FBCFE8" stroke="#9D174D" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="26" y="48" width="12" height="8" rx="2" fill="#9D174D"/>
      <path d="M32,26 C28,22 22,26 32,35 C42,26 36,22 32,26 Z" fill="#EC4899"/>
    </svg>`,

  bandage: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <g transform="rotate(-20 32 32)">
        <rect x="8" y="21" width="48" height="22" rx="11" fill="#FDE047" stroke="#A16207" stroke-width="3.5"/>
        <rect x="23" y="21" width="18" height="22" fill="#FEF9C3" stroke="#A16207" stroke-width="2.5"/>
        <path d="M32,28 C29,24 24,28 32,36 C40,28 35,24 32,28 Z" fill="#F43F5E"/>
      </g>
    </svg>`,

  vitamin: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M32,20 C20,6 6,16 6,30 C6,44 32,56 32,56 C32,56 58,44 58,30 C58,16 44,6 32,20 Z" fill="#FF6B9D" stroke="#9D174D" stroke-width="3.5"/>
      <circle cx="22" cy="24" r="5" fill="#FFF" opacity="0.75"/>
    </svg>`,

  heartBrush: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <rect x="27" y="36" width="10" height="22" rx="5" fill="#FBBF24" stroke="#92400E" stroke-width="3"/>
      <path d="M32,16 C22,4 8,12 8,24 C8,35 32,44 32,44 C32,44 56,35 56,24 C56,12 42,4 32,16 Z" fill="#EC4899" stroke="#831843" stroke-width="3.5"/>
    </svg>`,

  duck: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <ellipse cx="32" cy="42" rx="20" ry="13" fill="#FDE047" stroke="#A16207" stroke-width="3.5"/>
      <circle cx="24" cy="24" r="12" fill="#FDE047" stroke="#A16207" stroke-width="3.5"/>
      <polygon points="12,22 4,25 12,29" fill="#F97316" stroke="#9A3412" stroke-width="2"/>
      <circle cx="21" cy="22" r="2.5" fill="#1E293B"/>
    </svg>`,

  bubbleWand: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <line x1="16" y1="52" x2="32" y2="30" stroke="#EC4899" stroke-width="5" stroke-linecap="round"/>
      <circle cx="38" cy="22" r="12" fill="rgba(186,230,253,0.5)" stroke="#EC4899" stroke-width="4"/>
      <circle cx="18" cy="18" r="6" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2.5"/>
    </svg>`,

  arrowDown: `
    <svg viewBox="0 0 64 64" class="code-icon">
      <path d="M22,10 L42,10 L42,32 L54,32 L32,56 L10,32 L22,32 Z" fill="#FDE047" stroke="#B45309" stroke-width="4" stroke-linejoin="round"/>
    </svg>`
};

export function iconHTML(name, extraClass = '') {
  const svg = ITEM_ICONS[name] || ICONS[name] || ICONS.star;
  return `<span class="icon-wrap ${extraClass}">${svg}</span>`;
}

export function iconSVG(name, size = 36) {
  const raw = (ITEM_ICONS[name] || ICONS[name] || ICONS.star).trim();
  return raw.replace(
    '<svg ',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" `
  );
}

