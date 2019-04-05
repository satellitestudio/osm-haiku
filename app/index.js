// let center = {
//   lng: -3.7009763717651363,
//   lat: 40.40851290848389
// }
// let center = {
//   lng: -77.03,
//   lat: 38.9
// }
let center = { lat: 40.43022363450862, lng: -3.69140625 }

const CONFIG = {
  overpassRadius: 100,
  overpassRadiusExt: 1000
}

const mapConfig = {
  zoomControl: false,
  minZoom: 5,
  maxBounds: [
    [44.762336674810996, -10.5029296875],
    [35.22767235493586, 2.26318359375]
  ],
  maxBoundsViscosity: 1.0
}

const map = L.map('map', mapConfig).setView(center, 14)

L.tileLayer(
  'https://api.mapbox.com/styles/v1/nerik/cjggtikms001p2ro6qfw9uucs/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmVyaWsiLCJhIjoidGk4anFNWSJ9.DtXdac0Q_4kb4hWcGItNPA',
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(map)

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
  if (timeHour > 6 && timeHour < 13) moment = 'morning'
  if (timeHour > 13 && timeHour < 19) moment = 'afternoon'
  if (timeHour > 19) moment = 'evening'
  return {
    timeHour,
    moment,
    temperature: weather.main.temp
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

    // dedup ?

    if (matches.length >= 3) {
      break
    }

    elementsCopy.splice(randomIndex, 1)
  }
  // console.log(matches)
  document.querySelector('.js-poem').innerHTML = matches
    .map((m) => m.template)
    .join('<br>')
}

let elements
let environment

const load = () => {
  document.querySelector('.js-poem').innerHTML = 'Making a haiku...'
  document.querySelector('h1').innerText = '...'
  const urls = [
    `http://localhost:8085/api/interpreter?data=${getOverpassQL(
      center.lat,
      center.lng,
      CONFIG.overpassRadius
    )}`,
    `http://api.openweathermap.org/data/2.5/weather?lat=${center.lat}&lon=${
      center.lng
    }&APPID=${window.apiKeys.openWeatherMap}&units=metric`,
    `http://api.timezonedb.com/v2/get-time-zone?key=${
      window.apiKeys.timeZoneDB
    }&format=json&by=position&lat=${center.lat}&lng=${center.lng}`, // might be unnecessary as owm has sunrise/sunset
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${
      center.lat
    }.json?access_token=${window.apiKeys.mapbox}`
  ]

  Promise.all(urls.map((url) => fetch(url).then((resp) => resp.json()))).then(
    (jsons) => {
      const rawElements = jsons[0].elements.filter((e) => e.tags !== undefined)
      const weather = jsons[1]
      const timezone = jsons[2]
      elements = getElements(rawElements)
      environment = getEnvironment(weather, timezone)

      const address = jsons[3].features[0].text
      document.querySelector('h1').innerText = address

      if (rawElements.length < 10) {
        fetch(
          `http://localhost:8085/api/interpreter?data=${getOverpassQL(
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

map.on('movestart', () => {
  document.querySelector('.js-poem-container').classList.toggle('-hidden', true)
})

map.on('moveend', () => {
  startLoadTimeout = setTimeout(() => {
    document
      .querySelector('.js-poem-container')
      .classList.toggle('-hidden', false)
    setCenter()
  }, 1500)
})

map.on('move', () => {
  clearTimeout(startLoadTimeout)
})

document.querySelector('h1').addEventListener('click', writePoem)

load()