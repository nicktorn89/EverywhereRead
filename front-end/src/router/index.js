import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/StartPage.vue'),
  },
  {
    path: '/signup',
    name: 'Sign up',

    component: () => import('../views/SignUp.vue'),
  },
  {
    path: '/reader',
    name: 'Reader',

    component: () => import('../views/Reader.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
