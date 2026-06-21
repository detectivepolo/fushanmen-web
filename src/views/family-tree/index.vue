<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-inner">
        <h1>家族树</h1>
        <span class="add-btn" @click="openAddMember">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          添加
        </span>
      </div>
    </header>

    <div class="page-content">
      <div class="tree-scroll">
        <div class="tree-container">
          <div
            v-for="node in flatTree"
            :key="node.member.id"
            class="tree-node-wrapper"
            :style="{ paddingLeft: node.depth * 24 + 'px' }"
          >
            <span
              v-for="d in node.depth"
              :key="d"
              class="tree-indent"
              :class="{ 'indent-empty': node.ancestorIsLast[d - 1] }"
            ></span>
            <div class="tree-node" :class="{ 'is-me': isMe(node.member) }" @click="showMemberDetail(node.member)">
              <span class="node-connector" v-if="node.depth > 0"></span>
              <div class="node-info">
                <div class="node-name-row">
                  <span class="node-name">{{ node.member.name }}</span>
                  <span v-if="isMe(node.member)" class="me-tag">我</span>
                  <span v-if="!node.member.isAlive" class="deceased-tag">故</span>
                </div>
                <div class="node-meta">
                  <span v-if="node.member.birthYear">{{ node.member.birthYear }}年生</span>
                  <span v-if="node.member.spouse">· 配偶 {{ node.member.spouse }}</span>
                </div>
              </div>
              <svg class="node-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="add-generation" @click="addNewGeneration">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="16" height="16">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>添加第{{ toChineseNum(maxGeneration + 1) }}代</span>
      </div>
    </div>

    <!-- 添加成员弹窗 -->
    <van-popup v-model:show="showAddMember" round position="bottom" :style="{ padding: '20px', maxHeight: '85vh', overflow: 'auto' }">
      <div class="add-popup">
        <h3>添加家族成员</h3>
        <div class="photo-upload-area" @click="triggerPhotoUpload">
          <div v-if="newMember.avatar" class="photo-preview" :style="{ backgroundImage: `url(${newMember.avatar})` }"></div>
          <div v-else class="photo-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
            <span>添加照片</span>
          </div>
        </div>
        <input ref="photoInput" type="file" accept="image/*" @change="onPhotoSelected" style="display:none" />
        <div class="add-form"><label class="form-label">姓名 <span class="required">*</span></label><input v-model="newMember.name" type="text" class="form-input" placeholder="请输入姓名" maxlength="20" /></div>
        <div class="add-form"><label class="form-label">第几代</label><div class="gen-selector"><button v-for="g in genOptions" :key="g" class="gen-btn" :class="{ active: newMember.generation === g }" @click="newMember.generation = g">第{{ toChineseNum(g) }}代</button></div></div>
        <div class="add-form"><label class="form-label">出生年份</label><input v-model="newMember.birthYear" type="number" class="form-input" placeholder="例如：1990" min="1900" max="2030" /></div>
        <div class="add-form"><label class="form-label">配偶</label><input v-model="newMember.spouse" type="text" class="form-input" placeholder="配偶姓名（可选）" maxlength="20" /></div>
        <div class="add-form"><label class="form-label">是否健在</label><div class="alive-toggle"><button class="alive-btn" :class="{ active: newMember.isAlive }" @click="newMember.isAlive = true">健在</button><button class="alive-btn" :class="{ active: !newMember.isAlive }" @click="newMember.isAlive = false">故人</button></div></div>
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

        <div class="detail-info" v-if="!isEditing">
          <div class="detail-row" v-if="detailMember.birthYear"><span class="detail-label">出生年份</span><span class="detail-value">{{ detailMember.birthYear }}年</span></div>
          <div class="detail-row" v-if="detailMember.spouse"><span class="detail-label">配偶</span><span class="detail-value">{{ detailMember.spouse }}</span></div>
          <div class="detail-row"><span class="detail-label">状态</span><span class="detail-value" :class="{ deceased: !detailMember.isAlive }">{{ detailMember.isAlive ? '健在' : '故人' }}</span></div>
        </div>

        <div class="edit-form" v-else>
          <div class="photo-upload-area compact" @click="triggerEditPhotoUpload">
            <div v-if="editData.avatar" class="photo-preview" :style="{ backgroundImage: `url(${editData.avatar})` }"></div>
            <div v-else class="photo-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <span>更换照片</span>
            </div>
          </div>
          <input ref="editPhotoInput" type="file" accept="image/*" @change="onEditPhotoSelected" style="display:none" />
          <div class="add-form"><label class="form-label">姓名 <span class="required">*</span></label><input v-model="editData.name" type="text" class="form-input" maxlength="20" /></div>
          <div class="add-form"><label class="form-label">第几代</label><div class="gen-selector"><button v-for="g in genOptions" :key="g" class="gen-btn" :class="{ active: editData.generation === g }" @click="editData.generation = g">第{{ toChineseNum(g) }}代</button></div></div>
          <div class="add-form"><label class="form-label">出生年份</label><input v-model="editData.birthYear" type="number" class="form-input" placeholder="例如：1990" min="1900" max="2030" /></div>
          <div class="add-form"><label class="form-label">配偶</label><input v-model="editData.spouse" type="text" class="form-input" placeholder="配偶姓名（可选）" maxlength="20" /></div>
          <div class="add-form"><label class="form-label">是否健在</label><div class="alive-toggle"><button class="alive-btn" :class="{ active: editData.isAlive }" @click="editData.isAlive = true">健在</button><button class="alive-btn" :class="{ active: !editData.isAlive }" @click="editData.isAlive = false">故人</button></div></div>
        </div>

        <div class="detail-actions">
          <template v-if="!isEditing">
            <button v-if="perspectiveCount(detailMember.id) > 0" class="btn-memoir" @click="goToPerspective">「我眼中的{{ detailMember.name }}」（{{ perspectiveCount(detailMember.id) }}篇）</button>
            <button class="btn-record" @click="goWritePerspective">写「我眼中的{{ detailMember.name }}」</button>
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

