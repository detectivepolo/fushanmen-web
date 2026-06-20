<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-inner">
        <h1>家族树</h1>
        <span class="add-btn" @click="openAddMember">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          添加
        </span>
      </div>
    </header>

    <div class="page-content">
      <div class="generations-list">
        <div
          v-for="gen in generations"
          :key="gen"
          class="generation-section"
        >
          <div class="gen-header">
            <span class="gen-num">{{ toChineseNum(gen) }}</span>
            <span class="gen-text">第{{ toChineseNum(gen) }}代</span>
            <span class="gen-count">{{ getMembersByGeneration(gen).length }}人</span>
          </div>
          <div class="gen-members">
            <div
              v-for="member in getMembersByGeneration(gen)"
              :key="member.id"
              class="member-card"
              :class="{ 'is-me': isMe(member) }"
              @click="showMemberDetail(member)"
            >
              <div class="member-avatar" :class="{ deceased: !member.isAlive }" :style="member.avatar ? { backgroundImage: `url(${member.avatar})` } : {}">
                <span v-if="!member.avatar">{{ member.name.charAt(0) }}</span>
              </div>
              <div class="member-info">
                <div class="member-name-row">
                  <span class="member-name">{{ member.name }}</span>
                  <span v-if="isMe(member)" class="me-tag">我</span>
                  <span v-if="!member.isAlive" class="deceased-tag">故</span>
                </div>
                <div class="member-meta">
                  <span v-if="member.birthYear">{{ member.birthYear }}年生</span>
                  <span v-if="member.spouse">配偶：{{ member.spouse }}</span>
                  <span v-if="getMemoirCount(member.id) > 0" class="memoir-badge">{{ getMemoirCount(member.id) }}段回忆</span>
                </div>
              </div>
              <svg class="member-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>

        <div class="add-generation" @click="addNewGeneration">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>添加第{{ toChineseNum(maxGeneration + 1) }}代</span>
        </div>
      </div>
    </div>

    <!-- 添加成员弹窗 -->
    <van-popup v-model:show="showAddMember" round position="bottom" :style="{ padding: '20px', maxHeight: '85vh', overflow: 'auto' }">
      <div class="add-popup">
        <h3>添加家族成员</h3>

        <!-- 照片上传 -->
        <div class="photo-upload-area" @click="triggerPhotoUpload">
          <div v-if="newMember.avatar" class="photo-preview" :style="{ backgroundImage: `url(${newMember.avatar})` }"></div>
          <div v-else class="photo-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span>添加照片</span>
          </div>
        </div>
        <input ref="photoInput" type="file" accept="image/*" @change="onPhotoSelected" style="display:none" />

        <div class="add-form">
          <label class="form-label">姓名 <span class="required">*</span></label>
          <input v-model="newMember.name" type="text" class="form-input" placeholder="请输入姓名" maxlength="20" />
        </div>
        <div class="add-form">
          <label class="form-label">第几代</label>
          <div class="gen-selector">
            <button v-for="g in genOptions" :key="g" class="gen-btn" :class="{ active: newMember.generation === g }" @click="newMember.generation = g">第{{ toChineseNum(g) }}代</button>
          </div>
        </div>
        <div class="add-form">
          <label class="form-label">出生年份</label>
          <input v-model="newMember.birthYear" type="number" class="form-input" placeholder="例如：1990" min="1900" max="2030" />
        </div>
        <div class="add-form">
          <label class="form-label">配偶</label>
          <input v-model="newMember.spouse" type="text" class="form-input" placeholder="配偶姓名（可选）" maxlength="20" />
        </div>
        <div class="add-form">
          <label class="form-label">是否健在</label>
          <div class="alive-toggle">
            <button class="alive-btn" :class="{ active: newMember.isAlive }" @click="newMember.isAlive = true">健在</button>
            <button class="alive-btn" :class="{ active: !newMember.isAlive }" @click="newMember.isAlive = false">故人</button>
          </div>
        </div>
        <button class="btn-primary btn-block" @click="addMember">确认添加</button>
        <button class="btn-cancel" @click="showAddMember = false">取消</button>
      </div>
    </van-popup>

    <!-- 成员详情 & 编辑弹窗 -->
    <van-popup v-model:show="showDetail" round position="bottom" :style="{ padding: '20px', maxHeight: '90vh', overflow: 'auto' }">
      <div class="detail-popup" v-if="detailMember">
        <div class="detail-header">
          <div class="detail-avatar" :class="{ deceased: !detailMember.isAlive }" :style="detailMember.avatar ? { backgroundImage: `url(${detailMember.avatar})` } : {}">
            <span v-if="!detailMember.avatar">{{ detailMember.name.charAt(0) }}</span>
          </div>
          <h3>{{ detailMember.name }}</h3>
          <span class="detail-sub">第{{ toChineseNum(detailMember.generation) }}代<span v-if="isMe(detailMember)"> · 我</span></span>
        </div>

        <!-- 查看模式 -->
        <div class="detail-info" v-if="!isEditing">
          <div class="detail-row" v-if="detailMember.birthYear"><span class="detail-label">出生年份</span><span class="detail-value">{{ detailMember.birthYear }}年</span></div>
          <div class="detail-row" v-if="detailMember.spouse"><span class="detail-label">配偶</span><span class="detail-value">{{ detailMember.spouse }}</span></div>
          <div class="detail-row"><span class="detail-label">状态</span><span class="detail-value" :class="{ deceased: !detailMember.isAlive }">{{ detailMember.isAlive ? '健在' : '故人' }}</span></div>
        </div>

        <!-- 编辑模式 -->
        <div class="edit-form" v-else>
          <div class="photo-upload-area compact" @click="triggerEditPhotoUpload">
            <div v-if="editData.avatar" class="photo-preview" :style="{ backgroundImage: `url(${editData.avatar})` }"></div>
            <div v-else class="photo-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>更换照片</span>
            </div>
          </div>
          <input ref="editPhotoInput" type="file" accept="image/*" @change="onEditPhotoSelected" style="display:none" />
          <div class="add-form">
            <label class="form-label">姓名 <span class="required">*</span></label>
            <input v-model="editData.name" type="text" class="form-input" maxlength="20" />
          </div>
          <div class="add-form">
            <label class="form-label">第几代</label>
            <div class="gen-selector">
              <button v-for="g in genOptions" :key="g" class="gen-btn" :class="{ active: editData.generation === g }" @click="editData.generation = g">第{{ toChineseNum(g) }}代</button>
            </div>
          </div>
          <div class="add-form">
            <label class="form-label">出生年份</label>
            <input v-model="editData.birthYear" type="number" class="form-input" placeholder="例如：1990" min="1900" max="2030" />
          </div>
          <div class="add-form">
            <label class="form-label">配偶</label>
            <input v-model="editData.spouse" type="text" class="form-input" placeholder="配偶姓名（可选）" maxlength="20" />
          </div>
          <div class="add-form">
            <label class="form-label">是否健在</label>
            <div class="alive-toggle">
              <button class="alive-btn" :class="{ active: editData.isAlive }" @click="editData.isAlive = true">健在</button>
              <button class="alive-btn" :class="{ active: !editData.isAlive }" @click="editData.isAlive = false">故人</button>
            </div>
          </div>
        </div>

        <div class="detail-actions">
          <template v-if="!isEditing">
            <button v-if="getMemoirCount(detailMember.id) > 0" class="btn-memoir" @click="goToMemoirs">查看{{ detailMember.name }}的回忆录（{{ getMemoirCount(detailMember.id) }}段）</button>
            <button class="btn-record" @click="goRecordForMember">为{{ detailMember.name }}录制回忆</button>
            <button class="btn-primary btn-block" @click="startEdit">修改信息</button>
            <button class="btn-danger" @click="confirmDelete">删除成员</button>
            <button class="btn-cancel" @click="showDetail = false">关闭</button>
          </template>
          <template v-else>
            <button class="btn-primary btn-block" @click="saveEdit">保存修改</button>
            <button class="btn-cancel" @click="cancelEdit">取消</button>
          </template>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { useUserStore } from '@/store/user'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const familyStore = useFamilyStore()
