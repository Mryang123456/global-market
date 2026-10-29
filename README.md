# Global Goods Web

面向海外消费者的 React + TypeScript + Vite 商品选购演示应用。

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

构建、单元测试和 lint 已配置。Playwright 场景位于 `e2e/`；运行前需准备 Playwright 对应的浏览器。

## 常用命令

```powershell
npm.cmd run dev
npm.cmd test
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e
```
