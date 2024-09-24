import { Ship } from "./ship";

const GRID_SIZE = 10;

class Gameboard {
  constructor() {
    // Build 10x10 grid of nulls
    this.grid = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(null)
    );
    this.allShips = [];
    this.allSunk = false;
    this.init();
  }
  // Initialise ships
  init() {
    this.allShips.push(new Ship(5, "Aircraft carrier"));
    this.allShips.push(new Ship(4, "Battleship"));
    this.allShips.push(new Ship(3, "Destroyer"));
    this.allShips.push(new Ship(3, "Sub"));
    this.allShips.push(new Ship(2, "Patrol boat"));
  }

  checkAllSunk() {
    return this.allShips.every((ship) => ship.sunk === true);
    
  }

  getCoordinate(x, y) {
    return this.grid[y][x];
  }

  checkFree(x, y) {
    return this.grid[y][x] === null;
  }

  checkOnGrid(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) return false;
    return true;
  }

  checkValidPlacement(shipLength, x, y, isHorizontal) {
    for (let i = 0; i < shipLength; i++) {
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
    const shipLength = ship.length;

    // If the placement will be valid
    if (this.checkValidPlacement(shipLength, x, y, isHorizontal)) {
      for (let i = 0; i < shipLength; i++) {
        // Update the grid location with ship
        this.updateGrid(x, y, ship);
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
    if (attackedCell === "HIT" || attackedCell === "MISS") return false; // Invalid move as already attacked
    if (attackedCell instanceof Ship) {
      attackedCell.hit();
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
}

export { Gameboard };
