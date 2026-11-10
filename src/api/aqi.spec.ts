import { describe, expect, it } from 'vitest'
import { getAqiData } from './aqi'

describe('getAqiData', () => {
  it('过滤为null的城市数据', async () => {
    const data = await getAqiData()
    //filter对data中每一项数据都进行一次判定，filter右边回调函数判定方法，最终结果全部给vaild
    const valid = data.filter((d) => d.aqi !== null)
    //方法1  toBe(数据保留数)；目前数据量较少时稳妥填写
    //expect(valid.length).toBe(2)
    //方法2  数据过滤，不应该再有 null
    expect(valid.some((d) => d.aqi === null)).toBe(false)
    expect(valid.every((d) => typeof d.aqi === 'number')).toBe(true)
  })
})
