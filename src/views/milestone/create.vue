<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>记录大事</h1>
    </header>

    <div class="page-content">
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📝</span>
            事件标题
          </label>
          <input 
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="例如：2024年春节团圆"
            maxlength="50"
          />
          <span class="char-count">{{ form.title.length }}/50</span>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📅</span>
            发生日期
          </label>
          <input 
            v-model="form.date"
            type="date"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📍</span>
            地点
          </label>
          <input 
            v-model="form.location"
            type="text"
            class="form-input"
            placeholder="例如：老家、酒店"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">💬</span>
            事件描述
          </label>
          <textarea 
            v-model="form.description"
            class="form-textarea"
            placeholder="详细描述这个重要时刻..."
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">👥</span>
            参与人员
          </label>
          <div class="participant-list">
            <div 
              v-for="(participant, index) in form.participants" 
              :key="index"
              class="participant-item"
            >
              <span>{{ participant }}</span>
              <span class="remove-btn" @click="removeParticipant(index)">×</span>
            </div>
          </div>
          <div class="add-participant">
            <input 
              v-model="newParticipant"
              type="text"
              class="form-input"
              placeholder="添加参与人员姓名"
              @keyup.enter="addParticipant"
            />
            <button class="add-btn" @click="addParticipant">添加</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📷</span>
            相关照片
          </label>
          <PhotoUploader 
            v-model="form.photos"
            :max-count="9"
            trigger-text="添加照片"
          />
        </div>
      </div>

      <button 
        class="btn-primary btn-block mt-xl"
        :disabled="!canSubmit"
        @click="submit"
      >
        保存记录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { useUserStore } from '@/store/user'
import PhotoUploader from '@/components/PhotoUploader.vue'
import { showToast } from 'vant'

const router = useRouter()
const familyStore = useFamilyStore()
const userStore = useUserStore()

const form = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  location: '',
  description: '',
  participants: [],
  photos: []
})

const newParticipant = ref('')

const canSubmit = computed(() => {
  return form.value.title.trim() && form.value.date
})

function goBack() {
  router.back()
}

function addParticipant() {
  const name = newParticipant.value.trim()
  if (name && !form.value.participants.includes(name)) {
    form.value.participants.push(name)
    newParticipant.value = ''
  }
}

function removeParticipant(index) {
  form.value.participants.splice(index, 1)
}

function submit() {
  if (!canSubmit.value) return

  familyStore.addMilestone({
    ...form.value,
    createdBy: userStore.userInfo.id
  })

  showToast('记录成功')
  router.replace('/milestone')
}
</script>

<style scoped>
.form-section {
  background: var(--bg-color-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-xl);
  position: relative;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.label-icon {
  font-size: var(--font-size-lg);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--spacing-base);
  font-size: var(--font-size-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color);
  color: var(--text-color-primary);
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  resize: none;
}

.char-count {
  position: absolute;
  right: var(--spacing-base);
  bottom: var(--spacing-base);
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}

.participant-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.participant-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--primary-light);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
}

.remove-btn {
  cursor: pointer;
  opacity: 0.8;
}

.remove-btn:hover {
  opacity: 1;
}

.add-participant {
  display: flex;
  gap: var(--spacing-sm);
}

.add-participant .form-input {
  flex: 1;
}

.add-btn {
  padding: 0 var(--spacing-base);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.btn-block {
  width: 100%;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
