let currentIndex = 0;

function triggerGlitch(wrapper, newIndex = -1, duration = 400) {
    const img = wrapper.querySelector('#glitch-target');
    const canvas = wrapper.querySelector('#noise-canvas');
    const images = img.getAttribute('data-images').split(',');

    // 1. Sync Canvas resolution to actual rendered image size
    const rect = img.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    wrapper.classList.add('glitching');
    
    let startTime = performance.now();

    function animate(time) {
        let progress = (time - startTime) / duration;
        if (progress < 1) {
            drawEnderLayers(canvas, img, progress);
            requestAnimationFrame(animate);
        } else {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    requestAnimationFrame(animate);

		currentIndex = -1;
		if (newIndex !== -1) {
			currentIndex = newIndex;
		} else {
			const currentSrc = img.getAttribute('src');
			const options = images.filter(src => src !== currentSrc);
			const randomSrc = options[Math.floor(Math.random() * options.length)];
			currentIndex = images.indexOf(randomSrc);
		}

    // Swap source mid-way
    setTimeout(() => { img.src = images[currentIndex]; }, duration / 2);

    // End effect
    setTimeout(() => { wrapper.classList.remove('glitching'); }, duration);
}

function drawEnderLayers(canvas, img, progress) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.save(); 
    
    ctx.drawImage(img, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-atop';

    // The "Inverse Progress" factor (starts at 1.0, ends at 0.0)
    const shrinkFactor = 1 - progress;

    const layers = [
        { y: 0.1, th: 0.5, color: 'rgba(25, 10, 40, 0.8)' },   // Deep Void
        { y: 0.3, th: 0.4, color: 'rgba(100, 32, 167, 0.5)' },  // Ender Purple
        { y: 0.6, th: 0.2, color: 'rgba(212, 0, 255, 0.6)' },  // Endermite Highlight
        { y: 0.8, th: 0.05, color: 'rgba(255, 200, 255, 0.3)' }  // Bright Spark
    ];

    layers.forEach(layer => {
        const currentY = ((layer.y + progress) % 1) * h;
        
        // FADE OUT: Make the color more transparent as it shrinks
        const colorWithAlpha = layer.color.replace(/[\d.]+\)$/g, `${0.5 * shrinkFactor})`);
        grad.addColorStop(0.5, colorWithAlpha);
        
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, currentY, w, thickness);
    });

    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
}

