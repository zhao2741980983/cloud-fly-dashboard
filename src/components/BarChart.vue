<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed } from 'vue'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { CHART, axisLabel, tooltipStyle, verticalGradient } from '../charts/theme'

use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  title: string
  subtitle?: string
  categories: string[]
  values: number[]
  unit?: string
  height?: string
  /** 条形宽度（少量数据时可以加宽，像 macOS 健康 App 的胶囊条） */
  barWidth?: number
  /** 是否在条形末端显示数值 */
  showLabels?: boolean
}>()

const emit = defineEmits<{ rendered: [] }>()

/* 单一系统蓝 + 上浅下深的光泽渐变，不放彩虹色，靠圆角与高光出质感 */
const options = computed(() => {
  const barWidth = props.barWidth ?? 14
  return {
    grid: { left: 12, right: props.showLabels ? 52 : 28, top: 12, bottom: 12, containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: CHART.splitLineColor } },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel,
    },
    yAxis: {
      type: 'category',
      data: props.categories,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...axisLabel, margin: 14 },
    },
    series: [
      {
        type: 'bar',
        data: props.values,
        barMaxWidth: barWidth,
        itemStyle: {
          borderRadius: barWidth / 2,
          color: verticalGradient('#48a3ff', CHART.accent),
          shadowColor: 'rgba(10, 132, 255, 0.35)',
          shadowBlur: 10,
          shadowOffsetY: 2,
        },
        label: {
          show: props.showLabels ?? false,
          position: 'right',
          distance: 10,
          color: CHART.labelColor,
          fontSize: 12,
          formatter: (p: { value: number }) => `${p.value}${props.unit ?? ''}`,
        },
        emphasis: { itemStyle: { color: verticalGradient('#7cc0ff', '#2b95ff') } },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(255,255,255,0.04)' } },
      valueFormatter: (value: number) => `${value}${props.unit ?? ''}`,
      ...tooltipStyle,
    },
    /* 让 echarts 自动生成无障碍描述，读屏软件可以读到图表内容摘要 */
    aria: { enabled: true },
    animationDuration: 700,
    animationEasing: 'cubicOut' as const,
    backgroundColor: 'transparent',
  }
})
</script>

<template>
  <section class="panel glass">
    <header class="panel-head">
      <div>
        <h2 class="panel-title">{{ title }}</h2>
        <p v-if="subtitle" class="panel-sub">{{ subtitle }}</p>
      </div>
    </header>
    <div class="panel-body">
      <VChart
        :option="options"
        autoresize
        :style="{ height: height ?? '320px' }"
        @rendered="emit('rendered')"
      />
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 12px;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px 8px 4px;
}

.panel-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--label-primary);
}

.panel-sub {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--label-tertiary);
  letter-spacing: 0.01em;
}

.panel-body {
  flex: 1;
  min-height: 0;
}
</style>
