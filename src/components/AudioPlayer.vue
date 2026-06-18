<template>
  <div class="audio-player" :class="{ playing: isPlaying }">
    <div class="player-main">
      <button class="play-btn" @click="togglePlay">
        {{ isPlaying ? '⏸️' : '▶️' }}
      </button>
      <div class="progress-section">
        <div class="time-display">
          <span class="current-time">{{ formatTime(currentTime) }}</span>
          <span class="divider">/</span>
          <span class="total-time">{{ formatTime(duration) }}</span>
        </div>
        <div class="progress-bar" @click="seek">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioRef" :src="src" @timeupdate="onTimeUpdate" @ended="onEnded"></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  autoPlay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['timeUpdate', 'ended'])

const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const progress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

function togglePlay() {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

function seek(event) {
  if (!audioRef.value || duration.value === 0) return
  
  const rect = event.currentTarget.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  audioRef.value.currentTime = percent * duration.value
}

function onTimeUpdate() {
  if (audioRef.value) {
    currentTime.value = audioRef.value.currentTime
    emit('timeUpdate', currentTime.value)
  }
}

function onEnded() {
  isPlaying.value = false
  currentTime.value = 0
  emit('ended')
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 监听音频元素
onMounted(() => {
  if (audioRef.value) {
    audioRef.value.addEventListener('loadedmetadata', () => {
      duration.value = audioRef.value.duration
    })
    
    if (props.autoPlay) {
      audioRef.value.play()
      isPlaying.value = true
    }
  }
})

watch(() => props.src, () => {
  isPlaying.value = false
  currentTime.value = 0
})
</script>

<style scoped>
.audio-player {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
}

.player-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
}

.play-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border: none;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s;
}

.play-btn:active {
  transform: scale(0.95);
}

.progress-section {
  flex: 1;
  min-width: 0;
}

.time-display {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.time-display .divider {
  margin: 0 4px;
  color: var(--text-color-light);
}

.progress-bar {
  cursor: pointer;
  padding: 8px 0;
}

.progress-track {
  height: 4px;
  background: var(--border-color);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-full);
  transition: width 0.1s linear;
}
</style>
