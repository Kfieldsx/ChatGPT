(() => {
  const year = new Date().getFullYear();
  const footer = document.querySelector('.site-footer p');
  if (footer) {
    footer.textContent = `© ${year} Vini Vidi Cogitavi`;
  }
})();
