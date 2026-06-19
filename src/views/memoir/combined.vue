<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>完整回忆录</h1>
    </header>

    <div class="page-content" v-if="combinedMemoir">
      <!-- 主角信息 -->
      <div class="combined-hero">
        <div class="hero-avatar">
          {{ combinedMemoir.protagonist.name.charAt(0) }}
        </div>
        <h1 class="hero-name">{{ combinedMemoir.protagonist.name }}的回忆录</h1>
        <p class="hero-sub">{{ combinedMemoir.count }}段回忆 · 按时间顺序整合</p>
      </div>

      <!-- 整合文本 -->
      <div class="combined-text" v-html="renderedCombined"></div>

      <!-- 段落列表 -->
      <div class="segments-section">
        <div class="section-title">📚 包含的段落</div>
        <div class="segment-list">
          <div 
            v-for="(seg, index) in combinedMemoir.segments" 
            :key="seg.id"
            class="segment-item"
            @click="goToDetail(seg.id)"
          >
            <div class="seg-index">{{ index + 1 }}</div>
            <div class="seg-content">
              <h4 class="seg-title">{{ seg.title }}</h4>
              <div class="seg-meta">
                <span>{{ formatDate(seg.createdAt) }}</span>
                <span class="dot">·</span>
                <span>{{ formatDuration(seg.duration) }}</span>
              </div>
            </div>
            <span class="seg-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- 未整合的段落 -->
      <div class="unmerged-section" v-if="unmergedMemoirs.length > 0">
        <div class="section-title">📌 尚未整合的段落</div>
        <div class="segment-list">
          <div 
            v-for="seg in unmergedMemoirs" 
            :key="seg.id"
            class="segment-item unmerged"
            @click="goToDetail(seg.id)"
          >
            <div class="seg-index">—</div>
            <div class="seg-content">
              <h4 class="seg-title">{{ seg.title }}</h4>
              <div class="seg-meta">
                <span>{{ formatDate(seg.createdAt) }}</span>
                <span class="dot">·</span>
                <span>{{ formatDuration(seg.duration) }}</span>
              </div>
            </div>
            <span class="seg-arrow">›</span>
          </div>
        </div>
        <p class="unmerged-hint">在段落详情页可点击"整合到回忆录"将其加入</p>
      </div>
    </div>

    <EmptyState 
      v-else
      icon="📖"
      title="还没有整合的回忆录"
      description="录制回忆时选择「整合」，段落会自动拼接到这里"
      actionText="去录制"
      @action="goToRecord"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const familyStore = useFamilyStore()

const protagonistId = computed(() => route.query.id)

const combinedMemoir = computed(() => {
  if (!protagonistId.value) return null
  return familyStore.getCombinedMemoir(protagonistId.value)
})

// 未整合的同主角段落
const unmergedMemoirs = computed(() => {
  if (!protagonistId.value) return []
  return familyStore.getMemoirsByMemberId(protagonistId.value)
    .filter(m => !m.merged)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// 渲染整合文本
const renderedCombined = computed(() => {
  const text = combinedMemoir.value?.combinedText || ''
  if (!text) return ''
  return text
    .replace(/^## (.+)$/gm, '<h3 class="tr-h3">$1</h3>')
    .replace(/^📅 (.+)$/gm, '<p class="tr-date">📅 $1</p>')
    .replace(/^🏷️ (.+)$/gm, '<p class="tr-tag">🏷️ $1</p>')
    .replace(/^🎙️ (.+)$/gm, '<p class="tr-narrator">🎙️ $1</p>')
    .replace(/^---$/gm, '<div class="tr-divider"></div>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<)/gm, '<p>')
    .replace(/(?<!>)$/, '</p>')
})

function goBack() {
  router.back()
}

function goToDetail(id) {
  router.push({ path: '/memoir-detail', query: { id } })
}

function goToRecord() {
  router.push('/memoir-record')
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}

function formatDuration(seconds) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
/* ====== Hero ====== */
.combined-hero {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl) var(--spacing-lg);
  color: white;
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.hero-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin: 0 auto var(--spacing-base);
}

.hero-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.hero-sub {
  font-size: var(--font-size-sm);
  opacity: 0.85;
}

/* ====== 整合文本 ====== */
.combined-text {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-card);
  border-left: 3px solid var(--primary-soft);
  font-size: var(--font-size-sm);
  line-height: 1.9;
  color: var(--text-color-primary);
}

:deep(.tr-h3) {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
  margin-top: var(--spacing-base);
}

:deep(.tr-h3:first-child) {
  margin-top: 0;
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
  margin: var(--spacing-lg) 0;
}

/* ====== 段落列表 ====== */
.segments-section,
.unmerged-section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-base);
}

.segment-list {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.segment-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
  transition: background 0.3s;
}

.segment-item:last-child {
  border-bottom: none;
}

.segment-item:active {
  background: var(--bg-color-secondary);
}

.seg-index {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--primary-bg);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-right: var(--spacing-base);
  flex-shrink: 0;
}

.segment-item.unmerged .seg-index {
  background: var(--bg-color-secondary);
  color: var(--text-color-light);
}

.seg-content {
  flex: 1;
  min-width: 0;
}

.seg-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.seg-meta {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.dot {
  color: var(--border-color-warm);
}

.seg-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
  margin-left: var(--spacing-sm);
}

.unmerged-hint {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
  text-align: center;
  margin-top: var(--spacing-base);
}
</style>
