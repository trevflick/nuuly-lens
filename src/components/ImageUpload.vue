<template>
    <div class="image-upload">
      <h2>Upload an image to find a match</h2>
  
      <input type="file" @change="onFileChange" accept="image/*" />
      <button @click="submitImage" :disabled="!imageFile">Get Vector</button>
  
      <p v-if="status">{{ status }}</p>
      <pre v-if="vector">🔎 Vector (first few): {{ vector.slice(0, 5) }}...</pre>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const imageFile = ref(null);
  const vector = ref(null);
  const status = ref('');
  
  function onFileChange(e) {
    imageFile.value = e.target.files[0];
    vector.value = null;
    status.value = '';
  }
  
  async function submitImage() {
    if (!imageFile.value) return;
  
    status.value = '⏳ Uploading and vectorizing...';
  
    const formData = new FormData();
    formData.append('image', imageFile.value);
  
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
  
      const data = await res.json();
  
      if (data.vector) {
        vector.value = data.vector;
        status.value = 'Vector received!';
      } else {
        status.value = 'No vector returned.';
      }
    } catch (err) {
      console.error('Error uploading:', err);
      status.value = 'Upload failed. See console.';
    }
  }
  </script>
  
  <style scoped>
  .image-upload {
    padding: 1rem;
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  </style>
  