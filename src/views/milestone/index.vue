<template>
  <div class="page-container">
    <header class="page-header">
      <h1>团聚大事记</h1>
    </header>

    <div class="page-content">
      <!-- 快捷创建 -->
      <div class="quick-create" @click="goToCreate">
        <div class="create-icon">✨</div>
        <div class="create-info">
          <span class="create-title">记录新大事</span>
          <span class="create-desc">留住家庭的重要时刻</span>
        </div>
        <span class="create-arrow">›</span>
      </div>

      <!-- 时间线视图 -->
      <div class="timeline-section">
        <div class="section-title">
          <span>⏰ 时间线</span>
        </div>

        <div class="timeline" v-if="milestones.length > 0">
          <div 
            v-for="milestone in milestones" 
            :key="milestone.id"
            class="timeline-item"
            @click="viewDetail(milestone)"
          >
            <div class="timeline-marker">
              <span class="marker-dot"></span>
              <span class="marker-line"></span>
            </div>
            <div class="timeline-content">
              <div class="timeline-date">{{ formatDate(milestone.date) }}</div>
              <div class="milestone-card">
                <h3 class="milestone-title">{{ milestone.title }}</h3>
                <p class="milestone-desc">{{ milestone.description }}</p>
                <div class="milestone-meta">
                  <span class="location" v-if="milestone.location">
                    📍 {{ milestone.location }}
                  </span>
                  <span class="participants">
                    👥 {{ milestone.participants.length }}人参与
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EmptyState 
          v-else
          icon="📅"
          title="暂无大事记"
          description="点击上方按钮，记录第一个重要时刻"
          actionText="立即记录"
          @action="goToCreate"
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

const milestones = computed(() => familyStore.getMilestones())

function goToCreate() {
  router.push('/milestone-create')
}

function viewDetail(milestone) {
  router.push({ path: '/milestone-detail', query: { id: milestone.id } })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(160deg, #B8765A 0%, #C8866A 60%, #D49B7E 100%);
  color: white;
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl);
}

.page-header h1 {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 0.05em;
}

.quick-create {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.3s;
}

.quick-create:active {
  transform: scale(0.98);
}

.create-icon {
  font-size: 40px;
  margin-right: var(--spacing-base);
}

.create-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.create-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: 4px;
}

.create-desc {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.create-arrow {
  font-size: var(--font-size-2xl);
  opacity: 0.8;
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-base);
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-marker {
  position: absolute;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background: var(--primary-color);
  border: 3px solid var(--bg-color);
  box-shadow: 0 0 0 2px var(--primary-color);
}

.marker-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, var(--primary-color), var(--border-color));
  margin-top: var(--spacing-xs);
}

.timeline-item {
  position: relative;
  padding-bottom: var(--spacing-xl);
}

.timeline-item:last-child .marker-line {
  display: none;
}

.timeline-date {
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: var(--spacing-sm);
  margin-left: var(--spacing-base);
}

.milestone-card {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s;
}

.milestone-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-card);
}

.milestone-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-xs);
}

.milestone-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  line-height: 1.5;
  margin-bottom: var(--spacing-sm);
}

.milestone-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-base);
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}
</style>
