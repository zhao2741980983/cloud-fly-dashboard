<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { CHART, axisLabel, tooltipStyle, verticalGradient } from '../charts/theme'

use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  title: string
  subtitle?: string
  categories: string[]
  values: number[]
  unit?: string
  height?: string
}>()

const emit = defineEmits<{ rendered: [] }>()

const option = computed(() => ({
  grid: { left: 12, right: 20, top: 16, bottom: 12, containLabel: true },
  xAxis: {
    type: 'category',
    data: props.categories,
    boundaryGap: false,
    axisLine: { lineStyle: { color: CHART.axisLineColor } },
    axisTick: { show: false },
    axisLabel: { ...axisLabel, margin: 12 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: CHART.splitLineColor } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel,
  },
  series: [
    {
      type: 'line',
      data: props.values,
      smooth: 0.4,
      symbol: 'circle',
      symbolSize: 9,
      itemStyle: {
        color: CHART.accent,
        borderColor: 'rgba(245, 245, 247, 0.92)',
        borderWidth: 2,
      },
      lineStyle: {
        width: 2.5,
        color: CHART.accent,
        shadowColor: 'rgba(10, 132, 255, 0.45)',
        shadowBlur: 14,
        shadowOffsetY: 5,
      },
      areaStyle: {
        color: verticalGradient('rgba(10, 132, 255, 0.18)', 'rgba(10, 132, 255, 0)'),
      },
      emphasis: { scale: 1.25 },
    },
  ],
  tooltip: {
    trigger: 'axis',
    valueFormatter: (value: number) => `${value}${props.unit ?? ''}`,
    ...tooltipStyle,
  },
  animationDuration: 700,
  animationEasing: 'cubicOut' as const,
  backgroundColor: 'transparent',
}))
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
        :option="option"
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
