import Vue from 'vue'
import Router from 'vue-router'
import TodayTasks from './components/TodayTasks'
import Task from './components/Task'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path: '/TodayTasks',
      name: 'TodayTasks',
      component: TodayTasks
    },
    {
      path: '/Task',
      name: 'Task',
      component: Task
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        if (to.query && to.query.route) {
          next(to.query.route)
        } else {
          next('/TodayTasks')
        }
      }
    }
  ]
})
