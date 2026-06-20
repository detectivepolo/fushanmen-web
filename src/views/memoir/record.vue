<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><polyline points="15 18 9 12 15 6" /></svg>
      </span>
      <h1>{{ pageTitle }}</h1>
      <span class="step-indicator">{{ currentStep }}/{{ totalSteps }}</span>
    </header>

    <div class="page-content">
      <!-- ========== 模式：我眼中的XX — 步骤1：选人 ========== -->
      <div v-show="isPerspective && currentStep === 1" class="step-content fade-in">
        <div class="step-title">选择你要写的人</div>
        <div class="member-list">
          <div v-for="member in otherMembers" :key="member.id" class="member-option" :class="{ selected: selectedSubject?.id === member.id }" @click="selectedSubject = member">
            <div class="option-avatar" :style="member.avatar ? { backgroundImage: `url(${member.avatar})` } : {}"><span v-if="!member.avatar">{{ member.name.charAt(0) }}</span></div>
            <span class="option-name">{{ member.name }}</span>
          </div>
        </div>
        <button class="btn-primary btn-block" :disabled="!selectedSubject" @click="nextStep">下一步</button>
      </div>

      <!-- ========== 步骤（录音或写作） ========== -->
      <!-- 自录模式：步骤1 / 视角模式：步骤2 -->
      <div v-show="(isPerspective ? currentStep === 2 : currentStep === 1) && !submitted" class="step-content fade-in">
        <div class="step-title">{{ isPerspective ? `写「我眼中的${selectedSubject?.name}」` : '开始讲述你的回忆' }}</div>

        <!-- 录音 -->
        <div class="input-section">
          <div class="input-label">录音</div>
          <RecordButton hint="点击按钮开始录音" tips="对准麦克风，语速适中" @stop="onRecordingStop" @error="onRecordError" />
          <div class="recording-preview" v-if="audioBlob">
            <AudioPlayer :src="audioUrl" />
            <button class="btn-link" @click="reRecord">重新录制</button>
          </div>
        </div>

        <!-- 或直接写文字 -->
        <div class="input-section">
          <div class="input-label">或直接写文字</div>
          <textarea v-model="manualText" class="form-textarea" :placeholder="isPerspective ? `写下你眼中的${selectedSubject?.name}……` : '写下你的回忆……'" rows="5"></textarea>
        </div>

        <!-- 添加照片 -->
        <div class="input-section">
          <div class="input-label">添加照片（可选）</div>
          <PhotoUploader v-model="photos" :max-count="9" trigger-text="添加照片" />
        </div>

        <!-- 标题 -->
        <div class="input-section">
          <div class="input-label">标题</div>
          <input v-model="title" type="text" class="form-input" placeholder="起个标题" maxlength="30" />
        </div>

        <button class="btn-primary btn-block" :disabled="!title.trim() || (!audioBlob && !manualText.trim())" @click="generatePreview">AI润色预览</button>
      </div>

      <!-- ========== AI润色预览 + 整合 ========== -->
      <div v-show="aiStepVisible && !submitted" class="step-content fade-in">
        <div class="step-title">AI润色预览</div>

        <div class="ai-loading" v-if="aiLoading">
          <div class="loading-spinner"></div>
          <p>AI正在整理这段回忆...</p>
        </div>

        <template v-else>
          <div class="transcript-preview">
            <div class="transcript-text" v-html="renderedTranscript"></div>
          </div>

          <!-- 整合选择（仅自录模式） -->
          <div class="merge-choice" v-if="!isPerspective">
            <div class="merge-question">是否将本段整合到你的完整回忆录？</div>
            <div class="merge-options">
              <button class="merge-btn merge-yes" :class="{ active: mergeChoice === true }" @click="mergeChoice = true">整合</button>
              <button class="merge-btn merge-no" :class="{ active: mergeChoice === false }" @click="mergeChoice = false">不整合</button>
            </div>
            <p class="merge-hint" v-if="mergeChoice === true">本段将拼接到你的完整回忆录末尾</p>
            <p class="merge-hint" v-else-if="mergeChoice === false">保留为独立段落</p>
          </div>

          <button class="btn-primary btn-block" @click="submitMemoir">完成</button>
        </template>
      </div>

      <!-- 成功提示 -->
      <div v-if="submitted" class="success-overlay">
        <div class="success-content">
          <div class="success-check">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="48" height="48"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2>保存成功</h2>
          <p v-if="isPerspective">「我眼中的{{ selectedSubject?.name }}」已保存</p>
          <p v-else-if="mergeChoice">已整合到你的完整回忆录</p>
          <p v-else>已保存为独立段落</p>
          <div class="success-actions">
            <button class="btn-primary" @click="goToDetail">查看回忆</button>
            <button class="btn-text" @click="goToHome">返回首页</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { useUserStore } from '@/store/user'
