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
  }

  bindMethods() {
    this.boundStartGameHandler = this.handleStartGame.bind(this);
    this.boundSetHover = this.setHover.bind(this);
    this.boundRemoveHighlight = this.removeHighlight.bind(this);
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

  setHover(event) {
    if (!event.target.classList.contains("grid-cell")) return;

    // Get the ship from the array
    const ship = this.currentPlayer.gameboard.allShips[this.shipIndex];

    let highlightedCells = [];

    const currentCell = event.target;
    currentCell.style.backgroundColor = "red";
  }

  removeHighlight(event) {
    const currentCell = event.target;
    currentCell.style.backgroundColor = "";
  }

  setGridEventListeners(grid) {
    grid.addEventListener("mouseover", this.boundSetHover);
    grid.addEventListener("mouseout", this.boundRemoveHighlight);
    // grid.addEventListener("click", this.boundClickHandler);
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
        gridCell.setAttribute("data-coord", `${y}${x}`);
        playerGrid.appendChild(gridCell);
      }
    }
    return playerGrid;
  }
}
export { DOMManager };
