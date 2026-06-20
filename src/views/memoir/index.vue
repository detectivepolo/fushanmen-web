<template>
  <div class="page-container">
    <!-- 顶部品牌区 -->
    <header class="brand-header">
      <div class="brand-inner">
        <div class="brand-mark">
          <span class="brand-name">福善门</span>
          <span class="brand-sub">赵家大院</span>
        </div>
        <span class="settings-btn" @click="goSettings">⚙</span>
      </div>
    </header>

    <div class="page-body">
      <!-- 录制入口 -->
      <div class="record-cta" @click="goToRecord">
        <div class="record-circle">
          <span class="record-icon">🎙️</span>
        </div>
        <div class="record-text">
          <span class="record-title">录制新回忆</span>
          <span class="record-desc">用声音留住时光</span>
        </div>
        <span class="record-arrow">›</span>
      </div>

      <!-- 完整回忆录（按人物） -->
      <div class="section" v-if="protagonistGroups.length > 0">
        <div class="section-head">
          <h3 class="section-title">回忆录</h3>
          <span class="section-sub">{{ totalMemoirs }}段回忆 · {{ protagonistGroups.length }}人</span>
        </div>

        <div class="person-list">
          <div 
            v-for="group in protagonistGroups" 
            :key="group.protagonist.id"
            class="person-card"
            @click="goToCombined(group.protagonist.id)"
          >
            <div class="person-avatar">
              {{ group.protagonist.name.charAt(0) }}
            </div>
            <div class="person-info">
              <h4 class="person-name">{{ group.protagonist.name }}</h4>
              <p class="person-meta">
                {{ group.mergedCount }}段已整合
                <template v-if="group.unmergedCount > 0"> · {{ group.unmergedCount }}段待整合</template>
              </p>
            </div>
            <span class="person-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- 全部段落 -->
      <div class="section">
        <div class="section-head">
          <h3 class="section-title">全部段落</h3>
          <span class="section-sub">{{ memoirs.length }}段</span>
        </div>

        <div class="segment-list" v-if="memoirs.length > 0">
          <div 
            v-for="memoir in memoirs" 
            :key="memoir.id"
            class="segment-item"
            @click="viewDetail(memoir)"
          >
            <div class="segment-icon">
              <span>{{ memoir.merged ? '📖' : '🎧' }}</span>
            </div>
            <div class="segment-content">
              <h4 class="segment-title">{{ memoir.title }}</h4>
              <div class="segment-meta">
                <span class="seg-person">{{ memoir.protagonist.name }}</span>
                <span class="seg-dot">·</span>
                <span class="seg-date">{{ formatDate(memoir.createdAt) }}</span>
              </div>
            </div>
            <span class="segment-duration">{{ formatDuration(memoir.duration) }}</span>
          </div>
        </div>

        <div class="empty-state" v-else>
          <span class="empty-icon">🎙️</span>
          <p class="empty-text">还没有回忆，点上方按钮开始录制</p>
        </div>
      </div>

      <!-- 合集入口 -->
      <div class="section" v-if="collections.length > 0">
        <div class="section-head">
          <h3 class="section-title">家族合集</h3>
          <span class="section-sub">多人回忆交织</span>
        </div>
        <div class="collection-list">
          <div 
            v-for="col in collections" 
            :key="col.id"
            class="collection-card"
            @click="goToCollection(col.id)"
          >
            <span class="col-icon">📖</span>
            <div class="col-info">
              <h4 class="col-title">{{ col.title }}</h4>
              <p class="col-desc">{{ col.desc }}</p>
            </div>
            <span class="col-arrow">›</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'

const router = useRouter()
const familyStore = useFamilyStore()

const memoirs = computed(() => familyStore.getMemoirs())
const collections = computed(() => familyStore.getCollections())

const totalMemoirs = computed(() => memoirs.value.length)

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
  })
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

function goToCollection(id) {
  router.push({ path: '/memoir-collection', query: { id } })
}

function goSettings() {
  router.push('/mine')
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
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style scoped>
/* ====== 品牌头部 ====== */
.brand-header {
  background: linear-gradient(160deg, #B8765A 0%, #C8866A 60%, #D49B7E 100%);
  color: white;
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl);
}

.brand-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-mark {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
}

.brand-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 0.1em;
}

.brand-sub {
  font-size: var(--font-size-sm);
  opacity: 0.7;
  letter-spacing: 0.05em;
}

.settings-btn {
  font-size: 18px;
  opacity: 0.7;
  cursor: pointer;
  padding: var(--spacing-xs);
  transition: opacity 0.3s;
}

.settings-btn:active {
  opacity: 1;
}

/* ====== 主体 ====== */
.page-body {
  padding: var(--spacing-base) var(--spacing-base) calc(80px + var(--safe-area-inset-bottom));
}

/* ====== 录制入口 ====== */
.record-cta {
  display: flex;
  align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: all 0.3s;
}

.record-cta:active {
  transform: scale(0.98);
}

.record-circle {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: var(--spacing-base);
  box-shadow: var(--shadow-primary);
}

.record-icon {
  font-size: 26px;
}

.record-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.record-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
}

.record-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  margin-top: 2px;
}

.record-arrow {
  font-size: var(--font-size-2xl);
  color: var(--text-color-light);
}

/* ====== 区块 ====== */
.section {
  margin-bottom: var(--spacing-xl);
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-base);
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color-primary);
  letter-spacing: 0.03em;
}

.section-sub {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

/* ====== 人物卡片 ====== */
.person-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.person-card {
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

.person-card:active {
  transform: scale(0.98);
}

.person-avatar {
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

.person-info {
  flex: 1;
  min-width: 0;
}

.person-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 2px;
}

.person-meta {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}

.person-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
}

/* ====== 段落列表 ====== */
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

.segment-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-color-warm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: var(--spacing-base);
  flex-shrink: 0;
}

.segment-content {
  flex: 1;
  min-width: 0;
}

.segment-title {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color-primary);
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.segment-meta {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.seg-dot {
  color: var(--border-color-warm);
}

.segment-duration {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  margin-left: var(--spacing-sm);
  flex-shrink: 0;
}

/* ====== 空状态 ====== */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-base);
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-base);
  opacity: 0.6;
}

.empty-text {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

/* ====== 合集 ====== */
.collection-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.collection-card {
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

.collection-card:active {
  transform: scale(0.98);
}

.col-icon {
  font-size: 28px;
  margin-right: var(--spacing-base);
  flex-shrink: 0;
}

.col-info {
  flex: 1;
  min-width: 0;
}

.col-title {
  font-family: var(--font-serif);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 2px;
}

.col-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
}
</style>
