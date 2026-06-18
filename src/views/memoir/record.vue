<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>录制回忆</h1>
      <span class="step-indicator">步骤 {{ currentStep }}/4</span>
    </header>

    <div class="page-content">
      <!-- 步骤1：选择人物 -->
      <div v-show="currentStep === 1" class="step-content fade-in">
        <div class="step-title">
          <span class="step-icon">👤</span>
          <span>讲述谁的故事？</span>
        </div>
        
        <div class="member-grid">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-option"
            :class="{ selected: selectedProtagonist?.id === member.id }"
            @click="selectProtagonist(member)"
          >
            <div class="option-avatar">
              {{ member.name.charAt(0) }}
            </div>
            <span class="option-name">{{ member.name }}</span>
            <span class="option-relation">{{ member.relation }}</span>
          </div>
        </div>
        
        <button 
          class="btn-primary btn-block mt-xl"
          :disabled="!selectedProtagonist"
          @click="nextStep"
        >
          下一步
        </button>
      </div>

      <!-- 步骤2：录音 -->
      <div v-show="currentStep === 2" class="step-content fade-in">
        <div class="step-title">
          <span class="step-icon">🎙️</span>
          <span>开始讲述</span>
        </div>
        
        <div class="recording-tip">
          请选择{{ selectedProtagonist?.name }}最珍贵的回忆
        </div>
        
        <RecordButton 
          hint="长按按钮开始录音"
          tips="请对准麦克风，吐字清晰，语速适中"
          @stop="onRecordingStop"
          @error="onRecordError"
        />
        
        <div class="recording-preview" v-if="audioBlob">
          <AudioPlayer :src="audioUrl" />
          <button class="btn-link" @click="reRecord">重新录制</button>
        </div>
        
        <button 
          class="btn-primary btn-block mt-xl"
          :disabled="!audioBlob"
          @click="nextStep"
        >
          下一步
        </button>
      </div>

      <!-- 步骤3：选择照片 -->
      <div v-show="currentStep === 3" class="step-content fade-in">
        <div class="step-title">
          <span class="step-icon">📷</span>
          <span>添加照片（可选）</span>
        </div>
        
        <div class="photo-tip">
          上传与回忆相关的照片，让故事更生动
        </div>
        
        <PhotoUploader 
          v-model="photos"
          :max-count="9"
          trigger-text="添加照片"
        />
        
        <button 
          class="btn-primary btn-block mt-xl"
          @click="nextStep"
        >
          下一步
        </button>
      </div>

      <!-- 步骤4：写标题 -->
      <div v-show="currentStep === 4" class="step-content fade-in">
        <div class="step-title">
          <span class="step-icon">✏️</span>
          <span>为这段回忆起个标题</span>
        </div>
        
        <div class="form-group">
          <label class="form-label">标题</label>
          <input 
            v-model="title"
            type="text"
            class="form-input"
            placeholder="例如：爷爷的童年回忆"
            maxlength="30"
          />
          <span class="char-count">{{ title.length }}/30</span>
        </div>
        
        <div class="form-group">
          <label class="form-label">标签（可选）</label>
          <div class="tag-selector">
            <span 
              v-for="tag in availableTags" 
              :key="tag"
              class="tag-option"
              :class="{ selected: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <button 
          class="btn-primary btn-block mt-xl"
          :disabled="!title.trim()"
          @click="submitMemoir"
        >
          完成录制
        </button>
      </div>

      <!-- 成功提示 -->
      <div v-if="submitted" class="success-overlay">
        <div class="success-content">
          <span class="success-icon">🎉</span>
          <h2>回忆录制成功！</h2>
          <p>您的回忆已保存到家族记忆中</p>
          <button class="btn-primary mt-lg" @click="goToHome">
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { useUserStore } from '@/store/user'
import RecordButton from '@/components/RecordButton.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import PhotoUploader from '@/components/PhotoUploader.vue'
import { showToast } from 'vant'

const router = useRouter()
const familyStore = useFamilyStore()
const userStore = useUserStore()

const currentStep = ref(1)
const selectedProtagonist = ref(null)
const audioBlob = ref(null)
const audioUrl = ref('')
const photos = ref([])
const title = ref('')
const selectedTags = ref([])
const submitted = ref(false)

const members = computed(() => familyStore.getMembers())

const availableTags = ['童年', '成长', '趣事', '家庭', '工作', '爱情', '旅行', '节日']

function goBack() {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    router.back()
  }
}

function selectProtagonist(member) {
  selectedProtagonist.value = member
}

function nextStep() {
  currentStep.value++
}

function onRecordingStop(data) {
  audioBlob.value = data.blob
  audioUrl.value = data.url
}

function onRecordError(msg) {
  showToast(msg)
}

function reRecord() {
  audioBlob.value = null
  audioUrl.value = ''
}

function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else if (selectedTags.value.length < 3) {
    selectedTags.value.push(tag)
  }
}

function submitMemoir() {
  const memoir = familyStore.addMemoir({
    title: title.value,
    audioUrl: audioUrl.value,
    duration: audioBlob.value ? Math.round(audioBlob.value.size / 1000) : 0,
    photos: photos.value,
    author: {
      id: userStore.userInfo.id,
      name: userStore.displayName
    },
    protagonist: {
      id: selectedProtagonist.value.id,
      name: selectedProtagonist.value.name
    },
    tags: selectedTags.value
  })
  
  submitted.value = true
}

function goToHome() {
  router.replace('/')
}
</script>

<style scoped>
.step-indicator {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.step-content {
  max-width: 100%;
}

.step-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-xl);
}

.step-icon {
  font-size: var(--font-size-2xl);
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-base);
}

.member-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.member-option.selected {
  border-color: var(--primary-color);
  background: rgba(196, 140, 111, 0.1);
}

.option-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.option-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 2px;
}

.option-relation {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}

.recording-tip {
  font-size: var(--font-size-base);
  color: var(--text-color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.recording-preview {
  margin-top: var(--spacing-xl);
}

.btn-link {
  display: block;
  width: 100%;
  margin-top: var(--spacing-sm);
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: var(--font-size-base);
  cursor: pointer;
  text-align: center;
}

.photo-tip {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.form-label {
  display: block;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.form-input {
  width: 100%;
  padding: var(--spacing-base);
  font-size: var(--font-size-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color-card);
  color: var(--text-color-primary);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.char-count {
  position: absolute;
  right: var(--spacing-base);
  bottom: var(--spacing-base);
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-option {
  padding: var(--spacing-xs) var(--spacing-base);
  background: var(--bg-color-secondary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.tag-option.selected {
  background: var(--primary-color);
  color: white;
}

.btn-block {
  width: 100%;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal);
}

.success-content {
  text-align: center;
  padding: var(--spacing-2xl);
}

.success-icon {
  font-size: 80px;
  display: block;
  margin-bottom: var(--spacing-lg);
}

.success-content h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.success-content p {
  font-size: var(--font-size-base);
  color: var(--text-color-secondary);
}
</style>
