window.lines = [
  {
    template: 'So many books in the library',
    tags: [['amenity','library']],
  },
  {
    template: 'A supermarket hustle and bustle',
    tags: [['shop', 'supermarket']]
  },
  {
    template: (el, env) => `The smell of fresh coffee from ${el.name}`,
    tags: [['amenity', 'cafe']],
    // condition: (el, env) => env.moment === 'morning',
    needsName: true
  },
  {
    template: (el, env) => `A wiff from ${el.name} makes me hungry`,
    tags: [['amenity', 'restaurant']],
    needsName: true
  },
  {
    template: 'Heat on the pavement stones',
    tags: [['surface', 'paving_stones']],
    condition: (el, env) => env.temperature > 20
  },
  {
    template: 'A greasy smell',
    tags: [['amenity', 'fast_food']]
  },
  {
    template: 'Being drunk on a bench',
    tags: [['amenity', 'bench']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Glass shattered',
    tags: [['recycling:glass', 'true']],
  },
  {
    template: 'Going back home from commuting',
    tags: [['subway', 'yes']],
    condition: (el, env) => env.moment === 'afternoon' || env.moment === 'evening'
  },
  {
    template: 'Going to work',
    tags: [['subway', 'yes']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'That building skyscraping',
    tags: [['ele', '*']],
    condition: (el, env) => parseInt(el.tags.ele) >= 12
  },
  {
    template: 'Walking on the zebra',
    tags: [['footway', 'crossing']],
  },
  {
    template: 'A hero remembered',
    tags: [['historic', 'memorial']],
  },
  {
    template: 'Green. Red. Green. Red.',
    tags: [['highway', 'traffic_signals']],
  },
  {
    template: 'A halo in the dark',
    tags: [['highway', 'street_lamp']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'A train underneath',
    tags: [['subway', 'route']],
  },
  {
    template: 'The grass is green',
    tags: [['leisure', 'park']],
  },
  {
    template: 'Learn your lesson',
    tags: [['amenity', 'school']],
  },
  {
    template: 'Bikes like dead metal animals',
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: (el, env) => `Meet at ${el.tags['addr:street']}, ${el.tags['addr:housenumber']}.`,
    condition: (el, env) => el.tags['addr:street'] !== undefined && el.tags['addr:housenumber'] !== undefined
  },
]
