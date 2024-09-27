import { Gameboard, GRID_SIZE } from "./gameboard";

class Player {
  constructor(name, strategy) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.strategy = strategy;
  }

  makeMove(oppBoard, x = 0, y = 0) {
    return this.strategy.makeMove(oppBoard, x, y);
  }
}

class HumanStrategy {
  // Receives move from DOMManager method which gets click
  makeMove(oppBoard, x, y) {
    return oppBoard.receiveAttack(x, y);
  }
}

class AIStrategy {
  constructor() {
    this.huntMode = false;
    this.anchorHit = null;
    this.successfulHits = [];
    this.directions = ["up", "down", "right", "left"];
    this.currentDirection = null;
    this.currentHit = null;
  }

  makeMove(oppBoard) {
    let x, y;
    if (this.huntMode) {
      ({ x, y } = this.huntModeCoords(oppBoard));
    } else {
      ({ x, y } = this.randomAttack(oppBoard));
    }

    const result = oppBoard.receiveAttack(x, y);
    this.processAttackResult(oppBoard, result, x, y);

    return result;
  }

  randomAttack(oppBoard) {
    let x, y;
    do {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
    } while (!this.isValidTarget(oppBoard, x, y));
    return { x, y };
  }

  huntModeCoords(oppBoard) {
    if (!this.currentDirection) {
      this.currentDirection = this.directions[0];
      this.currentHit = this.anchorHit;
    }

    let { x, y } = this.getNextCoordinates(
      this.currentHit.x,
      this.currentHit.y,
      this.currentDirection
    );

    if (!this.isValidTarget(oppBoard, x, y)) {
      return this.changeDirection(oppBoard);
    }

    return { x, y };
  }

  changeDirection(oppBoard) {
    const currentIndex = this.directions.indexOf(this.currentDirection);
    if (currentIndex < this.directions.length - 1) {
      this.currentDirection = this.directions[currentIndex + 1];
      this.currentHit = this.anchorHit;
      return this.huntModeCoords(oppBoard);
    } else {
      // All directions exhausted, move to the next successful hit or random attack
      if (this.successfulHits.length > 0) {
        this.anchorHit = this.successfulHits.shift();
        this.currentHit = this.anchorHit;
        this.currentDirection = this.directions[0];
        return this.huntModeCoords(oppBoard);
      } else {
        this.huntMode = false;
        return this.randomAttack(oppBoard);
      }
    }
  }

  getNextCoordinates(x, y, direction) {
    switch (direction) {
      case "up":
        return { x, y: y - 1 };
      case "down":
        return { x, y: y + 1 };
      case "left":
        return { x: x - 1, y };
      case "right":
        return { x: x + 1, y };
    }
  }

  isValidTarget(oppBoard, x, y) {
    return (
      oppBoard.checkOnGrid(x, y) &&
      oppBoard.getCoordinate(x, y) !== "HIT" &&
      oppBoard.getCoordinate(x, y) !== "MISS" &&
      oppBoard.getCoordinate(x, y) !== "SUNK"
    );
  }

  processAttackResult(oppBoard, result, x, y) {
    const cellContent = oppBoard.getCoordinate(x, y);
    if (cellContent === "HIT") {
      if (!this.huntMode) {
        this.huntMode = true;
        this.anchorHit = { x, y };
        this.currentHit = this.anchorHit;
      } else {
        this.currentHit = { x, y };
      }
      this.successfulHits.push({ x, y });
    } else if (cellContent === "MISS") {
      if (this.huntMode) {
        return this.changeDirection(oppBoard);
      }
    } else if (cellContent === "SUNK") {
      this.resetHuntMode();
    }
  }

  resetHuntMode() {
    this.huntMode = false;
    this.anchorHit = null;
    this.successfulHits = [];
    this.currentDirection = null;
    this.currentHit = null;
  }
}

export { Player, HumanStrategy, AIStrategy };
