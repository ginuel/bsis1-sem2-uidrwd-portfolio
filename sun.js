window.addEventListener('DOMContentLoaded', () => {
    const sun = document.getElementById('celestial-sun');
    let isTimerFinished = false;

    // 1. Calculate the fixed pixel starting point (50% of screen) immediately
    const initialX = window.innerWidth * 0.5;
    const initialY = window.innerHeight * 0.5;

    const updateSunPosition = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const driftY = scrollY * 0.02;

        // 2. Construct and apply the transform
        const transformValue = `translate(-50%, -50%) translate3d(${initialX}px, ${initialY + driftY}px, 0)`;
        sun.style.transform = transformValue;
        
        // 3. Reveal logic: Only show if 5 seconds have passed
        if (isTimerFinished) {
            sun.style.opacity = "1";
        }
    };

    // 4. Start the 5-second countdown
    setTimeout(() => {
        isTimerFinished = true;
        updateSunPosition(); // Trigger the reveal immediately after 5s
    }, 500);

    // Initial position call (keeps it hidden but placed)
    updateSunPosition();

    // High-performance scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateSunPosition();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
});

