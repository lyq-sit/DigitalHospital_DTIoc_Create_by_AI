# 智慧医院数字孪生 IOC

基于 Vue 3 + Vite + WDP API 的医院数字孪生可视化平台。

## 项目结构

```
Demo1/
├── index.html              # 入口 HTML
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── README.md               # 项目说明
├── src/
│   ├── main.js             # 入口 JS
│   ├── App.vue             # 根组件
│   ├── style.css           # 全局样式
│   ├── data/
│   │   └── mockData.js     # Mock 数据
│   └── components/
│       ├── NavBar.vue          # 顶部导航栏
│       ├── LoadingOverlay.vue  # 加载动画
│       ├── LeftPanel.vue       # 左侧统计面板
│       ├── RightPanel.vue      # 右侧统计面板
│       ├── BuildingPOIs.vue    # 楼宇 POI
│       ├── SpaceManager.vue    # 空间管理模块
│       ├── DeviceManager.vue   # 设备管理模块
│       └── DeviceDetailModal.vue # 设备详情弹窗
```

## 功能模块

### 1. 综合管理
- 医院全景展示
- 左右侧面板统计指标
- 楼宇分布 POI

### 2. 空间管理
- 环境导览（相机漫游）
- 楼宇拆解（分层展示）
- 房间管理（类型筛选、高亮显示）

### 3. 设备管理
- 设备总览统计
- 设备查询（搜索/点击）
- 设备新增（床位/仪器）
- 设备迁移
- 设备升级
- 设备卸载

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **3D 渲染**: WDP API (CloudApi)
- **样式**: CSS3 (自定义设计系统)

## 启动项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 接入信息

- **渲染地址**: https://dtp-api.51aes.com
- **渲染口令**: 7ad6080b587af8808f810d7331165646

## 开发说明

### 数据层
所有业务数据存储在 `src/data/mockData.js`，包括：
- 楼宇台账
- 房间台账
- 设备台账（存量 + 预置）

### 组件通信
- Props 向下传递数据
- Events 向上通知操作
- 场景操作通过 WDP API 直接调用

### 场景初始化流程
1. 加载 CloudApi.min.js
2. 创建 WdpApi 实例
3. 等待场景加载完成 (onProgress/onReady)
4. 初始化隐藏预置设备
5. 飞至全景视角

## 注意事项

1. **BIM 插件**: 楼宇拆解功能需要安装 BIM 插件
2. **场景就绪**: 所有业务操作需在 `progress === 100` 后执行
3. **设备新增**: 通过预置模型显隐实现，非动态加载
4. **F4/Roof 锁定**: 设备管理时需锁定防止点选穿透
