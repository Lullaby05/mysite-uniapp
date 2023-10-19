import App from './App'
import module from './ajax/api/index.js'
import userRuleMixin from './common/rulesMixin.js'
import commonMixin from './common/commonMixin.js'
import store from './store/index.js'
import {router,RouterMount} from './router.js'  //路径换成自己的

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
Vue.prototype.$http = module // 请求合集挂载到全局
Vue.use(userRuleMixin)
Vue.use(commonMixin)
Vue.use(router)

App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,router,'#app')
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
