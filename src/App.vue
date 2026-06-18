<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <TabBar v-if="showTabBar" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'

const route = useRoute()

// 不显示底部导航的页面
const noTabBarRoutes = ['/login', '/memoir-record', '/milestone-create', '/memoir-detail', '/milestone-detail']

const showTabBar = computed(() => {
  return !noTabBarRoutes.includes(route.path)
})
</script>

<style>
#app {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
