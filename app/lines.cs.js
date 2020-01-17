// https://openweathermap.org/weather-conditions  

const a = ['', 'jeden ', 'dva ', 'tři ', 'čtyři ', 'pět ', 'šest ', 'sedm ', 'osm ', 'devět ', 'deset ', 'jedenáct ', 'dvanáct ', 'třináct ', 'čtrnáct ', 'patnáct ', 'šestnáct ', 'sedmnáct ', 'osmnáct ', 'devatenáct ']
const b = ['', '', 'dvacet', 'třicet', 'čtyřicet', 'padesát', 'šedesát', 'sedmdesát', 'osmdesát', 'devadesát']

const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/

const getNumWord = (num) => {
  if ((num = num.toString()).length > 9) {
    throw new Error('overflow') // Does not support converting more than 9 digits yet
  }

  const n = ('000000000' + num).substr(-9).match(regex)
  if (!n) return

  let str = ''
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'desítek milionů ' : ''
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'milion ' : ''
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'tisíc ' : ''
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'set ' : ''
  str += (n[5] != 0) ? ((str != '') ? 'a ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''

  return str.trim()
}

const getMoment = (moment) => {
  switch (moment) {
    case 'morning':
      return 'ráno'
    case 'afternoon':
      return 'odpoledne'
    case 'night':
      return 'noc'
  }
}

const getOrdinal = (n, number='si', person='ma', tense=1) => {
  const bases = ['nult', 'první', 'dru', 'třetí', 'čtvrt', 'pát', 'šest', 'sedm', 'osm', 'devát', 'desát', 'jedenáct', 'dvanáct', 'třináct', 'čtrnáct', 'patnáct', 'šestnáct', 'sedmnáct', 'osmnáct', 'devatenáct']
  const si_ma = ['ý', 'ého', 'ému', 'ého', 'ý', 'ém', 'ým'] // singular, male animate
  const si_mi = ['ý', 'ého', 'ému', 'ý', 'ý', 'ém', 'ým']   // singular, male inanimate
  const si_f  = ['á', 'é', 'é', 'ou', 'é', 'ém', 'ým']      // singular, female
  const si_i  = ['é', 'ého', 'ému', 'é', 'é', 'ém', 'ým']   // singular, inanimate
  const pl_ma = ['í', 'ých', 'ým', 'é', 'í', 'ých', 'ými']  // plural, male animate
  const pl_mi = ['é', 'ých', 'ým', 'é', 'é', 'ých', 'ými']  // plural, male inanimate
  const pl_f  = ['é', 'ých', 'ým', 'é', 'é', 'ých', 'ými']  // plural, female
  const pl_i  = ['á', 'ých', 'ým', 'á', 'á', 'ých', 'ým']   // plural, inanimate
  const si_ma_1 = ['', 'ho', 'mu', 'ho', '', 'm', 'm']      // singular, male animate, 1
  const si_i_1  = ['', 'ho', 'mu', '', '', 'm', 'm']        // singular, all inanimate, 1
  const pl_1    = ['', 'ch', 'm', '', '', 'ch', 'ími']      // all plurals, 1
  const si_ma_3 = ['', 'ho', 'mu', 'ho', '', 'm', 'm']      // singular, male animate, 3
  const si_i_3  = ['', 'ho', 'mu', '', '', 'm', 'm']        // singular, all inanimate, 3
  const pl_3    = ['', 'ch', 'm', '', '', 'ch', 'mi']       // all plurals, 3

  if (n >= 20) return n + '.'
  
  tense -= 1 // zero-based arrays
  str = bases[n]
  switch (n) {
    case 1:
      if (number == 'si' && person == 'ma') str += si_ma_1[tense]
      if (number == 'si' && (person == 'mi' || person == 'i')) str += si_i_1[tense]
      if (number == 'pl') str += pl_1[tense]
      break
    case 3:
      if (number == 'si' && person == 'ma') str += si_ma_3[tense]
      if (number == 'si' && (person == 'mi' || person == 'i')) str += si_i_3[tense]
      if (number == 'pl') str += pl_3[tense]
      break
    default:
      if (number == 'si' && person == 'ma') str += si_ma[tense]
      if (number == 'si' && person == 'mi') str += si_mi[tense]
      if (number == 'si' && person == 'f')  str += si_f[tense]
      if (number == 'si' && person == 'i')  str += si_i[tense]
      if (number == 'pl' && person == 'ma') str += pl_ma[tense]
      if (number == 'pl' && person == 'mi') str += pl_mi[tense]
      if (number == 'pl' && person == 'f')  str += pl_f[tense]
      if (number == 'pl' && person == 'i')  str += pl_i[tense]
  }
  // exceptions
  if (number == 'pl' && person == 'ma' && (tense == 1 || tense == 5)) str = bases[n] + 'zí'
  return str
}


window.lines = [  
  {
    template: ['Svět je velký', 'Ztracen ve městě', 'Myšlenky na domov', 'Myslím na domov', 'Opouštím dům', 'Myšlenky na tebe', 'Blížím se', 'Velmi daleko']
  },
  {
    template: ['Noc je temná', 'Pod měsíčním svitem', 'Temná noc', 'Hvězdy v dálce', 'Mumlání ze spánku', 'Noční procházka', 'Sladké sny'],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Dobré odpoledne', 'Den ubíhá', 'Veprostřed dne', 'Po poledni'],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['Den je čerstvý', 'Vzduch ještě mrazivý', 'Dobré ráno', 'Smutné ráno'],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: el => [
      `Vítejte: ${el.name}`,
      `A tak to už je: ${el.name}`,
      `${el.name}: další den`,
      `Život, ${el.name}...`,
      `${el.name}; já se cítím dobře`,
      `Dnes. ${el.name}.`,
    ][Math.floor(Math.random() * 6)],
    tags: [['admin_level', '4'], ['admin_level', '5'],  ['admin_level', '6'], ['boundary', 'political']],
    needsName: true
  },
  {
    template: ['Tvůj odraz', 'Voda jako zrcadlo', 'Jen tak pluje', 'Tichá voda', 'Na vodní hladině'],
    tags: [['waterway', 'canal'], ['waterway', 'river'], ['natural', 'water'], ['water', 'river']]
  },
  {
    template: ['Mrazivo', 'Mrzne', 'Taková zima'],
    condition: (el, env) => env.temperature < 0,
  },
  {
    template: ['Mráz štípe', 'Celkem chladno'],
    condition: (el, env) => env.temperature < 10,
  },
  {
    template: ['Je tu celkem teplo'],
    condition: (el, env) => env.temperature > 20,
  },
  {
    template: ['Je tu dost teplo.', 'Kapka potu'],
    condition: (el, env) => env.temperature > 30,
  },
  {
    template: ['Sluneční paprsky', 'Paprsky všude', 'Do slunce', 'Sluneční paprsek', 'Se slunečním svitem', 'Slunce září', 'Slunce svítí'],
    condition: (el, env) => (env.weatherConditions.clear && env.moment !== 'night'),
  },
  {
    template: ['Promoklý na kost', 'Promoklá na kost', 'Silnice lesklá vodou', 'Promočené kalhoty', 'Prší', 'Padají kapky', 'Temný déšť'],
    condition: (el, env) => env.weatherConditions.rain || env.weatherConditions.drizzle,
  },
  {
    template: ['Tolik knih', 'Volné listy', 'Na policích', 'Zežloutlé stránky', 'Rozmazaný odstavec', 'Stará kniha'],
    tags: [['amenity','library'], ['shop', 'books']],
  },
  {
    template: ['Zívání ve třídě', 'Už se učí', 'Začala škola'],
    tags: [['amenity','university'],['amenity','school']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['Ty děti by raději byly venku', 'Další učitel v depresi'],
    tags: [['amenity','school']],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['Nikdo už dopisy neposílá', 'Ke komu ty dopisy putují?', 'Drahý', 'Drahá', 'Milostné psaní'],
    tags: [['amenity','post_box']]
  },
  {
    template: ['Čůrání', 'Chtěl bych čůrat', 'Chtěla bych čůrat', 'Splachující záchod'],
    tags: [['amenity','toilets']]
  },
  {
    template: 'Převoz má zase zpoždění',
    tags: [['route','ferry']]
  },
  {
    template: ['Pár si bere půjčku', 'Potřebují hypotéku'],
    tags: [['amenity','bank']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['Vůně peněz', 'Bankovní výpis', 'Výběrní automat', 'Nezbývá hotovost'],
    tags: [['amenity','bank'], ['amenity', 'atm']]
  },
  {
    template: ['Samoobsluha', 'Salát, rajčata, okurku', 'Pokladní se nudí', 'Došlo pečivo', 'Padesát devět devadesát', 'Vše čerstvé'],
    tags: [['shop', 'supermarket']]
  },
  {
    template: ['Zasloužená dovolená', 'Plánujeme výlet', 'Plná penze'],
    tags: [['shop', 'travel_agency']]
  },
  {
    template: ['Figuríny přes výlohu koukají do ulice', 'Rudé šaty', 'Modrá košile', 'Mé letní šaty', 'Látka na kůži'],
    tags: [['shop', 'clothes']]
  },
  {
    template: ['Kuchyňské potřeby', 'Potřebujeme nové nože'],
    tags: [['shop', 'houseware']]
  },
  {
    template: ['Vůně čerstvého chleba', 'Náš denní chléb', 'Pekař odpočívá', 'Chléb už nezbyl', 'Drobečky'],
    tags: [['shop', 'bakery']]
  },
  {
    template: ['Mrtvá zvířata', 'Maso je vražda', 'Visící háky', 'Krvavá scéna', 'Jitrnice a tlačenka', 'Poprosím půl kila'],
    tags: [['shop', 'butcher']]
  },
  {
    template: ['Kolem uší zkrátit?', 'Šmik šmik šmik', 'Začne se šamponem', 'Ještě to malinko upravíme', 'Jen trochu zkrátit', 'Fén hoří'],
    tags: [['shop', 'hairdresser']]
  },
  {
    template: ['Nespadni ze schodů', 'Bolí nohy', 'Schody se kloužou', 'Krok po kroku'],
    tags: [['highway', 'steps']]
  },
  {
    template: (el, env) => `Čerstvá káva? ${el.name}`,
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']],
    condition: (el, env) => env.moment === 'morning',
    needsName: true
  },
  {
    template: (el, env) => [
      `${el.name} a hned máme plná břicha`,
      `Jen na chvilku, ${el.name}, ${getMoment(env.moment)}?`,
      `${el.name}, dnes tu moc lidí není`,
    ][Math.floor(Math.random()*4)],
    tags: [['amenity', 'restaurant']],
    needsName: true
  },
  {
    template: ['Jste to, co jíte', 'Ještě je to horké'],
    tags: [['amenity', 'restaurant']]
  },
  {
    template: ['Potřebuji kávu', 'Ta káva voní dobře', 'Usrkává svou kávu', 'Stejný hrníček', 'Hrnek je pořád teplý'],
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']]
  },
  {
    template: ['Lahev je prádná', 'Napila se', 'Číšnice pracuje', 'Whiskey pálí', 'Velkou slivovici', 'V mém pivu', 'Suché víno', 'Opil jsem se', 'Opila jsem se'],
    tags: [['amenity', 'bar'], ['amenity', 'pub']]
  },
  {
    template: (el) => `${el.name}. Opíjíme se.`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: (el) => `${el.name}: pivo proudí`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: ['Ananas na pizzu?', 'Okraje z pizzy nejím', 'Hodně sýra', 'Se salámem a papričkami', 'Půlku bez oliv', 'Prosím tu nejpálivější.'],
    tags: [['cuisine', 'pizza']]
  },
  {
    template: ['Vůně česneku', 'Buon appetito'],
    tags: [['cuisine', 'italian']]
  },
  {
    template: ['Houska, maso, salát', 'Mastné hamburgery', 'Ohřívá maso'],
    tags: [['cuisine', 'burger']]
  },
  {
    template: ['Závitek', 'Dim sum', 'Poslední nudle', 'Století staré vejce'],
    tags: [['cuisine', 'chinese']]
  },
  {
    template: ['Nabídka sushi', 'Zázvor a wasabi', 'Saké'],
    tags: [['cuisine', 'japanese']]
  },
  {
    template: ['Pálivé jalapeños', 'V mém srdci je Mexiko'],
    tags: [['cuisine', 'mexican']]
  },
  {
    template: ['Vzpomínky na Istambul', 'Skvělý kebab'],
    tags: [['cuisine', 'turkish'], ['cuisine', 'kebab']], 
  },
  {
    template: ['Osamělá bota','Ty boty jsou moc malé'],
    tags: [['shop','shoes']]
  },
  {
    template: 'Z dlažby sálá teplo',
    tags: [['surface', 'paving_stones']],
    condition: (el, env) => env.temperature > 20
  },
  {
    template: ['Vůně oleje ve vzduchu', 'Smutné, vychladlé hranolky', 'Přepálený tuk'],
    tags: [['amenity', 'fast_food']]
  },
  {
    template: 'Smutná duše na lavičce',
    tags: [['amenity', 'bench'], ['bench', 'yes']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Rozbité sklo',
    tags: [['recycling:glass', 'true']],
  },
  {
    template: 'Jedu zpátky domů',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']]
  },
  {
    template: ['Pojedeme metrem?', 'Z podzemí fouká teplý vzduch'],
    tags: [['railway', 'subway_entrance']]
  },
  {
    template: 'Jedu do práce',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: 'Večerní představení',
    tags: [['amenity', 'theatre']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: 'Je na pivo moc brzo?',
    tags: [['amenity', 'pub']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: ['Turisté už spí'],
    tags: [['tourism', 'hotel']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Proti hotelovým oknům', 'Recepční', 'Není to plíseň?', `Pokoj ${Math.floor(Math.random() * 30)}`],
    tags: [['tourism', 'hotel']]
  },
  {
    template: el => `${el.name}, na recepci.`,
    tags: [['tourism', 'hotel']],
    needsName: true
  },
  {
    template: ['Buď pochválen', 'Modleme se'],
    tags: [['amenity', 'place_of_worship']],
    condition: (el, env) => new Date().getDay() >= 6 && env.moment === 'morning'
  },
  {
    template: ['V garáži', 'Vůně benzínu a oleje'],
    tags: [['building', 'garage']]
  },
  {
    template: ['Mrakodrap', 'Věže mrakodrapů nad městem', 'Až nad mraky'],
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 20
  },
  {
    template: el => {
      const ele = Math.floor(Math.random() * parseInt(el.tags['building:levels']-1)+1)
      
      const ord2 = getOrdinal(ele, 'si', 'i', 2)
      const ord4 = getOrdinal(ele, 'si', 'i', 4)
      console.log(ele)

      const line = [
        `Vidím tě z ${ord2} poschodí`,
        `Kouká se z ${ord2} patra`,
        `Až na ${ord4} poschodí`
      ][Math.floor(Math.random() * 3) + 1]
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
        `Vidím ${num} poschodí`,
        `${num.charAt(0).toUpperCase() + num.slice(1)} poschodí`,
      ][Math.floor(Math.random() * 3)]
      return line
    },
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 3
  },
  {
    template: ['Přecházím silnici', 'Bílá barva na asfaltu', 'Bílé pruhy'],
    tags: [['footway', 'crossing'], ['highway', 'crossing']],
  },
  {
    template: 'Vzpomínky hrdiny',
    tags: [['historic', 'memorial'], ['historic', 'monumet']],
  },
  {
    template: ['Zelená. Červená. Oranžová.', 'Semafor se zbarvil do červena'],
    tags: [['highway', 'traffic_signals']],
  },
  {
    template: ['Na dálnici', 'Nákladní auto řadí', 'Rušná dálnice', 'Hluk motorů', 'Projíždí auto'],
    tags: [['highway', 'motorway']],
  },
  {
    template: ['Na mostu se zámky lásky', 'Na druhé straně', 'Na mostu', 'Za mostem', 'Pod mostem'],
    tags: [['bridge', 'yes']],
  },
  {
    template: ['Světlo ve tmě', 'Kolem světla poletuje hmyz'],
    tags: [['highway', 'street_lamp']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Vlak pod zemí',
    tags: [['subway', 'route']],
  },
  {
    template: ['Projíždějící autobusy', 'Autobus zatroubil', 'Kam jedete?'],
    tags: [['route', 'bus']],
  },
  {
    template: ['Čekání na autobus', 'Už jedu domů', 'Autobus je plný'],
    tags: [['highway', 'bus_stop']],
  },
  {
    template: (el) => `Příští zastávka: ${el.name}`,
    tags: [['highway', 'bus_stop']],
    needsName: true,
  },
  {
    template: ['Zelená tráva', 'Procházka v parku', 'Pták na stromu'],
    tags: [['leisure', 'park']],
  },
  {
    template: ['Noční procházka', 'Dvojice v bezpečí noci'],
    tags: [['leisure', 'park']],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Vysoko ve větvích', 'Větve stromu'],
    tags: [['natural', 'wood'], ['natural', 'tree']],
  },
  {
    template: ['Slyšíš racky?', 'Vůně moře', 'Mořský větřík', 'Začíná odliv', 'Začíná příliv', 'Slaný vzduch', 'Daleko na moři', 'Odstíny moře',  'Hučení vln'],
    tags: [['natural', 'coastline']],
  },
  {
    template: ['Prázdno', 'Nic tu není', 'Je tu pustina'],
    tags: [['landuse', 'brownfield']],
  },
  {
    template: ['Odpočívej v pokoji', 'Vzpomínáme', 'Velký smutek', 'Malý náhrobek', 'Hřbitovní zeď', 'Její jméno na mramoru', 'Na pohřbu', 'Smuteční svíce', 'Květiny'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']]
  },
  {
    template: ['Je to tu strašidelné', 'Ve stínech je něco děsivého', 'Temná noc'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: ['Trochu zeleně', 'Tráva je vždycky zelenější', 'Lístečky trávy', 'Malá rostlinka', 'Suchá tráva'],
    tags: [['landuse', 'grass']]
  },
  {
    template: ['Hluk strojů', 'Vzduch plný zvuků', 'Vyroste budova', 'Kopání a míchání', 'Staveniště'],
    tags: [['landuse', 'construction']]
  },
  {
    template: ['Slyším přijíždět vlak', 'Vlak projíždí kolem', 'Na kolejích'],
    tags: [['landuse', 'railway']]
  },
  {
    template: ['Dvě děti', 'Smích', 'Děti si hrají'],
    tags: [['landuse', 'recreation_ground']]
  },
  {
    template: ['Ve vzduchu je elektřina', 'Bzučení'],
    tags: [['power', '*']]
  },
  {
    template: ['Plot', 'Rozbitá branka', 'Otevři branku'],
    tags: [['barrier', 'fence']]
  },
  {
    template: ['Pouč se','Učitel se ptá dětí', 'Na zdi školy', 'Student píše', 'U školních vrat'],
    tags: [['amenity', 'school']],
  },
  {
    template: ['Auta spí', 'Zpětná zrcátka', 'Odstavené auto', 'Tamto staré auto', 'Opuštěné auto', 'Hledám místo k zaparkování', 'Listy na kapotě', 'Nová lesklá auta'],
    tags: [['amenity', 'parking']],
  },
  {
    template: ['Lesklé rámy kol', 'Zamčená kola', 'Tolik kol', 'Tamto kolo nemá řetěz'],
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: ['Na dvou kolech', 'Kolo jen prosviští'],
    tags: [['cycleway:right', '*']],
  },
  {
    template: ['Čas rozmýšlení', 'Je zde Bůh.', 'Vyslyš naši modlitbu'],
    tags: [['amenity', 'place_of_worship']],
  },
  {
    template: ['Modrou nebo červenou pilulku?', 'Bolest v krku', 'Tyhle tablety dvakrát denně', 'Léky fungují', 'Vedlejší efekty', 'Poprosím aspirin'],
    tags: [['amenity', 'pharmacy']],
  },
  {
    template: ['Studené chodby nemocnice', 'Přijíždí auto, houká', 'Rizikový stav', 'Sestra šla kouřit', 'Bublina v injekci', 'Číslo pokoje', 'Mladá sestřička', 'Návštěvní hodiny'],
    tags: [['amenity', 'hospital']]
  },
  {
    template: ['Začátek noční směny'],
    tags: [['amenity', 'hospital']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Obléknu si uniformu', 'Vezmeme si vás na stanci', 'Zlý policajt', 'Hodný policajt', 'Pomáhat a chránit'],
    tags: [['amenity', 'police']]
  },
  {
    template: ['Volaný účastník hovor nepřijímá.', 'Vložte další mince'],
    tags: [['amenity', 'telephone']],
  },
  {
    template: ['Silný zápach beznínu', 'Původně to byl plankton'],
    tags: [['amenity', 'fuel']],
  },
  {
    template: ['Koš přetéká', 'Tohle vyhoď', 'Nepříjemný zápach', 'Kroužící mouchy'],
    tags: [['amenity', 'waste_basket']],
  },
  {
    template: ['Vůně chloru', 'Běhání zakázáno', 'Voda bude teplejší, když do ní vlezeš', 'Mokré plavky'],
    tags: [['leisure', 'swimming_pool']],
  },
  {
    template: ['Voda pod tlakem'],
    tags: [['emergency', 'fire_hydrant']],
  },
  {
    template: (el) => `Co by si takoví jako ${el.name} mysleli?`,
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: (el) => `${el.name} se na tebe dívá`,
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: 'Socha tak elegantní',
    tags: [['artwork_type','sculpture']]
  },
  {
    template: (el) => el.name,
    tags: [['tourism','artwork']]
  },

  {
    template: (el, env) => `Potkáme se? ${el.tags['addr:street']}, ${el.tags['addr:housenumber']}.`,
    condition: (el, env) => el.tags['addr:street'] !== undefined && el.tags['addr:housenumber'] !== undefined
  },
  {
    template: (el) =>
      [
        `Potkáme se v ulici ${el.tags['addr:street']}`,
        `Projdi ulicí ${el.tags['addr:street']}`,
        `Procházím ulicí ${el.tags['addr:street']}`,
      ][Math.floor(Math.random()*4)],
    condition: (el) => el.tags['addr:street'] !== undefined
  },
  {
    template: (el) => el.tags['addr:street'],
    condition: (el, env) => el.tags['addr:street'] !== undefined
  },
]
