// let center = {
//   lng: -3.7009763717651363,
//   lat: 40.40851290848389
// }
// let center = {
//   lng: -77.03,
//   lat: 38.9
// }
let center = window.config.center

const CONFIG = {
  overpassRadius: 100,
  overpassRadiusExt: 1000
}

const mapConfig = {
  zoomControl: false,
  minZoom: 10
}
if (window.config.maxBounds !== null && window.config.maxBounds !== undefined) {
  mapConfig.maxBounds = window.config.maxBounds
  mapConfig.maxBoundsViscosity = 1.0
}

let map
if (window.L) {
  map = L.map('map', mapConfig).setView(center, 14)
  
  L.tileLayer(
    `${window.config.tiles.url}?access_token=${window.config.tiles.token}`,
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ).addTo(map)
}

const getOverpassQL = (lat, lng, radius) => {
  return encodeURIComponent(`[out:json][timeout:25];(
    node(around:${radius},${lat},${lng});
    way(around:${radius},${lat},${lng});
    relation(around:${radius},${lat},${lng});
    <;);out center;>;out skel qt;`)
}

const getElements = (rawElements) => {
  return rawElements.map((element) => {
    const { lat, lon } =
      element.type === 'node'
        ? { lat: element.lat, lon: element.lon }
        : element.center
    // const distance = window.turf.distance(
    //   window.turf.point([center.lng, center.lat]),
    //   window.turf.point([lon, lat])
    // )
    return {
      // distance,
      tags: element.tags,
      name: element.tags.name
    }
  })
}

const getEnvironment = (weather, timezone) => {
  const timeHour = parseInt(timezone.formatted.match(/(\d\d):/)[1])
  let moment
  if (timeHour > 0 && timeHour < 6) moment = 'night'
  if (timeHour >= 6 && timeHour < 13) moment = 'morning'
  if (timeHour >= 13 && timeHour < 19) moment = 'afternoon'
  if (timeHour >= 19) moment = 'evening'

  const weatherConditions = {}
  weatherConditions.thunderstorm = weather.weather.find(w => w.id >= 200 && w.id < 300) !== undefined
  weatherConditions.drizzle      = weather.weather.find(w => w.id >= 300 && w.id < 400) !== undefined
  weatherConditions.rain         = weather.weather.find(w => w.id >= 500 && w.id < 600) !== undefined
  weatherConditions.snow         = weather.weather.find(w => w.id >= 600 && w.id < 700) !== undefined
  weatherConditions.clear        = weather.weather.find(w => w.id === 800) !== undefined
  weatherConditions.cloudy       = weather.weather.find(w => w.id >= 801 && w.id < 900) !== undefined
  weatherConditions._all = weather.weather.map(w => w.main)

  return {
    timeHour,
    moment,
    temperature: weather.main.temp,
    weatherConditions
  }
}

const lineMatch = (element, line, environment) => {
  const tags = line.tags === undefined ? [['*', '*']] : line.tags

  for (let i = 0; i < tags.length; i++) {
    // just OR for now.
    const lineTagKey = tags[i][0]
    const lineTagValue = tags[i][1]
    if (
      (lineTagKey === '*' || element.tags[lineTagKey] !== undefined) &&
      (lineTagValue === '*' || element.tags[lineTagKey] === lineTagValue)
    ) {
      if (
        (line.condition === undefined ||
          line.condition(element, environment) === true) &&
        (line.needsName === undefined || element.name !== undefined)
      ) {
        let template = line.template
        if (Array.isArray(template)) {
          template = template[Math.floor(template.length * Math.random())]
        }
        return typeof template === 'function'
          ? template(element, environment)
          : template
      }
    }
  }
}

const writePoem = () => {
  // console.log(rawElements, weather, timezone)

  const lines = window.lines

  // console.log(elements, environment, elements.length)
  const elementsCopy = [].concat(elements)
  const numElements = elementsCopy.length
  const matches = []

  // all features
  for (let i = 0; i <= numElements - 1; i++) {
    const randomIndex = Math.floor(elementsCopy.length * Math.random())
    const randomElement = elementsCopy[randomIndex]

    lines.forEach((line, i) => {
      const lineAlreadyUsed = matches.find((m) => m.index === i) !== undefined
      if (lineAlreadyUsed === false) {
        const lm = lineMatch(randomElement, line, environment)
        if (lm !== undefined) {
          matches.push({
            template: lm,
            index: i
          })
        }
      }
    })
    elementsCopy.splice(randomIndex, 1)
    if (matches.length >= 3) {
      break
    }
  }
  // console.log(matches.map(m => m.template));

  const finalMatches = []

  for (let j = 0; j < 3; j++) {
    const randomIndex = Math.floor(matches.length * Math.random())
    finalMatches.push(matches[randomIndex])
    matches.splice(randomIndex, 1)
  }

  document.querySelector('.js-poem').innerHTML = finalMatches
    .map((m) => m.template)
    .join('<br>')
}

let elements
let environment

const load = () => {
  document.querySelector('.js-poem').innerHTML = 'Making a haiku...'
  document.querySelector('h1').innerText = '...'
  const urls = [
    `${window.config.overpass.url}?data=${getOverpassQL(
      center.lat,
      center.lng,
      CONFIG.overpassRadius
    )}`,
    `${window.config.openWeatherMap.url}?lat=${center.lat}&lon=${center.lng}&APPID=${window.config.openWeatherMap.token}&units=metric`,
    `${window.config.timeZoneDB.url}?key=${window.config.timeZoneDB.token}&format=json&by=position&lat=${center.lat}&lng=${center.lng}`, // might be unnecessary as owm has sunrise/sunset
    (window.config.geocoder.token) ? `${window.config.geocoder.url}/${center.lng},${center.lat}.json?access_token=${window.config.geocoder.token}` : window.config.geocoder.url
  ]

  Promise.all(urls.map((url) => fetch(url).then((resp) => resp.json()))).then(
    (jsons) => {
      const rawElements = jsons[0].elements.filter((e) => e.tags !== undefined)
      const weather = jsons[1]
      const timezone = jsons[2]
      elements = getElements(rawElements)
      console.log(elements)
      environment = getEnvironment(weather, timezone)

      const address = jsons[3].features[0].text
      document.querySelector('h1').innerText = address

      if (rawElements.length < 10) {
        fetch(
          `${window.config.overpass.url}?data=${getOverpassQL(
            center.lat,
            center.lng,
            CONFIG.overpassRadiusExt
          )}`
        )
          .then((resp) => resp.json())
          .then((json) => {
            const rawElements = json.elements.filter(
              (e) => e.tags !== undefined
            )
            elements = getElements(rawElements)
            writePoem()
            // console.log(rawElements.map(e => e.tags))
          })
      } else {
        writePoem()
      }
    }
  )
}

const setCenter = () => {
  center = map.getCenter()
  load()
}

let startLoadTimeout

if (map) {
  map.on('movestart', () => {
    document.querySelector('.js-poem-container').classList.toggle('-hidden', true)
  })
  
  map.on('moveend', () => {
    startLoadTimeout = setTimeout(() => {
      document
        .querySelector('.js-poem-container')
        .classList.toggle('-hidden', false)
      setCenter()
    }, 800)
  })
  
  map.on('move', () => {
    clearTimeout(startLoadTimeout)
  })
}

document.querySelector('h1').addEventListener('click', writePoem)

load()
