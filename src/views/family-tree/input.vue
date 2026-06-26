<template>
  <div class="page-container">
    <header class="page-header">
      <div class="header-inner">
        <button class="back-btn" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="22" height="22"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1>录入家族信息</h1>
      </div>
    </header>

    <div class="page-content form-page">
      <p class="page-desc">输入你或直系亲属的信息，系统将自动生成家族树</p>

      <!-- 本人信息 -->
      <div class="form-section">
        <div class="section-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span>本人信息</span>
          <span class="required-mark">*</span>
        </div>
        <div class="form-item">
          <label>姓名</label>
          <input v-model="form.self.name" type="text" placeholder="请输入姓名" maxlength="20" />
        </div>
        <div class="form-item-row">
          <div class="form-item flex-1">
            <label>性别</label>
            <div class="gender-btns">
              <button :class="{ active: form.self.gender === 'male' }" @click="form.self.gender = 'male'">男</button>
              <button :class="{ active: form.self.gender === 'female' }" @click="form.self.gender = 'female'">女</button>
            </div>
          </div>
          <div class="form-item flex-1">
            <label>出生年月</label>
            <input v-model="form.self.birthYear" type="number" placeholder="如 1990" min="1900" max="2030" />
          </div>
        </div>
      </div>

      <!-- 父亲信息 -->
      <div class="form-section">
        <div class="section-label">
          <span>父亲信息</span>
          <span class="optional">选填</span>
        </div>
        <div class="form-item">
          <label>姓名</label>
          <input v-model="form.father.name" type="text" placeholder="请输入父亲姓名" maxlength="20" />
        </div>
        <div class="form-item">
          <label>出生年月</label>
          <input v-model="form.father.birthYear" type="number" placeholder="如 1960" min="1900" max="2030" />
        </div>
      </div>

      <!-- 母亲信息 -->
      <div class="form-section">
        <div class="section-label">
          <span>母亲信息</span>
          <span class="optional">选填</span>
        </div>
        <div class="form-item">
          <label>姓名</label>
          <input v-model="form.mother.name" type="text" placeholder="请输入母亲姓名" maxlength="20" />
        </div>
        <div class="form-item">
          <label>出生年月</label>
          <input v-model="form.mother.birthYear" type="number" placeholder="如 1962" min="1900" max="2030" />
        </div>
      </div>

      <!-- 配偶信息 -->
      <div class="form-section">
        <div class="section-label">
          <span>配偶信息</span>
          <span class="optional">选填</span>
        </div>
        <div class="form-item">
          <label>姓名</label>
          <input v-model="form.spouse.name" type="text" placeholder="请输入配偶姓名" maxlength="20" />
        </div>
        <div class="form-item-row">
          <div class="form-item flex-1">
            <label>性别</label>
            <div class="gender-btns">
              <button :class="{ active: form.spouse.gender === 'male' }" @click="form.spouse.gender = 'male'">男</button>
              <button :class="{ active: form.spouse.gender === 'female' }" @click="form.spouse.gender = 'female'">女</button>
            </div>
          </div>
          <div class="form-item flex-1">
            <label>出生年月</label>
            <input v-model="form.spouse.birthYear" type="number" placeholder="如 1992" min="1900" max="2030" />
          </div>
        </div>
      </div>

      <!-- 子女信息 -->
      <div class="form-section">
        <div class="section-label">
          <span>子女信息</span>
          <span class="optional">选填</span>
        </div>
        <div v-for="(child, i) in form.children" :key="i" class="child-block">
          <div class="child-header">
            <span class="child-num">子女 {{ i + 1 }}</span>
            <button class="remove-btn" @click="removeChild(i)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div class="form-item">
            <label>姓名</label>
            <input v-model="child.name" type="text" placeholder="请输入姓名" maxlength="20" />
          </div>
          <div class="form-item-row">
            <div class="form-item flex-1">
              <label>性别</label>
              <div class="gender-btns">
                <button :class="{ active: child.gender === 'male' }" @click="child.gender = 'male'">男</button>
                <button :class="{ active: child.gender === 'female' }" @click="child.gender = 'female'">女</button>
              </div>
            </div>
            <div class="form-item flex-1">
              <label>出生年月</label>
              <input v-model="child.birthYear" type="number" placeholder="如 2020" min="1900" max="2030" />
            </div>
          </div>
        </div>
        <button class="add-child-btn" @click="addChild">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          添加子女
        </button>
      </div>

      <!-- 提交 -->
      <button class="submit-btn" @click="submit">确认录入，开启家族树</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import { showToast } from 'vant'

const router = useRouter()
const familyStore = useFamilyStore()

const form = reactive({
  self: { name: '', gender: 'male', birthYear: '' },
  father: { name: '', birthYear: '' },
  mother: { name: '', birthYear: '' },
  spouse: { name: '', gender: 'female', birthYear: '' },
  children: []
})

function addChild() {
  form.children.push({ name: '', gender: 'male', birthYear: '' })
}

function removeChild(index) {
  form.children.splice(index, 1)
}

function goBack() {
  router.back()
}

