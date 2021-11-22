class VueRouter {

}

VueRouter.install = function(Vue) {
  console.log('Vue11', Vue)

  Vue.mixin({
    beforeCreated() {
      if(this.$options && this.$options.router) { // 如果是根组件
        this._root = this // //把当前实例挂载到_root上
        this._router = this.$options.router
      } else { // 如果是子组件
        this._root = this.$parent && this.$parent._root
      }

      // 数据代理
      Object.defineProperty(this, '$router', {
        get() {
          return this._root._router
        }
      })
    }
  })

  // 然后再通过传进来的Vue创建两个组件router-link和router-view
  Vue.component('router-link', {
    render(h) {
      return h('a', {}, '首页')
    }
  })

  Vue.component('router-view', {
    render(h) {
      return h('h1', {}, '首页视图')
    }
  })
}

export default VueRouter