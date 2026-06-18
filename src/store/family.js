import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'fushanmen_family_data'

// ============ 合集回忆录 Mock 数据 ============
const defaultCollections = [
  {
    id: 'col_zhao_siblings',
    title: '赵家兄妹',
    desc: '赵德福、赵建国、赵秀英的童年与青春记忆',
    authors: ['赵德福', '赵建国', '赵秀英'],
    members: ['member_001', 'member_002', 'member_003'],
    period: '1950s-1970s',
    status: 'preview',
    sourceMemoirs: ['memoir_001', 'memoir_002'],
    mergedContent: '这是AI将多位家族成员的回忆录交叉融合后生成的完整叙事。不同的视角汇聚在一起，拼出更完整的故事。\n\n（此功能需要接入AI服务后启用）'
  }
]

// ============ localStorage 持久化 ============
function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error('读取本地数据失败:', e)
  }
  return null
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('保存本地数据失败:', e)
  }
}

// ============ 默认 Mock 数据 ============
const defaultMembers = [
  {
    id: 'member_001',
    name: '赵德福',
    relation: '爷爷',
    generation: 1,
    avatar: '',
    birthYear: 1945,
    isAlive: true,
    spouse: '王秀兰',
    children: ['member_002', 'member_003']
  },
  {
    id: 'member_002',
    name: '赵建国',
    relation: '爸爸',
    generation: 2,
    avatar: '',
    birthYear: 1968,
    isAlive: true,
    spouse: '张丽华',
    children: ['member_005']
  },
  {
    id: 'member_003',
    name: '赵秀英',
    relation: '姑姑',
    generation: 2,
    avatar: '',
    birthYear: 1972,
    isAlive: true,
    spouse: '陈明',
    children: ['member_004']
  },
  {
    id: 'member_004',
    name: '陈晓东',
    relation: '表弟',
    generation: 3,
    avatar: '',
    birthYear: 1998,
    isAlive: true,
    children: []
  },
  {
    id: 'member_005',
    name: '赵大帅',
    relation: '我',
    generation: 3,
    avatar: '',
    birthYear: 1995,
    isAlive: true,
    children: []
  }
]

const defaultMemoirs = [
  {
    id: 'memoir_001',
    title: '爷爷的童年回忆',
    audioUrl: '',
    duration: 125,
    photos: [],
    createdAt: '2024-01-15 10:30:00',
    author: { id: 'member_001', name: '赵德福' },
    protagonist: { id: 'member_001', name: '赵德福' },
    tags: ['童年', '往事'],
    status: 'completed'
  },
  {
    id: 'memoir_002',
    title: '爸爸第一次学骑自行车',
    audioUrl: '',
    duration: 86,
    photos: [],
    createdAt: '2024-01-14 15:20:00',
    author: { id: 'member_002', name: '赵建国' },
    protagonist: { id: 'member_002', name: '赵建国' },
    tags: ['趣事', '成长'],
    status: 'completed'
  }
]

const defaultMilestones = [
  {
    id: 'milestone_001',
    title: '2024年春节团圆',
    date: '2024-02-10',
    photos: [],
    description: '全家人齐聚一堂，共度新春佳节',
    participants: ['赵德福', '赵建国', '赵秀英', '赵大帅'],
    location: '老家',
    createdBy: 'member_002'
  },
  {
    id: 'milestone_002',
    title: '爷爷八十大寿',
    date: '2024-05-01',
    photos: [],
    description: '爷爷八十岁大寿，全家人在酒店庆祝',
    participants: ['赵德福', '王秀兰', '赵建国', '张丽华', '赵大帅'],
    location: '福满楼酒店',
    createdBy: 'member_002'
  }
]

const defaultDynamics = [
  {
    id: 'dyn_001',
    type: 'photo',
    content: '分享了家庭照片',
    photos: [],
    author: { id: 'member_002', name: '赵建国' },
    createdAt: '2024-01-20 18:30:00',
    likes: 12,
    comments: 5
  },
  {
    id: 'dyn_002',
    type: 'memoir',
    content: '发布了新的回忆录',
    memoirTitle: '爷爷的童年回忆',
    author: { id: 'member_001', name: '赵德福' },
    createdAt: '2024-01-19 09:15:00',
    likes: 24,
    comments: 8
  }
]

