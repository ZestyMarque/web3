import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { Storage } from './storage.js';
import { setupControls } from './controls.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    const scoreEl = document.getElementById('score');
    const finalScoreEl = document.getElementById('final-score');
    const gameOverModal = document.getElementById('game-over');
    const leaderboardModal = document.getElementById('leaderboard');

    const game = new Game();
    const renderer = new Renderer(container);
    const storage = new Storage();

    // Загрузка сохранённой игры
    const saved = storage.loadGame();
    if (saved) {
        game.board = saved.board;
        game.score = saved.score;
        game.previousBoard = saved.previousBoard;
        game.previousScore = saved.previousScore;
        game.isOver = saved.isOver;
    }

    const update = () => {
        renderer.render(game.board);
        scoreEl.textContent = game.score;
        finalScoreEl.textContent = game.score;
    };

    const move = dir => {
        if (game.move(dir)) {
            storage.saveGame(game);
            update();
            if (game.isOver) showGameOver();
        }
    };

    setupControls(move);

    document.getElementById('new-game').onclick = () => {
        game.reset();
        storage.clearGame();
        update();
        gameOverModal.classList.add('hidden');
    };

    document.getElementById('undo').onclick = () => {
        game.undo();
        update();
    };

    document.getElementById('leaderboard-btn').onclick = showLeaderboard;
    document.getElementById('close-leaderboard').onclick = () => leaderboardModal.classList.add('hidden');

    document.getElementById('save-score').onclick = () => {
        const name = document.getElementById('player-name').value.trim() || 'Аноним';
        storage.saveRecord(name, game.score);
        document.getElementById('name-input-container').style.display = 'none';
        document.getElementById('saved-message').classList.remove('hidden');
        showLeaderboard();
    };

    document.getElementById('restart').onclick = () => document.getElementById('new-game').click();

    function showGameOver() {
        gameOverModal.classList.remove('hidden');
        document.getElementById('player-name').focus();
    }

    function showLeaderboard() {
        const tbody = leaderboardModal.querySelector('tbody');
        tbody.innerHTML = '';
        storage.getRecords().forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${i + 1}</td><td>${r.name}</td><td>${r.score}</td><td>${new Date(r.date).toLocaleDateString('ru')}</td>`;
            tbody.appendChild(tr);
        });
        leaderboardModal.classList.remove('hidden');
    }

    update();
});
