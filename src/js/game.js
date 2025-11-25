// src/js/game.js
import { deepCopy } from './utils.js';

export class Game {
    constructor() {
        this.size = 4;
        this.reset();
    }

    reset() {
        this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0;
        this.isOver = false;
        this.previousBoard = null;
        this.previousScore = null;
        this.addRandomTile();
        this.addRandomTile();
    }

    addRandomTile() {
        const empty = [];
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                if (this.board[i][j] === 0) empty.push([i, j]);
        if (empty.length === 0) return;
        const [i, j] = empty[Math.floor(Math.random() * empty.length)];
        this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }

    move(dir) {
        if (this.isOver) return false;

        this.previousBoard = deepCopy(this.board);
        this.previousScore = this.score;

        let moved = false;
        let scoreAdd = 0;
        const b = deepCopy(this.board);

        if (dir === 'left')  [moved, scoreAdd] = this.slide(b);
        if (dir === 'right') [moved, scoreAdd] = this.slide(b.map(r => r.reverse())).then(r => r.reverse());
        if (dir === 'up')    [moved, scoreAdd] = this.slide(this.transpose(b)).then(this.transpose);
        if (dir === 'down')  [moved, scoreAdd] = this.slide(this.transpose(b).map(r => r.reverse())).then(r => this.transpose(r.map(row => row.reverse())));

        if (moved) {
            this.board = b;
            this.score += scoreAdd;
            this.addRandomTile();
            this.checkGameOver();
            return true;
        }
        this.previousBoard = null;
        this.previousScore = null;
        return false;
    }

    slide(lines) {
        let moved = false;
        let added = 0;
        for (let i = 0; i < 4; i++) {
            let row = lines[i].filter(x => x);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    added += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                    j--;
                }
            }
            while (row.length < 4) row.push(0);
            if (row.join() !== lines[i].join()) moved = true;
            lines[i] = row;
        }
        return [moved, added];
    }

    transpose(b) {
        return b[0].map((_, i) => b.map(row => row[i]));
    }

    checkGameOver() {
        if (this.board.flat().includes(0)) return;
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++) {
                if ((j < 3 && this.board[i][j] === this.board[i][j + 1]) ||
                    (i < 3 && this.board[i][j] === this.board[i + 1][j]))
                    return;
            }
        this.isOver = true;
    }

    undo() {
        if (!this.previousBoard || this.isOver) return;
        this.board = this.previousBoard;
        this.score = this.previousScore;
        this.previousBoard = null;
        this.previousScore = null;
        this.isOver = false;
    }
}
