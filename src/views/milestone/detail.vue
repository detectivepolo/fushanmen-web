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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {{ milestone.location }}
          </span>
          <span class="meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            {{ (milestone.participants || []).length }}人参与
          </span>
        </div>
      </div>

      <!-- 描述 -->
      <div class="detail-section" v-if="milestone.description">
        <div class="section-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9 13" x2="15 13" /><line x1="9 17" x2="13 17" /></svg>
          <span class="section-title">事件描述</span>
        </div>
        <p class="description-text">{{ milestone.description }}</p>
      </div>

      <!-- 照片 -->
      <div class="detail-section" v-if="milestone.photos && milestone.photos.length > 0">
        <div class="section-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          <span class="section-title">照片</span>
        </div>
        <div class="photo-grid">
          <img v-for="(photo, index) in milestone.photos" :key="index" :src="photo" alt="照片" class="photo-item" />
        </div>
      </div>

      <!-- 参与人员 -->
      <div class="detail-section">
        <div class="section-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          <span class="section-title">参与人员</span>
        </div>
        <div class="participants-list">
          <div v-for="(name, index) in (milestone.participants || [])" :key="index" class="participant-item">
            <div class="participant-avatar">{{ name.charAt(0) }}</div>
            <span class="participant-name">{{ name }}</span>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="detail-section comment-section">
        <div class="section-title-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span class="section-title">家人评论</span>
          <span class="comment-count" v-if="comments.length > 0">{{ comments.length }}条</span>
        </div>

        <!-- 评论输入 -->
        <div class="comment-input-area">
          <input v-model="commentInput" type="text" class="comment-input" placeholder="说点什么..." maxlength="200" />
          <button class="comment-send-btn" :disabled="!commentInput.trim()" @click="sendComment">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>

        <!-- 评论列表 -->
        <div class="comment-list" v-if="comments.length > 0">
          <div v-for="c in comments" :key="c.id" class="comment-item">
            <div class="comment-avatar">{{ (c.author || '匿').charAt(0) }}</div>
            <div class="comment-body">
              <div class="comment-head">
                <span class="comment-author">{{ c.author || '匿名' }}</span>
                <span class="comment-time">{{ c.createdAt }}</span>
                <button v-if="c.authorId === currentUserId || !c.authorId" class="comment-delete" @click="deleteComment(c.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="12" height="12"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
              <p class="comment-text">{{ c.content }}</p>
            </div>
          </div>
        </div>
        <div class="comment-empty" v-else>
          <p>还没有评论，快来抢沙发吧</p>
        </div>
      </div>

      <!-- 操作 -->
      <div class="action-buttons">
        <button class="action-btn" @click="share">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          分享
        </button>
        <button class="action-btn danger" @click="confirmDeleteMilestone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
          删除
        </button>
      </div>
    </div>

    <div class="not-found" v-else>
      <p>大事记不存在</p>
      <button class="btn-back" @click="goBack">返回</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { useUserStore } from '@/store/user'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const familyStore = useFamilyStore()
const userStore = useUserStore()

const milestoneId = computed(() => route.query.id)

const milestone = computed(() => {
  return milestoneId.value ? familyStore.getMilestoneById(milestoneId.value) : null
})

const comments = computed(() => milestone.value?.comments || [])
const currentUserId = computed(() => userStore.userInfo.id)

// 评论输入
const commentInput = ref('')

function sendComment() {
  if (!commentInput.value.trim()) return
  familyStore.addMilestoneComment(milestoneId.value, {
    author: userStore.isLoggedIn ? userStore.userInfo.name : '匿名',
    authorId: userStore.isLoggedIn ? userStore.userInfo.id : '',
    content: commentInput.value.trim()
  })
  commentInput.value = ''
  showToast('评论成功')
}

function deleteComment(commentId) {
  showConfirmDialog({ title: '删除评论', message: '确定要删除这条评论吗？' })
    .then(() => { familyStore.deleteMilestoneComment(milestoneId.value, commentId); showToast('已删除') })
    .catch(() => {})
}

function confirmDeleteMilestone() {
  showConfirmDialog({ title: '确认删除', message: `确定要删除「${milestone.value.title}」吗？此操作不可撤销。` })
    .then(() => { familyStore.deleteMilestone(milestone.value.id); showToast('已删除'); router.back() })
    .catch(() => {})
}