const userStore = useUserStore()

const members = computed(() => familyStore.getMembers())

const chineseNums = ['','一','二','三','四','五','六','七','八','九','十']
function toChineseNum(n) {
  if (n <= 10) return chineseNums[n] || String(n)
  if (n < 20) return '十' + (chineseNums[n-10] || '')
  if (n === 20) return '二十'
  if (n < 30) return '二十' + (chineseNums[n-20] || '')
  return String(n)
}

const generations = computed(() => [...new Set(members.value.map(m => m.generation))].sort((a,b) => a-b))
const maxGeneration = computed(() => Math.max(...generations.value, 0))
const genOptions = computed(() => { const a=[]; for(let i=1;i<=maxGeneration.value+1;i++) a.push(i); return a })

function getMembersByGeneration(gen) { return members.value.filter(m => m.generation === gen) }
function isMe(member) { return userStore.isLoggedIn && member.name === userStore.userInfo.name }
function getMemoirCount(id) { return familyStore.getMemoirsByMemberId(id).length }

function showMemberDetail(member) {
  detailMember.value = member
  isEditing.value = false
  showDetail.value = true
}

// ===== 照片上传 =====
const photoInput = ref(null)
const editPhotoInput = ref(null)

function triggerPhotoUpload() { photoInput.value?.click() }
function triggerEditPhotoUpload() { editPhotoInput.value?.click() }

