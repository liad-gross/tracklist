<template>
  <div class="auth-wrapper">
    <div class="auth-box">
      <div class="auth-logo">TRACKLIST</div>
      <div class="auth-tagline">YOUR LISTENING JOURNAL</div>

      <div class="tab-bar">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">LOG IN</button>
        <button :class="{ active: mode === 'register' }" @click="mode = 'register'">REGISTER</button>
      </div>

      <form @submit.prevent="submit">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="you@email.com" required />

        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" required />

        <label v-if="mode === 'register'">Confirm Password</label>
        <input
          v-if="mode === 'register'"
          v-model="confirmPassword"
          type="password"
          placeholder="••••••••"
        />

        <p v-if="error" class="error">{{ error }}</p>

        <button class="btn" style="width:100%; margin-top: 16px;" type="submit" :disabled="loading">
          {{ loading ? 'Please wait...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AuthView',
  data() {
    return {
      mode: 'login',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      loading: false,
    }
  },
  methods: {
    async submit() {
      this.error = ''
      if (this.mode === 'register' && this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match'
        return
      }
      this.loading = true
      try {
        const auth = useAuthStore()
        if (this.mode === 'login') {
          await auth.login(this.email, this.password)
        } else {
          await auth.register(this.email, this.password)
        }
        this.$router.push('/search')
      } catch (err) {
        this.error = err.response?.data?.message || 'Something went wrong'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f0;
}

.auth-box {
  width: 360px;
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 2px;
  padding: 36px 32px;
}

.auth-logo {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 5px;
  margin-bottom: 4px;
}

.auth-tagline {
  text-align: center;
  font-size: 10px;
  letter-spacing: 2px;
  color: #aaa;
  margin-bottom: 28px;
}

.tab-bar {
  display: flex;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.tab-bar button {
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  padding: 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 1px;
  color: #aaa;
  cursor: pointer;
}

.tab-bar button.active {
  color: #333;
  border-bottom-color: #333;
  font-weight: bold;
}

form {
  display: flex;
  flex-direction: column;
}
</style>