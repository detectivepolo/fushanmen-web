<template>
  <div class="page-container">
    <header class="brand-header">
      <div class="brand-inner">
        <div class="brand-mark">
          <span class="brand-name">福善门</span>
          <span class="brand-sub">赵家大院</span>
        </div>
        <span class="settings-btn" @click="goSettings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </span>
      </div>
    </header>

    <div class="page-body">
      <!-- 两个入口 -->
      <div class="entry-cards">
        <!-- 录制我的回忆 -->
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
            <span class="entry-title">录制我的回忆</span>
            <span class="entry-desc">{{ userName }} · 录音转文字 · AI润色</span>
          </div>
          <svg class="entry-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
        </div>

        <!-- 我眼中的XX -->
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
      </div>

      <!-- 我的回忆录 -->
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
      <div class="empty-state" v-if="myMemoirs.length === 0 && perspectiveMemoirs.length === 0">
        <p class="empty-text">还没有回忆</p>
        <p class="empty-hint">点击上方按钮，开始录制或写下你的故事</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { useUserStore } from '@/store/user'

const router = useRouter()
const route = useRoute()
const familyStore = useFamilyStore()
const userStore = useUserStore()

const userName = computed(() => userStore.userInfo.name || '我')

const allMemoirs = computed(() => familyStore.getMemoirs())

// 我的回忆录（type=self 或无type）
const myMemoirs = computed(() => allMemoirs.value.filter(m => (!m.type || m.type === 'self')))
const myMergedCount = computed(() => myMemoirs.value.filter(m => m.merged).length)

// 我眼中的家人（type=perspective）
const perspectiveMemoirs = computed(() => allMemoirs.value.filter(m => m.type === 'perspective'))

function goToRecord() { router.push('/memoir-record') }
function goToPerspectiveSelect() {
  // 跳转到家族树选人
  router.push('/family-tree?selectForPerspective=1')
}
function viewDetail(m) { router.push({ path: '/memoir-detail', query: { id: m.id } }) }
function goSettings() { router.push('/mine') }

function formatDuration(s) { if (!s) return '0:00'; const m = Math.floor(s/60); const sec = s%60; return `${m}:${sec.toString().padStart(2,'0')}` }
function formatDate(d) { if (!d) return ''; const date = new Date(d); return `${date.getMonth()+1}月${date.getDate()}日` }
</script>

<style scoped>
.brand-header { background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 50%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.brand-inner { display: flex; align-items: center; justify-content: space-between; }
.brand-mark { display: flex; align-items: baseline; gap: var(--spacing-sm); }
.brand-name { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.1em; }
.brand-sub { font-size: var(--font-size-sm); opacity: 0.75; }
.settings-btn { color: white; opacity: 0.7; cursor: pointer; padding: var(--spacing-xs); display: flex; }
.settings-btn:active { opacity: 1; }

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
.segment-content { flex: 1; min-width: 0; }
.segment-title { font-size: var(--font-size-base); font-weight: 500; color: var(--text-color-primary); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.segment-meta { font-size: var(--font-size-sm); color: var(--text-color-light); display: flex; align-items: center; gap: var(--spacing-xs); }
.seg-dot { color: var(--border-color-warm); }

.empty-state { text-align: center; padding: var(--spacing-3xl) var(--spacing-base); }
.empty-text { font-size: var(--font-size-md); color: var(--text-color-secondary); margin-bottom: var(--spacing-sm); }
.empty-hint { font-size: var(--font-size-sm); color: var(--text-color-light); }
</style>
