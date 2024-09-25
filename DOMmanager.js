import { Gameboard, GRID_SIZE } from "./gameboard";
import { Ship } from "./ship";

class DOMManager {
  constructor(player1, player2) {
    this.initProperties(player1, player2);
    this.bindMethods();
    this.setStartButtonEventListener();
  }

  initProperties(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = this.player1;
    this.main = document.querySelector("main");
    this.highlightedCells = [];
    this.shipIndex = 0;
    this.isHorizontal = true;
    this.player1Grid;
    this.player2Grid;
  }

  bindMethods() {
    this.boundStartGameHandler = this.handleStartGame.bind(this);
    this.boundSetHover = this.setHover.bind(this);
    this.boundRemoveHover = this.removeHover.bind(this);
    this.boundPlaceShip = this.placeShip.bind(this);
    this.boundMakeMove = this.makeMove.bind(this);
  }

  makeMove(event) {
    const clickedCell = event.target;
    if (clickedCell.classList.contains("p2-grid")) return;
    const [x, y] = this.getCellCoordinates(clickedCell);

    if (
      this.currentPlayer === this.player1 &&
      this.player1.makeMove(this.player2.gameboard, x, y)
    ) {
      this.updateUIGrid(this.player2);
      this.switchPlayer();

      if (this.isGameOver(this.player2)) {
        alert("GAME OVER YOU WIN");
        // Something to check if play again
        return;
      }
    } else {
      return;
    }

    setTimeout(() => {
      this.makeAIMove();
      if (this.isGameOver(this.player1)) {
        alert("YOU LOSE");
      }
    }, 1000);
  }

  makeAIMove() {
    this.player2.makeMove(this.player1.gameboard);
    this.updateUIGrid(this.player1);
    this.switchPlayer();
  }

  isGameOver(player) {
    return player.gameboard.checkAllSunk();
  }

  showPlayAgain() {}

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  setStartButtonEventListener() {
    const startButton = document.querySelector(".start-button");
    startButton.addEventListener("click", this.boundStartGameHandler);
  }

  setGridEventListeners(grid) {
    grid.addEventListener("mouseover", this.boundSetHover);
    grid.addEventListener("mouseout", this.boundRemoveHover);
    grid.addEventListener("click", this.boundPlaceShip);
  }

  setMakeMoveEventListeners(grid) {
    grid.addEventListener("click", this.boundMakeMove);
  }

  clearMain() {
    this.main.innerHTML = "";
  }

  handleStartGame(e) {
    e.preventDefault();
    this.clearMain();
    this.player1Grid = this.renderGrid(this.player1, "p1-grid");
    this.showFirstBoard(this.player1Grid);
    this.setGridEventListeners(this.player1Grid);
  }

  playGame() {
    this.clearContainer();
    this.renderBothBoards();
    this.updateUIGrid(this.player1);
    this.updateUIGrid(this.player2);
    this.setMakeMoveEventListeners(this.player2Grid);
  }

  clearContainer() {
    const container = document.querySelector(".container");
    if (container) {
      container.innerHTML = "";
    }
  }

  generateAIBoard() {
    this.player2.gameboard.placeRandomShips();
  }

  renderBothBoards() {
    const container =
      document.querySelector(".container") || document.createElement("div");
    container.className = "container";

    this.player1Grid = this.renderGrid(this.player1, "p1-grid");

    this.player2.gameboard.placeRandomShips();
    this.player2Grid = this.renderGrid(this.player2, "p2-grid");

    container.appendChild(this.player1Grid);
    container.appendChild(this.player2Grid);

    this.main.appendChild(container);
  }

