// ============================================================================
// Cozy Critter Salon & Spa - Persistent Save Manager (cozy_critter_save_v2)
// ============================================================================

const SAVE_KEY_V2 = 'cozy_critter_save_v2';
const SAVE_KEY_V1 = 'cozy_critter_save_v1';
const SAVE_VERSION = 2;

export const SKIN_TONES = [
  { id: 'peach', name: 'Warm Peach', hex: 0xffd7ba, css: '#ffd7ba', blush: 0xff9aa2 },
  { id: 'ivory', name: 'Soft Ivory', hex: 0xffe5d4, css: '#ffe5d4', blush: 0xffa6b0 },
  { id: 'rose', name: 'Rosy Cream', hex: 0xf9ccb6, css: '#f9ccb6', blush: 0xf48b9a },
  { id: 'honey', name: 'Golden Honey', hex: 0xf1be8f, css: '#f1be8f', blush: 0xe87a82 },
  { id: 'sand', name: 'Warm Sand', hex: 0xe6af82, css: '#e6af82', blush: 0xe0747c },
  { id: 'caramel', name: 'Sweet Caramel', hex: 0xd59463, css: '#d59463', blush: 0xd9666f },
  { id: 'amber', name: 'Rich Amber', hex: 0xc47e4f, css: '#c47e4f', blush: 0xc95a63 },
  { id: 'cinnamon', name: 'Cinnamon Glow', hex: 0xad683e, css: '#ad683e', blush: 0xb85058 },
  { id: 'chestnut', name: 'Warm Chestnut', hex: 0x935330, css: '#935330', blush: 0xa4454d },
  { id: 'cocoa', name: 'Velvet Cocoa', hex: 0x7a4225, css: '#7a4225', blush: 0x913c45 },
  { id: 'espresso', name: 'Deep Espresso', hex: 0x5c301b, css: '#5c301b', blush: 0x7d333b },
  { id: 'berry', name: 'Twilight Cocoa', hex: 0x462314, css: '#462314', blush: 0x6b2c34 }
];

export const HAIR_STYLES = [
  { id: 'pigtails', name: 'Bouncy Pigtails' },
  { id: 'space_buns', name: 'Double Space Buns' },
  { id: 'long_waves', name: 'Flowing Waves' },
  { id: 'curly_puff', name: 'Fluffy Cloud Curls' },
  { id: 'bob_bangs', name: 'Cozy Bob & Bangs' },
  { id: 'high_pony', name: 'Ribbon Ponytail' },
  { id: 'braids', name: 'Twin Braids' },
  { id: 'pixie', name: 'Sweet Pixie Crop' },
  { id: 'half_up', name: 'Half-Up Bow Curls' },
  { id: 'afro_puffs', name: 'Starry Twin Puffs' }
];

export const HAIR_COLORS = [
  { id: 'chestnut', name: 'Chestnut Brown', hex: 0x5c3317, css: '#5c3317' },
  { id: 'golden', name: 'Honey Blonde', hex: 0xf4c44e, css: '#f4c44e' },
  { id: 'espresso', name: 'Midnight Black', hex: 0x241c24, css: '#241c24' },
  { id: 'auburn', name: 'Ginger Spice', hex: 0xc85228, css: '#c85228' },
  { id: 'strawberry', name: 'Strawberry Pink', hex: 0xff7eb6, css: '#ff7eb6' },
  { id: 'lavender', name: 'Dreamy Lavender', hex: 0xb589f7, css: '#b589f7' },
  { id: 'mermaid', name: 'Mermaid Mint', hex: 0x4cd6c1, css: '#4cd6c1' },
  { id: 'sky', name: 'Cotton Candy Blue', hex: 0x6bb8ff, css: '#6bb8ff' },
  { id: 'caramel', name: 'Warm Caramel', hex: 0x9e6334, css: '#9e6334' },
  { id: 'ruby', name: 'Cherry Berry', hex: 0xd9386a, css: '#d9386a' },
  { id: 'buttercup', name: 'Sunshine Gold', hex: 0xffe066, css: '#ffe066' },
  { id: 'silver', name: 'Moonlight Pearl', hex: 0xe6e8f4, css: '#e6e8f4' }
];

