# hotel-platform 综合项目说明

## 简介

本项目包含三大部分：

- **Server**：基于 Node.js + MongoDB 的后端服务
- **PC**：React + TypeScript + Vite 的管理后台前端
- **Weapp**：小程序端，适配微信开发者工具

---

## 环境准备

### 1. 安装 Node.js

请前往 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

### 2. 安装 MongoDB

- Windows 下安装：
  1. 访问 [MongoDB 官方下载页面](https://www.mongodb.com/try/download/community)
  2. 选择 Community Server，下载并安装
  3. 安装完成后，启动 MongoDB 服务：
     - 可通过“服务”管理器启动 `MongoDB` 服务，或在命令行输入：
       ```powershell
       net start MongoDB
       ```
  4. 默认端口为 27017
- Mac/Linux 下安装：
  - 参考官方文档：[Install MongoDB Community Edition](https://www.mongodb.com/docs/manual/installation/)

### 3. 启动 MongoDB

- Windows：
  ```powershell
  net start MongoDB
  ```
- Mac/Linux：
  ```bash
  mongod --dbpath <你的数据目录>
  ```

---

## 项目结构

```
.
├── LICENSE
├── README.md
├── pc/                # PC 管理后台前端
│   ├── package.json   # 前端依赖
│   ├── src/           # 前端源码
│   └── ...
├── server/            # Node.js 服务端
│   ├── app.js         # 服务端入口
│   ├── package.json   # 服务端依赖
│   ├── config/        # 配置
│   ├── controllers/   # 控制器
│   ├── middlewares/   # 中间件
│   ├── models/        # 数据模型
│   ├── routes/        # 路由
│   └── ...
└── weapp/             # 小程序端
    ├── package.json   # 小程序依赖
    ├── project.config.json # 微信小程序项目配置
    ├── src/           # 小程序源码
    └── ...
```

---

## Server（服务端）

### 依赖安装

```bash
cd server
npm install
```

### 数据库配置

- 默认配置在 [`server/config/db.js`](server/config/db.js)
- 如需修改数据库地址，请编辑该文件
- 确保 MongoDB 服务已启动

### 启动服务端

```bash
npm run dev
```

- 默认监听端口：4000

---

## PC（管理后台前端）

### 依赖安装

```bash
cd pc
npm install
```

### 启动开发环境

```bash
npm run dev
```

- 默认访问地址：http://localhost:5173

### 打包构建

```bash
npm run build
```

- 构建产物输出至 `pc/dist/`

---

## Weapp（小程序端）

### 依赖安装

```bash
cd weapp
npm install
```

### 本地开发/预览

- 推荐使用微信开发者工具导入 `weapp` 目录
- 或命令行构建：
  ```bash
  npm run dev
  ```

### 打包构建

```bash
npm run build
```

- 构建产物输出至 `weapp/dist/`

### 导入微信开发者工具

1. 打开微信开发者工具，选择“导入项目”
2. 选择 `weapp` 目录，配置好 `AppID`（可用测试号）
3. 运行/预览小程序

---

## 其他说明

- 各端均需独立安装依赖、独立启动
- 推荐 Node.js 版本 >= 16.x
- 推荐 MongoDB 版本 >= 4.x

---
