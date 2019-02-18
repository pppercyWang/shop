// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
//分页组件
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
// or with options
Vue.use(VueLazyload, {
  loading: '../static/loading-svg/loading-bars.svg',
})
Vue.use(infiniteScroll)
Vue.config.productionTip = false
//全局定义金额过滤器
Vue.filter("currency",currency)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
