# Global Goods Web

面向海外消费者的 React + TypeScript + Vite 商品选购演示应用。

## 环境要求

- Node.js `20.19+` 或 `22.12+`（建议使用受支持的 Node.js LTS 版本）。
- npm（随 Node.js 一起安装）。
- Playwright E2E 测试需要 Chromium 浏览器；首次运行前按下方步骤安装。

检查本地版本：

```powershell
node --version
npm --version
```

## 安装与启动

在项目根目录（包含 `package.json` 的 `web` 目录）运行：

```powershell
npm.cmd ci
npm.cmd run dev
```

Vite 会在终端输出本地开发地址，通常是 `http://localhost:5173`。按 `Ctrl+C` 停止开发服务器。

本项目没有必需的 `.env` 文件或环境变量。商品数据为本地演示数据，购物车保存在浏览器 `localStorage` 的 `cart:v1` 键中。

## 功能

- 商品首页、目录、商品详情和购物车路由。
- 商品搜索、分类、价格区间、颜色、材质和库存筛选。
- 推荐、价格升序/降序和评分排序。
- 商品评分与评论数、收藏状态、规格选择和库存提示。
- `cart:v1` 本地购物车，按商品及规格区分行项目，并限制库存数量。
- 购物袋抽屉支持数量调整、移除、小计及推荐商品。
- 响应式目录布局，覆盖桌面与窄屏展示。

## 尚未接入

- 登录、支付和真实结账服务。
- 服务端商品目录、库存和订单 API；当前商品数据及收藏状态为本地演示数据。
- 完整的真实设备浏览器验收与最终截图确认。

## 验证状态

单元测试由 Vitest 执行；Playwright 场景位于 `e2e/`。

首次运行 E2E 测试时，先安装 Playwright 使用的 Chromium：

```powershell
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

Playwright 会自动启动 Vite preview 服务并使用 `http://127.0.0.1:4173`。默认保留失败截图，测试结果写入 `test-results/`（该目录不纳入 Git）。

## 配置文件

- `package.json`：运行脚本及 React、Ant Design、Vite、Vitest、Playwright 等依赖声明；`package-lock.json` 锁定 npm 依赖版本。
- `vite.config.ts`：Vite 配置及 React 插件。
- `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`：TypeScript 项目引用与编译选项。
- `.oxlintrc.json`：Oxlint 规则。
- `playwright.config.ts`：E2E 测试目录、超时、preview 服务地址和截图策略。

## 常用命令

```powershell
npm.cmd run dev
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run preview
```
