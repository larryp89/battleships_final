import { Gameboard, GRID_SIZE } from "./gameboard";
import { Ship } from "./ship";

class DOMManager {
  constructor(player1, player2) {
    this.initProperties(player1, player2);
    this.bindMethods();
    this.setEventListeners();
  }

  initProperties(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.currentPlayer = this.player1;
    this.main = document.querySelector("main");
    this.highlightedCells = [];
    this.shipIndex = 0;
    this.isHorizontal = true;
  }

  bindMethods() {
    this.boundStartGameHandler = this.handleStartGame.bind(this);
    this.boundSetHover = this.setHover.bind(this);
    this.boundRemoveHover = this.removeHover.bind(this);
    this.boundPlaceShip = this.placeShip.bind(this);
  }

  setEventListeners() {
    const startButton = document.querySelector(".start-button");
    startButton.addEventListener("click", this.boundStartGameHandler);
  }

  clearMain() {
    this.main.innerHTML = "";
  }

  handleStartGame(e) {
    e.preventDefault();
    this.clearMain();
    const p1Grid = this.buildGrid(this.player1, "p1-grid");
    this.showFirstBoard(p1Grid);
    this.setGridEventListeners(p1Grid);
  }

  playGame() {
    console.log("Okay");
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
    // If it will be a valid ship placement for the first cell
    const player = this.currentPlayer;
    const targetCell = event.target;
    const [x, y] = this.getCellCoordinates(targetCell);

    // Get current ship and check can place on gameboard
    const currentShip = this.getShip(player);
    if (player.gameboard.placeShip(currentShip, x, y, this.isHorizontal)) {
      console.log("Ship placed");
      this.showPlacedShips(player.gameboard.grid);
      this.shipIndex++;
    } else {
      console.log("INVALID");
    }

    if (this.checkAllShipsPlaced()) {
      this.removeEventHandlers("p1-grid");
      this.playGame();
    }
  }

  // Add grey background to placed ships
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

  // Get the coordinates from DOM grid-cell
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

  setGridEventListeners(grid) {
    grid.addEventListener("mouseover", this.boundSetHover);
    grid.addEventListener("mouseout", this.boundRemoveHover);
    grid.addEventListener("click", this.boundPlaceShip);
  }

  // Build grid with usable class names and attributes
  buildGrid(player, classname) {
    const playerGrid = document.createElement("div");
    playerGrid.className = classname;
    playerGrid.classList.add("player-grid");

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const gridCell = document.createElement("div");
        gridCell.className = "grid-cell";
        gridCell.setAttribute("data-coords", `${y},${x}`);
        playerGrid.appendChild(gridCell);
      }
    }
    return playerGrid;
  }
}
export { DOMManager };
