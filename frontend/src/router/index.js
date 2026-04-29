import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import AuthView from '../views/AuthView.vue'
import SearchView from '../views/SearchView.vue'
import JournalView from '../views/JournalView.vue'

const routes = [
  { path: '/', redirect: '/journal' },
  { path: '/auth', component: AuthView },
  {
    path: '/search',
    component: SearchView,
    meta: { requiresAuth: true },
  },
  {
    path: '/journal',
    component: JournalView,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard — redirect to /auth if not logged in
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return '/auth'
  }
})

export default router