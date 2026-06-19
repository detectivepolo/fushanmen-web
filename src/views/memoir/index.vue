<template>
  <div class="page-container">
    <header class="page-header">
      <h1>🎙️ 回忆录</h1>
    </header>

    <div class="page-content">
      <!-- 快捷录制 -->
      <div class="quick-record" @click="goToRecord">
        <div class="record-icon">🎙️</div>
        <div class="record-info">
          <span class="record-title">录制新回忆</span>
          <span class="record-desc">用声音记录珍贵故事</span>
        </div>
        <span class="record-arrow">›</span>
      </div>

      <!-- 按人物分组的完整回忆录 -->
      <div class="section" v-if="protagonistGroups.length > 0">
        <div class="section-title">
          <span>📖 完整回忆录</span>
          <span class="count-badge">{{ protagonistGroups.length }}人</span>
        </div>

        <div class="combined-list">
          <div 
            v-for="group in protagonistGroups" 
            :key="group.protagonist.id"
            class="combined-card"
            @click="goToCombined(group.protagonist.id)"
          >
            <div class="combined-avatar">
              {{ group.protagonist.name.charAt(0) }}
            </div>
            <div class="combined-info">
              <h3 class="combined-name">{{ group.protagonist.name }}</h3>
              <div class="combined-stats">
                <span>{{ group.mergedCount }}段已整合</span>
                <span class="dot" v-if="group.unmergedCount > 0">·</span>
                <span v-if="group.unmergedCount > 0">{{ group.unmergedCount }}段未整合</span>
              </div>
            </div>
            <div class="combined-badge" v-if="group.mergedCount > 0">
              <span class="badge-icon">📖</span>
              <span class="badge-text">查看</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 全部回忆段落 -->
      <div class="section">
        <div class="section-title">
          <span>📚 全部段落</span>
          <span class="count-badge">{{ memoirs.length }}段</span>
        </div>

        <div class="memoir-list" v-if="memoirs.length > 0">
          <div 
            v-for="memoir in memoirs" 
            :key="memoir.id"
            class="memoir-item"
            @click="viewDetail(memoir)"
          >
            <div class="memoir-cover">
              <span class="cover-icon">🎧</span>
              <span class="cover-merged" v-if="memoir.merged">📖</span>
            </div>
            <div class="memoir-content">
              <h3 class="memoir-title">{{ memoir.title }}</h3>
              <div class="memoir-meta">
                <span class="protagonist">{{ memoir.protagonist.name }}</span>
                <span class="duration">⏱️ {{ formatDuration(memoir.duration) }}</span>
              </div>
              <div class="memoir-footer">
                <span class="author">👤 {{ memoir.author.name }}</span>
                <span class="date">{{ formatDate(memoir.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <EmptyState 
          v-else
          icon="🎙️"
          title="暂无回忆录"
          description="点击上方按钮，开始录制第一段回忆"
          actionText="立即录制"
          @action="goToRecord"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const familyStore = useFamilyStore()

const memoirs = computed(() => familyStore.getMemoirs())

// 按主角分组，统计整合情况
const protagonistGroups = computed(() => {
  const groups = familyStore.getMemoirsByProtagonist()
  return groups.map(g => {
    const mergedCount = g.memoirs.filter(m => m.merged).length
    const unmergedCount = g.memoirs.filter(m => !m.merged).length
    return {
      protagonist: g.protagonist,
      memoirs: g.memoirs,
      mergedCount,
      unmergedCount
    }
  }).filter(g => g.mergedCount > 0 || g.unmergedCount > 0)
})

function goToRecord() {
  router.push('/memoir-record')
}

function viewDetail(memoir) {
  router.push({ path: '/memoir-detail', query: { id: memoir.id } })
}

function goToCombined(protagonistId) {
  router.push({ path: '/memoir-combined', query: { id: protagonistId } })
}

function formatDuration(seconds) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${month}.${day}`
}
</script>

<style scoped>
.quick-record {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--danger-color), #FF6B6B);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.3s;
}

.quick-record:active {
  transform: scale(0.98);
}

.record-icon {
  font-size: 40px;
  margin-right: var(--spacing-base);
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.record-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: 4px;
}

.record-desc {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.record-arrow {
  font-size: var(--font-size-2xl);
  opacity: 0.8;
}

.section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-base);
}

.count-badge {
  font-size: var(--font-size-sm);
  font-weight: normal;
  color: var(--text-color-light);
}

/* ====== 完整回忆录列表 ====== */
.combined-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.combined-card {
  display: flex;
  align-items: center;
  background: var(--bg-color-warm);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid var(--primary-soft);
}

.combined-card:active {
  transform: scale(0.98);
}

.combined-avatar {
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
  flex-shrink: 0;
}

.combined-info {
  flex: 1;
  min-width: 0;
}

.combined-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 2px;
}

.combined-stats {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.dot {
  color: var(--border-color-warm);
}

.combined-badge {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--primary-color);
  color: white;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
}

.badge-icon {
  font-size: 14px;
}

/* ====== 段落列表 ====== */
.memoir-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.memoir-item {
  display: flex;
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s;
}

.memoir-item:active {
  transform: scale(0.98);
}

.memoir-cover {
  width: 100px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}

.cover-icon {
  font-size: 40px;
}

.cover-merged {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 14px;
}

.memoir-content {
  flex: 1;
  padding: var(--spacing-base);
  min-width: 0;
}

.memoir-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.memoir-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.duration {
  color: var(--primary-color);
}

.memoir-footer {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}
</style>
