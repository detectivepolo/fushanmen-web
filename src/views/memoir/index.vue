<template>
  <div class="page-container">
    <header class="brand-header">
      <div class="brand-inner">
        <div class="brand-mark" @click="showEditFamilyName = true">
          <span class="brand-name">福善门</span>
          <span class="brand-sub">{{ userStore.userInfo.familyName }}</span>
          <svg class="edit-pencil" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </div>
        <div class="header-right">
          <template v-if="userStore.isLoggedIn">
            <span class="user-badge" @click="goToMine">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              {{ userStore.displayName }}
            </span>
          </template>
          <template v-else>
            <span class="login-btn" @click="goToLogin">登录</span>
          </template>
        </div>
      </div>
    </header>

    <div class="page-body">
      <!-- 我的回忆录 - 开始录制入口 -->
      <div class="entry-card primary-entry" @click="goToRecord">
        <div class="entry-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
        <div class="entry-text">
          <span class="entry-title">我的回忆录</span>
          <span class="entry-desc">开始录制 · 录音转文字 · AI润色</span>
        </div>
        <svg class="entry-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
      </div>

      <!-- 我眼中的家人 -->
      <div class="entry-card secondary-entry" @click="goToPerspectiveSelect">
        <div class="entry-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div class="entry-text">
          <span class="entry-title">我眼中的家人</span>
          <span class="entry-desc">写一段关于TA的故事</span>
        </div>
        <svg class="entry-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
      </div>

      <!-- 我的回忆录 - 历史片段 -->
      <div class="section" v-if="myMemoirs.length > 0">
        <div class="section-head">
          <h3 class="section-title">我的回忆录</h3>
          <span class="section-sub">{{ myMemoirs.length }}段 · {{ myMergedCount }}段已整合</span>
        </div>
        <div class="segment-list">
          <div v-for="m in myMemoirs" :key="m.id" class="segment-item" @click="viewDetail(m)">
            <div class="segment-icon" :class="{ merged: m.merged }">
              <svg v-if="m.merged" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" /><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
            </div>
            <div class="segment-content">
              <h4 class="segment-title">{{ m.title }}</h4>
              <div class="segment-meta"><span>{{ formatDate(m.createdAt) }}</span><span class="seg-dot">·</span><span>{{ formatDuration(m.duration) }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 家人的回忆录 -->
      <div class="section" v-if="familyMemoirs.length > 0">
        <div class="section-head">
          <h3 class="section-title">家人的回忆录</h3>
          <span class="section-sub">{{ familyMemoirs.length }}段</span>
        </div>
        <div class="segment-list">
          <div v-for="m in familyMemoirs" :key="m.id" class="segment-item" @click="viewDetail(m)">
            <div class="segment-icon family-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div class="segment-content">
              <h4 class="segment-title">{{ m.title }}</h4>
              <div class="segment-meta"><span>{{ m.author?.name || '家人' }}</span><span class="seg-dot">·</span><span>{{ formatDate(m.createdAt) }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我眼中的家人 -->
      <div class="section" v-if="perspectiveMemoirs.length > 0">
        <div class="section-head">
          <h3 class="section-title">我眼中的家人</h3>
          <span class="section-sub">{{ perspectiveMemoirs.length }}篇</span>
        </div>
        <div class="segment-list">
          <div v-for="m in perspectiveMemoirs" :key="m.id" class="segment-item" @click="viewDetail(m)">
            <div class="segment-icon perspective">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div class="segment-content">
              <h4 class="segment-title">{{ m.title }}</h4>
              <div class="segment-meta"><span>眼中的 {{ m.subject?.name }}</span><span class="seg-dot">·</span><span>{{ formatDate(m.createdAt) }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="myMemoirs.length === 0 && perspectiveMemoirs.length === 0 && familyMemoirs.length === 0">
        <p class="empty-text">还没有回忆</p>
        <p class="empty-hint">点击上方按钮，开始录制或写下你的故事</p>
      </div>
    </div>

    <!-- 编辑家族名称弹窗 -->
    <van-popup v-model:show="showEditFamilyName" round position="bottom" :style="{ padding: '20px' }">
      <div class="edit-popup">
        <h3>修改家族名称</h3>
        <div class="edit-form">
          <label class="form-label">家族名称</label>
          <input v-model="editFamilyName" type="text" class="form-input" placeholder="请输入家族名称" maxlength="20" />
        </div>
        <button class="btn-primary btn-block" @click="saveFamilyName">保存</button>
        <button class="btn-cancel" @click="showEditFamilyName = false">取消</button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { useUserStore } from '@/store/user'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const familyStore = useFamilyStore()
const userStore = useUserStore()

const allMemoirs = computed(() => familyStore.getMemoirs())
const currentUserId = computed(() => userStore.userInfo.id)

// 我的回忆录（自己录制的，type=self）
const myMemoirs = computed(() => allMemoirs.value.filter(m => 
  (!m.type || m.type === 'self') && m.author?.id === currentUserId.value
))
const myMergedCount = computed(() => myMemoirs.value.filter(m => m.merged).length)

// 家人的回忆录（他人录制的）
const familyMemoirs = computed(() => allMemoirs.value.filter(m => 
  (!m.type || m.type === 'self') && m.author?.id !== currentUserId.value
))

// 我眼中的家人（type=perspective）
const perspectiveMemoirs = computed(() => allMemoirs.value.filter(m => m.type === 'perspective'))

function goToRecord() { router.push('/memoir-record') }
function goToPerspectiveSelect() { router.push('/family-tree?selectForPerspective=1') }
function viewDetail(m) { router.push({ path: '/memoir-detail', query: { id: m.id } }) }
function goToMine() { router.push('/mine') }
function goToLogin() { router.push('/login') }

// 编辑家族名称
const showEditFamilyName = ref(false)
const editFamilyName = ref('')
function saveFamilyName() {
  if (!editFamilyName.value.trim()) { showToast('请输入家族名称'); return }
  userStore.updateUserInfo({ familyName: editFamilyName.value.trim() })
  showEditFamilyName.value = false
  showToast('修改成功')
}
// 打开弹窗时同步当前值
import { watch } from 'vue'
watch(showEditFamilyName, (val) => { if (val) editFamilyName.value = userStore.userInfo.familyName })

function formatDuration(s) { if (!s) return '0:00'; const m = Math.floor(s/60); const sec = s%60; return `${m}:${sec.toString().padStart(2,'0')}` }
function formatDate(d) { if (!d) return ''; const date = new Date(d); return `${date.getMonth()+1}月${date.getDate()}日` }
</script>

<style scoped>
.brand-header { background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 50%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.brand-inner { display: flex; align-items: center; justify-content: space-between; }
.brand-mark { display: flex; align-items: baseline; gap: var(--spacing-sm); cursor: pointer; }
.brand-mark:active { opacity: 0.8; }
.brand-name { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.1em; }
.brand-sub { font-size: var(--font-size-sm); opacity: 0.8; }
.edit-pencil { opacity: 0.5; margin-left: 2px; }
.header-right { display: flex; align-items: center; }
.user-badge { display: flex; align-items: center; gap: 4px; font-size: var(--font-size-sm); color: white; opacity: 0.9; cursor: pointer; background: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: var(--radius-full); }
.user-badge:active { background: rgba(255,255,255,0.25); }
.login-btn { font-size: var(--font-size-sm); color: white; background: rgba(255,255,255,0.2); padding: 4px 16px; border-radius: var(--radius-full); cursor: pointer; }
.login-btn:active { background: rgba(255,255,255,0.3); }

.page-body { padding: var(--spacing-base) var(--spacing-base) calc(80px + var(--safe-area-inset-bottom)); }

.entry-cards { display: flex; flex-direction: column; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl); }
.entry-card { display: flex; align-items: center; border-radius: var(--radius-xl); padding: var(--spacing-lg); cursor: pointer; transition: all 0.3s; }
.entry-card:active { transform: scale(0.98); }
.primary-entry { background: var(--bg-color-card); box-shadow: var(--shadow-card); border-left: 3px solid var(--primary-color); }
.secondary-entry { background: var(--bg-color-warm); box-shadow: var(--shadow-sm); border-left: 3px solid var(--primary-soft); }
.entry-icon-wrap { width: 44px; height: 44px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: var(--spacing-base); }
.primary-entry .entry-icon-wrap { background: var(--primary-bg); color: var(--primary-color); }
.secondary-entry .entry-icon-wrap { background: var(--bg-color-secondary); color: var(--text-color-secondary); }
.entry-text { flex: 1; display: flex; flex-direction: column; }
.entry-title { font-family: var(--font-serif); font-size: var(--font-size-md); font-weight: 600; color: var(--text-color-primary); }
.entry-desc { font-size: var(--font-size-xs); color: var(--text-color-light); margin-top: 2px; }
.entry-arrow { color: var(--text-color-light); }

.section { margin-bottom: var(--spacing-xl); }
.section-head { display: flex; align-items: baseline; gap: var(--spacing-sm); margin-bottom: var(--spacing-base); }
.section-title { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--text-color-primary); }
.section-sub { font-size: var(--font-size-sm); color: var(--text-color-light); }

.segment-list { background: var(--bg-color-card); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-card); }
.segment-item { display: flex; align-items: center; padding: var(--spacing-base); border-bottom: 1px solid var(--border-color-light); cursor: pointer; transition: background 0.3s; }
.segment-item:last-child { border-bottom: none; }
.segment-item:active { background: var(--bg-color-secondary); }
.segment-icon { width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--bg-color-warm); display: flex; align-items: center; justify-content: center; margin-right: var(--spacing-base); flex-shrink: 0; color: var(--text-color-light); }
.segment-icon.merged { color: var(--primary-color); background: var(--primary-bg); }
.segment-icon.perspective { color: var(--accent-color); background: #F5EAE0; }
.segment-icon.family-icon { color: var(--info-color); background: #EBF0F4; }
.segment-content { flex: 1; min-width: 0; }
.segment-title { font-size: var(--font-size-base); font-weight: 500; color: var(--text-color-primary); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.segment-meta { font-size: var(--font-size-sm); color: var(--text-color-light); display: flex; align-items: center; gap: var(--spacing-xs); }
.seg-dot { color: var(--border-color-warm); }

.empty-state { text-align: center; padding: var(--spacing-3xl) var(--spacing-base); }
.empty-text { font-size: var(--font-size-md); color: var(--text-color-secondary); margin-bottom: var(--spacing-sm); }
.empty-hint { font-size: var(--font-size-sm); color: var(--text-color-light); }

/* 编辑弹窗 */
.edit-popup { text-align: center; }
.edit-popup h3 { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--text-color-primary); margin-bottom: var(--spacing-lg); }
.edit-form { text-align: left; margin-bottom: var(--spacing-lg); }
.form-label { display: block; font-size: var(--font-size-sm); color: var(--text-color-secondary); margin-bottom: var(--spacing-xs); }
.form-input { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-secondary); color: var(--text-color-primary); box-sizing: border-box; }
.form-input:focus { outline: none; border-color: var(--primary-color); }
.btn-primary { display: block; width: 100%; padding: var(--spacing-base); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; }
.btn-primary:active { opacity: 0.9; }
.btn-cancel { display: block; width: 100%; margin-top: var(--spacing-sm); padding: var(--spacing-base); background: transparent; border: none; color: var(--text-color-light); font-size: var(--font-size-base); cursor: pointer; }
</style>
