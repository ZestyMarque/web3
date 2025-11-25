// Основные переменные
let board = [];
let score = 0;
let gameOver = false;
let history = [];
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// DOM-элементы
const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreElement = document.getElementById('final-score');
const nameInput = document.getElementById('name-input');
const saveScoreButton = document.getElementById('save-score');
const restartButton = document.getElementById('restart');
const restartFromModalButton = document.getElementById('restart-from-modal');
const undoButton = document.getElementById('undo');
const leaderboardTable = document.getElementById('leaderboard-table');

// Инициализация игры
function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameOver = false;
    history = [];
    updateScore();
    renderBoard();
    addRandomTile();
    addRandomTile();
    updateLeaderboard();
}

// Добавление случайной плитки (2 или 4)
function addRandomTile() {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyTiles.push({ i, j });
            }
        }
    }
    if (emptyTiles.length > 0) {
        const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Отрисовка игрового поля
function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = board[i][j] !== 0 ? board[i][j] : '';
            tile.style.backgroundColor = getTileColor(board[i][j]);
            boardElement.appendChild(tile);
        }
    }
}

// Цвет плитки в зависимости от значения
function getTileColor(value) {
    const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
    };
    return colors[value] || '#3e3933';
}

// Обновление счёта
function updateScore() {
    scoreElement.textContent = `Счёт: ${score}`;
}

// Проверка окончания игры
function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
            if (j < 3 && board[i][j] === board[i][j + 1]) {
                return false;
            }
            if (i < 3 && board[i][j] === board[i + 1][j]) {
                return false;
            }
        }
    }
    return true;
}

// Сохранение состояния для отмены хода
function saveState() {
    history.push({
        board: JSON.parse(JSON.stringify(board)),
        score: score,
    });
}

// Отмена хода
function undo() {
    if (history.length > 0 && !gameOver) {
        const lastState = history.pop();
        board = lastState.board;
        score = lastState.score;
        updateScore();
        renderBoard();
    }
}

// Обработка движения
function move(direction) {
    if (gameOver) return;
    saveState();
    let moved = false;
    switch (direction) {
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
    }
    if (moved) {
        addRandomTile();
        renderBoard();
        if (isGameOver()) {
            gameOver = true;
            finalScoreElement.textContent = score;
            gameOverModal.style.display = 'flex';
        }
    } else {
        history.pop();
    }
}

// Движение влево
function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = board[i].filter(val => val !== 0);
        let newRow = [];
        for (let j = 0; j < row.length; j++) {
            if (j < row.length - 1 && row[j] === row[j + 1]) {
                newRow.push(row[j] * 2);
                score += row[j] * 2;
                j++;
                moved = true;
            } else {
                newRow.push(row[j]);
            }
        }
        while (newRow.length < 4) {
            newRow.push(0);
        }
        if (JSON.stringify(newRow) !== JSON.stringify(board[i])) {
            moved = true;
        }
        board[i] = newRow;
    }
    updateScore();
    return moved;
}

// Движение вправо
function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = board[i].filter(val => val !== 0).reverse();
        let newRow = [];
        for (let j = 0; j < row.length; j++) {
            if (j < row.length - 1 && row[j] === row[j + 1]) {
                newRow.push(row[j] * 2);
                score += row[j] * 2;
                j++;
                moved = true;
            } else {
                newRow.push(row[j]);
            }
        }
        while (newRow.length < 4) {
            newRow.unshift(0);
        }
        if (JSON.stringify(newRow.reverse()) !== JSON.stringify(board[i])) {
            moved = true;
        }
        board[i] = newRow.reverse();
    }
    updateScore();
    return moved;
}

// Движение вверх
function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== 0) {
                column.push(board[i][j]);
            }
        }
        let newColumn = [];
        for (let k = 0; k < column.length; k++) {
            if (k < column.length - 1 && column[k] === column[k + 1]) {
                newColumn.push(column[k] * 2);
                score += column[k] * 2;
                k++;
                moved = true;
            } else {
                newColumn.push(column[k]);
            }
        }
        while (newColumn.length < 4) {
            newColumn.push(0);
        }
        for (let i = 0; i < 4; i++) {
            if (board[i][j] !== newColumn[i]) {
                moved = true;
            }
            board[i][j] = newColumn[i];
        }
    }
    updateScore();
    return moved;
}

// Движение вниз
function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 3; i >= 0; i--) {
            if (board[i][j] !== 0) {
                column.push(board[i][j]);
            }
        }
        let newColumn = [];
        for (let k = 0; k < column.length; k++) {
            if (k < column.length - 1 && column[k] === column[k + 1]) {
                newColumn.push(column[k] * 2);
                score += column[k] * 2;
                k++;
                moved = true;
            } else {
                newColumn.push(column[k]);
            }
        }
        while (newColumn.length < 4) {
            newColumn.unshift(0);
        }
        for (let i = 3; i >= 0; i--) {
            if (board[i][j] !== newColumn[3 - i]) {
                moved = true;
            }
            board[i][j] = newColumn[3 - i];
        }
    }
    updateScore();
    return moved;
}

// Сохранение рекорда
function saveScore() {
    const name = nameInput.value.trim();
    if (name) {
        leaderboard.push({ name, score, date: new Date().toLocaleString() });
        leaderboard.sort((a, b) => b.score - a.score);
        if (leaderboard.length > 10) {
            leaderboard = leaderboard.slice(0, 10);
        }
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
        nameInput.value = '';
        gameOverModal.style.display = 'none';
    }
}

// Обновление таблицы лидеров
function updateLeaderboard() {
    leaderboardTable.innerHTML = '';
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
        leaderboardTable.appendChild(row);
    });
}

// Обработчики событий
document.addEventListener('keydown', (e) => {
    if (!gameOver) {
        switch (e.key) {
            case 'ArrowUp':
                move('up');
                break;
            case 'ArrowDown':
                move('down');
                break;
            case 'ArrowLeft':
                move('left');
                break;
            case 'ArrowRight':
                move('right');
                break;
        }
    }
});

document.getElementById('up').addEventListener('click', () => move('up'));
document.getElementById('down').addEventListener('click', () => move('down'));
document.getElementById('left').addEventListener('click', () => move('left'));
document.getElementById('right').addEventListener('click', () => move('right'));
undoButton.addEventListener('click', undo);
restartButton.addEventListener('click', initGame);
restartFromModalButton.addEventListener('click', () => {
    gameOverModal.style.display = 'none';
    initGame();
});
saveScoreButton.addEventListener('click', saveScore);

// Запуск игры
initGame();
