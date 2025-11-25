const GAME_KEY = '2048_game';
const RECORDS_KEY = '2048_records';

export class Storage {
    saveGame(game) {
        const data = {
            board: game.board,
            score: game.score,
            previousBoard: game.previousBoard,
            previousScore: game.previousScore,
            isOver: game.isOver
        };
        localStorage.setItem(GAME_KEY, JSON.stringify(data));
    }

    loadGame() {
        const raw = localStorage.getItem(GAME_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    saveRecord(name, score) {
        let records = this.getRecords();
        records.push({ name: name.trim() || 'Аноним', score, date: new Date().toISOString() });
        records.sort((a, b) => b.score - a.score);
        records = records.slice(0, 10);
        localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    }

    getRecords() {
        const raw = localStorage.getItem(RECORDS_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    clearGame() {
        localStorage.removeItem(GAME_KEY);
    }
}
