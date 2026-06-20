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

// ============ Mock AI 润色 ============
// 模拟AI将录音转成润色文本，接入真实AI服务后替换此函数
function mockAIPolish({ title, protagonistName, duration, tags, createdAt }) {
  const now = new Date()
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  const mins = Math.floor((duration || 0) / 60)
  const secs = (duration || 0) % 60
  const durStr = mins > 0 ? `${mins}分${secs}秒` : `${secs}秒`

  const tagStr = tags && tags.length > 0 ? tags.join('、') : '生活'

  return `## ${title}

📅 录制于 ${dateStr} ${timeStr} · 时长 ${durStr}

这是关于${protagonistName}的一段珍贵回忆。讲述者用声音记录下了那些难忘的时光，经过AI润色后，整理为以下文字：

${protagonistName}的这段记忆，带着岁月的温度。那些关于${tagStr}的往事，在娓娓道来中重新鲜活起来。每一个细节都是家族历史的拼图，每一次回忆都是对过往的致敬。

（此文本为AI自动润色的预览效果，接入语音转文字服务后，将根据录音内容生成真实文本。）

🏷️ 关键词：${tagStr}
🎙️ 讲述：${protagonistName}`
}

// ============ 默认 Mock 数据 ============
const defaultMembers = [
  {
    id: 'member_001',
    name: '赵德福',
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
    generation: 3,
    avatar: '',
    birthYear: 1998,
    isAlive: true,
    children: []
  },
  {
    id: 'member_005',
    name: '赵大帅',
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
    status: 'completed',
    transcript: `## 爷爷的童年回忆

📅 录制于 2024年1月15日 10:30 · 时长 2分5秒

赵德福爷爷的童年记忆，带着岁月的温度。那些关于童年的往事，在娓娓道来中重新鲜活起来。

爷爷出生在1945年，那是一个物质匮乏但人情浓厚的年代。他回忆起小时候在村里跑着玩耍的日子，和小伙伴们一起捉蛐蛐、放牛、在田埂上吹风。虽然生活清苦，但童年无忧无虑。

🏷️ 关键词：童年、往事
🎙️ 讲述：赵德福`,
    merged: true
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
    status: 'completed',
    transcript: `## 爸爸第一次学骑自行车

📅 录制于 2024年1月14日 15:20 · 时长 1分26秒

赵建国爸爸回忆起自己第一次学骑自行车的趣事。

那是一辆老旧的二八大杠自行车，爸爸个子还不够高，只能斜着身子够脚蹬子。爷爷在后面扶着车座，说"别怕，骑就行了"。结果一松手，爸爸就摔进了路边的沟里。虽然摔破了膝盖，但那天下午，他终于学会了骑车。

🏷️ 关键词：趣事、成长
🎙️ 讲述：赵建国`,
    merged: true
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
      generation: member.generation || 1,
      avatar: member.avatar || '',
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

  // 按主角分组
  function getMemoirsByProtagonist() {
    const groups = {}
    memoirs.value.forEach(m => {
      const pid = m.protagonist?.id || 'unknown'
      if (!groups[pid]) {
        groups[pid] = {
          protagonist: m.protagonist,
          memoirs: []
        }
      }
      groups[pid].memoirs.push(m)
    })
    return Object.values(groups)
  }

  function getMemoirsByMemberId(memberId) {
    return memoirs.value.filter(m => m.protagonist?.id === memberId)
  }

  function getMemoirById(id) {
    return memoirs.value.find(m => m.id === id)
  }

  function addMemoir(memoir) {
    const now = new Date()
    const createdAt = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    // 生成AI润色文本（Mock）
    const transcript = mockAIPolish({
      title: memoir.title,
      protagonistName: memoir.protagonist?.name || '家人',
      duration: memoir.duration,
      tags: memoir.tags,
      createdAt
    })

    const newMemoir = {
      ...memoir,
      id: `memoir_${Date.now()}`,
      createdAt,
      status: 'completed',
      transcript,
      merged: false  // 默认不整合，由用户选择
    }
    memoirs.value.unshift(newMemoir)
    persist()
    return newMemoir
  }

  // 整合一条回忆录到主角的完整回忆录中
  function mergeMemoir(memoirId) {
    const idx = memoirs.value.findIndex(m => m.id === memoirId)
    if (idx > -1) {
      memoirs.value[idx].merged = true
      persist()
      return memoirs.value[idx]
    }
    return null
  }

  // 获取某人的完整回忆录（所有已整合的段落拼接）
  function getCombinedMemoir(protagonistId) {
    const merged = memoirs.value
      .filter(m => m.protagonist?.id === protagonistId && m.merged)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    if (merged.length === 0) return null

    const protagonist = merged[0].protagonist
    const segments = merged.map(m => m.transcript || '').join('\n\n---\n\n')

    return {
      protagonist,
      segments: merged,
      combinedText: segments,
      count: merged.length
    }
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
    getMemoirsByProtagonist,
    getMemoirsByMemberId,
    getMemoirById,
    addMemoir,
    mergeMemoir,
    getCombinedMemoir,
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
