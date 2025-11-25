import { saveGame, loadGame, clearGame } from './storage.js';
import { createTile, moveTile, mergeTile, removeTile, clearAllTiles, updateTileColor } from './board.js';

const GRID_SIZE = 4;
let grid = [];
let tiles = [];
let score = 0;
let history = [];
let canUndo = true;

export function initGame(isNew = true) {
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    tiles = [];
    score = 0;
    updateScore(0);
    clearAllTiles();
    if (isNew) {
        clearGame();
        addRandomTile();
        addRandomTile();
        canUndo = true;
    } else {
        const saved = loadGame();
        if (saved) {
            grid = saved.grid;
            score = saved.score;
            updateScore(0);
            saved.tiles.forEach(t => {
                const tile = createTile(t.value, t.x, t.y);
                tile.dataset.x = t.x;
                tile.dataset.y = t.y;
            });
            tiles = [...document.querySelectorAll('.tile')];
        } else {
            addRandomTile();
            addRandomTile();
        }
    }
    saveCurrentState();
}

function saveCurrentState() {
    const state = {
        grid: grid.map(row => row.slice()),
        tiles: Array.from(tiles).map(t => ({
            value: Number(t.dataset.value),
            x: Number(t.dataset.x),
            y: Number(t.dataset.y)
        })),
        score
    };
    history.push(state);
    saveGame(state);
}

export function undoMove() {
    if (history.length < 2 || !canUndo) return;
    history.pop();
    const prev = history[history.length - 1];
    grid = prev.grid.map(row => row.slice());
    score = prev.score;
    updateScore(0);
    clearAllTiles();
    tiles = [];
    prev.tiles.forEach(t => {
        const tile = createTile(t.value, t.x, t.y);
        tile.dataset.x = t.x;
        tile.dataset.y = t.y;
        tiles.push(tile);
    });
    canUndo = false;
    setTimeout(() => canUndo = true, 200);
}

function updateScore(add) {
    score += add;
    document.getElementById('score').textContent = score;
}

function addRandomTile() {
    const empty = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] === 0) empty.push({x, y});
        }
    }
    if (empty.length === 0) return false;
    const {x, y} = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    grid[y][x] = value;
    const tile = createTile(value, x, y);
    tile.dataset.x = x;
    tile.dataset.y = y;
    tiles.push(tile);
    return true;
}

function move(direction) {
    let moved = false;
    let points = 0;
    const newGrid = grid.map(row => row.slice());

    const rotate = () => grid = grid[0].map((_, i) => grid.map(row => row[GRID_SIZE - 1 - i]));
    const moveLeft = () => {
        for (let y = 0; y < GRID_SIZE; y++) {
            let row = grid[y].filter(v => v !== 0);
            for (let x = 0; x < row.length - 1; x++) {
                if (row[x] === row[x + 1]) {
                    row[x] *= 2;
                    points += row[x];
                    row[x + 1] = 0;
                }
            }
            row = row.filter(v => v !== 0);
            while (row.length < GRID_SIZE) row.push(0);
            if (grid[y].join() !== row.join()) moved = true;
            newGrid[y] = row;
        }
    };

    if (direction === 'left') moveLeft();
    else if (direction === 'right') { grid = grid.map(row => row.reverse()); moveLeft(); grid = grid.map(row => row.reverse()); }
    else if (direction === 'up') { rotate(); rotate(); rotate(); moveLeft(); rotate(); }
    else if (direction === 'down') { rotate(); moveLeft(); rotate(); rotate(); rotate(); }

    grid = newGrid;

    if (moved) {
        updateScore(points);
        applyMoves();
        addRandomTile();
        saveCurrentState();
        if (!hasMoves()) setTimeout(() => document.getElementById('game-over').classList.remove('hidden'), 400);
    }
}

function applyMoves() {
    tiles.forEach(tile => {
        const x = Number(tile.dataset.x);
        const y = Number(tile.dataset.y);
        const value = Number(tile.dataset.value);
        if (grid[y][x] === value) return;
        for (let ny = 0; ny < GRID_SIZE; ny++) {
            for (let nx = 0; nx < GRID_SIZE; nx++) {
                if (grid[ny][nx] === value) {
                    if (nx !== x || ny !== y) moveTile(tile, nx, ny);
                    if (grid[ny][nx] !== value * 2) return;
                    mergeTile(tile, value * 2);
                    grid[ny][nx] = 0;
                    return;
                }
            }
        }
        removeTile(tile);
    });
    tiles = document.querySelectorAll('.tile');
}

function hasMoves() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x] === 0) return true;
            if (x < 3 && grid[y][x] === grid[y][x + 1]) return true;
            if (y < 3 && grid[y][x] === grid[y + 1][x]) return true;
        }
    }
    return false;
}

export function handleMove(dir) {
    move(dir);
}
