const MinecraftAudio = (() => {
    const player = new Audio();
    let tracks = [];
    let currentTrack = null;
    let isInitialized = false;

    const playRandom = () => {
        if (tracks.length === 0) return;

        // Pick a random track from the current list
        const next = tracks[Math.floor(Math.random() * tracks.length)];
        
        currentTrack = next;
        player.src = next;
        player.play().catch(() => {
            // Browsers block autoplay until the user clicks something
            isInitialized = false; 
        });
    };

    // When a track finishes, naturally pick the next one from the current list
    player.onended = playRandom;

    return {
        update: (str) => {
            // Convert comma-separated string to a clean array
            const nextSet = str.split(',').map(s => s.trim()).filter(Boolean);
            
            // Logic Check: 
            // Is our current playing track part of this new unique set?
            const currentIsStillValid = currentTrack && nextSet.includes(currentTrack);

            // Update the internal list reference
            tracks = nextSet;

            if (!isInitialized || player.paused || !currentIsStillValid) {
                // If it's the first run, the player stopped, or the 
                // current song isn't in the new list: Change Now.
                isInitialized = true;
                playRandom();
            } else {
                // The current track is valid in the new set. 
                // Do nothing; it will loop into the new set naturally on 'onended'.
            }
        }
    };
})();


/**
 * Simplified Trigger
 */
function triggerSectionAudioChange(section) {
    const music = section.getAttribute('data-music');
    MinecraftAudio.update(music);
}

// Separate block to global-preload all music found in data-music attributes
(() => {
    const allMusicSources = new Set();

    // 1. Collect every unique track from all sections
    document.querySelectorAll('[data-music]').forEach(el => {
        const tracks = el.getAttribute('data-music').split(',');
        tracks.forEach(src => {
            const cleanSrc = src.trim();
            if (cleanSrc) allMusicSources.add(cleanSrc);
        });
    });

    // 2. Map sources to preloading Audio objects
    // We store them in a constant to prevent garbage collection
    const preloaderCache = Array.from(allMusicSources).map(src => {
        const audio = new Audio();
        audio.preload = "auto";
        audio.src = src;
        return audio;
    });

    console.log(`Preloading ${preloaderCache.length} unique tracks...`);
})();

