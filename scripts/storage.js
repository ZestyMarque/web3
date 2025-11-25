function saveGameState(board, score) {
    localStorage.setItem('gameState', JSON.stringify({ board, score }));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    return savedState ? JSON.parse(savedState) : null;
}

function clearGameState() {
    localStorage.removeItem('gameState');
}
