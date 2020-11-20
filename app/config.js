window.config = {
  openWeatherMap: {
    url: '//api.openweathermap.org/data/2.5/weather',
    token: '110661baee7df170d491985ec65b9684',
  },
  tiles: {
    url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
  },
  geocoder: {
    url: '//nominatim.openstreetmap.org/reverse',
  },
  overpass: {
    url: 'https://lz4.overpass-api.de/api/interpreter',
  },
  center: {
    en: {lat: 40.723619221714046, lng: -73.98190006613733 },
    es: {lat: 40.416894177003456, lng: -3.7034654617309566 },
    fr: {lat: 48.853318567427955, lng: 2.348955273628235 },
    cs: {lat: 50.08112, lng: 14.42803 },
  },
  labels: {
    en: {
      writing: 'Writing a haiku...',
    },
    es: {
      writing: 'Escribiendo un haiku...',
    },
    fr: {
      writing: 'Écriture du haiku...',
    },
    cs: {
      writing: 'Píši haiku...',
    }
  },
  maxBounds: null
}
