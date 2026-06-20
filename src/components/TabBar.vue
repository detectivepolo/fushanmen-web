<template>
  <nav class="tabbar">
    <router-link 
      v-for="item in tabs" 
      :key="item.path"
      :to="item.path"
      class="tabbar-item"
      :class="{ active: isActive(item.path) }"
    >
      <svg class="tabbar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <!-- 回忆录：书签 -->
        <template v-if="item.id === 'memoir'">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </template>
        <!-- 家族树：树形分支 -->
        <template v-else-if="item.id === 'tree'">
          <rect x="9" y="2" width="6" height="5" rx="1" />
          <rect x="2" y="17" width="6" height="5" rx="1" />
          <rect x="16" y="17" width="6" height="5" rx="1" />
          <path d="M12 7v4M12 11h-7v6M12 11h7v6" />
        </template>
        <!-- 大事记：日历 -->
        <template v-else>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </template>
      </svg>
      <span class="tabbar-text">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

const tabs = [
  { id: 'memoir', path: '/', label: '回忆录' },
  { id: 'tree', path: '/family-tree', label: '家族树' },
  { id: 'milestone', path: '/milestone', label: '大事记' }
]

function isActive(path) {
  if (path === '/') return route.path === '/' || route.path.startsWith('/memoir')
  if (path === '/family-tree') return route.path.startsWith('/family-tree')
  if (path === '/milestone') return route.path.startsWith('/milestone')
  return route.path.startsWith(path)
}
</script>

<style scoped>
.tabbar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-around; align-items: center;
  height: calc(64px + var(--safe-area-inset-bottom));
  padding-bottom: var(--safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color-light);
  z-index: var(--z-index-fixed);
}
.tabbar-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex: 1; height: 54px; color: var(--text-color-light);
  text-decoration: none; transition: all 0.3s; gap: 4px;
}
.tabbar-item.active { color: var(--primary-color); }
.tabbar-icon { width: 24px; height: 24px; transition: transform 0.3s; }
.tabbar-item.active .tabbar-icon { transform: scale(1.12); }
.tabbar-text { font-size: 11px; font-weight: 500; letter-spacing: 0.03em; }
.tabbar-item.active .tabbar-text { font-weight: 600; }
</style>
