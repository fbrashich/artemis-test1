/**
 * Lógica principal del juego Ta-Te-Ti.
 * Maneja el estado del juego, los turnos de los jugadores (X y O),
 * y verifica las condiciones de victoria o empate.
 */

// Elementos del DOM
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');

// Estado del juego
let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];

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
    const clickedCell = clickedCellEvent.target;
    // Obtiene el índice de la celda de su atributo de datos
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Verifica si la celda ya fue jugada o si el juego no está activo
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Procede con la jugada
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
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

    // Limpia el tablero visualmente
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('x', 'o', 'win'); // Remueve todas las clases añadidas
    });
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', handleRestartGame);
