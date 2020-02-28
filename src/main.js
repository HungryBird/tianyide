// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import vueClipboard from 'vue-clipboard2'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import 'vue2-animate/dist/vue2-animate.min.css'
import 'vue-orgchart/dist/style.min.css'
import { ToastPlugin, ConfirmPlugin, LoadingPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(VueAwesomeSwiper)
Vue.use(vueClipboard)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
