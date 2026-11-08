<script setup lang="ts">
import StatCard from '../components/StatCard.vue'
import LineChart from '../components/LineChart.vue'
import national from '../data/national.json'
import BarChart from '../components/BarChart.vue'
const stats = [
  { title: '2025 年末全国人口', value: 140489, unit: '万人' },
  { title: '2025 年国内生产总值', value: 140.19, unit: '万亿元' },
  { title: '2026 年前三季度 GDP 增速', value: 4.6, unit: '%' },
  { title: '2025 年居民人均可支配收入', value: 43377, unit: '元' },
]
</script>

<template>
  <main class="dashboard">
    <header>
      <h1>云资源数据可视化大屏</h1>
      <p class="source">数据来源：国家统计局</p>
    </header>
    <section class="stats">
      <StatCard
        v-for="item in stats"
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :unit="item.unit"
      />
    </section>

    <section class="charts">
      <LineChart
        title="各省份 2026 年 1—9 月地区生产总值（亿元）"
        :categories="national.gdpQuarterly2026.map((d) => d.quarter)"
        :values="national.gdpQuarterly2026.map((d) => d.growth)"
        unit="%"
      />
      <BarChart
        title="各省份 2026 年 GDP"
        :categories="national.provinceGdp2026Q1to3.map((d) => d.name)"
        :values="national.provinceGdp2026Q1to3.map((d) => d.value)"
      />
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 24px;
  background-color: #0b1424;
  color: #fff;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

.source {
  margin: 4px 0 20px;
  color: #8fa3bf;
  font-size: 13px;
}
</style>
