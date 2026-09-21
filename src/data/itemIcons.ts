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
      <defs>
        <linearGradient id="cobbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#A0A0A0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#606060;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" fill="url(#cobbleGrad)" stroke="#404040" stroke-width="1.5"/>
      <rect x="6" y="6" width="8" height="8" fill="#B0B0B0" stroke="#707070" stroke-width="0.5"/>
      <rect x="16" y="6" width="8" height="6" fill="#909090" stroke="#606060" stroke-width="0.5"/>
      <rect x="6" y="16" width="6" height="10" fill="#888888" stroke="#585858" stroke-width="0.5"/>
      <rect x="14" y="14" width="12" height="12" fill="#989898" stroke="#686868" stroke-width="0.5"/>
      <rect x="8" y="8" width="3" height="3" fill="#C0C0C0" opacity="0.6"/>
      <rect x="18" y="18" width="4" height="4" fill="#B8B8B8" opacity="0.5"/>
    </svg>`,
    
    coal: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4A4A4A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1A1A1A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" fill="url(#coalGrad)" stroke="#0A0A0A" stroke-width="1.5" rx="2"/>
      <rect x="8" y="8" width="5" height="5" fill="#5A5A5A" opacity="0.7"/>
      <rect x="16" y="10" width="6" height="6" fill="#2A2A2A" opacity="0.8"/>
      <rect x="10" y="18" width="8" height="5" fill="#4A4A4A" opacity="0.6"/>
      <rect x="20" y="20" width="4" height="4" fill="#3A3A3A" opacity="0.7"/>
      <circle cx="12" cy="12" r="1" fill="#6A6A6A" opacity="0.5"/>
      <circle cx="20" cy="16" r="1" fill="#5A5A5A" opacity="0.5"/>
    </svg>`,
    
    iron_ingot: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ironGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#F5F5F5;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#D8D8D8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#A8A8A8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="20" height="12" fill="url(#ironGrad)" stroke="#808080" stroke-width="1.5" rx="1"/>
      <rect x="8" y="12" width="16" height="2" fill="#FFFFFF" opacity="0.6"/>
      <rect x="8" y="18" width="16" height="2" fill="#909090" opacity="0.5"/>
      <rect x="7" y="11" width="18" height="1" fill="#FFFFFF" opacity="0.3"/>
    </svg>`,
    
    gold_ingot: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FFED4E;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#B8860B;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="20" height="12" fill="url(#goldGrad)" stroke="#8B6914" stroke-width="1.5" rx="1"/>
      <rect x="8" y="12" width="16" height="2" fill="#FFFF99" opacity="0.7"/>
      <rect x="8" y="18" width="16" height="2" fill="#B8860B" opacity="0.6"/>
      <rect x="7" y="11" width="18" height="1" fill="#FFFFFF" opacity="0.4"/>
    </svg>`,
    
    diamond: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#B2EBF2;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#4DD0E1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00ACC1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="16,4 26,12 22,28 10,28 6,12" fill="url(#diamondGrad)" stroke="#00838F" stroke-width="1.5"/>
      <polygon points="16,6 24,12 20,26 12,26 8,12" fill="#80DEEA" opacity="0.8"/>
      <polygon points="16,10 20,14 18,22 14,22 12,14" fill="#E0F7FA" opacity="0.6"/>
      <polygon points="16,8 18,12 16,16 14,12" fill="#FFFFFF" opacity="0.4"/>
      <line x1="16" y1="4" x2="16" y2="28" stroke="#FFFFFF" stroke-width="0.5" opacity="0.3"/>
      <line x1="6" y1="12" x2="26" y2="12" stroke="#FFFFFF" stroke-width="0.5" opacity="0.3"/>
    </svg>`,
    
    stick: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="4" width="4" height="24" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="15" y="4" width="2" height="24" fill="#A0522D"/>
    </svg>`,
    
    seeds: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="16" cy="20" rx="4" ry="6" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <path d="M 16 14 Q 14 10 16 8 Q 18 10 16 14" fill="#4CAF50"/>
    </svg>`,
    
    sapling: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="20" width="4" height="8" fill="#6B4226" stroke="#4A2E1A" stroke-width="1"/>
      <circle cx="16" cy="16" r="5" fill="#4CAF50" stroke="#388E3C" stroke-width="1"/>
      <circle cx="16" cy="16" r="2.5" fill="#66BB6A"/>
    </svg>`,
    
    iron_ore_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#A0A0A0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#606060;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" fill="url(#stoneGrad)" stroke="#404040" stroke-width="1.5" rx="1"/>
      <rect x="8" y="8" width="6" height="6" fill="#D4A574" stroke="#B8860B" stroke-width="0.5" rx="1"/>
      <rect x="18" y="10" width="6" height="6" fill="#C0A080" stroke="#A08060" stroke-width="0.5" rx="1"/>
      <rect x="10" y="18" width="8" height="5" fill="#D4A574" stroke="#B8860B" stroke-width="0.5" rx="1"/>
      <rect x="9" y="9" width="2" height="2" fill="#E8C8A0" opacity="0.7"/>
      <rect x="19" y="11" width="2" height="2" fill="#D8B890" opacity="0.7"/>
    </svg>`,
    
    gold_ore_item: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stoneGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#A0A0A0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#606060;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" fill="url(#stoneGrad2)" stroke="#404040" stroke-width="1.5" rx="1"/>
      <rect x="8" y="8" width="6" height="6" fill="#FFD700" stroke="#DAA520" stroke-width="0.5" rx="1"/>
      <rect x="18" y="10" width="6" height="6" fill="#FFC700" stroke="#CDA000" stroke-width="0.5" rx="1"/>
      <rect x="10" y="18" width="8" height="5" fill="#FFD700" stroke="#DAA520" stroke-width="0.5" rx="1"/>
      <rect x="9" y="9" width="2" height="2" fill="#FFED4E" opacity="0.8"/>
      <rect x="19" y="11" width="2" height="2" fill="#FFED4E" opacity="0.8"/>
    </svg>`,
    
    crystal: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F8BBD0;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#E040FB;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#9C27B0;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="crystalGlow">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#E040FB;stop-opacity:0" />
        </radialGradient>
      </defs>
      <polygon points="16,4 24,12 20,28 12,28 8,12" fill="url(#crystalGrad)" stroke="#7B1FA2" stroke-width="1.5"/>
      <polygon points="16,6 22,12 19,26 13,26 10,12" fill="#F48FB1" opacity="0.8"/>
      <polygon points="16,10 19,14 18,22 14,22 13,14" fill="#FCE4EC" opacity="0.7"/>
      <circle cx="16" cy="16" r="6" fill="url(#crystalGlow)"/>
      <line x1="16" y1="4" x2="16" y2="28" stroke="#FFFFFF" stroke-width="0.5" opacity="0.4"/>
      <line x1="8" y1="12" x2="24" y2="12" stroke="#FFFFFF" stroke-width="0.5" opacity="0.4"/>
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
    
    glass: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="20" height="20" fill="#ADD8E6" stroke="#87CEEB" stroke-width="1" opacity="0.6"/>
      <rect x="8" y="8" width="16" height="16" fill="#E0F7FA" opacity="0.3"/>
      <line x1="10" y1="10" x2="14" y2="14" stroke="#FFFFFF" stroke-width="1.5" opacity="0.7"/>
      <line x1="18" y1="18" x2="22" y2="22" stroke="#FFFFFF" stroke-width="1.5" opacity="0.7"/>
    </svg>`,
    
    ladder: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="3" height="24" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="21" y="4" width="3" height="24" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <rect x="11" y="8" width="10" height="2" fill="#A0522D" stroke="#654321" stroke-width="0.5"/>
      <rect x="11" y="14" width="10" height="2" fill="#A0522D" stroke="#654321" stroke-width="0.5"/>
      <rect x="11" y="20" width="10" height="2" fill="#A0522D" stroke="#654321" stroke-width="0.5"/>
    </svg>`,
    
    // Utility blocks
    torch: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="12" width="4" height="16" fill="#8B4513" stroke="#654321" stroke-width="1"/>
      <ellipse cx="16" cy="10" rx="4" ry="6" fill="#FFA500"/>
      <ellipse cx="16" cy="9" rx="3" ry="4" fill="#FFD700"/>
      <ellipse cx="16" cy="8" rx="2" ry="3" fill="#FFFF00"/>
    </svg>`,
    
    crafting_table: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#D2691E;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B4513;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" fill="url(#woodGrad)" stroke="#654321" stroke-width="1.5" rx="1"/>
      <rect x="6" y="6" width="9" height="9" fill="#A0522D" stroke="#654321" stroke-width="0.5"/>
      <rect x="17" y="6" width="9" height="9" fill="#CD853F" stroke="#654321" stroke-width="0.5"/>
      <rect x="6" y="17" width="9" height="9" fill="#CD853F" stroke="#654321" stroke-width="0.5"/>
      <rect x="17" y="17" width="9" height="9" fill="#A0522D" stroke="#654321" stroke-width="0.5"/>
      <rect x="8" y="8" width="3" height="3" fill="#DEB887" opacity="0.6"/>
      <rect x="19" y="8" width="3" height="3" fill="#DEB887" opacity="0.6"/>
      <rect x="8" y="19" width="3" height="3" fill="#DEB887" opacity="0.6"/>
      <rect x="19" y="19" width="3" height="3" fill="#DEB887" opacity="0.6"/>
      <line x1="4" y1="15" x2="28" y2="15" stroke="#654321" stroke-width="1"/>
      <line x1="15" y1="4" x2="15" y2="28" stroke="#654321" stroke-width="1"/>
    </svg>`,
    
    advanced_workbench: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="advWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="24" height="24" fill="url(#advWoodGrad)" stroke="#4A2E1A" stroke-width="1.5" rx="1"/>
      <rect x="6" y="6" width="6" height="6" fill="#A0522D" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="13" y="6" width="6" height="6" fill="#CD853F" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="20" y="6" width="6" height="6" fill="#A0522D" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="6" y="13" width="6" height="6" fill="#CD853F" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="13" y="13" width="6" height="6" fill="#8B4513" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="20" y="13" width="6" height="6" fill="#CD853F" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="6" y="20" width="6" height="6" fill="#A0522D" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="13" y="20" width="6" height="6" fill="#CD853F" stroke="#4A2E1A" stroke-width="0.5"/>
      <rect x="20" y="20" width="6" height="6" fill="#A0522D" stroke="#4A2E1A" stroke-width="0.5"/>
      <circle cx="16" cy="16" r="2" fill="#FFD700" opacity="0.8"/>
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
  };
  
  return icons[itemId] || `<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" fill="#666"/></svg>`;
};
