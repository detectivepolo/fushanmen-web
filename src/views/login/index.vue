<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="56" height="56">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h1 class="logo-title">{{ userStore.userInfo.familyName || '福善门' }}</h1>
        <p class="logo-subtitle">福善门家族记录平台</p>
      </div>

      <!-- 登录表单 -->
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">手机号</label>
          <input v-model="phone" type="tel" class="form-input" placeholder="请输入手机号" maxlength="11" />
        </div>

        <div class="form-group">
          <label class="form-label">验证码</label>
          <div class="code-input">
            <input v-model="code" type="text" class="form-input" placeholder="请输入验证码" maxlength="6" />
            <button class="code-btn" :disabled="countdown > 0" @click="sendCode">
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>

        <button class="btn-primary btn-block" :disabled="!canLogin" @click="handleLogin">
          登录
        </button>

        <div class="demo-tip">
          <p>演示模式：输入任意手机号和验证码即可登录</p>
        </div>
      </div>

      <!-- 其他登录方式 -->
      <div class="other-login">
        <div class="divider-text">
          <span>其他登录方式</span>
        </div>
        <div class="login-options">
          <button class="oauth-btn" @click="wechatLogin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" width="32" height="32"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
            <span>微信</span>
          </button>
        </div>
      </div>

      <!-- 底部协议 -->
      <div class="agreement">
        <label class="agreement-label">
          <input type="checkbox" v-model="agreed" />
          <span>我已阅读并同意</span>
        </label>
        <a href="#" class="agreement-link">《用户服务协议》</a>
        <span>和</span>
        <a href="#" class="agreement-link">《隐私政策》</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const countdown = ref(0)
const agreed = ref(true)

const canLogin = computed(() => phone.value.length === 11 && code.value.length >= 4 && agreed.value)

let timer = null

function sendCode() {
  if (phone.value.length !== 11) { showToast('请输入正确的手机号'); return }
  countdown.value = 60
  timer = setInterval(() => { countdown.value--; if (countdown.value <= 0) clearInterval(timer) }, 1000)
  showToast('验证码已发送')
}

async function handleLogin() {
  if (!canLogin.value) return
  try {
    await userStore.login(phone.value, code.value)
    showToast('登录成功')
    router.replace('/')
  } catch (error) {
    showToast('登录失败，请重试')
  }
}

function wechatLogin() { showToast('微信登录开发中') }
</script>

<style scoped>
.login-container { min-height: 100vh; background: linear-gradient(180deg, var(--primary-color) 0%, var(--primary-light) 30%, var(--bg-color) 30%); display: flex; align-items: center; justify-content: center; padding: var(--spacing-xl); }
.login-content { width: 100%; max-width: 400px; }
.logo-section { text-align: center; margin-bottom: var(--spacing-3xl); }
.logo-icon { color: white; margin-bottom: var(--spacing-base); display: flex; justify-content: center; }
.logo-title { font-family: var(--font-serif); font-size: var(--font-size-3xl); font-weight: 700; color: white; margin-bottom: var(--spacing-xs); }
.logo-subtitle { font-size: var(--font-size-base); color: rgba(255, 255, 255, 0.9); }
.form-section { background: var(--bg-color-card); border-radius: var(--radius-xl); padding: var(--spacing-xl); box-shadow: var(--shadow-lg); margin-bottom: var(--spacing-xl); }
.form-group { margin-bottom: var(--spacing-lg); }
.form-label { display: block; font-size: var(--font-size-base); font-weight: 500; color: var(--text-color-primary); margin-bottom: var(--spacing-sm); }
.form-input { width: 100%; padding: var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color); color: var(--text-color-primary); box-sizing: border-box; }
.form-input:focus { outline: none; border-color: var(--primary-color); }
.code-input { display: flex; gap: var(--spacing-sm); }
.code-input .form-input { flex: 1; }
.code-btn { padding: 0 var(--spacing-base); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-md); font-size: var(--font-size-sm); white-space: nowrap; cursor: pointer; }
.code-btn:disabled { background: var(--border-color); cursor: not-allowed; }
.btn-block { width: 100%; margin-top: var(--spacing-lg); }
.btn-primary { display: block; width: 100%; padding: var(--spacing-base); background: var(--primary-color); color: white; border: none; border-radius: var(--radius-lg); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; }
.btn-primary:active { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.demo-tip { margin-top: var(--spacing-lg); padding: var(--spacing-base); background: var(--primary-bg); border-radius: var(--radius-md); }
.demo-tip p { font-size: var(--font-size-sm); color: var(--primary-color); text-align: center; }
.other-login { margin-bottom: var(--spacing-xl); }
.divider-text { text-align: center; position: relative; margin-bottom: var(--spacing-lg); }
.divider-text::before, .divider-text::after { content: ''; position: absolute; top: 50%; width: 30%; height: 1px; background: var(--border-color); }
.divider-text::before { left: 0; }
.divider-text::after { right: 0; }
.divider-text span { font-size: var(--font-size-sm); color: var(--text-color-light); background: var(--bg-color); padding: 0 var(--spacing-sm); }
.login-options { display: flex; justify-content: center; gap: var(--spacing-xl); }
.oauth-btn { display: flex; flex-direction: column; align-items: center; gap: var(--spacing-xs); background: none; border: none; cursor: pointer; color: var(--text-color-secondary); }
.oauth-btn span:last-child { font-size: var(--font-size-sm); }
.agreement { text-align: center; font-size: var(--font-size-xs); color: var(--text-color-light); }
.agreement-label { display: inline-flex; align-items: center; gap: var(--spacing-xs); }
.agreement-label input { width: 14px; height: 14px; }
.agreement-link { color: var(--primary-color); text-decoration: none; }
</style>
