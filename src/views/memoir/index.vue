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

      <!-- 回忆列表 -->
      <div class="section">
        <div class="section-title">
          <span>📚 全部回忆</span>
          <span class="count-badge">{{ memoirs.length }}篇</span>
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

function goToRecord() {
  router.push('/memoir-record')
}

function viewDetail(memoir) {
  router.push({ path: '/memoir-detail', query: { id: memoir.id } })
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
}

.cover-icon {
  font-size: 40px;
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
