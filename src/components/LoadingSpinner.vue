<script setup lang="ts">
/**
 * 通用加载提示：系统蓝转圈 + 文案
 * 用 min-height 占位，避免数据到达前后布局跳动
 */
withDefaults(
  defineProps<{
    text?: string
    minHeight?: string
  }>(),
  { text: '正在加载…', minHeight: '240px' },
)
</script>

<template>
  <div class="loading" role="status" aria-live="polite" :style="{ minHeight }">
    <span class="spinner" aria-hidden="true"></span>
    <span class="loading-text">{{ text }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  width: 100%;
  color: var(--label-secondary);
}

.spinner {
  width: 34px;
  height: 34px;
  border: 2.5px solid rgba(235, 235, 245, 0.14);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.9s cubic-bezier(0.5, 0.15, 0.5, 0.85) infinite;
}

.loading-text {
  font-size: 13px;
  letter-spacing: 0.02em;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
