<template>
  <div class="page-container">
    <header class="page-header">
      <h1>🌳 家谱</h1>
    </header>

    <!-- 切换视图 -->
    <div class="view-toggle">
      <button 
        :class="{ active: viewMode === 'list' }"
        @click="viewMode = 'list'"
      >
        📋 列表
      </button>
      <button 
        :class="{ active: viewMode === 'tree' }"
        @click="viewMode = 'tree'"
      >
        🌲 树状
      </button>
    </div>

    <div class="page-content">
      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="list-view">
        <FamilyCard 
          v-for="member in members" 
          :key="member.id"
          :member="member"
          @click="showMemberDetail(member)"
        />
      </div>

      <!-- 树状视图 -->
      <div v-else class="tree-view">
        <div class="tree-container">
          <div 
            v-for="gen in generations" 
            :key="gen"
            class="generation"
          >
            <div class="gen-label">第{{ gen }}代</div>
            <div class="gen-members">
              <div 
                v-for="member in getMembersByGeneration(gen)" 
                :key="member.id"
                class="tree-node"
                @click="showMemberDetail(member)"
              >
                <div class="node-avatar">
                  {{ member.name.charAt(0) }}
                </div>
                <div class="node-info">
                  <span class="node-name">{{ member.name }}</span>
                  <span class="node-relation">{{ member.relation }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family'
import FamilyCard from '@/components/FamilyCard.vue'

const router = useRouter()
const familyStore = useFamilyStore()

const viewMode = ref('list')

const members = computed(() => familyStore.getMembers())

const generations = computed(() => {
  const gens = [...new Set(members.value.map(m => m.generation))]
  return gens.sort((a, b) => a - b)
})

function getMembersByGeneration(gen) {
  return members.value.filter(m => m.generation === gen)
}

function showMemberDetail(member) {
  familyStore.setCurrentMember(member)
  router.push('/core-family')
}
</script>

<style scoped>
.view-toggle {
  display: flex;
  padding: var(--spacing-base);
  gap: var(--spacing-sm);
  background: var(--bg-color-card);
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
}

.view-toggle button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-base);
  background: var(--bg-color-secondary);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: all 0.3s;
}

.view-toggle button.active {
  background: var(--primary-color);
  color: white;
}

.tree-view {
  padding: var(--spacing-base);
}

.tree-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.generation {
  position: relative;
}

.generation::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary-light), var(--primary-color));
  border-radius: var(--radius-full);
}

.gen-label {
  position: relative;
  z-index: 1;
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-xs) var(--spacing-base);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-base);
  margin-left: var(--spacing-base);
}

.gen-members {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding-left: var(--spacing-xl);
}

.tree-node {
  display: flex;
  align-items: center;
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-base);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s;
}

.tree-node:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-card);
}

.node-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-right: var(--spacing-sm);
}

.node-info {
  display: flex;
  flex-direction: column;
}

.node-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color-primary);
}

.node-relation {
  font-size: var(--font-size-xs);
  color: var(--text-color-light);
}
</style>
