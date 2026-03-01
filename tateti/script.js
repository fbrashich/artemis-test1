/**
 * Lógica principal del juego Ta-Te-Ti.
 * Maneja el estado del juego, los turnos de los jugadores (X y O),
 * y verifica las condiciones de victoria o empate.
 */

// Elementos del DOM
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const changeModeBtn = document.getElementById('change-mode-btn');
const modeSelection = document.getElementById('mode-selection');
const difficultySelection = document.getElementById('difficulty-selection');
const gameBoardContainer = document.getElementById('game-board-container');
const btnPvp = document.getElementById('btn-pvp');
const btnPvb = document.getElementById('btn-pvb');
const btnDiffLow = document.getElementById('btn-diff-low');
const btnDiffMedium = document.getElementById('btn-diff-medium');
const btnDiffHigh = document.getElementById('btn-diff-high');

// Estado del juego
let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameMode = 'pvp'; // 'pvp' o 'pvb'
let botDifficulty = 'dificil'; // 'bajo', 'medio' o 'dificil'
let isBotTurn = false;

// Combinaciones ganadoras posibles
const winningConditions = [
    [0, 1, 2], // Fila superior
    [3, 4, 5], // Fila central
    [6, 7, 8], // Fila inferior
    [0, 3, 6], // Columna izquierda
    [1, 4, 7], // Columna central
    [2, 5, 8], // Columna derecha
    [0, 4, 8], // Diagonal principal
    [2, 4, 6]  // Diagonal secundaria
];

/**
 * Mensajes de estado para mostrar al usuario.
 */
const winningMessage = () => `¡El jugador <span class="player player-${currentPlayer.toLowerCase()}">${currentPlayer}</span> ha ganado!`;
const drawMessage = () => `¡El juego terminó en empate!`;
const currentPlayerTurn = () => `Turno de <span class="player player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>`;

/**
 * Maneja el evento de click en una celda.
 * @param {Event} clickedCellEvent Evento del click.
 */
function handleCellClick(clickedCellEvent) {
    if (isBotTurn || !gameActive) return;

    const clickedCell = clickedCellEvent.target;
    // Obtiene el índice de la celda de su atributo de datos
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Verifica si la celda ya fue jugada
    if (gameState[clickedCellIndex] !== '') {
        return;
    }

    // Procede con la jugada
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

/**
 * Evalúa el tablero usando el algoritmo minimax para encontrar la mejor jugada.
 * @param {Array<string>} board Estado actual del tablero.
 * @param {number} depth Profundidad actual del árbol de búsqueda.
 * @param {boolean} isMaximizing Si es el turno del bot (maximizador) o del jugador (minimizador).
 * @returns {number} El puntaje de la jugada.
 */
function minimax(board, depth, isMaximizing) {
    // Comprobar estado terminal
    let result = checkWin(board);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;

    let isDraw = true;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            isDraw = false;
            break;
        }
    }
    if (isDraw) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

/**
 * Función auxiliar para verificar si hay un ganador en el algoritmo minimax.
 * @param {Array<string>} board Estado del tablero a verificar.
 * @returns {string|null} El jugador ganador ('X' o 'O') o null si no hay.
 */
function checkWin(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

/**
 * Lógica del bot para realizar una jugada según la dificultad.
 */
function makeBotMove() {
    if (!gameActive) return;

    let move = -1;

    // Obtener casillas vacías disponibles
    let availableMoves = [];
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            availableMoves.push(i);
        }
    }

    if (availableMoves.length === 0) return;

    let useMinimax = false;

    if (botDifficulty === 'dificil') {
        useMinimax = true;
    } else if (botDifficulty === 'medio') {
        // 50% probabilidad de usar minimax, 50% de hacer movimiento aleatorio
        useMinimax = Math.random() > 0.5;
    } else {
        // 'bajo': siempre aleatorio
        useMinimax = false;
    }

    if (useMinimax) {
        let bestScore = -Infinity;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                // Intentar la jugada
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false);
                // Deshacer la jugada
                gameState[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
    } else {
        // Movimiento aleatorio
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        move = availableMoves[randomIndex];
    }

    if (move === -1) return;

    const cellElement = document.querySelector(`.cell[data-index="${move}"]`);

    setTimeout(() => {
        handleCellPlayed(cellElement, move);
        handleResultValidation();
        isBotTurn = false;
    }, 500); // Pequeño retraso para simular pensamiento
}