function compressImage(file, callback) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const maxSize = 400
      let w = img.width, h = img.height
      if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize } } 
      else { if (h > maxSize) { w = w * maxSize / h; h = maxSize } }
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      callback(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

function onPhotoSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  compressImage(file, (dataUrl) => { newMember.value.avatar = dataUrl })
  e.target.value = ''
}

function onEditPhotoSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  compressImage(file, (dataUrl) => { editData.value.avatar = dataUrl })
  e.target.value = ''
}

// ===== 添加成员 =====
const showAddMember = ref(false)
const newMember = ref({ name: '', generation: 1, birthYear: '', spouse: '', isAlive: true, avatar: '' })

function openAddMember() {
  newMember.value = { name: '', generation: 1, birthYear: '', spouse: '', isAlive: true, avatar: '' }
  showAddMember.value = true
}

function addNewGeneration() {
  newMember.value = { name: '', generation: maxGeneration.value + 1, birthYear: '', spouse: '', isAlive: true, avatar: '' }
  showAddMember.value = true
}

function addMember() {
  if (!newMember.value.name.trim()) { showToast('请输入姓名'); return }
  familyStore.addMember({
    name: newMember.value.name.trim(),
    generation: newMember.value.generation,
    birthYear: newMember.value.birthYear ? parseInt(newMember.value.birthYear) : '',
    spouse: newMember.value.spouse.trim(),
    isAlive: newMember.value.isAlive,
    avatar: newMember.value.avatar
  })
  showAddMember.value = false
  showToast('添加成功')
}

// ===== 详情 & 编辑 =====
const showDetail = ref(false)
const detailMember = ref(null)
const isEditing = ref(false)
const editData = ref({})

