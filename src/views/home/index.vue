<template>
  <div class="page-container">
    <!-- 顶部 -->
    <header class="home-header">
      <div class="header-inner">
        <div class="family-mark">
          <span class="mark-text">福善门</span>
          <span class="mark-sub">赵家大院</span>
        </div>
        <div class="greeting">
          <span class="greeting-word">{{ greeting }}，</span>
          <span class="greeting-name">{{ userStore.displayName }}</span>
        </div>
      </div>
    </header>

    <div class="home-body">
      <!-- ====== 回忆录核心区 ====== -->
      <div class="memoir-center">
        <!-- 中心大卡 -->
        <div class="memoir-core-card" @click="goToPage('/memoir')">
          <div class="core-icon">🎙️</div>
          <h2 class="core-title">回忆录</h2>
          <p class="core-desc">用声音留住时光</p>
          <div class="core-stats">
            <span>{{ stats.totalMemoirs }} 篇回忆</span>
            <span class="dot">·</span>
            <span>{{ formatDuration(stats.totalDuration) }} 录音</span>
          </div>
        </div>

        <!-- 辐射：家谱 -->
        <div class="satellite satellite-left" @click="goToPage('/family-tree')">
          <div class="satellite-card">
            <span class="sat-icon">🌳</span>
            <span class="sat-title">赵家家谱</span>
            <span class="sat-num">{{ stats.totalMembers }}人</span>
          </div>
          <div class="orbit-line orbit-left"></div>
        </div>

        <!-- 辐射：大事记 -->
        <div class="satellite satellite-right" @click="goToPage('/milestone')">
          <div class="satellite-card">
            <span class="sat-icon">📅</span>
            <span class="sat-title">大事记</span>
            <span class="sat-num">{{ stats.totalMilestones }}件</span>
          </div>
          <div class="orbit-line orbit-right"></div>
        </div>
      </div>

      <!-- ====== 合集回忆录 ====== -->
      <div class="section-block">
        <div class="block-header">
          <h3 class="block-title">家族合集</h3>
          <span class="block-desc">多人回忆交织印证</span>
        </div>
        <div class="collection-list">
          <div 
            v-for="col in collections" 
            :key="col.id"
            class="collection-card"
            @click="goToCollection(col.id)"
          >
            <div class="col-cover">
              <span class="col-emoji">📖</span>
            </div>
            <div class="col-info">
              <h4 class="col-name">{{ col.title }}</h4>
              <p class="col-desc">{{ col.desc }}</p>
              <div class="col-authors">
                <span 
                  v-for="author in col.authors" 
                  :key="author"
                  class="col-author-tag"
                >{{ author }}</span>
              </div>
            </div>
            <span class="col-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- ====== 最新回忆 ====== -->
      <div class="section-block" v-if="recentMemoirs.length > 0">
        <div class="block-header">
          <h3 class="block-title">最近记录</h3>
          <router-link to="/memoir" class="more-link">更多 ›</router-link>
        </div>
        <div class="recent-list">
          <div 
            v-for="memoir in recentMemoirs" 
            :key="memoir.id"
            class="recent-item"
            @click="goToMemoirDetail(memoir.id)"
          >
            <div class="recent-avatar">
              {{ memoir.protagonist.name.charAt(0) }}
            </div>
            <div class="recent-content">
              <div class="recent-title">{{ memoir.title }}</div>
              <div class="recent-meta">
                <span>{{ memoir.protagonist.name }}</span>
                <span class="dot">·</span>
                <span>{{ formatDate(memoir.createdAt) }}</span>
              </div>
            </div>
            <span class="recent-duration">{{ formatDuration(memoir.duration) }}</span>
          </div>
        </div>
      </div>

      <!-- ====== 快捷录制 ====== -->
      <div class="record-cta">
        <button class="record-btn-large" @click="goToRecord">
          <span class="record-emoji">🎙️</span>
          <span class="record-text">录制新回忆</span>
        </button>
      </div>
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
  return '晚上好'
})

const stats = computed(() => familyStore.getStats())

const recentMemoirs = computed(() => familyStore.getMemoirs().slice(0, 3))

// 合集回忆录 Mock 数据
const collections = computed(() => {
  const stored = familyStore.collections || []
  if (stored.length > 0) return stored
  // 默认合集
  return [
    {
      id: 'col_zhao_siblings',
      title: '赵家兄妹',
      desc: '赵德福、赵建国、赵秀英的童年与青春记忆',
      authors: ['赵德福', '赵建国', '赵秀英'],
      status: 'preview'
    }
  ]
})

