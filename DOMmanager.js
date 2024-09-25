import { Gameboard, GRID_SIZE } from "./gameboard";

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
    this.boundSetHover = this.setHighlight.bind(this);
    this.boundRemoveHighlight = this.removeHighlight.bind(this);
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

  showFirstBoard(board) {
    const container = document.createElement("div");
    container.className = "container";
    const instruction = document.createElement("h2");
    instruction.textContent = "Place your ships";
    container.appendChild(instruction);
    container.appendChild(board);
    this.main.appendChild(container);
  }

  setHighlight(event) {
    if (!event.target.classList.contains("grid-cell")) return;

    // Get the ship from the array
    const ship = this.getShip(this.currentPlayer);
    const shipLength = ship.length;
    this.highlightedCells = [];

    let [x, y] = this.getCellCoordinates(event.target);

    for (let i = 0; i < shipLength; i++) {
      const cellToHighlight = document.querySelector(
        `[data-coords="${x},${y}"]`
      );
      if (cellToHighlight) {
        this.highlightedCells.push(cellToHighlight);
      }
      if (this.isHorizontal) {
        x++;
      } else {
        y++;
      }
    }
    if (this.highlightedCells.length < shipLength) {
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
      console.log(player.gameboard.grid);
      this.shipIndex++;
    } else {
      console.log("INVALID");
    }
  }

  getShip(player) {
    return player.gameboard.allShips[this.shipIndex];
  }

  removeHighlight() {
    this.highlightedCells.forEach((cell) => {
      cell.style.backgroundColor = "";
    });
  }

  getCellCoordinates(cell) {
    const coordinates = cell.getAttribute("data-coords");
    const [x, y] = coordinates.split(",").map(Number);
    return [x, y];
  }

  setGridEventListeners(grid) {
    grid.addEventListener("mouseover", this.boundSetHover);
    grid.addEventListener("mouseout", this.boundRemoveHighlight);
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
