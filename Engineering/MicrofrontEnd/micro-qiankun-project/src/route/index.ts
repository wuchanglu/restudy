import { EventType } from '../types'
import {
  runBoostrap,
  runBeforeLoad,
  runMounted,
  runUnmounted,
} from '../lifeCycle'
import { getAppListStatus } from '../utils'

const capturedListeners: Record<EventType, Function[]> = {
  hashchange: [],
  popstate: [],
}

// 劫持和 history 和 hash 相关的事件和函数
// 然后我们在劫持的方法里做一些自己的事情
// 比如说在 URL 发生改变的时候判断当前是否切换了子应用

const originalPush = window.history.pushState
const originalReplace = window.history.replaceState

let historyEvent: PopStateEvent | null = null

let lastUrl: string | null = null

export const reroute = (url: string) => {
  // 主应用生命周期
  if (url !== lastUrl) {
    // 处理生命周期
    // 开始讲解生命周期状态 AppStatus
    // 路由匹配到应用后 需要获取当前生命周期的状态 创建utils getAppListStatus
    const { actives, unmounts } = getAppListStatus()

    Promise.all(
      //先卸载之前的应用
      unmounts
        .map(async (app) => {
          await runUnmounted(app)
        })
        .concat(
          // 执行对应生命周期
          // 开始写生命周期逻辑
          actives.map(async (app) => {
            await runBeforeLoad(app)
            await runBoostrap(app)
            await runMounted(app)
          })
        )
    ).then(() => {
      callCapturedListeners()
    })
  }
  lastUrl = url || location.href
}

const handleUrlChange = () => {
  reroute(location.href)
}

export const hackRoute = () => {
  window.history.pushState = (...args) => {
    originalPush.apply(window.history, args)
    historyEvent = new PopStateEvent('popstate')
    args[2] && reroute(args[2] as string)
  }
  window.history.replaceState = (...args) => {
    originalReplace.apply(window.history, args)
    historyEvent = new PopStateEvent('popstate')
    args[2] && reroute(args[2] as string)
  }

  window.addEventListener('hashchange', handleUrlChange)
  window.addEventListener('popstate', handleUrlChange)

  // 不干扰原本事件处理逻辑
  window.addEventListener = hackEventListener(window.addEventListener)
  window.removeEventListener = hackEventListener(window.removeEventListener)
}

const hasListeners = (name: EventType, fn: Function) => {
  return capturedListeners[name].filter((listener) => listener === fn).length
}
// 手写事件代理
const hackEventListener = (func: Function): any => {
  return function (name: string, fn: Function) {
    if (name === 'hashchange' || name === 'popstate') {
      if (!hasListeners(name, fn)) {
        capturedListeners[name].push(fn)
        return
      } else {
        capturedListeners[name] = capturedListeners[name].filter(
          (listener) => listener !== fn
        )
      }
    }
    // 执行原有事件的监听
    return func.apply(window, arguments)
  }
}

export function callCapturedListeners() {
  if (historyEvent) {
    Object.keys(capturedListeners).forEach((eventName) => {
      const listeners = capturedListeners[eventName as EventType]
      if (listeners.length) {
        listeners.forEach((listener) => {
          // @ts-ignore
          listener.call(this, historyEvent)
        })
      }
    })
    historyEvent = null
  }
}

export function cleanCapturedListeners() {
  capturedListeners['hashchange'] = []
  capturedListeners['popstate'] = []
}