function goToPage(path) {
  router.push(path)
}

function goToMemoirDetail(id) {
  router.push({ path: '/memoir-detail', query: { id } })
}

function goToCollection(id) {
  router.push({ path: '/memoir-collection', query: { id } })
}

function goToRecord() {
  router.push('/memoir-record')
}

function formatDuration(seconds) {
  if (!seconds) return '0分'
  const mins = Math.floor(seconds / 60)
  if (mins < 1) return '不到1分'
  return `${mins}分`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style scoped>
/* ====== 顶部 ====== */
.home-header {
  background: linear-gradient(160deg, #B8765A 0%, #C8866A 50%, #D49B7E 100%);
  color: white;
  padding: var(--spacing-3xl) var(--spacing-lg) var(--spacing-4xl);
  position: relative;
}

.header-inner {
  position: relative;
  z-index: 1;
}

.family-mark {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-base);
}

.mark-text {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.mark-sub {
  font-size: var(--font-size-sm);
  opacity: 0.75;
}

.greeting {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
}

.greeting-name {
  font-weight: 600;
}

/* ====== 主体 ====== */
.home-body {
  padding: 0 var(--spacing-base) var(--spacing-2xl);
  margin-top: -var(--spacing-2xl);
  position: relative;
  z-index: 2;
}

/* ====== 回忆录中心区 ====== */
.memoir-center {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-base) 0 var(--spacing-xl);
}

.memoir-core-card {
  width: 100%;
  background: linear-gradient(145deg, #FFFFFF, #FBF7F2);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-color-light);
  position: relative;
  z-index: 2;
}

.memoir-core-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

.core-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.core-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.05em;
}

.core-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  margin-bottom: var(--spacing-base);
  font-style: italic;
}

.core-stats {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
}

.dot {
  color: var(--border-color-warm);
}

/* ====== 辐射卫星 ====== */
.satellite {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: var(--spacing-lg);
  position: relative;
}

.satellite-left {
  justify-content: flex-start;
  padding-left: var(--spacing-sm);
}

.satellite-right {
  justify-content: flex-end;
  padding-right: var(--spacing-sm);
}

.satellite-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--bg-color-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-base) var(--spacing-lg);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-color-light);
}

.satellite-card:active {
  transform: scale(0.97);
  box-shadow: var(--shadow-sm);
}

.sat-icon {
  font-size: 24px;
}

.sat-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
}

.sat-num {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

/* 连接线 */
.orbit-line {
  position: absolute;
  top: -var(--spacing-lg);
  height: var(--spacing-lg);
  width: 2px;
  background: linear-gradient(to bottom, transparent, var(--primary-soft));
  z-index: 1;
}

.orbit-left {
  left: 40px;
}

.orbit-right {
  right: 40px;
}

/* ====== 区块通用 ====== */
.section-block {
  margin-top: var(--spacing-xl);
}

.block-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--spacing-base);
}

.block-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color-primary);
}

.block-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  margin-left: var(--spacing-sm);
}

.more-link {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  text-decoration: none;
}

/* ====== 合集列表 ====== */
.collection-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.collection-card {
  display: flex;
  align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid var(--primary-soft);
}

.collection-card:active {
  transform: scale(0.98);
}

.col-cover {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--bg-color-warm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: var(--spacing-base);
}

.col-emoji {
  font-size: 28px;
}

.col-info {
  flex: 1;
  min-width: 0;
}

.col-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 2px;
}

.col-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-authors {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.col-author-tag {
  font-size: var(--font-size-xs);
  color: var(--primary-color);
  background: var(--primary-bg);
  padding: 1px 8px;
  border-radius: var(--radius-full);
}

.col-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
  margin-left: var(--spacing-sm);
}

/* ====== 最近回忆 ====== */
.recent-list {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
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

.recent-avatar {
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

.recent-content {
  flex: 1;
  min-width: 0;
}

.recent-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-meta {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.recent-duration {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  margin-left: var(--spacing-sm);
}

/* ====== 录制按钮 ====== */
.record-cta {
  margin-top: var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.record-btn-large {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-base) var(--spacing-3xl);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-md);
  font-weight: 500;
  font-family: var(--font-sans);
  box-shadow: var(--shadow-primary);
  cursor: pointer;
  transition: all 0.3s;
}

.record-btn-large:active {
  transform: scale(0.96);
  opacity: 0.9;
}

.record-emoji {
  font-size: 20px;
}
</style>
