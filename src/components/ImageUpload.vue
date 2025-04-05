<template>
    <div class="upload-container">
      <h2>Upload a Shirt Photo</h2>
  
      <input type="file" @change="handleFileChange" accept="image/*" />
      <button @click="submitImage" :disabled="!imageFile">Upload & Match</button>
  
      <div v-if="uploadResult" class="result">
        <h3>🧠 Matched Item:</h3>
        <p><strong>{{ uploadResult.displayName }}</strong></p>
        <p>{{ uploadResult.colorDisplayName }} - {{ uploadResult.category }}</p>
        <img :src="uploadResult.image" alt="Matched shirt" width="200" />
      </div>
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imageFile: null,
        uploadResult: null,
        errorMessage: '',
      };
    },
    methods: {
      handleFileChange(event) {
        this.imageFile = event.target.files[0];
      },
      async submitImage() {
        this.uploadResult = null;
        this.errorMessage = '';
  
        if (!this.imageFile) return;
  
        const formData = new FormData();
        formData.append('image', this.imageFile);
  
        try {
          const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData,
          });
  
          if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
          }
  
          const data = await response.json();
          this.uploadResult = data.matchedItem;
        } catch (err) {
          console.error('Upload error:', err);
          this.errorMessage = 'Upload failed. Is your backend running?';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .upload-container {
    max-width: 500px;
    margin: 2rem auto;
    padding: 2rem;
    border: 2px dashed #ccc;
    border-radius: 10px;
    text-align: center;
    font-family: sans-serif;
  }
  input {
    margin-bottom: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    font-weight: bold;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
  }
  .result {
    margin-top: 2rem;
  }
  .error {
    color: red;
    margin-top: 1rem;
  }
  </style>
  