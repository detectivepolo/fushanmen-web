<template>
  <div class="page-container">
    <header class="page-header">
      <h1>👨‍👩‍👧‍👦 我爱我家</h1>
    </header>

    <div class="page-content">
      <!-- 家庭成员卡片 -->
      <div class="family-header">
        <div class="family-info">
          <div class="family-avatar">🏠</div>
          <div class="family-details">
            <h2>赵家大院</h2>
            <p>传承百年家族记忆</p>
          </div>
        </div>
        <div class="family-stats">
          <div class="stat-item">
            <span class="stat-num">{{ members.length }}</span>
            <span class="stat-label">成员</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">{{ aliveCount }}</span>
            <span class="stat-label">健在</span>
          </div>
        </div>
      </div>

      <!-- 成员列表 -->
      <div class="section">
        <div class="section-title">家族成员</div>
        <div class="members-list">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-item"
            @click="viewDetail(member)"
          >
            <div class="member-avatar">
              {{ member.name.charAt(0) }}
            </div>
            <div class="member-info">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-meta">
                <span class="tag">{{ member.relation }}</span>
                <span v-if="member.birthYear" class="birth-year">🎂 {{ member.birthYear }}</span>
              </div>
            </div>
            <span class="member-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- 家族动态入口 -->
      <div class="section">
        <div 
          class="dynamics-entry"
          @click="goToDynamics"
        >
          <span class="entry-icon">📢</span>
          <div class="entry-content">
            <span class="entry-title">家族动态圈</span>
            <span class="entry-desc">查看最近的家族动态</span>
          </div>
          <span class="entry-arrow">›</span>
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

const members = computed(() => familyStore.getMembers())

const aliveCount = computed(() => {
  return members.value.filter(m => m.isAlive !== false).length
})

function viewDetail(member) {
  familyStore.setCurrentMember(member)
  router.push('/core-family-detail')
}

function goToDynamics() {
  router.push('/core-family-detail')
}
</script>

<style scoped>
.family-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
}

.family-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
  margin-bottom: var(--spacing-base);
}

.family-avatar {
  font-size: 48px;
}

.family-details h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: 4px;
}

.family-details p {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.family-stats {
  display: flex;
  gap: var(--spacing-xl);
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.stat-num {
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.stat-label {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.section {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-base);
}

.members-list {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.member-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
  transition: background 0.3s;
}

.member-item:last-child {
  border-bottom: none;
}

.member-item:active {
  background: var(--bg-color-secondary);
}

.member-avatar {
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

.member-info {
  flex: 1;
}

.member-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: 4px;
}

.member-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.tag {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background: var(--primary-light);
  color: white;
  border-radius: var(--radius-full);
}

.birth-year {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}

.member-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
}

.dynamics-entry {
  display: flex;
  align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s;
}

.dynamics-entry:active {
  transform: scale(0.98);
}

.entry-icon {
  font-size: 36px;
  margin-right: var(--spacing-base);
}

.entry-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.entry-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
}

.entry-desc {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

.entry-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
}
</style>
