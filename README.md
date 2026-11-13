# cloud-fly-dashboard

基于 Vue 3 + TypeScript 的数据可视化大屏，展示 2026 年前三季度分省 GDP 与三城市空气质量数据，目前通过 GitHub Actions 自动部署。

## 访问地址(Github)

<https://zhao2741980983.github.io/cloud-fly-dashboard/>

## 开发工具、开发环境

通过使用[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)进行编写

## 自动部署(github)

推送到 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动执行构建，并发布到 GitHub Pages。

## 技术栈

Vue 3、TypeScript、Vite、ECharts

## 数据来源

[国家统计局](https://www.stats.gov.cn/)：2025 年国民经济和社会发展统计公报（统计卡片），2026 年前三季度国民经济运行情况（图表，分省数据为 1—9 月累计）。

空气质量数据：[World Air Quality Index (WAQI)](https://waqi.info/)，通过 `scripts/fetch-aqi.mjs` 抓取，保存在 `src/data/aqi.json`。

## 项目结构

- `components`：通用组件（统计卡片、图表）
- `views`：前端页面
- `data`：数据文件（静态 JSON）

## 后端

数据接口由 Spring Boot 提供，仓库地址：<https://github.com/zhao2741980983/cloud-fly-backend>

- `GET /api/aqi`：三城市空气质量数据
- `GET /api/national`：国家统计数据

线上环境通过 `.env.production` 中的 `VITE_API_BASE` 访问后端，本地开发通过 `.env.development` 指向 `http://localhost:8080`。

## 项目配置

```sh
npm install
```

### 更新空气质量数据

在项目根目录创建 `.env` 文件，写入 `WAQI_TOKEN=你的token`，然后执行：

```sh
node --env-file=.env scripts/fetch-aqi.mjs
```

### 开发环境编译，启动项目

```sh
npm run dev
```

### 生产环境类型检查、编译与压缩

```sh
npm run build
```

### 使用 [Vitest](https://vitest.dev/)运行单元测试

```sh
npm run test:unit
```

### 使用 [ESLint](https://eslint.org/)进行代码检查

```sh
npm run lint
```

## 测试

### 单元测试

使用 Vitest 对数据接口层（`src/api/`）编写单元测试：

- `national.spec.ts`：校验国家统计数据包含 31 个省份的 GDP 数据，以及 3 个季度的增速数据
- `aqi.spec.ts`：校验空气质量数据过滤掉无效值（null）后，剩余数据均为数字

运行测试：

```bash
npm run test:unit
```

### 性能测试

使用 Lighthouse（Chrome 开发者工具）手动检测页面性能，分别测试移动端（模拟 Moto G，低速 4G）和桌面端。

| 设备   | 优化前 | 优化后 |
| ------ | ------ | ------ |
| 移动端 | 82     | 89     |
| 桌面端 | 89     | 90     |
