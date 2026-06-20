<template>
  <nav class="tabbar">
    <router-link 
      v-for="item in tabs" 
      :key="item.path"
      :to="item.path"
      class="tabbar-item"
      :class="{ active: isActive(item.path) }"
    >
      <span class="tabbar-item-icon">{{ item.icon }}</span>
      <span class="tabbar-item-text">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/', label: '回忆录', icon: '📖' },
  { path: '/family-tree', label: '家族树', icon: '🌳' },
  { path: '/milestone', label: '大事记', icon: '📅' }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/' || route.path.startsWith('/memoir')
  }
  if (path === '/family-tree') {
    return route.path.startsWith('/family-tree')
  }
  if (path === '/milestone') {
    return route.path.startsWith('/milestone')
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(64px + var(--safe-area-inset-bottom));
  padding-bottom: var(--safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color-light);
  z-index: var(--z-index-fixed);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 54px;
  color: var(--text-color-light);
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 3px;
}

.tabbar-item.active {
  color: var(--primary-color);
}

.tabbar-item.active .tabbar-item-icon {
  transform: scale(1.15);
}

.tabbar-item-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.tabbar-item-text {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.tabbar-item.active .tabbar-item-text {
  font-weight: 600;
}
</style>
