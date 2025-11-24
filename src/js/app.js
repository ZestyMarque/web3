import { Game2048 } from './game.js';
import { Renderer } from './renderer.js';
import { Controls } from './controls.js';
import { StorageManager } from './storage.js';

window.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid');
    const scoreEl = document.getElementById('score');
    const modalEnd = document.getElementById('endModal');
    const modalBoard = document.getElementById('leaderboardModal');
    const btnRestart = document.getElementById('btn-restart');
    const btnUndo = document.getElementById('btn-undo');
    const btnLeaderboard = document.getElementById('btn-open-board');
    const btnCloseBoard = document.getElementById('board-close');
    const btnSave = document.getElementById('saveScore');
    const inputName = document.getElementById('playerName');
    const messageEnd = document.getElementById('endMessage');
    const tableBody = document.querySelector('#boardTable tbody');

    const game = new Game2048(4);
    const renderer = new Renderer(gridContainer);
    const storage = new StorageManager();

    renderer.createGrid(4);

    const saved = storage.loadState();
    if (saved) {
        game.grid = saved.grid;
        game.score = saved.score;
    } else {
        game.spawnTile();
        game.spawnTile();
    }

    renderer.render(game.grid);
    scoreEl.textContent = game.score;

    const controls = new Controls({
        onMove: dir => {
            if (game.isGameOver()) return;
            const moved = game.move(dir);
            if (moved) {
                renderer.render(game.grid);
                scoreEl.textContent = game.score;
                storage.saveState(game.grid, game.score);
            }
            if (game.isGameOver()) showEnd();
        },
        onUndo: () => {
            if (game.undo()) {
                renderer.render(game.grid);
                scoreEl.textContent = game.score;
                storage.saveState(game.grid, game.score);
            }
        },
        onRestart: () => restart()
    });

    controls.installKeyboard();
    controls.installSwipe(gridContainer);
    controls.installUndo(btnUndo);
    controls.installRestart(btnRestart);

    btnLeaderboard.addEventListener('click', () => showBoard());
    btnCloseBoard.addEventListener('click', () => modalBoard.style.display = 'none');

    btnSave.addEventListener('click', () => {
        const name = inputName.value.trim();
        if (!name) return;

        const list = storage.addRecord(name, game.score);
        inputName.style.display = 'none';
        btnSave.style.display = 'none';
        messageEnd.textContent = 'Ваш рекорд сохранён!';
        fillTable(list);
    });

    function restart() {
        game.grid = game.createEmptyGrid();
        game.score = 0;
        game.history = [];
        game.spawnTile();
        game.spawnTile();
        renderer.render(game.grid);
        scoreEl.textContent = 0;
        storage.clearState();
        modalEnd.style.display = 'none';
    }

    function showEnd() {
        modalEnd.style.display = 'block';
        inputName.style.display = 'block';
        btnSave.style.display = 'block';
        messageEnd.textContent = 'Игра окончена! Введите имя:';
    }

    function showBoard() {
        const list = storage.loadRecords();
        fillTable(list);
        modalBoard.style.display = 'block';
    }

    function fillTable(list) {
        tableBody.innerHTML = '';
        list.forEach(r => {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = r.name;
            const tdScore = document.createElement('td');
            tdScore.textContent = r.score;
            const tdDate = document.createElement('td');
            tdDate.textContent = r.date;

            tr.appendChild(tdName);
            tr.appendChild(tdScore);
            tr.appendChild(tdDate);
            tableBody.appendChild(tr);
        });
    }
});

// app.js
export class Game {
    constructor(size, storage, utils) {
        this.size = size;
        this.storage = storage;
        this.utils = utils;
        this.grid = this.utils.createEmptyGrid(size);
        this.score = 0;
        this.history = [];
        this.loadState();
    }

    start() {
        if (this.utils.countTiles(this.grid) === 0) {
            this.utils.addRandomTile(this.grid);
            this.utils.addRandomTile(this.grid);
            this.saveState();
        }
    }

