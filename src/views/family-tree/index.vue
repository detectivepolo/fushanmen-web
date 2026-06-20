<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-inner">
        <h1>家族树</h1>
        <span class="add-btn" @click="openAddMember">+ 添加</span>
      </div>
    </header>

    <!-- 切换视图 -->
    <div class="view-toggle">
      <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">📋 列表</button>
      <button :class="{ active: viewMode === 'tree' }" @click="viewMode = 'tree'">🌲 树状</button>
    </div>

    <div class="page-content">
      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="list-view">
        <div 
          v-for="member in members" 
          :key="member.id"
          class="member-card"
          @click="showMemberDetail(member)"
        >
          <div class="member-avatar">
            {{ member.name.charAt(0) }}
          </div>
          <div class="member-info">
            <div class="member-name-row">
              <span class="member-name">{{ member.name }}</span>
              <span class="member-relation">{{ member.relation }}</span>
            </div>
            <div class="member-meta">
              <span v-if="member.birthYear">{{ member.birthYear }}年生</span>
              <span v-if="member.spouse">配偶：{{ member.spouse }}</span>
              <span v-if="getMemoirCount(member.id) > 0" class="memoir-badge">{{ getMemoirCount(member.id) }}段回忆</span>
            </div>
          </div>
          <span class="member-arrow">›</span>
        </div>
      </div>

      <!-- 树状视图 -->
      <div v-else class="tree-view">
        <div class="tree-container">
          <div 
            v-for="gen in generations" 
            :key="gen"
            class="generation"
          >
            <div class="gen-label">第{{ gen }}代</div>
            <div class="gen-members">
              <div 
                v-for="member in getMembersByGeneration(gen)" 
                :key="member.id"
                class="tree-node"
                @click="showMemberDetail(member)"
              >
                <div class="node-avatar">
                  {{ member.name.charAt(0) }}
                </div>
                <div class="node-info">
                  <span class="node-name">{{ member.name }}</span>
                  <span class="node-relation">{{ member.relation }}</span>
                </div>
                <span class="node-memoir" v-if="getMemoirCount(member.id) > 0">📖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加成员弹窗 -->
    <van-popup v-model:show="showAddMember" round position="bottom" :style="{ padding: '20px', maxHeight: '85vh', overflow: 'auto' }">
      <div class="add-popup">
        <h3>添加家族成员</h3>
        
        <div class="add-form">
          <label class="form-label">姓名 <span class="required">*</span></label>
          <input v-model="newMember.name" type="text" class="form-input" placeholder="请输入姓名" maxlength="20" />
        </div>

        <div class="add-form">
          <label class="form-label">关系</label>
          <div class="relation-grid">
            <span 
              v-for="rel in relations" 
              :key="rel"
              class="relation-option"
              :class="{ selected: newMember.relation === rel }"
              @click="newMember.relation = rel"
            >{{ rel }}</span>
          </div>
        </div>

        <div class="add-form">
          <label class="form-label">辈分（第几代）</label>
          <div class="gen-selector">
            <button v-for="g in [1, 2, 3, 4]" :key="g" class="gen-btn" :class="{ active: newMember.generation === g }" @click="newMember.generation = g">第{{ g }}代</button>
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
        <!-- 头部 -->
        <div class="detail-header">
          <div class="detail-avatar">{{ detailMember.name.charAt(0) }}</div>
          <h3>{{ detailMember.name }}</h3>
          <span class="detail-sub">{{ detailMember.relation }} · 第{{ detailMember.generation }}代</span>
        </div>

        <!-- 查看模式 -->
        <div class="detail-info" v-if="!isEditing">
          <div class="detail-row" v-if="detailMember.birthYear">
            <span class="detail-label">出生年份</span>
            <span class="detail-value">{{ detailMember.birthYear }}年</span>
          </div>
          <div class="detail-row" v-if="detailMember.spouse">
            <span class="detail-label">配偶</span>
            <span class="detail-value">{{ detailMember.spouse }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">状态</span>
            <span class="detail-value" :class="{ deceased: !detailMember.isAlive }">{{ detailMember.isAlive ? '健在' : '故人' }}</span>
          </div>
        </div>

        <!-- 编辑模式 -->
        <div class="edit-form" v-else>
          <div class="add-form">
            <label class="form-label">姓名 <span class="required">*</span></label>
            <input v-model="editData.name" type="text" class="form-input" maxlength="20" />
          </div>
          <div class="add-form">
            <label class="form-label">关系</label>
            <div class="relation-grid">
              <span v-for="rel in relations" :key="rel" class="relation-option" :class="{ selected: editData.relation === rel }" @click="editData.relation = rel">{{ rel }}</span>
            </div>
          </div>
          <div class="add-form">
            <label class="form-label">辈分</label>
            <div class="gen-selector">
              <button v-for="g in [1, 2, 3, 4]" :key="g" class="gen-btn" :class="{ active: editData.generation === g }" @click="editData.generation = g">第{{ g }}代</button>
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

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <template v-if="!isEditing">
            <!-- 查看回忆录 -->
            <button 
              v-if="getMemoirCount(detailMember.id) > 0"
              class="btn-memoir"
              @click="goToMemoirs"
            >
              📖 查看{{ detailMember.name }}的回忆录（{{ getMemoirCount(detailMember.id) }}段）
            </button>
            <!-- 为TA录制 -->
            <button class="btn-record" @click="goRecordForMember">
              🎙️ 为{{ detailMember.name }}录制回忆
            </button>
            <button class="btn-primary btn-block" @click="startEdit">✏️ 修改信息</button>
            <button class="btn-danger" @click="confirmDelete">删除成员</button>
            <button class="btn-cancel" @click="showDetail = false">关闭</button>
          </template>
          <template v-else>
            <button class="btn-primary btn-block" @click="saveEdit">💾 保存修改</button>
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
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const familyStore = useFamilyStore()

const viewMode = ref('list')
const members = computed(() => familyStore.getMembers())

const generations = computed(() => {
  const gens = [...new Set(members.value.map(m => m.generation))]
  return gens.sort((a, b) => a - b)
})

function getMembersByGeneration(gen) {
  return members.value.filter(m => m.generation === gen)
}

function getMemoirCount(memberId) {
  return familyStore.getMemoirsByMemberId(memberId).length
}

function showMemberDetail(member) {
  detailMember.value = member
  isEditing.value = false
  showDetail.value = true
}

// ============ 添加成员 ============
const showAddMember = ref(false)
const relations = ['爷爷', '奶奶', '外公', '外婆', '爸爸', '妈妈', '叔叔', '姑姑', '我', '哥哥', '姐姐', '弟弟', '妹妹', '儿子', '女儿', '配偶', '其他']

const newMember = ref({
  name: '', relation: '其他', generation: 3, birthYear: '', spouse: '', isAlive: true
})

function openAddMember() {
  newMember.value = { name: '', relation: '其他', generation: 3, birthYear: '', spouse: '', isAlive: true }
  showAddMember.value = true
}

function addMember() {
  if (!newMember.value.name.trim()) { showToast('请输入姓名'); return }
  familyStore.addMember({
    name: newMember.value.name.trim(),
    relation: newMember.value.relation,
    generation: newMember.value.generation,
    birthYear: newMember.value.birthYear ? parseInt(newMember.value.birthYear) : '',
    spouse: newMember.value.spouse.trim(),
    isAlive: newMember.value.isAlive
  })
  showAddMember.value = false
  showToast('添加成功')
}

// ============ 成员详情 & 编辑 ============
const showDetail = ref(false)
const detailMember = ref(null)
const isEditing = ref(false)
const editData = ref({})

function startEdit() {
  const m = detailMember.value
  editData.value = {
    name: m.name, relation: m.relation, generation: m.generation,
    birthYear: m.birthYear || '', spouse: m.spouse || '', isAlive: m.isAlive
  }
  isEditing.value = true
}

function cancelEdit() { isEditing.value = false }

function saveEdit() {
  if (!editData.value.name.trim()) { showToast('请输入姓名'); return }
  familyStore.updateMember(detailMember.value.id, {
    name: editData.value.name.trim(),
    relation: editData.value.relation,
    generation: editData.value.generation,
    birthYear: editData.value.birthYear ? parseInt(editData.value.birthYear) : '',
    spouse: editData.value.spouse.trim(),
    isAlive: editData.value.isAlive
  })
  detailMember.value = familyStore.getMemberById(detailMember.value.id)
  isEditing.value = false
  showToast('修改成功')
}

function confirmDelete() {
  showConfirmDialog({
    title: '确认删除',
    message: `确定要删除「${detailMember.value.name}」吗？此操作不可撤销。`
  }).then(() => {
    familyStore.deleteMember(detailMember.value.id)
    showDetail.value = false
    showToast('已删除')
  }).catch(() => {})
}

// 跳转到此人的回忆录
function goToMemoirs() {
  const mid = detailMember.value.id
  showDetail.value = false
  router.push({ path: '/memoir-combined', query: { id: mid } })
}

// 为此人录制回忆
function goRecordForMember() {
  showDetail.value = false
  router.push('/memoir-record')
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(160deg, #B8765A 0%, #C8866A 60%, #D49B7E 100%);
  color: white;
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-header h1 {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl);
  font-weight: 700;
  letter-spacing: 0.05em;
}

.add-btn {
  font-size: var(--font-size-base);
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-xs) var(--spacing-base);
  border-radius: var(--radius-full);
  cursor: pointer;
}

.add-btn:active { background: rgba(255, 255, 255, 0.3); }

.view-toggle {
  display: flex;
  padding: var(--spacing-base);
  gap: var(--spacing-sm);
  background: var(--bg-color-card);
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
}

.view-toggle button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-base);
  background: var(--bg-color-secondary);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.view-toggle button.active {
  background: var(--primary-color);
  color: white;
}

