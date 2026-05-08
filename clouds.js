/**
 * CLOUDS.JS - Check-or-Bake Workflow
 */

const layerSettings = [
    { 
        id: 'layer-back', 
        path: 'baked/cloud_back.png', 
        speed: 0.03, blockSize: 12, threshold: 0.48, scale: 0.03, mapW: 128, mapH: 256
    },
    { 
        id: 'layer-mid', 
        path: 'baked/cloud_mid.png', 
        speed: 0.09, blockSize: 20, threshold: 0.52, scale: 0.05, mapW: 64, mapH: 128 
    },
    { 
        id: 'layer-front', 
        path: 'baked/cloud_front.png', 
        speed: 0.20, blockSize: 32, threshold: 0.56, scale: 0.08, mapW: 32, mapH: 64 
    }
];

const cloudLayers = [];

/**
 * Attempt to load file; Bake if it fails.
 */
function loadOrBake(set) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = set.path;

        img.onload = () => {
            console.log(`Loaded baked file: ${set.path}`);
            resolve(set.path);
        };

        img.onerror = () => {
            console.warn(`File not found: ${set.path}. Baking at runtime...`);
            const dataUrl = bakeTexture(set);
            resolve(dataUrl);
        };
    });
}

function bakeTexture(set) {
    const canvas = document.createElement('canvas');
    canvas.width = set.mapW * set.blockSize;
    canvas.height = set.mapH * set.blockSize;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#FFFFFF";
    for (let x = 0; x < set.mapW; x++) {
        for (let y = 0; y < set.mapH; y++) {
            // fBm noise call
            const val = Noise.fBm(x * set.scale, y * (set.scale * 0.85));
            if (val > set.threshold) {
                ctx.fillRect(x * set.blockSize, y * set.blockSize, set.blockSize, set.blockSize);
            }
        }
    }
    return canvas.toDataURL("image/png");
}

async function initSky() {
    for (const set of layerSettings) {
        const textureUrl = await loadOrBake(set);
        const el = document.getElementById(set.id);
        const texHeight = set.mapH * set.blockSize;

        el.style.backgroundImage = `url(${textureUrl})`;
        el.style.backgroundSize = `${set.mapW * set.blockSize}px ${texHeight}px`;
        
        cloudLayers.push({ el, speed: set.speed, h: texHeight });
    }
}

// --- RENDERING (Transform only) ---
function updateSky() {
    const scroll = window.pageYOffset;
    for (let i = 0; i < cloudLayers.length; i++) {
        const layer = cloudLayers[i];
        const moveY = -(scroll * layer.speed % layer.h);
        layer.el.style.transform = `translate3d(0, ${moveY}px, 0)`;
    }
    ticking = false;
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateSky);
        ticking = true;
    }
}, { passive: true });

// --- NOISE ENGINE (Fallback) ---
const Noise = new function() {
    this.p = new Uint8Array(512);
    const p256 = new Uint8Array(256).map(() => Math.random() * 256);
    for(let i=0; i<256; i++) this.p[i] = this.p[i+256] = p256[i];
    this.fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    this.lerp = (t, a, b) => a + t * (b - a);
    this.grad = (hash, x, y) => {
        const h = hash & 15, u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    };
    this.perlin = (x, y) => {
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
        x -= Math.floor(x); y -= Math.floor(y);
        const u = this.fade(x), v = this.fade(y);
        const A = this.p[X]+Y, AA = this.p[A], AB = this.p[A+1], B = this.p[X+1]+Y, BA = this.p[B], BB = this.p[B+1];
        return this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y), this.grad(this.p[BA], x-1, y)),
                            this.lerp(u, this.grad(this.p[AB], x, y-1), this.grad(this.p[BB], x-1, y-1)));
    };
    this.fBm = (x, y) => {
        let total = 0, amp = 1, freq = 1, max = 0;
        for(let i=0; i<4; i++) {
            total += this.perlin(x * freq, y * freq) * amp;
            max += amp; amp *= 0.5; freq *= 2;
        }
        return (total / max + 1) / 2;
    };
};

initSky();

