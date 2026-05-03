/**
 * Overworld Layer Controller
 * Manages the images/overworld.svg asset and vertical parallax.
 */
const OverworldController = {
    config: {
        path: 'images/overworld.svg',
        width: window.innerWidth,
        screenH: window.innerHeight,
        stoneDepth: 10000,
        containerId: 'overworld-layer',
        imageId: 'crust-file'
    },

    init() {
        const img = document.getElementById(this.config.imageId);
        
        // Listen for error: if images/overworld.svg doesn't exist, generate it
        img.onerror = () => {
            console.warn(`${this.config.path} not found. Generating procedural overworld...`);
            this.generateFallback();
        };

        // Set the initial source
        img.src = this.config.path;

        this.bindParallax();
    },

    /**
     * Creates a procedural SVG if the physical file is missing
     */
    generateFallback() {
        const { width, screenH, stoneDepth } = this.config;

        const svgContent = `
            <svg width="${width}" height="${screenH + stoneDepth}" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="${screenH}" width="${width}" height="40" fill="#5da037" />
                <rect x="0" y="${screenH + 40}" width="${width}" height="120" fill="#866043" />
                <rect x="0" y="${screenH + 160}" width="${width}" height="${stoneDepth}" fill="#7b7b7b" />
            </svg>
        `;

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        document.getElementById(this.config.imageId).src = url;
    },

    bindParallax() {
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const layer = document.getElementById(this.config.containerId);
            if (layer) {
                // Moves the overworld up 1:1 with the scroll
                layer.style.transform = `translateY(${-scrollY}px) translateZ(0)`;
            }
        }, { passive: true });
    }
};

OverworldController.init();