    move(direction) {
        const backup = this.utils.clone(this.grid);
        const { grid, scoreGained } = this.utils.performMove(this.grid, direction);

        if (!this.utils.areEqual(backup, grid)) {
            this.history.push({ grid: backup, score: this.score });
            this.grid = grid;
            this.score += scoreGained;

            const tilesAdded = Math.random() < 0.5 ? 1 : 2;
            for (let i = 0; i < tilesAdded; i++) this.utils.addRandomTile(this.grid);

            this.saveState();
        }
    }

    undo() {
        if (this.history.length > 0) {
            const prev = this.history.pop();
            this.grid = prev.grid;
            this.score = prev.score;
            this.saveState();
        }
    }

    reset() {
        this.grid = this.utils.createEmptyGrid(this.size);
        this.score = 0;
        this.history = [];
        this.utils.addRandomTile(this.grid);
        this.saveState();
    }

    isGameOver() {
        return !this.utils.hasMoves(this.grid);
    }

    saveState() {
        this.storage.saveGame(this.grid, this.score, this.history);
    }

    loadState() {
        const data = this.storage.loadGame();
        if (data) {
            this.grid = data.grid;
            this.score = data.score;
            this.history = data.history;
        }
    }
}


// controls.js
export function setupControls(game, callbackRender) {
    document.addEventListener("keydown", (e) => {
        const map = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right"
        };
        if (map[e.key]) {
            game.move(map[e.key]);
            callbackRender();
        }
    });

    const up = document.getElementById("btn-up");
    const down = document.getElementById("btn-down");
    const left = document.getElementById("btn-left");
    const right = document.getElementById("btn-right");

    if (up) up.onclick = () => { game.move("up"); callbackRender(); };
    if (down) down.onclick = () => { game.move("down"); callbackRender(); };
    if (left) left.onclick = () => { game.move("left"); callbackRender(); };
    if (right) right.onclick = () => { game.move("right"); callbackRender(); };
}


// storage.js
export class Storage {
    saveGame(grid, score, history) {
        localStorage.setItem("game_state", JSON.stringify({ grid, score, history }));
    }

    loadGame() {
        const data = localStorage.getItem("game_state");
        return data ? JSON.parse(data) : null;
    }

    saveRecord(name, score) {
        const records = this.loadRecords();
        const now = new Date().toLocaleString();
        records.push({ name, score, date: now });
        records.sort((a, b) => b.score - a.score);
        localStorage.setItem("leaderboard", JSON.stringify(records.slice(0, 10)));
    }

    loadRecords() {
        return JSON.parse(localStorage.getItem("leaderboard")) || [];
    }
}


// utils.js
export const utils = {
    createEmptyGrid(size) {
        return Array.from({ length: size }, () => Array(size).fill(0));
    },

    clone(grid) {
        return grid.map(row => [...row]);
    },

    areEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    },

    countTiles(grid) {
        return grid.flat().filter(x => x !== 0).length;
    },

    addRandomTile(grid) {
        const empty = [];
        grid.forEach((row, r) => row.forEach((val, c) => {
            if (val === 0) empty.push([r, c]);
        }));
        if (empty.length === 0) return;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    },

    performMove(grid, direction) {
        const size = grid.length;
        let score = 0;
        let newGrid = this.clone(grid);

        const moveLine = (line) => {
            const arr = line.filter(n => n !== 0);
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    score += arr[i];
                    arr[i + 1] = 0;
                }
            }
            return arr.filter(n => n !== 0).concat(Array(size).fill(0)).slice(0, size);
        };

        for (let r = 0; r < size; r++) {
            let row = newGrid[r];
            if (direction === "left") newGrid[r] = moveLine(row);
            if (direction === "right") newGrid[r] = moveLine(row.reverse()).reverse();
        }

        if (direction === "up" || direction === "down") {
            for (let c = 0; c < size; c++) {
                const col = newGrid.map(row => row[c]);
                const moved = direction === "up" ? moveLine(col) : moveLine(col.reverse()).reverse();
                moved.forEach((val, r) => newGrid[r][c] = val);
            }
        }

        return { grid: newGrid, scoreGained: score };
    },

    hasMoves(grid) {
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid.length; c++) {
                if (grid[r][c] === 0) return true;
                if (c < grid.length - 1 && grid[r][c] === grid[r][c + 1]) return true;
                if (r < grid.length - 1 && grid[r][c] === grid[r + 1][c]) return true;
            }
        }
        return false;
    }
};
