export class Renderer {
    constructor(game, container) {
        this.game = game;
        this.container = container;
        this.tilesMap = new Map(); 

        this.clearAndCreateGrid();
    }

    clearAndCreateGrid() {
        this.container.innerHTML = '';
        this.tilesMap.clear();


        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            this.container.appendChild(cell);
        }
    }

    render() {
        const currentValues = new Map(); 


        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const val = this.game.board[i][j];
                if (val !== 0) {
                    currentValues.set(`${i}-${j}`, val);
                }
            }
        }

        for (const [key, tile] of this.tilesMap) {
            if (!currentValues.has(key)) {
                tile.classList.add('removed');
                setTimeout(() => tile.remove(), 200);
                this.tilesMap.delete(key);
            }
        }

        for (const [key, value] of currentValues) {
            const [x, y] = key.split('-').map(Number);
            let tile = this.tilesMap.get(key);

            if (!tile) {
                tile = this.createTileElement(value, x, y);
                tile.classList.add('new');
                this.container.appendChild(tile);
                this.tilesMap.set(key, tile);
            } else {
                tile.textContent = value;
                tile.dataset.value = value;
                tile.dataset.x = x;
                tile.dataset.y = y;

                tile.classList.remove('new', 'merge', 'move');
                void tile.offsetWidth; 


                if (tile.justMerged) {
                    tile.classList.add('merge');
                    delete tile.justMerged;
                } else {
                    tile.classList.add('move');
                }
            }
        }
    }

    markMerges(mergedPositions) {
        for (const [x, y] of mergedPositions) {
            const key = `${x}-${y}`;
            const tile = this.tilesMap.get(key);
            if (tile) {
                tile.justMerged = true;
            }
        }
    }

    createTileElement(value, x, y) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = value;
        tile.dataset.value = value;
        tile.dataset.x = x;
        tile.dataset.y = y;
        return tile;
    }

    clear() {
        this.container.innerHTML = '';
        this.tilesMap.clear();
        this.clearAndCreateGrid();
    }
}
