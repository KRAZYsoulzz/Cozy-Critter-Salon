// ============================================================================
// Cozy Critter Salon & Spa - 3D Cosmetics, Room Upgrades & Kitchen Snacks
// ============================================================================
import * as THREE from 'three';
import { toonMat, addOutline } from './gfx.js';

export const SHOP_ITEMS = [
  // HATS - Girly & Glam
  {
    id: 'princess_tiara',
    name: 'Princess Tiara',
    slot: 'hat',
    tab: 'girly',
    price: 25,
    avatarCompatible: true,
    voiceId: 'item_princess_tiara',
    color: '#ffd700',
    accent: '#ff69b4',
    desc: 'A sparkling golden tiara with a heart ruby!'
  },
  {
    id: 'giant_pink_bow',
    name: 'Giant Pink Bow',
    slot: 'hat',
    tab: 'girly',
    price: 20,
    avatarCompatible: true,
    voiceId: 'item_giant_pink_bow',
    color: '#ff6fae',
    accent: '#ffc2df',
    desc: 'A big bouncy satin ribbon bow!'
  },
  {
    id: 'daisy_crown',
    name: 'Flower Daisy Crown',
    slot: 'hat',
    tab: 'girly',
    price: 25,
    avatarCompatible: true,
    voiceId: 'item_daisy_crown',
    color: '#fff9e6',
    accent: '#ffcc33',
    desc: 'Fresh meadow daisies woven into a crown!'
  },
  {
    id: 'unicorn_horn',
    name: 'Magical Unicorn Horn',
    slot: 'hat',
    tab: 'girly',
    price: 35,
    avatarCompatible: true,
    voiceId: 'item_unicorn_horn',
    color: '#ffe680',
    accent: '#c285ff',
    desc: 'A spiral pastel horn with fluffy ears and flowers!'
  },
  {
    id: 'strawberry_beret',
    name: 'Sweet Strawberry Beret',
    slot: 'hat',
    tab: 'girly',
    price: 25,
    avatarCompatible: true,
    voiceId: 'item_strawberry_beret',
    color: '#ff4d6d',
    accent: '#40c057',
    desc: 'A soft strawberry beret with tiny seeds and a green leaf!'
  },
  // HATS - Silly & Goofy
  {
    id: 'tangerine_stack',
    name: 'Tangerine Stack',
    slot: 'hat',
    tab: 'silly',
    price: 15,
    avatarCompatible: true,
    voiceId: 'item_tangerine_stack',
    color: '#ff8c24',
    accent: '#48b848',
    desc: 'Two sweet tangerines balanced right on top!'
  },
  {
    id: 'propeller_beanie',
    name: 'Propeller Beanie',
    slot: 'hat',
    tab: 'silly',
    price: 30,
    avatarCompatible: true,
    voiceId: 'item_propeller_beanie',
    color: '#4da6ff',
    accent: '#ff5252',
    desc: 'A rainbow beanie with a spinning top propeller!'
  },
  {
    id: 'chef_toque',
    name: 'Puffy Chef Hat',
    slot: 'hat',
    tab: 'silly',
    price: 25,
    avatarCompatible: true,
    voiceId: 'item_chef_toque',
    color: '#ffffff',
    accent: '#ff85a2',
    desc: 'Ready to bake cupcakes in the salon cafe!'
  },
  // GLASSES & FACE
  {
    id: 'heart_sunglasses',
    name: 'Heart Sunglasses',
    slot: 'glasses',
    tab: 'girly',
    price: 25,
    avatarCompatible: true,
    voiceId: 'item_heart_sunglasses',
    color: '#ff4785',
    accent: '#ffb3d1',
    desc: 'Rosy heart-shaped frames for superstar pets!'
  },
  {
    id: 'mustache_monocle',
    name: 'Mustache & Monocle',
    slot: 'glasses',
    tab: 'silly',
    price: 30,
    avatarCompatible: true,
    voiceId: 'item_mustache_monocle',
    color: '#5a3825',
    accent: '#ffd700',
    desc: 'A fancy curly mustache and golden monocle!'
  },
  {
    id: 'cucumber_masks',
    name: 'Spa Cucumber Slices',
    slot: 'glasses',
    tab: 'silly',
    price: 20,
    avatarCompatible: true,
    voiceId: 'item_cucumber_masks',
    color: '#5cd66f',
    accent: '#d8f8dc',
    desc: 'Cool, refreshing cucumber slices for spa day!'
  },
  {
    id: 'star_shades',
    name: 'Glitter Star Shades',
    slot: 'glasses',
    tab: 'girly',
    price: 30,
    avatarCompatible: true,
    voiceId: 'item_star_shades',
    color: '#ffd43b',
    accent: '#a970ff',
    desc: 'Dazzling golden star glasses!'
  },
  // NECK & OUTFITS
  {
    id: 'fluffy_pink_boa',
    name: 'Fluffy Pink Boa',
    slot: 'neck',
    tab: 'girly',
    price: 30,
    avatarCompatible: false,
    voiceId: 'item_fluffy_pink_boa',
    color: '#ff80bf',
    accent: '#ffe0f0',
    desc: 'So soft and glamorous around the neck!'
  },
  {
    id: 'superhero_cape',
    name: 'Super Critter Cape',
    slot: 'outfit',
    tab: 'silly',
    price: 35,
    avatarCompatible: false,
    voiceId: 'item_superhero_cape',
    color: '#ff3b5c',
    accent: '#ffd700',
    desc: 'A heroic cape with a golden star emblem!'
  },
  {
    id: 'dino_hoodie',
    name: 'Cute Dino Spikes Cape',
    slot: 'outfit',
    tab: 'silly',
    price: 35,
    avatarCompatible: false,
    voiceId: 'item_dino_hoodie',
    color: '#69db7c',
    accent: '#ffd43b',
    desc: 'A pastel green dino cape with soft yellow spikes!'
  },
  {
    id: 'ballet_tutu',
    name: 'Sparkle Ballet Tutu',
    slot: 'outfit',
    tab: 'girly',
    price: 35,
    avatarCompatible: false,
    voiceId: 'item_ballet_tutu',
    color: '#ff99cc',
    accent: '#ffffff',
    desc: 'A frilly pink tulle tutu for happy twirls!'
  },
  {
    id: 'pearl_collar',
    name: 'Heart Pearl Necklace',
    slot: 'neck',
    tab: 'girly',
    price: 25,
    avatarCompatible: false,
    voiceId: 'item_pearl_collar',
    color: '#fff5fa',
    accent: '#ff5286',
    desc: 'Shimmery pearls with a ruby heart charm!'
  },
  // PROPS
  {
    id: 'fairy_wand',
    name: 'Starlight Fairy Wand',
    slot: 'heldProp',
    tab: 'girly',
    price: 30,
    avatarCompatible: true,
    voiceId: 'item_fairy_wand',
    color: '#ffdf4d',
    accent: '#ff77b7',
    desc: 'Grants cozy wishes with a wave of the star!'
  },
  {
    id: 'mini_ukulele',
    name: 'Mini Wooden Ukulele',
    slot: 'heldProp',
    tab: 'girly',
    price: 30,
    avatarCompatible: true,
    voiceId: 'item_mini_ukulele',
    color: '#c68642',
    accent: '#8d5524',
    desc: 'A tiny wooden ukulele for sweet cozy strumming!'
  },
  {
    id: 'boba_tea_cup',
    name: 'Strawberry Boba Cup',
    slot: 'heldProp',
    tab: 'silly',
    price: 25,
    avatarCompatible: true,
    voiceId: 'item_boba_tea_cup',
    color: '#ff9ebb',
    accent: '#4a2c2a',
    desc: 'Sweet pink milk tea with chewy tapioca pearls!'
  },
  {
    id: 'flower_pinwheel',
    name: 'Spinning Flower Pinwheel',
    slot: 'heldProp',
    tab: 'silly',
    price: 25,
    avatarCompatible: true,
    voiceId: 'item_flower_pinwheel',
    color: '#ff922b',
    accent: '#20c997',
    desc: 'Spins gently with every breeze and happy hop!'
  }
];

