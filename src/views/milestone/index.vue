<template>
  <div class="page-container">
    <header class="page-header">
      <h1>团聚大事记</h1>
    </header>

    <div class="page-content">
      <div class="quick-create" @click="goToCreate">
        <div class="create-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="28" height="28">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div class="create-info">
          <span class="create-title">记录新大事</span>
          <span class="create-desc">留住家庭的重要时刻</span>
        </div>
        <svg class="create-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      <div class="timeline-section">
        <div class="section-title">时间线</div>

        <div class="timeline" v-if="milestones.length > 0">
          <div v-for="milestone in milestones" :key="milestone.id" class="timeline-item" @click="viewDetail(milestone)">
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
                  <span v-if="milestone.location" class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {{ milestone.location }}
                  </span>
                  <span class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {{ milestone.participants.length }}人参与
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <p class="empty-text">暂无大事记，点击上方按钮记录第一个重要时刻</p>
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
const milestones = computed(() => familyStore.getMilestones())

function goToCreate() { router.push('/milestone-create') }
function viewDetail(m) { router.push({ path: '/milestone-detail', query: { id: m.id } }) }
function formatDate(d) { if(!d) return ''; const date=new Date(d); return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日` }
</script>

<style scoped>
.page-header { background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 60%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.page-header h1 { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.05em; }

.quick-create { display: flex; align-items: center; background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); border-radius: var(--radius-xl); padding: var(--spacing-lg); color: white; margin-bottom: var(--spacing-lg); cursor: pointer; transition: all 0.3s; }
.quick-create:active { transform: scale(0.98); }
.create-icon { width: 44px; height: 44px; border-radius: var(--radius-full); background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-right: var(--spacing-base); flex-shrink: 0; }
.create-info { flex: 1; display: flex; flex-direction: column; }
.create-title { font-size: var(--font-size-lg); font-weight: 600; margin-bottom: 4px; }
.create-desc { font-size: var(--font-size-sm); opacity: 0.85; }
.create-arrow { opacity: 0.7; }

.section-title { font-family: var(--font-serif); font-size: var(--font-size-md); font-weight: 600; color: var(--text-color-primary); margin-bottom: var(--spacing-base); }

.timeline { position: relative; padding-left: 30px; }
.timeline-marker { position: absolute; left: 0; display: flex; flex-direction: column; align-items: center; }
.marker-dot { width: 12px; height: 12px; border-radius: var(--radius-full); background: var(--primary-color); border: 3px solid var(--bg-color); box-shadow: 0 0 0 2px var(--primary-color); }
.marker-line { width: 2px; flex: 1; background: linear-gradient(to bottom, var(--primary-color), var(--border-color)); margin-top: var(--spacing-xs); }
.timeline-item { position: relative; padding-bottom: var(--spacing-xl); }
.timeline-item:last-child .marker-line { display: none; }
.timeline-date { font-size: var(--font-size-sm); color: var(--primary-color); font-weight: 500; margin-bottom: var(--spacing-sm); margin-left: var(--spacing-base); }
.milestone-card { background: var(--bg-color-card); border-radius: var(--radius-lg); padding: var(--spacing-base); box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.3s; }
.milestone-card:active { transform: scale(0.98); box-shadow: var(--shadow-card); }
.milestone-title { font-family: var(--font-serif); font-size: var(--font-size-base); font-weight: 600; color: var(--text-color-primary); margin-bottom: var(--spacing-xs); }
.milestone-desc { font-size: var(--font-size-sm); color: var(--text-color-secondary); line-height: 1.5; margin-bottom: var(--spacing-sm); }
.milestone-meta { display: flex; flex-wrap: wrap; gap: var(--spacing-base); font-size: var(--font-size-xs); color: var(--text-color-light); }
.meta-item { display: flex; align-items: center; gap: 4px; }

.empty-state { text-align: center; padding: var(--spacing-3xl) var(--spacing-base); }
.empty-text { font-size: var(--font-size-sm); color: var(--text-color-light); }
</style>
