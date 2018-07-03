import Vue from 'vue'
import App from "./App.vue"
import router from './router'
import store from "./store"
import ElementUI from 'element-ui'
import './styles/styles.scss'
import Countdown from "./components/Countdown"
import VueContextMenu from './components/ContextMenu'  // https://github.com/xunleif2e/vue-context-menu

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component("count-down", Countdown)
Vue.component("context-menu", VueContextMenu)

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


