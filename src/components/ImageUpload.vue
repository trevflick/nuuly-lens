<template>
    <div class="upload-area">
      <label
        class="upload-box"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <input type="file" accept="image/*" @change="handleFileChange" hidden ref="fileInput" />
        <div @click="triggerFileInput" class="upload-content">
          <div v-if="!previewUrl">Click or drop an image here</div>
          <img v-else :src="previewUrl" class="preview-image" />
        </div>
      </label>
      <button @click="getVector" :disabled="!imageFile">Get Image Vector</button>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { watch } from 'vue'
  import { getImageVector } from '@/composables/useClipVector.js'

  import { sayHi } from '../composables/test.js'
  sayHi()

  
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
  
  const handleDrop = (e) => {
    const file = e.dataTransfer.files[0]
    if (file) {
      imageFile.value = file
      previewUrl.value = URL.createObjectURL(file)
    }
  }

    watch(imageFile, (newFile) => {
    console.log('Uploaded file:', newFile)
    })


    const getVector = async () => {
  if (!imageFile.value) return
  const vector = await getImageVector(imageFile.value)
  if (vector) {
    console.log('Got vector:', vector)
  } else {
    console.error('No vector returned.')
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
  