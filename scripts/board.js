function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        board.appendChild(tile);
    }
}

function updateTiles(boardState) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const value = boardState[row][col];
        tile.textContent = value !== 0 ? value : '';
        tile.style.backgroundColor = getTileColor(value);
    });
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
    };
    return colors[value] || '#3e3933';
}
