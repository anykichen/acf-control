# ACF上线过账系统 - 桌面端

这是一个 Electron 桌面应用，用于简化 ACF 上线过账操作。

## 功能特点

- **服务器配置**：首次启动时配置服务器地址，支持连接测试
- **用户登录**：支持"记住我"功能，下次自动登录
- **扫码上线**：极简界面，自动聚焦输入框，扫码后自动触发上线
- **声音提示**：成功/失败有蜂鸣提示
- **操作记录**：滚动显示最近 20 条操作记录
- **统计显示**：今日上线计数和总计

## 开发

```bash
# 安装依赖
npm install

# 开发模式运行
npm start
```

## 打包

```bash
# 打包成 Windows exe
npm run build
```

## 下载

从 [GitHub Actions](https://github.com/anykichen/acf-control/actions) 下载最新版本的 exe 文件。

## 配置

- 服务器地址：默认为 `https://10.201.2.40:3002`
- 配置文件保存在用户数据目录：`config.json`

## 许可证

MIT
