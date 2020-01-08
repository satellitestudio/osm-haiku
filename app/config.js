window.config = {
  openWeatherMap: {
    url: '//api.openweathermap.org/data/2.5/weather',
    token: '110661baee7df170d491985ec65b9684',
  },
  timeZoneDB: {
    url: '//api.timezonedb.com/v2/get-time-zone',
    token: '5MS0NHJMM12G',
  },
  tiles: {
    url: '//api.mapbox.com/styles/v1/josatellite/ck553m2210j5n1cp28u4a9dk7/tiles/256/{z}/{x}/{y}',
    token: 'pk.eyJ1Ijoiam9zYXRlbGxpdGUiLCJhIjoiY2s1NTNxMzJwMDVoOTNscGNrOGhsNml0MSJ9.iM7Dxjz7L95jqgNTw5uxfw',
  },
  geocoder: {
    url: '//api.mapbox.com/geocoding/v5/mapbox.places',
    token: 'pk.eyJ1Ijoiam9zYXRlbGxpdGUiLCJhIjoiY2s1NTNxMzJwMDVoOTNscGNrOGhsNml0MSJ9.iM7Dxjz7L95jqgNTw5uxfw',
  },
  overpass: {
    url: 'https://lz4.overpass-api.de/api/interpreter',
  },
  center: { lat: 40.723619221714046, lng: -73.98190006613733 },
  maxBounds: null
}