export const ROOM_UPGRADES = [
  {
    room: 'spa',
    roomName: 'Spa & Grooming',
    tiers: [
      { tier: 1, name: 'Cozy Bubble Tub', price: 0, voiceId: 'upg_spa_1', color: '#78d8ff', desc: 'A cheerful porcelain tub with warm bubbles.' },
      { tier: 2, name: 'Yuzu Citrus Hot Spring', price: 50, voiceId: 'upg_spa_2', color: '#ffb84d', desc: 'Cedar wood bath with floating yuzu tangerines and lanterns!' },
      { tier: 3, name: 'Sparkly Mermaid Jacuzzi', price: 90, voiceId: 'upg_spa_3', color: '#c77dff', desc: 'A giant seashell jacuzzi with pearl arches and rainbow mist!' }
    ]
  },
  {
    room: 'clinic',
    roomName: 'Vet Clinic',
    tiers: [
      { tier: 1, name: 'Friendly Checkup Table', price: 0, voiceId: 'upg_clinic_1', color: '#63e6be', desc: 'Clean mint table with gentle care tools.' },
      { tier: 2, name: 'Pastel Rainbow Clinic', price: 50, voiceId: 'upg_clinic_2', color: '#ff85c0', desc: 'Rainbow arches, heart pillows, and starry cabinets!' },
      { tier: 3, name: 'Royal Pet Hospital', price: 90, voiceId: 'upg_clinic_3', color: '#ffd43b', desc: 'Golden crown canopy, velvet cushions, and crystal heart monitors!' }
    ]
  },
  {
    room: 'lobby',
    roomName: 'Lobby & Sanctuary',
    tiers: [
      { tier: 1, name: 'Cozy Heart Rug', price: 0, voiceId: 'upg_lobby_1', color: '#ff8da1', desc: 'A warm woven rug and comfy cushions.' },
      { tier: 2, name: 'Princess Castle Lounge', price: 50, voiceId: 'upg_lobby_2', color: '#d08bff', desc: 'Silk drapes, royal armchairs, and crystal chandeliers!' },
      { tier: 3, name: 'Magical Treehouse Sanctuary', price: 90, voiceId: 'upg_lobby_3', color: '#69db7c', desc: 'Indoor blossom trees, fairy lights, and flower swings!' }
    ]
  },
  {
    room: 'kitchen',
    roomName: 'Kitchen & Cafe',
    tiers: [
      { tier: 1, name: 'Sunny Picnic Table', price: 0, voiceId: 'upg_kitchen_1', color: '#ffa94d', desc: 'Warm wooden table for freshly made treats.' },
      { tier: 2, name: 'Paris Pastry Cafe', price: 50, voiceId: 'upg_kitchen_2', color: '#ff7eb6', desc: 'Striped awning, marble cake stands, and macaron towers!' },
      { tier: 3, name: 'Candy Cloud Diner', price: 90, voiceId: 'upg_kitchen_3', color: '#74c0fc', desc: 'Cotton candy booths, neon milkshake signs, and star tables!' }
    ]
  }
];

