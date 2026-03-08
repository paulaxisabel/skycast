<template>
  <div class="search-wrap">
    <div class="search-box" :class="{ focused }">
      <span class="search-icon">⌕</span>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="Search another city..."
        @focus="focused = true"
        @blur="focused = false"
        @keydown.enter="submit"
      />
      <button class="locate-btn" title="Use my location" @click="$emit('locate')">
        📍
      </button>
      <button class="go-btn" @click="submit" :disabled="!query.trim()">
        GO
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'locate'])
const query = ref('')
const focused = ref(false)

function submit() {
  if (query.value.trim()) {
    emit('search', query.value.trim())
  }
}
</script>

<style scoped>
.search-wrap {
  display: flex;
  justify-content: center;
  padding: clamp(1rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem) 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 50px;
  padding: 0.45rem 0.45rem 0.45rem clamp(0.75rem, 3vw, 1.25rem);
  width: 100%;
  max-width: 480px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box.focused {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(232, 255, 71, 0.1);
}

.search-icon {
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: var(--muted);
  line-height: 1;
  flex-shrink: 0;
}

input {
  flex: 1;
  min-width: 0;
  background: none;
  border: none;
  outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  color: var(--text);
  font-weight: 400;
}

input::placeholder { color: var(--muted); }

.locate-btn {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: clamp(30px, 7vw, 34px);
  height: clamp(30px, 7vw, 34px);
  font-size: clamp(0.8rem, 2.5vw, 0.95rem);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.1s;
  flex-shrink: 0;
}

.locate-btn:hover {
  background: rgba(232, 255, 71, 0.1);
  transform: scale(0.96);
}

.go-btn {
  background: var(--accent);
  color: #0a0a0f;
  border: none;
  border-radius: 50px;
  padding: clamp(0.35rem, 1.5vw, 0.45rem) clamp(0.75rem, 3vw, 1.2rem);
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  flex-shrink: 0;
  white-space: nowrap;
}

.go-btn:hover:not(:disabled) {
  opacity: 0.85;
  transform: scale(0.98);
}

.go-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
</style>
