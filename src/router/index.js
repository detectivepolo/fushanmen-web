import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Memoir',
    component: () => import('@/views/memoir/index.vue'),
    meta: { title: '回忆录' }
  },
  {
    path: '/family-tree',
    name: 'FamilyTree',
    component: () => import('@/views/family-tree/index.vue'),
    meta: { title: '家族树' }
  },
  {
    path: '/family-tree-input',
    name: 'FamilyTreeInput',
    component: () => import('@/views/family-tree/input.vue'),
    meta: { title: '录入家族信息' }
  },
  {
    path: '/memoir-record',
    name: 'MemoirRecord',
    component: () => import('@/views/memoir/record.vue'),
    meta: { title: '录制回忆' }
  },
  {
    path: '/memoir-detail',
    name: 'MemoirDetail',
    component: () => import('@/views/memoir/detail.vue'),
    meta: { title: '回忆详情' }
  },
  {
    path: '/memoir-collection',
    name: 'MemoirCollection',
    component: () => import('@/views/memoir/collection.vue'),
    meta: { title: '合集回忆录' }
  },
  {
    path: '/memoir-combined',
    name: 'MemoirCombined',
    component: () => import('@/views/memoir/combined.vue'),
    meta: { title: '完整回忆录' }
  },
  {
    path: '/milestone',
    name: 'Milestone',
    component: () => import('@/views/milestone/index.vue'),
    meta: { title: '大事记' }
  },
  {
    path: '/milestone-create',
    name: 'MilestoneCreate',
    component: () => import('@/views/milestone/create.vue'),
    meta: { title: '记录大事' }
  },
  {
    path: '/milestone-detail',
    name: 'MilestoneDetail',
    component: () => import('@/views/milestone/detail.vue'),
    meta: { title: '大事记详情' }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('@/views/mine/index.vue'),
    meta: { title: '我的' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
    meta: { title: '登录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：检查登录状态
router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 福善门` : '福善门'
  
  // 登录页面不需要检查
  if (to.path === '/login') {
    next()
    return
  }
  
  // 其他页面需要登录
  const { useAuthStore } = await import('@/store/auth')
  const authStore = useAuthStore()
  
  if (!authStore.user) {
    // 尝试初始化登录状态
    await authStore.initAuth()
  }
  
  if (!authStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
