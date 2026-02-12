(() => {
    const shadow = document.querySelector('.shadow');
    const wrapper = document.querySelector('.wrapper');
    const heartsLayer = document.getElementById('hearts');
    const starsLayer = document.getElementById('stars');
    const hint = document.getElementById('hint');
    const hiddenText = document.getElementById('hiddenText');
    let inactivityTimer;
    // Set spotlight position and enable reactive mode
    const setSpot = (x, y) => {
        if (!shadow) return;
        shadow.classList.add('reactive');
        shadow.style.setProperty('--cX', `${(x / window.innerWidth) * 100}%`);
        shadow.style.setProperty('--cY', `${y}px`);
        checkTextReveal(x, y);
    };
    // Check if spotlight hovers over text and reveal with smooth mask effect
    const checkTextReveal = (x, y) => {
        const textRect = hiddenText?.getBoundingClientRect();
        if (!textRect) return;
        const textCenterX = textRect.left + textRect.width / 2;
        const textCenterY = textRect.top + textRect.height / 2;
        const distance = Math.hypot(x - textCenterX, y - textCenterY);

        // Update mask-image to follow cursor
        const maskX = x - textRect.left;
        const maskY = y - textRect.top;
        const maskGradient = `radial-gradient(circle 180px at ${maskX}px ${maskY}px,
rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%)`;
        hiddenText.style.maskImage = maskGradient;
        hiddenText.style.webkitMaskImage = maskGradient;

        // Reveal if spotlight is within range
        if (distance < 250) {
            hiddenText?.classList.add('revealed');
        } else {
            hiddenText?.classList.remove('revealed');
        }
    };
    // Handle cursor/touch movement
    const onMove = (e) => {
        const { clientX: x, clientY: y } = e.touches?.[0] ?? e;
        setSpot(x, y);
        swayLamp(x);
        hint?.classList.add('hidden');
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => hint?.classList.remove('hidden'), 3000);
    };
    // Lamp sway follows cursor
    const swayLamp = (x) => {
        if (!wrapper) return;
        const delta = Math.max(-1, Math.min(1, (x - window.innerWidth / 2) /
            (window.innerWidth / 2)));
        wrapper.style.transform = `rotate(${delta * 10}deg)`;
    };
    // Create floating heart with random properties
    const spawnHeart = () => {
        if (!heartsLayer) return;
        const h = document.createElement('div');
        h.className = 'heart';
        const props = {
            '--size': `${Math.random() * 14 + 12}px`,
            '--left': `${Math.random() * 100}%`,
            '--dur': `${Math.random() * 5 + 6}s`,
            '--dx': `${(Math.random() * 2 - 1) * 120}px`,
            '--op': Math.random() * 0.4 + 0.6,
            '--scale': Math.random() * 0.6 + 0.8
        };
        Object.entries(props).forEach(([k, v]) => h.style.setProperty(k, v));
        h.addEventListener('animationend', () => h.remove());
        heartsLayer.appendChild(h);
    };
    // Create twinkling background stars
    const spawnStar = () => {
        if (!starsLayer) return;
        const s = document.createElement('div');
        s.className = 'star';
        const props = {
            '--left': `${Math.random() * 100}%`,
            '--top': `${Math.random() * 100}%`,
            '--size': `${Math.random() * 1.5 + 0.5}px`,
            '--delay': `${Math.random() * 3}s`
        };
        Object.entries(props).forEach(([k, v]) => s.style.setProperty(k, v));
        s.addEventListener('animationend', () => s.remove());
        starsLayer.appendChild(s);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    for (let i = 0; i < 22; i++) setTimeout(spawnHeart, i * 120);
    setInterval(spawnHeart, 700);
    for (let i = 0; i < 15; i++) setTimeout(spawnStar, i * 200);
    setInterval(spawnStar, 2000);
    window.addEventListener('load', () => setSpot(window.innerWidth / 2, 260));
})();