<template>
  <footer class="site-footer">
    <div class="footer-left">Made by Trevor Flick</div>
    <div class="footer-right">
      <a href="https://github.com/trevflick" target="_blank">GitHub</a> |
      <a href="https://trevorflick.com" target="_blank">Website</a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #3C5260;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgb(250, 247, 245);
  font-size: 0.9rem;
}

.footer-left {
  color: rgb(250, 247, 245);
}

.footer-right a {
  color: rgb(250, 247, 245);
  text-decoration: none;
  margin: 0 0.5rem;
}

.footer-right a:hover {
  text-decoration: underline;
}
</style>