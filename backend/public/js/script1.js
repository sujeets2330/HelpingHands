document.addEventListener("DOMContentLoaded", function () {
    const images = [
        '/img/index.jpg',
        '/img/img-1.png',
        '/img/img-5.jpg',
        '/img/img-4.jpg'
    ];
  
    let currentIndex = 0;
    let showingBg1 = true;
  
    const bg1 = document.getElementById('bg1');
    const bg2 = document.getElementById('bg2');
  
    function changeBackground() {
        const nextIndex = (currentIndex + 1) % images.length;
  
        if (showingBg1) {
            bg2.style.backgroundImage = `url('${images[nextIndex]}')`;
            bg2.style.opacity = 1;
            bg1.style.opacity = 0;
        } else {
            bg1.style.backgroundImage = `url('${images[nextIndex]}')`;
            bg1.style.opacity = 1;
            bg2.style.opacity = 0;
        }
  
        showingBg1 = !showingBg1;
        currentIndex = nextIndex;
    }
  
    // Set initial background
    bg1.style.backgroundImage = `url('${images[currentIndex]}')`;
  
    // Start the background slider
    setInterval(changeBackground, 5000);
  });
  