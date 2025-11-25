import { getLeaders, saveLeader } from './storage.js';
import { initGame } from './game.js';

const leaderboardOverlay = document.getElementById('leaderboard');
const gameOverOverlay = document.getElementById('game-over');
const leadersTableBody = document.querySelector('#leaders-table tbody');
const showLeaderboardBtn = document.getElementById('show-leaderboard-btn');
const closeLeaderboardBtn = document.getElementById('close-leaderboard');
const finalScoreEl = document.getElementById('final-score');
const playerNameInput = document.getElementById('player-name');
const saveScoreBtn = document.getElementById('save-score-btn');
const savedMsg = document.getElementById('saved-msg');
const nameSection = document.getElementById('name-section');
const newGameModalBtn = document.getElementById('new-game-modal');

function renderLeaderboard() {
    while (leadersTableBody.firstChild) leadersTableBody.removeChild(leadersTableBody.firstChild);
    const leaders = getLeaders();
    leaders.forEach((entry, i) => {
        const row = document.createElement('tr');

        const rank = document.createElement('td');
        rank.textContent = i + 1;
        const name = document.createElement('td');
        name.textContent = entry.name;
        const score = document.createElement('td');
        score.textContent = entry.score;
        const date = document.createElement('td');
        date.textContent = entry.date;

        row.append(rank, name, score, date);
        leadersTableBody.appendChild(row);
    });
}

showLeaderboardBtn.onclick = () => {
    renderLeaderboard();
    leaderboardOverlay.classList.remove('hidden');
    document.getElementById('mobile-controls').style.display = 'none';
};

closeLeaderboardBtn.onclick = () => {
    leaderboardOverlay.classList.add('hidden');
    if (window.innerWidth <= 640) document.getElementById('mobile-controls').style.display = 'grid';
};

export function showGameOver(finalScore) {
    finalScoreEl.textContent = finalScore;
    gameOverOverlay.classList.remove('hidden');
    document.getElementById('mobile-controls').style.display = 'none';
    nameSection.classList.remove('hidden');
    savedMsg.classList.add('hidden');
    playerNameInput.value = '';
}

saveScoreBtn.onclick = () => {
    const name = playerNameInput.value.trim() || 'Аноним';
    saveLeader(name, Number(finalScoreEl.textContent));
    nameSection.classList.add('hidden');
    savedMsg.classList.remove('hidden');
    renderLeaderboard();
};

newGameModalBtn.onclick = () => {
    gameOverOverlay.classList.add('hidden');
    if (window.innerWidth <= 640) document.getElementById('mobile-controls').style.display = 'grid';
    initGame(true);
};
