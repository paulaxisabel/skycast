// composables/useWeather.js
import { ref } from 'vue'

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Icy Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  61: { label: 'Light Rain', icon: '🌧️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  71: { label: 'Light Snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy Snow', icon: '❄️' },
  80: { label: 'Rain Showers', icon: '🌦️' },
  81: { label: 'Showers', icon: '🌧️' },
  82: { label: 'Heavy Showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Hail Storm', icon: '⛈️' },
}

export function useWeather() {
  const weather = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const locating = ref(false)

  async function geocode(city) {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    )
    const data = await res.json()
    if (!data.results?.length) throw new Error('City not found')
    return data.results[0]
  }

  async function reverseGeocode(lat, lon) {
    // Use Open-Meteo geocoding with a nearby city lookup via coordinates
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    )
    const data = await res.json()
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      'Your Location'
    const country = data.address?.country || ''
    return { city, country }
  }

  async function buildWeatherData(latitude, longitude, name, country) {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto&forecast_days=7`
    )
    const data = await res.json()
    const code = data.current.weathercode
    const condition = WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' }

    return {
      city: name,
      country,
      temp: Math.round(data.current.temperature_2m),
      feels: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      wind: Math.round(data.current.wind_speed_10m),
      condition: condition.label,
      icon: condition.icon,
      daily: data.daily.time.map((date, i) => ({
        date,
        code: data.daily.weathercode[i],
        icon: (WMO_CODES[data.daily.weathercode[i]] || { icon: '🌡️' }).icon,
        label: (WMO_CODES[data.daily.weathercode[i]] || { label: '' }).label,
        max: Math.round(data.daily.temperature_2m_max[i]),
        min: Math.round(data.daily.temperature_2m_min[i]),
      }))
    }
  }

  async function fetchWeather(city) {
    loading.value = true
    error.value = null
    weather.value = null
    try {
      const location = await geocode(city)
      const { latitude, longitude, name, country } = location
      weather.value = await buildWeatherData(latitude, longitude, name, country)
    } catch (e) {
      error.value = e.message || 'Failed to fetch weather'
    } finally {
      loading.value = false
    }
  }

  async function fetchByCurrentLocation() {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported by your browser.'
      return
    }
    locating.value = true
    error.value = null
    weather.value = null

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const { city, country } = await reverseGeocode(latitude, longitude)
          weather.value = await buildWeatherData(latitude, longitude, city, country)
        } catch (e) {
          error.value = e.message || 'Failed to fetch weather for your location'
        } finally {
          locating.value = false
        }
      },
      (err) => {
        locating.value = false
        if (err.code === 1) {
          error.value = 'Location access denied. Search for a city instead.'
        } else {
          error.value = 'Could not detect your location. Try searching manually.'
        }
      },
      { timeout: 10000 }
    )
  }

  return { weather, loading, error, locating, fetchWeather, fetchByCurrentLocation }
}
