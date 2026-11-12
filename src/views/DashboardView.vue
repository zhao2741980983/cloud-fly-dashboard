<script setup lang="ts">
import StatCard from '../components/StatCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { computed, ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
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

/* 顶栏右侧的状态胶囊：加载中 / 实时数据 / 本地数据 */
const status = computed(() => {
  if (!ready.value) return { text: '加载中', tone: 'loading' }
  return hasRemoteApi ? { text: '实时数据', tone: 'live' } : { text: '本地数据', tone: 'local' }
})

const validAqi = computed(() => aqi.value.filter((d) => d.aqi !== null))
</script>

<template>
  <main class="dashboard">
    <!-- 加载动画：固定在视口中央，数据请求 + 图表代码下载 + 首帧绘制期间一直显示 -->
    <LoadingSpinner v-if="!chartsPainted" class="page-loading" text="大屏数据加载中…" />

    <!-- 仿 macOS 窗口标题栏：标题 + 状态胶囊 -->
    <header class="window-bar glass">
      <div class="window-title">
        <h1>云资源数据可视化大屏</h1>
        <p class="window-sub">国家统计局 · 2026 年前三季度</p>
      </div>
      <div class="status-pill" :data-tone="status.tone">
        <span class="status-dot" aria-hidden="true"></span>
        <span>{{ status.text }}</span>
      </div>
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
        subtitle="单位：%，累计同比"
        :categories="national.gdpQuarterly2026.map((d) => d.quarter)"
        :values="national.gdpQuarterly2026.map((d) => d.growth)"
        unit="%"
        height="300px"
        @rendered="markPainted"
      />
      <BarChart
        title="三城市空气质量指数"
        subtitle="AQI 越低越好 · 数据来源 WAQI"
        :categories="validAqi.map((d) => d.city)"
        :values="validAqi.map((d) => d.aqi)"
        :bar-width="22"
        show-labels
        height="300px"
        @rendered="markPainted"
      />
      <BarChart
        class="panel-wide"
        title="各省份 2026 年 1—9 月地区生产总值"
        subtitle="单位：亿元，按累计值排列"
        :categories="national.provinceGdp2026Q1to3.map((d) => d.name)"
        :values="national.provinceGdp2026Q1to3.map((d) => d.value)"
        height="1000px"
        @rendered="markPainted"
      />
    </section>

    <footer v-if="ready" class="footnote">
      数据来源：国家统计局《2026 年前三季度国民经济运行情况》· 空气质量数据来源 World Air Quality
      Index (WAQI)
      <template v-if="!hasRemoteApi">· 当前展示的是打包进前端的兜底数据</template>
    </footer>
  </main>
</template>

<style scoped>
.dashboard {
  position: relative;
  min-height: 100vh;
  padding: 24px;
  color: var(--label-primary);
  isolation: isolate;
}

/* 背景：深空灰底 + 三团极低透明度的冷色光晕，让玻璃面板有东西可以"折射" */
.dashboard::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(900px 620px at 8% -8%, rgba(10, 132, 255, 0.16), transparent 62%),
    radial-gradient(760px 520px at 96% 4%, rgba(94, 92, 230, 0.13), transparent 64%),
    radial-gradient(900px 700px at 50% 112%, rgba(100, 210, 255, 0.09), transparent 66%),
    var(--bg-base);
}

/* ---------- 窗口标题栏 ---------- */
.window-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 22px;
  border-radius: var(--radius-lg);
  margin-bottom: 18px;
}

.window-title {
  min-width: 0;
}

h1 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.window-sub {
  margin: 3px 0 0;
  font-size: 12px;
  color: var(--label-tertiary);
  letter-spacing: 0.01em;
}

/* 状态胶囊：右侧的小圆点用颜色表达状态，同时有文字，不靠颜色单独传达信息 */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  padding: 5px 12px 5px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  font-size: 12px;
  color: var(--label-secondary);
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--label-tertiary);
}

.status-pill[data-tone='live'] .status-dot {
  background: var(--green);
  box-shadow: 0 0 8px rgba(48, 209, 88, 0.6);
}

.status-pill[data-tone='local'] .status-dot {
  background: var(--yellow);
  box-shadow: 0 0 8px rgba(255, 214, 10, 0.45);
}

.status-pill[data-tone='loading'] .status-dot {
  background: var(--accent);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}

/* ---------- 指标卡 ---------- */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

/* ---------- 图表区 ---------- */
.charts {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 18px;
}

.panel-wide {
  grid-column: 1 / -1;
}

.footnote {
  margin: 18px 4px 4px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--label-tertiary);
}

/* 加载遮罩：保持深色玻璃质感，不抢内容 */
.page-loading {
  position: fixed;
  inset: 0;
  z-index: 10;
  min-height: 100vh;
  background: rgba(18, 18, 22, 0.55);
  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);
  pointer-events: none;
}

/* 窄屏：图表改为单列，避免挤压 */
@media (max-width: 900px) {
  .charts {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 16px;
  }
  .window-bar {
    padding: 12px 14px;
    gap: 12px;
  }
  .window-sub {
    display: none;
  }
}
</style>