export const AVATAR_OUTFITS = [
  { id: 'pink_apron', name: 'Stylist Smock', primary: 0xff78b0, secondary: 0xfff0f6, skirt: 0xff5c9e, shoes: 0xe84a88 },
  { id: 'lavender_dress', name: 'Lavender Twirl Dress', primary: 0xb185ff, secondary: 0xf3ebff, skirt: 0x9a67f5, shoes: 0x7e4bd4 },
  { id: 'mint_overalls', name: 'Mint Garden Overalls', primary: 0x56d8c0, secondary: 0xfff8d6, skirt: 0x3ec0a8, shoes: 0xff85a2 },
  { id: 'sunshine_romper', name: 'Sunny Daisy Romper', primary: 0xffca4b, secondary: 0xffffff, skirt: 0xffb224, shoes: 0xff6b8b },
  { id: 'berry_cardigan', name: 'Strawberry Cardigan', primary: 0xff5a79, secondary: 0xffe8ee, skirt: 0x5b6ee1, shoes: 0xd9385a },
  { id: 'sky_tutu', name: 'Cloud Ballerina', primary: 0x6ec3ff, secondary: 0xffffff, skirt: 0xa2d9ff, shoes: 0x4da8eb },
  { id: 'rainbow_sweater', name: 'Cozy Rainbow Knit', primary: 0xff8da1, secondary: 0xffe066, skirt: 0x72c8ff, shoes: 0xb185ff },
  { id: 'peach_blossom', name: 'Peach Blossom Gown', primary: 0xffa384, secondary: 0xfff5f0, skirt: 0xff8661, shoes: 0xe06342 },
  { id: 'starlight_cape', name: 'Starlight Wizard', primary: 0x6759d4, secondary: 0xffdf6b, skirt: 0x5042b8, shoes: 0x3b2e96 },
  { id: 'emerald_vet', name: 'Doctor Coat & Bow', primary: 0xffffff, secondary: 0x52cc99, skirt: 0x3db583, shoes: 0x2a8f64 }
];

export const CUTE_PET_NAMES = [
  'Mochi', 'Bubbles', 'Barnaby', 'Princess Peach', 'Noodle', 'Pip',
  'Waffles', 'Clementine', 'Boba', 'Sprout', 'Pudding', 'Jellybean',
  'Buttercup', 'Biscuit', 'Tangerine', 'Marshmallow', 'Daisy', 'Poppy',
  'Pebbles', 'Snickerdoodle', 'Honeybee', 'Pickles', 'Cupcake', 'Kiki'
];

export const CUTE_AVATAR_NAMES = [
  'Lilah', 'Maya', 'Chloe', 'Zoe', 'Ruby', 'Sunny', 'Ella', 'Rosie', 'Mia', 'Luna'
];

export const PET_SPECIES = {
  capybara: {
    id: 'capybara',
    speciesName: 'Capybara',
    defaultName: 'Barnaby',
    favoriteFood: 'tangerine_slice',
    favoriteFoodName: 'Sweet Tangerines',
    description: 'A gentle, round friend who loves warm baths and tangerines on his head!',
    homeRoom: 'spa'
  },
  axolotl: {
    id: 'axolotl',
    speciesName: 'Pink Axolotl',
    defaultName: 'Bubbles',
    favoriteFood: 'kelp_gummy',
    favoriteFoodName: 'Sea-Kelp Gummies',
    description: 'A smiley pastel water spirit with feathery pink gills and a swishy tail!',
    homeRoom: 'kitchen'
  },
  dikdik: {
    id: 'dikdik',
    speciesName: 'Tiny Dik-dik',
    defaultName: 'Pip',
    favoriteFood: 'strawberry',
    favoriteFoodName: 'Juicy Strawberries',
    description: 'A pocket-sized meadow antelope with giant sparkly eyes and twitchy ears!',
    homeRoom: 'yard'
  }
};

function createDefaultPet(id, defaultName, adopted = false, startNeed = 'bath') {
  const isBath = startNeed === 'bath';
  const isVet = startNeed === 'vet';
  const isFood = startNeed === 'food';
  return {
    id,
    customName: defaultName,
    unlocked: true,
    adopted,
    stats: {
      health: isVet ? 65 : 92,
      cleanliness: isBath ? 48 : 90,
      hunger: isFood ? 52 : 88,
      love: 78,
      energy: 95
    },
    ailments: isVet ? ['tummy_ache', 'twigs', 'scrape', 'fever'] : [],
    dirtSpots: isBath ? [0, 1, 2, 3, 4] : [],
    twigs: isVet ? [0, 1, 2] : [],
    scrapes: isVet ? [0, 1] : [],
    fever: isVet,
    teethSparkly: !isBath,
    equipped: {
      hat: id === 'capybara' ? 'tangerine_stack' : null,
      glasses: null,
      neck: null,
      outfit: null,
      heldProp: null
    }
  };
}

