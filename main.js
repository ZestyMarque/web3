import { initGame } from './game.js';
import { showGameOver } from './leaderboard.js';
import { loadGame } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const saved = loadGame();
    if (saved) {
        initGame(false);
    } else {
        initGame(true);
    }

    window.showGameOver = showGameOver;
});
