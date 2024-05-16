import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import routerGuard from '../auth/guards/routerGuard'
const { requireAuth } = routerGuard()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/organizations',
      name: 'Organizations',
      component: () => import('../views/OrganizationsView.vue'),
      beforeEnter: requireAuth
    },

    {
      path: '/currentProject',
      name: 'CurrentProject',
      component: () => import('../views/CurrentProjectView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/user-settings',
      name: 'user-settings',
      component: () => import('../views/UserSettingsView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue')
    }
  ]
})

export default router
