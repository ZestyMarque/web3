import { deepCopy } from './utils.js';

export class Game {
    constructor() {
        this.size = 4;
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.score = 0;
        this.previousBoard = null;
        this.previousScore = null;
        this.isOver = false;
        const initialTiles = Math.floor(Math.random() * 3) + 1; 
        this.addRandomTiles(initialTiles);
    }

    savePreviousState() {
        this.previousBoard = deepCopy(this.board);
        this.previousScore = this.score;
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push([i, j]);
                }
            }
        }
        if (emptyCells.length === 0) return false;
        const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
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
        let moved = false;
        let addedScore = 0;
        let boardCopy = deepCopy(this.board);

        if (direction === 'left') {
            [moved, addedScore] = this.slideLeft(boardCopy);
        } else if (direction === 'right') {
            boardCopy = this.reverseRows(boardCopy);
            [moved, addedScore] = this.slideLeft(boardCopy);
            boardCopy = this.reverseRows(boardCopy);
        } else if (direction === 'up') {
            boardCopy = this.transpose(boardCopy);
            [moved, addedScore] = this.slideLeft(boardCopy);
            boardCopy = this.transpose(boardCopy);
        } else if (direction === 'down') {
            boardCopy = this.transpose(boardCopy);
            boardCopy = this.reverseRows(boardCopy);
            [moved, addedScore] = this.slideLeft(boardCopy);
            boardCopy = this.reverseRows(boardCopy);
            boardCopy = this.transpose(boardCopy);
        }

        if (moved) {
            this.board = boardCopy;
            this.score += addedScore;
            const newTiles = Math.floor(Math.random() * 2) + 1;
            this.addRandomTiles(newTiles);
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
        let addedScore = 0;
        for (let i = 0; i < this.size; i++) {
            let row = board[i].filter(cell => cell !== 0);
            let j = 0;
            while (j < row.length - 1) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    addedScore += row[j];
                    row.splice(j + 1, 1);
                } else {
                    j++;
                }
            }
            while (row.length < this.size) row.push(0);
            if (!board[i].every((val, idx) => val === row[idx])) moved = true;
            board[i] = row;
        }
        return [moved, addedScore];
    }

    reverseRows(board) {
        return board.map(row => row.slice().reverse());
    }

    transpose(board) {
        return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
    }

    checkGameOver() {
        if (this.hasEmptyCells() || this.hasAdjacentMatches()) {
            this.isOver = false;
        } else {
            this.isOver = true;
        }
    }

    hasEmptyCells() {
        return this.board.flat().some(cell => cell === 0);
    }

    hasAdjacentMatches() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) return true;
                if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) return true;
            }
        }
        return false;
    }

    undo() {
        if (this.previousBoard && !this.isOver) {
            this.board = this.previousBoard;
            this.score = this.previousScore;
            this.previousBoard = null;
            this.previousScore = null;
            this.isOver = false;
        }
    }

    reset() {
        this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.score = 0;
        this.previousBoard = null;
        this.previousScore = null;
        this.isOver = false;
        const initialTiles = Math.floor(Math.random() * 3) + 1;
        this.addRandomTiles(initialTiles);
    }
}
