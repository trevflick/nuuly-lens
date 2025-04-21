<template>
  <div class="landing-wrapper">
    <h1 class="main-title">Welcome To Nuuly Lens</h1>
    <p class="description">
      Upload an image of something you love — we'll find something similar on Nuuly.
    </p>
    <router-link to="/upload">
      <button class="start-button">Try it out</button>
    </router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.landing-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.main-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.125rem;
  color: #555;
  max-width: 600px;
  margin-bottom: 2rem;
  text-align: center;

}

.start-button {
  background-color: #3C5260;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0px;
  cursor: pointer;
}
</style>