const maxGeneration = computed(() => {
  const gens = members.value.map(m => m.generation).filter(g => g != null)
  return gens.length > 0 ? Math.max(...gens) : 0
})
const genOptions = computed(() => { const a = []; for (let i = 1; i <= maxGeneration.value + 1; i++) a.push(i); return a })

// ===== 树形结构，按出生年月排序 =====
const flatTree = computed(() => {
  const result = []
  const allChildIds = members.value.flatMap(m => m.children || [])
  let roots = members.value.filter(m => !allChildIds.includes(m.id))
  if (roots.length === 0) {
    const minGen = Math.min(...members.value.map(m => m.generation || 1))
    roots = members.value.filter(m => (m.generation || 1) === minGen)
  }
  roots.sort((a, b) => (a.birthYear || 9999) - (b.birthYear || 9999))

  function traverse(member, depth, isLast, ancestorIsLast) {
    result.push({ member, depth, isLast, ancestorIsLast: [...ancestorIsLast] })
    const children = (member.children || [])
      .map(id => members.value.find(m => m.id === id))
      .filter(Boolean)
      .sort((a, b) => (a.birthYear || 9999) - (b.birthYear || 9999))
    children.forEach((child, i) => {
      traverse(child, depth + 1, i === children.length - 1, [...ancestorIsLast, isLast])
    })
  }
  roots.forEach((root, i) => traverse(root, 0, i === roots.length - 1, []))

  // 孤立成员
  const inTree = new Set(result.map(r => r.member.id))
  members.value
    .filter(m => !inTree.has(m.id))
    .sort((a, b) => (a.birthYear || 9999) - (b.birthYear || 9999))
    .forEach(m => result.push({ member: m, depth: 0, isLast: true, ancestorIsLast: [] }))

  return result
})

function isMe(member) { return userStore.isLoggedIn && member.name === userStore.userInfo.name }
function perspectiveCount(memberId) { return familyStore.getPerspectiveMemoirs(memberId).length }

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
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      callback(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}
function onPhotoSelected(e) { const f = e.target.files[0]; if (!f) return; compressImage(f, d => newMember.value.avatar = d); e.target.value = '' }
function onEditPhotoSelected(e) { const f = e.target.files[0]; if (!f) return; compressImage(f, d => editData.value.avatar = d); e.target.value = '' }

// ===== 添加成员 =====
const showAddMember = ref(false)
const newMember = ref({ name: '', generation: 1, birthYear: '', spouse: '', isAlive: true, avatar: '' })
function openAddMember() { newMember.value = { name: '', generation: 1, birthYear: '', spouse: '', isAlive: true, avatar: '' }; showAddMember.value = true }
function addNewGeneration() { newMember.value = { name: '', generation: maxGeneration.value + 1, birthYear: '', spouse: '', isAlive: true, avatar: '' }; showAddMember.value = true }
function addMember() {
  if (!newMember.value.name.trim()) { showToast('请输入姓名'); return }
  familyStore.addMember({ name: newMember.value.name.trim(), generation: newMember.value.generation, birthYear: newMember.value.birthYear ? parseInt(newMember.value.birthYear) : '', spouse: newMember.value.spouse.trim(), isAlive: newMember.value.isAlive, avatar: newMember.value.avatar })
  showAddMember.value = false; showToast('添加成功')
}

// ===== 详情 & 编辑 =====
const showDetail = ref(false)
const detailMember = ref(null)
const isEditing = ref(false)
const editData = ref({})
function startEdit() { const m = detailMember.value; editData.value = { name: m.name, generation: m.generation, birthYear: m.birthYear || '', spouse: m.spouse || '', isAlive: m.isAlive, avatar: m.avatar || '' }; isEditing.value = true }
function cancelEdit() { isEditing.value = false }
function saveEdit() {
  if (!editData.value.name.trim()) { showToast('请输入姓名'); return }
  familyStore.updateMember(detailMember.value.id, { name: editData.value.name.trim(), generation: editData.value.generation, birthYear: editData.value.birthYear ? parseInt(editData.value.birthYear) : '', spouse: editData.value.spouse.trim(), isAlive: editData.value.isAlive, avatar: editData.value.avatar })
  detailMember.value = familyStore.getMemberById(detailMember.value.id); isEditing.value = false; showToast('修改成功')
}
function confirmDelete() {
  showConfirmDialog({ title: '确认删除', message: `确定要删除「${detailMember.value.name}」吗？此操作不可撤销。` })
    .then(() => { familyStore.deleteMember(detailMember.value.id); showDetail.value = false; showToast('已删除') }).catch(() => {})
}

