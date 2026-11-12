<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])
/*ECharts 按需加载，没注册的功能不能用。这样能减小打包体积，也是性能优化的一个例子
VChart 是 Vue 组件，LineChart 是折线图，GridComponent 是网格组件，TooltipComponent 是提示框组件，TitleComponent 是标题组件，CanvasRenderer 是渲染器。*/
import { computed } from 'vue'

const props = defineProps<{
  title: string
  categories: string[]
  values: number[]
  unit?: string
  height?: string
}>()

/* 图表完成首帧绘后通知父组件，用于收起加载动画 */
const emit = defineEmits<{ rendered: [] }>()

/*computed 的意思是"依赖的数据变了，这里的结果自动更新"。props 变化时，图表会跟着变*/
const option = computed(() => ({
  /*
    xAxis / yAxis：坐标轴。type 决定轴的类型（value 数值轴、category 分类轴）。
    series：数据系列，是数组。type 决定图表类型，data 是数值。 
*/
  grid: {
    left: 80,
    right: 40,
    top: 50,
    bottom: 30,
  },

  xAxis: {
    type: 'value',
    axisLabel: { color: '#8fa3bf' },
  },
  yAxis: {
    type: 'category',
    data: props.categories,
    axisLabel: { color: '#8fa3bf' },
  },
  series: [
    {
      type: 'bar',
      data: props.values,
    },
  ],
  backgroundColor: 'transparent',
  title: {
    text: props.title,
    textStyle: { color: '#fff', fontSize: 16 },
  },
  tooltip: {
    trigger: 'axis',
  },
}))
</script>

<template>
  <VChart
    :option="option"
    autoresize
    :style="{ height: height ?? '320px' }"
    @rendered="emit('rendered')"
  />
</template>
