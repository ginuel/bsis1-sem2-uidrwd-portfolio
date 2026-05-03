/**
 * Universal Glitch Trigger
 * @param {HTMLElement} element - The DOM element to glitch
 * @param {Function} changeLogic - The code to execute mid-glitch
 * @param {number} duration - Total time in ms
 */
function applyGlitch(element, changeLogic, duration = 400) {
    if (!element) return;

    element.classList.add('glitch-effect');

    // Trigger the change halfway through the glitch
    setTimeout(() => {
        if (typeof changeLogic === 'function') {
            changeLogic();
        }
    }, duration / 2);

    // Remove the effect
    setTimeout(() => {
        element.classList.remove('glitch-effect');
    }, duration);
}

