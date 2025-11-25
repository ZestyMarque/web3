import { deepCopy } from './utils.js';

export class Game {
    constructor(renderer = null) {
        this.size = 4;
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.score = 0;
        this.previousBoard = null;
        this.previousScore = null;
        this.isOver = false;
        this.renderer = renderer; 

 
        const initialCount = Math.random() < 0.5 ? 2 : 3;
        this.addRandomTiles(initialCount);
    }

    savePreviousState() {
        this.previousBoard = deepCopy(this.board);
        this.previousScore = this.score;
    }

    addRandomTile() {
        const empties = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) empties.push([i, j]);
            }
        }
        if (empties.length === 0) return false;

        const [x, y] = empties[Math.floor(Math.random() * empties.length)];
        this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
        return true;
    }

    addRandomTiles(count) {
        for (let i = 0; i < count; i++) {
            this.addRandomTile();
        }
    }

    move(direction) {
        if (this.isOver) return false;

        this.savePreviousState();
        const oldBoard = deepCopy(this.board);
        let moved = false;
        let addedScore = 0;

        let tempBoard = deepCopy(this.board);

        if (direction === 'left') {
            [moved, addedScore] = this.slideLeft(tempBoard);
        } else if (direction === 'right') {
            tempBoard = this.reverseRows(tempBoard);
            [moved, addedScore] = this.slideLeft(tempBoard);
            tempBoard = this.reverseRows(tempBoard);
        } else if (direction === 'up') {
            tempBoard = this.transpose(tempBoard);
            [moved, addedScore] = this.slideLeft(tempBoard);
            tempBoard = this.transpose(tempBoard);
        } else if (direction === 'down') {
            tempBoard = this.transpose(tempBoard);
            tempBoard = this.reverseRows(tempBoard);
            [moved, addedScore] = this.slideLeft(tempBoard);
            tempBoard = this.reverseRows(tempBoard);
            tempBoard = this.transpose(tempBoard);
        }

        if (moved) {
            this.board = tempBoard;
            this.score += addedScore;

            if (this.renderer) {
                const merged = this.getMergedPositions(oldBoard, this.board);
                this.renderer.markMerges(merged);
            }

            const newTilesCount = Math.random() < 0.9 ? 1 : 2;
            this.addRandomTiles(newTilesCount);

            this.checkGameOver();
            return true;
        } else {
            this.previousBoard = null;
            this.previousScore = null;
            return false;
        }
    }

    slideLeft(board) {
        let moved = false;
        let score = 0;

        for (let i = 0; i < this.size; i++) {
            let row = board[i].filter(v => v !== 0);
            let j = 0;
            while (j < row.length - 1) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                } else {
                    j++;
                }
            }
            while (row.length < this.size) row.push(0);

            if (!board[i].every((v, idx) => v === row[idx])) moved = true;
            board[i] = row;
        }
        return [moved, score];
    }

    reverseRows(board) {
        return board.map(row => row.slice().reverse());
    }

    transpose(board) {
        return board[0].map((_, i) => board.map(row => row[i]));
    }

    getMergedPositions(oldBoard, newBoard) {
        const merged = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const oldVal = oldBoard[i][j] || 0;
                const newVal = newBoard[i][j];
                if (newVal > oldVal && newVal !== 0) {
                    merged.push([i, j]);
                }
            }
        }
        return merged;
    }

    checkGameOver() {
        if (this.hasEmptyCells()) {
            this.isOver = false;
            return;
        }
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const val = this.board[i][j];
                if (
                    (j < 3 && val === this.board[i][j + 1]) ||
                    (i < 3 && val === this.board[i + 1][j])
                ) {
                    this.isOver = false;
                    return;
                }
            }
        }
        this.isOver = true;
    }

    hasEmptyCells() {
        return this.board.flat().includes(0);
    }

    undo() {
        if (!this.previousBoard || this.isOver) return;

        this.board = this.previousBoard;
        this.score = this.previousScore;
        this.previousBoard = null;
        this.previousScore = null;
        this.isOver = false;
    }

    reset() {
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.score = 0;
        this.previousBoard = null;
        this.previousScore = null;
        this.isOver = false;

        const initialCount = Math.random() < 0.5 ? 2 : 3;
        this.addRandomTiles(initialCount);
    }
}