function startEdit() {
  const m = detailMember.value
  editData.value = { name: m.name, generation: m.generation, birthYear: m.birthYear || '', spouse: m.spouse || '', isAlive: m.isAlive, avatar: m.avatar || '' }
  isEditing.value = true
}
function cancelEdit() { isEditing.value = false }
function saveEdit() {
  if (!editData.value.name.trim()) { showToast('请输入姓名'); return }
  familyStore.updateMember(detailMember.value.id, {
    name: editData.value.name.trim(),
    generation: editData.value.generation,
    birthYear: editData.value.birthYear ? parseInt(editData.value.birthYear) : '',
    spouse: editData.value.spouse.trim(),
    isAlive: editData.value.isAlive,
    avatar: editData.value.avatar
  })
  detailMember.value = familyStore.getMemberById(detailMember.value.id)
  isEditing.value = false
  showToast('修改成功')
}
function confirmDelete() {
  showConfirmDialog({ title: '确认删除', message: `确定要删除「${detailMember.value.name}」吗？此操作不可撤销。` })
    .then(() => { familyStore.deleteMember(detailMember.value.id); showDetail.value = false; showToast('已删除') })
    .catch(() => {})
}
function goToMemoirs() { const mid = detailMember.value.id; showDetail.value = false; router.push({ path: '/memoir-combined', query: { id: mid } }) }
function goRecordForMember() { showDetail.value = false; router.push('/memoir-record') }
</script>

<style scoped>
.page-header { background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 60%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.header-inner { display: flex; align-items: center; justify-content: space-between; }
.page-header h1 { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.05em; }
.add-btn { font-size: var(--font-size-sm); color: white; background: rgba(255,255,255,0.2); padding: var(--spacing-xs) var(--spacing-base); border-radius: var(--radius-full); cursor: pointer; display: flex; align-items: center; gap: 4px; }
.add-btn:active { background: rgba(255,255,255,0.3); }

.generations-list { padding: var(--spacing-base); }
.generation-section { margin-bottom: var(--spacing-xl); }
.gen-header { display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: var(--spacing-base); padding-left: var(--spacing-sm); }
.gen-num { width: 32px; height: 32px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-base); font-weight: 700; font-family: var(--font-serif); flex-shrink: 0; }
.gen-text { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--text-color-primary); }
.gen-count { font-size: var(--font-size-xs); color: var(--text-color-light); margin-left: auto; }

.gen-members { display: flex; flex-direction: column; gap: var(--spacing-sm); padding-left: var(--spacing-sm); border-left: 2px solid var(--border-color-light); margin-left: 15px; padding-top: var(--spacing-xs); padding-bottom: var(--spacing-xs); }

.member-card { display: flex; align-items: center; background: var(--bg-color-card); border-radius: var(--radius-lg); padding: var(--spacing-base); box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.3s; }
.member-card:active { transform: scale(0.98); }
.member-card.is-me { border: 1.5px solid var(--primary-color); background: var(--bg-color-warm); }

.member-avatar { width: 44px; height: 44px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); background-size: cover; background-position: center; color: white; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-md); font-weight: 600; margin-right: var(--spacing-base); flex-shrink: 0; }
.member-avatar.deceased { background: var(--text-color-light); opacity: 0.6; }

.member-info { flex: 1; min-width: 0; }
.member-name-row { display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: 4px; }
.member-name { font-family: var(--font-serif); font-size: var(--font-size-base); font-weight: 600; color: var(--text-color-primary); }
.me-tag { font-size: 10px; color: white; background: var(--primary-color); padding: 1px 6px; border-radius: var(--radius-full); font-weight: 600; }
.deceased-tag { font-size: 10px; color: white; background: var(--text-color-light); padding: 1px 6px; border-radius: var(--radius-full); }
.member-meta { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); font-size: var(--font-size-xs); color: var(--text-color-light); }
.memoir-badge { color: var(--primary-color); font-weight: 500; }
.member-arrow { color: var(--text-color-light); flex-shrink: 0; }

.add-generation { display: flex; align-items: center; justify-content: center; gap: var(--spacing-sm); padding: var(--spacing-lg); margin: var(--spacing-base) 0; border: 2px dashed var(--border-color); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.3s; color: var(--text-color-light); font-size: var(--font-size-sm); }
.add-generation:active { border-color: var(--primary-color); background: var(--bg-color-warm); color: var(--primary-color); }