/* 列表视图 */
.member-card {
  display: flex;
  align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-base);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s;
}

.member-card:active { transform: scale(0.98); }

.member-avatar {
  width: 48px; height: 48px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-lg); font-weight: 600;
  margin-right: var(--spacing-base); flex-shrink: 0;
}

.member-info { flex: 1; min-width: 0; }

.member-name-row {
  display: flex; align-items: center; gap: var(--spacing-sm); margin-bottom: 4px;
}

.member-name {
  font-family: var(--font-serif);
  font-size: var(--font-size-base); font-weight: 600;
  color: var(--text-color-primary);
}

.member-relation {
  font-size: var(--font-size-xs); color: white;
  background: var(--primary-light);
  padding: 2px 8px; border-radius: var(--radius-full);
}

.member-meta {
  display: flex; flex-wrap: wrap; gap: var(--spacing-sm);
  font-size: var(--font-size-xs); color: var(--text-color-light);
}

.memoir-badge {
  color: var(--primary-color);
  font-weight: 500;
}

.member-arrow {
  font-size: var(--font-size-xl); color: var(--text-color-light);
}

/* 树状视图 */
.tree-view { padding: var(--spacing-base); }

.tree-container { display: flex; flex-direction: column; gap: var(--spacing-xl); }

.generation { position: relative; }