/**
 * Actualiza el estado del juego y la interfaz visual para una celda jugada.
 * @param {HTMLElement} clickedCell Elemento de la celda clickeada.
 * @param {number} clickedCellIndex Índice de la celda en el array gameState.
 */
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;

    // Añade la clase correspondiente (x u o) para los estilos CSS
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

/**
 * Verifica si hay un ganador o si el juego terminó en empate tras una jugada.
 */
function handleResultValidation() {
    let roundWon = false;
    let winningCells = [];

    // Itera a través de las condiciones de victoria
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        // Si alguna de las celdas en la condición está vacía, no hay victoria todavía
        if (a === '' || b === '' || c === '') {
            continue;
        }

        // Si las tres celdas son iguales, hay un ganador
        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition; // Guarda los índices ganadores
            break;
        }
    }

    // Maneja la situación de victoria
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        highlightWinningCells(winningCells);
        return;
    }

    // Verifica si hay empate (no quedan celdas vacías)
    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // Si nadie ganó ni empató, es el turno del otro jugador
    handlePlayerChange();

    if (gameMode === 'pvb' && currentPlayer === 'O' && gameActive) {
        isBotTurn = true;
        makeBotMove();
    }
}

/**
 * Resalta las celdas que forman la combinación ganadora.
 * @param {Array<number>} winningCells Array de índices ganadores.
 */
function highlightWinningCells(winningCells) {
    winningCells.forEach(index => {
        cells[index].classList.add('win');
    });
}

/**
 * Cambia el turno al siguiente jugador.
 */
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
}

/**
 * Reinicia el estado del juego a su configuración inicial.
 */
function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = currentPlayerTurn();
    isBotTurn = false;

    // Limpia el tablero visualmente
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o', 'win'); // Remueve todas las clases añadidas
    });

    if (gameMode === 'pvb' && currentPlayer === 'O') {
        isBotTurn = true;
        makeBotMove();
    }
}

/**
 * Cambia la vista al menú principal.
 */
function showModeSelection() {
    gameBoardContainer.classList.add('hidden');
    difficultySelection.classList.add('hidden');
    modeSelection.classList.remove('hidden');
    handleRestartGame();
}

/**
 * Muestra el menú de selección de dificultad.
 */
function showDifficultySelection() {
    modeSelection.classList.add('hidden');
    difficultySelection.classList.remove('hidden');
}

/**
 * Inicia el juego con el modo seleccionado.
 * @param {string} mode Modo de juego ('pvp' o 'pvb')
 * @param {string} diff Dificultad ('bajo', 'medio', 'dificil'), opcional
 */
function startGame(mode, diff) {
    gameMode = mode;
    if (diff) botDifficulty = diff;

    modeSelection.classList.add('hidden');
    difficultySelection.classList.add('hidden');
    gameBoardContainer.classList.remove('hidden');
    handleRestartGame();
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', handleRestartGame);
changeModeBtn.addEventListener('click', showModeSelection);
btnPvp.addEventListener('click', () => startGame('pvp'));
btnPvb.addEventListener('click', showDifficultySelection);

btnDiffLow.addEventListener('click', () => startGame('pvb', 'bajo'));
btnDiffMedium.addEventListener('click', () => startGame('pvb', 'medio'));
btnDiffHigh.addEventListener('click', () => startGame('pvb', 'dificil'));