import RecordButton from '@/components/RecordButton.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import PhotoUploader from '@/components/PhotoUploader.vue'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const familyStore = useFamilyStore()
const userStore = useUserStore()

// ===== 模式判断 =====
const isPerspective = computed(() => route.query.mode === 'perspective')
const pageTitle = computed(() => isPerspective.value ? `我眼中的${route.query.subjectName || '家人'}` : '录制回忆')

// ===== 步骤管理 =====
const currentStep = ref(1)
const totalSteps = computed(() => isPerspective.value ? 3 : 2) // 视角: 选人→内容→AI预览 / 自录: 内容→AI预览

const aiStepVisible = computed(() => {
  if (isPerspective.value) return currentStep.value === 3
  return currentStep.value === 2
})

// ===== 数据 =====
const selectedSubject = ref(null)
const audioBlob = ref(null)
const audioUrl = ref('')
const photos = ref([])
const title = ref('')
const manualText = ref('')
const submitted = ref(false)
const savedMemoirId = ref('')
const aiLoading = ref(false)
const transcript = ref('')
const mergeChoice = ref(null)

const otherMembers = computed(() => {
  const all = familyStore.getMembers()
  return all.filter(m => m.name !== userStore.userInfo.name)
})

// 初始化：如果是视角模式且带了subjectId，直接预选
if (isPerspective.value && route.query.subjectId) {
  const m = familyStore.getMemberById(route.query.subjectId)
  if (m) {
    selectedSubject.value = m
    currentStep.value = 2 // 跳过选人步骤
  }
}

const renderedTranscript = computed(() => {
  if (!transcript.value) return ''
  return transcript.value
    .replace(/^## (.+)$/gm, '<h3 class="tr-h3">$1</h3>')
    .replace(/^录制于 (.+)$/gm, '<p class="tr-date">$1</p>')
    .replace(/^关键词：(.+)$/gm, '<p class="tr-tag">关键词：$1</p>')
    .replace(/^讲述：(.+)$/gm, '<p class="tr-narrator">讲述：$1</p>')
    .replace(/^---$/gm, '<hr class="tr-divider">')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<)/gm, '<p>')
    .replace(/(?<!>)$/, '</p>')
})

function goBack() {
  if (currentStep.value > 1) currentStep.value--
  else router.back()
}

function nextStep() { currentStep.value++ }

function onRecordingStop(data) { audioBlob.value = data.blob; audioUrl.value = data.url }
function onRecordError(msg) { showToast(msg) }
function reRecord() { audioBlob.value = null; audioUrl.value = '' }

function generatePreview() {
  if (isPerspective.value) currentStep.value = 3
  else currentStep.value = 2
  aiLoading.value = true
  transcript.value = ''
  mergeChoice.value = null
  setTimeout(() => { aiLoading.value = false }, 1500)
}

function submitMemoir() {
  // 如果有手写文本，直接用作transcript
  const useManual = manualText.value.trim() && !audioBlob.value

  const memoirData = {
    title: title.value,
    audioUrl: audioUrl.value,
    duration: audioBlob.value ? Math.round(audioBlob.value.size / 1024) : 0,
    photos: photos.value,
    author: { id: userStore.userInfo.id, name: userStore.displayName },
    protagonist: { id: userStore.userInfo.id, name: userStore.displayName },
    tags: []
  }

  if (isPerspective.value) {
    memoirData.type = 'perspective'
    memoirData.subject = { id: selectedSubject.value.id, name: selectedSubject.value.name }
  } else {
    memoirData.type = 'self'
  }

  const memoir = familyStore.addMemoir(memoirData)

  // 如果有手写文本，覆盖mock transcript
  if (useManual) {
    familyStore.updateMemoir(memoir.id, {
      transcript: `## ${title.value}\n\n${manualText.value}`
    })
  }

  transcript.value = useManual ? `## ${title.value}\n\n${manualText.value}` : memoir.transcript

  if (!isPerspective.value && mergeChoice.value === true) {
    familyStore.mergeMemoir(memoir.id)
  }

  savedMemoirId.value = memoir.id
  submitted.value = true
}

function goToDetail() { router.replace({ path: '/memoir-detail', query: { id: savedMemoirId.value } }) }
function goToHome() { router.replace('/') }
</script>

<style scoped>
.page-header { background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 60%, #9CC5A8 100%); color: white; padding: var(--spacing-lg) var(--spacing-base); display: flex; align-items: center; gap: var(--spacing-sm); }
.back-btn { display: flex; cursor: pointer; }
.page-header h1 { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; flex: 1; }
.step-indicator { font-size: var(--font-size-sm); opacity: 0.8; }

.step-content { max-width: 100%; }
.step-title { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--text-color-primary); margin-bottom: var(--spacing-xl); }

