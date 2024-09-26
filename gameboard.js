import { Ship } from "./ship";

const GRID_SIZE = 10;

class Gameboard {
  constructor() {
    // Build 10x10 grid of nulls
    this.grid = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(null)
    );
    this.allShips = [];
    this.init();
  }
  // Initialise ships
  init() {
    this.allShips.push(new Ship(5));
    this.allShips.push(new Ship(4));
    this.allShips.push(new Ship(3));
    this.allShips.push(new Ship(3));
    this.allShips.push(new Ship(2));
  }

  checkAllSunk() {
    return this.allShips.every((ship) => ship.isSunk() === true);
  }

  getCoordinate(x, y) {
    return this.grid[y][x];
  }

  checkFree(x, y) {
    return this.grid[y][x] === null;
  }

  checkOnGrid(x, y) {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
  }

  checkValidPlacement(ship, x, y, isHorizontal) {
    for (let i = 0; i < ship.length; i++) {
      // If it's not on the grid or it's not free, return false
      if (!this.checkOnGrid(x, y) || !this.checkFree(x, y)) {
        return false;
      }
      // Otherwise, increment x or y accordingy
      if (isHorizontal) {
        x++;
      } else {
        y++;
      }
    }
    return true;
  }

  // Place a ship at specific coordiantes
  placeShip(ship, x, y, isHorizontal) {
    // If the placement will be valid
    if (this.checkValidPlacement(ship, x, y, isHorizontal)) {
      for (let i = 0; i < ship.length; i++) {
        // Update the grid location with ship
        this.updateGrid(x, y, ship);
        ship.updatePosition(x, y);

        if (isHorizontal) {
          x++;
        } else {
          y++;
        }
      }

      return true;
    }
    return false;
  }

  updateGrid(x, y, update) {
    this.grid[y][x] = update;
  }

  receiveAttack(x, y) {
    const attackedCell = this.grid[y][x];
    if (
      attackedCell === "HIT" ||
      attackedCell === "MISS" ||
      attackedCell === "SUNK"
    )
      return false; // Invalid move as already attacked

    if (attackedCell instanceof Ship) {
      attackedCell.hit();
      if (attackedCell.isSunk()) {
        const updateArray = attackedCell.getPositions();
        updateArray.forEach((gridRef) => {
          const [newX, newY] = gridRef;
          this.updateGrid(newX, newY, "SUNK");
        });
        return true;
      }

      this.updateGrid(x, y, "HIT");
      return true; // Valid move (hit)
    } else {
      this.updateGrid(x, y, "MISS");
      return true; // Valid move (miss)
    }
  }

  placeRandomShips() {
    this.allShips.forEach((ship) => {
      let placed = false;

      while (!placed) {
        const randomX = Math.floor(Math.random() * GRID_SIZE);
        const randomY = Math.floor(Math.random() * GRID_SIZE);
        const isHorizontal = Math.random() < 0.5; // Randomly decide orientation

        placed = this.placeShip(ship, randomX, randomY, isHorizontal);
      }
    });
  }

  reset() {
    this.grid = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(null)
    );
    this.allShips = [];
    this.init();
  }
}

export { Gameboard, GRID_SIZE };
