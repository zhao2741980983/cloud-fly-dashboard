/**
 * 图表统一视觉：与 CSS 设计令牌保持一致（系统蓝强调色 / 低对比坐标轴 / 玻璃质感 tooltip）。
 * ECharts 的配色不走 CSS 变量，所以在这里集中维护，两个图表组件共用。
 */

export const CHART = {
  accent: '#0a84ff',
  accentBright: '#64d2ff',
  labelColor: 'rgba(235, 235, 245, 0.58)',
  splitLineColor: 'rgba(255, 255, 255, 0.07)',
  axisLineColor: 'rgba(255, 255, 255, 0.1)',
  fontSize: 11,
}

/** 坐标轴文字样式 */
export const axisLabel = {
  color: CHART.labelColor,
  fontSize: CHART.fontSize,
}

/** 玻璃浮层质感 tooltip */
export const tooltipStyle = {
  backgroundColor: 'rgba(28, 28, 34, 0.92)',
  borderColor: 'rgba(255, 255, 255, 0.14)',
  borderWidth: 1,
  borderRadius: 12,
  padding: [10, 12] as [number, number],
  textStyle: { color: '#f5f5f7', fontSize: 12 },
  extraCssText:
    'backdrop-filter: blur(20px) saturate(160%); -webkit-backdrop-filter: blur(20px) saturate(160%); box-shadow: 0 16px 40px rgba(0,0,0,0.5);',
}

/** 竖向渐变（用于面积图填充） */
export function verticalGradient(from: string, to: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  }
}
