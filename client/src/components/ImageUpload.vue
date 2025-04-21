<template>
  <div class="page-container">
    <div class="upload-container">
      <h1 class="main-title">
        {{ results.length ? 'Here Are Your Top Matches:' : 'Upload An Image To Find Your Match' }}
      </h1>

      <label class="custom-file-upload">
        <input type="file" @change="handleFileChange" />
        Upload
      </label>

      <button @click="uploadImage" :disabled="isLoading">
        {{ isLoading ? "Matching..." : "Match" }}
      </button>

      <div v-if="isLoading" class="loader">Looking for your match...</div>
    </div>

    <MatchGrid v-if="results.length" :matches="results" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MatchGrid from './MatchGrid.vue'

const image = ref(null)
const results = ref([])
const isLoading = ref(false)

function handleFileChange(event) {
  image.value = event.target.files[0]
}

async function uploadImage() {
  if (!image.value) return

  isLoading.value = true
  results.value = []

  const formData = new FormData()
  formData.append('image', image.value)

  try {
    const response = await fetch('http://localhost:5050/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    results.value = data.topMatches.map(match => ({
      displayName: match.product.displayName,
      imageUrl: match.product.image,
      similarity: match.similarity,
      brand: match.product.brand || 'Nuuly',
    }))
  } catch (error) {
    console.error("Upload failed:", error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.upload-container {
  margin-bottom: 2rem;
  text-align: center;
}

.custom-file-upload {
  background-color: #222;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 1rem;
}

button {
  background-color: #444;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loader {
  margin-top: 1rem;
  font-style: italic;
}
</style>
