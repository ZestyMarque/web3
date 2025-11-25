export function setupControls(onMove) {
    const keyMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up', W: 'up',
        s: 'down', S: 'down',
        a: 'left', A: 'left',
        d: 'right', D: 'right'
    };

    document.addEventListener('keydown', (e) => {
        if (keyMap[e.key]) {
            e.preventDefault();
            onMove(keyMap[e.key]);
        }
    });

    document.querySelectorAll('#mobile-controls button').forEach(btn => {
        btn.addEventListener('click', () => {
            onMove(btn.dataset.dir);
        });
    });

    let touchStartX = 0;
    let touchStartY = 0;

    const gameContainer = document.getElementById('game-container');

    gameContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });

    gameContainer.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        const minSwipe = 30;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > minSwipe) {
                onMove(diffX > 0 ? 'right' : 'left');
            }
        } else {
            if (Math.abs(diffY) > minSwipe) {
                onMove(diffY > 0 ? 'down' : 'up');
            }
        }

        touchStartX = 0;
        touchStartY = 0;
    });
}
