import Vue from 'vue'
import Vuex from 'vuex'
import storage from "../ext/storage"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    //   allTasks:[],  // 今日的任务
      allTasks:[],  // 历史所有任务
    //   loadallTasksOk:false,  // 加载今日任务OK
      loadAllTasksOk:false  // 加载所有任务OK
    },
    // 更新state的唯一方法，不可以包含异步操作
    mutations: {
      addTask(state, task) {
        state.allTasks.push(task);
        // console.log(state.allTasks)
      },
      updateTask(state, _task) {
        let {taskId, task} = _task;
        // console.log(taskId, task);
        let tasks = state.allTasks;
        let l = tasks.length;
        for(let i=0; i<l;i++){
            if (tasks[i] && tasks[i]["id"] == taskId){
                // console.log(tasks[i], task)
                tasks[i]["finished"] = task["finished"];  // 如果还要替换其他属性请修改
                // tasks.splice(i,1,task);
            }
        }
      }
    },
    // 可以包含异步操作，调用mutations
    actions:{
        loadTasks({commit}, callback) {
            storage.getSyncStorage("timeReminder_allDB", (v)=>{
                // console.log(v);
                let dd = v["timeReminder_allDB"];
                if(dd){
                    let dbToday = JSON.parse(dd);
                    if(dbToday){
                        dbToday.forEach(element => {
                            commit("addTask", element)
                        });
                    }
                }
                if(callback){
                    callback()
                }
            })
        },
        // 不一定需要load好使用
        addTask({commit}, task){
            // console.log(task)
            if(task){
                // console.log("2")
                commit("addTask",task);
                // console.log("3");

            }
        },
        // 关闭window调用
        saveTasks({getters}){
            // let dbToday = getters.allTasks;
            let dbAll = getters.allTasks;
            // console.log(dbAll)
            let dataObj = {
                "timeReminder_allDB":JSON.stringify(dbAll),
                // "timeReminder_allDB":JSON.stringify(dbAll)
            }
            storage.setSyncStorage(dataObj)
        },
        rmTasks(){
            storage.rmSyncStorage(["timeReminder_allDB"])
        }
    },
    getters:{
        allTasks:state=>{
            return state.allTasks;
        }
    }
})