/* 选人列表 */
.member-list { display: flex; flex-direction: column; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl); }
.member-option { display: flex; align-items: center; gap: var(--spacing-base); padding: var(--spacing-base); background: var(--bg-color-card); border-radius: var(--radius-lg); border: 2px solid transparent; cursor: pointer; transition: all 0.3s; box-shadow: var(--shadow-sm); }
.member-option.selected { border-color: var(--primary-color); background: var(--bg-color-warm); }
.option-avatar { width: 44px; height: 44px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); background-size: cover; background-position: center; color: white; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-md); font-weight: 600; flex-shrink: 0; }
.option-name { font-size: var(--font-size-base); font-weight: 500; color: var(--text-color-primary); }

/* 输入区 */
.input-section { margin-bottom: var(--spacing-lg); }
.input-label { font-size: var(--font-size-sm); font-weight: 500; color: var(--text-color-secondary); margin-bottom: var(--spacing-sm); }
.form-textarea { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-card); color: var(--text-color-primary); box-sizing: border-box; resize: vertical; min-height: 100px; line-height: 1.6; }
.form-textarea:focus { outline: none; border-color: var(--primary-color); }
.form-input { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-card); color: var(--text-color-primary); box-sizing: border-box; }
.form-input:focus { outline: none; border-color: var(--primary-color); }

.recording-preview { margin-top: var(--spacing-base); }
.btn-link { display: block; width: 100%; margin-top: var(--spacing-sm); background: none; border: none; color: var(--primary-color); font-size: var(--font-size-base); cursor: pointer; text-align: center; }

.btn-primary { display: block; width: 100%; padding: var(--spacing-base); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; margin-top: var(--spacing-base); }
.btn-primary:active { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-block { width: 100%; }

/* AI加载 */
.ai-loading { text-align: center; padding: var(--spacing-2xl) 0; }
.loading-spinner { width: 48px; height: 48px; border: 3px solid var(--border-color-warm); border-top-color: var(--primary-color); border-radius: 50%; margin: 0 auto var(--spacing-base); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.ai-loading p { font-size: var(--font-size-base); color: var(--text-color-secondary); }

/* transcript预览 */
.transcript-preview { background: var(--bg-color-card); border-radius: var(--radius-lg); padding: var(--spacing-lg); box-shadow: var(--shadow-card); margin-bottom: var(--spacing-lg); border-left: 3px solid var(--primary-soft); }
.transcript-text { font-size: var(--font-size-sm); line-height: 1.8; color: var(--text-color-primary); }
:deep(.tr-h3) { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--primary-color); margin-bottom: var(--spacing-sm); }
:deep(.tr-date) { font-size: var(--font-size-xs); color: var(--text-color-light); margin-bottom: var(--spacing-sm); }
:deep(.tr-tag), :deep(.tr-narrator) { font-size: var(--font-size-xs); color: var(--text-color-secondary); margin-top: var(--spacing-xs); }
:deep(.tr-divider) { border: none; border-top: 1px dashed var(--border-color-warm); margin: var(--spacing-base) 0; }

/* 整合选择 */
.merge-choice { background: var(--bg-color-warm); border-radius: var(--radius-lg); padding: var(--spacing-lg); margin-bottom: var(--spacing-lg); }
.merge-question { font-size: var(--font-size-base); font-weight: 500; color: var(--text-color-primary); margin-bottom: var(--spacing-base); }
.merge-options { display: flex; gap: var(--spacing-base); }
.merge-btn { flex: 1; padding: var(--spacing-base); border: 2px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-card); font-size: var(--font-size-base); font-weight: 500; color: var(--text-color-secondary); cursor: pointer; transition: all 0.3s; }
.merge-yes.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
.merge-no.active { background: var(--bg-color-secondary); color: var(--text-color-primary); border-color: var(--text-color-secondary); }
.merge-hint { font-size: var(--font-size-sm); color: var(--text-color-secondary); margin-top: var(--spacing-sm); text-align: center; }

/* 成功提示 */
.success-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.98); display: flex; align-items: center; justify-content: center; z-index: var(--z-index-modal); }
.success-content { text-align: center; padding: var(--spacing-2xl); }
.success-check { width: 80px; height: 80px; border-radius: 50%; background: var(--primary-bg); color: var(--primary-color); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-lg); }
.success-content h2 { font-family: var(--font-serif); font-size: var(--font-size-2xl); font-weight: 600; color: var(--text-color-primary); margin-bottom: var(--spacing-sm); }
.success-content p { font-size: var(--font-size-base); color: var(--text-color-secondary); }
.success-actions { display: flex; flex-direction: column; align-items: center; gap: var(--spacing-sm); margin-top: var(--spacing-lg); }
.btn-text { background: none; border: none; color: var(--text-color-light); font-size: var(--font-size-base); cursor: pointer; padding: var(--spacing-sm); }

.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
