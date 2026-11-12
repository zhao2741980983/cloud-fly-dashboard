import { describe, expect, it, vi, afterEach } from 'vitest'
import national from '../data/national.json'

describe('fetchApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('请求失败时回退到本地数据', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const { fetchApi } = await import('./client')
    const data = await fetchApi('/api/national', national)
    expect(data.provinceGdp2026Q1to3.length).toBe(31)
  })

  it('返回非 2xx 时回退到本地数据', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }),
    )
    const { fetchApi } = await import('./client')
    const data = await fetchApi('/api/national', national)
    expect(data.provinceGdp2026Q1to3.length).toBe(31)
  })

  it('后端有数据时使用后端返回的数据', async () => {
    const remote = { ...national, gdpQuarterly2026: national.gdpQuarterly2026.slice(0, 1) }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => remote }),
    )
    const { fetchApi } = await import('./client')
    const data = await fetchApi('/api/national', national)
    expect(data.gdpQuarterly2026.length).toBe(1)
  })
})