  renderGrid(player, classname) {
    const gameboardGrid = player.gameboard.grid;
    const UIGrid = document.createElement("div");
    UIGrid.className = classname; // Remove the dot before the classname
    UIGrid.classList.add("player-grid");

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const gridCell = document.createElement("div");
        gridCell.className = "grid-cell";
        gridCell.setAttribute("data-coords", `${y},${x}`);
        UIGrid.appendChild(gridCell);
      }
    }
    return UIGrid;
  }

  updateUIGrid(player) {
    const gridClass = player === this.player1 ? "p1-grid" : "p2-grid";
    const grid = document.querySelector(`.${gridClass}`);

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const content = player.gameboard.getCoordinate(y, x);
        const gridCell = grid.querySelector(`[data-coords="${y},${x}"]`);

        if (gridCell) {
          gridCell.className = "grid-cell"; // Reset classes
          if (content instanceof Ship) {
            //&& player === this.player1
            gridCell.classList.add("placed");
          } else if (content === "HIT") {
            gridCell.classList.add("attacked");
          } else if (content === "MISS") {
            gridCell.classList.add("missed");
          }
        }
      }
    }
  }

  removeEventHandlers(gridClass) {
    const grid = document.querySelector(`.${gridClass}`);
    if (grid) {
      grid.removeEventListener("mouseover", this.boundSetHover);
      grid.removeEventListener("mouseout", this.boundRemoveHover);
      grid.removeEventListener("click", this.boundPlaceShip);
    }
  }

  showFirstBoard(board) {
    const container = document.createElement("div");
    container.className = "container";
    const instruction = document.createElement("h2");
    instruction.textContent = "Place your ships";
    container.appendChild(instruction);
    container.appendChild(board);
    this.main.appendChild(container);
  }

  setHover(event) {
    if (!event.target.classList.contains("grid-cell")) return;
    if (event.target.classList.contains("placed")) return;

    // Get the ship from the array
    const ship = this.getShip(this.currentPlayer);
    const shipLength = ship.length;
    this.highlightedCells = [];

    let [x, y] = this.getCellCoordinates(event.target);

    for (let i = 0; i < shipLength; i++) {
      const cellToHighlight = this.getGridCellFromCoords(x, y);
      if (cellToHighlight) {
        this.highlightedCells.push(cellToHighlight);
      }
      if (this.isHorizontal) {
        x++;
      } else {
        y++;
      }
    }
    if (
      this.highlightedCells.length < shipLength ||
      this.highlightedCells.some((cell) => cell.classList.contains("placed"))
    ) {
      this.highlightedCells[0].style.backgroundColor = "red";
    } else {
      this.highlightedCells.forEach((cell) => {
        cell.style.backgroundColor = "green";
      });
    }
  }

  placeShip(event) {
    const targetCell = event.target;

    // Ensure the clicked element is a valid grid cell with data-coords attribute
    if (
      !targetCell.classList.contains("grid-cell") ||
      !targetCell.getAttribute("data-coords")
    ) {
      return; // Do nothing if clicked outside the grid or on an invalid target
    }

    const [x, y] = this.getCellCoordinates(targetCell);
    const player = this.currentPlayer;
    const currentShip = this.getShip(player);

    // Try to place the ship
    if (player.gameboard.placeShip(currentShip, x, y, this.isHorizontal)) {
      console.log("Ship placed");
      this.showPlacedShips(player.gameboard.grid);
      this.shipIndex++;
    } else {
      console.log("Invalid placement");
    }

    if (this.checkAllShipsPlaced()) {
      this.removeEventHandlers("p1-grid");
      this.playGame();
    }
  }

  showPlacedShips(grid) {
    // Iterate through array and extract coordinates
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        if (grid[y][x] instanceof Ship) {
          const cell = this.getGridCellFromCoords(x, y);
          cell.classList.add("placed");
        }
      }
    }
  }

  getShip(player) {
    return player.gameboard.allShips[this.shipIndex];
  }

  checkAllShipsPlaced() {
    return this.shipIndex === 5;
  }

  removeHover() {
    this.highlightedCells.forEach((cell) => {
      cell.style.backgroundColor = "";
    });
  }

  getCellCoordinates(cell) {
    if (!cell) return;
    const coordinates = cell.getAttribute("data-coords");
    const [x, y] = coordinates.split(",").map(Number);
    return [x, y];
  }

  getGridCellFromCoords(x, y) {
    const cell = document.querySelector(`[data-coords="${x},${y}"]`);
    return cell;
  }
}
export { DOMManager };
