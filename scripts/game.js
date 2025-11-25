let board = [];
let score = 0;
let gameOver = false;
let history = [];
let leaderboard = loadLeaderboard();

function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    gameOver = false;
    history = [];
    createBoard();
    updateScore();
    updateTiles(board);
    addRandomTile();
    addRandomTile();
    updateLeaderboard();
    setupKeyboardControls(move);
    setupTouchControls(move);
    setupUndoButton(undo);
    setupRestartButton(initGame);
    setupSaveScoreButton(saveScore);
    document.getElementById('game-over-modal').style.display = 'none';
}

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

function updateScore() {
    document.getElementById('score').textContent = `Счёт: ${score}`;
}

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

function saveState() {
    history.push({
        board: JSON.parse(JSON.stringify(board)),
        score: score,
    });
}

function undo() {
    if (history.length > 0 && !gameOver) {
        const lastState = history.pop();
        board = lastState.board;
        score = lastState.score;
        updateScore();
        updateTiles(board);
    }
}

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
        updateTiles(board);
        if (isGameOver()) {
            gameOver = true;
            document.getElementById('final-score').textContent = score;
            document.getElementById('game-over-modal').style.display = 'flex';
        }
    } else {
        history.pop();
    }
}

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

function saveScore() {
    const name = document.getElementById('name-input').value.trim();
    if (name) {
        addToLeaderboard(name, score);
        document.getElementById('name-input').value = '';
        document.getElementById('game-over-modal').style.display = 'none';
    }
}

initGame();
