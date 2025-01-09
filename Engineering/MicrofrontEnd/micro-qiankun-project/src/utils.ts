import { match } from 'path-to-regexp'
import { getAppList } from './appList'
import { IInternalAppInfo, EAppStatus } from './types'
import { importEntry } from 'import-html-entry'
import { getCache, setCache } from './cache'

// 根据注册阶段传入的appList
// 匹配当前路由 path-to-regexp
// 返回对应的状态
export const getAppListStatus = () => {
  // 需要渲染的应用列表
  const actives: IInternalAppInfo[] = []
  // 需要卸载的
  const unmounts: IInternalAppInfo[] = []

  // 需要注册的
  const list = getAppList() as IInternalAppInfo[]
  // 路由匹配
  list.forEach((app) => {
    //当前应用activeRule 是否和当前路由进行匹配 匹配的话进行渲染
    const isActive = match(app.activeRule, { end: false })(location.pathname)
    switch (app.status) {
      case EAppStatus.NOT_LOADED:
      case EAppStatus.LOADING:
      case EAppStatus.LOADED:
      case EAppStatus.BOOTSTRAPPING:
      case EAppStatus.NOT_MOUNTED:
        isActive && actives.push(app)
        break
      case EAppStatus.MOUNTED:
        !isActive && unmounts.push(app)
        break
    }
  })

  return { actives, unmounts }
}

export const fetchResource = async (url: string, appName: string) => {
  if (getCache(appName, url)) return getCache(appName, url)
  const data = await fetch(url).then(async (res) => await res.text())
  setCache(appName, url, data)
  return data
}

export function getCompletionURL(src: string | null, baseURI: string) {
  if (!src) return src
  if (/^(https|http)/.test(src)) return src

  return new URL(src, getCompletionBaseURL(baseURI)).toString()
}

export function getCompletionBaseURL(url: string) {
  return url.startsWith('//') ? `${location.protocol}${url}` : url
}

export const prefetch = async (app: IInternalAppInfo) => {
  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(
      app.entry
    )
    requestIdleCallback(getExternalStyleSheets)
    requestIdleCallback(getExternalScripts)
  })
}
