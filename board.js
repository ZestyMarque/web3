// board.js - rendering и DOM-утилиты (без innerHTML)
const gridEl = document.getElementById('grid');

// контейнер для плиток (положение абсолютное)
const tilesContainer = document.createElement('div');
tilesContainer.classList.add('tiles-container');
tilesContainer.style.position = 'absolute';
tilesContainer.style.inset = '15px';
tilesContainer.style.width = 'calc(100% - 30px)';
tilesContainer.style.height = 'calc(100% - 30px)';
tilesContainer.style.pointerEvents = 'none';
gridEl.appendChild(tilesContainer);

// задний фон - ячейки сетки
for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    gridEl.appendChild(cell);
}

export let tiles = [];

export function createTile(value, x, y) {
    const tile = document.createElement('div');
    tile.classList.add('tile', 'new');
    tile.dataset.value = value;
    tile.textContent = value;
    tile.dataset.x = x;
    tile.dataset.y = y;
    setPosition(tile, x, y);
    updateTileColor(tile, value);
    tilesContainer.appendChild(tile);
    requestAnimationFrame(() => tile.classList.remove('new'));
    tiles.push(tile);
    return tile;
}

export function setPosition(tile, x, y) {
    tile.style.position = 'absolute';
    tile.style.width = `calc(25% - 11.25px)`;
    tile.style.height = `calc(25% - 11.25px)`;
    tile.style.left = `${(x * 25) + (x * 3.75)}%`;
    tile.style.top = `${(y * 25) + (y * 3.75)}%`;
    tile.dataset.x = x;
    tile.dataset.y = y;
}

export function updateTileColor(tile, value) {
    [...tile.classList].forEach(cls => {
        if (cls.startsWith('tile-') && cls !== 'tile') tile.classList.remove(cls);
    });
    tile.classList.add(`tile-${value}`);
    if (value >= 8) tile.style.color = '#f9f6f2';
    else tile.style.color = '#776e65';
}

export function moveTile(tile, x, y) {
    tile.classList.add('moving');
    setPosition(tile, x, y);
    setTimeout(() => tile.classList.remove('moving'), 180);
}

export function mergeTile(tile, value) {
    tile.textContent = value;
    tile.dataset.value = value;
    updateTileColor(tile, value);
    tile.classList.add('merged');
    setTimeout(() => tile.classList.remove('merged'), 220);
}

export function removeTile(tile) {
    if (!tile) return;
    if (tile.parentNode) tile.parentNode.removeChild(tile);
    tiles = tiles.filter(t => t !== tile);
}

export function clearAllTiles() {
    // избегаем innerHTML
    while (tilesContainer.firstChild) {
        tilesContainer.removeChild(tilesContainer.firstChild);
    }
    tiles = [];
}

export function initBoard() {
    clearAllTiles();
    tiles = [];
}
