<template>
  <div class="photo-uploader">
    <div class="upload-list" v-if="modelValue.length > 0">
      <div 
        v-for="(photo, index) in modelValue" 
        :key="index"
        class="upload-item"
      >
        <img :src="photo" alt="照片" />
        <span class="delete-btn" @click="removePhoto(index)">×</span>
      </div>
    </div>
    <div 
      v-if="modelValue.length < maxCount"
      class="upload-trigger"
      @click="triggerUpload"
    >
      <span class="upload-icon">📷</span>
      <span class="upload-text">{{ triggerText }}</span>
    </div>
    <input 
      ref="fileInput"
      type="file" 
      accept="image/*"
      multiple
      @change="handleFileChange"
      style="display: none"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  maxCount: {
    type: Number,
    default: 9
  },
  triggerText: {
    type: String,
    default: '添加照片'
  }
})

const emit = defineEmits(['update:modelValue'])
const fileInput = ref(null)
const isProcessing = ref(false)

function triggerUpload() {
  if (!isProcessing.value && fileInput.value) {
    fileInput.value.click()
  }
}

// 压缩图片，防止 localStorage 溢出
function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width)
          width = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

async function handleFileChange(event) {
  const files = event.target.files
  if (!files || files.length === 0) return

  isProcessing.value = true
  const newPhotos = [...props.modelValue]

  for (const file of Array.from(files)) {
    if (newPhotos.length >= props.maxCount) break
    try {
      const compressed = await compressImage(file)
      newPhotos.push(compressed)
    } catch (e) {
      console.error('图片处理失败:', e)
    }
  }

  emit('update:modelValue', newPhotos)
  isProcessing.value = false
  event.target.value = ''
}

function removePhoto(index) {
  const newPhotos = [...props.modelValue]
  newPhotos.splice(index, 1)
  emit('update:modelValue', newPhotos)
}
</script>

<style scoped>
.photo-uploader {
  width: 100%;
}

.upload-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-base);
}

.upload-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.upload-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-color-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.upload-trigger:active {
  border-color: var(--primary-color);
  opacity: 0.7;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: var(--spacing-xs);
}

.upload-text {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}
</style>
