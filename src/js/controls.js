export class Controls {
    constructor({ onMove, onUndo, onRestart }) {
        this.onMove = onMove;
        this.onUndo = onUndo;
        this.onRestart = onRestart;
    }

    installKeyboard() {
        window.addEventListener('keydown', e => {
            if (e.key === 'ArrowUp') this.onMove(0);
            if (e.key === 'ArrowRight') this.onMove(1);
            if (e.key === 'ArrowDown') this.onMove(2);
            if (e.key === 'ArrowLeft') this.onMove(3);
        });
    }

    installButtons(up, right, down, left) {
        up.addEventListener('click', () => this.onMove(0));
        right.addEventListener('click', () => this.onMove(1));
        down.addEventListener('click', () => this.onMove(2));
        left.addEventListener('click', () => this.onMove(3));
    }

    installUndo(btnUndo) {
        btnUndo.addEventListener('click', () => this.onUndo());
    }

    installRestart(btnRestart) {
        btnRestart.addEventListener('click', () => this.onRestart());
    }

    installSwipe(element) {
        let startX = 0;
        let startY = 0;

        element.addEventListener('touchstart', e => {
            const t = e.changedTouches[0];
            startX = t.clientX;
            startY = t.clientY;
        });

        element.addEventListener('touchend', e => {
            const t = e.changedTouches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 20) this.onMove(1);
                if (dx < -20) this.onMove(3);
            } else {
                if (dy > 20) this.onMove(2);
                if (dy < -20) this.onMove(0);
            }
        });
    }
}
