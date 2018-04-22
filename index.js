console.log('hello')

let center = {
  lng: -3.7009763717651363,
  lat: 40.40851290848389
}

const CONFIG = {
  overpassRadius: 100
}

const map = L.map('map').setView(center, 18)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)

const load = () => {
  const overpassQL = `[out:json][timeout:25];(
    node(around:${CONFIG.overpassRadius},${center.lat},${center.lng});
    way(around:${CONFIG.overpassRadius},${center.lat},${center.lng});
    relation(around:${CONFIG.overpassRadius},${center.lat},${center.lng});
    <;);out center;>;out skel qt;`

  const urls = [
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQL)}`,
    `http://api.openweathermap.org/data/2.5/weather?lat=${center.lat}&lon=${center.lng}&APPID=${window.apiKeys.openWeatherMap}&units=metric`,
    `http://api.timezonedb.com/v2/get-time-zone?key=${window.apiKeys.timeZoneDB}&format=json&by=position&lat=${center.lat}&lng=${center.lng}` // might be unnecessary as owm has sunrise/sunset
  ]

  Promise.all(urls.map(url =>
    fetch(url).then(resp => resp.json())
  )).then(jsons => {
    const weather = jsons[1];
    const allElements = jsons[0].elements.filter(e => e.tags !== undefined)
    console.log(allElements.map(e => e.tags))
    console.log(weather)
  })
}

const setCenter = () => {
  center = map.getCenter()
  load()
}

document.querySelector('.js-write').addEventListener('click', setCenter)
document.querySelector('.js-map-write').addEventListener('click', setCenter)

load()
