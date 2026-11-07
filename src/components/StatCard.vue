<script setup lang="ts">
//接受父组件传参(三个)

defineProps<{
  title: string //卡片标题
  value: string | number //显示数值(数字/文字)
  unit?: string //单位
}>()
</script>

<template>
  <div class="stat-card">
    <!-- 这里显示 defineProps 中的 title -->
    <p class="stat-title">{{ title }}</p>
    <p class="stat-value">
      <!--v-if 是条件判断，意思是"只有 unit 有值的时候才显示这个 span"-->
      {{ value }}<span class="stat-unit" v-if="unit">{{ unit }}</span>
    </p>
  </div>
</template>

<style scoped>
/* 统计卡片样式;scoped只影响当前组件 */
.stat-card {
  background-color: #13203a;
  border: 1px solid #1e3a5f;
  border-radius: 8px;
  padding: 16px 20px;
}
.stat-title {
  margin: 0;
  color: #8fa3bf;
  font-size: 14px;
}

.stat-value {
  margin: 8px 0 0;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
}

.stat-unit {
  margin-left: 4px;
  font-size: 14px;
  color: #8fa3bf;
}
</style>
