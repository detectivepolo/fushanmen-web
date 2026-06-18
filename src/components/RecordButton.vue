<template>
  <div class="record-button-container">
    <div class="record-hint" v-if="hint">
      {{ hint }}
    </div>
    <div class="record-wrapper">
      <button 
        class="record-btn breathe-animation"
        :class="{ recording: isRecording }"
        @mousedown="startRecording"
        @mouseup="stopRecording"
        @mouseleave="stopRecording"
        @touchstart.prevent="startRecording"
        @touchend.prevent="stopRecording"
        @touchcancel="stopRecording"
      >
        <span class="record-icon">{{ isRecording ? '⏹️' : '🎙️' }}</span>
      </button>
      <div class="record-timer" v-if="isRecording || duration > 0">
        <span class="timer-dot" :class="{ active: isRecording }"></span>
        {{ formatTime(duration) }}
      </div>
    </div>
    <div class="record-tips" v-if="tips">
      {{ tips }}
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  hint: {
    type: String,
    default: '长按按钮开始录音'
  },
  tips: {
    type: String,
    default: '请对准麦克风，吐字清晰'
  }
})

const emit = defineEmits(['start', 'stop', 'error'])

const isRecording = ref(false)
const duration = ref(0)
const mediaRecorder = ref(null)
const audioChunks = ref([])
const timer = ref(null)

// 检查浏览器支持
const isSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}

async function startRecording() {
  if (isRecording.value) return
  
  if (!isSupported()) {
    emit('error', '您的浏览器不支持录音功能')
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    // 优先使用 MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
      ? 'audio/webm' 
      : 'audio/mp4'
    
    mediaRecorder.value = new MediaRecorder(stream, { mimeType })
    audioChunks.value = []

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data)
      }
    }

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: mimeType })
      const audioUrl = URL.createObjectURL(audioBlob)
      emit('stop', {
        blob: audioBlob,
        url: audioUrl,
        duration: duration.value
      })
      
      // 停止所有轨道
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.value.start()
    isRecording.value = true
    
    // 开始计时
    duration.value = 0
    timer.value = setInterval(() => {
      duration.value++
    }, 1000)

    emit('start')
  } catch (error) {
    console.error('录音失败:', error)
    emit('error', '无法访问麦克风，请检查权限设置')
  }
}

function stopRecording() {
  if (!isRecording.value || !mediaRecorder.value) return

  mediaRecorder.value.stop()
  isRecording.value = false
  
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
  }
})
</script>

<style scoped>
.record-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-2xl) 0;
}

.record-hint {
  font-size: var(--font-size-md);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.record-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-base);
}

.record-btn {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--danger-color), #FF6B6B);
  border: none;
  color: var(--text-color-white);
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(229, 57, 53, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.record-btn:active,
.record-btn.recording {
  transform: scale(0.95);
}

.record-btn.recording {
  background: linear-gradient(135deg, #FF6B6B, var(--danger-color));
  animation: breathe 1s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(229, 57, 53, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 30px rgba(229, 57, 53, 0.6);
  }
}

.record-timer {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  color: var(--text-color-primary);
  font-weight: 500;
}

.timer-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--text-color-light);
}

.timer-dot.active {
  background: var(--danger-color);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.record-tips {
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  text-align: center;
}
</style>
