// https://openweathermap.org/weather-conditions

const a = ['', 'uno ', 'dos ', 'tres ', 'cuatro ', 'cinco ', 'seis ', 'siete ', 'ocho ', 'nueve ', 'diez ', 'once', 'doce ', 'trece ', 'catorce ', 'quince ', 'dieciseis ', 'diecisiete ', 'dieciocho ', 'diecinueve ']
const b = ['', '', 'veinti', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ocehnta', 'noventa']

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
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'mil ' : ''
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'cien ' : ''
  str += (n[5] != 0) ? ((str != '') ? 'y ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : ''

  return str.trim()
}

const getOrdinal = (n) => {
  const s = ['º','º','º','º']
  const v = n % 100
  return n+(s[(v-20)%10]||s[v]||s[0])
}


window.lines = [
  {
    template: ['El mundo es inmenso', 'Perdido en la ciudad', 'El paso del tiempo', 'Recuerdos de casa', 'Pienso en el hogar', 'Abondono mi hogar', 'Pensando en ti', 'Yo me acerco', 'Lejos, muy lejos', 'Aún persiste el aroma']
  },
  {
    template: ['La noche es oscura', 'Bajo la luna', 'Una noche cerrada', 'Las estrellas lejanas', 'Murmuros a medianoche', 'Un paseo nocturno', 'Dulces sueños'],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Buenas tardes', 'El día se acaba', 'A mediodía', 'La tarde se acaba'],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['El día es joven', 'El aire crispado', 'Buenos días', 'Es una mañana triste'],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: el => [
      `Bienvenido a ${el.name}`,
      `Así es como es en ${el.name}`,
      `Otro día en ${el.name}`,
      `La vida en ${el.name}`,
      `Sienta bien ${el.name}`,
      `Hoy en ${el.name}`,
    ][Math.floor(Math.random() * 6)],
    tags: [['admin_level', '4'], ['admin_level', '5'],  ['admin_level', '6'], ['boundary', 'political']],
    needsName: true
  },
  {
    template: ['Tu reflejo', 'Agua como cristal ', 'Flotando aquí', 'Agua callada', 'La superficie del agua'],
    tags: [['waterway', 'canal'], ['waterway', 'river'], ['natural', 'water'], ['water', 'river']]
  },
  {
    template: ['Está helado', 'Muy frío'],
    condition: (el, env) => env.temperature < 0,
  },
  {
    template: ['Todo es azul', 'Un poco helado'],
    condition: (el, env) => env.temperature < 10,
  },
  {
    template: ['Las nubes flotan', "Como el rojo sol"],
    condition: (el, env) => env.temperature > 20,
  },
  {
    template: ['Hace calor', 'Estoy sudando'],
    condition: (el, env) => env.temperature > 30,
  },
  {
    template: ['En el atardecer', 'El sol se esconde', 'El sol se apaga', 'Un rayo de sol', 'Con la luz del sol', 'El sol me golpea', 'El sol muere brillando'],
    condition: (el, env) => (env.weatherConditions.clear && env.moment !== 'night'),
  },
  {
    template: ['Huesos empapados', 'Espejos en las aceras', 'Mudas mojadas', 'Llueve a morir', 'La lluvia se mece', 'Lluvia oscura'],
    condition: (el, env) => env.weatherConditions.rain || env.weatherConditions.drizzle,
  },
  {
    template: ['Libros alegres', 'Al pasar hojas', 'Libre de libros','soy un libro cerrado', 'Tapas que tapan cuentos'],
    tags: [['amenity','library'], ['shop', 'books']],
  },
  {
    template: ['Conocimiento', 'Un buen profesor', 'Aulas vacías', 'Son los que aprenden','Los que saben enseñan'],
    tags: [['amenity','university'],['amenity','school']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['Ding! La campana', 'Un profe llora', 'Es el recreo', 'Polvo de tiza','Niños en la ventana', 'Recuerdo batas verdes'],
    tags: [['amenity','school']],
    condition: (el, env) => env.moment === 'afternoon',
  },
  {
    template: ['Hay sobres dentro', 'No olvides sellos','una carta para ti', 'letras de amor escritas'],
    tags: [['amenity','post_box']]
  },
  {
    template: ['Baja la tapa; snif', 'Huele fuerte', 'Rueda el papel', 'Sombras al lado', 'Gota a gota','El suelo es amarillo', 'Apretón de repente'],
    tags: [['amenity','toilets']]
  },
  {
    template: ['Se aleja un barco', 'Se ven los muelles', 'Junto a la orilla', 'Alli al fondo está ese mar', 'Cruzo sobre las aguas', 'Surco las fuertes olas', 'El barco y los pétalos'],
    tags: [['route','ferry']]
  },
  {
    template: ['Caen las monedas', 'Suena el dinero', 'Suena la alarma','El guarda del dinero', 'Tiene las manos largas'],
    tags: [['amenity','bank']],
    condition: (el, env) => env.moment === 'morning',
  },
  {
    template: ['Escupe pasta', 'Te presto pasta', 'Unos billetes','Introduzco números', 'Tecleo números', 'La pantalla me reflleja', 'Alguien me observa detrás'],
    tags: [['amenity','bank'], ['amenity', 'atm']]
  },
  {
    template: ['Tráete tu bolsa', 'Acuda a caja', 'Dulces naranjas', 'Sabrosas uvas','Agrias frutas del bosque','Cobran rápido en las cajas'],
    tags: [['shop', 'supermarket']]
  },
  {
    template: ['Lugar perdido', 'Bolsa perdida', 'No hay destinos', 'Basta de mapas', 'Dime tu lugar'],
    tags: [['shop', 'travel_agency']]
  },
  {
    template: ['Chandal de gala;', 'Chándal, cadenas;',
'La apariencia', 'No te define', 'Es lo que muestras', 'Hechas con lino','Cubren tu cuerpo', 'Tu segunda piel','Tejidos y botones', 'Esconde tu sexo', ],
    tags: [['shop', 'clothes']]
  },
  {
    template: ['Sin escobilla', 'Sin limpiagrasas', 'Con elegancia', 'Frigorífico'],
    tags: [['shop', 'houseware']]
  },
  {
    template: ['De masa madre','Huele a trigo', 'Huele a madera','Huele a olor a leña', 'Arde como el sol arde',],
    tags: [['shop', 'bakery']]
  },
  {
    template: ['Mitad de cuarto', 'Y quién da la vez', 'Guante de malla','Cambiaste tu delantal', 'Las manchas no se ven más', ],
    tags: [['shop', 'butcher']]
  },
  {
    template: ['Masaje craneal',' Corre el agua', 'No pares nunca', 'Unas tijeras',],
    tags: [['shop', 'hairdresser']]
  },
  {
    template: ['Pasos diarios', 'Días de pasos', "Sin pensar en na'",'Paseando por ahí;','Salto, paro, recuerdo;' ,'Espacios nuevos, míos'],
    tags: [['highway', 'steps']]
  },
  {
    template: (el, env) => `Ah... Café de ${el.name}`,
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']],
    condition: (el, env) => env.moment === 'morning',
    needsName: true
  },
  {
    template: (el, env) => [
      `Huele a ${el.name}`,
      `Panzas llenas de ${el.name}`,
      `Un bocado de ${el.name}`,
      `No hay mucha gente en ${el.name}`,
    ][Math.floor(Math.random()*4)],
    tags: [['amenity', 'restaurant']],
    needsName: true
  },
  {
    template: ['Mesa para dos', 'Un brindis por ti', 'Y llueve fuera ','Comer acompañado', 'O comérselo todo','Olor a flores', 'Olor a carne', ],
    tags: [['amenity', 'restaurant']]
  },
  {
    template: ['Uno con leche', 'Otro cortado', 'Y dos de churros',	'Amigos con aroma', 'Sin ruido no hay café', ],
    tags: [['amenity', 'cafe'], ['cuisine', 'coffee_shop']]
  },
  {
    template: ['Noche de farra', 'Ebria me tumbo', 'Litros de sake', 'Malianteo','Bellaqueo','Hoy toca joseo','Cruzaste mi mirada', 'te pediste un mezcal', 'mucho más no aguanto'],
    tags: [['amenity', 'bar'], ['amenity', 'pub']]
  },
  {
    template: (el) => `Emborrachándome en ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: (el) => `Bebo y fumo en ${el.name}`,
    tags: [['amenity', 'bar'], ['amenity', 'pub']],
    needsName: true
  },
  {
    template: ['Mejor con piña', 'Mejor sin piña','Son pizzas voladoras', 'No eches más comino', ],
    tags: [['cuisine', 'pizza']]
  },
  {
    template: ['La cossa nostra','Il mio tormento', 'O sole mío', 'Che sarà sarà', ],
    tags: [['cuisine', 'italian']]
  },
  {
    template: ['Lleva patatas', 'Sin pepinillos', 'Carne casi de vaca'],
    tags: [['cuisine', 'burger']]
  },
  {
    template: ['Primavera en rollito', 'No hay blues en China town'],
    tags: [['cuisine', 'chinese']]
  },
  {
    template: ['Salsa de soja', 'Maki nigiri', 'Wasabi pica',],
    tags: [['cuisine', 'japanese']]
  },
  {
    template: ['Un mexicano', 'Aquel que canta', 'Y baila mucho',],
    tags: [['cuisine', 'mexican']]
  },
  {
    template: ['Dolor de tripa', '"Gracias amigo"', 'Carne que gira', 'Durum y a dormir', 'Carne que suda','Mixto con salsa blanca', 'Un giro hipnótico', 'Una afeitadora' ],
    tags: [['cuisine', 'turkish'], ['cuisine', 'kebab']],
  },
  {
    template: ['Zapatos rojos', 'Pies delicados', 'Caminamos sin rumbo', 'con una meta fija'],
    tags: [['shop','shoes']]
  },
  {
    template: ['Entre las piedras', 'Solo cabes tú','Levanta un adoquín', 'Mira si hay arena','Mira si hay playa'],
    tags: [['surface', 'paving_stones']],
    condition: (el, env) => env.temperature > 20
  },
  {
    template: ["Vino en moto", "Olía a pizza", "¿Qué escondía?",'Mi estómago lento' ],
    tags: [['amenity', 'fast_food']]
  },
  {
    template: 'Un alma torcida',
    tags: [['amenity', 'bench'], ['bench', 'yes']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: ['Vidrios ardientes', 'Botellas rotas', 'Trozos de cristal','Añicos que reflejan', 'Que dejan ver tus penas', 'No pueden reciclarse'],
    tags: [['recycling:glass', 'true']],
  },
  {
    template: ['Andén tras andén', 'Tú estás ahí', 'Y no te veo'],
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']]
  },
  {
    template: ['Ojos dormidos', 'Llega el torno', 'Otro día más',],
    tags: [['railway', 'subway_entrance']]
  },
  {
    template: 'Voy al trabajo',
    tags: [['subway', 'yes'], ['railway', 'subway_entrance']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: ['Fingir ser otro', 'Siendo tu mismo', 'El actor solo', 	'Un público entusiasta', 'Una ovación de gala', ],
    tags: [['amenity', 'theatre']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Bailar con lo pies', 'O con el alma', 'Pero no parar', 'Bebiendo sake'],
    tags: [['amenity', 'pub']],
    condition: (el, env) => env.moment === 'morning'
  },
  {
    template: ['Estar de paso', 'Dormir descalzo', 'Descansar en paz'],
    tags: [['tourism', 'hotel']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Estar de paso', 'Dormir descalzo', 'Descansar en paz', `Habitación ${Math.floor(Math.random() * 100)}`],
    tags: [['tourism', 'hotel']]
  },
  {
    template: el => `En el lobby de ${el.name}`,
    tags: [['tourism', 'hotel']],
    needsName: true
  },
  {
    template: ['Rezan', 'Es hora de rezar'],
    tags: [['amenity', 'place_of_worship']],
    condition: (el, env) => new Date().getDay() >= 6 && env.moment === 'morning'
  },
  {
    template: ['Paredes grises', 'Y rayas rojas', '¿Qué plaza era?'],
    tags: [['building', 'garage']]
  },
  {
    template: ['Un rascacielos', 'Altas torres en la ciudad', 'Alcanzando el cielo'],
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 20
  },
  {
    template: el => {
      const ele = parseInt(el.tags['building:levels'])

      const ordinal = getOrdinal(ele)
      console.log(ele)

      const line = [
        `Mirándote desde el ${ordinal} piso`,
        `Ella me mira desde el ${ordinal} piso`,
        `Él me mira desde el ${ordinal} piso`
      ][Math.floor(Math.random() * 3)]
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
        `Cuento ${num} plantas`,
        `Un edificio de  ${num} plantas`,
      ][Math.floor(Math.random() * 3)]
      return line
    },
    tags: [['building:levels', '*']],
    condition: (el) => parseInt(el.tags['building:levels']) >= 3
  },
  {
    template: ['Paso tras paso', 'Ruta de hormigas', 'Este camino','Nadie ya lo recorre', 'Avanza el otoño'],
    tags: [['footway', 'crossing'], ['highway', 'crossing']],
  },
  {
    template: 'El busto de un héroe',
    tags: [['historic', 'memorial'], ['historic', 'monumet']],
  },
  {
    template: ['Verde. Rojo. Verde. Rojo.', 'Bocinas, insultos, lágrimas'],
    tags: [['highway', 'traffic_signals']],
  },
  {
    template: ['Atascado en la ciudad', 'Un accidente cotidiano', 'Ocupado en no pensar', 'A través del ruido', 'Un coche me salpica'],
    tags: [['highway', 'motorway']],
  },
  {
    template: ['Un puente sin rumbo', 'Cruza el río', 'Se asoma al puente', 'Sobre el puente', '¿Qué hay bajo el puente?'],
    tags: [['bridge', 'yes']],
  },
  {
    template: ['Halos en la carretera', 'Tintinea la farola'],
    tags: [['highway', 'street_lamp']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: 'Serpientes bajo tierra',
    tags: [['subway', 'route']],
  },
  {
    template: ['Cruces de miradas', 'Sonrisas desde un bus', 'Un bus se desvía'],
    tags: [['route', 'bus']],
  },
  {
    template: ['Otro día en la parada', 'El conductor fuma', 'Pienso en el bus'],
    tags: [['highway', 'bus_stop']],
  },
  {
    template: (el) => `Un autobús para en ${el.name}`,
    tags: [['highway', 'bus_stop']],
    needsName: true,
  },
  {
    template: ['La hierba baila', 'Un paseo en el parque', 'Un pájaro silba'],
    tags: [['leisure', 'park']],
  },
  {
    template: 'Es medianoche',
    tags: [['leisure', 'park']],
    condition: (el, env) => env.moment === 'night',
  },
  {
    template: ['Un árbol bueno', 'Masa de verde','En el sendero del bosque', 'En un claro del bosque', 'Asoma entre las ramas',  ],
    tags: [['natural', 'wood'], ['natural', 'tree']],
  },
  {
    template: ['Desde el cielo', 'No hay humanos'],
    tags: [['natural', 'coastline']],
  },
  {
    template: ['Queda una vacante', 'En un sitio vacío', 'Es un lugar desolado'],
    tags: [['landuse', 'brownfield']],
  },
  {
    template: ['En paz descansan', 'Sin cuenta atrás', 'Guárdame sitio', 'Miles de huesos'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']]
  },
  {
    template: ['En paz descansan', 'Sin cuenta atrás', 'Guárdame sitio', 'Miles de huesos'],
    tags: [['landuse', 'cemetery'], ['amenity', 'grave_yard']],
    condition: (el, env) => env.moment === 'night'
  },
  {
    template: ['Barres la hierba', 'Hierba de pampa', 'Cuida las fores'],
    tags: [['landuse', 'grass']]
  },
  {
    template: ['Otro ladrillo', 'Mira arriba', 'No caben más','Apilamos sin cesar', 'Sin estructura clara', 'Y termina en polvo'],
    tags: [['landuse', 'construction']]
  },
  {
    template: ['Traqueteo', 'Muchos viajeros','Suenan los trenes', 'Nadie te espera', 'Las despedidas'],
    tags: [['landuse', 'railway']]
  },
  {
    template: ['Antonio Vega', 'Olvidé la paz', 'Recordé la luz'],
    tags: [['landuse', 'recreation_ground']]
  },
  {
    template: ['Chispas fugaces'],
    tags: [['power', '*']]
  },
  {
    template: ['Lo separa una verja', 'Está tras la valla', 'Hay que cruzar la valla'],
    tags: [['barrier', 'fence']]
  },
  {
    template: ['Te dicen que enseñan', 'Luego está internet'],
    tags: [['amenity', 'school']],
  },
  {
    template: ['Coches que duermen', 'Siempre está oscuro', 'Un coche ronronea', 'Putas entre los coches', 'Yonkis entre los coches', 'No cabe un alfier', 'Muchas lunas, ninguna brilla', '¿Como he llegado aquí?'],
    tags: [['amenity', 'parking']],
  },
  {
    template: ['Astillas de metal'],
    tags: [['amenity', 'bicycle_parking']],
  },
  {
    template: ['La rueda sigue girando', 'Carril equivocado'],
    tags: [['cycleway:right', '*']],
  },
  {
    template: ['Estoy en mi meditar', 'Meditando en la ciudad', 'El silencio grita'],
    tags: [['amenity', 'place_of_worship']],
  },
  {
    template: ['Fármacos se deslizan', 'La cruz verde se retuerce', 'Un amor sin receta'],
    tags: [['amenity', 'pharmacy']],
  },
  {
    template: ['Triaje y al box, Pasillos largos, El tiempo corre', 'toda la casa llora'],
    tags: [['amenity', 'hospital']]
  },
  {
    template: ['Triaje y al box, Pasillos largos, El tiempo corre', 'toda la casa llora'],
    tags: [['amenity', 'hospital']],
    condition: (el, env) => env.moment === 'evening'
  },
  {
    template: ['Los cuerpos nacionales', 'Menudos cuerpos tienen' ],
    tags: [['amenity', 'police']]
  },
  {
    template: ['Llámame siempre', 'Persigo tu voz','Para lo que tú quieras.', 'Soy el ring del silencio.'],
    tags: [['amenity', 'telephone']],
  },
  {
    template: ['Lleno, por favor;', 'Sin compromiso','Échale diesel', 	'Siempre le echo veinte euros' ],
    tags: [['amenity', 'fuel']],
  },
  {
    template: ['Papeleras por doquier', 'Todas son transparentes', 'Y no nos da vergüenza', ],
    tags: [['amenity', 'waste_basket']],
  },
  {
    template: ['Son malas calles', 'Cloro a babor', 'Lánzate por dios'],
    tags: [['leisure', 'swimming_pool']],
  },
  {
    template: ['Chorro de agua', 'Una ballena', ],
    tags: [['emergency', 'fire_hydrant']],
  },
  {
    template: (el) => `El busto de ${el.name} observa`,
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: (el) => `${el.name} te mira`,
    tags: [['historic', 'memorial']],
    needsName: true
  },
  {
    template: 'Una escltura elegante',
    tags: [['artwork_type','sculpture']]
  },
  {
    template: (el) => el.name,
    tags: [['tourism','artwork']]
  },

  {
    template: (el, env) => `Quedo en ${el.tags['addr:street']}, ${el.tags['addr:housenumber']}.`,
    condition: (el, env) => el.tags['addr:street'] !== undefined && el.tags['addr:housenumber'] !== undefined
  },
  {
    template: (el) =>
      [
        `Encuéntrame ${el.tags['addr:street']}`,
        `Todo hasta ${el.tags['addr:street']}`,
        `Te espero en ${el.tags['addr:street']}`,
        `Camino por ${el.tags['addr:street']}`,
      ][Math.floor(Math.random()*4)],
    condition: (el) => el.tags['addr:street'] !== undefined
  },
  {
    template: (el) => el.tags['addr:street'],
    condition: (el, env) => el.tags['addr:street'] !== undefined
  },
]