// 初始化：优先读取本地存储，没有则用默认数据
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

  // ============ 持久化函数 ============
  function persist() {
    saveToStorage({
      members: members.value,
      memoirs: memoirs.value,
      milestones: milestones.value,
      dynamics: dynamics.value,
      collections: collections.value
    })
  }

  // ============ 成员管理 ============
  function getMembers() {
    return members.value
  }

  function getMemberById(id) {
    return members.value.find(m => m.id === id)
  }

  function addMember(member) {
    const newMember = {
      id: `member_${Date.now()}`,
      name: member.name,
      relation: member.relation || '家人',
      generation: member.generation || 3,
      avatar: '',
      birthYear: member.birthYear || '',
      isAlive: member.isAlive !== false,
      spouse: member.spouse || '',
      children: []
    }
    members.value.push(newMember)
    persist()
    return newMember
  }

  function updateMember(id, updates) {
    const idx = members.value.findIndex(m => m.id === id)
    if (idx > -1) {
      members.value[idx] = { ...members.value[idx], ...updates }
      persist()
      return members.value[idx]
    }
    return null
  }

  function deleteMember(id) {
    members.value = members.value.filter(m => m.id !== id)
    persist()
  }

  // ============ 回忆录管理 ============
  function getMemoirs() {
    return memoirs.value
  }

  function getMemoirById(id) {
    return memoirs.value.find(m => m.id === id)
  }

  function addMemoir(memoir) {
    const newMemoir = {
      ...memoir,
      id: `memoir_${Date.now()}`,
      createdAt: new Date().toLocaleString('zh-CN'),
      status: 'completed'
    }
    memoirs.value.unshift(newMemoir)
    persist()
    return newMemoir
  }

  function updateMemoir(id, updates) {
    const idx = memoirs.value.findIndex(m => m.id === id)
    if (idx > -1) {
      memoirs.value[idx] = { ...memoirs.value[idx], ...updates }
      persist()
      return memoirs.value[idx]
    }
    return null
  }

  function deleteMemoir(id) {
    memoirs.value = memoirs.value.filter(m => m.id !== id)
    persist()
  }

  // ============ 大事记管理 ============
  function getMilestones() {
    return milestones.value
  }

  function getMilestoneById(id) {
    return milestones.value.find(m => m.id === id)
  }

  function addMilestone(milestone) {
    const newMilestone = {
      ...milestone,
      id: `milestone_${Date.now()}`
    }
    milestones.value.unshift(newMilestone)
    persist()
    return newMilestone
  }

  // ============ 动态圈 ============
  function getDynamics() {
    return dynamics.value
  }

  // ============ 合集回忆录 ============
  function getCollections() {
    return collections.value
  }

  function getCollectionById(id) {
    return collections.value.find(c => c.id === id)
  }

  function addCollection(col) {
    const newCol = {
      id: `col_${Date.now()}`,
      ...col,
      status: 'preview'
    }
    collections.value.push(newCol)
    persist()
    return newCol
  }

  // ============ 统计 ============
  function getStats() {
    return {
      totalMembers: members.value.length,
      aliveMembers: members.value.filter(m => m.isAlive).length,
      totalMemoirs: memoirs.value.length,
      totalMilestones: milestones.value.length,
      totalDuration: memoirs.value.reduce((sum, m) => sum + (m.duration || 0), 0)
    }
  }

  // ============ 当前成员 ============
  function setCurrentMember(member) {
    currentMember.value = member
  }

  // ============ 重置数据 ============
  function resetData() {
    members.value = [...defaultMembers]
    memoirs.value = [...defaultMemoirs]
    milestones.value = [...defaultMilestones]
    dynamics.value = [...defaultDynamics]
    collections.value = [...defaultCollections]
    persist()
  }

  return {
    members,
    memoirs,
    milestones,
    dynamics,
    collections,
    currentMember,
    getMembers,
    getMemberById,
    addMember,
    updateMember,
    deleteMember,
    getMemoirs,
    getMemoirById,
    addMemoir,
    updateMemoir,
    deleteMemoir,
    getMilestones,
    getMilestoneById,
    addMilestone,
    getDynamics,
    getCollections,
    getCollectionById,
    addCollection,
    getStats,
    setCurrentMember,
    resetData
  }
})
