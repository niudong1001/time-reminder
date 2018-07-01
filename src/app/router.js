import Vue from 'vue'
import Router from 'vue-router'
import TodayTasks from './components/TodayTasks'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path: '/',
      name: 'TodayTasks',
      component: TodayTasks
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        if (to.query && to.query.route) {
          next(to.query.route)
        } else {
          next('/')
        }
      }
    }
  ]
})
