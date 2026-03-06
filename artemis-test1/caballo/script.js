document.addEventListener('DOMContentLoaded', () => {
    // Configuración del juego
    const ROWS = 8;
    const COLS = 8;
    const MAX_MOVES = ROWS * COLS;
    const HORSE_EMOJI = '♞'; // Emoji para el caballo
    const MAX_UNDOS = 2; // Máximo de deshacer permitidos

    // Elementos del DOM
    const boardElement = document.getElementById('board');
    const movesCountElement = document.getElementById('moves-count');
    const undosCountElement = document.getElementById('undos-count');
    const btnUndo = document.getElementById('btn-undo');
    const btnRestart = document.getElementById('btn-restart');
    const messageContainer = document.getElementById('message-container');
    const gameMessage = document.getElementById('game-message');

    // Estado del juego
    let grid = []; // Matriz 2D para representar las celdas
    let currentRow = -1;
    let currentCol = -1;
    let moveCount = 0;
    let undosLeft = MAX_UNDOS;
    let isGameOver = false;

    // Historial para deshacer (guarda objetos {row, col, moveNumber})
    let history = [];

    // Inicializar el juego
    function init() {
        // Reiniciar estado
        currentRow = -1;
        currentCol = -1;
        moveCount = 0;
        undosLeft = MAX_UNDOS;
        isGameOver = false;
        history = [];

        // Actualizar UI
        updateUI();
        hideMessage();
        createBoard();

        // El primer clic colocará al caballo
        showMessage('Haz clic en cualquier casilla para empezar.', 'info');
    }

    // Crear el tablero en el DOM
    function createBoard() {
        boardElement.innerHTML = '';
        grid = [];

        for (let r = 0; r < ROWS; r++) {
            let rowArray = [];
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');

                // Patrón de ajedrez
                if ((r + c) % 2 === 0) {
                    cell.classList.add('light');
                } else {
                    cell.classList.add('dark');
                }

                // Guardar coordenadas
                cell.dataset.row = r;
                cell.dataset.col = c;

                // Evento de clic
                cell.addEventListener('click', () => handleCellClick(r, c));

                boardElement.appendChild(cell);
                rowArray.push({
                    element: cell,
                    visited: false,
                    moveNumber: 0
                });
            }
            grid.push(rowArray);
        }
    }

    // Manejar el clic en una celda
    function handleCellClick(row, col) {
        if (isGameOver) return;

        // Primer movimiento (colocar el caballo)
        if (moveCount === 0) {
            hideMessage();
            moveTo(row, col);
            return;
        }

        // Movimientos subsecuentes
        if (isValidMove(row, col) && !grid[row][col].visited) {
            moveTo(row, col);
        }
    }

    // Mover el caballo a una posición
    function moveTo(row, col) {
        // Guardar en historial si no es el primer movimiento
        if (moveCount > 0) {
            history.push({
                row: currentRow,
                col: currentCol,
                moveNumber: moveCount
            });
            // Mantener solo los últimos MAX_UNDOS en el historial para evitar memoria innecesaria
            if (history.length > MAX_UNDOS) {
                history.shift();
            }
        }

        // Actualizar celda anterior
        if (currentRow !== -1 && currentCol !== -1) {
            const prevCell = grid[currentRow][currentCol];
            prevCell.element.classList.remove('current');
            prevCell.element.innerHTML = ''; // Quitar caballo
        }

        // Actualizar nueva celda
        currentRow = row;
        currentCol = col;
        moveCount++;

        const currentCell = grid[currentRow][currentCol];
        currentCell.visited = true;
        currentCell.moveNumber = moveCount;

        currentCell.element.classList.add('visited');
        currentCell.element.classList.add('current');
        currentCell.element.innerHTML = `<span class="horse">${HORSE_EMOJI}</span>`;

        // Limpiar clases visuales previas y actualizarUI
        updateUI();
        highlightPossibleMoves();
        checkGameState();
    }

    // Deshacer movimiento
    function undoMove() {
        if (isGameOver || undosLeft <= 0 || history.length === 0 || moveCount <= 1) return;

        // Recuperar estado anterior
        const prevState = history.pop();

        // Limpiar celda actual
        const currentCell = grid[currentRow][currentCol];
        currentCell.visited = false;
        currentCell.moveNumber = 0;
        currentCell.element.classList.remove('visited');
        currentCell.element.classList.remove('current');
        currentCell.element.innerHTML = '';

        // Restaurar estado
        currentRow = prevState.row;
        currentCol = prevState.col;
        moveCount--;
        undosLeft--;

        // Restaurar celda anterior como actual
        const prevCell = grid[currentRow][currentCol];
        prevCell.element.classList.add('current');
        prevCell.element.innerHTML = `<span class="horse">${HORSE_EMOJI}</span>`;

        updateUI();
        highlightPossibleMoves();
    }

    // Obtener movimientos posibles matemáticamente
    function getPossibleMoves(r, c) {
        const moves = [
            { r: r - 2, c: c - 1 }, { r: r - 2, c: c + 1 },
            { r: r - 1, c: c - 2 }, { r: r - 1, c: c + 2 },
            { r: r + 1, c: c - 2 }, { r: r + 1, c: c + 2 },
            { r: r + 2, c: c - 1 }, { r: r + 2, c: c + 1 }
        ];

        return moves.filter(move => {
            return move.r >= 0 && move.r < ROWS &&
                   move.c >= 0 && move.c < COLS;
        });
    }

    // Comprobar si un movimiento es válido (salto de caballo)
    function isValidMove(targetRow, targetCol) {
        if (currentRow === -1 || currentCol === -1) return true; // Primer movimiento es siempre válido

        const rowDiff = Math.abs(targetRow - currentRow);
        const colDiff = Math.abs(targetCol - currentCol);

        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }

    // Resaltar celdas a las que el caballo puede saltar
    function highlightPossibleMoves() {
        // Limpiar resaltados anteriores
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                grid[r][c].element.classList.remove('possible');
            }
        }

        if (currentRow === -1 || currentCol === -1) return;

        const moves = getPossibleMoves(currentRow, currentCol);

        moves.forEach(move => {
            if (!grid[move.r][move.c].visited) {
                grid[move.r][move.c].element.classList.add('possible');
            }
        });
    }

    // Comprobar si ganó o perdió
    function checkGameState() {
        if (moveCount === MAX_MOVES) {
            gameOver(true); // ¡Ganó!
            return;
        }

        // Verificar si hay movimientos posibles no visitados
        const moves = getPossibleMoves(currentRow, currentCol);
        const hasValidMoves = moves.some(move => !grid[move.r][move.c].visited);

        if (!hasValidMoves) {
            gameOver(false); // Perdió, no hay movimientos
        }
    }

    function gameOver(win) {
        isGameOver = true;

        // Quitar resaltados
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                grid[r][c].element.classList.remove('possible');
            }
        }

        if (win) {
            showMessage('¡Felicidades! Has completado el recorrido del caballo.', 'win');
        } else {
            showMessage(`¡Juego terminado! Te quedaste sin movimientos. Lograste ${moveCount} de ${MAX_MOVES}.`, 'lose');
        }

        // Deshabilitar deshacer al terminar
        btnUndo.disabled = true;
    }

    function updateUI() {
        movesCountElement.textContent = moveCount;
        undosCountElement.textContent = undosLeft;

        // Habilitar/deshabilitar botón deshacer
        btnUndo.disabled = isGameOver || undosLeft <= 0 || history.length === 0 || moveCount <= 1;
    }

    function showMessage(msg, type) {
        messageContainer.className = ''; // Resetear clases
        messageContainer.classList.add(`${type}-message`);
        gameMessage.textContent = msg;
    }

    function hideMessage() {
        messageContainer.className = 'hidden';
    }

    // Listeners para botones
    btnRestart.addEventListener('click', init);
    btnUndo.addEventListener('click', undoMove);

    // Arrancar el juego
    init();
});