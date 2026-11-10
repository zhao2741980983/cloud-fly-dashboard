<script setup lang="ts">
import StatCard from '../components/StatCard.vue'
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { getNationalData, type NationalData } from '../api/national'
import { getAqiData, type AqiRecord } from '../api/aqi'
const LineChart = defineAsyncComponent(() => import('../components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('../components/BarChart.vue'))

/*national 从 null 变成有数据，v-if="national" 成立，图表就显示*/
const national = ref<NationalData | null>(null)
const aqi = ref<AqiRecord[]>([])
onMounted(async () => {
  national.value = await getNationalData()
  aqi.value = await getAqiData()
})

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

    <section class="charts" v-if="national">
      <LineChart
        title="2026 年各季度 GDP 同比增速"
        :categories="national.gdpQuarterly2026.map((d) => d.quarter)"
        :values="national.gdpQuarterly2026.map((d) => d.growth)"
        unit="%"
      />
      <BarChart
        title="各省份 2026 年 1—9 月地区生产总值（亿元）"
        :categories="national.provinceGdp2026Q1to3.map((d) => d.name)"
        :values="national.provinceGdp2026Q1to3.map((d) => d.value)"
        height="1000px"
      />
      <BarChart
        title="三城市空气质量指数（AQI）"
        :categories="aqi.filter((d) => d.aqi !== null).map((d) => d.city)"
        :values="aqi.filter((d) => d.aqi !== null).map((d) => d.aqi)"
        height="150px"
      />
    </section>
    <p class="source">空气质量数据来源:World Air Quality Index (WAQI)</p>
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
