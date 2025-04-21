  <template>
    <div class="grid">
      <MatchCard
        v-for="(match, index) in matches"
        :key="index"
        :displayName="match.displayName"
        :imageUrl="match.imageUrl"
        :similarity="match.similarity"
        :brand="match.brand" 
      />
    </div>
  </template>
  
  <script setup>
  import MatchCard from './MatchCard.vue'
  
  const props = defineProps({
    matches: {
      type: Array,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  </style>
  