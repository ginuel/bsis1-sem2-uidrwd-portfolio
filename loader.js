async function preloadAssets() {
    const images = new Set();
    const audios = new Set();
    
    // 1. Collect all assets from <img> tags and data attributes
    document.querySelectorAll('img[src]').forEach(img => images.add(img.getAttribute('src')));
    document.querySelectorAll('[data-images], [data-music], [data-filler], [data-pillar]').forEach(el => {
        const vals = el.dataset.images || el.dataset.music || el.dataset.filler || el.dataset.pillar;
        vals.split(',').forEach(v => {
            const url = v.replace(/url\(['"]?(.+?)['"]?\)/, '$1').trim();
            if (url.endsWith('.mp3')) audios.add(url); else images.add(url);
        });
    });

    const total = images.size + audios.size;
    let loaded = 0;

    const updateProgress = (url) => {
        loaded++;
        const percent = Math.round((loaded / total) * 100);
        const bar = document.getElementById('loading-bar');
        const text = document.getElementById('loading-text');
        const status = document.getElementById('loading-status');
        const phase = document.getElementById('loading-phase');
        const btn = document.getElementById('enter-btn');

        if (bar) bar.style.width = `${percent}%`;
        if (text) text.innerText = `${percent}%`;
        if (status) status.innerText = `Loaded: ${url.split('/').pop()}`;

        if (loaded === total) {
            phase.innerText = "Phase: Ready!";
            status.innerText = "All assets loaded successfully.";
            
            // Show the Enter button
            btn.style.display = "inline-block";
            
            // Click event to remove the loader
            btn.onclick = () => {
                const wrapper = document.getElementById('loader-wrapper');
                wrapper.style.opacity = '0';
                setTimeout(() => wrapper.remove(), 500);
                
                // Optional: Start background music here if needed
                triggerSectionAudioChange(document.getElementById('home')); 
            };
        }
    };

    // 2. Map sets to loading promises
    const imagePromises = [...images].map(url => new Promise(res => {
        const img = new Image();
        img.onload = img.onerror = () => { updateProgress(url); res(); };
        img.src = url;
    }));

    const audioPromises = [...audios].map(url => new Promise(res => {
        const audio = new Audio();
        audio.oncanplaythrough = audio.onerror = () => { updateProgress(url); res(); };
        audio.src = url;
    }));

    await Promise.all([...imagePromises, ...audioPromises]);
}

window.addEventListener('DOMContentLoaded', preloadAssets);

