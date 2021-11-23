class HistoryRoute {
  constructor() {
    this.current = null
  }
}
class VueRouter {
  constructor(options) {
    this.mode = options.mode || 'hash'
    this.routes = options.routes || [] // //你传递的这个路由是一个数组表
    this.routesMap = this.createMap(this.routes)
    console.log(this.routesMap)

    this.history = new HistoryRoute()
    this.init()
  }

  init() {
    if (this.mode == 'hash') {
      // 先判断用户打开时,有没有hash值,没有则跳转到#
      location.hash ? '' : (location.hash = '/')
      window.addEventListener('load', () => {
        this.history.current = location.hash.slice(1)
      })
      window.addEventListener('hashchange', () => {
        this.history.current = location.hash.slice(1)
      })
    } else {
      location.pathname ? '' : (location.pathname = '/')
      window.addEventListener('load', () => {
        this.history.current = location.pathname
      })
      window.addEventListener('popstate', () => {
        this.history.current = location.pathname
      })
    }
  }

  // 转换成key：value的格式
  createMap(routes) {
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component
      return pre
    }, {})
  }
}

VueRouter.install = function (Vue) {
  Vue.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) {
        // 如果是根组件
        this._root = this // //把当前实例挂载到_root上
        this._router = this.$options.router

        // 利用了Vue提供的API：defineReactive，使得this._router.history对象得到监听。
        // Vue.util.defineReactive(this._router.history,"current",this._router.history.current)
        Vue.util.defineReactive(this, 'ccc', this._router.history)
      } else {
        // 如果是子组件
        this._root = this.$parent && this.$parent._root
      }

      // 数据代理, 实现$router, 达到每个组件中能使用 this.$router
      Object.defineProperty(this, '$router', {
        get() {
          return this._root._router
        },
      })

      // 实现$route, 达到每个组件中能使用this.$route
      Object.defineProperty(this, '$route', {
        get() {
          return this._root._router.history.current
        },
      })
    },
  })

  // 然后再通过传进来的Vue创建两个组件router-link和router-view
  Vue.component('router-link', {
    render(h) {
      return h('a', {}, '首页')
    },
  })

  // 完善router-view组件
  Vue.component('router-view', {
    render(h) {
      const current = this._self._root._router.history.current
      const routeMap = this._self._root._router.routesMap
      return h(routeMap[current])
    },
  })
}

export default VueRouter
