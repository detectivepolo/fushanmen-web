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
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/family-tree', label: '家谱', icon: '🌳' },
  { path: '/memoir', label: '回忆', icon: '🎙️' },
  { path: '/milestone', label: '大事记', icon: '📅' },
  { path: '/mine', label: '我的', icon: '👤' }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
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
  height: calc(60px + var(--safe-area-inset-bottom));
  padding-bottom: var(--safe-area-inset-bottom);
  background: var(--bg-color-card);
  border-top: 1px solid var(--border-color-light);
  z-index: var(--z-index-fixed);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 50px;
  color: var(--text-color-light);
  text-decoration: none;
  transition: all 0.3s ease;
}

.tabbar-item.active {
  color: var(--primary-color);
}

.tabbar-item.active .tabbar-item-icon {
  transform: scale(1.1);
}

.tabbar-item-icon {
  font-size: 22px;
  margin-bottom: 2px;
  transition: transform 0.3s ease;
}

.tabbar-item-text {
  font-size: 11px;
}
</style>
