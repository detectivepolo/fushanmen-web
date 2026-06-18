<template>
  <div class="page-container">
    <header class="page-header mine-header">
      <div class="user-profile">
        <div class="profile-avatar">
          {{ userStore.displayAvatar }}
        </div>
        <div class="profile-info">
          <h2>{{ userStore.displayName }}</h2>
          <p>{{ userStore.userInfo.familyName }}</p>
        </div>
      </div>
    </header>

    <div class="page-content">
      <!-- 数据统计 -->
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-num">{{ stats.totalMemoirs }}</span>
          <span class="stat-label">回忆录</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.totalMilestones }}</span>
          <span class="stat-label">大事记</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-num">{{ stats.totalMembers }}</span>
          <span class="stat-label">家族成员</span>
        </div>
      </div>

      <!-- 菜单列表 -->
      <div class="menu-section">
        <div class="menu-item" @click="goToMemoirs">
          <span class="menu-icon">🎙️</span>
          <span class="menu-text">我的回忆录</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item" @click="goToMilestones">
          <span class="menu-icon">📅</span>
          <span class="menu-text">我的大事记</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item" @click="goToFamily">
          <span class="menu-icon">👨‍👩‍👧‍👦</span>
          <span class="menu-text">我的家族</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goToSettings">
          <span class="menu-icon">⚙️</span>
          <span class="menu-text">设置</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item" @click="goToHelp">
          <span class="menu-icon">❓</span>
          <span class="menu-text">帮助与反馈</span>
          <span class="menu-arrow">›</span>
        </div>
        <div class="menu-item" @click="goToAbout">
          <span class="menu-icon">ℹ️</span>
          <span class="menu-text">关于</span>
          <span class="menu-arrow">›</span>
        </div>
      </div>

      <!-- 退出登录 -->
      <button class="logout-btn" @click="logout">
        退出登录
      </button>

      <!-- 版本信息 -->
      <div class="version-info">
        <span>赵家大院 v1.0.0</span>
        <span>福善门家族记录平台</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useFamilyStore } from '@/store/family'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const familyStore = useFamilyStore()

const stats = computed(() => familyStore.getStats())

function goToMemoirs() {
  router.push('/memoir')
}

function goToMilestones() {
  router.push('/milestone')
}

function goToFamily() {
  router.push('/family-tree')
}

function goToSettings() {
  showToast('设置功能开发中')
}

function goToHelp() {
  showToast('帮助功能开发中')
}

function goToAbout() {
  showToast('关于 - 赵家大院 v1.0.0')
}

function logout() {
  userStore.logout()
  router.replace('/login')
}
</script>

<style scoped>
.mine-header {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  padding-bottom: var(--spacing-3xl);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-base);
}

.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: white;
}

.profile-info h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.profile-info p {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.9);
}

.stats-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-top: -var(--spacing-2xl);
  box-shadow: var(--shadow-card);
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-color-light);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--border-color);
}

.menu-section {
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  margin-top: var(--spacing-base);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
  transition: background 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: var(--bg-color-secondary);
}

.menu-icon {
  font-size: var(--font-size-xl);
  margin-right: var(--spacing-base);
}

.menu-text {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--text-color-primary);
}

.menu-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
}

.logout-btn {
  display: block;
  width: 100%;
  margin-top: var(--spacing-xl);
  padding: var(--spacing-base);
  background: transparent;
  border: 1px solid var(--danger-color);
  border-radius: var(--radius-lg);
  color: var(--danger-color);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:active {
  background: var(--danger-color);
  color: white;
}

.version-info {
  margin-top: var(--spacing-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.version-info span {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}
</style>
