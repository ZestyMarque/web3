function setupKeyboardControls(move) {
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
}

function setupTouchControls(move) {
    const upButton = document.getElementById('up');
    const downButton = document.getElementById('down');
    const leftButton = document.getElementById('left');
    const rightButton = document.getElementById('right');

    upButton.addEventListener('click', () => move('up'));
    downButton.addEventListener('click', () => move('down'));
    leftButton.addEventListener('click', () => move('left'));
    rightButton.addEventListener('click', () => move('right'));
}

function setupUndoButton(undo) {
    document.getElementById('undo').addEventListener('click', undo);
}

function setupRestartButton(initGame) {
    document.getElementById('restart').addEventListener('click', initGame);
    document.getElementById('restart-from-modal').addEventListener('click', () => {
        document.getElementById('game-over-modal').style.display = 'none';
        initGame();
    });
}

function setupSaveScoreButton(saveScore) {
    document.getElementById('save-score').addEventListener('click', saveScore);
}
