<script setup lang="ts">
/**
 * 通用加载提示：转圈 + 文案
 * 用 min-height 占位，避免数据到达前后布局跳动
 */
withDefaults(
  defineProps<{
    text?: string
    minHeight?: string
  }>(),
  { text: '数据加载中…', minHeight: '240px' },
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
  color: #8fa3bf;
}

.spinner {
  width: 38px;
  height: 38px;
  border: 3px solid rgba(143, 163, 191, 0.25);
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-size: 14px;
  letter-spacing: 1px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 尊重系统"减少动态效果"设置 */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 2.4s;
  }
}
</style>
