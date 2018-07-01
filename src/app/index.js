import Vue from 'vue'
import root from './root.vue'
import ElementUI from 'element-ui'
import './element-variables.scss'

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({ // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
})
