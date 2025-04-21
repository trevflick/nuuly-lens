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
  
      <div class="results-container" v-if="results.length">
        <div v-for="(match, index) in results" :key="index" class="match">
          <img :src="match.imageUrl" :alt="match.displayName" />
          <p>{{ match.displayName }} ({{ (match.similarity * 100).toFixed(1) }}%)</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
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
  
      if (data.bestMatch) {
        results.value = [
          {
            displayName: data.bestMatch.displayName,
            imageUrl: data.uploadedImageUrl || data.bestMatch.image,
            similarity: data.similarity,
          },
        ]
      } else {
        console.warn("No match found")
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
  <style scoped>
  .page-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.upload-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

  .main-title{
    font-size: 2.25rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 1rem;
  }
  
  button {
    background-color: #3C5260;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 0px;
    cursor: pointer;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .loader {
    margin-top: 1rem;
    font-style: italic;
    color: gray;
  }
  
  .results-grid {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  
  .result-card {
    width: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: transparent;
    box-shadow: none;
    border: none;
    padding: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .result-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .result-image {
    width: 100%;
    height: 350px;
    object-fit: cover;
  }
  
  .result-details {
    background-color: white;
    border-top: none;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    padding: 0.75rem;
    width: 100%;
    text-align: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .result-name {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 1rem;
    color: #222;
    margin: 0;
  }
  
  .result-score {
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    color: gray;
    margin-top: 0.25rem;
  }

  input[type="file"] {
  display: none;
}

.custom-file-upload {
  background-color: #3C5260;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0px;
  cursor: pointer;
  display: inline-block;
  margin-right: 1rem;
}
</style>
  