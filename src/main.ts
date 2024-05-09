import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
import './index.css'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
})

app.use(vuetify)

app.use(createPinia())
app.use(router)
const authStore = useAuthStore()
authStore.checkLogin()
app.mount('#app')
