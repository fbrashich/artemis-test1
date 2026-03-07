/**
 * script.js
 * Lógica principal para el juego "Salto del Caballo" (Atermis)
 * El objetivo es recorrer todo el tablero de 8x8 con movimientos válidos de caballo (en forma de "L"),
 * visitando cada casilla exactamente una vez.
 */

// Elementos del DOM
const boardElement = document.getElementById('board');
const moveCountElement = document.getElementById('move-count');
const undoCountElement = document.getElementById('undo-count');
const btnUndo = document.getElementById('btn-undo');
const btnRestart = document.getElementById('btn-restart');
const messageArea = document.getElementById('message-area');
const levelSelect = document.getElementById('level-select');

// Constantes del juego
const MAX_UNDOS = 2;
const KNIGHT_EMOJI = '🦄';

// Variables de estado del juego (dependientes del nivel)
let boardSize = 5; // Por defecto el nivel 1 (5x5)
let totalCells = boardSize * boardSize;

// Estado del juego
let board = []; // Matriz para mantener registro de las casillas visitadas
let currentPos = null; // Objeto {row, col} con la posición actual
let moveCount = 0;
let undoCount = MAX_UNDOS;
let history = []; // Arreglo para guardar el historial de posiciones [{row, col}, ...]
let isGameOver = false;

// Movimientos posibles del caballo en forma de "L"
const knightMoves = [
    { r: -2, c: -1 }, { r: -2, c: 1 },
    { r: -1, c: -2 }, { r: -1, c: 2 },
    { r: 1, c: -2 },  { r: 1, c: 2 },
    { r: 2, c: -1 },  { r: 2, c: 1 }
];

/**
 * Inicializa o reinicia el juego.
 */
function initGame() {
    boardSize = parseInt(levelSelect.value);
    totalCells = boardSize * boardSize;

    board = Array(boardSize).fill(null).map(() => Array(boardSize).fill(false));
    moveCount = 0;
    undoCount = MAX_UNDOS;
    history = [];
    isGameOver = false;

    // Posición inicial (centro del tablero aproximadamente)
    currentPos = { row: Math.floor(boardSize / 2), col: Math.floor(boardSize / 2) };
    board[currentPos.row][currentPos.col] = true; // Marcar como visitada
    history.push({ ...currentPos }); // Guardar en historial

    updateUI();
    hideMessage();
    renderBoard();
}

/**
 * Verifica si una posición dada (row, col) es válida dentro del tablero y no ha sido visitada.
 * @param {number} row - Fila
 * @param {number} col - Columna
 * @returns {boolean} True si el movimiento es válido
 */
function isValidMove(row, col) {
    return row >= 0 && row < boardSize &&
           col >= 0 && col < boardSize &&
           !board[row][col];
}

/**
 * Obtiene todos los movimientos válidos desde la posición actual.
 * @returns {Array} Arreglo de objetos {row, col}
 */
function getPossibleMoves() {
    if (!currentPos) return [];

    const possibleMoves = [];
    for (const move of knightMoves) {
        const newRow = currentPos.row + move.r;
        const newCol = currentPos.col + move.c;
        if (isValidMove(newRow, newCol)) {
            possibleMoves.push({ row: newRow, col: newCol });
        }
    }
    return possibleMoves;
}

/**
 * Mueve el caballo a la nueva posición especificada.
 * @param {number} row - Fila destino
 * @param {number} col - Columna destino
 */
function moveTo(row, col) {
    if (isGameOver) return;

    // Marcar nueva posición
    currentPos = { row, col };
    board[row][col] = true;
    history.push({ ...currentPos });

    moveCount++;

    checkGameStatus();
    updateUI();
    renderBoard();
}

/**
 * Deshace el último movimiento realizado, si está permitido.
 */
function undoMove() {
    // Solo permitir deshacer si aún hay undos disponibles y hay movimientos que deshacer
    // (Aún si el juego terminó, permitimos deshacer para intentar otra ruta)
    if (history.length <= 1 || undoCount <= 0) return;

    // Remover la posición actual
    const lastPos = history.pop();
    board[lastPos.row][lastPos.col] = false; // Desmarcar

    // Actualizar a la posición anterior
    currentPos = { ...history[history.length - 1] };

    moveCount--;
    undoCount--;

    // Si habíamos perdido, revertir el estado de game over
    // Si habíamos ganado, lógicamente ya no deberíamos tener el estado de game over al deshacer
    isGameOver = false;
    hideMessage();

    updateUI();
    renderBoard();
}

/**
 * Revisa si el jugador ha ganado o perdido el juego.
 */
function checkGameStatus() {
    const possibleMoves = getPossibleMoves();

    // Victoria: visitó todas las casillas
    if (history.length === totalCells) {
        isGameOver = true;
        showMessage('¡Felicitaciones! Has ganado el juego. 🎉', 'win');
    }
    // Derrota: no hay movimientos posibles y no ha visitado todo
    else if (possibleMoves.length === 0) {
        isGameOver = true;
        showMessage('¡Fin del juego! No hay más movimientos posibles. 😢', 'lose');
    }
}

/**
 * Actualiza los contadores y el estado de los botones en la interfaz.
 */
function updateUI() {
    moveCountElement.textContent = moveCount;
    undoCountElement.textContent = undoCount;

    // Habilitar/deshabilitar botón de deshacer
    // Ahora no bloqueamos el deshacer en caso de isGameOver,
    // a menos que sea una victoria donde no tiene sentido deshacer,
    // pero para mantenerlo simple: solo lo deshabilitamos si no hay undos o no hay historial.
    btnUndo.disabled = (history.length <= 1 || undoCount <= 0);
}

/**
 * Muestra un mensaje al usuario.
 * @param {string} text - Texto del mensaje
 * @param {string} type - Tipo de mensaje ('win' o 'lose')
 */
function showMessage(text, type) {
    messageArea.textContent = text;
    messageArea.className = `message ${type}`;
}

/**
 * Oculta el área de mensajes.
 */
function hideMessage() {
    messageArea.className = 'message hidden';
}

/**
 * Genera y dibuja el tablero en el HTML.
 */
function renderBoard() {
    boardElement.innerHTML = ''; // Limpiar tablero

    // Configurar el grid css dinámicamente
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

    const possibleMoves = getPossibleMoves();

    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Patrón de ajedrez (claro/oscuro)
            if ((r + c) % 2 !== 0) {
                cell.classList.add('dark');
            }

            // Estado de la casilla
            if (currentPos && currentPos.row === r && currentPos.col === c) {
                cell.classList.add('current');
                cell.textContent = KNIGHT_EMOJI;
            } else if (board[r][c]) {
                cell.classList.add('visited');
            } else {
                // Verificar si es un movimiento posible
                const isPossible = possibleMoves.some(m => m.row === r && m.col === c);
                if (isPossible && !isGameOver) {
                    cell.classList.add('possible');
                    // Agregar evento de clic solo a casillas válidas
                    cell.addEventListener('click', () => moveTo(r, c));
                }
            }

            boardElement.appendChild(cell);
        }
    }
}

// Configurar eventos
btnUndo.addEventListener('click', undoMove);
btnRestart.addEventListener('click', initGame);
levelSelect.addEventListener('change', initGame);

// Iniciar el juego al cargar la página
window.addEventListener('DOMContentLoaded', initGame);
