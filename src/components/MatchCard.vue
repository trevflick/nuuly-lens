<template>
    <div class="match-card">
      <img :src="match.image" alt="Match image" class="match-img" />
      <div class="match-footer">
        <h3 class="match-title">{{ match.name }}</h3>
        <p class="match-brand">{{ match.brand }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      match: Object,
    },
  };
  </script>
  
  <style scoped>
  .match-card {
  width: 220px;
  background-color: transparent; /* remove all background */
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s ease;
  box-shadow: none; /* make sure no outer shadow */
  border: none; /* extra safeguard */
  padding: 0;
  margin: 0;
}

.match-card:hover {
  transform: translateY(-4px);
}

.match-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: block; /* removes inline spacing */
}

.match-footer {
  background-color: white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border: 1px solid #eee;
  border-top: none;
  padding: 0.75rem;
  box-shadow: none; /* remove shadows that mimic borders */
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
  