// https://openweathermap.org/weather-conditions  

const a = ['', 'un ', 'deux ', 'trois ', 'quatre ', 'cinq ', 'six ', 'sept ', 'huit ', 'neuf ', 'dix ', 'onze ', 'douze ', 'treize ', 'quatorze ', 'quinze ', 'seize ', 'dix-sept ', 'dix-huit ', 'dix-neuf ']
const b = ['', '', 'vingt', 'trente', 'quarante', 'conquante', 'soixante', 'septante', 'octante', 'nonante']

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
    template: ['Le monde est grand', 'Perdu dans la ville', 'La vie en flou', 'Penser à la maison', 'Partir de chez soi', 'Je pense à toi', 'Je me rapproche', 'Au loin', 'Cette odeur persistante']
  },
  {
    template: ['La nuit est noire', 'Sous la lune', 'Une nuit sans lune', 'Les étoiles au loin', 'Murmure dans son sommeil', 'Une balade la nuit', 'Fais de beuz rêves'],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Bonjour', 'Le jour qui passe', 'Dans la journée', 'Les jours passent'],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['La journée commence', 'L\'air est encore frais', 'Belle matinée', 'Triste matin'],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: el => [
      `Bienvenue en ${el.name}`,
      `C'est comme ça en ${el.name}`,
      `Encore un jour en ${el.name}`,
      `La vie en ${el.name}`,
      `On se sent bien en ${el.name}`,
      `Aujourd'hui en ${el.name}`,
    ][Math.floor(Math.random() * 6)],
    tags: [['admin_level', '4'], ['admin_level', '5'],  ['admin_level', '6'], ['boundary', 'political']],
    needsName: true
  },
  {
    template: ['Ton reflet', 'L\'eau comme un miroir', 'Ça flotte', 'Eau calme', 'Sur la surface de l\'eau'],
    tags: [['waterway', 'canal'], ['waterway', 'river'], ['natural', 'water'], ['water', 'river']]
  },
  {
    template: ['Morsure du froid', 'On se les gèle', 'Tellement froid'],
    condition: (el, env) => env.temperature < 0,
  },
  {
    template: ['Il fait frais', 'Plutôt froid'],
    condition: (el, env) => env.temperature < 10,
  },
  {
    template: ['Il fait bon ici'],
    condition: (el, env) => env.temperature > 20,
  },
  {
    template: ['Il fait très chaud', 'Une goutte de sueur'],
    condition: (el, env) => env.temperature > 30,
  },
  {
    template: ['Rayon de soleil', 'Le soleil illumine', 'Vers le soleil', 'La lumière du soleil', 'Le soleil tape', 'Le soleil brille'],
    condition: (el, env) => (env.weatherConditions.clear && env.moment !== 'night'),
  },
  {
    template: ['Mouillé jusqu\'à l\'os', 'À mettre un chien dehors', 'La pluie sur la route', 'Pantalon mouillé', 'Il pleut', 'Gouttes de pluie', 'Une sombre pluie'],
    condition: (el, env) => env.weatherConditions.rain || env.weatherConditions.drizzle,
  },
  {
    template: ['Tellement de livres', 'Lire un livre', 'Sur les étagères', 'Pages jaunies', 'Un long paragraphe', 'Un vieux livre'],
    tags: [['amenity','library'], ['shop', 'books']],
  },
  {
    template: ['On baille dans la classe', 'Une journée d\'études commence'],
    condition: (el, env) => env.moment === 'morning',
    tags: [['amenity','university'],['amenity','school']],
  },
  {
    template: ['Les enfants préfereraient jouer dehors', 'Silence dans la classe', 'Un instit déprimé'],
    tags: [['amenity','school']],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['Plus personne n\'envoie de lettres', 'Où vont ces lettres?', 'À l\'attention de', 'Cher toi', 'Une lettre d\'amour'],
    tags: [['amenity','post_box']]
  },
  {
    template: ['Plic ploc', 'Aux toilettes', 'Une chasse d\'eau'],
    tags: [['amenity','toilets']]
  },
  {
    template: 'Le ferry est en retard',
    tags: [['route','ferry']]
  },
  {
    template: ['Un couple demand un prêt', 'Ceci est un hold-up'],
    tags: [['amenity','bank']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['L\'argent n\'a pas d\'odeur', 'Sur le relevé de compte', 'Sur l\'écran du distributeur', 'Plus d\'argent'],
    tags: [['amenity','bank'], ['amenity', 'atm']]
  },
  {
    template: ['L\'agitation du supermarché', 'Salade chou et carottes', 'Le caissier s\'ennuie', 'Un rayon vide', 'Sous les néons', 'Produits frais'],
    tags: [['shop', 'supermarket']]
  },
  {
    template: ['Des vacances méritées', 'Vive les vacances', 'Tous frais inclus'],
    tags: [['shop', 'travel_agency']]
  },
  {
    template: ['Les mannequins te regardent', 'Une robe rouge', 'Une chemise bleue', 'Ma robe d\'été', 'Le tissu sur la peau'],
    tags: [['shop', 'clothes']]
  },
  {
    template: ['Fourchettes et couteaux', 'Besoin d\'assiettes'],
    tags: [['shop', 'houseware']]
  },
  {
    template: ['L\'odeur du pain frais', 'Notre pain quotidien', 'Le boulanger se repose', 'Plus de baguettes', 'Miettes de pain', 'Et avec ceci?', 'Ce sera tout?'],
    tags: [['shop', 'bakery']]
  },
  {
    template: ['Cadavres d\'animaux', 'Mangez moins de viande', 'Les carcasses pendouillent', 'Une scène de crime', 'La mort sans raison c\'est le meurtre', 'Comment les animaux meurent?'],
    tags: [['shop', 'butcher']]
  },
  {
    template: ['Dégagé au dessus des oreilles?', 'Snip snip snip', 'D\'abord le shampoing', 'Juste rafraîchir', 'Juste un peu plus court', 'Instinc\'tif'],
    tags: [['shop', 'hairdresser']]
  },
  {
    template: ['Tomber dans les escaliers', 'Une volée de marches', 'Les marches glissantes', 'Pas à pas'],
    tags: [['highway', 'steps']]
  },
  {
    template: (el, env) => `Café frais de ${el.name}`,
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']],
    condition: (el, env) => env.moment === 'morning',
    needsName: true
  },
  {
    template: (el, env) => [
      `Le fumet de ${el.name} donne faim`,
      `Ventres bien remplis à ${el.name}`,
      `Un casse-croûte à ${el.name}`,
      `Pas trop de monde à ${el.name}`,
    ][Math.floor(Math.random()*4)],
    tags: [['amenity', 'restaurant']],
    needsName: true
  },
  {
    template: ['Tu es ce que tu manges', 'Chaud devant!'],
    tags: [['amenity', 'restaurant']]
  },
  {
    template: ['Besoin d\'un café', 'Ce café sent bon', 'Siroter mon café', 'La tasse encore chaude'],
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']]
  },
  {
    template: ['La bouteille est vide', 'Elle boit', 'Il boit', 'Le serveur arrive', 'Juste un doigt', 'Dans ma bière', 'Petite piquette', 'Je suis saoul'],
    tags: [['amenity', 'bar'], ['amenity', 'pub']]
  },
  {
    template: (el) => `S'ennivrer à ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: (el) => `La bière coule à ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: ['Pizza à l\'ananas ?', 'Je ne mange pas les croûtes', 'Blé tomate et fromage', 'Pepperoni et fromage', 'Souvenir de Naples', 'Une calzone bien chaude'],
    tags: [['cuisine', 'pizza']]
  },
  {
    template: ['Ça sent l\'ail', 'Buon appetito'],
    tags: [['cuisine', 'italian']]
  },
  {
    template: ['Un pain rond au sésame', 'Steak saignant et pain humide', 'Retourner les steaks'],
    tags: [['cuisine', 'burger']]
  },
  {
    template: ['Rouleau de printemps', 'Dim sum', 'Une nouille perdue', 'Un oeuf de cent ans'],
    tags: [['cuisine', 'chinese']]
  },
  {
    template: ['Un plat de sushis', 'Gingembre et wasabi', 'Un peu de saké pour faire passer'],
    tags: [['cuisine', 'japanese']]
  },
  {
    template: ['Brûlants jalapeños', 'Mexico dans mon coeur'],
    tags: [['cuisine', 'mexican']]
  },
  {
    template: ['Souviens-toi Istanbul', 'Délicieux köfte'],
    tags: [['cuisine', 'turkish'], ['cuisine', 'kebab']], 
  },
  {
    template: ['Une chaussure toute sule','Quelles belles bottes'],
    tags: [['shop','shoes']]
  },
  {
    template: 'La chaleur sur les pavés',
    tags: [['surface', 'paving_stones']],
    condition: (el, env) => env.temperature > 20
  },
  {
    template: ['Une audeur de gras', 'Frite trop molle', 'Trop de friture'],
    tags: [['amenity', 'fast_food']]
  },
  {
    template: 'Un âme perdue sur un banc',
    tags: [['amenity', 'bench'], ['bench', 'yes']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Bris de verre',
    tags: [['recycling:glass', 'true']],
  },
  {
    template: 'Metro boulot dodo',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']]
  },
  {
    template: ['On prend le metro?', 'L\'air chaud du metro', 'Il fait beau dans le metro'],
    tags: [['railway', 'subway_entrance']]
  },
  {
    template: 'On va au boulot',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'La queue devant le cinéma',
    tags: [['amenity', 'theatre']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: 'Trop tôt pour une bière?',
    tags: [['amenity', 'pub']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: ['Les touristes dorment déjà'],
    tags: [['tourism', 'hotel']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Derrière la fenêtre de l\'hôtel', 'La réceptionniste', 'Un cafard passe', `Chambre ${Math.floor(Math.random() * 100)}`],
    tags: [['tourism', 'hotel']]
  },
  {
    template: el => `Dans le hall de ${el.name}`,
    tags: [['tourism', 'hotel']],
    needsName: true
  },
  {
    template: ['Amen', 'L\'heure de prier'],
    tags: [['amenity', 'place_of_worship']],
    condition: (el, env) => new Date().getDay() >= 6 && env.moment === 'morning'
  },
  {
    template: ['Dans le garage', 'Paye ton parking'],
    tags: [['building', 'garage']]
  },
  {
    template: ['Un gratte-ciel', 'Un gratte-ciel surplombe la ville', 'Un bâtiment jusq\'au ciel'],
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
    template: ['Sur le passage clouté', 'Peinture blanche sur bitume', 'On traverse la rue'],
    tags: [['footway', 'crossing'], ['highway', 'crossing']],
  },
  {
    template: 'Le souvenir d\'un héros',
    tags: [['historic', 'memorial'], ['historic', 'monumet']],
  },
  {
    template: ['Vert. Rouge. Vert. Rouge.', 'Le feu passe au rouge'],
    tags: [['highway', 'traffic_signals']],
  },
  {
    template: ['Entrer sur l\'autoroute', 'Un camion passe la cinquième', 'Bouchon sur l\'autoroute', 'Au dessus du bruit de l\'autoroute', 'Une voiture fonce'],
    tags: [['highway', 'motorway']],
  },
  {
    template: ['Cadenas de l\'amour', 'De l\'autre côté', 'Du pont', 'Sur le pont', 'Sous le pont'],
    tags: [['bridge', 'yes']],
  },
  {
    template: ['Un halo dans le noir', 'Papillons de nuit'],
    tags: [['highway', 'street_lamp']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Un metro sous le sol',
    tags: [['subway', 'route']],
  },
  {
    template: ['Les bus qui passent', 'Le bus klaxonne', 'Le ventre chaud du bus'],
    tags: [['route', 'bus']],
  },
  {
    template: ['Attendre le bus', 'Enfin le bus', 'Le bus surpeuplé'],
    tags: [['highway', 'bus_stop']],
  },
  {
    template: (el) => `Un bus arriuve à ${el.name}`,
    tags: [['highway', 'bus_stop']],
    needsName: true,
  },
  {
    template: ['L\'herbe est verte', 'Une balade au parc', 'Un oiseau dans l\'arbre'],
    tags: [['leisure', 'park']],
  },
  {
    template: 'Balade nocturne',
    tags: [['leisure', 'park']],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['La haut dans l\'arbre', 'Les branches de l\'arbre'],
    tags: [['natural', 'wood'], ['natural', 'tree']],
  },
  {
    template: ['Entends-tu les mouettes ?', 'L\'odeur de la mer', 'Les embruns', 'La marée monte', 'L\'air est salé', 'Partir en mer', 'Le bleu de l\'océan', 'Le murmure du ressac'],
    tags: [['natural', 'coastline']],
  },
  {
    template: ['Un terrain vague', 'Un endroit vide', 'C\'est à l\'abandon'],
    tags: [['landuse', 'brownfield']],
  },
  {
    template: ['Reste en paix', 'Dans nos mémoires', 'Une grande tristesse', 'Petite pierre tombale', 'Balade au cimetière', 'Son nom sur le marbre', 'Aux funérailles'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']]
  },
  {
    template: ['Angoissant', 'Une présence inquiétante', 'Thriller night'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: ['Une touche de vert', 'L\'herbe est plus verte', 'Brins d\'herbe', 'Une petite plante', 'L\'herbe sèche', 'Le vent dans les trèfles', 'L\'herbe pousse haut'],
    tags: [['landuse', 'grass']]
  },
  {
    template: ['Le bruit des machines', 'Casse les oreilles', 'Un bâtiment se dressera', 'Creuser et creuser', 'En construction'],
    tags: [['landuse', 'construction']]
  },
  {
    template: ['J\'entends le train', 'Du train qui passe', 'Sur la voie de chemin de fer'],
    tags: [['landuse', 'railway']]
  },
  {
    template: ['Deux enfants', 'Rire d\'enfant', 'Les enfants jouent'],
    tags: [['landuse', 'recreation_ground']]
  },
  {
    template: ['De l\'électricté dans l\'air', 'Bruit de tension'],
    tags: [['power', '*']]
  },
  {
    template: ['Franchir la palissade', 'Trou dans la clôture', 'Ne pas franchir'],
    tags: [['barrier', 'fence']]
  },
  {
    template: ['Apprends ta leçon','Question aux élèves', 'Sur le mur de l\'école', 'Un élève écrit', 'Aux portes de l\'école'],
    tags: [['amenity', 'school']],
  },
  {
    template: ['Une voiture dort', 'Le pare-brise', 'Une voiture à l\'arrêt', 'Cette vieille bagnole', 'Une voiture abandonnée', 'À la recherche d\'une place', 'Feuilles sur le pare-brise', 'Voitures rutilantes'],
    tags: [['amenity', 'parking']],
  },
  {
    template: ['Vélos squelettes de métal', 'Antivol sur la roue', 'Une rangée de vélos0', 'Ce vélo n\'a plus de roues'],
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: ['La petite Reine', 'Sur deux roues', 'À fond en vélo'],
    tags: [['cycleway:right', '*']],
  },
  {
    template: ['Temps de recueillement', 'Dieu est ici', 'Entends notre prière'],
    tags: [['amenity', 'place_of_worship']],
  },
  {
    template: ['Pilule rouge ou pilule bleue?', 'Petites boules roses', 'Blouse de pharmacien', 'Prends ton médicament', 'L\'effet du médicament', 'Effets secondaires:', 'Une boîte d\'aspirine'],
    tags: [['amenity', 'pharmacy']],
  },
  {
    template: ['Les couloirs froids de l\'hôpital', 'Va et vient d\'ambulances', 'C\'est une urgence', 'Infirmière pause cigarette', 'Bulle dans la seringue', 'Chambre d\'hôpital', 'Un jeune infirmier', 'Transfusion'],
    tags: [['amenity', 'hospital']]
  },
  {
    template: ['Le tour de nuit commence'],
    tags: [['amenity', 'hospital']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Je mets mon uniforme', 'Vous êtes en état d\'arrestation', 'Bons flics', 'Mauvais flics', 'Servir et protéger'],
    tags: [['amenity', 'police']]
  },
  {
    template: ['Quelqu\'un va t-il décrocher?', 'AAjoutez des pièces'],
    tags: [['amenity', 'telephone']],
  },
  {
    template: ['Odeur d\'essence', 'C\'était du plancton'],
    tags: [['amenity', 'fuel']],
  },
  {
    template: ['Une poubelle qui déborde', 'À la décharge', 'Mauvais éfluves', 'Mouches et asticots'],
    tags: [['amenity', 'waste_basket']],
  },
  {
    template: ['Ça sent le chlore', 'On ne court pas sur les bords', 'Elle est bonne une fois dedans', 'Maillot de bain et lunettes'],
    tags: [['leisure', 'swimming_pool']],
  },
  {
    template: ['Eau sous pression', 'De l\'eau qui coule'],
    tags: [['emergency', 'fire_hydrant']],
  },
  {
    template: (el) => {
      [
        `Que penserait ${el.name}?`,
        `${el.name} te regarde`
      ][Math.floor(Math.random()*2)]
    },
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: 'Une élégante sculpture',
    tags: [['artwork_type','sculpture']]
  },
  {
    template: (el) => el.name,
    tags: [['tourism','artwork']]
  },

  {
    template: (el, env) => `RDV ${el.tags['addr:street']}, ${el.tags['addr:housenumber']}.`,
    condition: (el, env) => el.tags['addr:street'] !== undefined && el.tags['addr:housenumber'] !== undefined
  },
  {
    template: (el) =>
      [
        `Sur ${el.tags['addr:street']}`,
        `Le long de ${el.tags['addr:street']}`,
        `En passant ${el.tags['addr:street']}`,
      ][Math.floor(Math.random()*4)],
    condition: (el) => el.tags['addr:street'] !== undefined
  },
  {
    template: (el) => el.tags['addr:street'],
    condition: (el, env) => el.tags['addr:street'] !== undefined
  },
]
