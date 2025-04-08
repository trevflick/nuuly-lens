<template>
    <div class="grid-container">
      <MatchCard
        v-for="(match, index) in matches"
        :key="index"
        :match="match"
      />
    </div>
  </template>
  
  <script>
  import MatchCard from "./MatchCard.vue";
  
  export default {
    props: {
      matches: Array,
    },
    components: {
      MatchCard,
    },
  };
  </script>
  
  <style scoped>
  .grid-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    margin-top: 2rem;
  }
  </style>
  