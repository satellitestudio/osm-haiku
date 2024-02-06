// https://openweathermap.org/weather-conditions  

const a = ['', 'eins ', 'zwei ', 'drei ', 'vier ', 'fünf ', 'sechs ', 'sieben ', 'acht ', 'neun ', 'zehn ', 'elf ', 'zwölf ', 'dreizehn ', 'vierzehn ', 'fünfzehn ', 'sechzehn ', 'siebzehn ', 'achtzehn ', 'neunzehn ']
const b = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig']

const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/

const getNumWord = (num) => {
  if ((num = num.toString()).length > 9) {
    throw new Error('Überlauf') // Unterstützt derzeit nicht die Konvertierung von mehr als 9 Ziffern
  }

  const n = ('000000000' + num).substr(-9).match(regex)
  if (!n) return

  let str = ''
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : ''
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : ''
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Tausend ' : ''
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundert ' : ''
  str += (n[5] != 0) ? ((str != '') ? 'und ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''

  return str.trim()
}

const getOrdinal = (n) => {
  const s = ['th','st','nd','rd']
  const v = n % 100
  return n+(s[(v-20)%10]||s[v]||s[0])
}


window.lines = [  
  {
    template: ['Die Welt ist groß', 'Verloren in der Stadt', 'Das Leben ist verschwommen', 'An Zuhause denken', 'Von zu Hause weggehen', 'Ich denke an dich', 'Ich komme näher', 'In der Ferne', 'Dieser hartnäckige Geruch']
  },
  {
    template: ['Die Nacht ist dunkel', 'Unter dem Mond', 'Eine mondlose Nacht', 'Die Sterne in der Ferne', 'Flüstern im Schlaf', 'Ein Spaziergang in der Nacht', 'Träum süß'],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Guten Tag', 'Der Tag vergeht', 'Am Tag', 'Die Tage vergehen'],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['Der Tag beginnt', 'Die Luft ist noch frisch', 'Schöner Morgen', 'Trauriger Morgen'],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: el => [
      `Willkommen in ${el.name}`,
      `So ist das Leben in ${el.name}`,
      `Ein weiterer Tag in ${el.name}`,
      `Das Leben in ${el.name}`,
      `Es fühlt sich gut an in ${el.name}`,
      `Heute in ${el.name}`,
    ][Math.floor(Math.random() * 6)],
    tags: [['admin_level', '4'], ['admin_level', '5'],  ['admin_level', '6'], ['boundary', 'political']],
    needsName: true
  },
 {
    template: ['Dein Spiegelbild', 'Wasser wie ein Spiegel', 'Es schwimmt', 'Ruhiges Wasser', 'Auf der Wasseroberfläche'],
    tags: [['waterway', 'canal'], ['waterway', 'river'], ['natural', 'water'], ['water', 'river']]
  },
  {
    template: ['Der Biss der Kälte', 'Es ist eiskalt', 'So kalt'],
    condition: (el, env) => env.temperature < 0,
  },
  {
    template: ['Es ist kühl', 'Ziemlich kalt'],
    condition: (el, env) => env.temperature < 10,
  },
  {
    template: ['Es ist hier angenehm'],
    condition: (el, env) => env.temperature > 20,
  },
  {
    template: ['Es ist sehr heiß', 'Ein Tropfen Schweiß'],
    condition: (el, env) => env.temperature > 30,
  },
  {
    template: ['Sonnenstrahl', 'Die Sonne erleuchtet', 'Richtung Sonne', 'Das Sonnenlicht', 'Die Sonne brennt', 'Die Sonne scheint'],
    condition: (el, env) => (env.weatherConditions.clear && env.moment !== 'night'),
  },
  {
    template: ['Bis auf die Knochen nass', 'Es ist hunde kalt', 'Regen auf der Straße', 'Nasse Hose', 'Es regnet', 'Regentropfen', 'Ein düsterer Regen'],
    condition: (el, env) => env.weatherConditions.rain || env.weatherConditions.drizzle,
  },
  {
template: ['So viele Bücher', 'Ein Buch lesen', 'Auf den Regalen', 'Vergilbte Seiten', 'Ein langer Absatz', 'Ein altes Buch'],
tags: [['amenity','library'], ['shop', 'books']],
},
{
template: ['Im Klassenzimmer gähnen', 'Ein Tag des Lernens beginnt'],
condition: (el, env) => env.moment === 'morning',
tags: [['amenity','university'],['amenity','school']],
},
{
template: ['Die Kinder würden lieber draußen spielen', 'Stille im Klassenzimmer', 'Ein deprimierter Lehrer'],
tags: [['amenity','school']],
condition: (el, env) => env.moment === 'afternoon',
},
{
template: ['Niemand schickt mehr Briefe', 'Wohin gehen diese Briefe?', 'An', 'Liebe Grüße', 'Ein Liebesbrief'],
tags: [['amenity','post_box']]
},
{
template: ['Plic ploc', 'Auf der Toilette', 'Ein Spülkasten'],
tags: [['amenity','toilets']]
},
{
template: 'Die Fähre ist verspätet',
tags: [['route','ferry']]
},
  {
template: ['Ein Paar beantragt ein Darlehen', 'Dies ist ein Überfall'],
tags: [['amenity','bank']],
condition: (el, env) => env.moment === 'morning',
},
{
template: ['Geld hat keinen Geruch', 'Auf dem Kontoauszug', 'Auf dem Bildschirm des Geldautomaten', 'Kein Geld mehr'],
tags: [['amenity','bank'], ['amenity', 'atm']]
},
{
template: ['Die Aufregung im Supermarkt', 'Kohl- und Karottensalat', 'Der Kassierer langweilt sich', 'Ein leeres Regal', 'Unter den Neonlichtern', 'Frische Produkte'],
tags: [['shop', 'supermarket']]
},
{
template: ['Verdiente Ferien', 'Es lebe der Urlaub', 'Alles inklusive'],
tags: [['shop', 'travel_agency']]
},
{
template: ['Die Mannequins schauen dich an', 'Ein rotes Kleid', 'Ein blaues Hemd', 'Mein Sommerkleid', 'Der Stoff auf der Haut'],
tags: [['shop', 'clothes']]
},
{
template: ['Gabeln und Messer', 'Teller benötigt'],
tags: [['shop', 'houseware']]
},
{
template: ['Der Duft von frischem Brot', 'Unser tägliches Brot', 'Der Bäcker ruht sich aus', 'Keine Baguettes mehr', 'Brotkrumen', 'Und damit?', 'Ist das alles?'],
tags: [['shop', 'bakery']]
},
{
    template: ['Kadaver von Tieren', 'Essen Sie weniger Fleisch', 'Die Kadaver hängen', 'Eine Tatort-Szene', 'Der sinnlose Tod ist Mord', 'Wie sterben Tiere?'],
    tags: [['shop', 'butcher']]
  },
  {
    template: ['Frei über den Ohren?', 'Schnipp Schnipp Schnipp', 'Zuerst das Shampoo', 'Nur auffrischen', 'Nur ein bisschen kürzer', 'Instinktiv'],
    tags: [['shop', 'hairdresser']]
  },
  {
    template: ['Die Treppe hinunterfallen', 'Eine Treppe hinunter', 'Die Stufen sind rutschig', 'Schritt für Schritt'],
    tags: [['highway', 'steps']]
  },
  {
    template: (el, env) => `Frischer Kaffee von ${el.name}`,
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']],
    condition: (el, env) => env.moment === 'morning',
    needsName: true
  },
  {
    template: (el, env) => [
      `Der Duft von ${el.name} macht hungrig`,
      `Sättige deine Bäuche bei ${el.name}`,
      `Ein Snack bei ${el.name}`,
      `Nicht zu viele Leute bei ${el.name}`,
    ][Math.floor(Math.random()*4)],
    tags: [['amenity', 'restaurant']],
    needsName: true
  },
  {
    template: ['Du bist, was du isst', 'Heiß hier!'],
    tags: [['amenity', 'restaurant']]
  },
  {
    template: ['Brauche einen Kaffee', 'Dieser Kaffee riecht gut', 'Meinen Kaffee schlürfen', 'Die Tasse ist noch warm'],
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']]
  },
  {
    template: ['Die Flasche ist leer', 'Sie trinkt', 'Er trinkt', 'Der Kellner kommt', 'Nur ein Schluck', 'In meinem Bier', 'Ein kleiner Wein', 'Ich bin betrunken'],
    tags: [['amenity', 'bar'], ['amenity', 'pub']]
  },
  {
    template: (el) => `Rausch bei ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: (el) => `Das Bier fließt bei ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: ['Ananas-Pizza?', 'Ich esse die Kruste nicht', 'Weizen, Tomate und Käse', 'Pepperoni und Käse', 'Erinnerung an Neapel', 'Eine richtig heiße Calzone'],
    tags: [['cuisine', 'pizza']]
  },
{
    template: ['Es riecht nach Knoblauch', 'Buon appetito'],
    tags: [['cuisine', 'italian']]
  },
  {
    template: ['Ein rundes Sesambrötchen', 'Blutiges Steak und feuchtes Brot', 'Die Steaks wenden'],
    tags: [['cuisine', 'burger']]
  },
  {
    template: ['Frühlingsrolle', 'Dim Sum', 'Eine verlorene Nudel', 'Ein hundert Jahre altes Ei'],
    tags: [['cuisine', 'chinese']]
  },
  {
    template: ['Ein Teller Sushi', 'Ingwer und Wasabi', 'Ein wenig Sake zum Herunterspülen'],
    tags: [['cuisine', 'japanese']]
  },
  {
    template: ['Brennende Jalapeños', 'Mexiko in meinem Herzen'],
    tags: [['cuisine', 'mexican']]
  },
  {
    template: ['Erinnere dich an Istanbul', 'Leckere Köfte'],
    tags: [['cuisine', 'turkish'], ['cuisine', 'kebab']], 
  },
  {
    template: ['Ein einzelner Schuh','Welch schöne Stiefel'],
    tags: [['shop','shoes']]
  },
  {
    template: 'Die Hitze auf den Pflastersteinen',
    tags: [['surface', 'paving_stones']],
    condition: (el, env) => env.temperature > 20
  },
  {
    template: ['Ein Geruch von Fett', 'Zu weiche Pommes', 'Zu viel Frittiertes'],
    tags: [['amenity', 'fast_food']]
  },
  {
    template: 'Eine verlorene Seele auf einer Bank',
    tags: [['amenity', 'bench'], ['bench', 'yes']],
    condition: (el, env) => env.moment === 'night'
  },
{
    template: 'Glasbruch',
    tags: [['recycling:glass', 'true']],
  },
  {
    template: 'Metro Arbeit Schlaf',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']]
  },
  {
    template: ['Nehmen wir die U-Bahn?', 'Die warme Luft in der U-Bahn', 'Es ist schön in der U-Bahn'],
    tags: [['railway', 'subway_entrance']]
  },
  {
    template: 'Gehen wir zur Arbeit',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'Die Schlange vor dem Kino',
    tags: [['amenity', 'theatre']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: 'Zu früh für ein Bier?',
    tags: [['amenity', 'pub']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: ['Die Touristen schlafen schon'],
    tags: [['tourism', 'hotel']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Hinter dem Hotelzimmerfenster', 'Die Rezeptionistin', 'Ein Käfer flitzt vorbei', `Zimmer ${Math.floor(Math.random() * 100)}`],
    tags: [['tourism', 'hotel']]
  },
  {
    template: el => `In der Lobby von ${el.name}`,
    tags: [['tourism', 'hotel']],
    needsName: true
  },
  {
    template: ['Amen', 'Gebetszeit'],
    tags: [['amenity', 'place_of_worship']],
    condition: (el, env) => new Date().getDay() >= 6 && env.moment === 'morning'
  },
  {
    template: ['In der Garage', 'Bezahl dein Parken'],
    tags: [['building', 'garage']]
  },
  {
    template: ['Ein Wolkenkratzer', 'Ein Wolkenkratzer überragt die Stadt', 'Ein Gebäude bis zum Himmel'],
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 20
  },

  // {
  //   template: el => {
  //     const ele = parseInt(el.tags['building:levels'])
      
  //     const ordinal = getOrdinal(ele)
  //     console.log(ele)

  //     const line = [
  //       `Looking at you from the ${ordinal} floor`,
  //       `She looks from the ${ordinal} floor`,
  //       `All the way up to the ${ordinal} floor`
  //     ][Math.floor(Math.random() * 3)]
  //     return line
  //   },
  //   tags: [['building:levels', '*']],
  //   condition: (el) => parseInt(el.tags['building:levels']) >= 1
  // },
  // {
  //   template: el => {
  //     const ele = parseInt(el.tags['building:levels'])
  //     const num = getNumWord(ele)
  //     const line = [
  //       `I count ${num} floors`,
  //       `A ${num} floors building`,
  //       `${num.charAt(0).toUpperCase() + num.slice(1)} floors high`,
  //     ][Math.floor(Math.random() * 3)]
  //     return line
  //   },
  //   tags: [['building:levels', '*']],
  //   condition: (el) => parseInt(el.tags['building:levels']) >= 3
  // },
  {
    template: ['Auf dem Zebrastreifen', 'Weiße Farbe auf dem Asphalt', 'Wir überqueren die Straße'],
    tags: [['footway', 'crossing'], ['highway', 'crossing']],
  },
  {
    template: 'Die Erinnerung an einen Helden',
    tags: [['historic', 'memorial'], ['historic', 'monument']],
  },
  {
    template: ['Grün. Rot. Grün. Rot.', 'Die Ampel wird rot'],
    tags: [['highway', 'traffic_signals']],
  },
  {
    template: ['Auf die Autobahn auffahren', 'Ein Lastwagen schaltet in den fünften Gang', 'Stau auf der Autobahn', 'Über dem Autobahnlärm', 'Ein Auto rast'],
    tags: [['highway', 'motorway']],
  },
  {
    template: ['Liebesschlösser', 'Auf der anderen Seite', 'Vom Brücke', 'Auf der Brücke', 'Unter der Brücke'],
    tags: [['bridge', 'yes']],
  },
  {
    template: ['Ein Halo im Dunkeln', 'Nachtfalter'],
    tags: [['highway', 'street_lamp']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Eine U-Bahn unter der Erde',
    tags: [['subway', 'route']],
  },
  {
    template: ['Die vorbeifahrenden Busse', 'Der Bus hupt', 'Die warme Busluft'],
    tags: [['route', 'bus']],
  },
  {
    template: ['Auf den Bus warten', 'Endlich der Bus', 'Der überfüllte Bus'],
    tags: [['highway', 'bus_stop']],
  },
  {
    template: (el) => `Ein Bus kommt an ${el.name} an`,
    tags: [['highway', 'bus_stop']],
    needsName: true,
  },
  {
    template: ['Das Gras ist grün', 'Ein Spaziergang im Park', 'Ein Vogel im Baum'],
    tags: [['leisure', 'park']],
  },
  {
    template: 'Nachtspaziergang',
    tags: [['leisure', 'park']],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Oben im Baum', 'Die Äste des Baumes'],
    tags: [['natural', 'wood'], ['natural', 'tree']],
  },
  {
    template: ['Hörst du die Möwen?', 'Der Geruch des Meeres', 'Die Gischt', 'Die Flut steigt', 'Die Luft ist salzig', 'Aufs Meer hinaus', 'Das Blau des Ozeans', 'Das Murmeln der Brandung'],
    tags: [['natural', 'coastline']],
  },
  {
    template: ['Ein Brachland', 'Ein leerer Ort', 'Es ist verlassen'],
    tags: [['landuse', 'brownfield']],
  },
  {
    template: ['Ruhe in Frieden', 'In unseren Erinnerungen', 'Eine große Traurigkeit', 'Kleines Grabmal', 'Spaziergang auf dem Friedhof', 'Sein Name auf dem Marmor', 'Bei der Beerdigung'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']]
  },
  {
    template: ['Beunruhigend', 'Eine beunruhigende Präsenz', 'Thriller-Nacht'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: ['Ein Hauch von Grün', 'Das Gras ist grüner', 'Grashalme', 'Eine kleine Pflanze', 'Das Gras trocknet', 'Der Wind in den Kleeblättern', 'Das Gras wächst hoch'],
    tags: [['landuse', 'grass']]
  },
{
    template: ['Der Klang der Maschinen', 'Ohrenbetäubend', 'Ein Gebäude wird entstehen', 'Grab und grab', 'In Bau'],
    tags: [['landuse', 'construction']]
  },
  {
    template: ['Ich höre den Zug', 'Der vorbeifahrende Zug', 'Auf den Bahngleisen'],
    tags: [['landuse', 'railway']]
  },
  {
    template: ['Zwei Kinder', 'Kinderlachen', 'Die Kinder spielen'],
    tags: [['landuse', 'recreation_ground']]
  },
  {
    template: ['Elektrizität in der Luft', 'Spannungsgeräusche'],
    tags: [['power', '*']]
  },
  {
    template: ['Über den Zaun klettern', 'Loch im Zaun', 'Nicht betreten'],
    tags: [['barrier', 'fence']]
  },
  {
    template: ['Lerne deine Lektion', 'Fragen an die Schüler', 'An der Schulwand', 'Ein Schüler schreibt', 'Vor den Toren der Schule'],
    tags: [['amenity', 'school']],
  },
  {
    template: ['Ein Auto schläft', 'Die Windschutzscheibe', 'Ein stehendes Auto', 'Dieses alte Auto', 'Ein verlassenes Auto', 'Auf der Suche nach einem Parkplatz', 'Blätter auf der Windschutzscheibe', 'Funkelnde Autos'],
    tags: [['amenity', 'parking']],
  },
  {
    template: ['Fahrrad-Skelette aus Metall', 'Fahrradschloss am Rad', 'Eine Reihe von Fahrrädern', 'Dieses Fahrrad hat keine Räder mehr'],
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: ['Die kleine Königin', 'Auf zwei Rädern', 'Vollgas auf dem Fahrrad'],
    tags: [['cycleway:right', '*']],
  },
  {
    template: ['Zeit zum Nachdenken', 'Gott ist hier', 'Höre unser Gebet'],
    tags: [['amenity', 'place_of_worship']],
  },
  {
    template: ['Rote Pille oder blaue Pille?', 'Kleine rosa Pillen', 'Apotheker-Kittel', 'Nimm deine Medizin', 'Die Wirkung des Medikaments', 'Nebenwirkungen:', 'Eine Schachtel Aspirin'],
    tags: [['amenity', 'pharmacy']],
  },
  {
    template: ['Die kalten Gänge des Krankenhauses', 'Kommen und Gehen von Krankenwagen', 'Es ist ein Notfall', 'Krankenschwester raucht Pause', 'Blase in der Spritze', 'Krankenzimmer', 'Ein junger Krankenpfleger', 'Bluttransfusion'],
    tags: [['amenity', 'hospital']]
  },
  {
    template: ['Die Nachtschicht beginnt'],
    tags: [['amenity', 'hospital']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Ich ziehe meine Uniform an', 'Sie sind in Haft', 'Gute Polizisten', 'Schlechte Polizisten', 'Dienen und schützen'],
    tags: [['amenity', 'police']]
  },
  {
    template: ['Wird jemand abheben?', 'Füge Münzen hinzu'],
    tags: [['amenity', 'telephone']],
  },
  {
    template: ['Geruch von Benzin', 'Es war Plankton'],
    tags: [['amenity', 'fuel']],
  },
  {
    template: ['Ein überquellender Mülleimer', 'Auf der Mülldeponie', 'Schlechte Gerüche', 'Fliegen und Maden'],
    tags: [['amenity', 'waste_basket']],
  },
  {
    template: ['Es riecht nach Chlor', 'Lauf nicht am Beckenrand', 'Es ist gut, wenn man drin ist', 'Badeanzug und Brille'],
    tags: [['leisure', 'swimming_pool']],
  },
  {
    template: ['Wasser unter Druck', 'Fließendes Wasser'],
    tags: [['emergency', 'fire_hydrant']],
  },
  {
    template: (el) => {
      [
        `Was würde ${el.name} denken?`,
        `${el.name} schaut dich an`
      ][Math.floor(Math.random()*2)];
    },
    tags: [['historic', 'memorial']],
    needsName: true
  },

  
 {
    template: ['Ein elegantes Kunstwerk'],
    tags: [['artwork_type','sculpture']]
  },
  {
    template: (el) => el.name,
    tags: [['tourism','artwork']]
  },

  {
    template: (el, env) => `Treffen in ${el.tags['addr:street']}, ${el.tags['addr:housenumber']}.`,
    condition: (el, env) => el.tags['addr:street'] !== undefined && el.tags['addr:housenumber'] !== undefined
  },
  {
    template: (el) =>
      [
        `Auf ${el.tags['addr:street']}`,
        `Entlang von ${el.tags['addr:street']}`,
        `Vorbei an ${el.tags['addr:street']}`,
      ][Math.floor(Math.random()*4)],
    condition: (el) => el.tags['addr:street'] !== undefined
  },
  {
    template: (el) => el.tags['addr:street'],
    condition: (el, env) => el.tags['addr:street'] !== undefined
  },
]
