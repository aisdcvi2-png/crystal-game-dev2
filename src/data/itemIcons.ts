// Minecraft-style SVG icons for items
export const getItemIcon = (itemId: string): string => {
  const icons: Record<string, string> = {
    // Tools
    wood_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="4" height="14" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="8" y="8" width="16" height="6" fill="#D2691E" stroke="#8B4513" stroke-width="1"/>
      <rect x="10" y="10" width="12" height="2" fill="#A0522D"/>
    </svg>`,
    
    stone_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="4" height="14" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="8" y="8" width="16" height="6" fill="#808080" stroke="#606060" stroke-width="1"/>
      <rect x="10" y="10" width="12" height="2" fill="#A0A0A0"/>
    </svg>`,
    
    iron_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="4" height="14" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="8" y="8" width="16" height="6" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1"/>
      <rect x="10" y="10" width="12" height="2" fill="#E0E0E0"/>
    </svg>`,
    
    diamond_pickaxe: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="4" height="14" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="8" y="8" width="16" height="6" fill="#4DD0E1" stroke="#00ACC1" stroke-width="1"/>
      <rect x="10" y="10" width="12" height="2" fill="#80DEEA"/>
    </svg>`,
    
    // Materials
    cobblestone: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#808080" stroke="#606060" stroke-width="1"/>
      <rect x="6" y="6" width="8" height="8" fill="#A0A0A0"/>
      <rect x="18" y="6" width="6" height="6" fill="#707070"/>
      <rect x="6" y="18" width="6" height="6" fill="#707070"/>
      <rect x="16" y="16" width="10" height="10" fill="#909090"/>
    </svg>`,
    
    coal: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#2C2C2C" stroke="#1A1A1A" stroke-width="1"/>
      <rect x="8" y="8" width="4" height="4" fill="#3C3C3C"/>
      <rect x="16" y="12" width="6" height="6" fill="#1A1A1A"/>
      <rect x="10" y="20" width="8" height="4" fill="#3C3C3C"/>
    </svg>`,
    
    iron_ingot: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="20" height="12" fill="#D8D8D8" stroke="#B0B0B0" stroke-width="1"/>
      <rect x="8" y="12" width="16" height="2" fill="#E8E8E8"/>
      <rect x="8" y="18" width="16" height="2" fill="#C8C8C8"/>
    </svg>`,
    
    gold_ingot: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="20" height="12" fill="#FFD700" stroke="#DAA520" stroke-width="1"/>
      <rect x="8" y="12" width="16" height="2" fill="#FFED4E"/>
      <rect x="8" y="18" width="16" height="2" fill="#DAA520"/>
    </svg>`,
    
    diamond: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,4 26,12 22,28 10,28 6,12" fill="#4DD0E1" stroke="#00ACC1" stroke-width="1"/>
      <polygon points="16,6 24,12 20,26 12,26 8,12" fill="#80DEEA"/>
      <polygon points="16,10 20,14 18,22 14,22 12,14" fill="#B2EBF2"/>
    </svg>`,
    
    stick: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="4" width="4" height="24" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="15" y="4" width="2" height="24" fill="#A0522D"/>
    </svg>`,
    
    seeds: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="16" cy="20" rx="4" ry="6" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <path d="M 16 14 Q 14 10 16 8 Q 18 10 16 14" fill="#4CAF50"/>
    </svg>`,
    
    iron_ore_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#808080" stroke="#606060" stroke-width="1"/>
      <rect x="8" y="8" width="6" height="6" fill="#D4A574"/>
      <rect x="18" y="12" width="6" height="6" fill="#D4A574"/>
      <rect x="10" y="20" width="8" height="4" fill="#D4A574"/>
    </svg>`,
    
    gold_ore_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#808080" stroke="#606060" stroke-width="1"/>
      <rect x="8" y="8" width="6" height="6" fill="#FFD700"/>
      <rect x="18" y="12" width="6" height="6" fill="#FFD700"/>
      <rect x="10" y="20" width="8" height="4" fill="#FFD700"/>
    </svg>`,
    
    crystal: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,4 24,12 20,28 12,28 8,12" fill="#E040FB" stroke="#BA68C8" stroke-width="1"/>
      <polygon points="16,6 22,12 19,26 13,26 10,12" fill="#F48FB1"/>
      <polygon points="16,10 19,14 18,22 14,22 13,14" fill="#F8BBD0"/>
    </svg>`,
    
    oak_log_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#6B4226" stroke="#4A2E1A" stroke-width="1"/>
      <circle cx="16" cy="16" r="8" fill="#8B5A3C" stroke="#6B4226" stroke-width="1"/>
      <circle cx="16" cy="16" r="4" fill="#A07050"/>
    </svg>`,
    
    portal_key: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="6" fill="none" stroke="#9C27B0" stroke-width="2"/>
      <rect x="16" y="10" width="12" height="4" fill="#9C27B0"/>
      <rect x="24" y="8" width="4" height="8" fill="#9C27B0"/>
      <circle cx="12" cy="12" r="3" fill="#BA68C8"/>
    </svg>`,
    
    // Placeable blocks
    dirt_block: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#8B6914" stroke="#6B4914" stroke-width="1"/>
      <circle cx="10" cy="10" r="2" fill="#6B4914"/>
      <circle cx="20" cy="14" r="2" fill="#6B4914"/>
      <circle cx="14" cy="22" r="2" fill="#6B4914"/>
    </svg>`,
    
    sand_block: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#D4C475" stroke="#B4A455" stroke-width="1"/>
      <circle cx="10" cy="10" r="1" fill="#B4A455"/>
      <circle cx="18" cy="12" r="1" fill="#B4A455"/>
      <circle cx="14" cy="20" r="1" fill="#B4A455"/>
      <circle cx="22" cy="18" r="1" fill="#B4A455"/>
    </svg>`,
    
    planks_block: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#BC8E4B" stroke="#9C6E2B" stroke-width="1"/>
      <line x1="4" y1="12" x2="28" y2="12" stroke="#9C6E2B" stroke-width="2"/>
      <line x1="4" y1="20" x2="28" y2="20" stroke="#9C6E2B" stroke-width="2"/>
    </svg>`,
    
    cobblestone_block_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#6A6A6A" stroke="#4A4A4A" stroke-width="1"/>
      <rect x="6" y="6" width="8" height="8" fill="#7A7A7A"/>
      <rect x="16" y="8" width="6" height="6" fill="#5A5A5A"/>
      <rect x="8" y="18" width="10" height="6" fill="#7A7A7A"/>
    </svg>`,
    
    brick_block_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#9B4A3A" stroke="#7B2A1A" stroke-width="1"/>
      <rect x="6" y="6" width="8" height="4" fill="#AB5A4A" stroke="#7B2A1A" stroke-width="1"/>
      <rect x="16" y="6" width="8" height="4" fill="#AB5A4A" stroke="#7B2A1A" stroke-width="1"/>
      <rect x="6" y="12" width="6" height="4" fill="#AB5A4A" stroke="#7B2A1A" stroke-width="1"/>
      <rect x="14" y="12" width="10" height="4" fill="#AB5A4A" stroke="#7B2A1A" stroke-width="1"/>
      <rect x="6" y="18" width="10" height="4" fill="#AB5A4A" stroke="#7B2A1A" stroke-width="1"/>
      <rect x="18" y="18" width="6" height="4" fill="#AB5A4A" stroke="#7B2A1A" stroke-width="1"/>
    </svg>`,
    
    glass_block_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#ADD8E6" stroke="#87CEEB" stroke-width="1" opacity="0.7"/>
      <line x1="8" y1="8" x2="12" y2="12" stroke="#FFFFFF" stroke-width="2" opacity="0.5"/>
      <line x1="20" y1="20" x2="24" y2="24" stroke="#FFFFFF" stroke-width="2" opacity="0.5"/>
    </svg>`,
    
    // Utility blocks
    torch: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="12" width="4" height="16" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <ellipse cx="16" cy="10" rx="4" ry="6" fill="#FFA500"/>
      <ellipse cx="16" cy="9" rx="3" ry="4" fill="#FFD700"/>
      <ellipse cx="16" cy="8" rx="2" ry="3" fill="#FFFF00"/>
    </svg>`,
    
    crafting_table: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="6" y="6" width="8" height="8" fill="#A0522D"/>
      <rect x="18" y="6" width="8" height="8" fill="#D2691E"/>
      <rect x="6" y="18" width="8" height="8" fill="#D2691E"/>
      <rect x="18" y="18" width="8" height="8" fill="#A0522D"/>
    </svg>`,
    
    furnace: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="24" height="24" fill="#808080" stroke="#606060" stroke-width="1"/>
      <rect x="10" y="14" width="12" height="10" fill="#2C2C2C"/>
      <rect x="12" y="16" width="8" height="6" fill="#FF4500"/>
      <rect x="14" y="18" width="4" height="2" fill="#FFD700"/>
    </svg>`,
    
    chest: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="24" height="16" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="6" y="12" width="20" height="4" fill="#A0522D"/>
      <rect x="14" y="18" width="4" height="4" fill="#FFD700"/>
      <rect x="4" y="8" width="24" height="4" fill="#A0522D" stroke="#654321" stroke-width="1"/>
    </svg>`,
    
    ladder: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="4" width="2" height="24" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="20" y="4" width="2" height="24" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="10" y="8" width="12" height="2" fill="#A0522D"/>
      <rect x="10" y="14" width="12" height="2" fill="#A0522D"/>
      <rect x="10" y="20" width="12" height="2" fill="#A0522D"/>
    </svg>`,
  };
  
  return icons[itemId] || `<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" fill="#666"/></svg>`;
};
