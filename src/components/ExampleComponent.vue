<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <div class="example">{{ message }}</div>
</template>

<style scoped>
.example {
  font-weight: 500;
  font-size: 2.6rem;
  text-align: center;
}
</style>
