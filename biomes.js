// List of all biomes based on your provided files
const biomeFiles = [
    'images/overworld.svg',
    'images/overworld-badlands.svg',
    'images/overworld-classic-flat.svg',
    'images/overworld-desert.svg',
    'images/overworld-jungle.svg',
    'images/overworld-meadow.svg',
    'images/overworld-mushroom.svg',
    'images/overworld-ocean.svg',
    'images/overworld-redstone-ready.svg',
    'images/overworld-savanna.svg',
    'images/overworld-snowy.svg',
    'images/overworld-stony.svg',
    'images/overworld-swamp.svg'
];

let currentBiomeIdx = 0;
const overworldEl = document.querySelector('.mc-scene'); // The parallax layer

function swapBiomeNext() {
    applyGlitch(overworldEl, () => {
        currentBiomeIdx = (currentBiomeIdx + 1) % biomeFiles.length;
        overworldEl.src = biomeFiles[currentBiomeIdx];
    }, 350);
}

// Example: Glitch into a new biome when the user clicks the scene
overworldEl.addEventListener('click', swapBiomeNext);