/* 照片上传 */
.photo-upload-area { width: 80px; height: 80px; margin: 0 auto var(--spacing-lg); border-radius: var(--radius-full); cursor: pointer; }
.photo-upload-area.compact { width: 64px; height: 64px; }
.photo-preview { width: 100%; height: 100%; border-radius: var(--radius-full); background-size: cover; background-position: center; border: 2px solid var(--primary-soft); }
.photo-placeholder { width: 100%; height: 100%; border-radius: var(--radius-full); border: 2px dashed var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--text-color-light); font-size: var(--font-size-xs); background: var(--bg-color-secondary); }

/* 弹窗 */
.add-popup { text-align: center; }
.add-popup h3 { font-family: var(--font-serif); font-size: var(--font-size-lg); font-weight: 600; color: var(--text-color-primary); margin-bottom: var(--spacing-lg); }
.add-form { text-align: left; margin-bottom: var(--spacing-lg); }
.form-label { display: block; font-size: var(--font-size-sm); color: var(--text-color-secondary); margin-bottom: var(--spacing-xs); }
.required { color: var(--danger-color); }
.form-input { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-secondary); color: var(--text-color-primary); box-sizing: border-box; }
.form-input:focus { outline: none; border-color: var(--primary-color); }
.gen-selector { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); }
.gen-btn { padding: var(--spacing-xs) var(--spacing-base); background: var(--bg-color-secondary); border: none; border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--text-color-secondary); cursor: pointer; transition: all 0.3s; }
.gen-btn.active { background: var(--primary-color); color: white; }
.alive-toggle { display: flex; gap: var(--spacing-sm); }
.alive-btn { flex: 1; padding: var(--spacing-sm); background: var(--bg-color-secondary); border: none; border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--text-color-secondary); cursor: pointer; transition: all 0.3s; }
.alive-btn.active { background: var(--primary-color); color: white; }
.btn-primary { display: block; width: 100%; padding: var(--spacing-base); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; }
.btn-primary:active { opacity: 0.9; }
.btn-cancel { display: block; width: 100%; margin-top: var(--spacing-sm); padding: var(--spacing-base); background: transparent; border: none; color: var(--text-color-light); font-size: var(--font-size-base); cursor: pointer; }

.detail-popup { text-align: center; }
.detail-header { margin-bottom: var(--spacing-lg); }
.detail-avatar { width: 64px; height: 64px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); background-size: cover; background-position: center; color: white; display: flex; align-items: center; justify-content: center; font-size: var(--font-size-xl); font-weight: 600; margin: 0 auto var(--spacing-sm); }
.detail-avatar.deceased { background: var(--text-color-light); opacity: 0.6; }
.detail-popup h3 { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 600; color: var(--text-color-primary); margin-bottom: 4px; }
.detail-sub { font-size: var(--font-size-sm); color: var(--text-color-light); }
.detail-info { text-align: left; margin-bottom: var(--spacing-lg); }
.detail-row { display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--border-color-light); }
.detail-label { font-size: var(--font-size-sm); color: var(--text-color-light); }
.detail-value { font-size: var(--font-size-sm); color: var(--text-color-primary); font-weight: 500; }
.detail-value.deceased { color: var(--text-color-light); }
.edit-form { text-align: left; margin-bottom: var(--spacing-lg); }
.detail-actions { margin-top: var(--spacing-base); }
.btn-memoir { display: block; width: 100%; padding: var(--spacing-base); background: var(--bg-color-warm); color: var(--primary-color); border: 1px solid var(--primary-soft); border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 500; cursor: pointer; margin-bottom: var(--spacing-sm); transition: all 0.3s; }
.btn-memoir:active { transform: scale(0.98); }
.btn-record { display: block; width: 100%; padding: var(--spacing-base); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; margin-bottom: var(--spacing-sm); box-shadow: var(--shadow-primary); }
.btn-record:active { opacity: 0.9; }
.btn-danger { display: block; width: 100%; margin-top: var(--spacing-sm); padding: var(--spacing-base); background: transparent; border: 1px solid var(--danger-color); border-radius: var(--radius-lg); color: var(--danger-color); font-size: var(--font-size-base); cursor: pointer; }
.btn-danger:active { background: var(--danger-color); color: white; }
</style>
