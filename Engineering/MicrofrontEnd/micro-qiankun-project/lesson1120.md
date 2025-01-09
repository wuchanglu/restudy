# 微前端（下）

## 课程大纲

- qiankun 整体流程
- DIY 微前端核心能力

## qiankun 整体运行流程

见图片

## DIY 微前端核心能力

### 应用注册 registerMicroApps(apps, lifeCycles?)

### 监听路由变化

● hash 模式
● history 模式

如何实现前端路由？

- hash 实现
  hashchange

```
// 监听路由变化
window.addEventListener('hashchange', onHashChange)
```

- history 实现
  history 提供了 pushState 和 replaceState 两个方法

  1. 监听浏览器前进后退改变 URL
     window.addEventListener("popstate", onPopState);

  2. 拦截 pushState/replaceState 的调用

见图片

qiankun 路由劫持
● 路由变化时匹配子应用
● 执行子应用生命周期
● 加载子应用
