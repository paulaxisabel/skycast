<template>
  <div class="app">
    <div class="noise"></div>

    <header>
      <div class="logo">SKYCAST</div>
      <div class="tagline">Real-time weather, no noise.</div>
    </header>

    <SearchBar @search="handleSearch" @locate="fetchByCurrentLocation" />

    <div class="content">
      <!-- Locating -->
      <div v-if="locating" class="state">
        <div class="pin-pulse">📍</div>
        <p>Detecting your location…</p>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="state">
        <div class="spinner"></div>
        <p>Fetching weather…</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state error">
        <span class="err-icon">⚠️</span>
        <p>{{ error }}</p>
        <div class="err-actions">
          <span class="err-hint">Search for a city above</span>
          <span class="err-sep">or</span>
          <button class="retry-locate" @click="fetchByCurrentLocation">Try location again</button>
        </div>
      </div>

      <!-- Empty fallback -->
      <div v-else-if="!weather" class="state hint">
        <div class="globe">🌍</div>
        <p>Search any city worldwide</p>
        <div class="suggestions">
          <button v-for="city in suggestions" :key="city" @click="handleSearch(city)">
            {{ city }}
          </button>
        </div>
      </div>

      <!-- Weather card -->
      <WeatherCard v-else :weather="weather" />
    </div>

    <footer>
      Powered by <a href="https://open-meteo.com" target="_blank">Open-Meteo</a>
      &amp;
      <a href="https://nominatim.org" target="_blank">Nominatim</a>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import { useWeather } from './composables/useWeather.js'

const { weather, loading, error, locating, fetchWeather, fetchByCurrentLocation } = useWeather()

const suggestions = ['Tokyo', 'New York', 'London', 'Sydney', 'Dubai']

function handleSearch(city) {
  fetchWeather(city)
}

onMounted(() => {
  fetchByCurrentLocation()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-bottom: clamp(1.5rem, 4vw, 3rem);
  position: relative;
}

.noise {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

header {
  text-align: center;
  padding: clamp(1.5rem, 5vw, 3rem) 1rem clamp(0.75rem, 2vw, 1.5rem);
  position: relative;
  z-index: 1;
}

.logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 8vw, 3.5rem);
  letter-spacing: 0.18em;
  color: var(--accent);
  line-height: 1;
}

.tagline {
  font-size: clamp(0.65rem, 2vw, 0.8rem);
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 0.4rem;
}

.content {
  flex: 1;
  padding: clamp(1rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

/* States */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: clamp(2rem, 8vw, 4rem) 1rem;
  text-align: center;
  color: var(--muted);
  flex: 1;
}

.state p { font-size: clamp(0.85rem, 2.5vw, 1rem); }

.error { color: #ff6b6b; }
.err-icon { font-size: clamp(1.5rem, 5vw, 2rem); }
.err-hint { font-size: 0.8rem; opacity: 0.6; }

.spinner {
  width: clamp(24px, 6vw, 32px);
  height: clamp(24px, 6vw, 32px);
  border: 2.5px solid var(--surface2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.pin-pulse {
  font-size: clamp(1.8rem, 6vw, 2.5rem);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.6; }
}

.globe { font-size: clamp(2rem, 6vw, 3rem); margin-bottom: 0.5rem; }

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.suggestions button {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: clamp(0.3rem, 1.5vw, 0.35rem) clamp(0.75rem, 3vw, 1rem);
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.75rem, 2.5vw, 0.85rem);
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.suggestions button:hover {
  border-color: var(--accent);
  background: rgba(232, 255, 71, 0.05);
}

.err-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.err-sep { font-size: 0.75rem; opacity: 0.4; }

.retry-locate {
  background: none;
  border: 1px solid rgba(255,107,107,0.4);
  color: #ff6b6b;
  padding: 0.35rem 1rem;
  border-radius: 50px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-locate:hover {
  background: rgba(255, 107, 107, 0.08);
}

footer {
  text-align: center;
  font-size: clamp(0.65rem, 2vw, 0.75rem);
  color: var(--muted);
  padding: 1rem;
  position: relative;
  z-index: 1;
}

footer a {
  color: var(--accent2);
  text-decoration: none;
}

/* Ensure safe area insets on mobile (notch devices) */
@supports (padding: max(0px)) {
  .app {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
    padding-bottom: max(clamp(1.5rem, 4vw, 3rem), env(safe-area-inset-bottom));
  }
}
</style>