export function createDefaultState() {
  return {
    version: SAVE_VERSION,
    coins: 120,
    stars: 1,
    avatarCreated: false,
    avatar: {
      name: 'Lilah',
      skinTone: 'peach',
      hairStyle: 'pigtails',
      hairColor: 'chestnut',
      outfit: 'pink_apron',
      hat: null,
      glasses: null,
      heldProp: null
    },
    playerPosition: {
      room: 'lobby',
      x: 0,
      z: 3.2
    },
    activePet: 'capybara',
    pets: {
      capybara: createDefaultPet('capybara', 'Mochi', false, 'bath'),
      axolotl: createDefaultPet('axolotl', 'Bubbles', false, 'food'),
      dikdik: createDefaultPet('dikdik', 'Pip', false, 'vet')
    },
    inventory: ['tangerine_stack'],
    roomUpgrades: {
      spa: 1,
      clinic: 1,
      lobby: 1,
      kitchen: 1,
      yard: 1
    },
    photoAlbum: [],
    routinesCompleted: 0,
    settings: {
      musicVolume: 0.45,
      sfxVolume: 0.85,
      voiceVolume: 1.0,
      readToMe: true,
      readSpeed: 0.96,
      lowGraphics: false,
      showJoystick: false
    }
  };
}

export class SaveManager {
  constructor() {
    this.state = this.load();
    this.listeners = new Set();
  }

  load() {
    const defaults = createDefaultState();
    try {
      const rawV2 = localStorage.getItem(SAVE_KEY_V2);
      if (rawV2) {
        const parsed = JSON.parse(rawV2);
        return this.migrateAndMerge(defaults, parsed);
      }
      // Check V1 migration
      const rawV1 = localStorage.getItem(SAVE_KEY_V1);
      if (rawV1) {
        const parsedV1 = JSON.parse(rawV1);
        const migrated = this.migrateAndMerge(defaults, parsedV1);
        migrated.version = SAVE_VERSION;
        localStorage.setItem(SAVE_KEY_V2, JSON.stringify(migrated));
        return migrated;
      }
    } catch (e) {
      console.warn('SaveManager: Using fresh default state', e);
    }
    return defaults;
  }

