# vue3 新特性

## vue3 和 vue2 的响应式对比

### vue2

```javascript
const initData = {
  value: 1,
};
const data = {};
Object.keys(initData).forEach((key) => {
  Object.defineProperty(data, key, {
    get() {
      console.log("监听到了读:", key);
      return initData[key];
    },
    set(value) {
      console.log("监听到了写:", key, value);
      return (initData[key] = value);
    },
  });
});
console.log(data.value); // 监听到了读
data.value = 2; //监听到了写

// 新增属性
initData.value2 = 12;
console.log(data.value2); //监听不到读
data.value2 = 2; //监听不到写
```

- 原因：通过遍历对象的所有属性来进行监听，后期再去新增属性那么就无法监听到
- 解决办法: 通过 Vue.set(target,key,value) 或者 this.$set(target,key,value) 往响应式对象中添加一个属性，确保新的属性同样具有响应式，并且也能够触发我们视图的更新
- set 的原理
  ```javascript
  //target为 基础类型、undefined、null 直接报错
  //target为 数据，调用数组api，vue已经重写了数据的api,通过重写的方法才能触发响应式的更新
  //target为 对象，属性原来已存在于对象中直接更新。然后判断是否是响应式对象，不是的话新增属性然后返回value。是响应式对象，进行依赖收集，触发更新视图
  ```

### vue3

```javascript
const initData = { value: 1 };
const proxy = new Proxy(initData, {
  get(target, key, receiver) {
    console.log("访问了:", target, key, receiver);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log("设置了:", target, key, value, receiver);
    return Reflect.set(target, key, value, receiver);
  },
});
console.log(proxy.value); // 访问了: {value: 1} value Proxy(Object) {value: 1}
proxy.value = 2; //设置了: {value: 1} value 2 Proxy(Object) {value: 1}
proxy.value2 = 12; //设置了: {value: 1} value2 12 Proxy(Object) {value: 1}
console.log(proxy.value2); //访问了: {value: 1} value2 Proxy(Object) {value: 1}
```

- 新增还是减少属性都能监听到修改，新增属性的读取也能正确监听，用 proxy 可以直接省去$set 的兼容,数组的变动也可以监听到了

## 特性列举

### 1. 多实例

vue2 new Vue().mount('#app')
vue3 createApp().mount('#app')

### 2. composition api

vue2 option 对于长期维护还是有缺陷的，单文件的代码量容易变多，使用 mixin 来进行处理的话容易出现 命名冲突、如果对 mixin 的对象不了解的话合并可能会不符合自己的预期，冷不丁冒出来一个方法不知道是哪个文件导入进来的

`setup 提供composition的统一入口 `

- props 用来接受 props 数据响应
- context
  - js 对象
  - this.$xxxd
  - attrs
  - emit
  - slots 插槽
  - expose

`具体api`

1. ref 创建一个响应式数据对象 返回一个.value 属性，让我们访问具体数据
2. shallowRef 浅层响应式
3. isRef(target) 判断是否是一个 ref 数据对象，判断对象里面是否有 ref 实例的属性标签
4. reactive 将传入的对象变成响应式内容，返回一个 proxy 对象
5. shallowReactive 浅层响应式
6. readonly 把数据变成只读

`生命周期钩子`
Vue/vue-demo-code/src/components/LifeCycle.vue

`异步组件`
defineAsyncComponent 搭配 import('path') 实现组件异步加载，代码拆分

`自定义指令`

```js
app.directive('xxx',{
    beforeMount(el,binding){},
    mounted(el,binding){},
    beforeUpdate(el,binding){},
    updated(el,binding){},
    beforeUnmount(el,binding){},
    unmounted(el,binding){},
})
<comp v-xxx:[bindingArg]="msg"></comp>
```

`teleport 传送组件` 

将一个字节点渲染到父节点以外的地方  
```html
<!-- to里面放置css选择器语法字符串 或者 目标dom对象 -->
<telport to="#target-dom">
    <my-comp></my-comp>
</telport>
```

`自定义hook`
useXXX.ts 文件名 useYYY的函数名，以此来表明是一个自定义hook。在hook里面可以使用vue3提供的各种composition api，以此来将公共代码抽离封装。这种处理方式比mixin具有更高的代码可读性和可维护性

#### ref vs reactive

- ref 一般用在基本类型，reactive 用在复杂类型
- ref 通过.value 来访问数据，reactive 则不需要
- ref 可以直接修改.value，reactive 不能直接设置变量，只能去一个个属性的修改
- ref 的底层实现也走了 reactive
