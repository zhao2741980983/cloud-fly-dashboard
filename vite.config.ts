import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  //学习记录
  // 部署到 GitHub Pages 时，网址带有仓库名（用户名.github.io/仓库名/），
  // 所以资源路径要加上 /cloud-fly-dashboard/，否则页面打开后样式和脚本会找不到。
  // 本地开发时访问 http://localhost:5173/cloud-fly-dashboard/
  base: '/cloud-fly-dashboard/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
