/**
 * biomes.js
 */
async function changeBiome(event, wrapper) {
    const img = wrapper.querySelector('#glitch-target');
    
    // 1. Transparency Check (Standard)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
    
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pixelAlpha = ctx.getImageData(x, y, 1, 1).data[3];
    
    if (pixelAlpha > 0) {
        const dataAttr = img.getAttribute('data-images');
        const images = dataAttr.split(',').map(s => s.trim());
        
				const currentSrc = img.getAttribute('src');
				const options = images.filter(src => src !== currentSrc);

				let randomSrc = options[Math.floor(Math.random() * options.length)];
				const newIndex = images.indexOf(randomSrc);
        // --- Rapid Swap Logic ---
        let iterations = 3;
        let delay = 200; // Speed of the shuffle in ms

        for (let i = 0; i < iterations; i++) {

						const nextOptions = images.filter(src => src !== randomSrc);
	 				  randomSrc = nextOptions[Math.floor(Math.random() * options.length)];
					  const otherIndex = images.indexOf(randomSrc);
						
            
            // Trigger glitch with the specific next image
            if (typeof triggerGlitch === 'function') {
                triggerGlitch(wrapper, otherIndex);
            }
            
            // // Wait before next swap
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
				if (typeof triggerGlitch === 'function') {
						triggerGlitch(wrapper, newIndex);
				}
			
        console.log("Sequence complete.");
    }
		
}


// Set the interval (10000ms = 10 seconds)
const wrapper = document.querySelector('#main-ender-wrapper');

const biomeInterval = setInterval(() => {
	triggerGlitch(wrapper);
}, 10000);

