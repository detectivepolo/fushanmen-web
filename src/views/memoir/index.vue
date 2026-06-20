<template>
  <div class="page-container">
    <!-- 顶部品牌区 -->
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
      <!-- 录制入口 -->
      <div class="record-cta" @click="goToRecord">
        <div class="record-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
        <div class="record-text">
          <span class="record-title">录制新回忆</span>
          <span class="record-desc">用声音留住时光</span>
        </div>
        <svg class="record-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <!-- 回忆录（按人物） -->
      <div class="section" v-if="protagonistGroups.length > 0">
        <div class="section-head">
          <h3 class="section-title">回忆录</h3>
          <span class="section-sub">{{ totalMemoirs }}段 · {{ protagonistGroups.length }}人</span>
        </div>
        <div class="person-list">
          <div 
            v-for="group in protagonistGroups" 
            :key="group.protagonist.id"
            class="person-card"
            @click="goToCombined(group.protagonist.id)"
          >
            <div class="person-avatar" :style="group.protagonist.avatar ? { backgroundImage: `url(${group.protagonist.avatar})` } : {}">
              <span v-if="!group.protagonist.avatar">{{ group.protagonist.name.charAt(0) }}</span>
            </div>
            <div class="person-info">
              <h4 class="person-name">{{ group.protagonist.name }}</h4>
              <p class="person-meta">
                {{ group.mergedCount }}段已整合
                <template v-if="group.unmergedCount > 0"> · {{ group.unmergedCount }}段待整合</template>
              </p>
            </div>
            <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18">
              <polyline points="9 18 15 12 9 6" />
            </svg>
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
            <div class="segment-icon" :class="{ merged: memoir.merged }">
              <svg v-if="memoir.merged" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="16" y2="17" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
            </div>
            <div class="segment-content">
              <h4 class="segment-title">{{ memoir.title }}</h4>
              <div class="segment-meta">
                <span>{{ memoir.protagonist.name }}</span>
                <span class="seg-dot">·</span>
                <span>{{ formatDate(memoir.createdAt) }}</span>
              </div>
            </div>
            <span class="segment-duration">{{ formatDuration(memoir.duration) }}</span>
          </div>
        </div>
        <div class="empty-state" v-else>
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
            <div class="col-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div class="col-info">
              <h4 class="col-title">{{ col.title }}</h4>
              <p class="col-desc">{{ col.desc }}</p>
            </div>
            <svg class="card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18">
              <polyline points="9 18 15 12 9 6" />
            </svg>
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
  return groups.map(g => ({
    protagonist: g.protagonist,
    memoirs: g.memoirs,
    mergedCount: g.memoirs.filter(m => m.merged).length,
    unmergedCount: g.memoirs.filter(m => !m.merged).length
  }))
})

function goToRecord() { router.push('/memoir-record') }
function viewDetail(memoir) { router.push({ path: '/memoir-detail', query: { id: memoir.id } }) }
function goToCombined(pid) { router.push({ path: '/memoir-combined', query: { id: pid } }) }
function goToCollection(id) { router.push({ path: '/memoir-collection', query: { id } }) }
function goSettings() { router.push('/mine') }

function formatDuration(s) { if (!s) return '0:00'; const m = Math.floor(s/60); const sec = s%60; return `${m}:${sec.toString().padStart(2,'0')}` }
function formatDate(d) { if (!d) return ''; const date = new Date(d); return `${date.getMonth()+1}月${date.getDate()}日` }
</script>

<style scoped>
.brand-header {
  background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 50%, #9CC5A8 100%);
  color: white;
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl);
}
.brand-inner { display: flex; align-items: center; justify-content: space-between; }
.brand-mark { display: flex; align-items: baseline; gap: var(--spacing-sm); }
.brand-name { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.1em; }
.brand-sub { font-size: var(--font-size-sm); opacity: 0.75; }
.settings-btn { color: white; opacity: 0.7; cursor: pointer; padding: var(--spacing-xs); display: flex; }
.settings-btn:active { opacity: 1; }

