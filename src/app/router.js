import Vue from 'vue'
import Router from 'vue-router'
import Tasks from './components/Tasks'
import Task from './components/Task'
import His from './components/History'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path: '/Tasks',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/Task/:taskId',
      name: 'Task',
      component: Task
    },
    {
      path: '/History',
      name: 'History',
      component: His
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        if (to.query && to.query.route) {
          next(to.query.route)
        } else {
          next('/Tasks')
        }
      }
    }
  ]
})
