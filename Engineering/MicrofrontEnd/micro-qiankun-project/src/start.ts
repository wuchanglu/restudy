import { setAppList, getAppList } from './appList/index'
import { setLifecycle } from './lifeCycle/index'
import { IAppInfo, ILifecycle, IInternalAppInfo, EAppStatus } from './types'
import { hackRoute, reroute } from './route'
import { prefetch } from './utils'

export const registerMicroApps = (
  appList: IAppInfo[],
  lifecycles?: ILifecycle
) => {
  appList && setAppList(appList)
  lifecycles && setLifecycle(lifecycles)
}

export const start = () => {
  const list = getAppList()

  if (!list.length) {
    throw new Error('请先注册应用')
  }

  hackRoute()
  reroute(window.location.href)

  list.forEach((app) => {
    if ((app as IInternalAppInfo).status === EAppStatus.NOT_LOADED) {
      prefetch(app as IInternalAppInfo)
    }
  })
}

// 1. 初始化函数
// 2. 监听路由变化 开始讲解如何监听路由变化
