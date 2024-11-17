<template><p>qqq</p></template>
<script setup lang="ts">
</script>
<script lang="ts">
import type { ReactiveEffect, TrackOpTypes, TriggerOpTypes } from "vue";
type DebuggerEvent = {
  effect: ReactiveEffect;
  target: object;
  type: TrackOpTypes /* 'get' | 'has' | 'iterate' */;
  key: any;
};
type DebuggerEventTrigger = {
  effect: ReactiveEffect;
  target: object;
  type: TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */;
  key: any;
  newValue?: any;
  oldValue?: any;
  oldTarget?: Map<any, any> | Set<any>;
};
export default {
  data() {
    return {};
  },
  /**
   * 组件init之前调用，此时还无法读取到组件data等
   */
  beforeCreate() {
    console.log("beforeCreat");
  },
  /**
   * 组件init之后
   */
  created() {
    console.log("created");
  },
  /**
   * 是否编译template和挂载el判断处理之后，组件被挂载之前调用
   */
  beforeMount() {
    console.log("beforeMount");
  },
  /**
   * 组件首次render 渲染DOM并挂载之后执行
   */
  mounted() {
    console.log("mounted");
  },
  /**
   * 响应式状态更改，dom更新前调用
   */
  beforeUpdate() {},
  /**
   * 响应式状态更改，dom更新后调用
   */
  updated() {},
  /**
   * 组件被卸载之前调用
   */
  beforeUnmount() {},
  /**
   * 组件被卸载之后调用
   */
  unmounted() {},
  /**
   * 捕获了后代组件传递的错误时调用，来源如下
   * 
        组件渲染
        事件处理器
        生命周期钩子
        setup() 函数
        侦听器
        自定义指令钩子
        过渡钩子
   */
  errorCaptured() {},
  /**
   * keepalive组件插入到dom时调用
   */
  activated() {},
  /**
   * keepalive组件从dom中移除的时候调用
   */
  deactivated() {},

  /**
   * 在一个响应式依赖被组件的渲染作用追踪后调用。(响应式依赖被组件读的时候执行)
   * @param { type, key, target, effect }
   */
  renderTracked(e: DebuggerEvent) {
    const { type, key, target, effect } = e;
    console.log(type, key, target, effect);
  },
  /**
   * 在一个响应式依赖被组件触发了重新渲染之后调用。(响应式依赖被修改时候执行)
   * @param { type, key, target, effect }
   */
  renderTriggered(e: DebuggerEventTrigger) {
    const { type, key, target, effect, newValue, oldValue, oldTarget } = e;
    console.log(type, key, target, effect, newValue, oldValue, oldTarget);
  },
};
</script>
