const grid = document.getElementById('grid');
const tilesContainer = document.createElement('div');
tilesContainer.classList.add('tiles-container');
grid.appendChild(tilesContainer);

for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    grid.appendChild(cell);
}

export function createTile(value, x, y) {
    const tile = document.createElement('div');
    tile.classList.add('tile', 'new');
    tile.dataset.value = value;
    tile.textContent = value;
    tile.style.left = `${x * 25 + x * 3.75}%`;
    tile.style.top = `${y * 25 + y * 3.75}%`;
    updateTileColor(tile, value);
    tilesContainer.appendChild(tile);
    requestAnimationFrame(() => tile.classList.remove('new'));
    return tile;
}

export function updateTileColor(tile, value) {
    tile.classList.remove(...Array.from(tile.classList).filter(c => c.startsWith('tile-')));
    if (value >= 8) tile.style.color = '#f9f6f2';
    else tile.style.color = '#776e65';
    tile.classList.add(`tile-${value}`);
    tile.style.backgroundColor = getTileColor(value);
}

function getTileColor(value) {
    const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
        4096: '#e8c06b',
        8192: '#e8b86b'
    };
    return colors[value] || '#ff5e3b';
}

export function moveTile(tile, x, y) {
    tile.classList.add('moving');
    tile.style.left = `${x * 25 + x * 3.75}%`;
    tile.style.top = `${y * 25 + y * 3.75}%`;
    tile.dataset.x = x;
    tile.dataset.y = y;
    setTimeout(() => tile.classList.remove('moving'), 160);
}

export function mergeTile(tile, value) {
    tile.textContent = value;
    tile.dataset.value = value;
    updateTileColor(tile, value);
    tile.classList.add('merged');
    setTimeout(() => tile.classList.remove('merged'), 200);
}

export function removeTile(tile) {
    tilesContainer.removeChild(tile);
}

export function clearAllTiles() {
    tilesContainer.innerHTML = '';
}
