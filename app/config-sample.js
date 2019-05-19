window.config = {
  openWeatherMap: {
    url: '//api.openweathermap.org/data/2.5/weather',
    token: '...',
  },
  timeZoneDB: {
    url: '//api.timezonedb.com/v2/get-time-zone',
    token: '...',
  },
  tiles: {
    url: '//api.mapbox.com/styles/v1/nerik/cjggtikms001p2ro6qfw9uucs/tiles/256/{z}/{x}/{y}',
    token: 'pk...',
  },
  geocoder: {
    url: '//api.mapbox.com/geocoding/v5/mapbox.places',
    token: 'pk...',
  },
  overpass: {
    url: 'https://lz4.overpass-api.de/api/interpreter',
  },
  center: { lat: 40.723619221714046, lng: -73.98190006613733 },
  maxBounds: null
  // maxBounds: [
  //   [41.1455697310095, -74.42138671875],
  //   [40.22921818870117, -73.4490966796875]
  // ]
}