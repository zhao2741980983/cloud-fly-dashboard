import { describe, it, expect } from 'vitest'
import { getNationalData } from './national'

/*
describe：给一组测试起名字。
it：一个具体的测试用例，名字写清楚它检查什么。
await getNationalData()：调用异步函数，所以要 await。
expect(...).toBe(31)：断言，意思是"期望结果等于 31"。31 个省级行政区，正好对应数据
*/
describe('getNationalData', () => {
  it('返回的数据包含 provinceGdp2026Q1to3 字段', async () => {
    const data = await getNationalData()
    expect(data.provinceGdp2026Q1to3.length).toBe(31)
  })
  it('返回的数据包含 3 个季度的增速', async () => {
    const data = await getNationalData()
    expect(data.gdpQuarterly2026.length).toBe(3)
  })
})
