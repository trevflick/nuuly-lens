    <template>
    <div class="match-card">
      <img :src="imageUrl" :alt="displayName" />
  
      <div class="match-footer">
        <h2 class="match-title">{{ displayName }}</h2>
        <p class="match-brand">{{ brand }}</p>
        <p>Similarity: {{ (similarity * 100).toFixed(1) }}%</p>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    displayName: String,
    imageUrl: String,
    similarity: Number,
    brand: String, 
  })
  </script>
  
  <style scoped>
  .match-card {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    background-color: white;
  }
  .match-card:hover {
    transform: scale(1.02);
  }
  .match-card img {
    width: 100%;
    height: auto;
  }
  
  .match-footer {
    background-color: white;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border: 1px solid #eee;
    border-top: none;
    padding: 0.75rem;
    box-shadow: none; 
  }
  
  .match-title {
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    font-size: 1rem;
    color: #222;
    margin: 0;
  }
  
  .match-brand {
    font-size: 0.85rem;
    color: #666;
    margin-top: 0.25rem;
  }
  </style>
  