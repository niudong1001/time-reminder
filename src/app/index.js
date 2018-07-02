import Vue from 'vue'
import App from "./App.vue"
import router from './router'
import ElementUI from 'element-ui'
import './styles/styles.scss'
import Countdown from "./components/Countdown"

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component("count-down", Countdown)

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  render: h => h(App)
})
