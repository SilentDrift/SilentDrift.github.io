function goToHomepage() {
    window.location.href = "https://silentdrift.github.io/";
}

// Generate animated elements in the void space
document.addEventListener('DOMContentLoaded', function() {
    const background = document.querySelector('.animated-background');
    const elementTypes = ['sunflower', 'personal-note', 'thought-bubble'];
    const personalNotes = [
        'Game Theory', 
        'Reinforcement Learning',
        'Thinking is overrated',
        'Love is underrated',
        'Systems Dynamics',
        'Reflections',
        'Emotion matters',
        'Creativity thrives'
    ];
    
    // Create 20 random animated elements
    for (let i = 0; i < 20; i++) {
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
        
        // Set random animation duration and delay
        const duration = 3 + Math.random() * 7; // 3-10 seconds
        const delay = Math.random() * 5; // 0-5 seconds
        element.style.animationDuration = `${duration}s`;
        element.style.animationDelay = `${delay}s`;
        
        // Add content based on type
        if (elementType === 'sunflower') {
            element.textContent = '🌻';
        } else if (elementType === 'personal-note') {
            const noteIndex = Math.floor(Math.random() * personalNotes.length);
            element.textContent = personalNotes[noteIndex];
        }
        
        // Add to the background
        background.appendChild(element);
    }
});
