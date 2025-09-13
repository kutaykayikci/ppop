if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/ppop/sw.js', { 
      scope: '/ppop/' 
    })
  })
}