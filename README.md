# hotel-platform 项目说明

## 简介

---

## 环境准备

### 1. 安装 Node.js

请前往 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

### 2. 安装 MongoDB

#### Windows 下安装 MongoDB：

1. 访问 [MongoDB 官方下载页面](https://www.mongodb.com/try/download/community)。
2. 选择 Community Server，下载并安装。
3. 安装完成后，启动 MongoDB 服务：
   - 可通过“服务”管理器启动 `MongoDB` 服务，或在命令行输入：
     ```powershell
     net start MongoDB
     ```
4. 默认端口为 27017。

#### Mac/Linux 下安装 MongoDB：

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
├── pc/                # 前端代码目录
└── server/            # 服务端代码目录
		├── app.js         # 服务端入口
		├── package.json   # 服务端依赖
		├── config/
		│   └── db.js      # 数据库配置
		├── controllers/
		│   └── userController.js
		├── middlewares/
		│   └── auth.js
		├── models/
		│   └── User.js
		├── routes/
		│   ├── hotels.js
		│   └── users.js
		└── test/
				└── login.http
```

---

## 安装依赖

进入 server 目录，安装依赖：

```bash
cd server
npm install
```

---

## 配置数据库

- 默认配置在 `server/config/db.js`，如需修改数据库地址，请编辑该文件。
- 确保 MongoDB 服务已启动。

---

## 启动服务端

在 `server` 目录下运行：

```bash
npm start
```

默认监听端口为 3000。
