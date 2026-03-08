<template>
  <div class="card" :class="bgClass">
    <!-- Header -->
    <div class="card-header">
      <div class="location">
        <span class="pin">📍</span>
        <div>
          <div class="city">{{ weather.city }}</div>
          <div class="country">{{ weather.country }}</div>
        </div>
      </div>
      <div class="time">{{ currentTime }}</div>
    </div>

    <!-- Main temp -->
    <div class="main-temp">
      <span class="icon">{{ weather.icon }}</span>
      <div class="temp-block">
        <span class="temp">{{ weather.temp }}<sup>°C</sup></span>
        <span class="condition">{{ weather.condition }}</span>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat">
        <span class="stat-label">Feels Like</span>
        <span class="stat-val">{{ weather.feels }}°</span>
      </div>
      <div class="divider"></div>
      <div class="stat">
        <span class="stat-label">Humidity</span>
        <span class="stat-val">{{ weather.humidity }}%</span>
      </div>
      <div class="divider"></div>
      <div class="stat">
        <span class="stat-label">Wind</span>
        <span class="stat-val">{{ weather.wind }}<small>km/h</small></span>
      </div>
    </div>

    <!-- 7-day forecast -->
    <div class="forecast">
      <div class="forecast-title">7-DAY FORECAST</div>
      <div class="forecast-row">
        <div class="forecast-day" v-for="(day, i) in weather.daily" :key="day.date">
          <span class="f-dow">{{ i === 0 ? 'Today' : dayName(day.date) }}</span>
          <span class="f-icon">{{ day.icon }}</span>
          <span class="f-max">{{ day.max }}°</span>
          <span class="f-min">{{ day.min }}°</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({ weather: Object })

const currentTime = ref('')
let timer

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => clearInterval(timer))

function dayName(dateStr) {
  return new Date(dateStr).toLocaleDateString('en', { weekday: 'short' })
}

const bgClass = computed(() => {
  const code = props.weather?.icon
  if (['☀️', '🌤️'].includes(code)) return 'bg-sunny'
  if (['🌧️', '🌦️', '⛈️'].includes(code)) return 'bg-rainy'
  if (['❄️', '🌨️'].includes(code)) return 'bg-snowy'
  return 'bg-default'
})
</script>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: clamp(16px, 4vw, 24px);
  padding: clamp(1rem, 4vw, 2rem);
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Background glow variants */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.06;
  z-index: 0;
  pointer-events: none;
}

.bg-sunny::before  { background: radial-gradient(circle at 80% 0%, #ffe047 0%, transparent 70%); opacity: 0.15; }
.bg-rainy::before  { background: radial-gradient(circle at 80% 0%, #47c8ff 0%, transparent 70%); opacity: 0.12; }
.bg-snowy::before  { background: radial-gradient(circle at 80% 0%, #c8e0ff 0%, transparent 70%); opacity: 0.12; }
.bg-default::before { background: radial-gradient(circle at 80% 0%, #9080ff 0%, transparent 70%); opacity: 0.08; }

.card > * { position: relative; z-index: 1; }

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: clamp(1rem, 3vw, 2rem);
  gap: 0.5rem;
}

.location { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; }
.pin { font-size: clamp(0.9rem, 2.5vw, 1.1rem); flex-shrink: 0; }
.city {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  letter-spacing: 0.05em;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.country { font-size: clamp(0.65rem, 1.8vw, 0.75rem); color: var(--muted); margin-top: 2px; }
.time { font-size: clamp(0.75rem, 2vw, 0.85rem); color: var(--muted); margin-top: 4px; white-space: nowrap; flex-shrink: 0; }

/* Main temp */
.main-temp {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 3vw, 1.5rem);
  margin-bottom: clamp(1rem, 3vw, 2rem);
}

.icon { font-size: clamp(2.5rem, 10vw, 4rem); line-height: 1; }

.temp-block { display: flex; flex-direction: column; }

.temp {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3rem, 14vw, 5rem);
  line-height: 1;
  letter-spacing: -0.02em;
}

.temp sup {
  font-size: clamp(1.2rem, 4vw, 2rem);
  vertical-align: super;
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  opacity: 0.7;
}

.condition {
  font-size: clamp(0.8rem, 2.5vw, 0.95rem);
  color: var(--muted);
  font-weight: 300;
  margin-top: 0.25rem;
}

/* Stats */
.stats {
  display: flex;
  align-items: center;
  background: var(--surface2);
  border-radius: clamp(10px, 3vw, 14px);
  padding: clamp(0.65rem, 2.5vw, 1rem) clamp(0.75rem, 3vw, 1.5rem);
  margin-bottom: clamp(1rem, 3vw, 2rem);
  gap: 0.5rem;
}

.stat { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.stat-label {
  font-size: clamp(0.6rem, 1.6vw, 0.7rem);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-align: center;
}
.stat-val {
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  font-weight: 500;
}
.stat-val small {
  font-size: 0.7em;
  opacity: 0.6;
  margin-left: 1px;
}

.divider { width: 1px; height: 1.75rem; background: var(--border); flex-shrink: 0; }

/* Forecast */
.forecast-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  letter-spacing: 0.12em;
  color: var(--muted);
  margin-bottom: 0.75rem;
}

.forecast-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(2px, 1vw, 6px);
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.2rem, 1vw, 0.35rem);
  background: var(--surface2);
  border-radius: clamp(8px, 2vw, 12px);
  padding: clamp(0.4rem, 1.5vw, 0.6rem) clamp(0.1rem, 0.5vw, 0.25rem);
}

.f-dow {
  font-size: clamp(0.55rem, 1.5vw, 0.65rem);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--muted);
}
.f-icon { font-size: clamp(0.9rem, 3vw, 1.2rem); }
.f-max { font-size: clamp(0.7rem, 2vw, 0.85rem); font-weight: 500; }
.f-min { font-size: clamp(0.65rem, 1.8vw, 0.75rem); color: var(--muted); }

/* Tablet+ adjustments */
@media (min-width: 480px) {
  .forecast-row { gap: 6px; }
}
</style>