export const KITCHEN_FOODS = [
  {
    id: 'tangerine_slice',
    name: 'Sweet Tangerine',
    category: 'healthy',
    favoriteOf: 'capybara',
    voiceId: 'food_tangerine',
    color: 0xff8c1a,
    accent: 0x52c41a,
    crunchType: 'munch'
  },
  {
    id: 'kelp_gummy',
    name: 'Sea-Kelp Gummies',
    category: 'healthy',
    favoriteOf: 'axolotl',
    voiceId: 'food_kelp_gummy',
    color: 0x36cfc9,
    accent: 0xb5f5ec,
    crunchType: 'slurp'
  },
  {
    id: 'strawberry',
    name: 'Juicy Strawberry',
    category: 'healthy',
    favoriteOf: 'dikdik',
    voiceId: 'food_strawberry',
    color: 0xff4d6d,
    accent: 0x52b788,
    crunchType: 'munch'
  },
  {
    id: 'watermelon',
    name: 'Watermelon Wedge',
    category: 'healthy',
    favoriteOf: null,
    voiceId: 'food_watermelon',
    color: 0xff5c77,
    accent: 0x40916c,
    crunchType: 'munch'
  },
  {
    id: 'blueberry_bowl',
    name: 'Fresh Blueberries',
    category: 'healthy',
    favoriteOf: null,
    voiceId: 'food_blueberries',
    color: 0x4c6ef5,
    accent: 0x91a7ff,
    crunchType: 'munch'
  },
  {
    id: 'bamboo_shoot',
    name: 'Crunchy Leaf Shoot',
    category: 'healthy',
    favoriteOf: null,
    voiceId: 'food_bamboo',
    color: 0x74c69d,
    accent: 0xb7e4c7,
    crunchType: 'munch'
  },
  {
    id: 'rainbow_cupcake',
    name: 'Rainbow Cupcake',
    category: 'silly',
    favoriteOf: null,
    voiceId: 'food_cupcake',
    color: 0xff85c0,
    accent: 0xffe066,
    crunchType: 'munch'
  },
  {
    id: 'strawberry_boba',
    name: 'Strawberry Boba',
    category: 'silly',
    favoriteOf: null,
    voiceId: 'food_boba',
    color: 0xffadd2,
    accent: 0x593a2e,
    crunchType: 'slurp'
  },
  {
    id: 'star_pancakes',
    name: 'Star Pancakes',
    category: 'silly',
    favoriteOf: null,
    voiceId: 'food_pancakes',
    color: 0xf5b041,
    accent: 0xffeaa7,
    crunchType: 'munch'
  },
  {
    id: 'taco_supreme',
    name: 'Crunchy Mini Taco',
    category: 'silly',
    favoriteOf: null,
    voiceId: 'food_taco',
    color: 0xfad390,
    accent: 0xeb2f06,
    crunchType: 'munch'
  }
];

