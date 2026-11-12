<script setup lang="ts">
//接受父组件传参(三个)
defineProps<{
  title: string //卡片标题
  value: string | number //显示数值(数字/文字)
  unit?: string //单位
}>()
</script>

<template>
  <article class="stat-card glass">
    <p class="stat-label">{{ title }}</p>
    <p class="stat-value">
      <span class="stat-number">{{ value }}</span>
      <!--v-if 是条件判断，意思是"只有 unit 有值的时候才显示这个 span"-->
      <span class="stat-unit" v-if="unit">{{ unit }}</span>
    </p>
  </article>
</template>

<style scoped>
.stat-card {
  padding: 18px 20px 16px;
}

.stat-label {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--label-secondary);
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 10px 0 0;
}

/* 数字用等宽数字（tabular-nums），跳动时不会左右抖动，向 macOS 控制中心看齐 */
.stat-number {
  font-size: 30px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--label-primary);
}

.stat-unit {
  font-size: 13px;
  font-weight: 400;
  color: var(--label-tertiary);
}

@media (max-width: 640px) {
  .stat-number {
    font-size: 26px;
  }
}
</style>
