/**
 * export-defaults.mjs — src/data/*.ts → plugin/aranya-core/includes/defaults.php
 *
 * The Elementor widgets' default content (what a freshly dropped widget shows,
 * and what the importer builds the Home page from) is the React site's own
 * data, exported verbatim so nothing is retyped: residences, amenities (with
 * the icon each card uses in Amenities.tsx), specifications, floor plans
 * (Tower A's generated floors written out), gallery, location places (with
 * their schematic positions from LocationModal.tsx), infrastructure,
 * consultants.
 *
 * Re-run after editing src/data: `npm run build:defaults`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');
const out = join(here, '..', 'plugin', 'aranya-core', 'includes', 'defaults.php');
const load = (f) => import(pathToFileURL(join(repo, 'src', 'data', f)).href);

const { residencesData } = await load('residencesData.ts');
const { amenitiesData } = await load('amenitiesData.ts');
const { specificationsData } = await load('specificationsData.ts');
const { detailedFloorPlans } = await load('floorPlansData.ts');
const { galleryData } = await load('galleryData.ts');
const { locationNodes, infrastructureProjects } = await load('locationData.ts');
const { developerData } = await load('developerData.ts');

const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Za-z])([0-9])/g, '$1-$2').toLowerCase();

/** "/assets/opt/x.webp" → "opt/x.webp" (path under uploads/aranya). */
const asset = (p) => (p || '').replace(/^\/assets\//, '');

/** Tailwind object-position class → CSS object-position value. */
const focus = (cls) => {
  if (!cls) return '';
  const arb = /^object-\[(.+)\]$/.exec(cls);
  if (arb) return arb[1].replace(/_/g, ' ');
  return cls.replace(/^object-/, '').replace(/-/g, ' ');
};

// Amenity icons: the amenityIcons map in Amenities.tsx.
const amenitiesTsx = readFileSync(join(repo, 'src/components/sections/Amenities.tsx'), 'utf8');
const iconBlock = /const amenityIcons[^{]*\{([\s\S]*?)\};/.exec(amenitiesTsx)[1];
const amenityIcons = Object.fromEntries(
  [...iconBlock.matchAll(/^\s*'?([\w-]+)'?:\s*(\w+),/gm)].map(([, id, comp]) => [id, kebab(comp)])
);

// Schematic positions: NODE_LAYOUT in LocationModal.tsx.
const modalTsx = readFileSync(join(repo, 'src/components/sections/LocationModal.tsx'), 'utf8');
const layoutBlock = /const NODE_LAYOUT[\s\S]*?= \{([\s\S]*?)\n\};/.exec(modalTsx)[1];
const layout = Object.fromEntries(
  [...layoutBlock.matchAll(/(\w+):\s*\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+),\s*short:\s*'([^']*)',\s*side:\s*'(\w)'\s*\}/g)].map(
    ([, id, x, y, short, side]) => [id, { x: +x, y: +y, short, side }]
  )
);

const data = {
  residences: residencesData.map((u) => ({
    unit_id: u.id,
    type: u.type,
    title: u.title,
    carpet_area: u.carpetArea,
    tag: u.tag,
    deck: u.deck,
    description: u.description,
    features: u.features.join('\n'),
    image: asset(u.image),
    floor_plan_image: asset(u.floorPlanImage),
    plans_tab: u.id === '2bhk' ? 'tower-b' : 'tower-a',
  })),
  amenities: amenitiesData.map((a) => ({
    amenity_id: a.id,
    name: a.name,
    group: a.category,
    category_label: a.categoryLabel,
    tagline: a.tagline,
    description: a.description,
    image: asset(a.image),
    badge: a.badge || '',
    icon: amenityIcons[a.id] || 'trophy',
  })),
  specifications: specificationsData.flatMap((c) =>
    c.items.map((i) => ({ category: c.category, feature: i.feature, detail: i.detail }))
  ),
  floor_plans: detailedFloorPlans.map((p) => ({
    plan_id: p.id,
    tower: p.category,
    floor_label: p.floorLabel,
    title: p.title,
    subtitle: p.subtitle,
    image: asset(p.image),
    description: p.description,
    highlights: p.highlights.join('\n'),
  })),
  gallery: galleryData.map((g) => ({
    item_id: g.id,
    title: g.title,
    category: g.category,
    extra_categories: (g.secondaryCategories || []).join(', '),
    category_label: g.categoryLabel,
    image: asset(g.image),
    caption: g.caption,
    focus: focus(g.focus),
  })),
  places: locationNodes.map((n) => ({
    place_id: n.id,
    name: n.name,
    category: n.category,
    time: n.time,
    distance_note: n.distanceNote || '',
    route_note: n.routeNote || '',
    map_x: layout[n.id]?.x ?? '',
    map_y: layout[n.id]?.y ?? '',
    map_label: layout[n.id]?.short ?? '',
    label_side: layout[n.id]?.side ?? 'e',
  })),
  infrastructure: infrastructureProjects.map((p) => ({
    name: p.name,
    status: p.status,
    description: p.description,
    benefit: p.benefit,
  })),
  consultants: developerData.consultants.map((c) => ({ role: c.role, name: c.name })),
  developer_narrative: developerData.narrative,
};

const php = (v, indent = '\t') => {
  if (Array.isArray(v)) {
    if (!v.length) return 'array()';
    return `array(\n${v.map((x) => `${indent}\t${php(x, indent + '\t')},`).join('\n')}\n${indent})`;
  }
  if (v && typeof v === 'object') {
    return `array(\n${Object.entries(v)
      .map(([k, x]) => `${indent}\t'${k}' => ${php(x, indent + '\t')},`)
      .join('\n')}\n${indent})`;
  }
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
};

writeFileSync(
  out,
  `<?php\n/**\n * GENERATED by wordpress/build/export-defaults.mjs from src/data — do not edit.\n * Default content for the Aranya widgets (the React site's data, verbatim).\n */\ndefined( 'ABSPATH' ) || exit;\n\nreturn ${php(data, '')};\n`
);
console.log(
  `defaults.php: ${Object.entries(data)
    .map(([k, v]) => `${k}=${Array.isArray(v) ? v.length : 1}`)
    .join(' ')}`
);
