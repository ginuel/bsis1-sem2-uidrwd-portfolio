const MinecraftLoader = (() => {
    const screen = document.getElementById('loading-screen');
    const bar = document.getElementById('loading-bar');
    const text = document.getElementById('loading-text');
    const status = document.getElementById('loading-status'); // New status element
    const btn = document.getElementById('start-btn');

    const manualImages = [
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
		];

    const getUniqueAssets = () => {
        const audioSet = new Set();
        const imageSet = new Set(manualImages);

        document.querySelectorAll('[data-music], [data-images]').forEach(el => {
            const m = el.getAttribute('data-music');
            const i = el.getAttribute('data-images');
            if (m) m.split(',').forEach(s => s.trim() && audioSet.add(s.trim()));
            if (i) i.split(',').forEach(s => s.trim() && imageSet.add(s.trim()));
        });

        document.querySelectorAll('[data-filler], [data-pillar]').forEach(el => {
            const f = el.getAttribute('data-filler');
            const p = el.getAttribute('data-pillar');
            if (f) imageSet.add(f.trim());
            if (p) imageSet.add(p.trim());
        });

        return { audio: Array.from(audioSet), images: Array.from(imageSet) };
    };

    const init = async () => {
        const assets = getUniqueAssets();
        const total = assets.audio.length + assets.images.length;
        let loaded = 0;

        const updateStatus = (path) => {
            loaded++;
            // Extract filename from path for cleaner display
            const filename = path.split('/').pop();
            const progress = Math.round((loaded / total) * 100);
            
            if (bar) bar.style.width = `${progress}%`;
            if (text) text.innerText = `${progress}%`;
            if (status) status.innerText = `Loading: ${filename}`;
        };

        if (total === 0) return finishLoading();

        const audioPromises = assets.audio.map(src => new Promise(res => {
            const a = new Audio();
            a.preload = "auto";
            a.oncanplaythrough = a.onerror = () => { updateStatus(src); res(); };
            a.src = src;
            (window._preloadCache = window._preloadCache || []).push(a);
        }));

        const imagePromises = assets.images.map(src => new Promise(res => {
            const img = new Image();
            img.onload = img.onerror = () => { updateStatus(src); res(); };
            img.src = src;
        }));

        await Promise.all([...audioPromises, ...imagePromises]);
        finishLoading();
    };

    const finishLoading = () => {
        if (status) status.innerText = "All assets verified!";
        if (text) text.innerText = "100%";
        btn.style.display = "block";
        btn.onclick = () => {
            screen.style.opacity = '0';
            setTimeout(() => screen.remove(), 500);
        };
    };

    return { init };
})();

MinecraftLoader.init();

