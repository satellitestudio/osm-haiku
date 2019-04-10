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

const lineMatching = (element, line, environment) => {
  // allow all 
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
        return template
      }
    }
  }
}

const writePoem = () => {
  // console.log(rawElements, weather, timezone)

  const lines = window.lines

  const featuresCopy = [].concat(elements)
  const numFeatures = featuresCopy.length
  const lineMatches = []

  // all features
  for (let i = 0; i <= numFeatures - 1; i++) {
    const feature = featuresCopy[i]
    // take all existing lines
    lines.forEach((line, lineIndex) => {
      const template = lineMatching(feature, line, environment)
      if (template !== undefined) {
        lineMatches.push({
          feature,
          template,
          lineIndex
        })
      }
    })
  }

  // deduplicate line matches
  const uniqLineMatches = []
  const uniqLineMatchesIndexes = []
  lineMatches.forEach(l => {
    if (!uniqLineMatchesIndexes.includes(l.lineIndex)) {
      // TODO transpile !!
      const newLine = {...l}
      if (Array.isArray(newLine.template)) {
        newLine.template = [...newLine.template]
      }
      uniqLineMatches.push(l)
      uniqLineMatchesIndexes.push(l.lineIndex)
    }
  })

  // no prioritizing: result will only depend on lines files:
  // - if there are more env rules, better chance to have env lines
  // - a rule with possibilities (template is an array) will have as
  // much 'weight' as its array length
  const numLines = 3
  const finalLines = []

  for (let j = 0; j < numLines; j++) {
    const randomIndex = Math.floor(uniqLineMatches.length * Math.random())
    let template = uniqLineMatches[randomIndex].template
    // will remove line from the stack by default, except when variations are set (template is an array)
    let removeLine = true
    // when template is an array, use a random phrase until the template emptied of all its phrases
    if (Array.isArray(template)) {
      const randomTemplateIndex = Math.floor(template.length * Math.random())
      template = template[randomTemplateIndex]
      uniqLineMatches[randomIndex].template.splice(randomTemplateIndex, 1)
      // keep line as there are still available templates in the array
      if (uniqLineMatches[randomIndex].template.length) {
        removeLine = false
      }
    }

    // if template is a function, execute it with matched feature and env as params
    template = (typeof template === 'function')
      ? template(uniqLineMatches[randomIndex].feature, environment)
      : template
    
    finalLines.push(template)
    if (removeLine === true) {
      uniqLineMatches.splice(randomIndex, 1)
    }
  }
  
  console.log(finalLines, uniqLineMatches)
  document.querySelector('.js-poem').innerHTML = finalLines
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
      const geocoder = jsons[3]
      elements = getElements(rawElements)

      const featuresDebug = elements.map(feature => {
        return Object.keys(feature.tags).map(tag => {
          return `${tag},${feature.tags[tag]}`
        })
      })
      console.log(featuresDebug)
      environment = getEnvironment(weather, timezone)

      const address = geocoder.features[0].place_name
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
