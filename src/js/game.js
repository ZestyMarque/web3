export class Game2048 {
    constructor(size = 4) {
        this.size = size;
        this.grid = this.createEmptyGrid();
        this.score = 0;
        this.history = [];
    }

    createEmptyGrid() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    saveState() {
        this.history.push({ grid: this.cloneGrid(this.grid), score: this.score });
        if (this.history.length > 50) this.history.shift();
    }

    undo() {
        if (this.history.length === 0) return false;
        const prev = this.history.pop();
        this.grid = this.cloneGrid(prev.grid);
        this.score = prev.score;
        return true;
    }

    cloneGrid(grid) {
        return grid.map(row => [...row]);
    }

    spawnTile() {
        const empty = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) empty.push({ r, c });
            }
        }
        if (empty.length === 0) return;

        const { r, c } = empty[Math.floor(Math.random() * empty.length)];
        this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    move(direction) {
        this.saveState();

        let moved = false;
        const combineScore = { value: 0 };

        const newGrid = this.cloneGrid(this.grid);

        const moveRow = row => {
            const filtered = row.filter(v => v !== 0);
            const merged = [];
            let i = 0;

            while (i < filtered.length) {
                if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
                    const newVal = filtered[i] * 2;
                    merged.push(newVal);
                    combineScore.value += newVal;
                    i += 2;
                } else {
                    merged.push(filtered[i]);
                    i++;
                }
            }

            while (merged.length < this.size) merged.push(0);
            return merged;
        };

        const rotateRight = grid => {
            const res = this.createEmptyGrid();
            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    res[c][this.size - 1 - r] = grid[r][c];
                }
            }
            return res;
        };

        let temp = newGrid;
        for (let i = 0; i < direction; i++) temp = rotateRight(temp);

        for (let r = 0; r < this.size; r++) {
            const newRow = moveRow(temp[r]);
            if (newRow.some((v, idx) => v !== temp[r][idx])) moved = true;
            temp[r] = newRow;
        }

        for (let i = 0; i < (4 - direction) % 4; i++) temp = rotateRight(temp);

        if (moved) {
            this.grid = temp;
            this.score += combineScore.value;
            this.spawnTile();
        } else {
            this.history.pop();
        }

        return moved;
    }

    isGameOver() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) return false;
                if (c < this.size - 1 && this.grid[r][c] === this.grid[r][c + 1]) return false;
                if (r < this.size - 1 && this.grid[r][c] === this.grid[r + 1][c]) return false;
            }
        }
        return true;
    }
}
