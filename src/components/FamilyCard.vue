<template>
  <div class="family-card" @click="$emit('click')">
    <div class="card-avatar">
      <div class="avatar" :class="sizeClass">
        {{ member.avatar || member.name.charAt(0) }}
      </div>
      <span v-if="member.isAlive !== false" class="alive-dot"></span>
    </div>
    <div class="card-content">
      <div class="card-header">
        <span class="member-name">{{ member.name }}</span>
        <span class="member-relation tag">{{ member.relation }}</span>
      </div>
      <div class="card-info">
        <span v-if="member.birthYear" class="info-item">
          🎂 {{ member.birthYear }}年
        </span>
        <span v-if="member.spouse" class="info-item">
          💑 {{ member.spouse }}
        </span>
      </div>
    </div>
    <div class="card-arrow">›</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  member: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

defineEmits(['click'])

const sizeClass = computed(() => ({
  'avatar-sm': props.size === 'sm',
  'avatar-lg': props.size === 'lg'
}))
</script>

<style scoped>
.family-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-base);
  background: var(--bg-color-card);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.family-card:active {
  transform: scale(0.98);
  background: var(--bg-color-secondary);
}

.card-avatar {
  position: relative;
  margin-right: var(--spacing-base);
}

.alive-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: var(--success-color);
  border-radius: var(--radius-full);
  border: 2px solid var(--bg-color-card);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.member-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--text-color-primary);
}

.member-relation {
  font-size: var(--font-size-xs);
  padding: 2px 8px;
  background: var(--primary-light);
  color: white;
  border-radius: var(--radius-full);
}

.card-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.info-item {
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
}

.card-arrow {
  font-size: var(--font-size-xl);
  color: var(--text-color-light);
  margin-left: var(--spacing-sm);
}
</style>
