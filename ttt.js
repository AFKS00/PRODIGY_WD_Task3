const board = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const playerModeSelect = document.getElementById("playerModeSelect");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isOnePlayerMode = false;

// Create the cells dynamically
for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
}

function handleCellClick(event) {
    if (!gameActive) return;

    const clickedCell = event.target;
    const cellIndex = clickedCell.dataset.index;

    if (gameBoard[cellIndex] === "") {
        gameBoard[cellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        if (checkWinner()) {
            endGame(`Player ${currentPlayer} wins!`);
        } else if (isBoardFull()) {
            endGame("It's a draw!");
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";

            if (isOnePlayerMode && currentPlayer === "O") {
                // AI's turn (delay for better user experience)
                setTimeout(() => {
                    makeRandomMove();
                }, 500);
            }

            updateStatus();
        }
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    return winPatterns.some(pattern =>
        pattern.every(index => gameBoard[index] === currentPlayer)
    );
}

function isBoardFull() {
    return gameBoard.every(cell => cell !== "");
}

function endGame(message) {
    gameActive = false;
    statusElement.textContent = message;
}

function restartGame() {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    // Clear the board
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";
    });

    updateStatus();
}

function makeRandomMove() {
    const emptyCells = gameBoard.reduce((acc, cell, index) => {
        if (cell === "") acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMove = emptyCells[randomIndex];

        // Simulate AI's click after a delay
        setTimeout(() => {
            const aiCell = document.querySelector(`.cell[data-index="${aiMove}"]`);
            if (aiCell) {
                aiCell.click();
            }
        }, 500);
    }
}

function updateStatus() {
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

// Event listener for restart button
restartBtn.addEventListener("click", restartGame);

// Event listener for player mode selection
playerModeSelect.addEventListener("change", () => {
    isOnePlayerMode = playerModeSelect.value === "onePlayer";
    restartGame();
});

// Initial game status
updateStatus();