function goBack() { router.back() }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
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
.page-header { display: flex; align-items: center; gap: var(--spacing-sm); background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 60%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.back-btn { font-size: var(--font-size-2xl); cursor: pointer; line-height: 1; }
.page-header h1 { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.05em; }

.detail-hero { background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); border-radius: var(--radius-xl); padding: var(--spacing-lg); color: white; margin-bottom: var(--spacing-lg); }
.hero-date { font-size: var(--font-size-sm); opacity: 0.9; margin-bottom: var(--spacing-xs); }
.hero-title { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 600; margin-bottom: var(--spacing-sm); }
.hero-meta { display: flex; flex-wrap: wrap; gap: var(--spacing-base); font-size: var(--font-size-sm); opacity: 0.9; }
.meta-item { display: flex; align-items: center; gap: 4px; }

.detail-section { background: var(--bg-color-card); border-radius: var(--radius-lg); padding: var(--spacing-base); margin-bottom: var(--spacing-base); box-shadow: var(--shadow-sm); }
.section-title-row { display: flex; align-items: center; gap: var(--spacing-xs); margin-bottom: var(--spacing-sm); color: var(--text-color-primary); }
.section-title { font-family: var(--font-serif); font-size: var(--font-size-base); font-weight: 600; color: var(--text-color-primary); }
.comment-count { font-size: var(--font-size-xs); color: var(--text-color-light); margin-left: auto; }

.description-text { font-size: var(--font-size-base); color: var(--text-color-secondary); line-height: 1.8; }

.photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-sm); }
.photo-item { aspect-ratio: 1; border-radius: var(--radius-md); object-fit: cover; }

.participants-list { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }
.participant-item { display: flex; align-items: center; gap: var(--spacing-xs); padding: var(--spacing-xs) var(--spacing-sm); background: var(--bg-color-secondary); border-radius: var(--radius-full); }
.participant-avatar { width: 28px; height: 28px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-xs); font-weight: 600; }
.participant-name { font-size: var(--font-size-sm); color: var(--text-color-primary); }

/* 评论区 */
.comment-section { padding-bottom: var(--spacing-sm); }
.comment-input-area { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-base); }
.comment-input { flex: 1; padding: var(--spacing-sm) var(--spacing-base); font-size: var(--font-size-sm); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-secondary); color: var(--text-color-primary); box-sizing: border-box; }
.comment-input:focus { outline: none; border-color: var(--primary-color); }
.comment-send-btn { width: 40px; height: 40px; border: none; background: var(--primary-color); color: white; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; flex-shrink: 0; }
.comment-send-btn:active { transform: scale(0.92); }
.comment-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.comment-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.comment-item { display: flex; gap: var(--spacing-sm); padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--border-color-light); }
.comment-item:last-child { border-bottom: none; }
.comment-avatar { width: 32px; height: 32px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-xs); font-weight: 600; flex-shrink: 0; }
.comment-body { flex: 1; min-width: 0; }
.comment-head { display: flex; align-items: center; gap: var(--spacing-xs); margin-bottom: 2px; }
.comment-author { font-size: var(--font-size-sm); font-weight: 600; color: var(--text-color-primary); }
.comment-time { font-size: var(--font-size-xs); color: var(--text-color-light); }
.comment-delete { margin-left: auto; border: none; background: transparent; color: var(--text-color-light); cursor: pointer; padding: 2px; display: flex; align-items: center; }
.comment-delete:active { color: var(--danger-color); }
.comment-text { font-size: var(--font-size-sm); color: var(--text-color-secondary); line-height: 1.5; word-break: break-word; }
.comment-empty { text-align: center; padding: var(--spacing-lg) 0; }
.comment-empty p { font-size: var(--font-size-sm); color: var(--text-color-light); }

.action-buttons { display: flex; gap: var(--spacing-sm); }
.action-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--spacing-xs); padding: var(--spacing-base); background: var(--bg-color-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); font-size: var(--font-size-sm); color: var(--text-color-primary); cursor: pointer; transition: all 0.3s; }
.action-btn:active { transform: scale(0.98); background: var(--bg-color-secondary); }
.action-btn.danger { color: var(--danger-color); border-color: var(--danger-color); }
.action-btn.danger:active { background: var(--danger-color); color: white; }

.not-found { text-align: center; padding: var(--spacing-3xl); }
.btn-back { margin-top: var(--spacing-base); padding: var(--spacing-base) var(--spacing-xl); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); cursor: pointer; }
</style>
