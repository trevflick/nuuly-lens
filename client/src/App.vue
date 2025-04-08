<template>
  <div class="app-layout">
    <StickyHeader />

    <transition name="fade" mode="out-in">
      <div class="page-content">
        <router-view />
      </div>
    </transition>

    <SiteFooter />
  </div>
</template>

<script setup>
import StickyHeader from './components/StickyHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<style>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: rgb(250, 247, 245);
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.9s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
