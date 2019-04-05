window.lines = [
  {
    template: 'So many books in the library',
    tags: [['amenity','library']],
  },
  {
    template: 'Yawns in the classroom',
    tags: [['amenity','university']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: 'No one sends letters anymore',
    tags: [['amenity','post_box']]
  },
  {
    template: 'The boat arrives late again',
    tags: [['route','ferry']]
  },
  {
    template: ['A couple getting a loan', 'A couple getting a mortgage'],
    tags: [['amenity','bank']],
    condition: (el, env) => env.moment === 'morning',
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
    template: 'Commuting back home',
    tags: [['subway', 'yes']],
    condition: (el, env) => env.moment === 'afternoon' || env.moment === 'evening'
  },
  {
    template: 'Someone has cut in line at the theater',
    tags: [['amenity', 'theatre']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: 'Going to work',
    tags: [['subway', 'yes']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'Is it too early for a beer?',
    tags: [['amenity', 'pub']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'The turists are already sleeping',
    tags: [['tourism', 'hotel']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: 'Hotels',
    tags: [['amenity', 'place_of_worship']],
    condition: (el, env) => new Date().getDay() >= 6 && env.moment === 'morning'
  },
  {
    template: 'The skyscraper towers above the city',
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
    template: ['Green. Red. Green. Red.', 'Traffic light goes red'],
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
    template: 'Buses passing through',
    tags: [['route', 'bus']],
  },
  {
    template: 'The grass is green',
    tags: [['leisure', 'park']],
  },
  {
    template: ['Learn your lesson','The teacher teaches'],
    tags: [['amenity', 'school']],
  },
  {
    template: 'Bikes like dead metal animals',
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: 'Time for contemplation',
    tags: [['amenity', 'place_of_worship']],
  },
  {
    template: (el, env) => `What would ${el.name} think?`,
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: (el, env) => `Meet at ${el.tags['addr:street']}, ${el.tags['addr:housenumber']}.`,
    condition: (el, env) => el.tags['addr:street'] !== undefined && el.tags['addr:housenumber'] !== undefined
  },
]