function submit() {
  if (!form.self.name.trim()) {
    showToast('请输入本人姓名')
    return
  }

  familyStore.batchAddFamily({
    self: {
      name: form.self.name.trim(),
      gender: form.self.gender,
      birthYear: form.self.birthYear ? parseInt(form.self.birthYear) : ''
    },
    father: {
      name: form.father.name.trim(),
      birthYear: form.father.birthYear ? parseInt(form.father.birthYear) : ''
    },
    mother: {
      name: form.mother.name.trim(),
      birthYear: form.mother.birthYear ? parseInt(form.mother.birthYear) : ''
    },
    spouse: {
      name: form.spouse.name.trim(),
      gender: form.spouse.gender,
      birthYear: form.spouse.birthYear ? parseInt(form.spouse.birthYear) : ''
    },
    children: form.children
      .filter(c => c.name && c.name.trim())
      .map(c => ({
        name: c.name.trim(),
        gender: c.gender,
        birthYear: c.birthYear ? parseInt(c.birthYear) : ''
      }))
  })

  showToast('录入成功')
  router.replace('/family-tree')
}
</script>

<style scoped>
.page-header { background: linear-gradient(160deg, #6B9E7B 0%, #7AAF8B 60%, #9CC5A8 100%); color: white; padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl); }
.header-inner { display: flex; align-items: center; gap: var(--spacing-sm); }
.back-btn { background: none; border: none; color: white; cursor: pointer; padding: 4px; display: flex; align-items: center; }
.back-btn:active { opacity: 0.7; }
.page-header h1 { font-family: var(--font-serif); font-size: var(--font-size-xl); font-weight: 700; letter-spacing: 0.05em; }

.form-page { padding-bottom: calc(var(--spacing-3xl) + var(--safe-area-inset-bottom)); }
.page-desc { font-size: var(--font-size-sm); color: var(--text-color-secondary); margin-bottom: var(--spacing-xl); line-height: 1.6; }

/* 表单分区 */
.form-section { background: var(--bg-color-card); border-radius: var(--radius-xl); padding: var(--spacing-lg); margin-bottom: var(--spacing-lg); box-shadow: var(--shadow-card); }
.section-label { display: flex; align-items: center; gap: var(--spacing-xs); margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-sm); border-bottom: 1px solid var(--border-color-light); }
.section-label svg { color: var(--primary-color); flex-shrink: 0; }
.section-label span { font-family: var(--font-serif); font-size: var(--font-size-md); font-weight: 600; color: var(--text-color-primary); }
.required-mark { color: var(--danger-color); font-size: var(--font-size-sm); }
.optional { font-size: var(--font-size-xs); color: var(--text-color-light); font-weight: 400; margin-left: auto; }

/* 表单项 */
.form-item { margin-bottom: var(--spacing-base); }
.form-item label { display: block; font-size: var(--font-size-sm); color: var(--text-color-secondary); margin-bottom: var(--spacing-xs); }
.form-item input { width: 100%; padding: var(--spacing-sm) var(--spacing-base); font-size: var(--font-size-base); border: 1px solid var(--border-color); border-radius: var(--radius-md); background: var(--bg-color-secondary); color: var(--text-color-primary); box-sizing: border-box; transition: border-color 0.3s; }
.form-item input:focus { outline: none; border-color: var(--primary-color); }
.form-item input::placeholder { color: var(--text-color-light); }

.form-item-row { display: flex; gap: var(--spacing-base); }
.form-item.flex-1 { flex: 1; min-width: 0; }

/* 性别按钮 */
.gender-btns { display: flex; gap: var(--spacing-sm); }
.gender-btns button { flex: 1; padding: var(--spacing-sm); background: var(--bg-color-secondary); border: 1.5px solid var(--border-color); border-radius: var(--radius-md); font-size: var(--font-size-sm); color: var(--text-color-secondary); cursor: pointer; transition: all 0.3s; }
.gender-btns button.active { background: var(--primary-bg); border-color: var(--primary-color); color: var(--primary-color); font-weight: 600; }
.gender-btns button:active { opacity: 0.8; }

/* 子女区块 */
.child-block { background: var(--bg-color-secondary); border-radius: var(--radius-lg); padding: var(--spacing-base); margin-bottom: var(--spacing-base); border: 1px solid var(--border-color-light); }
.child-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-base); }
.child-num { font-size: var(--font-size-sm); font-weight: 600; color: var(--primary-color); }
.remove-btn { background: none; border: none; color: var(--text-color-light); cursor: pointer; padding: 4px; display: flex; }
.remove-btn:active { color: var(--danger-color); }

.add-child-btn { display: flex; align-items: center; justify-content: center; gap: var(--spacing-xs); width: 100%; padding: var(--spacing-sm); background: transparent; border: 1.5px dashed var(--border-color); border-radius: var(--radius-lg); color: var(--text-color-secondary); font-size: var(--font-size-sm); cursor: pointer; transition: all 0.3s; }
.add-child-btn:active { border-color: var(--primary-color); color: var(--primary-color); }

/* 提交按钮 */
.submit-btn { display: block; width: 100%; padding: var(--spacing-base) var(--spacing-lg); background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); color: white; border: none; border-radius: var(--radius-xl); font-size: var(--font-size-base); font-weight: 600; cursor: pointer; box-shadow: var(--shadow-primary); transition: all 0.3s; margin-top: var(--spacing-lg); }
.submit-btn:active { transform: scale(0.98); opacity: 0.9; }
</style>
