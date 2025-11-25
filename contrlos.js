import { handleMove, undoMove, initGame } from './game.js';

const mobileControls = document.getElementById('mobile-controls');

function initMobileButtons() {
    if (!mobileControls) return;
    if (window.innerWidth > 640) {
        // убираем кнопки на десктопе
        while (mobileControls.firstChild) mobileControls.removeChild(mobileControls.firstChild);
        mobileControls.style.display = 'none';
        return;
    }

    mobileControls.style.display = 'grid';
    while (mobileControls.firstChild) mobileControls.removeChild(mobileControls.firstChild);

    const buttons = [
        { text: '↑', dir: 'up',    area: 'up' },
        { text: '↓', dir: 'down',  area: 'down' },
        { text: '←', dir: 'left',  area: 'left' },
        { text: '→', dir: 'right', area: 'right' }
    ];

    buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.textContent = b.text;
        btn.style.gridArea = b.area;
        btn.onclick = () => handleMove(b.dir);
        mobileControls.appendChild(btn);
    });
}

document.getElementById('restart-btn').addEventListener('click', () => initGame(true));
document.getElementById('undo-btn').addEventListener('click', undoMove);

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp')    { e.preventDefault(); handleMove('up'); }
    if (e.key === 'ArrowDown')  { e.preventDefault(); handleMove('down'); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); handleMove('left'); }
    if (e.key === 'ArrowRight') { e.preventDefault(); handleMove('right'); }
});

// swipe
let startX = null, startY = null;
const gridEl = document.getElementById('grid');
gridEl.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}, { passive: true });

gridEl.addEventListener('touchend', e => {
    if (startX === null || startY === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;
    const minSwipe = 30;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipe) handleMove(diffX > 0 ? 'left' : 'right');
    } else {
        if (Math.abs(diffY) > minSwipe) handleMove(diffY > 0 ? 'up' : 'down');
    }
    startX = null;
    startY = null;
});

document.addEventListener('DOMContentLoaded', initMobileButtons);
window.addEventListener('resize', initMobileButtons);
