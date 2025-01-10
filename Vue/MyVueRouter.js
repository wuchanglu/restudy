// 流程
// 1. 满足 new VueRouter({mode,routes}) 要根据routes生成path=>component的映射
// 2. 执行一次当前浏览器路径初始化，根据mode做事件监听load以及 (hashchange或popstate) 
// 3. 在load里面首次获取url并以此设置当前path
// 4. 类暴露出install给Vue.use调用
// 5. 注册全局mixin.beforeCreate，如果是root就把router实例挂到this._router上，然后给router.history添加响应式。子组件就将_router指向$parent._router
// 6. 代理$router和$route的方案
// 7. 注册 router-link router-view组件(在vue-view渲染的时候触发响应式数据的effect收集，后续变更当前路径就能重新渲染)
let _Vue = null
class HistoryRoute {
    constructor() {
        this.current = null
    }
}
class MyVueRouter {
    constructor(options) {
        const { mode = 'hash', routes = [], } = options
        this.mode = mode
        this.routesMap = this.createMap(routes)
        this.histor = new HistoryRoute()
        this.init()
    }
    init() {
        if (this.mode === 'hash') {
            location.hash ? '' : (location.hash = '/');
            window.addEventListener('load', () => {
                this.histor.current = location.hash.slice(1)
            })
            window.addEventListener('hashchange', () => {
                this.histor.current = location.hash.slice(1)
            })

        } else if (this.mode === 'histor') {
            location.pathname ? '' : (location.pathname = '/');
            window.addEventListener('load', () => {
                this.histor.current = location.pathname
            })
            window.addEventListener('popstate', () => {
                this.histor.current = location.pathname
            })
        }
    }
    createMap(routes) {
        return routes.reduce((pre, current) => {
            pre[current.path] = current.component
        }, {})
    }
}
MyVueRouter.install = function (v) {
    _Vue = v;
    _Vue.mixin({
        beforeCreate() {
            if (this.$options && this.$options.router) {
                // 如果是根组件
                this._root = this; //把当前实例挂载到_root上
                this._router = this.$options.router;
                // 给当前的路径添加响应式
                _Vue.util.defineReactive(this, 'xxx', this._router.history);
            } else {
                //如果是子组件
                this._root = this.$parent && this.$parent._root;
            }
            Object.defineProperty(this, '$router', {
                get() {
                    return this._root._router;
                },
            });
            Object.defineProperty(this, '$route', {
                get() {
                    return this._root._router.history.current;
                },
            });
        },
    });
    _Vue.component('router-link', {
        props: {
            to: String,
        },
        render(h) {
            let mode = this._self._root._router.mode;
            let to = mode === 'hash' ? '#' + this.to : this.to;
            return h('a', { attrs: { href: to } }, this.$slots.default);
        },
    });
    _Vue.component('router-view', {
        render(h) {
            let current = this._self._root._router.history.current;
            let routeMap = this._self._root._router.routesMap;
            return h(routeMap[current]);
        },
    });
};

export default MyVueRouter;