  migrateAndMerge(defaults, loaded) {
    if (!loaded || typeof loaded !== 'object') return defaults;
    const out = {
      ...defaults,
      ...loaded,
      version: SAVE_VERSION,
      coins: typeof loaded.coins === 'number' ? Math.max(0, loaded.coins) : defaults.coins,
      stars: typeof loaded.stars === 'number' ? Math.max(1, loaded.stars) : defaults.stars,
      avatar: { ...defaults.avatar, ...(loaded.avatar || {}) },
      playerPosition: { ...defaults.playerPosition, ...(loaded.playerPosition || {}) },
      roomUpgrades: { ...defaults.roomUpgrades, ...(loaded.roomUpgrades || {}) },
      settings: { ...defaults.settings, ...(loaded.settings || {}) },
      inventory: Array.isArray(loaded.inventory)
        ? Array.from(new Set([...defaults.inventory, ...loaded.inventory]))
        : defaults.inventory,
      photoAlbum: Array.isArray(loaded.photoAlbum) ? loaded.photoAlbum.slice(0, 24) : []
    };

    out.pets = {};
    for (const petId of ['capybara', 'axolotl', 'dikdik']) {
      const defPet = defaults.pets[petId];
      const lp = loaded.pets && loaded.pets[petId] ? loaded.pets[petId] : {};
      out.pets[petId] = {
        ...defPet,
        ...lp,
        stats: {
          health: clampStat(lp.stats?.health ?? defPet.stats.health),
          cleanliness: clampStat(lp.stats?.cleanliness ?? defPet.stats.cleanliness),
          hunger: clampStat(lp.stats?.hunger ?? defPet.stats.hunger),
          love: clampStat(lp.stats?.love ?? defPet.stats.love),
          energy: clampStat(lp.stats?.energy ?? defPet.stats.energy)
        },
        equipped: { ...defPet.equipped, ...(lp.equipped || {}) },
        ailments: Array.isArray(lp.ailments) ? lp.ailments : defPet.ailments,
        dirtSpots: Array.isArray(lp.dirtSpots) ? lp.dirtSpots : defPet.dirtSpots,
        twigs: Array.isArray(lp.twigs) ? lp.twigs : defPet.twigs,
        scrapes: Array.isArray(lp.scrapes) ? lp.scrapes : defPet.scrapes
      };
    }

    // Ensure valid avatar choices
    if (!SKIN_TONES.some(s => s.id === out.avatar.skinTone)) out.avatar.skinTone = 'peach';
    if (!HAIR_STYLES.some(h => h.id === out.avatar.hairStyle)) out.avatar.hairStyle = 'pigtails';
    if (!HAIR_COLORS.some(c => c.id === out.avatar.hairColor)) out.avatar.hairColor = 'chestnut';
    if (!AVATAR_OUTFITS.some(o => o.id === out.avatar.outfit)) out.avatar.outfit = 'pink_apron';

    return out;
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY_V2, JSON.stringify(this.state));
    } catch (e) {
      console.warn('SaveManager: Failed to write localStorage', e);
    }
    this.notify();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      try {
        fn(this.state);
      } catch (e) {
        console.error(e);
      }
    }
  }

  reset() {
    this.state = createDefaultState();
    try {
      localStorage.removeItem(SAVE_KEY_V1);
      localStorage.removeItem(SAVE_KEY_V2);
    } catch (e) { /* ignore */ }
    this.save();
    return this.state;
  }

  getActivePet() {
    return this.state.pets[this.state.activePet] || this.state.pets.capybara;
  }

  setActivePet(petId) {
    if (this.state.pets[petId]) {
      this.state.activePet = petId;
      this.save();
    }
  }

  addReward(coins = 0, stars = 0) {
    this.state.coins = Math.max(0, (this.state.coins || 0) + coins);
    if (stars > 0) {
      this.state.stars = Math.max(1, (this.state.stars || 1) + stars);
      this.state.routinesCompleted = (this.state.routinesCompleted || 0) + 1;
    }
    this.save();
  }

  spendCoins(amount) {
    if (this.state.coins < amount) return false;
    this.state.coins -= amount;
    this.save();
    return true;
  }

  /**
   * Returns the primary care need for a pet so thought bubbles & clipboard
   * always have clear, friendly prompts.
   */
  getPetPrimaryNeed(petId) {
    const pet = this.state.pets[petId];
    if (!pet) return null;
    if (pet.dirtSpots.length > 0 || pet.stats.cleanliness < 68) {
      return {
        type: 'spa',
        icon: 'spa',
        room: 'spa',
        voiceId: `need_spa_${petId}`,
        text: `${pet.customName} rolled in the mud! Let's go to the Spa for a warm bubble bath!`
      };
    }
    if (pet.ailments.length > 0 || pet.twigs.length > 0 || pet.scrapes.length > 0 || pet.fever || pet.stats.health < 72) {
      return {
        type: 'vet',
        icon: 'vet',
        room: 'clinic',
        voiceId: `need_vet_${petId}`,
        text: `${pet.customName} has a little boo-boo! Let's visit the Vet Clinic for a gentle checkup!`
      };
    }
    if (pet.stats.hunger < 72) {
      return {
        type: 'kitchen',
        icon: 'kitchen',
        room: 'kitchen',
        voiceId: `need_food_${petId}`,
        text: `${pet.customName}'s tummy is rumbling! Let's head to the Kitchen for yummy treats!`
      };
    }
    if (pet.stats.love < 82) {
      return {
        type: 'lobby',
        icon: 'lobby',
        room: 'lobby',
        voiceId: `need_love_${petId}`,
        text: `${pet.customName} wants cuddles and brushing in the Cozy Lobby!`
      };
    }
    return {
      type: 'yard',
      icon: 'yard',
      room: 'yard',
      voiceId: `need_play_${petId}`,
      text: `${pet.customName} is full of happy energy! Let's play outside in the Play Yard!`
    };
  }

  /**
   * Prepares a pet for a specific room activity so that even if she visits a room
   * spontaneously, there are fun hands-on steps waiting for her!
   */
  ensureActivityReady(petId, activityType) {
    const pet = this.state.pets[petId];
    if (!pet) return;
    if (activityType === 'spa') {
      if (pet.dirtSpots.length === 0) {
        pet.dirtSpots = [0, 1, 2, 3, 4];
        pet.teethSparkly = false;
        pet.stats.cleanliness = Math.min(pet.stats.cleanliness, 55);
      }
    } else if (activityType === 'vet') {
      if (pet.twigs.length === 0 && pet.scrapes.length === 0 && !pet.fever) {
        pet.twigs = [0, 1, 2];
        pet.scrapes = [0, 1];
        pet.fever = true;
        pet.ailments = ['tummy_ache', 'twigs', 'scrape', 'fever'];
        pet.stats.health = Math.min(pet.stats.health, 65);
      }
    } else if (activityType === 'kitchen') {
      pet.stats.hunger = Math.min(pet.stats.hunger, 55);
    } else if (activityType === 'lobby') {
      pet.stats.love = Math.min(pet.stats.love, 65);
    }
    this.save();
  }

  /**
   * Gentle background tick: stats never drop below 38 (never very sad/sick),
   * and slowly create new playful care prompts over time.
   */
  tickNeeds() {
    for (const petId of ['capybara', 'axolotl', 'dikdik']) {
      const pet = this.state.pets[petId];
      if (!pet) continue;
      pet.stats.cleanliness = clampStat(pet.stats.cleanliness - 2.2);
      pet.stats.hunger = clampStat(pet.stats.hunger - 2.6);
      pet.stats.love = clampStat(pet.stats.love - 1.5);
      if (pet.stats.cleanliness < 58 && pet.dirtSpots.length === 0) {
        pet.dirtSpots = [0, 1, 2, 3];
      }
    }
    this.save();
  }
}

function clampStat(v) {
  return Math.max(38, Math.min(100, Math.round(Number(v) || 75)));
}
