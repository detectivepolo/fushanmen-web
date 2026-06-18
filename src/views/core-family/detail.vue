<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>家族动态圈</h1>
    </header>

    <div class="page-content">
      <!-- 成员信息 -->
      <div class="member-profile" v-if="currentMember">
        <div class="profile-avatar">
          {{ currentMember.name.charAt(0) }}
        </div>
        <div class="profile-info">
          <h2>{{ currentMember.name }}</h2>
          <div class="profile-meta">
            <span class="tag">{{ currentMember.relation }}</span>
            <span v-if="currentMember.birthYear">🎂 {{ currentMember.birthYear }}年</span>
            <span v-if="currentMember.spouse">💑 {{ currentMember.spouse }}</span>
          </div>
        </div>
      </div>

      <!-- 动态列表 -->
      <div class="section-title">
        <span>📱 动态</span>
      </div>
      
      <div class="dynamics-list" v-if="dynamics.length > 0">
        <div 
          v-for="dyn in dynamics" 
          :key="dyn.id"
          class="dynamic-item"
        >
          <div class="dynamic-header">
            <div class="author-avatar">
              {{ dyn.author.name.charAt(0) }}
            </div>
            <div class="author-info">
              <span class="author-name">{{ dyn.author.name }}</span>
              <span class="dynamic-time">{{ formatTime(dyn.createdAt) }}</span>
            </div>
          </div>
          <div class="dynamic-content">
            {{ dyn.content }}
          </div>
          <div class="dynamic-footer">
            <span class="action-item">
              👍 {{ dyn.likes }}
            </span>
            <span class="action-item">
              💬 {{ dyn.comments }}
            </span>
          </div>
        </div>
      </div>

      <EmptyState 
        v-else
        icon="📭"
        title="暂无动态"
        description="这个家庭还没有发布动态"
      />
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

const currentMember = computed(() => familyStore.currentMember)
const dynamics = computed(() => familyStore.getDynamics())

function goBack() {
  router.back()
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}
</script>

<style scoped>
.member-profile {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-right: var(--spacing-base);
}

.profile-info h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.tag {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-base);
}

.dynamics-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.dynamic-item {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  box-shadow: var(--shadow-sm);
}

.dynamic-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-right: var(--spacing-sm);
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

.dynamic-time {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}

.dynamic-content {
  font-size: var(--font-size-base);
  color: var(--text-color-primary);
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
}

.dynamic-footer {
  display: flex;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--border-color-light);
}

.action-item {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  cursor: pointer;
}
</style>
