// let center = {
//   lng: -3.7009763717651363,
//   lat: 40.40851290848389
// }
// let center = {
//   lng: -77.03,
//   lat: 38.9
// }
const shuffle = (a) => {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}


let center = window.config.center
let map
let startLoadTimeout


const CONFIG = {
  overpassRadius: 100,
  overpassRadiusExt: 400,
  minRawElements: 20,
  fetchCenter: false,
}

const mapConfig = {
  zoomControl: false,
  attributionControl: false,
  minZoom: 3
}
if (window.config.maxBounds !== null && window.config.maxBounds !== undefined) {
  mapConfig.maxBounds = window.config.maxBounds
  mapConfig.maxBoundsViscosity = 1.0
}

const getOverpassQL = (lat, lng, radius) => {
  const center = (CONFIG.fetchCenter) ? 'center' : ''
  const ql = `[out:json][timeout:5];
  (
    nwr[~"."~"."](around:${radius},${lat},${lng});
  <;);out tags ${center};
  (
    way[~"landuse|landcover|natural"~"."](around:${radius * 4},${lat},${lng});
  );out tags ${center};
  is_in(${lat},${lng})->.a;
  relation(pivot.a);
  out tags ${center};`
  console.log('Generated Overpass QL:', ql)
  return encodeURIComponent(ql)
}

const getElements = (rawElements) => {
  return rawElements.map((element) => {
    const finalElement = {
      tags: element.tags,
      name: element.tags.name
    }
    if (CONFIG.fetchCenter) {
      const { lat, lon } =
        element.type === 'node'
          ? { lat: element.lat, lon: element.lon }
          : element.center
      const distance = window.turf.distance(
        window.turf.point([center.lng, center.lat]),
        window.turf.point([lon, lat])
      )
      element.distance = distance
    }
    return finalElement
  })
}

const getEnvironment = (weather, timezone) => {
  if (timezone.status === 'FAILED') {
    return
  }
  const timeHour = parseInt(timezone.formatted.match(/(\d\d):/)[1])
  let moment
  if (timeHour > 0 && timeHour < 6) moment = 'night'
  if (timeHour >= 6 && timeHour < 12) moment = 'morning'
  if (timeHour >= 12 && timeHour < 19) moment = 'afternoon'
  if (timeHour >= 19) moment = 'evening'
  console.log(weather)
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
        (line.needsName === undefined || (element.name !== undefined && element.name.length < 20))
      ) {
        let template = line.template
        return template
      }
    }
  }
}

const writePoem = () => {
  // console.log(rawElements, weather, timezone)

  const lines = shuffle([].concat(window.lines))

  const featuresCopy = shuffle([].concat(elements))
  const numFeatures = featuresCopy.length
  const lineMatches = []

  // all features
  console.log('using ', numFeatures, ' features and ', lines.length, ' lines')
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

  console.log(lineMatches)

  // deduplicate line matches (by line index)
  const uniqLineMatches = []
  const uniqLineMatchesIndexes = []
  lineMatches.forEach(l => {
    if (!uniqLineMatchesIndexes.includes(l.lineIndex)) {
      const newLine = {
        template: l.template,
        feature: l.feature
      }
      if (Array.isArray(newLine.template)) {
        newLine.template = [...newLine.template]
      }
      uniqLineMatches.push(newLine)
      uniqLineMatchesIndexes.push(l.lineIndex)
    }
  })
  console.log(uniqLineMatchesIndexes, uniqLineMatches)

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
  
  document.querySelector('.js-poem').innerHTML = finalLines
    .join('<br>')
}

let elements
let environment

const load = () => {
  
  const toggleLoadingState = (loading) => {
    document.querySelector('.js-poem-container').classList.toggle('-disabled', loading)
    document.querySelector('.js-credits').classList.toggle('-hidden', loading)
  }
  toggleLoadingState(true)

  document.querySelector('.js-poem').innerHTML = 'Writing a haiku...'
  console.log(center)

  document.querySelector('h1').innerText = '...'
  const urls = [
    `${window.config.overpass.url}?data=${getOverpassQL(
      center.lat,
      center.lng,
      CONFIG.overpassRadius
    )}`,
    `${window.config.openWeatherMap.url}?lat=${center.lat}&lon=${center.lng}&APPID=${window.config.openWeatherMap.token}&units=metric`,
    `${window.config.timeZoneDB.url}?key=${window.config.timeZoneDB.token}&format=json&by=position&lat=${center.lat}&lng=${center.lng}`, // might be unnecessary as owm has sunrise/sunset
    `${window.config.geocoder.url}/?lat=${center.lat}&lon=${center.lng}&addressdetails=0&format=json`
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
      console.log('all usable features:')
      console.log(featuresDebug)
      environment = getEnvironment(weather, timezone)
      console.log('env', environment)
      console.log(geocoder)
      const address = (geocoder.display_name) ? geocoder.display_name : 'Unknown place'
      document.querySelector('h1').innerText = address

      if (rawElements.length < CONFIG.minRawElements) {
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
            if (rawElements.length < CONFIG.minRawElements) {
              document.querySelector('.js-poem').innerHTML = 'There\'s not much around...'
            } else {
              elements = getElements(rawElements)
              writePoem()
              toggleLoadingState(false)
              // console.log(rawElements.map(e => e.tags))
            }
          })
      } else {
        writePoem()
        toggleLoadingState(false)
      }
    }
  )
}

const setCenter = () => {
  center = map.getCenter()
  load()
}

const geolocate = () => {
  map.locate({setView: true, maxZoom: 14})
}


const intro = () => {
  window.setTimeout(() => {
    document.querySelector('.js-poem-container').classList.toggle('-hidden', false)
    map.on('movestart', () => {
      document.querySelector('.js-poem-container').classList.toggle('-hidden', true)
    })
    
    map.on('moveend', () => {
      startLoadTimeout = setTimeout(() => {
        document.querySelector('.js-poem-container').classList.toggle('-hidden', false)
        setCenter()
      }, 800)
    })
    
    map.on('move', () => {
      clearTimeout(startLoadTimeout)
    })

    document.querySelector('h1').addEventListener('click', writePoem)
    document.querySelector('.js-geolocate').addEventListener('click', geolocate)
    center = map.getCenter()
    load()
  }, 1000)
  
}


if (window.L) {
  map = L.map('map', mapConfig)
  map.setView(center, 14)
  
  var hash = new L.Hash(map)
  
  L.tileLayer(
    `${window.config.tiles.url}?access_token=${window.config.tiles.token}`
  ).addTo(map)

  intro()
}
