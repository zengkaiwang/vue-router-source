class VueRouter {

}

VueRouter.install = function(Vue) {
  console.log('Vue11', Vue)

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