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

// ============ 默认数据（空，无mock） ============
const defaultMembers = []
const defaultMemoirs = []
const defaultCollections = []
const defaultDynamics = []
const defaultMilestones = []

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

  // 世代自动推算：从父辈链向上计算世代
  function recalculateGenerations(startId) {
    const member = members.value.find(m => m.id === startId)
    if (!member) return
    if (member.parentId) {
      const parent = members.value.find(m => m.id === member.parentId)
      member.generation = parent ? (parent.generation || 1) + 1 : 1
    } else {
      member.generation = 1
    }
    const updateDescendants = (parentId) => {
      const p = members.value.find(m => m.id === parentId)
      if (!p || !p.children) return
      p.children.forEach(childId => {
        const child = members.value.find(m => m.id === childId)
        if (child) {
          child.generation = p.generation + 1
          updateDescendants(childId)
        }
      })
    }
    updateDescendants(startId)
  }

  function addMember(member) {
    let generation = 1
    if (member.parentId) {
      const parent = members.value.find(m => m.id === member.parentId)
      if (parent) generation = (parent.generation || 1) + 1
    }
    const newMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: member.name,
      gender: member.gender || '',
      generation,
      avatar: member.avatar || '',
      birthYear: member.birthYear || '',
      isAlive: member.isAlive !== false,
      spouse: member.spouse || '',
      spouseGender: member.spouseGender || '',
      spouseBirthYear: member.spouseBirthYear || '',
      parentId: member.parentId || '',
      children: []
    }
    members.value.push(newMember)
    if (member.parentId) {
      const parent = members.value.find(m => m.id === member.parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        if (!parent.children.includes(newMember.id)) parent.children.push(newMember.id)
      }
    }
    persist()
    return newMember
  }

  // 批量录入家族成员（从输入页面提交）
  function batchAddFamily(data) {
    let parentId = null
    // 1. 创建父亲（如果有）
    if (data.father && data.father.name && data.father.name.trim()) {
      const father = addMember({
        name: data.father.name.trim(),
        gender: 'male',
        birthYear: data.father.birthYear || '',
        spouse: (data.mother && data.mother.name && data.mother.name.trim()) ? data.mother.name.trim() : '',
        spouseGender: (data.mother && data.mother.name && data.mother.name.trim()) ? 'female' : '',
        spouseBirthYear: (data.mother && data.mother.birthYear) ? data.mother.birthYear : '',
        isAlive: true,
        parentId: ''
      })
      parentId = father.id
    } else if (data.mother && data.mother.name && data.mother.name.trim()) {
      // 只有母亲没有父亲
      const mother = addMember({
        name: data.mother.name.trim(),
        gender: 'female',
        birthYear: data.mother.birthYear || '',
        spouse: '',
        isAlive: true,
        parentId: ''
      })
      parentId = mother.id
    }

    // 2. 创建核心人物
    const self_ = addMember({
      name: data.self.name.trim(),
      gender: data.self.gender || '',
      birthYear: data.self.birthYear || '',
      spouse: (data.spouse && data.spouse.name && data.spouse.name.trim()) ? data.spouse.name.trim() : '',
      spouseGender: (data.spouse && data.spouse.gender) ? data.spouse.gender : '',
      spouseBirthYear: (data.spouse && data.spouse.birthYear) ? data.spouse.birthYear : '',
      isAlive: true,
      parentId: parentId || ''
    })

    // 3. 创建子女
    if (data.children && data.children.length > 0) {
      data.children.forEach(child => {
        if (child.name && child.name.trim()) {
          addMember({
            name: child.name.trim(),
            gender: child.gender || '',
            birthYear: child.birthYear || '',
            isAlive: true,
            parentId: self_.id
          })
        }
      })
    }

    persist()
  }

  function updateMember(id, updates) {
    const idx = members.value.findIndex(m => m.id === id)
    if (idx > -1) {
      const oldName = members.value[idx].name
      const newName = updates.name || oldName
      const oldParentId = members.value[idx].parentId
      members.value[idx] = { ...members.value[idx], ...updates }
      if (updates.parentId !== undefined && updates.parentId !== oldParentId) {
        recalculateGenerations(id)
      }
      if (newName !== oldName) {
        memoirs.value.forEach(m => {
          if (m.protagonist?.id === id) m.protagonist.name = newName
          if (m.author?.id === id) m.author.name = newName
          if (m.subject?.id === id) m.subject.name = newName
        })
        milestones.value.forEach(ms => {
          if (ms.participants) {
            ms.participants = ms.participants.map(p => p === oldName ? newName : p)
          }
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
    const newMilestone = { ...milestone, id: `milestone_${Date.now()}`, comments: [] }
    milestones.value.unshift(newMilestone); persist(); return newMilestone
  }
  function updateMilestone(id, updates) {
    const idx = milestones.value.findIndex(m => m.id === id)
    if (idx > -1) { milestones.value[idx] = { ...milestones.value[idx], ...updates }; persist(); return milestones.value[idx] }
    return null
  }
  function deleteMilestone(id) {
    milestones.value = milestones.value.filter(m => m.id !== id)
    persist()
  }

  // ===== 大事记评论 =====
  function addMilestoneComment(milestoneId, comment) {
    const ms = milestones.value.find(m => m.id === milestoneId)
    if (ms) {
      if (!ms.comments) ms.comments = []
      const now = new Date()
      const newComment = {
        id: `comment_${Date.now()}`,
        author: comment.author || '匿名',
        authorId: comment.authorId || '',
        content: comment.content,
        createdAt: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      }
      ms.comments.push(newComment)
      persist()
      return newComment
    }
    return null
  }

  function deleteMilestoneComment(milestoneId, commentId) {
    const ms = milestones.value.find(m => m.id === milestoneId)
    if (ms && ms.comments) {
      ms.comments = ms.comments.filter(c => c.id !== commentId)
      persist()
    }
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
    members.value = []
    memoirs.value = []
    milestones.value = []
    dynamics.value = []
    collections.value = []
    persist()
  }

  return {
    members, memoirs, milestones, dynamics, collections, currentMember,
    getMembers, getMemberById, addMember, updateMember, deleteMember,
    batchAddFamily, recalculateGenerations,
    getMemoirs, getMemoirsByProtagonist, getMemoirsByMemberId, getPerspectiveMemoirs, getMemoirById,
    addMemoir, mergeMemoir, getCombinedMemoir, updateMemoir, deleteMemoir,
    getMilestones, getMilestoneById, addMilestone, updateMilestone, deleteMilestone,
    addMilestoneComment, deleteMilestoneComment,
    getDynamics, getCollections, getCollectionById, addCollection,
    getStats, setCurrentMember, resetData
  }
})
