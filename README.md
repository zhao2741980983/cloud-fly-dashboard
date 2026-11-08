# cloud-fly-dashboard

练习项目-云资源数据可视化大屏

## 开发工具、开发环境

通过使用[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)进行编写

## 技术栈

Vue 3、TypeScript、Vite、ECharts

## 数据来源

[国家统计局](https://www.stats.gov.cn/)  
江苏、山东的省级 GDP 为近似值，以统计局公报为准。

## 项目结构

- `components`：通用组件（统计卡片、图表）
- `views`：前端页面
- `data`：数据文件（静态 JSON）

## 项目配置

```sh
npm install
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
