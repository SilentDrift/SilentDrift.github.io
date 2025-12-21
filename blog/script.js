function goToHomepage() {
    window.location.href = "https://silentdrift.github.io/";
}

// Generate animated elements in the void space
document.addEventListener('DOMContentLoaded', function() {
    const background = document.querySelector('.animated-background');
    const elementTypes = [
        'star',
        'star',
        'star',
        'star',
        'star',
        'star',
        'star',
        'star',
        'hyperspace',
        'hyperspace',
        'blaster-bolt',
        'blaster-bolt',
        'tie-fighter',
        'xwing',
        'death-star',
        'lightsaber'
    ];
    const boltColors = ['var(--laser-red)', 'var(--laser-green)', 'var(--laser-blue)'];
    
    if (!background) {
        return;
    }

    // Create random animated elements with depth and variety
    const elementCount = 44;
    for (let i = 0; i < elementCount; i++) {
        // Randomly select type of element
        const typeIndex = Math.floor(Math.random() * elementTypes.length);
        const elementType = elementTypes[typeIndex];
        
        // Create the element
        const element = document.createElement('div');
        element.classList.add('floating-element', elementType);
        
        // Position randomly on the page
        const posX = Math.random() * 100; // % of viewport width
        const posY = Math.random() * 100; // % of viewport height
        element.style.left = `${posX}%`;
        element.style.top = `${posY}%`;

        element.setAttribute('aria-hidden', 'true');

        let driftRangeX = 70;
        let driftRangeY = 60;
        let spinRange = 12;

        if (elementType === 'star') {
            driftRangeX = 30;
            driftRangeY = 30;
            spinRange = 0;
        } else if (elementType === 'hyperspace') {
            driftRangeX = 220;
            driftRangeY = 140;
            spinRange = 20;
        } else if (elementType === 'blaster-bolt') {
            driftRangeX = 160;
            driftRangeY = 90;
            spinRange = 25;
        } else if (elementType === 'tie-fighter' || elementType === 'xwing' || elementType === 'death-star') {
            driftRangeX = 50;
            driftRangeY = 45;
            spinRange = 8;
        }

        const driftX = (Math.random() * 2 - 1) * driftRangeX;
        const driftY = (Math.random() * 2 - 1) * driftRangeY;
        const spin = (Math.random() * 2 - 1) * spinRange;
        const scale = 0.6 + Math.random() * 1.2;
        const opacity = 0.15 + Math.random() * 0.35;
        const blur = 0.4 + Math.random() * 1.2;

        element.style.setProperty('--drift-x', `${driftX}px`);
        element.style.setProperty('--drift-y', `${driftY}px`);
        element.style.setProperty('--spin', `${spin}deg`);
        element.style.setProperty('--scale', scale.toFixed(2));
        element.style.setProperty('--alpha', opacity.toFixed(2));
        element.style.setProperty('--blur', `${blur.toFixed(2)}px`);

        let duration = 6 + Math.random() * 10;
        let delay = Math.random() * 6;
        
        // Add content based on type
        if (elementType === 'lightsaber') {
            element.style.setProperty('--scale', (0.7 + Math.random() * 0.9).toFixed(2));
            element.style.setProperty('--alpha', (0.18 + Math.random() * 0.25).toFixed(2));
            element.style.setProperty('--blur', '0.4px');
            duration = 7 + Math.random() * 8;

            const blade = document.createElement('span');
            blade.classList.add('lightsaber-blade');
            blade.style.height = `${30 + Math.random() * 20}px`;

            const hilt = document.createElement('span');
            hilt.classList.add('lightsaber-hilt');

            element.appendChild(blade);
            element.appendChild(hilt);
        } else if (elementType === 'blaster-bolt') {
            const boltColor = boltColors[Math.floor(Math.random() * boltColors.length)];
            element.style.setProperty('--bolt-color', boltColor);
            element.style.width = `${14 + Math.random() * 18}px`;
            element.style.height = `${2 + Math.random() * 2}px`;
            element.style.setProperty('--scale', (0.7 + Math.random() * 0.7).toFixed(2));
            element.style.setProperty('--alpha', (0.3 + Math.random() * 0.4).toFixed(2));
            element.style.setProperty('--blur', '0px');
            duration = 1.2 + Math.random() * 2;
            delay = Math.random() * 2;
        } else if (elementType === 'hyperspace') {
            element.style.width = `${1 + Math.random() * 2}px`;
            element.style.height = `${28 + Math.random() * 42}px`;
            element.style.setProperty('--scale', (0.6 + Math.random() * 0.6).toFixed(2));
            element.style.setProperty('--alpha', (0.18 + Math.random() * 0.35).toFixed(2));
            element.style.setProperty('--blur', '0.3px');
            duration = 1.6 + Math.random() * 2.6;
            delay = Math.random() * 2;
        } else if (elementType === 'star') {
            const starSize = 1 + Math.random() * 2.5;
            element.style.width = `${starSize}px`;
            element.style.height = `${starSize}px`;
            element.style.setProperty('--scale', (0.8 + Math.random() * 1.2).toFixed(2));
            element.style.setProperty('--alpha', (0.15 + Math.random() * 0.35).toFixed(2));
            element.style.setProperty('--blur', `${(Math.random() * 0.8).toFixed(2)}px`);
            duration = 8 + Math.random() * 12;
            delay = Math.random() * 8;
        } else if (elementType === 'death-star') {
            const size = 14 + Math.random() * 14;
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.setProperty('--scale', (0.7 + Math.random() * 0.6).toFixed(2));
            element.style.setProperty('--alpha', (0.12 + Math.random() * 0.25).toFixed(2));
            element.style.setProperty('--blur', `${(Math.random() * 0.4).toFixed(2)}px`);
            duration = 9 + Math.random() * 10;
        } else if (elementType === 'tie-fighter' || elementType === 'xwing') {
            element.style.setProperty('--scale', (0.7 + Math.random() * 0.6).toFixed(2));
            element.style.setProperty('--alpha', (0.12 + Math.random() * 0.25).toFixed(2));
            element.style.setProperty('--blur', `${(Math.random() * 0.4).toFixed(2)}px`);
            duration = 9 + Math.random() * 10;
        }

        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;
        
        // Add to the background
        background.appendChild(element);
    }
});
