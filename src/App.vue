<template>
  <div id="app">
    <div class="app-wrapper">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <TabBar v-if="showTabBar" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from './components/TabBar.vue'

const route = useRoute()

const noTabBarRoutes = ['/login', '/memoir-record', '/milestone-create', '/memoir-detail', '/milestone-detail', '/memoir-collection', '/memoir-combined', '/mine']

const showTabBar = computed(() => {
  return !noTabBarRoutes.includes(route.path)
})
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
  background: #E8EDE9;
}

.app-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg-color);
  position: relative;
  box-shadow: 0 0 40px rgba(90, 130, 104, 0.06);
  overflow-x: hidden;
}

@media (min-width: 481px) {
  .app-wrapper {
    box-shadow: 0 0 60px rgba(90, 130, 104, 0.1);
  }
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
