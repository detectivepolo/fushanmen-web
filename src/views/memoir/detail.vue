<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>回忆详情</h1>
    </header>

    <div class="page-content" v-if="memoir">
      <!-- 回忆信息 -->
      <div class="memoir-hero">
        <h1 class="memoir-title">{{ memoir.title }}</h1>
        <div class="memoir-meta">
          <span class="protagonist">
            <span class="meta-icon">👤</span>
            讲述 {{ memoir.protagonist.name }} 的故事
          </span>
        </div>
        <div class="memoir-tags">
          <span v-for="tag in memoir.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
        <div class="memoir-status" v-if="memoir.merged">
          <span class="status-badge merged">✓ 已整合到完整回忆录</span>
        </div>
        <div class="memoir-status" v-else>
          <span class="status-badge standalone">独立段落</span>
        </div>
      </div>

      <!-- 音频播放器 -->
      <div class="player-section">
        <AudioPlayer :src="memoir.audioUrl" />
      </div>

      <!-- AI润色文本 -->
      <div class="transcript-section" v-if="memoir.transcript">
        <div class="section-title">🤖 AI润色文本</div>
        <div class="transcript-content" v-html="renderedTranscript"></div>
      </div>

      <!-- 照片展示 -->
      <div class="photos-section" v-if="memoir.photos && memoir.photos.length > 0">
        <div class="section-title">📷 相关照片</div>
        <div class="photo-grid">
          <img 
            v-for="(photo, index) in memoir.photos" 
            :key="index"
            :src="photo"
            alt="照片"
            class="photo-item"
            @click="previewPhoto(index)"
          />
        </div>
      </div>

      <!-- 查看完整回忆录 -->
      <div class="combined-link" v-if="hasCombinedMemoir" @click="goToCombined">
        <span class="combined-icon">📖</span>
        <div class="combined-info">
          <span class="combined-title">查看{{ memoir.protagonist.name }}的完整回忆录</span>
          <span class="combined-desc">{{ combinedSegmentCount }}段回忆已整合</span>
        </div>
        <span class="combined-arrow">›</span>
      </div>

      <!-- 发布信息 -->
      <div class="publish-info">
        <div class="author-card">
          <div class="author-avatar">
            {{ memoir.author.name.charAt(0) }}
          </div>
          <div class="author-info">
            <span class="author-name">{{ memoir.author.name }}</span>
            <span class="publish-time">{{ formatTime(memoir.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn" @click="shareMemoir">
          <span>🔗</span>
          分享
        </button>
        <button class="action-btn" v-if="!memoir.merged" @click="mergeNow">
          <span>📝</span>
          整合到回忆录
        </button>
        <button class="action-btn" @click="editMemoir">
          <span>✏️</span>
          编辑
        </button>
      </div>
    </div>

    <EmptyState 
      v-else
      icon="🔍"
      title="回忆不存在"
      description="该回忆可能已被删除"
      actionText="返回"
      @action="goBack"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import AudioPlayer from '@/components/AudioPlayer.vue'
import EmptyState from '@/components/EmptyState.vue'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const familyStore = useFamilyStore()

const memoir = computed(() => {
  const id = route.query.id
  return id ? familyStore.getMemoirById(id) : null
})

// 渲染transcript
const renderedTranscript = computed(() => {
  const text = memoir.value?.transcript || ''
  if (!text) return ''
  return text
    .replace(/^## (.+)$/gm, '<h3 class="tr-h3">$1</h3>')
    .replace(/^📅 (.+)$/gm, '<p class="tr-date">📅 $1</p>')
    .replace(/^🏷️ (.+)$/gm, '<p class="tr-tag">🏷️ $1</p>')
    .replace(/^🎙️ (.+)$/gm, '<p class="tr-narrator">🎙️ $1</p>')
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

function goBack() {
  router.back()
}

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
      text: `来看看${memoir.value.protagonist.name}的回忆`,
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

function editMemoir() {
  showToast('编辑功能开发中')
}
</script>

<style scoped>
.memoir-hero {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
}

.memoir-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.memoir-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-base);
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-bottom: var(--spacing-sm);
}

.meta-icon {
  margin-right: 4px;
}

.memoir-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.tag {
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
}

.memoir-status {
  margin-top: var(--spacing-xs);
}

.status-badge {
  font-size: var(--font-size-xs);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  display: inline-block;
}

.status-badge.merged {
  background: rgba(255, 255, 255, 0.25);
}

.status-badge.standalone {
  background: rgba(255, 255, 255, 0.15);
  opacity: 0.8;
}

.player-section {
  margin-bottom: var(--spacing-lg);
}

/* ====== AI文本 ====== */
.transcript-section {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-card);
  border-left: 3px solid var(--primary-soft);
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-base);
}

.transcript-content {
  font-size: var(--font-size-sm);
  line-height: 1.8;
  color: var(--text-color-primary);
}

:deep(.tr-h3) {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

:deep(.tr-date) {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
  margin-bottom: var(--spacing-sm);
}

:deep(.tr-tag),
:deep(.tr-narrator) {
  font-size: var(--font-size-xs);
  color: var(--text-color-secondary);
  margin-top: var(--spacing-xs);
}

:deep(.tr-divider) {
  border: none;
  border-top: 1px dashed var(--border-color-warm);
  margin: var(--spacing-base) 0;
}

/* ====== 照片 ====== */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.photo-item {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  object-fit: cover;
  cursor: pointer;
}

.photos-section {
  margin-bottom: var(--spacing-lg);
}

/* ====== 完整回忆录链接 ====== */
.combined-link {
  display: flex;
  align-items: center;
  background: var(--bg-color-warm);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.3s;
}

.combined-link:active {
  transform: scale(0.98);
}

.combined-icon {
  font-size: 28px;
  margin-right: var(--spacing-base);
}

.combined-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.combined-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--primary-color);
}

.combined-desc {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}

.combined-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
}

/* ====== 发布信息 ====== */
.publish-info {
  margin-bottom: var(--spacing-lg);
}

.author-card {
  display: flex;
  align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-right: var(--spacing-base);
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
}

.publish-time {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-base);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-base);
  background: var(--bg-color-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  color: var(--text-color-primary);
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:active {
  transform: scale(0.98);
  background: var(--bg-color-secondary);
}
</style>
