<template>
  <div id="app">
    <nav v-if="auth.isLoggedIn">
      <div class="nav-inner">
        <span class="logo">TRACKLIST</span>
        <div class="nav-links">
          <router-link to="/search">Search</router-link>
          <router-link to="/journal">Journal</router-link>
        </div>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  computed: {
    auth() {
      return useAuthStore()
    },
  },
  methods: {
    logout() {
      this.auth.logout()
      this.$router.push('/auth')
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background: #f5f5f0;
  color: #333;
}

nav {
  background: #e8e8e0;
  border-bottom: 2px solid #ccc;
  padding: 12px 24px;
}

.nav-inner {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 3px;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-links a {
  text-decoration: none;
  font-size: 13px;
  color: #555;
  padding: 4px 12px;
  border: 1px solid transparent;
  border-radius: 2px;
}

.nav-links a.router-link-active {
  border-color: #333;
  color: #333;
  font-weight: bold;
}

.logout-btn {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  padding: 4px 12px;
  border: 1px solid #bbb;
  background: transparent;
  cursor: pointer;
  border-radius: 2px;
  color: #555;
}

.logout-btn:hover {
  border-color: #333;
  color: #333;
}

main {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Shared button styles */
.btn {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  padding: 8px 18px;
  border: 1.5px solid #333;
  background: #333;
  color: #fff;
  cursor: pointer;
  border-radius: 2px;
  letter-spacing: 1px;
}

.btn:hover {
  background: #555;
}

.btn.outline {
  background: transparent;
  color: #333;
}

.btn.outline:hover {
  background: #eee;
}

.btn.danger {
  border-color: #999;
  background: transparent;
  color: #999;
}

.btn.danger:hover {
  border-color: #c00;
  color: #c00;
}

.btn.small {
  padding: 4px 10px;
  font-size: 11px;
}

/* Shared input styles */
input, textarea {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  border: 1.5px solid #ccc;
  padding: 8px 12px;
  border-radius: 2px;
  width: 100%;
  background: #fff;
  color: #333;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #333;
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border: 2px solid #333;
  border-radius: 2px;
  padding: 24px;
  width: 420px;
  max-width: 95vw;
}

.modal h2 {
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.error {
  color: #c00;
  font-size: 12px;
  margin-top: 8px;
}

label {
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #888;
  display: block;
  margin-bottom: 4px;
  margin-top: 12px;
}
</style>