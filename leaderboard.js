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
    leadersTableBody.innerHTML = '';
    const leaders = getLeaders();
    leaders.forEach((entry, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.date}</td>
        `;
        leadersTableBody.appendChild(row);
    });
}

showLeaderboardBtn.addEventListener('click', () => {
    renderLeaderboard();
    leaderboardOverlay.classList.remove('hidden');
    document.getElementById('mobile-controls').style.display = 'none';
});

closeLeaderboardBtn.addEventListener('click', () => {
    leaderboardOverlay.classList.add('hidden');
    if (window.innerWidth <= 640) document.getElementById('mobile-controls').style.display = 'grid';
});

export function showGameOver(score) {
    finalScoreEl.textContent = score;
    gameOverOverlay.classList.remove('hidden');
    document.getElementById('mobile-controls').style.display = 'none';
    nameSection.classList.remove('hidden');
    savedMsg.classList.add('hidden');
    playerNameInput.value = '';
    playerNameInput.focus();
}

saveScoreBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim() || 'Аноним';
    saveLeader(name, Number(finalScoreEl.textContent));
    nameSection.classList.add('hidden');
    savedMsg.classList.remove('hidden');
    renderLeaderboard();
});

newGameModalBtn.addEventListener('click', () => {
    gameOverOverlay.classList.add('hidden');
    if (window.innerWidth <= 640) document.getElementById('mobile-controls').style.display = 'grid';
    initGame(true);
});
