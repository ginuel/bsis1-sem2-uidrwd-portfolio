/**
 * @param {HTMLElement} vcurrent - The source section for the new textures
 * @param {number} duration - ms
 */
function triggerSectionGlitch(vcurrent, duration = 100) {
    const allSections = document.querySelectorAll('section');
    const newFiller = vcurrent.getAttribute('data-filler');
    const newPillar = vcurrent.getAttribute('data-pillar');
    
    let isGlitching = true;
    const startTime = performance.now();

    // 1. SETUP: Prepare every section for the glitch
		allSections.forEach(section => {
        const canvas = section.querySelector('.section-noise-canvas');
        const wrapper = section.querySelector('.stone-filler');
        
        if (canvas && wrapper) {
            // Match canvas resolution to the filler container
            canvas.width = wrapper.offsetWidth;
            canvas.height = wrapper.offsetHeight;
        }
        // Add CSS state for filters/animations
        section.classList.add('is-section-glitching');
    });

    // 2. ANIMATION LOOP: Draw on all canvases
    function animate(time) {
        if (!isGlitching) return;
        const progress = (time - startTime) / duration;
        
        allSections.forEach(section => {
            const canvas = section.querySelector('.section-noise-canvas');
            if (canvas) drawEnderLayers(canvas, null, progress);
        });
        
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // 3. TEXTURE SWAP: Sync all sections to vcurrent's data
    setTimeout(() => {
        if (newFiller && newPillar) {
            allSections.forEach(section => {
                const target = section.querySelector('.stone-filler');
                if (target) {
                    target.style.setProperty('--filler-bg', newFiller);
                    target.style.setProperty('--pillar-bg', newPillar);
                }
            });
        }
    }, duration / 2);

    // 4. CLEANUP: Force stop and clear everything
    setTimeout(() => {
        isGlitching = false; // Kill the rAF loop
        allSections.forEach(section => {
            section.classList.remove('is-section-glitching');
            const canvas = section.querySelector('.section-noise-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    }, duration);
}

