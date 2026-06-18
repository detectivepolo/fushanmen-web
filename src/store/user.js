import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref({
    id: 'user_001',
    name: '赵大帅',
    avatar: '',
    phone: '138****8888',
    familyId: 'family_001',
    familyName: '赵家大院'
  })

  const isLoggedIn = ref(true) // Mock数据，默认已登录

  // 计算属性
  const displayName = computed(() => userInfo.value.name)
  const displayAvatar = computed(() => userInfo.value.avatar || userInfo.value.name.charAt(0))

  // 方法
  function login(phone, code) {
    // Mock登录
    isLoggedIn.value = true
    return Promise.resolve({ success: true })
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = {}
  }

  function updateUserInfo(info) {
    userInfo.value = { ...userInfo.value, ...info }
  }

  return {
    userInfo,
    isLoggedIn,
    displayName,
    displayAvatar,
    login,
    logout,
    updateUserInfo
  }
})
