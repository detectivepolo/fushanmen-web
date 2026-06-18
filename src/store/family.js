import { defineStore } from 'pinia'
import { ref } from 'vue'

// Mock数据
const mockFamilyMembers = [
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

const mockMemoirs = [
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

const mockMilestones = [
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

const mockDynamics = [
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

export const useFamilyStore = defineStore('family', () => {
  const members = ref(mockFamilyMembers)
  const memoirs = ref(mockMemoirs)
  const milestones = ref(mockMilestones)
  const dynamics = ref(mockDynamics)
  const currentMember = ref(null)

  // 获取成员列表
  function getMembers() {
    return members.value
  }

  // 获取成员详情
  function getMemberById(id) {
    return members.value.find(m => m.id === id)
  }

  // 获取回忆录列表
  function getMemoirs() {
    return memoirs.value
  }

  // 获取回忆录详情
  function getMemoirById(id) {
    return memoirs.value.find(m => m.id === id)
  }

  // 添加回忆录
  function addMemoir(memoir) {
    const newMemoir = {
      ...memoir,
      id: `memoir_${Date.now()}`,
      createdAt: new Date().toLocaleString('zh-CN'),
      status: 'completed'
    }
    memoirs.value.unshift(newMemoir)
    return newMemoir
  }

  // 获取大事记列表
  function getMilestones() {
    return milestones.value
  }

  // 获取大事记详情
  function getMilestoneById(id) {
    return milestones.value.find(m => m.id === id)
  }

  // 添加大事记
  function addMilestone(milestone) {
    const newMilestone = {
      ...milestone,
      id: `milestone_${Date.now()}`
    }
    milestones.value.unshift(newMilestone)
    return newMilestone
  }

  // 获取动态圈
  function getDynamics() {
    return dynamics.value
  }

  // 获取统计数据
  function getStats() {
    return {
      totalMembers: members.value.length,
      aliveMembers: members.value.filter(m => m.isAlive).length,
      totalMemoirs: memoirs.value.length,
      totalMilestones: milestones.value.length,
      totalDuration: memoirs.value.reduce((sum, m) => sum + m.duration, 0)
    }
  }

  // 设置当前成员
  function setCurrentMember(member) {
    currentMember.value = member
  }

  return {
    members,
    memoirs,
    milestones,
    dynamics,
    currentMember,
    getMembers,
    getMemberById,
    getMemoirs,
    getMemoirById,
    addMemoir,
    getMilestones,
    getMilestoneById,
    addMilestone,
    getDynamics,
    getStats,
    setCurrentMember
  }
})
