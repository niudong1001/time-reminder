import Vue from 'vue'
import App from "./App.vue"
import router from './router'
import store from "./store"
import ElementUI from 'element-ui'
import './styles/styles.scss'
import Countdown from "./components/Countdown"

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component("count-down", Countdown)

// 实例化Vue前加载数据
import { Loading } from 'element-ui';
let loadingInstance = Loading.service({
  text:"Loading data"
});
store.dispatch('loadTasks',()=>{
  loadingInstance.close();
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}) 


