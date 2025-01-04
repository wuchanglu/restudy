# 目标

## 1. 实现基础的基于 webpack 的 react+ts+less+css-module 的项目

1. ts js 的编译，支持 es6 的各种写法
2. less 和 css-module 的编译
3. 热更新
4. react 的编译

## 2. 自定义 loader

创建名为 comment-require-loader，作用是把 JavaScript 代码中的注释语法

```js
// @require '../style/index.css'
转为;
require("../style/index.css");
```

## 3. 自定义 plugin

实现一个插件，名叫 EndWebpackPlugin，作用是在 Webpack 即将退出时再附加一些额外的操作，例如在 Webpack 成功编译和输出了文件后执行发布操作把输出的文件上传到服务器。 同时该插件还能区分 Webpack 构建是否执行成功。

## 4. 进行webpack优化
