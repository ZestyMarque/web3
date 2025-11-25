export const STORAGE_KEY = '2048_game_state';
export const LEADERS_KEY = '2048_leaders';

export function saveGame(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGame() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

export function clearGame() {
    localStorage.removeItem(STORAGE_KEY);
}

export function getLeaders() {
    const data = localStorage.getItem(LEADERS_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveLeader(name, score) {
    const leaders = getLeaders();
    const date = new Date().toLocaleDateString('ru-RU');
    leaders.push({ name: name.trim() || 'Аноним', score, date });
    leaders.sort((a, b) => b.score - a.score);
    const top10 = leaders.slice(0, 10);
    localStorage.setItem(LEADERS_KEY, JSON.stringify(top10));
}
