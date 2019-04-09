// https://openweathermap.org/weather-conditions  

window.lines = [  
  {
    template: ['The world is big', 'Lost in the city']
  },
  {
    template: 'The night is dark',
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: 'The day is young',
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: 'Cold bites',
    condition: (el, env) => env.temperature < 10,
  },
  {
    template: ['Wet to the bone', 'Rain on the road like a mirror'],
    condition: (el, env) => env.weatherConditions.rain || env.weatherConditions.drizzle,
  },
  {
    template: 'So many books in the library',
    tags: [['amenity','library']],
  },
  {
    template: ['Yawns in the classroom', 'A day of learning starts'],
    tags: [['amenity','university'],['amenity','school']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['Those kids would rather be outside'],
    tags: [['amenity','school']],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['No one sends letters anymore', 'Where are those letters going to?'],
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
    template: ['A supermarket hustle and bustle', 'Salad cabbage and carrots', 'The cashier\'s bored'],
    tags: [['shop', 'supermarket']]
  },
  {
    template: 'Dummies staring behind the glass',
    tags: [['shop', 'clothes']]
  },
  {
    template: ['The smell of fresh bread', 'Our daily bread'],
    tags: [['shop', 'bakery']]
  },
  {
    template: 'Never look backwards or you\'ll fall down the stairs.',
    tags: [['highway', 'steps']]
  },
  {
    template: (el, env) => `The smell of fresh coffee from ${el.name}`,
    tags: [['amenity', 'cafe']],
    condition: (el, env) => env.moment === 'morning',
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
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']],
    condition: (el, env) => env.moment === 'afternoon' || env.moment === 'evening'
  },
  {
    template: 'Going to work',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'Someone has cut in line at the theater',
    tags: [['amenity', 'theatre']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: 'Is it too early for a beer?',
    tags: [['amenity', 'pub']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'The tourists are already sleeping',
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
    template: ['Onto the highway', 'A truck changes gears', 'Busy highway', 'Above the freeway noise'],
    tags: [['highway', 'motorway']],
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
    template: 'A walk in the park',
    tags: [['leisure', 'park']],
  },
  {
    template: 'Late night stroll',
    tags: [['leisure', 'park']],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Learn your lesson','The teacher teaches'],
    tags: [['amenity', 'school']],
  },
  {
    template: ['Bikes like dead metal animals', 'Locked wheels'],
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: 'Time for contemplation',
    tags: [['amenity', 'place_of_worship']],
  },
  {
    template: 'Water under pressure',
    tags: [['emergency', 'fire_hydrant']],
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
