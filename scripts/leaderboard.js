function loadLeaderboard() {
    return JSON.parse(localStorage.getItem('leaderboard')) || [];
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard(leaderboard) {
    const table = document.getElementById('leaderboard-table');
    table.innerHTML = '';
    leaderboard.forEach(entry => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = entry.name;
        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score;
        const dateCell = document.createElement('td');
        dateCell.textContent = entry.date;
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        row.appendChild(dateCell);
        table.appendChild(row);
    });
}

function addToLeaderboard(name, score) {
    const leaderboard = loadLeaderboard();
    leaderboard.push({ name, score, date: new Date().toLocaleString() });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 10) {
        leaderboard.pop();
    }
    saveLeaderboard(leaderboard);
    renderLeaderboard(leaderboard);
}