.generation::before {
  content: ''; position: absolute; left: 24px; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(to bottom, var(--primary-light), var(--primary-color));
  border-radius: var(--radius-full);
}

.gen-label {
  position: relative; z-index: 1; display: inline-block;
  background: var(--primary-color); color: white;
  padding: var(--spacing-xs) var(--spacing-base);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-base); margin-left: var(--spacing-base);
}

.gen-members {
  display: flex; flex-wrap: wrap; gap: var(--spacing-sm);
  padding-left: var(--spacing-xl);
}

.tree-node {
  display: flex; align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-base);
  box-shadow: var(--shadow-sm);
  cursor: pointer; transition: all 0.3s;
  position: relative;
}

.tree-node:active { transform: scale(0.95); box-shadow: var(--shadow-card); }

.node-avatar {
  width: 40px; height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-md); font-weight: 600;
  margin-right: var(--spacing-sm);
}

.node-info { display: flex; flex-direction: column; }

.node-name {
  font-size: var(--font-size-base); font-weight: 600;
  color: var(--text-color-primary);
}

.node-relation {
  font-size: var(--font-size-xs); color: var(--text-color-light);
}

.node-memoir {
  position: absolute; top: -4px; right: -4px;
  font-size: 16px;
}

/* 弹窗 */
.add-popup { text-align: center; }

