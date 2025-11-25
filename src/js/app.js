import { Game } from './game.js';
import { Renderer } from './renderer.js';
import { Storage } from './storage.js';
import { setupControls } from './controls.js';

class App {
    constructor() {
        this.game = new Game();
        this.storage = new Storage();
        this.container = document.getElementById('game-container');
        this.renderer = new Renderer(this.game, this.container);

        this.scoreElement = document.getElementById('score');
        this.gameOverModal = document.getElementById('game-over');
        this.leaderboardModal = document.getElementById('leaderboard');
        this.mobileControls = document.getElementById('mobile-controls');

        this.bindEvents();
        this.loadGame();
        this.render();
        this.updateScore();
        this.showMobileControlsIfNeeded();
    }

    bindEvents() {
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('undo').addEventListener('click', () => this.undo());
        document.getElementById('leaderboard-btn').addEventListener('click', () => this.showLeaderboard());

        document.getElementById('save-score').addEventListener('click', () => this.saveScore());
        document.getElementById('restart').addEventListener('click', () => this.newGame());
        document.getElementById('close-leaderboard').addEventListener('click', () => this.hideLeaderboard());

        document.getElementById('player-name').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.saveScore();
        });

        setupControls((direction) => this.move(direction));
    }

    move(direction) {
        if (this.game.isOver) return;

        const moved = this.game.move(direction);
        if (moved) {
            this.saveGame();
            this.render();
            this.updateScore();

            if (this.game.isOver) {
                this.showGameOver();
            }
        }
    }

    undo() {
        this.game.undo();
        this.render();
        this.updateScore();
        this.saveGame();
    }

    newGame() {
        this.game.reset();
        this.render();
        this.updateScore();
        this.hideGameOver();
        this.saveGame();
    }

    render() {
        this.renderer.render();
    }

    updateScore() {
        this.scoreElement.textContent = this.game.score;
        document.getElementById('final-score').textContent = this.game.score;
    }

    showGameOver() {
        this.gameOverModal.classList.remove('hidden');
        document.getElementById('player-name').focus();
    }

    hideGameOver() {
        this.gameOverModal.classList.add('hidden');
        document.getElementById('player-name').value = '';
        document.getElementById('saved-message').classList.add('hidden');
        document.getElementById('name-input-container').style.display = 'block';
    }

    saveScore() {
        const nameInput = document.getElementById('player-name');
        let name = nameInput.value.trim() || 'Аноним';

        this.storage.saveRecord(name, this.game.score);
        this.showLeaderboard();

        document.getElementById('name-input-container').style.display = 'none';
        document.getElementById('saved-message').classList.remove('hidden');
    }

    showLeaderboard() {
        const tbody = document.querySelector('#leaderboard-table tbody');
        tbody.innerHTML = '';

        const records = this.storage.getTop10();
        records.forEach((rec, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${rec.name}</td>
                <td>${rec.score}</td>
                <td>${new Date(rec.date).toLocaleDateString('ru-RU')}</td>
            `;
            tbody.appendChild(tr);
        });

        this.leaderboardModal.classList.remove('hidden');
    }

    hideLeaderboard() {
        this.leaderboardModal.classList.add('hidden');
    }

    saveGame() {
        this.storage.saveGame(this.game);
    }

    loadGame() {
        const saved = this.storage.loadGame();
        if (saved) {
            this.game.board = saved.board;
            this.game.score = saved.score;
            this.game.previousBoard = saved.previousBoard || null;
            this.game.previousScore = saved.previousScore || null;
            this.game.isOver = saved.isOver || false;
        }
    }

    showMobileControlsIfNeeded() {
        if (window.innerWidth <= 480) {
            this.mobileControls.classList.remove('hidden');
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
