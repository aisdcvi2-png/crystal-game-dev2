// SVG Icons for all items and blocks
export const ItemIcons: Record<string, string> = {
  // Materials
  cobblestone: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#6a6a6a" stroke="#4a4a4a" stroke-width="2"/>
    <rect x="6" y="6" width="8" height="8" fill="#7a7a7a"/>
    <rect x="16" y="8" width="6" height="6" fill="#5a5a5a"/>
    <rect x="8" y="18" width="10" height="6" fill="#7a7a7a"/>
    <rect x="20" y="16" width="6" height="8" fill="#5a5a5a"/>
  </svg>`,
  
  coal: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#2a2a2a" stroke="#1a1a1a" stroke-width="2"/>
    <rect x="8" y="8" width="4" height="4" fill="#3a3a3a"/>
    <rect x="16" y="12" width="6" height="4" fill="#1a1a1a"/>
    <rect x="10" y="20" width="8" height="4" fill="#3a3a3a"/>
  </svg>`,
  
  iron_ingot: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="20" height="12" fill="#d4d4d4" stroke="#a0a0a0" stroke-width="2"/>
    <rect x="8" y="12" width="16" height="2" fill="#e8e8e8"/>
    <rect x="8" y="18" width="16" height="2" fill="#b8b8b8"/>
  </svg>`,
  
  gold_ingot: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="20" height="12" fill="#ffd700" stroke="#daa520" stroke-width="2"/>
    <rect x="8" y="12" width="16" height="2" fill="#ffed4e"/>
    <rect x="8" y="18" width="16" height="2" fill="#daa520"/>
  </svg>`,
  
  diamond: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,4 26,12 22,28 10,28 6,12" fill="#4dd0e1" stroke="#00acc1" stroke-width="2"/>
    <polygon points="16,6 24,12 20,26 12,26 8,12" fill="#80deea"/>
    <polygon points="16,10 20,14 18,22 14,22 12,14" fill="#b2ebf2"/>
  </svg>`,
  
  emerald: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,4 26,12 22,28 10,28 6,12" fill="#66bb6a" stroke="#43a047" stroke-width="2"/>
    <polygon points="16,6 24,12 20,26 12,26 8,12" fill="#81c784"/>
    <polygon points="16,10 20,14 18,22 14,22 12,14" fill="#a5d6a7"/>
  </svg>`,
  
  stick: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="4" width="4" height="24" fill="#8b6914" stroke="#6b4914" stroke-width="1"/>
    <rect x="15" y="4" width="2" height="24" fill="#a07828"/>
  </svg>`,
  
  oak_log_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#6b4226" stroke="#4a2e1a" stroke-width="2"/>
    <circle cx="16" cy="16" r="8" fill="#8b5a3c" stroke="#6b4226" stroke-width="2"/>
    <circle cx="16" cy="16" r="4" fill="#a07050"/>
  </svg>`,
  
  planks_block: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#bc8e4b" stroke="#9c6e2b" stroke-width="2"/>
    <line x1="4" y1="12" x2="28" y2="12" stroke="#9c6e2b" stroke-width="2"/>
    <line x1="4" y1="20" x2="28" y2="20" stroke="#9c6e2b" stroke-width="2"/>
  </svg>`,
  
  dirt_block: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#8b6914" stroke="#6b4914" stroke-width="2"/>
    <circle cx="10" cy="10" r="2" fill="#6b4914"/>
    <circle cx="20" cy="14" r="2" fill="#6b4914"/>
    <circle cx="14" cy="22" r="2" fill="#6b4914"/>
  </svg>`,
  
  sand_block: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#d4c475" stroke="#b4a455" stroke-width="2"/>
    <circle cx="10" cy="10" r="1" fill="#b4a455"/>
    <circle cx="18" cy="12" r="1" fill="#b4a455"/>
    <circle cx="14" cy="20" r="1" fill="#b4a455"/>
    <circle cx="22" cy="18" r="1" fill="#b4a455"/>
  </svg>`,
  
  cobblestone_block_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#6a6a6a" stroke="#4a4a4a" stroke-width="2"/>
    <rect x="6" y="6" width="8" height="8" fill="#7a7a7a"/>
    <rect x="16" y="8" width="6" height="6" fill="#5a5a5a"/>
    <rect x="8" y="18" width="10" height="6" fill="#7a7a7a"/>
  </svg>`,
  
  brick_block_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#9b4a3a" stroke="#7b2a1a" stroke-width="2"/>
    <rect x="6" y="6" width="8" height="4" fill="#ab5a4a" stroke="#7b2a1a" stroke-width="1"/>
    <rect x="16" y="6" width="8" height="4" fill="#ab5a4a" stroke="#7b2a1a" stroke-width="1"/>
    <rect x="6" y="12" width="6" height="4" fill="#ab5a4a" stroke="#7b2a1a" stroke-width="1"/>
    <rect x="14" y="12" width="10" height="4" fill="#ab5a4a" stroke="#7b2a1a" stroke-width="1"/>
    <rect x="6" y="18" width="10" height="4" fill="#ab5a4a" stroke="#7b2a1a" stroke-width="1"/>
    <rect x="18" y="18" width="6" height="4" fill="#ab5a4a" stroke="#7b2a1a" stroke-width="1"/>
  </svg>`,
  
  glass_block_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="24" height="24" fill="#add8e6" stroke="#87ceeb" stroke-width="2" opacity="0.7"/>
    <line x1="8" y1="8" x2="12" y2="12" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
    <line x1="20" y1="20" x2="24" y2="24" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
  </svg>`,
  
  crystal: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,4 24,12 20,28 12,28 8,12" fill="#e040fb" stroke="#ba68c8" stroke-width="2"/>
    <polygon points="16,6 22,12 19,26 13,26 10,12" fill="#f48fb1"/>
    <polygon points="16,10 19,14 18,22 14,22 13,14" fill="#f8bbd0"/>
  </svg>`,
  
  seeds: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="20" rx="4" ry="6" fill="#8b6914" stroke="#6b4914" stroke-width="1"/>
    <path d="M 16 14 Q 14 10 16 8 Q 18 10 16 14" fill="#4caf50"/>
  </svg>`,
  
  apple: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="18" r="10" fill="#f44336" stroke="#d32f2f" stroke-width="2"/>
    <path d="M 16 8 Q 14 6 16 4" stroke="#4caf50" stroke-width="2" fill="none"/>
    <ellipse cx="18" cy="6" rx="2" ry="3" fill="#4caf50"/>
  </svg>`,
  
  // Tools
  wood_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="14" width="4" height="14" fill="#8b6914" stroke="#6b4914" stroke-width="1"/>
    <rect x="8" y="8" width="16" height="6" fill="#bc8e4b" stroke="#9c6e2b" stroke-width="2"/>
    <rect x="10" y="10" width="12" height="2" fill="#d4a86b"/>
  </svg>`,
  
  stone_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="14" width="4" height="14" fill="#8b6914" stroke="#6b4914" stroke-width="1"/>
    <rect x="8" y="8" width="16" height="6" fill="#7a7a7a" stroke="#5a5a5a" stroke-width="2"/>
    <rect x="10" y="10" width="12" height="2" fill="#9a9a9a"/>
  </svg>`,
  
  iron_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="14" width="4" height="14" fill="#8b6914" stroke="#6b4914" stroke-width="1"/>
    <rect x="8" y="8" width="16" height="6" fill="#d4d4d4" stroke="#a0a0a0" stroke-width="2"/>
    <rect x="10" y="10" width="12" height="2" fill="#e8e8e8"/>
  </svg>`,
  
  diamond_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="14" width="4" height="14" fill="#8b6914" stroke="#6b4914" stroke-width="1"/>
    <rect x="8" y="8" width="16" height="6" fill="#4dd0e1" stroke="#00acc1" stroke-width="2"/>
    <rect x="10" y="10" width="12" height="2" fill="#80deea"/>
  </svg>`,
  
  sapling: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="18" width="4" height="10" fill="#6b4226" stroke="#4a2e1a" stroke-width="1"/>
    <circle cx="16" cy="14" r="6" fill="#4caf50" stroke="#388e3c" stroke-width="2"/>
    <circle cx="16" cy="14" r="3" fill="#66bb6a"/>
  </svg>`,
};

export function getItemIcon(itemId: string): string {
  return ItemIcons[itemId] || `<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" fill="#666"/></svg>`;
}