export function getShopItem(id) {
  return SHOP_ITEMS.find(item => item.id === id) || null;
}

// ============================================================================
// 3D Cosmetic Mesh Builder (used on Pets, Avatar, and Shop 3D Preview)
// ============================================================================
export function buildCosmeticMesh(itemId) {
  const g = new THREE.Group();
  g.name = `cosmetic_${itemId}`;

  switch (itemId) {
    case 'princess_tiara': {
      const goldMat = toonMat(0xffd700, { emissive: 0x443000, emissiveIntensity: 0.2 });
      const gemMat = toonMat(0xff3b8b, { emissive: 0xff1e75, emissiveIntensity: 0.3 });
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 10, 24, Math.PI * 1.15), goldMat);
      band.rotation.x = Math.PI / 2;
      band.rotation.z = -Math.PI * 0.075;
      g.add(band);
      const peakPositions = [-0.18, -0.09, 0, 0.09, 0.18];
      peakPositions.forEach((x, idx) => {
        const h = idx === 2 ? 0.22 : (idx === 1 || idx === 3 ? 0.15 : 0.1);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.045, h, 8), goldMat);
        const angle = (idx - 2) * 0.35;
        cone.position.set(Math.sin(angle) * 0.23, h * 0.5, Math.cos(angle) * 0.23);
        g.add(cone);
      });
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), gemMat);
      gem.position.set(0, 0.12, 0.255);
      g.add(gem);
      break;
    }

    case 'giant_pink_bow': {
      const pinkMat = toonMat(0xff5ca8);
      const lightMat = toonMat(0xffb8dc);
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 12), lightMat);
      knot.position.y = 0.08;
      g.add(knot);
      for (const dir of [-1, 1]) {
        const loop = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.28, 12), pinkMat);
        loop.rotation.z = dir * Math.PI * 0.45;
        loop.scale.set(1, 1, 0.55);
        loop.position.set(dir * 0.16, 0.1, 0);
        g.add(loop);

        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.025), pinkMat);
        tail.position.set(dir * 0.09, -0.02, -0.02);
        tail.rotation.z = dir * 0.35;
        g.add(tail);
      }
      break;
    }

    case 'daisy_crown': {
      const vineMat = toonMat(0x52b788);
      const petalMat = toonMat(0xffffff);
      const centerMat = toonMat(0xffcc00);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.028, 8, 24), vineMat);
      ring.rotation.x = Math.PI / 2;
      g.add(ring);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const flower = new THREE.Group();
        flower.position.set(Math.cos(a) * 0.29, 0.02, Math.sin(a) * 0.29);
        flower.lookAt(Math.cos(a) * 0.6, 0.1, Math.sin(a) * 0.6);
        const center = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), centerMat);
        flower.add(center);
        for (let p = 0; p < 6; p++) {
          const pa = (p / 6) * Math.PI * 2;
          const petal = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), petalMat);
          petal.scale.set(0.8, 1.3, 0.5);
          petal.position.set(Math.cos(pa) * 0.055, Math.sin(pa) * 0.055, 0);
          petal.rotation.z = pa - Math.PI / 2;
          flower.add(petal);
        }
        g.add(flower);
      }
      break;
    }

    case 'unicorn_horn': {
      const hornMat = toonMat(0xffe066, { emissive: 0x553300, emissiveIntensity: 0.2 });
      const earMat = toonMat(0xffffff);
      const innerMat = toonMat(0xff99c8);
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.38, 14), hornMat);
      horn.position.set(0, 0.19, 0.08);
      horn.rotation.x = 0.22;
      g.add(horn);
      // Spiral rings
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06 - i * 0.014, 0.012, 8, 14), toonMat(0xd08bff));
        ring.rotation.x = Math.PI / 2 + 0.22;
        ring.position.set(0, 0.08 + i * 0.09, 0.06 + i * 0.02);
        g.add(ring);
      }
      for (const dir of [-1, 1]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 10), earMat);
        ear.position.set(dir * 0.18, 0.09, 0);
        ear.rotation.z = -dir * 0.3;
        g.add(ear);
        const inner = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 8), innerMat);
        inner.position.set(dir * 0.18, 0.08, 0.03);
        inner.rotation.z = -dir * 0.3;
        g.add(inner);
      }
      break;
    }

    case 'tangerine_stack': {
      const orangeMat = toonMat(0xff8c1a);
      const leafMat = toonMat(0x40c057);
      const bot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), orangeMat);
      bot.scale.set(1.12, 0.85, 1.12);
      bot.position.y = 0.09;
      g.add(bot);

      const top = new THREE.Mesh(new THREE.SphereGeometry(0.105, 14, 12), orangeMat);
      top.scale.set(1.12, 0.85, 1.12);
      top.position.y = 0.25;
      g.add(top);

      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), leafMat);
      leaf.scale.set(1.6, 0.35, 0.8);
      leaf.position.set(0.05, 0.34, 0);
      leaf.rotation.z = 0.35;
      g.add(leaf);
      break;
    }

    case 'propeller_beanie': {
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
        toonMat(0x4dabf7)
      );
      g.add(dome);
      const brim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 8, 20), toonMat(0xff6b6b));
      brim.rotation.x = Math.PI / 2;
      g.add(brim);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.12, 8), toonMat(0xffd43b));
      pole.position.y = 0.27;
      g.add(pole);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.018, 0.055), toonMat(0xff5252));
      blade.position.y = 0.33;
      blade.name = 'propeller_blade';
      g.add(blade);
      break;
    }

    case 'chef_toque': {
      const whiteMat = toonMat(0xffffff);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.2, 0.12, 16), whiteMat);
      band.position.y = 0.06;
      g.add(band);
      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.035, 16), toonMat(0xff7eb6));
      ribbon.position.y = 0.03;
      g.add(ribbon);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), whiteMat);
        puff.position.set(Math.cos(a) * 0.1, 0.2, Math.sin(a) * 0.1);
        g.add(puff);
      }
      break;
    }

    case 'heart_sunglasses': {
      const frameMat = toonMat(0xff3b7f);
      const lensMat = toonMat(0x881448, { emissive: 0x33001a, emissiveIntensity: 0.25 });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.03, 0.03), frameMat);
      g.add(bridge);
      for (const dir of [-1, 1]) {
        const hGroup = new THREE.Group();
        hGroup.position.set(dir * 0.15, 0, 0);
        const l1 = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 12), frameMat);
        l1.rotation.x = Math.PI / 2;
        l1.position.set(-0.04, 0.03, 0);
        const l2 = l1.clone();
        l2.position.set(0.04, 0.03, 0);
        const bottom = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.13, 4), frameMat);
        bottom.rotation.z = Math.PI;
        bottom.scale.set(1.1, 1, 0.28);
        bottom.position.set(0, -0.03, 0);
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), lensMat);
        lens.scale.set(1.2, 1.0, 0.3);
        lens.position.set(0, 0.01, 0.01);
        hGroup.add(l1, l2, bottom, lens);
        g.add(hGroup);
      }
      break;
    }

    case 'mustache_monocle': {
      const goldMat = toonMat(0xffd43b);
      const hairMat = toonMat(0x4a2c18);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 8, 20), goldMat);
      ring.position.set(0.15, 0.04, 0.02);
      g.add(ring);
      for (const dir of [-1, 1]) {
        const stache = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.14, 6, 10), hairMat);
        stache.rotation.z = Math.PI / 2 - dir * 0.32;
        stache.position.set(dir * 0.1, -0.13, 0.04);
        g.add(stache);
      }
      break;
    }

    case 'cucumber_masks': {
      const rindMat = toonMat(0x2f9e44);
      const insideMat = toonMat(0xd3f9d8);
      for (const dir of [-1, 1]) {
        const c = new THREE.Group();
        c.position.set(dir * 0.15, 0.01, 0.02);
        const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.03, 16), rindMat);
        outer.rotation.x = Math.PI / 2;
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.034, 16), insideMat);
        inner.rotation.x = Math.PI / 2;
        c.add(outer, inner);
        g.add(c);
      }
      break;
    }

    case 'star_shades': {
      const goldMat = toonMat(0xffd43b);
      const lensMat = toonMat(0x9775fa);
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.028, 0.028), goldMat);
      g.add(bridge);
      for (const dir of [-1, 1]) {
        const star = new THREE.Group();
        star.position.set(dir * 0.15, 0, 0.01);
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * Math.PI * 2;
          const ray = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 6), goldMat);
          ray.position.set(Math.cos(a) * 0.06, Math.sin(a) * 0.06, 0);
          ray.rotation.z = a - Math.PI / 2;
          ray.scale.z = 0.35;
          star.add(ray);
        }
        const center = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.035, 12), lensMat);
        center.rotation.x = Math.PI / 2;
        star.add(center);
        g.add(star);
      }
      break;
    }

    case 'fluffy_pink_boa': {
      const pink1 = toonMat(0xff66b3);
      const pink2 = toonMat(0xff99cc);
      const count = 14;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), i % 2 === 0 ? pink1 : pink2);
        puff.position.set(Math.cos(a) * 0.34, Math.sin(a * 3) * 0.025, Math.sin(a) * 0.34);
        g.add(puff);
      }
      break;
    }

    case 'pearl_collar': {
      const pearlMat = toonMat(0xfff5fa);
      const count = 16;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), pearlMat);
        pearl.position.set(Math.cos(a) * 0.33, 0, Math.sin(a) * 0.33);
        g.add(pearl);
      }
      const heart = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), toonMat(0xff3b7f));
      heart.position.set(0, -0.05, 0.36);
      g.add(heart);
      break;
    }

    case 'superhero_cape': {
      const redMat = toonMat(0xff3b5c);
      const goldMat = toonMat(0xffd43b);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 8, 20), goldMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.14;
      g.add(collar);
      const cape = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.48, 0.62, 16, 1, true, Math.PI * 0.65, Math.PI * 0.7),
        redMat
      );
      cape.material.side = THREE.DoubleSide;
      cape.position.set(0, -0.1, -0.08);
      cape.rotation.x = 0.25;
      g.add(cape);
      break;
    }

    case 'ballet_tutu': {
      const tulleMat = toonMat(0xff85c2);
      const trimMat = toonMat(0xffe3f1);
      const waist = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.04, 8, 24), trimMat);
      waist.rotation.x = Math.PI / 2;
      g.add(waist);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const frill = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 8), i % 2 === 0 ? tulleMat : trimMat);
        frill.position.set(Math.cos(a) * 0.38, -0.04, Math.sin(a) * 0.38);
        frill.rotation.z = -Math.cos(a) * 1.1;
        frill.rotation.x = Math.sin(a) * 1.1;
        g.add(frill);
      }
      break;
    }

    case 'fairy_wand': {
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.48, 8), toonMat(0xff85c0));
      stick.position.y = 0.18;
      g.add(stick);
      const starMat = toonMat(0xffe066, { emissive: 0x664400, emissiveIntensity: 0.25 });
      const top = new THREE.Group();
      top.position.y = 0.44;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const ray = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 6), starMat);
        ray.position.set(Math.cos(a) * 0.06, Math.sin(a) * 0.06, 0);
        ray.rotation.z = a - Math.PI / 2;
        top.add(ray);
      }
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), starMat);
      top.add(core);
      g.add(top);
      break;
    }

    case 'boba_tea_cup': {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.28, 14), toonMat(0xffadd2));
      cup.position.y = 0.14;
      g.add(cup);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
        toonMat(0xffffff)
      );
      dome.position.y = 0.28;
      g.add(dome);
      const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.22, 8), toonMat(0xff4d6d));
      straw.position.set(0.03, 0.36, 0);
      straw.rotation.z = -0.18;
      g.add(straw);
      // Pearls at bottom
      const pearlMat = toonMat(0x3d2217);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.024, 6, 6), pearlMat);
        p.position.set(Math.cos(a) * 0.06, 0.04, Math.sin(a) * 0.06);
        g.add(p);
      }
      break;
    }

    case 'strawberry_beret': {
      const redMat = toonMat(0xff3b5c);
      const stemMat = toonMat(0x40c057);
      const seedMat = toonMat(0xffe066);

      const beret = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52),
        redMat
      );
      beret.scale.set(1.2, 0.45, 1.2);
      beret.position.y = 0.06;
      g.add(beret);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.08, 8), stemMat);
      stem.position.set(0, 0.17, 0);
      stem.rotation.z = 0.2;
      g.add(stem);

      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 6), stemMat);
        leaf.rotation.x = Math.PI / 2;
        leaf.rotation.z = a;
        leaf.position.set(Math.cos(a) * 0.04, 0.15, Math.sin(a) * 0.04);
        g.add(leaf);
      }

      for (let s = 0; s < 7; s++) {
        const sa = (s / 7) * Math.PI * 2;
        const seed = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 6), seedMat);
        seed.position.set(Math.cos(sa) * 0.18, 0.09, Math.sin(sa) * 0.18);
        g.add(seed);
      }
      g.rotation.z = -0.15;
      break;
    }

    case 'mini_ukulele': {
      const woodMat = toonMat(0xc68642);
      const darkWood = toonMat(0x6d4c41);
      const pegMat = toonMat(0xffd700);

      const lowerBout = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), woodMat);
      lowerBout.rotation.x = Math.PI / 2;
      const upperBout = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 16), woodMat);
      upperBout.rotation.x = Math.PI / 2;
      upperBout.position.y = 0.12;

      const soundHole = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), darkWood);
      soundHole.position.set(0, 0.08, 0.026);

      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.035), darkWood);
      neck.position.set(0, 0.24, 0);

      const headstock = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.08, 0.035), woodMat);
      headstock.position.set(0, 0.35, 0);

      for (const dir of [-1, 1]) {
        for (let p = 0; p < 2; p++) {
          const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 6), pegMat);
          peg.rotation.z = Math.PI / 2;
          peg.position.set(dir * 0.038, 0.33 + p * 0.035, 0);
          g.add(peg);
        }
      }

      g.add(lowerBout, upperBout, soundHole, neck, headstock);
      g.rotation.z = -0.35;
      g.rotation.y = 0.2;
      break;
    }

    case 'dino_hoodie': {
      const greenMat = toonMat(0x51cf66);
      const yellowMat = toonMat(0xffd43b);

      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.035, 8, 20), greenMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 0.14;
      g.add(collar);

      const cape = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.46, 0.6, 16, 1, true, Math.PI * 0.65, Math.PI * 0.7),
        greenMat
      );
      cape.material.side = THREE.DoubleSide;
      cape.position.set(0, -0.1, -0.08);
      cape.rotation.x = 0.25;
      g.add(cape);

      for (let i = 0; i < 4; i++) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 6), yellowMat);
        spike.rotation.x = -Math.PI / 3;
        spike.position.set(0, 0.1 - i * 0.13, -0.28 - i * 0.06);
        g.add(spike);
      }
      break;
    }

    case 'flower_pinwheel': {
      const poleMat = toonMat(0xffffff);
      const pinMat = toonMat(0xffd43b);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.46, 8), poleMat);
      pole.position.y = 0.18;
      g.add(pole);

      const wheelGroup = new THREE.Group();
      wheelGroup.name = 'pinwheel_blades';
      wheelGroup.position.set(0, 0.42, 0.03);

      const colors = [0xff6b6b, 0xffd43b, 0x4dabf7, 0x69db7c];
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const petal = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 6), toonMat(colors[i]));
        petal.scale.set(1, 1, 0.3);
        petal.rotation.z = a - Math.PI / 2;
        petal.position.set(Math.cos(a) * 0.07, Math.sin(a) * 0.07, 0);
        wheelGroup.add(petal);
      }

      const pin = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), pinMat);
      pin.position.z = 0.02;
      wheelGroup.add(pin);
      g.add(wheelGroup);
      break;
    }
  }

  g.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });
  return g;
}

