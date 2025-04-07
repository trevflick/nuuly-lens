<template>
    <div>
      <input type="file" @change="handleFileChange" />
      <button @click="uploadImage">Upload</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        imageFile: null,
      };
    },
    methods: {
      handleFileChange(event) {
        this.imageFile = event.target.files[0];
      },
      async uploadImage() {
        if (!this.imageFile) return;
  
        const formData = new FormData();
        formData.append("image", this.imageFile);
  
        try {
          const res = await fetch("http://localhost:5050/api/upload", {
            method: "POST",
            body: formData,
          });
  
          const data = await res.json();
          console.log("🎯 Match result:", data);
          // Show data.bestMatch or data.uploadedImageUrl in UI
        } catch (err) {
          console.error("❌ Upload failed:", err);
        }
      },
    },
  };
  </script>
  