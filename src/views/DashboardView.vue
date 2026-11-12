<script setup lang="ts">
import StatCard from '../components/StatCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { getNationalData, type NationalData } from '../api/national'
import { getAqiData, type AqiRecord } from '../api/aqi'
import { hasRemoteApi } from '../api/client'

const LineChart = defineAsyncComponent(() => import('../components/LineChart.vue'))
const BarChart = defineAsyncComponent(() => import('../components/BarChart.vue'))

/*national 从 null 变成有数据，v-if="national" 成立，图表就显示*/
const national = ref<NationalData | null>(null)
const aqi = ref<AqiRecord[]>([])

/* ready：数据和图表代码都就绪，可以挂载图表组件 */
const ready = ref(false)
/* chartsPainted：至少有一张图表真正画到了 canvas 上，此时才收起加载动画 */
const chartsPainted = ref(false)

/* 兜底定时器：万一图表一直没触发 rendered 事件，也不能一直转圈 */
let safetyTimer: ReturnType<typeof setTimeout> | undefined

function markPainted() {
  chartsPainted.value = true
  if (safetyTimer) clearTimeout(safetyTimer)
}

onMounted(async () => {
  /* 10 秒还没渲染完就强制收起加载动画，保证不会无限转圈 */
  safetyTimer = setTimeout(markPainted, 10000)

  try {
    /**
     * 四件事互不依赖，用 Promise.all 并行：
     * - 两个数据接口并行请求，总耗时取较慢的一个
     * - 同时把 echarts 图表代码（约 160KB gzip）一起下载
     * 必须等图表代码也加载完再渲染，否则会出现"数据已到但图表区域一片空白"的空窗期。
     */
    const [nationalData, aqiData] = await Promise.all([
      getNationalData(),
      getAqiData(),
      import('../components/LineChart.vue'),
      import('../components/BarChart.vue'),
    ])
    national.value = nationalData
    aqi.value = aqiData
  } finally {
    ready.value = true
  }
})

onUnmounted(() => {
  if (safetyTimer) clearTimeout(safetyTimer)
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
    <!-- 加载动画：固定在视口中央，数据请求 + 图表代码下载 + 首帧绘制期间一直显示 -->
    <LoadingSpinner v-if="!chartsPainted" class="page-loading" text="大屏数据加载中…" />

    <header>
      <h1>云资源数据可视化大屏</h1>
      <p class="source">
        数据来源：国家统计局<template v-if="!hasRemoteApi">（本地兜底数据，后端未接入）</template>
      </p>
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

    <section class="charts" v-if="ready && national">
      <LineChart
        title="2026 年各季度 GDP 同比增速"
        :categories="national.gdpQuarterly2026.map((d) => d.quarter)"
        :values="national.gdpQuarterly2026.map((d) => d.growth)"
        unit="%"
        @rendered="markPainted"
      />
      <BarChart
        title="各省份 2026 年 1—9 月地区生产总值（亿元）"
        :categories="national.provinceGdp2026Q1to3.map((d) => d.name)"
        :values="national.provinceGdp2026Q1to3.map((d) => d.value)"
        height="1000px"
        @rendered="markPainted"
      />
      <BarChart
        title="三城市空气质量指数（AQI）"
        :categories="aqi.filter((d) => d.aqi !== null).map((d) => d.city)"
        :values="aqi.filter((d) => d.aqi !== null).map((d) => d.aqi)"
        height="150px"
        @rendered="markPainted"
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

/* 覆盖整个视口的加载遮罩：中心转圈，不挡滚动、不抢点击 */
.page-loading {
  position: fixed;
  inset: 0;
  z-index: 10;
  min-height: 100vh;
  background: rgba(11, 20, 36, 0.35);
  backdrop-filter: blur(2px);
  pointer-events: none;
}
</style>
