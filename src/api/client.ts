/**
 * 后端接口基地址（来自 .env.development 的 VITE_API_BASE）。
 *
 * 线上（GitHub Pages）只部署了前端、没有部署后端，VITE_API_BASE 为空字符串。
 * 这种情况下不再发起注定失败的请求，直接用打包进前端的本地 JSON 兜底数据，
 * 避免白白等待一次 404 往返（实测线上会先串行等 ~800ms 才回退）。
 */
/** 开发环境默认连本地后端；生产环境默认不连（GitHub Pages 只部署了前端） */
const DEFAULT_API_BASE = import.meta.env.DEV ? 'http://localhost:8080' : ''

export const API_BASE = (import.meta.env.VITE_API_BASE ?? DEFAULT_API_BASE)
  .trim()
  .replace(/\/+$/, '')

/** 是否配置了可用的后端地址 */
export const hasRemoteApi = API_BASE.length > 0

/** 后端响应超时时间：超时后立即回退本地数据，大屏不空等 */
const REQUEST_TIMEOUT_MS = 6000

/**
 * 请求后端接口，任何异常（未配置地址 / 网络失败 / 超时 / 非 2xx / JSON 解析失败）
 * 都回退到传入的本地数据，保证大屏始终有内容可展示。
 */
export async function fetchApi<T>(path: string, fallback: T): Promise<T> {
  if (!hasRemoteApi) return fallback

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}${path}`, { signal: controller.signal })
    if (!response.ok) throw new Error(`${path} 请求失败：HTTP ${response.status}`)
    return (await response.json()) as T
  } catch {
    return fallback
  } finally {
    clearTimeout(timer)
  }
}
