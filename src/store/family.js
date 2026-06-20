import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'fushanmen_family_data'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch (e) { console.error('读取本地数据失败:', e) }
  return null
}

function saveToStorage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) }
  catch (e) { console.error('保存本地数据失败:', e) }
}

function mockAIPolish({ title, protagonistName, duration, tags, createdAt }) {
  const now = new Date()
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const mins = Math.floor((duration || 0) / 60)
  const secs = (duration || 0) % 60
  const durStr = mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`
  const tagStr = tags && tags.length > 0 ? tags.join('、') : '生活'

  return `## ${title}

录制于 ${dateStr} ${timeStr} · 时长 ${durStr}

${protagonistName}的这段记忆，带着岁月的温度。那些关于${tagStr}的往事，在娓娓道来中重新鲜活起来。每一个细节都是家族历史的拼图，每一次回忆都是对过往的致敬。

（接入语音转文字服务后，将根据录音内容生成真实文本。）

关键词：${tagStr}
讲述：${protagonistName}`
}

// ============ 默认数据 ============
const defaultMembers = [
  { id: 'member_001', name: '赵德福', generation: 1, avatar: '', birthYear: 1945, isAlive: true, spouse: '王秀兰', children: ['member_002', 'member_003'] },
  { id: 'member_002', name: '赵建国', generation: 2, avatar: '', birthYear: 1968, isAlive: true, spouse: '张丽华', children: ['member_005'] },
  { id: 'member_003', name: '赵秀英', generation: 2, avatar: '', birthYear: 1972, isAlive: true, spouse: '陈明', children: ['member_004'] },
  { id: 'member_004', name: '陈晓东', generation: 3, avatar: '', birthYear: 1998, isAlive: true, children: [] },
  { id: 'member_005', name: '赵大帅', generation: 3, avatar: '', birthYear: 1995, isAlive: true, children: [] }
]

const defaultMemoirs = []
const defaultCollections = []
const defaultDynamics = []

const defaultMilestones = [
  { id: 'milestone_001', title: '2024年春节团圆', date: '2024-02-10', photos: [], description: '全家人齐聚一堂，共度新春佳节', participants: ['赵德福', '赵建国', '赵秀英', '赵大帅'], location: '老家', createdBy: 'member_002' },
  { id: 'milestone_002', title: '爷爷八十大寿', date: '2024-05-01', photos: [], description: '爷爷八十岁大寿，全家人在酒店庆祝', participants: ['赵德福', '王秀兰', '赵建国', '张丽华', '赵大帅'], location: '福满楼酒店', createdBy: 'member_002' }
]

const stored = loadFromStorage()
const initialMembers = stored?.members || defaultMembers
const initialMemoirs = stored?.memoirs || defaultMemoirs
const initialMilestones = stored?.milestones || defaultMilestones
const initialDynamics = stored?.dynamics || defaultDynamics
const initialCollections = stored?.collections || defaultCollections

export const useFamilyStore = defineStore('family', () => {
  const members = ref(initialMembers)
  const memoirs = ref(initialMemoirs)
  const milestones = ref(initialMilestones)
  const dynamics = ref(initialDynamics)
  const collections = ref(initialCollections)
  const currentMember = ref(null)

  function persist() {
    saveToStorage({ members: members.value, memoirs: memoirs.value, milestones: milestones.value, dynamics: dynamics.value, collections: collections.value })
  }

  // ===== 成员管理 =====
  function getMembers() { return members.value }
  function getMemberById(id) { return members.value.find(m => m.id === id) }

  function addMember(member) {
    const newMember = {
      id: `member_${Date.now()}`, name: member.name,
      generation: member.generation || 1, avatar: member.avatar || '',
      birthYear: member.birthYear || '', isAlive: member.isAlive !== false,
      spouse: member.spouse || '', children: []
    }
    members.value.push(newMember)
    persist()
    return newMember
  }

  function updateMember(id, updates) {
    const idx = members.value.findIndex(m => m.id === id)
    if (idx > -1) {
      const oldName = members.value[idx].name
      const newName = updates.name || oldName
      members.value[idx] = { ...members.value[idx], ...updates }
      // 名字变更时同步更新回忆录
      if (newName !== oldName) {
        memoirs.value.forEach(m => {
          if (m.protagonist?.id === id) m.protagonist.name = newName
          if (m.author?.id === id) m.author.name = newName
          if (m.subject?.id === id) m.subject.name = newName
        })
      }
      persist()
      return members.value[idx]
    }
    return null
  }

  function deleteMember(id) {
    members.value = members.value.filter(m => m.id !== id)
    members.value.forEach(m => { if (m.children) m.children = m.children.filter(cid => cid !== id) })
    persist()
  }

  // ===== 回忆录管理 =====
  // memoir 类型：
  //   type: 'self' — 我的回忆（主角=自己，可整合到完整回忆录）
  //   type: 'perspective' — 我眼中的XX（主角=自己，subject=被写的人，独立展示不整合）
  function getMemoirs() { return memoirs.value }

  function getMemoirsByProtagonist() {
    const groups = {}
    memoirs.value.forEach(m => {
      const pid = m.protagonist?.id || 'unknown'
      if (!groups[pid]) groups[pid] = { protagonist: m.protagonist, memoirs: [] }
      groups[pid].memoirs.push(m)
    })
    return Object.values(groups)
  }

  function getMemoirsByMemberId(memberId) {
    return memoirs.value.filter(m => m.protagonist?.id === memberId)
  }

  // 获取"我眼中的XX"类型的回忆
  function getPerspectiveMemoirs(subjectId) {
    if (subjectId) return memoirs.value.filter(m => m.type === 'perspective' && m.subject?.id === subjectId)
    return memoirs.value.filter(m => m.type === 'perspective')
  }

  function getMemoirById(id) { return memoirs.value.find(m => m.id === id) }

  function addMemoir(memoir) {
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    const transcript = mockAIPolish({
      title: memoir.title,
      protagonistName: memoir.protagonist?.name || '家人',
      duration: memoir.duration, tags: memoir.tags, createdAt
    })

    const newMemoir = {
      ...memoir, id: `memoir_${Date.now()}`, createdAt,
      status: 'completed', transcript, merged: false
    }
    memoirs.value.unshift(newMemoir)
    persist()
    return newMemoir
  }

  function mergeMemoir(memoirId) {
    const idx = memoirs.value.findIndex(m => m.id === memoirId)
    if (idx > -1) { memoirs.value[idx].merged = true; persist(); return memoirs.value[idx] }
    return null
  }

  function getCombinedMemoir(protagonistId) {
    const merged = memoirs.value
      .filter(m => m.protagonist?.id === protagonistId && m.type === 'self' && m.merged)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (merged.length === 0) return null
    const protagonist = merged[0].protagonist
    const segments = merged.map(m => m.transcript || '').join('\n\n---\n\n')
    return { protagonist, segments: merged, combinedText: segments, count: merged.length }
  }

  function updateMemoir(id, updates) {
    const idx = memoirs.value.findIndex(m => m.id === id)
    if (idx > -1) { memoirs.value[idx] = { ...memoirs.value[idx], ...updates }; persist(); return memoirs.value[idx] }
    return null
  }

  function deleteMemoir(id) {
    memoirs.value = memoirs.value.filter(m => m.id !== id)
    persist()
  }

  // ===== 动态 =====
  function getDynamics() { return dynamics.value }

  // ===== 大事记 =====
  function getMilestones() { return milestones.value }
  function getMilestoneById(id) { return milestones.value.find(m => m.id === id) }
  function addMilestone(milestone) {
    const newMilestone = { ...milestone, id: `milestone_${Date.now()}` }
    milestones.value.unshift(newMilestone); persist(); return newMilestone
  }

  // ===== 合集 =====
  function getCollections() { return collections.value }
  function getCollectionById(id) { return collections.value.find(c => c.id === id) }
  function addCollection(col) {
    const newCol = { id: `col_${Date.now()}`, ...col, status: 'preview' }
    collections.value.push(newCol); persist(); return newCol
  }

  // ===== 统计 =====
  function getStats() {
    return {
      totalMembers: members.value.length,
      aliveMembers: members.value.filter(m => m.isAlive).length,
      totalMemoirs: memoirs.value.length,
      totalMilestones: milestones.value.length,
      totalDuration: memoirs.value.reduce((sum, m) => sum + (m.duration || 0), 0)
    }
  }

  function setCurrentMember(member) { currentMember.value = member }

  function resetData() {
    members.value = [...defaultMembers]
    memoirs.value = []
    milestones.value = [...defaultMilestones]
    dynamics.value = []
    collections.value = []
    persist()
  }

  return {
    members, memoirs, milestones, dynamics, collections, currentMember,
    getMembers, getMemberById, addMember, updateMember, deleteMember,
    getMemoirs, getMemoirsByProtagonist, getMemoirsByMemberId, getPerspectiveMemoirs, getMemoirById,
    addMemoir, mergeMemoir, getCombinedMemoir, updateMemoir, deleteMemoir,
    getMilestones, getMilestoneById, addMilestone,
    getDynamics, getCollections, getCollectionById, addCollection,
    getStats, setCurrentMember, resetData
  }
})
