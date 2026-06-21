<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>回忆详情</h1>
    </header>

    <div class="page-content" v-if="memoir">
      <!-- 回忆信息 -->
      <div class="memoir-hero">
        <h1 class="memoir-title" v-if="!isEditing">{{ memoir.title }}</h1>
        <input v-else v-model="editData.title" class="hero-edit-input" placeholder="回忆标题" />
        <div class="memoir-meta">
          <span class="protagonist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            讲述 {{ memoir.protagonist?.name || '家人' }} 的故事
          </span>
        </div>
        <div class="memoir-tags">
          <span v-for="tag in (isEditing ? editTags : memoir.tags)" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="memoir-status" v-if="memoir.merged">
          <span class="status-badge merged">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="20 6 9 17 4 12" /></svg>
            已整合到完整回忆录
          </span>
        </div>
        <div class="memoir-status" v-else>
          <span class="status-badge standalone">独立段落</span>
        </div>
      </div>

      <!-- 音频播放器 -->
      <div class="player-section" v-if="memoir.audioUrl">
        <AudioPlayer :src="memoir.audioUrl" />
      </div>

      <!-- AI润色文本 -->
      <div class="transcript-section" v-if="!isEditing && memoir.transcript">
        <div class="section-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
          <span class="section-title">正文</span>
        </div>
        <div class="transcript-content" v-html="renderedTranscript"></div>
      </div>

      <!-- 编辑模式 -->
      <div class="transcript-section" v-if="isEditing">
        <div class="section-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          <span class="section-title">编辑正文</span>
        </div>
        <textarea v-model="editData.transcript" class="edit-textarea" rows="10"></textarea>
        <div class="edit-tags-row">
          <label class="form-label">标签（逗号分隔）</label>
          <input v-model="editData.tagsInput" class="form-input" placeholder="例如：童年、老家" />
        </div>
      </div>

      <!-- 照片展示 -->
      <div class="photos-section" v-if="!isEditing && memoir.photos && memoir.photos.length > 0">
        <div class="section-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          <span class="section-title">相关照片</span>
        </div>
        <div class="photo-grid">
          <img v-for="(photo, index) in memoir.photos" :key="index" :src="photo" alt="照片" class="photo-item" @click="previewPhoto(index)" />
        </div>
      </div>

      <!-- 查看完整回忆录 -->
      <div class="combined-link" v-if="!isEditing && hasCombinedMemoir" @click="goToCombined">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9 13" x2="15 13" /><line x1="9 17" x2="13 17" /></svg>
        <div class="combined-info">
          <span class="combined-title">查看{{ memoir.protagonist?.name }}的完整回忆录</span>
          <span class="combined-desc">{{ combinedSegmentCount }}段回忆已整合</span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
      </div>

      <!-- 发布信息 -->
      <div class="publish-info" v-if="!isEditing">
        <div class="author-card">
          <div class="author-avatar">{{ memoir.author?.name?.charAt(0) || '?' }}</div>
          <div class="author-info">
            <span class="author-name">{{ memoir.author?.name || '未知' }}</span>
            <span class="publish-time">{{ formatTime(memoir.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="!isEditing">
        <button class="action-btn" @click="shareMemoir">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          分享
        </button>
        <button class="action-btn" v-if="!memoir.merged" @click="mergeNow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9 13" x2="15 13" /></svg>
          整合
        </button>
        <button class="action-btn" @click="startEdit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          编辑
        </button>
        <button class="action-btn danger" @click="confirmDelete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          删除
        </button>
      </div>

      <!-- 编辑模式按钮 -->
      <div class="action-buttons" v-if="isEditing">
        <button class="action-btn primary" @click="saveEdit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12" /></svg>
          保存
        </button>
        <button class="action-btn" @click="cancelEdit">
          取消
        </button>
      </div>
    </div>

    <div class="not-found" v-else>
      <p>回忆不存在</p>
      <button class="btn-back" @click="goBack">返回</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import AudioPlayer from '@/components/AudioPlayer.vue'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const familyStore = useFamilyStore()

const memoir = computed(() => {
  const id = route.query.id
  return id ? familyStore.getMemoirById(id) : null
})

const isEditing = ref(false)
const editData = ref({ title: '', transcript: '', tagsInput: '' })

function startEdit() {
  const m = memoir.value
  editData.value = {
    title: m.title || '',
    transcript: m.transcript || '',
    tagsInput: (m.tags || []).join('、')
  }
  isEditing.value = true
}

function cancelEdit() { isEditing.value = false }

function saveEdit() {
  if (!editData.value.title.trim()) { showToast('请输入标题'); return }
  const tags = editData.value.tagsInput.split(/[、,，]/).map(t => t.trim()).filter(Boolean)
  familyStore.updateMemoir(memoir.value.id, {
    title: editData.value.title.trim(),
    transcript: editData.value.transcript,
    tags
  })
  isEditing.value = false
  showToast('修改成功')
}

function confirmDelete() {
  showConfirmDialog({ title: '确认删除', message: `确定要删除「${memoir.value.title}」吗？此操作不可撤销。` })
    .then(() => { familyStore.deleteMemoir(memoir.value.id); showToast('已删除'); router.back() })
    .catch(() => {})
}

// 渲染transcript
const renderedTranscript = computed(() => {
  const text = memoir.value?.transcript || ''
  if (!text) return ''
  return text
    .replace(/^## (.+)$/gm, '<h3 class="tr-h3">$1</h3>')
    .replace(/^---$/gm, '<hr class="tr-divider">')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<)/gm, '<p>')
    .replace(/(?<!>)$/, '</p>')
})

// 是否有完整回忆录
const combinedMemoir = computed(() => {
  if (!memoir.value?.protagonist?.id) return null
  return familyStore.getCombinedMemoir(memoir.value.protagonist.id)
})

const hasCombinedMemoir = computed(() => combinedMemoir.value && combinedMemoir.value.count > 0)
const combinedSegmentCount = computed(() => combinedMemoir.value?.count || 0)

function goBack() { router.back() }

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${year}年${month}月${day}日 ${hour}:${minute}`
}

function previewPhoto(index) {
  showToast(`查看第 ${index + 1} 张照片`)
}

function shareMemoir() {
  if (navigator.share) {
    navigator.share({
      title: memoir.value.title,
      text: `来看看${memoir.value.protagonist?.name}的回忆`,
      url: window.location.href
    })
  } else {
    showToast('链接已复制')
  }
}

function mergeNow() {
  familyStore.mergeMemoir(memoir.value.id)
  showToast('已整合到完整回忆录')
}

function goToCombined() {
  router.push({ path: '/memoir-combined', query: { id: memoir.value.protagonist.id } })
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: var(--spacing-sm); background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 60%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.back-btn { font-size: var(--font-size-2xl); cursor: pointer; line-height: 1; }
.page-header h1 { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.05em; }

.memoir-hero { background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); border-radius: var(--radius-xl); padding: var(--spacing-lg); color: white; margin-bottom: var(--spacing-lg); }
.memoir-title { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--spacing-sm); }
.hero-edit-input { width: 100%; font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 600; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); border-radius: var(--radius-md); color: white; padding: var(--spacing-sm) var(--spacing-base); margin-bottom: var(--spacing-sm); box-sizing: border-box; }
.hero-edit-input::placeholder { color: rgba(255,255,255,0.6); }
.hero-edit-input:focus { outline: none; border-color: white; }
.memoir-meta { display: flex; flex-wrap: wrap; gap: var(--spacing-base); font-size: var(--font-size-sm); opacity: 0.9; margin-bottom: var(--spacing-sm); }
.protagonist { display: flex; align-items: center; gap: 4px; }
.memoir-tags { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); margin-bottom: var(--spacing-sm); }
.tag { padding: 2px 10px; background: rgba(255, 255, 255, 0.2); border-radius: var(--radius-full); font-size: var(--font-size-xs); }
.memoir-status { margin-top: var(--spacing-xs); }
.status-badge { font-size: var(--font-size-xs); padding: 2px 10px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 4px; }
.status-badge.merged { background: rgba(255, 255, 255, 0.25); }
.status-badge.standalone { background: rgba(255, 255, 255, 0.15); opacity: 0.8; }

.player-section { margin-bottom: var(--spacing-lg); }

.transcript-section { background: var(--bg-color-card); border-radius: var(--radius-lg); padding: var(--spacing-lg); margin-bottom: var(--spacing-lg); box-shadow: var(--shadow-card); border-left: 3px solid var(--primary-soft); }
.section-title-row { display: flex; align-items: center; gap: var(--spacing-xs); margin-bottom: var(--spacing-base); color: var(--text-color-primary); }
.section-title { font-family: var(--font-serif); font-size: var(--font-size-md); font-weight: 600; color: var(--text-color-primary); }
.transcript-content { font-size: var(--font-size-sm); line-height: 1.8; color: var(--text-color-primary); }
.edit-textarea { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-sm); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-secondary); color: var(--text-color-primary); box-sizing: border-box; resize: vertical; line-height: 1.6; font-family: inherit; }
.edit-textarea:focus { outline: none; border-color: var(--primary-color); }
.edit-tags-row { margin-top: var(--spacing-base); text-align: left; }
.form-label { display: block; font-size: var(--font-size-sm); color: var(--text-color-secondary); margin-bottom: var(--spacing-xs); }
.form-input { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-secondary); color: var(--text-color-primary); box-sizing: border-box; }
.form-input:focus { outline: none; border-color: var(--primary-color); }

:deep(.tr-h3) { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--primary-color); margin-bottom: var(--spacing-sm); }
:deep(.tr-divider) { border: none; border-top: 1px dashed var(--border-color-warm); margin: var(--spacing-base) 0; }

.photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-sm); }
.photo-item { aspect-ratio: 1; border-radius: var(--radius-md); object-fit: cover; cursor: pointer; }
.photos-section { margin-bottom: var(--spacing-lg); }

.combined-link { display: flex; align-items: center; gap: var(--spacing-base); background: var(--bg-color-warm); border-radius: var(--radius-lg); padding: var(--spacing-base); margin-bottom: var(--spacing-lg); cursor: pointer; transition: all 0.3s; color: var(--primary-color); }
.combined-link:active { transform: scale(0.98); }
.combined-info { flex: 1; display: flex; flex-direction: column; }
.combined-title { font-family: var(--font-serif); font-size: var(--font-size-base); font-weight: 600; color: var(--primary-color); }
.combined-desc { font-size: var(--font-size-xs); color: var(--text-color-light); }

.publish-info { margin-bottom: var(--spacing-lg); }
.author-card { display: flex; align-items: center; background: var(--bg-color-card); border-radius: var(--radius-lg); padding: var(--spacing-base); }
.author-avatar { width: 48px; height: 48px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-lg); font-weight: 600; margin-right: var(--spacing-base); }
.author-info { display: flex; flex-direction: column; }
.author-name { font-size: var(--font-size-base); font-weight: 600; color: var(--text-color-primary); }
.publish-time { font-size: var(--font-size-sm); color: var(--text-color-light); }

.action-buttons { display: flex; gap: var(--spacing-sm); }
.action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--spacing-xs); padding: var(--spacing-base); background: var(--bg-color-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); font-size: var(--font-size-sm); color: var(--text-color-primary); cursor: pointer; transition: all 0.3s; }
.action-btn:active { transform: scale(0.98); background: var(--bg-color-secondary); }
.action-btn.danger { color: var(--danger-color); border-color: var(--danger-color); }
.action-btn.danger:active { background: var(--danger-color); color: white; }
.action-btn.primary { background: var(--primary-color); color: white; border-color: var(--primary-color); }

.not-found { text-align: center; padding: var(--spacing-3xl); }
.btn-back { margin-top: var(--spacing-base); padding: var(--spacing-base) var(--spacing-xl); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); cursor: pointer; }
</style>
