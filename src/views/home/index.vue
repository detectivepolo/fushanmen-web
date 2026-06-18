<template>
  <div class="page-container">
    <!-- 头部 -->
    <header class="home-header">
      <div class="header-content">
        <div class="family-badge">
          <span class="badge-icon">🏠</span>
          <span class="badge-text">赵家大院</span>
        </div>
        <div class="user-greeting">
          <span class="greeting-text">{{ greeting }}</span>
          <span class="user-name">{{ userStore.displayName }}</span>
        </div>
      </div>
      <div class="header-decoration"></div>
    </header>

    <!-- 四大板块卡片 -->
    <div class="section-cards">
      <div class="card-row">
        <div class="feature-card" @click="goToPage('/family-tree')">
          <span class="card-icon">🌳</span>
          <span class="card-title">家谱</span>
          <span class="card-desc">家族成员</span>
        </div>
        <div class="feature-card" @click="goToPage('/core-family')">
          <span class="card-icon">👨‍👩‍👧‍👦</span>
          <span class="card-title">我爱我家</span>
          <span class="card-desc">家庭动态</span>
        </div>
      </div>
      <div class="card-row">
        <div class="feature-card" @click="goToPage('/memoir')">
          <span class="card-icon">🎙️</span>
          <span class="card-title">回忆录</span>
          <span class="card-desc">记录故事</span>
        </div>
        <div class="feature-card" @click="goToPage('/milestone')">
          <span class="card-icon">📅</span>
          <span class="card-title">大事记</span>
          <span class="card-desc">团圆时刻</span>
        </div>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-section">
      <div class="section-title">
        <span class="title-icon">📊</span>
        <span>家族数据</span>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ stats.totalMembers }}</span>
          <span class="stat-label">家族成员</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.aliveMembers }}</span>
          <span class="stat-label">家族长辈</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.totalMemoirs }}</span>
          <span class="stat-label">回忆录</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ formatDuration(stats.totalDuration) }}</span>
          <span class="stat-label">录音时长</span>
        </div>
      </div>
    </div>

    <!-- 最新回忆 -->
    <div class="recent-section" v-if="recentMemoirs.length > 0">
      <div class="section-title">
        <span class="title-icon">🎧</span>
        <span>最新回忆</span>
        <router-link to="/memoir" class="more-link">更多 ›</router-link>
      </div>
      <div class="recent-list">
        <div 
          v-for="memoir in recentMemoirs" 
          :key="memoir.id"
          class="recent-item"
          @click="goToMemoirDetail(memoir.id)"
        >
          <div class="item-avatar">
            {{ memoir.protagonist.name.charAt(0) }}
          </div>
          <div class="item-content">
            <div class="item-title">{{ memoir.title }}</div>
            <div class="item-meta">
              <span class="item-author">{{ memoir.author.name }}</span>
              <span class="item-time">{{ formatDate(memoir.createdAt) }}</span>
            </div>
          </div>
          <span class="item-duration">{{ formatDuration(memoir.duration) }}</span>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <button class="quick-btn" @click="goToRecord">
        <span class="quick-icon">🎙️</span>
        <span class="quick-text">录制回忆</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useFamilyStore } from '@/store/family'

const router = useRouter()
const userStore = useUserStore()
const familyStore = useFamilyStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 21) return '晚上好'
  return '夜深了'
})

const stats = computed(() => familyStore.getStats())

const recentMemoirs = computed(() => {
  return familyStore.getMemoirs().slice(0, 3)
})

function goToPage(path) {
  router.push(path)
}

function goToMemoirDetail(id) {
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

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}
</script>

<style scoped>
.home-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  padding: var(--spacing-2xl) var(--spacing-base) var(--spacing-4xl);
  position: relative;
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 40px;
  background: var(--bg-color);
  border-radius: 50% 50% 0 0;
}

.header-content {
  position: relative;
  z-index: 1;
}

.family-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-sm) var(--spacing-base);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-base);
}

.badge-icon {
  font-size: var(--font-size-lg);
}

.badge-text {
  font-size: var(--font-size-base);
  font-weight: 500;
}

.user-greeting {
  display: flex;
  flex-direction: column;
}

.greeting-text {
  font-size: var(--font-size-lg);
  opacity: 0.9;
}

.user-name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.section-cards {
  padding: var(--spacing-xl) var(--spacing-base);
  margin-top: -var(--spacing-2xl);
}

.card-row {
  display: flex;
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-base);
}

.feature-card {
  flex: 1;
  background: var(--bg-color-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: all 0.3s;
}

.feature-card:active {
  transform: scale(0.98);
}

.card-icon {
  font-size: 36px;
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 2px;
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

.stats-section,
.recent-section {
  padding: var(--spacing-base);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-base);
}

.title-icon {
  font-size: var(--font-size-lg);
}

.more-link {
  margin-left: auto;
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  text-decoration: none;
  font-weight: normal;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
}

.stat-item {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.stat-value {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 2px;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}

.recent-list {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.recent-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
  transition: background 0.3s;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:active {
  background: var(--bg-color-secondary);
}

.item-avatar {
  width: 44px;
  height: 44px;
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

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

.item-duration {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-left: var(--spacing-sm);
}

.quick-actions {
  padding: var(--spacing-xl) var(--spacing-base);
  position: fixed;
  bottom: calc(70px + var(--safe-area-inset-bottom));
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-base) var(--spacing-2xl);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-md);
  font-weight: 500;
  box-shadow: var(--shadow-primary);
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s;
}

.quick-btn:active {
  transform: scale(0.95);
}

.quick-icon {
  font-size: var(--font-size-lg);
}
</style>
