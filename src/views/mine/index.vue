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
            <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16" @click="showEditName = true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
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
          <span class="menu-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="20" height="20"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          </span>
          <span class="menu-text">我的回忆录</span>
          <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
        <div class="menu-item" @click="goToMilestones">
          <span class="menu-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </span>
          <span class="menu-text">我的大事记</span>
          <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
        <div class="menu-item" @click="goToFamily">
          <span class="menu-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </span>
          <span class="menu-text">我的家族</span>
          <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-item" @click="goToSettings">
          <span class="menu-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="20" height="20"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          </span>
          <span class="menu-text">设置</span>
          <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
        <div class="menu-item" @click="goToAbout">
          <span class="menu-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="20" height="20"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          </span>
          <span class="menu-text">关于</span>
          <svg class="menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
      </div>

      <!-- 退出登录 -->
      <button class="logout-btn" @click="logout">
        退出登录
      </button>

      <!-- 版本信息 -->
      <div class="version-info">
        <span>{{ userStore.userInfo.familyName }} v1.1.0</span>
        <span>福善门家族记录平台</span>
      </div>
    </div>

    <!-- 修改姓名弹窗 -->
    <van-popup v-model:show="showEditName" round position="bottom" :style="{ padding: '20px' }">
      <div class="edit-popup">
        <h3>修改信息</h3>
        <div class="edit-form">
          <label class="edit-label">姓名</label>
          <input v-model="editName" type="text" class="edit-input" placeholder="请输入新姓名" maxlength="20" />
        </div>
        <div class="edit-form">
          <label class="edit-label">家族名称</label>
          <input v-model="editFamilyName" type="text" class="edit-input" placeholder="请输入家族名称" maxlength="20" />
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
            <span>恢复默认数据</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
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

const showEditName = ref(false)
const editName = ref(userStore.userInfo.name)
const editFamilyName = ref(userStore.userInfo.familyName)

function saveName() {
  if (!editName.value.trim()) { showToast('请输入姓名'); return }
  userStore.updateUserInfo({ name: editName.value.trim(), familyName: editFamilyName.value.trim() || '赵家大院' })
  showEditName.value = false
  showToast('修改成功')
}

const showSettings = ref(false)
function goToSettings() { showSettings.value = true }

function resetData() {
  showConfirmDialog({ title: '确认恢复', message: '将清除所有本地数据并恢复为默认数据，此操作不可撤销。' })
    .then(() => {
      localStorage.removeItem('fushanmen_family_data')
      localStorage.removeItem('fushanmen_user_data')
      familyStore.resetData()
      showToast('已恢复默认数据')
      showSettings.value = false
      setTimeout(() => location.reload(), 500)
    }).catch(() => {})
}

function goToMemoirs() { router.push('/') }
function goToMilestones() { router.push('/milestone') }
function goToFamily() { router.push('/family-tree') }
function goToAbout() { showToast('福善门 v1.1.0 - 家族精神传承') }
function logout() { userStore.logout(); router.replace('/login') }
</script>

<style scoped>
.mine-header { background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); padding-bottom: var(--spacing-3xl); }
.user-profile { display: flex; align-items: center; gap: var(--spacing-base); }
.profile-avatar { width: 72px; height: 72px; border-radius: var(--radius-full); background: rgba(255, 255, 255, 0.3); display: flex; align-items: center; justify-content: center; font-size: var(--font-size-2xl); font-weight: 700; color: white; }
.profile-info h2 { font-size: var(--font-size-xl); font-weight: 600; color: white; margin-bottom: 4px; display: flex; align-items: center; gap: var(--spacing-xs); }
.edit-icon { cursor: pointer; opacity: 0.8; }
.edit-icon:active { opacity: 1; }
.profile-info p { font-size: var(--font-size-sm); color: rgba(255, 255, 255, 0.9); }

.stats-card { display: flex; justify-content: space-around; align-items: center; background: var(--bg-color-card); border-radius: var(--radius-xl); padding: var(--spacing-lg); margin-top: calc(-1 * var(--spacing-2xl)); box-shadow: var(--shadow-card); position: relative; z-index: 1; }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.stat-num { font-size: var(--font-size-2xl); font-weight: 700; color: var(--primary-color); margin-bottom: 4px; }
.stat-label { font-size: var(--font-size-sm); color: var(--text-color-light); }
.stat-divider { width: 1px; height: 40px; background: var(--border-color); }

.menu-section { background: var(--bg-color-card); border-radius: var(--radius-lg); margin-top: var(--spacing-base); overflow: hidden; }
.menu-item { display: flex; align-items: center; padding: var(--spacing-base); border-bottom: 1px solid var(--border-color-light); cursor: pointer; transition: background 0.3s; }
.menu-item:last-child { border-bottom: none; }
.menu-item:active { background: var(--bg-color-secondary); }
.menu-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; margin-right: var(--spacing-base); color: var(--primary-color); flex-shrink: 0; }
.menu-text { flex: 1; font-size: var(--font-size-base); color: var(--text-color-primary); }
.menu-arrow { color: var(--text-color-light); flex-shrink: 0; }

.logout-btn { display: block; width: 100%; margin-top: var(--spacing-xl); padding: var(--spacing-base); background: transparent; border: 1px solid var(--danger-color); border-radius: var(--radius-lg); color: var(--danger-color); font-size: var(--font-size-base); cursor: pointer; transition: all 0.3s; }
.logout-btn:active { background: var(--danger-color); color: white; }

.version-info { margin-top: var(--spacing-xl); text-align: center; display: flex; flex-direction: column; gap: var(--spacing-xs); }
.version-info span { font-size: var(--font-size-xs); color: var(--text-color-light); }

.edit-popup { text-align: center; }
.edit-popup h3 { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--text-color-primary); margin-bottom: var(--spacing-lg); }
.edit-form { text-align: left; margin-bottom: var(--spacing-lg); }
.edit-label { display: block; font-size: var(--font-size-sm); color: var(--text-color-secondary); margin-bottom: var(--spacing-xs); }
.edit-input { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-secondary); color: var(--text-color-primary); box-sizing: border-box; }
.edit-input:focus { outline: none; border-color: var(--primary-color); }
.btn-primary { display: block; width: 100%; padding: var(--spacing-base); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; }
.btn-primary:active { opacity: 0.9; }
.btn-cancel { display: block; width: 100%; margin-top: var(--spacing-sm); padding: var(--spacing-base); background: transparent; border: none; color: var(--text-color-light); font-size: var(--font-size-base); cursor: pointer; }
.settings-list { text-align: left; margin-bottom: var(--spacing-lg); }
.settings-item { display: flex; align-items: center; justify-content: space-between; padding: var(--spacing-base); border-bottom: 1px solid var(--border-color-light); cursor: pointer; }
.settings-item:active { background: var(--bg-color-secondary); }
</style>
