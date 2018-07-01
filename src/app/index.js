import Vue from 'vue'
import App from "./App.vue"
import router from './router'
import ElementUI from 'element-ui'
import './styles/element-variables.scss'

// 单页
import TodayTasks from "./components/TodayTasks"

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  render: h => h(App)
})
