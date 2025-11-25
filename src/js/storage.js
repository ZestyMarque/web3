const GAME_KEY = '2048_current_game';
const RECORDS_KEY = '2048_leaderboard';

export class Storage {
    saveGame(game) {
        const data = {
            board: game.board,
            score: game.score,
            previousBoard: game.previousBoard,
            previousScore: game.previousScore,
            isOver: game.isOver,
            timestamp: Date.now()
        };
        localStorage.setItem(GAME_KEY, JSON.stringify(data));
    }

    loadGame() {
        const raw = localStorage.getItem(GAME_KEY);
        if (!raw) return null;

        try {
            const data = JSON.parse(raw);
            return {
                board: data.board || null,
                score: data.score || 0,
                previousBoard: data.previousBoard || null,
                previousScore: data.previousScore || null,
                isOver: data.isOver || false
            };
        } catch (e) {
            console.error('Ошибка загрузки игры:', e);
            return null;
        }
    }

    saveRecord(name, score) {
        const records = this.getAllRecords();
        records.push({
            name: name.trim(),
            score: score,
            date: new Date().toISOString()
        });

        records.sort((a, b) => b.score - a.score);
        const top10 = records.slice(0, 10);

        localStorage.setItem(RECORDS_KEY, JSON.stringify(top10));
    }

    getTop10() {
        return this.getAllRecords()
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    getAllRecords() {
        const raw = localStorage.getItem(RECORDS_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    clearCurrentGame() {
        localStorage.removeItem(GAME_KEY);
    }
}
