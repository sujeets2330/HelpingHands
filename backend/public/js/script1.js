document.addEventListener("DOMContentLoaded", function () {
    const images = [
        '/img/index.jpg',
        '/img/img-1.jpeg',
        '/img/img-2.jpg',
        '/img/img-3.png',
        '/img/img-5.jpg'
    ];

    let currentIndex = 0;
    let showingBg1 = true;
    const bg1 = document.getElementById('bg1');
    const bg2 = document.getElementById('bg2');

    function setStyles(bg) {
        bg.style.backgroundSize = "cover";
        bg.style.backgroundPosition = "center";
        bg.style.backgroundRepeat = "no-repeat";
        bg.style.transition = "opacity 1s ease-in-out";
    }

    setStyles(bg1);
    setStyles(bg2);

    function updateBackground(index) {
        const nextImg = images[index];
        if (showingBg1) {
            bg2.style.backgroundImage = `url('${nextImg}')`;
            bg2.style.opacity = 1;
            bg1.style.opacity = 0;
        } else {
            bg1.style.backgroundImage = `url('${nextImg}')`;
            bg1.style.opacity = 1;
            bg2.style.opacity = 0;
        }
        showingBg1 = !showingBg1;
    }

    function changeBackground(forward = true) {
        currentIndex = (currentIndex + (forward ? 1 : -1) + images.length) % images.length;
        updateBackground(currentIndex);
    }

    // Set initial background
    bg1.style.backgroundImage = `url('${images[currentIndex]}')`;
    bg1.style.opacity = 1;
    bg2.style.opacity = 0;

    // Auto Slide
    const interval = setInterval(() => changeBackground(true), 5000);

    // Manual Controls
    document.querySelector('.arrow.prev').addEventListener('click', () => {
        clearInterval(interval); // Stop auto-slide on manual nav
        changeBackground(false);
    });

    document.querySelector('.arrow.next').addEventListener('click', () => {
        clearInterval(interval);
        changeBackground(true);
    });
});