function goWritePerspective() {
  const mid = detailMember.value.id
  const mname = detailMember.value.name
  showDetail.value = false
  router.push({ path: '/memoir-record', query: { mode: 'perspective', subjectId: mid, subjectName: mname } })
}
function goToPerspective() {
  showDetail.value = false
  router.push({ path: '/', query: { tab: 'perspective', subjectId: detailMember.value.id } })
}
</script>

<style scoped>
.page-header { background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 60%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.header-inner { display: flex; align-items: center; justify-content: space-between; }
.page-header h1 { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.05em; }
.add-btn { font-size: var(--font-size-sm); color: white; background: rgba(255,255,255,0.2); padding: var(--spacing-xs) var(--spacing-base); border-radius: var(--radius-full); cursor: pointer; display: flex; align-items: center; gap: 4px; }
.add-btn:active { background: rgba(255,255,255,0.3); }

/* 树形图 - 无头像 */
.tree-scroll { overflow-x: auto; padding: var(--spacing-base); }
.tree-container { display: flex; flex-direction: column; min-width: fit-content; }
.tree-node-wrapper { position: relative; display: flex; align-items: stretch; }
.tree-indent { width: 24px; position: relative; flex-shrink: 0; }
.tree-indent::before { content: ''; position: absolute; left: 11px; top: 0; bottom: 0; width: 2px; background: var(--border-color); }
.tree-indent.indent-empty::before { display: none; }
.tree-node { display: flex; align-items: center; flex: 1; background: var(--bg-color-card); border-radius: var(--radius-lg); padding: var(--spacing-sm) var(--spacing-base); box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.3s; position: relative; margin-bottom: var(--spacing-sm); min-width: 180px; }
.tree-node:active { transform: scale(0.98); }
.tree-node.is-me { border: 1.5px solid var(--primary-color); background: var(--bg-color-warm); }
.node-connector { position: absolute; left: -12px; top: 50%; width: 12px; height: 2px; background: var(--border-color); }
.node-connector::before { content: ''; position: absolute; left: 0; top: -28px; width: 2px; height: 28px; background: var(--border-color); }
.node-info { flex: 1; min-width: 0; }
.node-name-row { display: flex; align-items: center; gap: var(--spacing-xs); }
.node-name { font-family: var(--font-serif); font-size: var(--font-size-base); font-weight: 600; color: var(--text-color-primary); }
.me-tag { font-size: 10px; color: white; background: var(--primary-color); padding: 1px 6px; border-radius: var(--radius-full); font-weight: 600; }
.deceased-tag { font-size: 10px; color: white; background: var(--text-color-light); padding: 1px 6px; border-radius: var(--radius-full); }
.node-meta { font-size: var(--font-size-xs); color: var(--text-color-light); display: flex; flex-wrap: wrap; gap: 2px; margin-top: 2px; }
.node-arrow { color: var(--text-color-light); flex-shrink: 0; }

.add-generation { display: flex; align-items: center; justify-content: center; gap: var(--spacing-sm); padding: var(--spacing-lg); margin: var(--spacing-base); border: 2px dashed var(--border-color); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.3s; color: var(--text-color-light); font-size: var(--font-size-sm); }
.add-generation:active { border-color: var(--primary-color); background: var(--bg-color-warm); color: var(--primary-color); }

.photo-upload-area { width: 80px; height: 80px; margin: 0 auto var(--spacing-lg); border-radius: var(--radius-full); cursor: pointer; }
.photo-upload-area.compact { width: 64px; height: 64px; }
.photo-preview { width: 100%; height: 100%; border-radius: var(--radius-full); background-size: cover; background-position: center; border: 2px solid var(--primary-soft); }
.photo-placeholder { width: 100%; height: 100%; border-radius: var(--radius-full); border: 2px dashed var(--border-color); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--text-color-light); font-size: var(--font-size-xs); background: var(--bg-color-secondary); }

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
.btn-memoir { display: block; width: 100%; padding: var(--spacing-base); background: var(--bg-color-warm); color: var(--primary-color); border: 1px solid var(--primary-soft); border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 500; cursor: pointer; margin-bottom: var(--spacing-sm); }
.btn-memoir:active { transform: scale(0.98); }
.btn-record { display: block; width: 100%; padding: var(--spacing-base); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; margin-bottom: var(--spacing-sm); box-shadow: var(--shadow-primary); }
.btn-record:active { opacity: 0.9; }
.btn-danger { display: block; width: 100%; margin-top: var(--spacing-sm); padding: var(--spacing-base); background: transparent; border: 1px solid var(--danger-color); border-radius: var(--radius-lg); color: var(--danger-color); font-size: var(--font-size-base); cursor: pointer; }
.btn-danger:active { background: var(--danger-color); color: white; }
</style>
