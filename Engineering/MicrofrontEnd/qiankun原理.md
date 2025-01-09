# qiankun

## 流程

```js
export const MicroApps = [
  {
    name: "vue1App",
    entry: "//localhost:3001",
    container: "#micro-container",
    activeRule: "/app-vue1",
  },
  {
    name: "vue2App",
    entry: "//localhost:3002",
    container: "#micro-container",
    activeRule: "/app-vue2",
  },
];
registerMicroApps(MicroApps);
```

1. 执行 registerMicroApps(MicroApps) 匹配 url 路径找到对应的 entry。
2. 使用 entry 路径 调用 fetch 获取 html 文本内容，正则找出里面的 script，css，存储内容到数组里面。注释掉标签代码
3. 通过 shadowdom 加载渲染 html 内容。不会渲染 html 标签，并且会模拟出 qiankun-head 标签
4. 通过 往 shadowdom 里面的 qiankun-head 标签 applendChild 方式插入样式标签(css 内容之前已经存储到数组里面了)
5. 根据浏览器支持度生成新的执行作用域对象，es6 的话用 proxy，否则就深拷贝 window(此时作用域对象会有一些框架所需属性如 **POWERED_BY_QIANKUN**)
6. 下载 script 代码，通过 eval 来执行再次处理过的代码，再次处理过的代码主要是 `with(proxyWindow){${realCode}}`  
7. 上述过程为初始化的过程，后续会进行数据缓存，并且尽量复用缓存数据  

