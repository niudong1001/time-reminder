import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      todayTasks:[],  // 今日的任务
      allTasks:[]  // 历史所有任务
    },
    mutations: {
      addTask(state, task) {
        state.todayTasks.push(task);
      }
    }
})