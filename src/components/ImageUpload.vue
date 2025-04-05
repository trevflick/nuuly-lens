<template>
    <div>
      <h2>Upload an Image</h2>
      <input type="file" @change="handleFileChange" />
      <button @click="submitImage">Submit</button>
      <div v-if="result">
        <h3>Vector (first 5 values):</h3>
        <code>{{ result.slice(0, 5) }}</code>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const image = ref(null);
  const result = ref(null);
  
  const handleFileChange = (event) => {
    image.value = event.target.files[0];
  };
  
  const submitImage = async () => {
    const formData = new FormData();
    formData.append("image", image.value);
  
    try {
      const res = await fetch("http://localhost:5050/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }
  
      const data = await res.json();
      result.value = data.vector;
    } catch (err) {
      console.error("🔥 Upload error:", err);
    }
  };
  </script>