import { initGame, handleMove, undoMove } from './game.js';

const mobileControls = document.getElementById('mobile-controls');
let touchStartX = 0;
let touchStartY = 0;

function initControls() {
    if (window.innerWidth <= 640) createMobileButtons();

    document.getElementById('restart-btn').addEventListener('click', () => initGame(true));
    document.getElementById('undo-btn').addEventListener('click', undoMove);

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp') { e.preventDefault(); handleMove('up'); }
        if (e.key === 'ArrowDown') { e.preventDefault(); handleMove('down'); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); handleMove('left'); }
        if (e.key === 'ArrowRight') { e.preventDefault(); handleMove('right'); }
    });

    document.getElementById('grid').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        e.preventDefault();
    }, {passive: false});

    document.getElementById('grid').addEventListener('touchend', e => {
        if (!touchStartX || !touchStartY) return;
        const x = e.changedTouches[0].screenX;
        const y = e.changedTouches[0].screenY;
        const diffX = touchStartX - x;
        const diffY = touchStartY - y;
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        if (Math.max(absX, absY) > 30) {
            if (absX > absY) {
                handleMove(diffX > 0 ? 'left' : 'right');
            } else {
                handleMove(diffY > 0 ? 'up' : 'down');
            }
        }
        touchStartX = 0;
        touchStartY = 0;
    });
}

function createMobileButtons() {
    const buttons = [
        {text: '↑', dir: 'up', area: 'up'},
        {text: '↓', dir: 'down', area: 'down'},
        {text: '←', dir: 'left', area: 'left'},
        {text: '→', dir: 'right', area: 'right'}
    ];
    buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.textContent = b.text;
        btn.onclick = () => handleMove(b.dir);
        btn.style.gridArea = b.area;
        mobileControls.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', initControls);
