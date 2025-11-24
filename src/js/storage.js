import { loadJSON, saveJSON, formatDate } from './utils.js';

export class StorageManager {
    constructor() {
        this.keyState = 'gameState';
        this.keyScores = 'leaderboard';
    }

    saveState(grid, score) {
        saveJSON(this.keyState, { grid, score });
    }

    loadState() {
        return loadJSON(this.keyState, null);
    }

    clearState() {
        localStorage.removeItem(this.keyState);
    }

    addRecord(name, score) {
        const list = loadJSON(this.keyScores, []);
        list.push({ name, score, date: formatDate() });

        list.sort((a, b) => b.score - a.score);
        const trimmed = list.slice(0, 10);

        saveJSON(this.keyScores, trimmed);
        return trimmed;
    }

    loadRecords() {
        return loadJSON(this.keyScores, []);
    }
}
