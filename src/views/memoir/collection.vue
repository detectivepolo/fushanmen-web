<template>
  <div class="page-container">
    <header class="page-header collection-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>{{ collection?.title || '合集回忆录' }}</h1>
    </header>

    <div class="page-content" v-if="collection">
      <!-- 合集信息 -->
      <div class="collection-hero">
        <div class="hero-icon">📖</div>
        <h2 class="hero-title">{{ collection.title }}</h2>
        <p class="hero-desc">{{ collection.desc }}</p>
        <div class="hero-meta">
          <span v-if="collection.period">📅 {{ collection.period }}</span>
        </div>
        <div class="hero-authors">
          <div 
            v-for="author in collection.authors" 
            :key="author"
            class="author-chip"
          >
            <span class="author-avatar">{{ author.charAt(0) }}</span>
            <span class="author-name">{{ author }}</span>
          </div>
        </div>
      </div>

      <!-- AI 合成内容 -->
      <div class="merged-section">
        <div class="section-header">
          <h3 class="section-title">交织的回忆</h3>
          <span class="section-badge" v-if="collection.status === 'preview'">预览版</span>
        </div>
        
        <div class="merged-content">
          <p v-for="(para, i) in mergedParagraphs" :key="i" class="merged-para">
            {{ para }}
          </p>
        </div>

        <div class="ai-hint" v-if="collection.status === 'preview'">
          <span class="hint-icon">💡</span>
          <span class="hint-text">完整版AI合成需要接入AI服务。届时多位家人的回忆将被智能融合，互相印证、互相补充，形成更完整的故事。</span>
        </div>
      </div>

      <!-- 来源回忆录 -->
      <div class="sources-section" v-if="sourceMemoirs.length > 0">
        <div class="section-header">
          <h3 class="section-title">来源回忆</h3>
          <span class="section-count">{{ sourceMemoirs.length }}篇</span>
        </div>
        <div class="source-list">
          <div 
            v-for="memoir in sourceMemoirs" 
            :key="memoir.id"
            class="source-item"
            @click="goToMemoir(memoir.id)"
          >
            <div class="source-avatar">
              {{ memoir.protagonist.name.charAt(0) }}
            </div>
            <div class="source-info">
              <div class="source-title">{{ memoir.title }}</div>
              <div class="source-meta">
                <span>{{ memoir.protagonist.name }}</span>
                <span class="dot">·</span>
                <span>{{ formatDuration(memoir.duration) }}</span>
              </div>
            </div>
            <span class="source-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- 操作 -->
      <div class="actions">
        <button class="btn-primary btn-block" @click="goToRecord">
          为这个合集添加回忆
        </button>
      </div>
    </div>

    <div class="page-content" v-else>
      <div class="empty-state">
        <span style="font-size: 48px; opacity: 0.4;">📖</span>
        <p style="margin-top: 16px; color: var(--text-color-light);">合集不存在</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'

const route = useRoute()
const router = useRouter()
const familyStore = useFamilyStore()

const collection = computed(() => {
  const id = route.query.id
  return id ? familyStore.getCollectionById(id) : null
})

const sourceMemoirs = computed(() => {
  if (!collection.value?.sourceMemoirs) return []
  return collection.value.sourceMemoirs
    .map(id => familyStore.getMemoirById(id))
    .filter(Boolean)
})

const mergedParagraphs = computed(() => {
  if (!collection.value?.mergedContent) return ['暂无内容']
  return collection.value.mergedContent.split('\n').filter(p => p.trim())
})

function goBack() {
  router.back()
}

function goToMemoir(id) {
  router.push({ path: '/memoir-detail', query: { id } })
}

function goToRecord() {
  router.push('/memoir-record')
}

function formatDuration(seconds) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.collection-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.back-btn {
  font-size: var(--font-size-2xl);
}

/* 合集信息 */
.collection-hero {
  text-align: center;
  background: linear-gradient(145deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl) var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
}

.hero-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.hero-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  letter-spacing: 0.05em;
}

.hero-desc {
  font-size: var(--font-size-sm);
  opacity: 0.85;
  margin-bottom: var(--spacing-base);
}

.hero-meta {
  font-size: var(--font-size-sm);
  opacity: 0.8;
  margin-bottom: var(--spacing-base);
}

.hero-authors {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.author-chip {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.author-name {
  font-size: var(--font-size-sm);
}

/* 合成内容 */
.merged-section {
  margin-bottom: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color-primary);
}

.section-badge {
  font-size: var(--font-size-xs);
  color: var(--warning-color);
  background: rgba(212, 155, 62, 0.1);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.section-count {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

.merged-content {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-card);
  border-left: 3px solid var(--primary-soft);
}

.merged-para {
  font-size: var(--font-size-base);
  color: var(--text-color-secondary);
  line-height: 1.8;
  margin-bottom: var(--spacing-base);
}

.merged-para:last-child {
  margin-bottom: 0;
}

.ai-hint {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-base);
  padding: var(--spacing-base);
  background: var(--bg-color-warm);
  border-radius: var(--radius-md);
}

.hint-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.hint-text {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  line-height: 1.6;
}

/* 来源回忆 */
.sources-section {
  margin-bottom: var(--spacing-lg);
}

.source-list {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.source-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
  transition: background 0.3s;
}

.source-item:last-child {
  border-bottom: none;
}

.source-item:active {
  background: var(--bg-color-secondary);
}

.source-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-right: var(--spacing-base);
  flex-shrink: 0;
}

.source-info {
  flex: 1;
  min-width: 0;
}

.source-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 2px;
}

.source-meta {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.dot {
  color: var(--border-color-warm);
}

.source-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
}

/* 操作 */
.actions {
  margin-top: var(--spacing-xl);
}

.btn-block {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-4xl) var(--spacing-xl);
  text-align: center;
}
</style>
