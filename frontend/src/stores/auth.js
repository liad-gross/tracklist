import { defineStore } from 'pinia'
import api from '../api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async register(email, password) {
      const res = await api.post('/auth/register', { email, password })
      this.token = res.data.token
      this.email = res.data.email
      localStorage.setItem('token', this.token)
      localStorage.setItem('email', this.email)
    },

    async login(email, password) {
      const res = await api.post('/auth/login', { email, password })
      this.token = res.data.token
      this.email = res.data.email
      localStorage.setItem('token', this.token)
      localStorage.setItem('email', this.email)
    },

    logout() {
      this.token = null
      this.email = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
    },
  },
})