.page-body { padding: var(--spacing-base) var(--spacing-base) calc(80px + var(--safe-area-inset-bottom)); }

.record-cta {
  display: flex; align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-card);
  cursor: pointer; transition: all 0.3s;
}
.record-cta:active { transform: scale(0.98); }
.record-circle {
  width: 52px; height: 52px; border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-right: var(--spacing-base);
  box-shadow: var(--shadow-primary); color: white;
}
.record-text { flex: 1; display: flex; flex-direction: column; }
.record-title { font-family: var(--font-serif); font-size: var(--font-size-md); font-weight: 600; color: var(--text-color-primary); }
.record-desc { font-size: var(--font-size-sm); color: var(--text-color-light); margin-top: 2px; }
.record-arrow { color: var(--text-color-light); }

.section { margin-bottom: var(--spacing-xl); }
.section-head { display: flex; align-items: baseline; gap: var(--spacing-sm); margin-bottom: var(--spacing-base); }
.section-title { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--text-color-primary); }
.section-sub { font-size: var(--font-size-sm); color: var(--text-color-light); }

.person-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.person-card {
  display: flex; align-items: center; background: var(--bg-color-card);
  border-radius: var(--radius-lg); padding: var(--spacing-base);
  box-shadow: var(--shadow-card); cursor: pointer; transition: all 0.3s;
  border-left: 3px solid var(--primary-soft);
}
.person-card:active { transform: scale(0.98); }
.person-avatar {
  width: 48px; height: 48px; border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  background-size: cover; background-position: center;
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-lg); font-weight: 600; margin-right: var(--spacing-base); flex-shrink: 0;
}
.person-info { flex: 1; min-width: 0; }
.person-name { font-family: var(--font-serif); font-size: var(--font-size-md); font-weight: 600; color: var(--text-color-primary); margin-bottom: 2px; }
.person-meta { font-size: var(--font-size-sm); color: var(--text-color-secondary); }
.card-arrow { color: var(--text-color-light); }

.segment-list { background: var(--bg-color-card); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-card); }
.segment-item { display: flex; align-items: center; padding: var(--spacing-base); border-bottom: 1px solid var(--border-color-light); cursor: pointer; transition: background 0.3s; }
.segment-item:last-child { border-bottom: none; }
.segment-item:active { background: var(--bg-color-secondary); }
.segment-icon {
  width: 40px; height: 40px; border-radius: var(--radius-md);
  background: var(--bg-color-warm); display: flex; align-items: center; justify-content: center;
  margin-right: var(--spacing-base); flex-shrink: 0; color: var(--text-color-light);
}
.segment-icon.merged { color: var(--primary-color); background: var(--primary-bg); }
.segment-content { flex: 1; min-width: 0; }
.segment-title { font-size: var(--font-size-base); font-weight: 500; color: var(--text-color-primary); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.segment-meta { font-size: var(--font-size-sm); color: var(--text-color-light); display: flex; align-items: center; gap: var(--spacing-xs); }
.seg-dot { color: var(--border-color-warm); }
.segment-duration { font-size: var(--font-size-sm); color: var(--primary-color); margin-left: var(--spacing-sm); flex-shrink: 0; }

.empty-state { text-align: center; padding: var(--spacing-3xl) var(--spacing-base); }
.empty-text { font-size: var(--font-size-sm); color: var(--text-color-light); }

.collection-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.collection-card {
  display: flex; align-items: center; background: var(--bg-color-warm);
  border-radius: var(--radius-lg); padding: var(--spacing-base);
  box-shadow: var(--shadow-card); cursor: pointer; transition: all 0.3s;
  border-left: 3px solid var(--primary-soft);
}
.collection-card:active { transform: scale(0.98); }
.col-icon-wrap { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: var(--primary-color); margin-right: var(--spacing-base); flex-shrink: 0; }
.col-info { flex: 1; min-width: 0; }
.col-title { font-family: var(--font-serif); font-size: var(--font-size-base); font-weight: 600; color: var(--text-color-primary); margin-bottom: 2px; }
.col-desc { font-size: var(--font-size-sm); color: var(--text-color-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
