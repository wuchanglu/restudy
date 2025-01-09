export interface IAppInfo {
  name: string
  entry: string
  container: string
  activeRule: string
}

export type Lifecycle = (app: IAppInfo) => Promise<any>

export interface ILifecycle {
  beforeLoad?: Lifecycle | Lifecycle[]
  mounted?: Lifecycle | Lifecycle[]
  unmounted?: Lifecycle | Lifecycle
}

// 应用生命状态
// 包含是否找到应用状态 每个生命周期包含前中后三个状态
export enum EAppStatus {
  NOT_FOUND = 'NOT_FOUND',
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  BOOTSTRAPPING = 'BOOTSTRAPPING',
  NOT_MOUNTED = 'NOT_MOUNTED',
  MOUNTING = 'MOUNTING',
  UNMOUNTED = 'UNMOUNTED',
  MOUNTED = 'MOUNTED',
  UNMOUNTING = 'UNMOUNTING',
}

export interface IInternalAppInfo extends IAppInfo {
  status: EAppStatus
  bootstrap?: Lifecycle
  mount?: Lifecycle
  unmount?: Lifecycle
  proxy: any
}

export type EventType = 'hashchange' | 'popstate'
