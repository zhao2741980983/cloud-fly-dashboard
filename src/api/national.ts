import national from '../data/national.json'

export type NationalData = typeof national

export async function getNationalData(): Promise<NationalData> {
  try {
    /**
     * fetch向后端发起请求，${import.meta.env.VITE_API_BASE}
     * 会自动替换成 .env.development 里配置的 http://localhost:8080
     * 故访问地址为http://localhost:8080/api/national
     */
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/national`)
    if (!response.ok) throw new Error('national请求失败')
    //response.json()异步获取，将数据返回为json对象。原response.json()为any类型
    return (await response.json()) as NationalData
  } catch {
    return national
  }
}
