// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import ImageUpload from '@/components/ImageUpload.vue'

const routes = [
  { path: '/', component: LandingPage },
  { path: '/upload', component: ImageUpload }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
