import Vue from 'vue'
import Vuex from 'vuex'
import storage from "../ext/storage"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      todayTasks:[],  // 今日的任务
      allTasks:[],  // 历史所有任务
      loadTodayTasksOk:false,  // 加载今日任务OK
      loadAllTasksOk:false  // 加载所有任务OK
    },
    // 更新state的唯一方法，不可以包含异步操作
    mutations: {
      addTodayTask(state, task) {
        state.todayTasks.push(task);
      },
      updateTodayTask(state, taskId, task) {
        let tasks = state.todayTasks;
        let l = tasks.length;
        for(let i=0; i<l;i++){
            if (tasks[i]["id"] == taskId){
                tasks.splice(i,1,task);
            }
        }
      },
      addAllTask(state, task) {
        state.allTasks.push(task);
      },
      setTTask(state, ok){
        state.loadTodayTasksOk = ok;
      },
      setATask(state, ok){
          state.loadAllTasksOk = ok;
      }
    },
    // 可以包含异步操作，调用mutations
    actions:{
        loadTodayTasks({commit}, callback) {
            storage.getSyncStorage("timeReminder_todayDB", (v)=>{
                // console.log(v);
                let dd = v["timeReminder_todayDB"];
                if(dd){
                    let dbToday = JSON.parse(dd);
                    if(dbToday){
                        dbToday.forEach(element => {
                            commit("addTodayTask", element)
                        });
                    }
                }
                commit("setTTask", true)  // ok
                // console.log("1")
                if(callback){
                    callback()
                }
            })
        },
        // 可能很慢
        loadAllTasks({commit}, callback) {
            storage.getSyncStorage("timeReminder_allDB", (v)=>{
                // console.log(v);
                let dd = v["timeReminder_allDB"];
                if(dd){
                    let dbAll = JSON.parse(v["timeReminder_allDB"]);
                    if(dbAll){
                        dbAll.forEach(element => {
                            commit("addAllTask", element)
                        });
                    }
                }
                commit("setATask", true)  // ok
                // console.log("1")
                if(callback){
                    callback()
                }
            })
        },
        // 不一定需要load好使用
        addTodayTask({commit}, task){
            // console.log(task)
            if(task){
                // console.log("2")
                commit("addTodayTask",task);
                // console.log("3");
            }
        },
        // 关闭window调用
        saveTodayTasks({getters}){
            let dbToday = getters.todayTasks
            // let dbAll = getters.allTasks;
            let dataObj = {
                "timeReminder_todayDB":JSON.stringify(dbToday),
                // "timeReminder_allDB":JSON.stringify(dbAll)
            }
            storage.setSyncStorage(dataObj)
        },
        rmAllTasks(){
            storage.rmSyncStorage(["timeReminder_todayDB", "timeReminder_allDB"])
        }
    },
    getters:{
        todayTasks:state=>{
            return state.todayTasks;
        },
        allTasks:state=>{
            return state.allTasks;
        }
    }
})