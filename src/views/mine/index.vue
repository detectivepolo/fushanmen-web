<template>
  <div class="page-container">
    <header class="page-header mine-header">
      <div class="user-profile">
        <div class="profile-avatar">
          {{ userStore.displayAvatar }}
        </div>
        <div class="profile-info">
          <h2>
            {{ userStore.displayName }}
            <span class="edit-icon" @click="showEditName = true">✏️</span>
          </h2>
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
        <span>赵家大院 v1.1.0</span>
        <span>福善门家族记录平台</span>
      </div>
    </div>

    <!-- 修改姓名弹窗 -->
    <van-popup v-model:show="showEditName" round position="bottom" :style="{ padding: '20px' }">
      <div class="edit-popup">
        <h3>修改姓名</h3>
        <div class="edit-form">
          <label class="edit-label">姓名</label>
          <input
            v-model="editName"
            type="text"
            class="edit-input"
            placeholder="请输入新姓名"
            maxlength="20"
          />
        </div>
        <div class="edit-form">
          <label class="edit-label">家族名称</label>
          <input
            v-model="editFamilyName"
            type="text"
            class="edit-input"
            placeholder="请输入家族名称"
            maxlength="20"
          />
        </div>
        <button class="btn-primary btn-block" @click="saveName">保存</button>
        <button class="btn-cancel" @click="showEditName = false">取消</button>
      </div>
    </van-popup>

    <!-- 设置弹窗 -->
    <van-popup v-model:show="showSettings" round position="bottom" :style="{ padding: '20px' }">
      <div class="edit-popup">
        <h3>设置</h3>
        <div class="settings-list">
          <div class="settings-item" @click="resetData">
            <span>🔄 恢复默认数据</span>
            <span class="menu-arrow">›</span>
          </div>
        </div>
        <button class="btn-cancel" @click="showSettings = false">关闭</button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useFamilyStore } from '@/store/family'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const familyStore = useFamilyStore()

const stats = computed(() => familyStore.getStats())

// 修改姓名
const showEditName = ref(false)
const editName = ref(userStore.userInfo.name)
const editFamilyName = ref(userStore.userInfo.familyName)

function saveName() {
  if (!editName.value.trim()) {
    showToast('请输入姓名')
    return
  }
  userStore.updateUserInfo({
    name: editName.value.trim(),
    familyName: editFamilyName.value.trim() || '赵家大院'
  })
  showEditName.value = false
  showToast('修改成功')
}

// 设置
const showSettings = ref(false)

function goToSettings() {
  showSettings.value = true
}

function resetData() {
  showConfirmDialog({
    title: '确认恢复',
    message: '将清除所有本地数据并恢复为默认数据，此操作不可撤销。'
  }).then(() => {
    localStorage.removeItem('fushanmen_family_data')
    localStorage.removeItem('fushanmen_user_data')
    familyStore.resetData()
    showToast('已恢复默认数据')
    showSettings.value = false
    setTimeout(() => location.reload(), 500)
  }).catch(() => {})
}

function goToMemoirs() {
  router.push('/memoir')
}

function goToMilestones() {
  router.push('/milestone')
}

function goToFamily() {
  router.push('/family-tree')
}

function goToHelp() {
  showToast('帮助功能开发中')
}

function goToAbout() {
  showToast('福善门 v1.1.0 - 家族精神传承')
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
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.edit-icon {
  font-size: var(--font-size-base);
  cursor: pointer;
  opacity: 0.8;
}

.edit-icon:active {
  opacity: 1;
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

/* 弹窗样式 */
.edit-popup {
  text-align: center;
}

.edit-popup h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-lg);
}

.edit-form {
  text-align: left;
  margin-bottom: var(--spacing-lg);
}

.edit-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
  margin-bottom: var(--spacing-xs);
}

.edit-input {
  width: 100%;
  padding: var(--spacing-base);
  font-size: var(--font-size-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color-secondary);
  color: var(--text-color-primary);
}

.edit-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.btn-primary {
  display: block;
  width: 100%;
  padding: var(--spacing-base);
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:active {
  opacity: 0.9;
}

.btn-cancel {
  display: block;
  width: 100%;
  margin-top: var(--spacing-sm);
  padding: var(--spacing-base);
  background: transparent;
  border: none;
  color: var(--text-color-light);
  font-size: var(--font-size-base);
  cursor: pointer;
}

.settings-list {
  text-align: left;
  margin-bottom: var(--spacing-lg);
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-base);
  border-bottom: 1px solid var(--border-color-light);
  cursor: pointer;
}

.settings-item:active {
  background: var(--bg-color-secondary);
}
</style>
