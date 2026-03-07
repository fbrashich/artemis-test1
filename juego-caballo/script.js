/**
 * Configuración y variables globales del juego.
 */
const BOARD_SIZE = 6;
const MAX_UNDOS = 2;
const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

let board = [];
let moveHistory = [];
let undosUsed = 0;
let currentPos = null;
let isGameOver = false;

// Elementos del DOM
const boardElement = document.getElementById('game-board');
const movesCountElement = document.getElementById('moves-count');
const undosLeftElement = document.getElementById('undos-left');
const undoBtn = document.getElementById('undo-btn');
const resetBtn = document.getElementById('reset-btn');
const themeToggle = document.getElementById('theme-toggle');
const messageElement = document.getElementById('game-message');
const messageText = document.getElementById('message-text');
const playAgainBtn = document.getElementById('play-again-btn');

/**
 * Inicializa el juego.
 */
function initGame() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(false));
    moveHistory = [];
    undosUsed = 0;
    currentPos = null;
    isGameOver = false;

    updateStats();
    createBoard();
    hideMessage();
}

/**
 * Crea la representación visual del tablero en el DOM.
 */
function createBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            // Alternar colores de las celdas como en un tablero de ajedrez
            if ((r + c) % 2 === 0) {
                cell.classList.add('light');
            } else {
                cell.classList.add('dark');
            }
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener('click', () => handleCellClick(r, c));
            boardElement.appendChild(cell);
        }
    }
    renderBoard();
}

/**
 * Maneja el evento de clic en una celda.
 * @param {number} r - Fila de la celda.
 * @param {number} c - Columna de la celda.
 */
function handleCellClick(r, c) {
    if (isGameOver) return;

    // Si es el primer movimiento, se puede clickear en cualquier celda
    if (currentPos === null) {
        makeMove(r, c);
        return;
    }

    // Comprobar si es un movimiento válido
    if (isValidMove(currentPos.r, currentPos.c, r, c) && !board[r][c]) {
        makeMove(r, c);
    }
}

/**
 * Realiza un movimiento en el tablero.
 * @param {number} r - Fila a la que moverse.
 * @param {number} c - Columna a la que moverse.
 */
function makeMove(r, c) {
    // Guardar el historial para poder deshacer
    if (currentPos !== null) {
        moveHistory.push({ r: currentPos.r, c: currentPos.c });
    }

    currentPos = { r, c };
    board[r][c] = true;

    // Al hacer un nuevo movimiento, reiniciamos el contador de "deshacer" para este movimiento
    // (Opcional: Si queremos mantener el contador global, no lo reiniciamos. Mantendremos el global según reglas).

    updateStats();
    renderBoard();
    checkGameStatus();
}

/**
 * Comprueba si un movimiento es válido (movimiento en "L" del caballo).
 * @param {number} r1 - Fila origen.
 * @param {number} c1 - Columna origen.
 * @param {number} r2 - Fila destino.
 * @param {number} c2 - Columna destino.
 * @returns {boolean} - True si el movimiento es válido, false en caso contrario.
 */
function isValidMove(r1, c1, r2, c2) {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
}

/**
 * Obtiene todos los movimientos válidos posibles desde una posición.
 * @param {number} r - Fila actual.
 * @param {number} c - Columna actual.
 * @returns {Array} - Array de objetos {r, c} con los movimientos posibles.
 */
function getPossibleMoves(r, c) {
    const moves = [];
    const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (let offset of offsets) {
        const nr = r + offset[0];
        const nc = c + offset[1];
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && !board[nr][nc]) {
            moves.push({ r: nr, c: nc });
        }
    }
    return moves;
}

/**
 * Actualiza la visualización del tablero en el DOM.
 */
function renderBoard() {
    const cells = boardElement.children;
    let possibleMoves = [];
    if (currentPos !== null) {
        possibleMoves = getPossibleMoves(currentPos.r, currentPos.c);
    }

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);

        // Limpiar clases anteriores
        cell.className = 'cell ' + ( (r + c) % 2 === 0 ? 'light' : 'dark' );
        cell.innerHTML = ''; // Limpiar el icono

        if (board[r][c]) {
            cell.classList.add('visited');
            // Si es la posición actual
            if (currentPos && currentPos.r === r && currentPos.c === c) {
                cell.classList.add('current');
                // Añadir el icono del caballo usando el pseudo-elemento CSS
                const iconDiv = document.createElement('div');
                iconDiv.className = 'horse-icon';
                cell.appendChild(iconDiv);
            } else {
                // Opcional: mostrar número de movimiento en la celda visitada
                // pero por ahora solo la marcamos como visitada.
            }
        } else if (currentPos !== null && possibleMoves.some(m => m.r === r && m.c === c)) {
            cell.classList.add('possible');
        }
    }
}

/**
 * Comprueba si el juego ha terminado en victoria o derrota.
 */
function checkGameStatus() {
    // Si no ha empezado, no chequear
    if (currentPos === null) return;

    // Movimientos realizados (cada celda ocupada es 1)
    const movesMade = moveHistory.length + 1;

    if (movesMade === TOTAL_CELLS) {
        showGameEnd("¡Felicidades! Has ganado.", true);
        return;
    }

    const possibleMoves = getPossibleMoves(currentPos.r, currentPos.c);
    if (possibleMoves.length === 0) {
        showGameEnd("¡Juego Terminado! No hay más movimientos.", false);
    }
}

/**
 * Muestra el mensaje de fin de juego.
 * @param {string} msg - El mensaje a mostrar.
 * @param {boolean} isWin - True si es victoria.
 */
function showGameEnd(msg, isWin) {
    isGameOver = true;
    messageText.textContent = msg;
    if (isWin) {
        messageText.style.color = "var(--cell-possible)";
    } else {
        messageText.style.color = "#d32f2f"; // Rojo
    }
    messageElement.classList.remove('hidden');
    updateStats(); // Para deshabilitar botones
}

/**
 * Oculta el mensaje de fin de juego.
 */
function hideMessage() {
    messageElement.classList.add('hidden');
}

/**
 * Actualiza las estadísticas (movimientos, deshacer) en la UI.
 */
function updateStats() {
    const moves = currentPos === null ? 0 : moveHistory.length + 1;
    movesCountElement.textContent = moves;

    const undosRemaining = MAX_UNDOS - undosUsed;
    undosLeftElement.textContent = undosRemaining;

    // Activar/Desactivar botón deshacer
    // Se permite deshacer incluso si el juego terminó (derrota), a menos que sea victoria total (opcional, pero permitiremos siempre si hay historial)
    const isWin = moveHistory.length + 1 === TOTAL_CELLS;
    undoBtn.disabled = moveHistory.length === 0 || undosRemaining === 0 || isWin;
}

/**
 * Función para deshacer el último movimiento.
 */
function undoMove() {
    const isWin = moveHistory.length + 1 === TOTAL_CELLS;
    if (moveHistory.length === 0 || undosUsed >= MAX_UNDOS || isWin) return;

    // Si estábamos en game over por derrota, al deshacer volvemos a jugar
    if (isGameOver) {
        isGameOver = false;
        hideMessage();
    }

    // Desmarcar la posición actual
    board[currentPos.r][currentPos.c] = false;

    // Volver a la posición anterior
    currentPos = moveHistory.pop();
    undosUsed++;

    updateStats();
    renderBoard();
}

/**
 * Cambia entre el modo claro y oscuro.
 */
function toggleTheme() {
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Event Listeners
undoBtn.addEventListener('click', undoMove);
resetBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);
themeToggle.addEventListener('click', toggleTheme);

// Iniciar el juego al cargar
window.onload = initGame;
