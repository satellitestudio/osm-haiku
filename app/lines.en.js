// https://openweathermap.org/weather-conditions  

const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen ']
const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/

const getNumWord = (num) => {
  if ((num = num.toString()).length > 9) {
    throw new Error('overflow') // Does not support converting more than 9 digits yet
  }

  const n = ('000000000' + num).substr(-9).match(regex)
  if (!n) return

  let str = ''
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : ''
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : ''
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : ''
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : ''
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''

  return str.trim()
}

const getOrdinal = (n) => {
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n+(s[(v-20)%10]||s[v]||s[0])
}


window.lines = [  
  {
    template: ['The world is big', 'Lost in the city', 'The blurs of lifetimes', 'Thoughts of home', 'I think of home', 'Leaving home', 'Thinking of you', 'Closer', 'Far away', 'The lingering scent']
  },
  {
    template: ['The night is dark', 'Under the moonlight', 'A moonless night', 'The stars far away', 'Murmurs in her sleep', 'A night stroll', 'Sweet dreams'],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Good afternoon'],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: 'The day is young',
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: el => [
      `Welcome to ${el.name}`,
      `That's how it is in ${el.name}`,
      `Another day in ${el.name}`
    ][Math.floor(Math.random() * 3)],
    tags: [['admin_level', '4'], ['admin_level', '5'],  ['admin_level', '6'], ['boundary', 'political']],
    needsName: true
  },
  {
    template: ['Your reflection', 'Water like glass', 'Floating there', 'Quiet water', 'On the water\'s surface'],
    tags: [['waterway', 'canal'], ['waterway', 'river'], ['natural', 'water'], ['water', 'river']]
  },
  {
    template: 'Cold bites',
    condition: (el, env) => env.temperature < 10,
  },
  {
    template: 'Quite warm here.',
    condition: (el, env) => env.temperature > 20,
  },
  {
    template: ['It is very hot.', 'A drop of sweat'],
    condition: (el, env) => env.temperature > 30,
  },
  {
    template: ['Into sunshine', 'The sun scatters', 'Toward the sun', 'A ray of sunlight', 'With sunlight', 'The sun strikes', 'Overflowing with sun'],
    condition: (el, env) => (env.weatherConditions.clear && env.moment !== 'night'),
  },
  {
    template: ['Wet to the bone', 'Rain on the road like a mirror', 'Soaked pants', 'Pouring rain', 'Rain drops', 'Rain darkens'],
    condition: (el, env) => env.weatherConditions.rain || env.weatherConditions.drizzle,
  },
  {
    template: ['So many books', 'Falls from the book', 'On the shelves', 'Yellowed pages', 'A blurry paragraph', 'An old book'],
    tags: [['amenity','library'], ['shop', 'books']],
  },
  {
    template: ['Yawns in the classroom', 'A day of learning starts'],
    tags: [['amenity','university'],['amenity','school']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['Those kids would rather be outside', 'Another depressed teacher'],
    tags: [['amenity','school']],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['No one sends letters anymore', 'Where are those letters going to?', 'To whom it may concern', 'Dear you', 'A love letter'],
    tags: [['amenity','post_box']]
  },
  {
    template: ['Peeing', 'I need to pee'],
    tags: [['amenity','toilets']]
  },
  {
    template: 'The ferry arrives late again',
    tags: [['route','ferry']]
  },
  {
    template: ['A couple getting a loan', 'A couple getting a mortgage'],
    tags: [['amenity','bank']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['The scent of money', 'On the bank statement', 'On the cashpoint screen', 'No money left'],
    tags: [['amenity','bank'], ['amenity', 'atm']]
  },
  {
    template: ['A supermarket hustle and bustle', 'Salad cabbage and carrots', 'The cashier\'s bored', 'A lonely aisle', 'Under the neon', 'Fresh produce'],
    tags: [['shop', 'supermarket']]
  },
  {
    template: ['A deserved vacation', 'Planning our trip', 'All inclusive'],
    tags: [['shop', 'travel_agency']]
  },
  {
    template: ['Dummies staring behind the glass', 'A red dress', 'A blue shirt', 'My summer dress', 'Fabric on skin'],
    tags: [['shop', 'clothes']]
  },
  {
    template: ['Cooking ustensils', 'I need new knives'],
    tags: [['shop', 'houseware']]
  },
  {
    template: ['The smell of fresh bread', 'Our daily bread', 'A baker rests', 'No bread left', 'Bread crumbs'],
    tags: [['shop', 'bakery']]
  },
  {
    template: ['Dead animals', 'Meat is murder', 'Carcasses hanging', 'A bloody scene'],
    tags: [['shop', 'butcher']]
  },
  {
    template: ['Short around the ears?', 'Snip snip snip', 'Start with the shampoo', 'Just a little trim to tidy it up', 'Just a little bit shorter'],
    tags: [['shop', 'hairdresser']]
  },
  {
    template: ['You\'ll fall down the stairs', 'A flight of steps'],
    tags: [['highway', 'steps']]
  },
  {
    template: (el, env) => `Fresh coffee from ${el.name}`,
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']],
    condition: (el, env) => env.moment === 'morning',
    needsName: true
  },
  {
    template: (el, env) => [
      `A wiff from ${el.name} makes me hungry`,
      `Full bellies at ${el.name}`,
      `Eating at ${el.name} in the ${env.moment}?`
    ][Math.floor(Math.random()*2)],
    tags: [['amenity', 'restaurant']],
    needsName: true
  },
  {
    template: ['You are what you eat', 'Coming hot'],
    tags: [['amenity', 'restaurant']]
  },
  {
    template: ['I need a coffee', 'Coffee smells good', 'Sipping her coffee', 'The same pot of coffee', 'The coffeecup still warm'],
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']]
  },
  {
    template: ['The bottle is empty', 'She drank', 'The waitress serves', 'The burn of the whiskey', 'Five fingers of scotch', 'In my beer', 'Bitter wine', 'I\'m a drunk'],
    tags: [['amenity', 'bar'], ['amenity', 'pub']]
  },
  {
    template: (el) => `Getting drunk at ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: (el) => `Beer flows in ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: ['Pineapple on pizzas ?', 'I don\'t eat the pizza crust', 'High on wheat and cheese', 'Pepperoni and cheese', 'The faint memory of Napoli', 'Hot calzone'],
    tags: [['cuisine', 'pizza']]
  },
  {
    template: ['Smells garlic', 'Buon appetito'],
    tags: [['cuisine', 'italian']]
  },
  {
    template: ['A round bun with sesame', 'Juicy burgers and moist buns', 'Flipping burgers'],
    tags: [['cuisine', 'burger']]
  },
  {
    template: ['Spring roll', 'Dim sum', 'A lonely noodle', 'A century old egg'],
    tags: [['cuisine', 'chinese']]
  },
  {
    template: ['A plate of sushi', 'Ginger and wasabi', 'Sake to wash it down'],
    tags: [['cuisine', 'japanese']]
  },
  {
    template: ['Hot jalapeños', 'Mexico in my heart'],
    tags: [['cuisine', 'mexican']]
  },
  {
    template: ['Remember Istanbul', 'Delicious köfte'],
    tags: [['cuisine', 'turkish'], ['cuisine', 'kebab']], 
  },
  {
    template: ['A lonely shoe there','These boots are made for walking'],
    tags: [['shop','shoes']]
  },
  {
    template: 'Heat on the pavement stones',
    tags: [['surface', 'paving_stones']],
    condition: (el, env) => env.temperature > 20
  },
  {
    template: ['A greasy smell', 'Sad soft fries', 'Deep fried'],
    tags: [['amenity', 'fast_food']]
  },
  {
    template: 'A poor soul on a bench',
    tags: [['amenity', 'bench'], ['bench', 'yes']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Glass shattered',
    tags: [['recycling:glass', 'true']],
  },
  {
    template: 'Commuting back home',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']]
  },
  {
    template: ['Should we take the metro?', 'Warm air from the subway entrance'],
    tags: [['railway', 'subway_entrance']]
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
    template: ['The tourists are already sleeping'],
    tags: [['tourism', 'hotel']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Against the hotel windows', 'The desk clerk', 'Cockroach scurries', `Room ${Math.floor(Math.random() * 100)}`],
    tags: [['tourism', 'hotel']]
  },
  {
    template: el => `In the lobby of ${el.name}`,
    tags: [['tourism', 'hotel']],
    needsName: true
  },
  {
    template: 'Praise him',
    tags: [['amenity', 'place_of_worship']],
    condition: (el, env) => new Date().getDay() >= 6 && env.moment === 'morning'
  },
  {
    template: ['In the garage', 'In the garage where I belong'],
    tags: [['building', 'garage']]
  },
  {
    template: ['A skyscraper', 'A skyscraper towers above the city', 'Reaching the sky'],
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 20
  },
  {
    template: el => {
      const ele = parseInt(el.tags['building:levels'])
      
      const ordinal = getOrdinal(ele)
      console.log(ele)

      const line = [
        `Looking at you from the ${ordinal} floor`,
        `She looks from the ${ordinal} floor`,
        `All the way up to the ${ordinal} floor`
      ][Math.floor(Math.random() * 2)]
      return line
    },
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 1
  },
  {
    template: el => {
      const ele = parseInt(el.tags['building:levels'])
      const num = getNumWord(ele)
      const line = [
        `I count ${num} floors`,
        `${num.charAt(0).toUpperCase() + num.slice(1)} floors high`,
      ][Math.floor(Math.random() * 3)]
      return line
    },
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 3
  },
  {
    template: ['Walking on the zebra', 'White paint on concrete', 'Crossing the road'],
    tags: [['footway', 'crossing'], ['highway', 'crossing']],
  },
  {
    template: 'A hero remembered',
    tags: [['historic', 'memorial'], ['historic', 'monumet']],
  },
  {
    template: ['Green. Red. Green. Red.', 'Traffic light goes red'],
    tags: [['highway', 'traffic_signals']],
  },
  {
    template: ['Onto the highway', 'A truck shifting gears', 'Busy highway', 'Above the freeway noise', 'A passing car'],
    tags: [['highway', 'motorway']],
  },
  {
    template: ['On the bridge with love locks', 'On the other side', 'Of the bridge', 'Over the bridge', 'Under the bridge'],
    tags: [['bridge', 'yes']],
  },
  {
    template: ['A halo in the dark', 'Moths flocking around the light'],
    tags: [['highway', 'street_lamp']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'A train underneath',
    tags: [['subway', 'route']],
  },
  {
    template: ['Buses passing through', 'The bus honking', 'The warm belly of the bus'],
    tags: [['route', 'bus']],
  },
  {
    template: ['Waiting for the bus', 'Finally round the bend', 'Crowded bus'],
    tags: [['highway', 'bus_stop']],
  },
  {
    template: (el) => `A bus arriving at ${el.name}`,
    tags: [['highway', 'bus_stop']],
    needsName: true,
  },
  {
    template: ['The grass is green', 'A walk in the park', 'A bird in the tree'],
    tags: [['leisure', 'park']],
  },
  {
    template: 'Late night stroll',
    tags: [['leisure', 'park']],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['High up in the trees', 'Branches of the tree'],
    tags: [['natural', 'wood'], ['natural', 'tree']],
  },
  {
    template: ['Can you hear the seagulls ?', 'Scent of the sea', 'The sea breeze', 'Tide change', 'Salty air', 'Out to the sea', 'The shades of the sea', 'From the tidal pool', 'The murmur of waves'],
    tags: [['natural', 'coastline']],
  },
  {
    template: ['A vacant lot', 'In this empty place', 'This is a wasteland'],
    tags: [['landuse', 'brownfield']],
  },
  {
    template: ['Rest in peace', 'Forever remember', 'A great sadness', 'The small headstone', 'Cemetary walk', 'Her name on the marble', 'At the funeral'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']]
  },
  {
    template: ['This is spooky', 'Something evil\'s lurking from the dark', 'Thriller night'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: ['A splash of green', 'The grass is always greener', 'Blades of grass', 'A small weed', 'Dry grass', 'Wind in the clover', 'Grows high grass'],
    tags: [['landuse', 'grass']]
  },
  {
    template: ['Noise from the machines', 'Fills up with noise', 'A building will rise', 'Digging and drilling', 'The construction site'],
    tags: [['landuse', 'construction']]
  },
  {
    template: ['I hear the train coming', 'From a passing train', 'On the rail track'],
    tags: [['landuse', 'railway']]
  },
  {
    template: ['Two children', 'Chasing laughter', 'Children playing'],
    tags: [['landuse', 'recreation_ground']]
  },
  {
    template: ['There is electricity in the air', 'A deep buzz'],
    tags: [['power', '*']]
  },
  {
    template: ['There\'s no crossing that fence', 'The broken fence', 'Picket fence'],
    tags: [['barrier', 'fence']]
  },
  {
    template: ['Learn your lesson','The teacher asks the kids', 'On the school wall', 'A student writing', 'By the school gate'],
    tags: [['amenity', 'school']],
  },
  {
    template: ['A car sleeping', 'Rearview mirrors', 'A stalled car', 'That old car', 'An abandoned car', 'Hunting for a parking spot', 'Leaves on the windshield', 'Shiny new cars'],
    tags: [['amenity', 'parking']],
  },
  {
    template: ['Bikes like dead metal animals', 'Locked wheels'],
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: ['On two wheels', 'Speeding on a bike'],
    tags: [['cycleway:right', '*']],
  },
  {
    template: ['Time for contemplation', 'God is here', 'Hear our prayer'],
    tags: [['amenity', 'place_of_worship']],
  },
  {
    template: ['Blue pill or red pill?', 'Watching you with the lab coat', 'Take your medication', 'The meds kick in', 'List of side effects', 'Aspirine please'],
    tags: [['amenity', 'pharmacy']],
  },
  {
    template: ['The hospital\'s cold corridors', 'Ambulances come and go', 'It\'s an emergency', 'A nurse smoking', 'A bubble in the syringe', 'Hospital room', 'A young nurse', 'Lifeline'],
    tags: [['amenity', 'hospital']]
  },
  {
    template: ['Night shift starts'],
    tags: [['amenity', 'hospital']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['I put on my uniform', 'You\'re under arrest', 'Bad cops', 'Good cops', 'To serve and protect'],
    tags: [['amenity', 'police']]
  },
  {
    template: ['Will someone answer the phone?', 'Insert more coins'],
    tags: [['amenity', 'telephone']],
  },
  {
    template: ['A strong gasoline smell', 'Used to be plankton'],
    tags: [['amenity', 'fuel']],
  },
  {
    template: ['Overflowing bin', 'Going to waste', 'A bad smell', 'Flies and maggots'],
    tags: [['amenity', 'waste_basket']],
  },
  {
    template: ['Smells of chlorine', 'Running is forbidden', 'Water\'s warm once you\'re inside', 'Speedos and swimming glasses'],
    tags: [['leisure', 'swimming_pool']],
  },
  {
    template: ['Water under pressure', 'Water gushes out'],
    tags: [['emergency', 'fire_hydrant']],
  },
  {
    template: (el) => `What would ${el.name} think?`,
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: (el) => `${el.name} looks at you`,
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: 'A sculpture so elegant',
    tags: [['artwork_type','sculpture']]
  },
  {
    template: (el) => el.name,
    tags: [['tourism','artwork']]
  },

  {
    template: (el, env) => `Meet at ${el.tags['addr:street']}, ${el.tags['addr:housenumber']}.`,
    condition: (el, env) => el.tags['addr:street'] !== undefined && el.tags['addr:housenumber'] !== undefined
  },
  {
    template: (el) => el.tags['addr:street'],
    condition: (el, env) => el.tags['addr:street'] !== undefined
  },
]
