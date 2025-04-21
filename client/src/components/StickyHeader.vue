<template>
  <header class="sticky-header">
    <router-link to="/" class="logo-link">
      <img src="@/assets/nuuly-logo.png" alt="Nuuly logo" class="logo" />
    </router-link>
  </header>
</template>

<script setup></script>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 1rem 0;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
}

.logo {
  height: 28px;
  object-fit: contain;
}
</style>
