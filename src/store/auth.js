import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  // 初始化时检查登录状态
  async function initAuth() {
    loading.value = true
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user || null
    loading.value = false
    return user.value
  }

  // 注册
  async function signUp(email, password) {
    loading.value = true
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    loading.value = false
    if (error) throw error
    user.value = data.user
    return data.user
  }

  // 登录
  async function signIn(email, password) {
    loading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    loading.value = false
    if (error) throw error
    user.value = data.user
    return data.user
  }

  // 退出登录
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
  }

  return { user, loading, initAuth, signUp, signIn, signOut }
})
