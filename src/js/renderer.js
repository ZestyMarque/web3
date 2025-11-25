// src/js/renderer.js
export class Renderer {
    constructor(container) {
        this.container = container;
        this.tiles = new Map(); // "x-y" → element
        this.createGrid();
    }

    createGrid() {
        this.container.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            this.container.appendChild(cell);
        }
    }

    render(board) {
        const current = new Map();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j]) current.set(`${i}-${j}`, board[i][j]);
            }
        }

        // Удаляем исчезнувшие плитки
        for (const [key, tile] of this.tiles) {
            if (!current.has(key)) {
                tile.classList.add('removed');
                setTimeout(() => tile.remove(), 200);
                this.tiles.delete(key);
            }
        }

        // Обновляем/создаём плитки
        for (const [key, value] of current) {
            const [x, y] = key.split('-').map(Number);
            let tile = this.tiles.get(key);

            if (!tile) {
                tile = document.createElement('div');
                tile.className = 'tile new';
                tile.dataset.value = value;
                tile.textContent = value;
                tile.dataset.x = x;
                tile.dataset.y = y;
                this.container.appendChild(tile);
                this.tiles.set(key, tile);
                void tile.offsetWidth; // reflow
                tile.classList.remove('new');
            } else {
                if (tile.dataset.value != value) {
                    tile.classList.add('merge');
                    tile.dataset.value = value;
                    tile.textContent = value;
                    setTimeout(() => tile.classList.remove('merge'), 250);
                }
                tile.dataset.x = x;
                tile.dataset.y = y;
            }
        }
    }

    clear() {
        this.tiles.clear();
        this.createGrid();
    }
}
