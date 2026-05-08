// Config
let mustPreload = true;
let mustHideLoader = false;
let mustSkipEnter = true;

// Globals
let isPreloading = false;

async function preloadAssets() {

		if (mustHideLoader || !mustPreload) {
			const wrapper = document.getElementById('loader-wrapper');
      wrapper.style.opacity = '0';
			setTimeout(() => {
				wrapper.style.display = 'none';
			}, 500);
		}

		if (!mustPreload) {
			return;
		}

    const CACHE_NAME = 'ginuel-cache-v4'; // Name for local storage
    const images = new Set([
				'images/home-icon.svg',
        'images/about-icon.svg',
        'images/skills-icon.svg',
        'images/achievements-icon.svg',
        'images/projects-icon.svg',
        'images/contacts-icon.svg',
        'images/contacts-icon.svg',
				'images/profile.jpg',
				'images/project1.jpg',
				'images/project2.jpg',
				'images/project3.jpg',
				'images/project4.jpg',
				'images/project5.jpg',
				'images/cloud-block.svg',
				'images/glitch-noise.svg',
				'images/logo.svg',
				'images/minecart.svg',
				'images/rail.svg',
				'images/sun.svg',
				'images/stamp-head.svg',
				'images/stone-noise.svg',

		]);
    const audios = new Set();
        
    
    document.querySelectorAll('img[src]').forEach(img => images.add(img.getAttribute('src')));
    document.querySelectorAll('[data-images], [data-music], [data-filler], [data-pillar]').forEach(el => {
        const vals = el.dataset.images || el.dataset.music || el.dataset.filler || el.dataset.pillar;
        vals.split(',').forEach(v => {
            const url = v.replace(/url\(['"]?(.+?)['"]?\)/, '$1').trim();
            if (url) url.endsWith('.mp3') ? audios.add(url) : images.add(url);
        });
    });

    const assets = [...images, ...audios];
    const total = assets.length;
    let loaded = 0;
    const cache = await caches.open(CACHE_NAME); // Open local cache

    const updateProgress = (url) => {
        loaded++;
        const percent = Math.round((loaded / total) * 100);
        const bar = document.getElementById('loading-bar');
        const progress = document.getElementById('progress');
        const status = document.getElementById('loading-status');
        const btn = document.getElementById('enter-btn');

        if (bar) bar.style.width = `${percent}%`;
        if (status) status.innerText = `Loading asset: ${url.split('/').pop()}`;

        if (loaded === total) {
            
						if (mustHideLoader || mustSkipEnter) {
							const wrapper = document.getElementById('loader-wrapper');
							wrapper.remove()
							triggerSectionAudioChange(document.getElementById('home')); 
						} else {
							if (progress) progress.style.display = "none";
							if (status) status.style.display = "none";
							btn.style.display = "inline-block";
							btn.onclick = () => {
									const wrapper = document.getElementById('loader-wrapper');
									wrapper.style.opacity = '0';
									setTimeout(() => wrapper.remove(), 500);
									triggerSectionAudioChange(document.getElementById('home')); 
							};

						}
        }
    };

    // Use Cache API to store assets locally
    await Promise.all(assets.map(async (url) => {
        try {
            const match = await cache.match(url);
            if (!match) await cache.add(url); // Download and save if not cached
        } catch (e) {
            console.warn("Cache failed for:", url);
        }
        updateProgress(url);
    }));

    isPreloading = false;
}

window.addEventListener('DOMContentLoaded', preloadAssets);