.add-popup h3 {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg); font-weight: 600;
  color: var(--text-color-primary); margin-bottom: var(--spacing-lg);
}

.add-form { text-align: left; margin-bottom: var(--spacing-lg); }

.form-label {
  display: block; font-size: var(--font-size-sm);
  color: var(--text-color-secondary); margin-bottom: var(--spacing-xs);
}

.required { color: var(--danger-color); }

.form-input {
  width: 100%; padding: var(--spacing-base);
  font-size: var(--font-size-base);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-color-secondary);
  color: var(--text-color-primary); box-sizing: border-box;
}

.form-input:focus { outline: none; border-color: var(--primary-color); }

.relation-grid { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); }

.relation-option {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-color-secondary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm); color: var(--text-color-secondary);
  cursor: pointer; transition: all 0.3s;
}

.relation-option.selected { background: var(--primary-color); color: white; }

.gen-selector { display: flex; gap: var(--spacing-xs); }

.gen-btn {
  flex: 1; padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--bg-color-secondary); border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm); color: var(--text-color-secondary);
  cursor: pointer; transition: all 0.3s;
}

.gen-btn.active { background: var(--primary-color); color: white; }

.alive-toggle { display: flex; gap: var(--spacing-sm); }

.alive-btn {
  flex: 1; padding: var(--spacing-sm);
  background: var(--bg-color-secondary); border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm); color: var(--text-color-secondary);
  cursor: pointer; transition: all 0.3s;
}

.alive-btn.active { background: var(--primary-color); color: white; }

.btn-primary {
  display: block; width: 100%; padding: var(--spacing-base);
  background: var(--primary-color); color: white; border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base); font-weight: 600; cursor: pointer;
}

.btn-primary:active { opacity: 0.9; }

.btn-cancel {
  display: block; width: 100%; margin-top: var(--spacing-sm);
  padding: var(--spacing-base); background: transparent; border: none;
  color: var(--text-color-light); font-size: var(--font-size-base); cursor: pointer;
}

/* 详情弹窗 */
.detail-popup { text-align: center; }

.detail-header { margin-bottom: var(--spacing-lg); }

.detail-avatar {
  width: 64px; height: 64px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-xl); font-weight: 600;
  margin: 0 auto var(--spacing-sm);
}

.detail-popup h3 {
  font-family: var(--font-serif);
  font-size: var(--font-size-xl); font-weight: 600;
  color: var(--text-color-primary); margin-bottom: 4px;
}

.detail-sub {
  font-size: var(--font-size-sm); color: var(--text-color-light);
}

.detail-info { text-align: left; margin-bottom: var(--spacing-lg); }

.detail-row {
  display: flex; justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-color-light);
}

.detail-label { font-size: var(--font-size-sm); color: var(--text-color-light); }

.detail-value {
  font-size: var(--font-size-sm); color: var(--text-color-primary); font-weight: 500;
}

.detail-value.deceased { color: var(--text-color-light); }

.edit-form { text-align: left; margin-bottom: var(--spacing-lg); }

.detail-actions { margin-top: var(--spacing-base); }

.btn-memoir {
  display: block; width: 100%; padding: var(--spacing-base);
  background: var(--bg-color-warm); color: var(--primary-color);
  border: 1px solid var(--primary-soft);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base); font-weight: 500;
  cursor: pointer; margin-bottom: var(--spacing-sm);
  transition: all 0.3s;
}

.btn-memoir:active { transform: scale(0.98); }

.btn-record {
  display: block; width: 100%; padding: var(--spacing-base);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white; border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base); font-weight: 600;
  cursor: pointer; margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-primary);
}

.btn-record:active { opacity: 0.9; }

.btn-danger {
  display: block; width: 100%; margin-top: var(--spacing-sm);
  padding: var(--spacing-base); background: transparent;
  border: 1px solid var(--danger-color);
  border-radius: var(--radius-lg);
  color: var(--danger-color); font-size: var(--font-size-base); cursor: pointer;
}

.btn-danger:active { background: var(--danger-color); color: white; }
</style>
