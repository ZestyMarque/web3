import { initGame } from './game.js';
import { showGameOver } from './leaderboard.js';
import { loadGame } from './storage.js';
import './controls.js'; // подключаем контролы (они зарегистрируют слушателей)

document.addEventListener('DOMContentLoaded', () => {
    const saved = loadGame();
    if (saved) {
        initGame(false);
    } else {
        initGame(true);
    }

    // expose for game.js to call when нужно показать overlay
    window.showGameOver = showGameOver;
});
