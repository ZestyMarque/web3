// src/js/controls.js
export function setupControls(callback) {
    const map = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right'
    };

    document.addEventListener('keydown', e => {
        if (map[e.key]) {
            e.preventDefault();
            callback(map[e.key]);
        }
    });

    // мобильные кнопки
    document.querySelectorAll('#mobile-controls button').forEach(btn => {
        btn.addEventListener('click', () => callback(btn.dataset.dir));
    });

    // свайпы
    let sx, sy;
    const field = document.getElementById('game-container');
    field.addEventListener('touchstart', e => {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });

    field.addEventListener('touchend', e => {
        if (!sx || !sy) return;
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        const absX = Math.abs(dx), absY = Math.abs(dy);
        if (Math.max(absX, absY) > 30) {
            if (absX > absY) callback(dx > 0 ? 'right' : 'left');
            else callback(dy > 0 ? 'down' : 'up');
        }
        sx = sy = null;
    });
}
