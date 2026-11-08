//node:fs 是 Node 自带的文件模块，writeFileSync 的意思是"把内容写进文件"。
import { writeFileSync } from 'node:fs'

const token = process.env.WAQI_TOKEN
if (!token) {
  console.log('没有读取到 WAQI_TOKEN,请检查项目根目录的 .env 文件')
  process.exit(1)
}

//循环查询城市
const results = []
const cities = ['beijing', 'shanghai', 'guangzhou']
for (const city of cities) {
  const url = `https://api.waqi.info/feed/${city}/?token=${token}`
  const response = await fetch(url)
  const json = await response.json()
  console.log(city, json.status, json.data.aqi)
  //把结果写进 results 数组
  results.push({ city, aqi: json.data.aqi === '-' ? null : json.data.aqi })
}
//JSON.stringify(results, null, 2)：把数组转成带缩进的 JSON 文字。
//writeFileSync(路径, 内容)：把内容写到指定文件里。路径从项目根目录开始写。
writeFileSync('src/data/aqi.json', JSON.stringify(results, null, 2))
