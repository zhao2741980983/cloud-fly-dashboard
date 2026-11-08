<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])
/*ECharts 按需加载，没注册的功能不能用。这样能减小打包体积，也是性能优化的一个例子
VChart 是 Vue 组件，LineChart 是折线图，GridComponent 是网格组件，TooltipComponent 是提示框组件，TitleComponent 是标题组件，CanvasRenderer 是渲染器。*/
import { computed } from 'vue'

const props = defineProps<{
  title: string
  categories: string[]
  values: number[]
  unit?: string
}>()

/*computed 的意思是"依赖的数据变了，这里的结果自动更新"。props 变化时，图表会跟着变*/
const option = computed(() => ({
  xAxis: {
    type: 'category',
    data: props.categories,
    axisLabel: { color: '#8fa3bf' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#8fa3bf' },
  },
  series: [
    {
      type: 'line',
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
  <VChart :option="option" autoresize style="height: 320px" />
</template>
