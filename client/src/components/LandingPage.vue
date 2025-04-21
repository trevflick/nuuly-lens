  <template>
    <div class="landing-page">
      <h1 class="title">Welcome To Nuuly Lens</h1>
      <p class="subtitle">Upload an image of something you love — we'll find something similar on Nuuly.</p>
      <router-link to="/upload" class="cta-button">Try it out</router-link>
    </div>
  </template>
  
  
  
  <style scoped>
  .landing-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
  }
  
  .title {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #222;
  }
  
  .subtitle {
    font-size: 1.25rem;
    color: #666;
    max-width: 600px;
    margin-bottom: 2rem;
  }
  
  .cta-button {
    background-color: #222;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    text-decoration: none;
    transition: background-color 0.2s ease-in-out;
  }
  
  .cta-button:hover {
    background-color: #444;
  }
  </style>
  