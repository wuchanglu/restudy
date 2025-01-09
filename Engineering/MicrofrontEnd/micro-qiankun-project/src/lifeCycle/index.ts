import { IAppInfo, IInternalAppInfo, ILifecycle, EAppStatus } from '../types'
import { loadHTML } from '../loader'

let lifeCycle: ILifecycle = {}

export const setLifecycle = (list: ILifecycle) => {
  lifeCycle = list
}

export const getLifecycle = () => {
  return lifeCycle
}

// 卸载
export const runUnmounted = async (app: IInternalAppInfo) => {
  app.status = EAppStatus.UNMOUNTING
  app.proxy.inactive()
  await app.unmount?.(app)
  app.status = EAppStatus.NOT_MOUNTED
  await runLifeCycle('unmounted', app)
}
// 初始化  可以处理全局loading
export const runBoostrap = async (app: IInternalAppInfo) => {
  // 只会执行一次
  if (app.status === EAppStatus.LOADED) {
    return app
  }
  app.status = EAppStatus.BOOTSTRAPPING
  await app.bootstrap?.(app)
  app.status = EAppStatus.NOT_MOUNTED
}

export const runMounted = async (app: IInternalAppInfo) => {
  app.status = EAppStatus.MOUNTING
  await app.mount?.(app)
  app.status = EAppStatus.MOUNTED
  await runLifeCycle('mounted', app)
}

//
export const runBeforeLoad = async (app: IInternalAppInfo) => {
  app.status = EAppStatus.LOADING
  await runLifeCycle('beforeLoad', app)

  // 需要加载应用资源
  app = await loadHTML(app)
  app.status = EAppStatus.LOADED
}

const runLifeCycle = async (name: keyof ILifecycle, app: IAppInfo) => {
  const fn = lifeCycle[name]
  if (fn instanceof Array) {
    await Promise.all(fn.map((item) => item(app)))
  } else {
    await fn?.(app)
  }
}
