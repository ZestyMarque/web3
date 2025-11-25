import { saveGame, loadGame, clearGame } from './storage.js';
import { createTile, moveTile, mergeTile, removeTile, clearAllTiles, setPosition, tiles } from './board.js';

const GRID_SIZE = 4;
let grid = [];
let score = 0;
let history = [];

export function initGame(isNew = true) {
    grid = Array.from({length: GRID_SIZE}, () => Array(GRID_SIZE).fill(0));
    score = 0;
    document.getElementById('score').textContent = '0';
    clearAllTiles();
    history = [];

    if (!isNew) {
        const saved = loadGame();
        if (saved) {
            grid = saved.grid;
            score = saved.score;
            document.getElementById('score').textContent = score;
            if (Array.isArray(saved.tiles)) {
                saved.tiles.forEach(t => {
                    createTile(t.value, t.x, t.y);
                });
            }
        }
    }

    if (grid.flat().every(v => v === 0)) {
        const startCount = Math.floor(Math.random() * 3) + 1; // 1-3 стартовых плитки
        for (let i = 0; i < startCount; i++) addRandomTile();
    }

    saveState();
}

function saveState() {
    const state = {
        grid: grid.map(row => [...row]),
        tiles: tiles.map(t => ({
            value: Number(t.dataset.value),
            x: Number(t.dataset.x),
            y: Number(t.dataset.y)
        })),
        score
    };
    history.push(state);
    // ограничим историю до 50 состояний
    if (history.length > 50) history.shift();
    saveGame(state);
}

export function undoMove() {
    if (history.length <= 1) return;
    history.pop();
    const prev = history[history.length - 1];
    grid = prev.grid.map(row => [...row]);
    score = prev.score;
    document.getElementById('score').textContent = score;
    clearAllTiles();
    prev.tiles.forEach(t => {
        createTile(t.value, t.x, t.y);
    });
}

function addRandomTile() {
    const empty = [];
    for (let y = 0; y < GRID_SIZE; y++)
        for (let x = 0; x < GRID_SIZE; x++)
            if (grid[y][x] === 0) empty.push({x, y});
    if (!empty.length) return false;
    const pos = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    grid[pos.y][pos.x] = value;
    createTile(value, pos.x, pos.y);
    return true;
}

function rotateGrid() {
    const newGrid = Array.from({length: GRID_SIZE}, () => Array(GRID_SIZE).fill(0));
    for (let y = 0; y < GRID_SIZE; y++)
        for (let x = 0; x < GRID_SIZE; x++)
            newGrid[x][GRID_SIZE - 1 - y] = grid[y][x];
    grid = newGrid;
}

function moveLeft() {
    let moved = false;
    let points = 0;
    for (let y = 0; y < GRID_SIZE; y++) {
        let row = grid[y].filter(v => v);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                points += row[i];
                row.splice(i + 1, 1);
                i++;
                moved = true;
            }
        }
        while (row.length < GRID_SIZE) row.push(0);
        if (grid[y].join() !== row.join()) moved = true;
        grid[y] = row;
    }
    return {moved, points};
}

function applyVisualMoves() {
    // простая, надёжная стратегия: полностью перерисовать плитки из grid
    clearAllTiles();
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const v = grid[y][x];
            if (v) createTile(v, x, y);
        }
    }
}

export function handleMove(dir) {
    const before = grid.map(row => [...row]);
    let moved = false;
    let points = 0;

    if (dir === 'left') ({moved, points} = moveLeft());
    if (dir === 'right') { grid = grid.map(row => [...row.reverse()]); ({moved, points} = moveLeft()); grid = grid.map(row => [...row.reverse()]); }
    if (dir === 'up') { for (let i = 0; i < 3; i++) rotateGrid(); ({moved, points} = moveLeft()); rotateGrid(); }
    if (dir === 'down') { rotateGrid(); ({moved, points} = moveLeft()); for (let i = 0; i < 3; i++) rotateGrid(); }

    if (moved) {
        score += points;
        document.getElementById('score').textContent = score;
        applyVisualMoves();
        addRandomTile();
        saveState();
        if (!hasMoves()) setTimeout(() => window.showGameOver && window.showGameOver(score), 500);
    }
}

function hasMoves() {
    if (grid.flat().includes(0)) return true;
    for (let y = 0; y < GRID_SIZE; y++)
        for (let x = 0; x < GRID_SIZE; x++)
            if ((x < 3 && grid[y][x] === grid[y][x+1]) || (y < 3 && grid[y][x] === grid[y+1][x])) return true;
    return false;
}
