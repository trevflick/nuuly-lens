<template>
  <div id="app">
    <StickyHeader />       
    <router-view />        
    <SiteFooter />         
  </div>
</template>

<script setup>
import StickyHeader from '@/components/StickyHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;

  
}
</style>
