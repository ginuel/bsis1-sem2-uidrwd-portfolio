const indicator = document.getElementById('indicator');
const points = document.querySelectorAll('.nav-point');
let currentPoint = 0;

let observer;

/**
 * Refactored Move Function
 * @param {HTMLElement} targetEl - The navigation point element
 */

let isNavigating = false;

function move(targetEl, sectionId, mustScroll = true) {

		if (mustScroll) {
			isNavigating = true;
		}


		if (mustScroll) {
			const targetSection = document.querySelector(sectionId);

			const rect = targetSection.getBoundingClientRect();

			const absoluteTop = rect.top + window.scrollY;

			const nav = document.querySelector('.sticky-nav-wrapper');

			if (targetSection) {
				window.scrollTo({
					top: absoluteTop - nav.offsetHeight * 3,
					behavior: 'smooth'
				});
			}
		}

    if (!targetEl) {
			id = 0;
			targetEl = document.getElementById('point-icon-0');
		};

    // Extract the ID number from the element ID (e.g., "point-icon-2" -> 2)
    id = parseInt(targetEl.id.split('-').pop());

    // 1. Get speed constant from CSS
    const speed = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--speed-constant')) || 0.1;
    
    // 2. Unit logic: Grab numeric VW value from CSS
    const squareVW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--square-size'));

    // 3. Distance & Time calculation
    const distance = Math.abs(id - currentPoint);
    indicator.style.transitionDuration = `${distance * speed}s`;

    // 4. Movement using VW
    indicator.style.left = `${id * squareVW}vw`;

    // 5. Update Active State
    points.forEach(p => p.classList.remove('active'));
    targetEl.classList.add('active');

    // 6. Update Tracker
    currentPoint = id;

		
	window.addEventListener('scrollend', () => {
    isNavigating = false;
	}, { once: true }); // { once: true } auto-removes this listener after it fires
		
}

observer = new IntersectionObserver((entries) => {


		if (isNavigating) {
			return;
		}
    // 1. Filter entries to find those currently in view
    // 2. Sort them by their position relative to the top of the viewport
    const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

    if (visibleEntries.length === 1) {
        const firstVisibleSection = visibleEntries[0].target;
        
        // 3. Find the index of this section relative to other sections
        const allSections = Array.from(document.querySelectorAll('section'));
        const sectionIndex = allSections.indexOf(firstVisibleSection);
				const sectionId = firstVisibleSection.getAttribute('id');
        
        // 4. Locate the corresponding nav-point element
        const targetNavPoint = document.getElementById(`point-icon-${sectionIndex}`);
        
        // 5. Only move if the index has changed
        if (sectionIndex !== currentPoint && targetNavPoint) {
            move(targetNavPoint, `#${sectionId}`, false);
        }
    }
}, { 
    // Trigger when at least 10% of the section is visible
    threshold: 0,
		rootMargin: `-25% 0px -75% 0px`
});

// Initialize the observer on all sections
document.querySelectorAll('section').forEach(s => observer.observe(s));

window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};

// // Add this to prevent the "selection" highlight that triggers the menu
// document.addEventListener('touchstart', function(e) {
//     if (e.target.tagName === 'IMG') {
//         e.preventDefault();
//     }
// }, { passive: false });

