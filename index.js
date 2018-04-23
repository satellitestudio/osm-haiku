console.log('hello')

let center = {
  lng: -3.7009763717651363,
  lat: 40.40851290848389
}

const CONFIG = {
  overpassRadius: 100,
  overpassRadiusExtended: 1000,
}

const map = L.map('map').setView(center, 18)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const getOverpassQL = (lat, lng, radius) => {
  return encodeURIComponent(`[out:json][timeout:25];(
    node(around:${radius},${lat},${lng});
    way(around:${radius},${lat},${lng});
    relation(around:${radius},${lat},${lng});
    <;);out center;>;out skel qt;`)
}

const load = () => {
  const urls = [
    `https://overpass-api.de/api/interpreter?data=${getOverpassQL(center.lat, center.lng, CONFIG.overpassRadius)}`,
    `http://api.openweathermap.org/data/2.5/weather?lat=${center.lat}&lon=${center.lng}&APPID=${window.apiKeys.openWeatherMap}&units=metric`,
    `http://api.timezonedb.com/v2/get-time-zone?key=${window.apiKeys.timeZoneDB}&format=json&by=position&lat=${center.lat}&lng=${center.lng}` // might be unnecessary as owm has sunrise/sunset
  ]

  Promise.all(urls.map(url =>
    fetch(url).then(resp => resp.json())
  )).then(jsons => {
    const weather = jsons[1]
    let allElements = jsons[0].elements.filter(e => e.tags !== undefined)
    if (allElements.length < 10) {
      fetch(`https://overpass-api.de/api/interpreter?data=${getOverpassQL(center.lat, center.lng, CONFIG.overpassRadiusExtended)}`)
        .then(resp => resp.json())
        .then(json => {
          allElements = json.elements.filter(e => e.tags !== undefined)
          console.log(allElements.map(e => e.tags))
        })
    }
    console.log(allElements.map(e => e.tags))
    console.log(weather)
  })
}

const setCenter = () => {
  center = map.getCenter()
  load()
}

const toggle = (showMap) => {
  document.querySelector('.js-poem-container').classList.toggle('-hidden', showMap)
  document.querySelector('.js-map-container').classList.toggle('-hidden', !showMap)
  map.invalidateSize(false)
}

document.querySelector('.js-write').addEventListener('click', load)
document.querySelector('.js-show-map').addEventListener('click', () => toggle(true))
document.querySelector('.js-map-write').addEventListener('click', () => {
  setCenter()
  toggle(false)
})

load()
