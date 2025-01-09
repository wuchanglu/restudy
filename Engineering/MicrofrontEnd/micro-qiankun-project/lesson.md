# 微前端（上）

微前端课程分为两部分

1. 微前端背景 解决的问题 微前端特点
2. 明天讲解核心实现原理，并手把手从 0-1 实现简单的微前端框架。

# 课程大纲

1. 微前端背景
2. 现在 web 应用面临的问题
3. 微前端的价值
4. 微前端应用具备哪些能力
5. 微前端解决方案有哪些
6. 基于 qiankun 的实践

# 1 微前端背景

2014 年 微服务
主要思路：

- 将应用 分解 为小的、互相连接的微服务
- 每个微服务都有自己的业务逻辑和适配器，不同的微服务，可以使用 不同的技术 去实现。
- 使用 统一的网关 进行调用

把微服务的概念应用到前端， 前端微服务/微前端服务 就诞生了，简称其为微前端。

2016 年 ThoughtWorks 提出微前端的概念。
2018 年: 第一个微前端工具 single-spa 开源。
2019 年: 基于 single-spa 的 qiankun 问世。

2020 年：Module Federation(webpack5）

## 2 微前端是什么？

见图片

微前端是一种架构风格，它允许可独立交付的前端应用程序被组合成一个更大的整体。

## 3 现在 web 应用面临的问题

● DX(developer experience)
○ 业务领域的代码库不够独立和高度可重用
○ 相同的产品功能由多个团队开发 / 产品功能难以保持统一
○ 新的产品理念无法在不同的应用中快速复用 / 实现
○ 快速迭代新子业务 / 干净移除将被淘汰的子业务
● UX(user experience)
○ 性能体验
○ 页面跳转和用户体验问题

## 3 微前端特点

1. 技术栈无关
2. 独立开发/部署
3. 增量升级
4. 独立运行时
5. 提升效率

## 4 微前端价值

见图片

## 5 微前端应用具备哪些能力

见图片

## 6 微前端解决方案有哪些

使用 HTTP 服务器的路由来重定向多个应用

使用 nginx 转发到不同应用

## 基于 iframe 完全隔离的方案

优点：

1. 非常简单，无需任何改造
2. 完美隔离，JS、CSS 都是独立的运行环境
3. 不限制使用，页面上可以放多个 iframe 来组合业务

缺点：

1. 每次进来都要加载，状态不能保留
2. 完全的隔离导致与子应用的交互变得极其困难，无法与主应用进行资源共享
3. iframe 中的弹窗无法突破其本身，比如子应用里有一个 Modal，显示的时候只能在那一小块地方展示，不能全屏展示
4. 整个应用全量资源加载，加载太慢

## EMP 基于 webpack module federation

见图片

## 使用纯的 Web Components 构建应用

见图片

google 推出的浏览器的原生组件

- Custom elements（自定义元素）
- Shadow DOM（影子 DOM）
- HTML templates（HTML 模板）

优点

1. 技术栈无关
2. 独立开发
3. 应用间隔离

缺点

1. 浏览器兼容性

## 业界主流微前端框架

### 基于 single-spa 路由劫持方案

single-spa：
● 加载微应用（加载方法还得用户自己来实现）
● 管理微应用的状态（初始化、挂载、卸载）

single-spa 又约定应用脚本包含以下生命周期：

- load
- bootstrap
- mount
- unmount
- unload

见图片 生命周期图

### qiankun

见图片

https://qiankun.umijs.org/zh/api

微前端如何接入

JS 沙箱 CSS 样式隔离
通过 import-html-entry 包解析 HTML 获取资源路径，然后对资源进行解析、加载。
通过对执行环境的修改，它实现了 JS 沙箱、样式隔离 等特性。

### import-html-entry

- importEntry
- importHTML
- processTpl
- getEmbedHTML
- getExternalScripts
- getExternalStyleSheets
- execScripts 脚本执行器，让指定的脚本(scripts)在规定的上下文环境中执行
