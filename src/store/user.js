import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'fushanmen_user_data'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error('读取用户数据失败:', e)
  }
  return null
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('保存用户数据失败:', e)
  }
}

const defaultUserInfo = {
  id: 'user_001',
  name: '赵大帅',
  avatar: '',
  phone: '138****8888',
  familyId: 'family_001',
  familyName: '赵家大院'
}

const stored = loadFromStorage()

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(stored?.userInfo || defaultUserInfo)
  const isLoggedIn = ref(stored?.isLoggedIn ?? true)

  const displayName = computed(() => userInfo.value.name)
  const displayAvatar = computed(() => userInfo.value.avatar || userInfo.value.name.charAt(0))

  function persist() {
    saveToStorage({
      userInfo: userInfo.value,
      isLoggedIn: isLoggedIn.value
    })
  }

  function login(phone, code) {
    isLoggedIn.value = true
    persist()
    return Promise.resolve({ success: true })
  }

  function logout() {
    isLoggedIn.value = false
    persist()
  }

  function updateUserInfo(info) {
    userInfo.value = { ...userInfo.value, ...info }
    persist()
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