// ============================================================================
// 3D Kitchen Snack Mesh Builder
// ============================================================================
export function buildFoodMesh(foodId) {
  const g = new THREE.Group();
  g.name = `food_${foodId}`;

  switch (foodId) {
    case 'tangerine_slice': {
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 14, 12), toonMat(0xff8c1a));
      body.scale.set(1.12, 0.85, 1.12);
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), toonMat(0x40c057));
      leaf.scale.set(1.6, 0.35, 0.85);
      leaf.position.set(0.06, 0.16, 0);
      leaf.rotation.z = 0.3;
      g.add(body, leaf);
      break;
    }

    case 'kelp_gummy': {
      const mat = toonMat(0x36cfc9, { emissive: 0x0b4f4c, emissiveIntensity: 0.2 });
      const star = new THREE.Mesh(new THREE.TorusKnotGeometry(0.11, 0.042, 36, 8, 2, 3), mat);
      star.rotation.x = Math.PI / 2;
      g.add(star);
      break;
    }

    case 'strawberry': {
      const berry = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.28, 12), toonMat(0xff3b6b));
      berry.rotation.x = Math.PI;
      berry.position.y = 0.02;
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.04, 0.05, 8), toonMat(0x40c057));
      cap.position.y = 0.15;
      g.add(berry, cap);
      break;
    }

    case 'watermelon': {
      const rind = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.09, 16, 1, false, 0, Math.PI),
        toonMat(0x2f9e44)
      );
      const flesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.19, 0.19, 0.1, 16, 1, false, 0, Math.PI),
        toonMat(0xff4d6d)
      );
      rind.rotation.z = Math.PI / 2;
      flesh.rotation.z = Math.PI / 2;
      g.add(rind, flesh);
      break;
    }

    case 'blueberry_bowl': {
      const bowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.13, 0.12, 14),
        toonMat(0xfff0f6)
      );
      g.add(bowl);
      const bMat = toonMat(0x4c6ef5);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), bMat);
        b.position.set(Math.cos(a) * 0.08, 0.07, Math.sin(a) * 0.08);
        g.add(b);
      }
      break;
    }

    case 'bamboo_shoot': {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.34, 10), toonMat(0x69db7c));
      stalk.rotation.z = 0.45;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 8), toonMat(0x2f9e44));
      leaf.position.set(-0.08, 0.1, 0);
      leaf.rotation.z = 0.9;
      g.add(stalk, leaf);
      break;
    }

    case 'rainbow_cupcake': {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.14, 12), toonMat(0xffd43b));
      cup.position.y = -0.05;
      const frost1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), toonMat(0xff85c0));
      frost1.position.y = 0.05;
      const frost2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), toonMat(0x74c0fc));
      frost2.position.y = 0.14;
      const cherry = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), toonMat(0xff2b56));
      cherry.position.y = 0.24;
      g.add(cup, frost1, frost2, cherry);
      break;
    }

    case 'strawberry_boba': {
      return buildCosmeticMesh('boba_tea_cup');
    }

    case 'star_pancakes': {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.19, 0.04, 16), toonMat(0xffffff));
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.045, 14), toonMat(0xf59f00));
      p1.position.y = 0.04;
      const p2 = p1.clone();
      p2.position.y = 0.085;
      const butter = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.035, 0.07), toonMat(0xffe066));
      butter.position.y = 0.12;
      g.add(plate, p1, p2, butter);
      break;
    }

    case 'taco_supreme':
    default: {
      const shell = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.075, 10, 16, Math.PI), toonMat(0xffca3a));
      const filling = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), toonMat(0x52b788));
      filling.scale.set(1.3, 0.7, 0.7);
      filling.position.y = 0.05;
      g.add(shell, filling);
      break;
    }
  }

  g.traverse(c => {
    if (c.isMesh) c.castShadow = true;
  });
  return g;
}
