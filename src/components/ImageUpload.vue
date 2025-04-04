// this will handle uploading a pic of a piece of clothing
// just wanted to test it as a component
// so you can drag a pic in OR just upload it
// it's gonna store it 
// it's gonna need to be converted into a vector or something to classify it 
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

  
  const fileInput = ref(null)
  const imageFile = ref(null)
  const previewUrl = ref(null)
  
  const triggerFileInput = () => {
    fileInput.value.click()
  }
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      imageFile.value = file
      previewUrl.value = URL.createObjectURL(file)
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
  .upload-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
  
  .upload-box {
    border: 2px dashed #ccc;
    border-radius: 12px;
    padding: 2rem;
    cursor: pointer;
    width: 300px;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #f9f9f9;
    transition: 0.2s ease;
  }
  
  .upload-box:hover {
    background: #f0f0f0;
  }
  
  .preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  </style>
  