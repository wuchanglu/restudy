import { IAppInfo, IInternalAppInfo, EAppStatus } from '../types'

let appList: IAppInfo[] = []

export const setAppList = (list: IAppInfo[]): void => {
  appList = list
  appList.map((app) => {
    ;(app as IInternalAppInfo).status = EAppStatus.NOT_LOADED
  })
}

export const getAppList = () => appList
