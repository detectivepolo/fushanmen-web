<template>
  <div class="page-container">
    <header class="page-header" @click="goBack">
      <span class="back-btn">‹</span>
      <h1>大事记详情</h1>
    </header>

    <div class="page-content" v-if="milestone">
      <!-- 封面 -->
      <div class="detail-hero">
        <div class="hero-date">{{ formatDate(milestone.date) }}</div>
        <h1 class="hero-title">{{ milestone.title }}</h1>
        <div class="hero-meta">
          <span v-if="milestone.location" class="meta-item">
            📍 {{ milestone.location }}
          </span>
          <span class="meta-item">
            👥 {{ milestone.participants.length }}人参与
          </span>
        </div>
      </div>

      <!-- 描述 -->
      <div class="detail-section" v-if="milestone.description">
        <div class="section-title">📝 事件描述</div>
        <p class="description-text">{{ milestone.description }}</p>
      </div>

      <!-- 照片 -->
      <div class="detail-section" v-if="milestone.photos && milestone.photos.length > 0">
        <div class="section-title">📷 照片</div>
        <div class="photo-grid">
          <img 
            v-for="(photo, index) in milestone.photos" 
            :key="index"
            :src="photo"
            alt="照片"
            class="photo-item"
          />
        </div>
      </div>

      <!-- 参与人员 -->
      <div class="detail-section">
        <div class="section-title">👥 参与人员</div>
        <div class="participants-list">
          <div 
            v-for="(name, index) in milestone.participants" 
            :key="index"
            class="participant-item"
          >
            <div class="participant-avatar">{{ name.charAt(0) }}</div>
            <span class="participant-name">{{ name }}</span>
          </div>
        </div>
      </div>

      <!-- 操作 -->
      <div class="action-buttons">
        <button class="action-btn" @click="edit">
          <span>✏️</span>
          编辑
        </button>
        <button class="action-btn" @click="share">
          <span>🔗</span>
          分享
        </button>
      </div>
    </div>

    <EmptyState 
      v-else
      icon="🔍"
      title="大事记不存在"
      description="该记录可能已被删除"
      actionText="返回"
      @action="goBack"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import EmptyState from '@/components/EmptyState.vue'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const familyStore = useFamilyStore()

const milestone = computed(() => {
  const id = route.query.id
  return id ? familyStore.getMilestoneById(id) : null
})

function goBack() {
  router.back()
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

function edit() {
  showToast('编辑功能开发中')
}

function share() {
  if (navigator.share) {
    navigator.share({
      title: milestone.value.title,
      text: milestone.value.description,
      url: window.location.href
    })
  } else {
    showToast('链接已复制')
  }
}
</script>

<style scoped>
.detail-hero {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  color: white;
  margin-bottom: var(--spacing-lg);
}

.hero-date {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-bottom: var(--spacing-xs);
}

.hero-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-base);
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.detail-section {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  margin-bottom: var(--spacing-base);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);
}

.description-text {
  font-size: var(--font-size-base);
  color: var(--text-color-secondary);
  line-height: 1.8;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.photo-item {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.participants-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.participant-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-color-secondary);
  border-radius: var(--radius-full);
}

.participant-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.participant-name {
  font-size: var(--font-size-sm);
  color: var(--text-color-primary);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-base);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-base);
  background: var(--bg-color-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  color: var(--text-color-primary);
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:active {
  transform: scale(0.98);
  background: var(--bg-color-secondary);
}
</style>
