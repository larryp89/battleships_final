import { Gameboard } from "./gameboard";

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
    this.lastHit = null;
    this.huntMode = false;
    this.huntDirections = ["up", "down", "right", "left"];
    this.currentDirection = null;
    this.successfulHits = [];
    this.firstHit = null;
  }

  makeMove(oppBoard) {
    let x, y;
    let validMove = false;

    while (!validMove) {
      if (this.huntMode) {
        ({ x, y } = this.huntNextTarget(oppBoard));
      } else {
        ({ x, y } = this.randomAttack(oppBoard));
      }

      if (oppBoard.checkOnGrid(x, y) && this.isValidTarget(oppBoard, x, y)) {
        validMove = true;
      }
    }

    const result = oppBoard.receiveAttack(x, y);
    this.processAttackResult(oppBoard, result, x, y);

    return { x, y, result };
  }

  randomAttack(oppBoard) {
    const validMoves = this.getValidMoves(oppBoard);
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }

  huntNextTarget(oppBoard) {
    if (!this.currentDirection) {
      this.currentDirection = this.huntDirections.shift();
    }

    const targetHit = this.successfulHits[this.successfulHits.length - 1];
    let x = targetHit.x;
    let y = targetHit.y;

    switch (this.currentDirection) {
      case "up":
        y--;
        break;
      case "down":
        y++;
        break;
      case "right":
        x++;
        break;
      case "left":
        x--;
        break;
    }

    if (!oppBoard.checkOnGrid(x, y) || !this.isValidTarget(oppBoard, x, y)) {
      // If the current direction is not valid, reverse direction
      this.reverseDirection();
      return this.huntNextTarget(oppBoard);
    }

    return { x, y };
  }

  reverseDirection() {
    this.currentDirection = this.getOppositeDirection(this.currentDirection);
    this.successfulHits = [this.firstHit];
  }

  isValidTarget(oppBoard, x, y) {
    const cellContent = oppBoard.getCoordinate(x, y);
    return (
      cellContent !== "HIT" && cellContent !== "MISS" && cellContent !== "SUNK"
    );
  }

  processAttackResult(oppBoard, result, x, y) {
    const cellContent = oppBoard.getCoordinate(x, y);

    if (cellContent === "HIT") {
      this.successfulHits.push({ x, y });
      if (!this.huntMode) {
        this.huntMode = true;
        this.firstHit = { x, y };
        this.checkSurroundingSquares(oppBoard, x, y);
      }
    } else if (cellContent === "MISS") {
      if (this.huntMode) {
        if (this.successfulHits.length > 1) {
          // Reverse direction and continue from the first hit
          this.reverseDirection();
        } else {
          // If we've only had one hit, try the next direction
          this.currentDirection = this.huntDirections.shift();
          if (!this.currentDirection) {
            this.resetHuntMode();
          }
        }
      }
    } else if (cellContent === "SUNK") {
      this.resetHuntMode();
    }
  }

  checkSurroundingSquares(oppBoard, x, y) {
    const directions = ["up", "down", "right", "left"];
    this.huntDirections = directions.filter((direction) => {
      const { x: newX, y: newY } = this.getCoordinatesInDirection(
        x,
        y,
        direction
      );
      return (
        oppBoard.checkOnGrid(newX, newY) &&
        this.isValidTarget(oppBoard, newX, newY)
      );
    });
  }

  getCoordinatesInDirection(x, y, direction) {
    switch (direction) {
      case "up":
        return { x, y: y - 1 };
      case "down":
        return { x, y: y + 1 };
      case "right":
        return { x: x + 1, y };
      case "left":
        return { x: x - 1, y };
    }
  }

  getOppositeDirection(direction) {
    switch (direction) {
      case "up":
        return "down";
      case "down":
        return "up";
      case "right":
        return "left";
      case "left":
        return "right";
    }
  }

  resetHuntMode() {
    this.huntMode = false;
    this.lastHit = null;
    this.firstHit = null;
    this.huntDirections = ["up", "down", "right", "left"];
    this.currentDirection = null;
    this.successfulHits = [];
  }

  getValidMoves(oppBoard) {
    let moves = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (this.isValidTarget(oppBoard, x, y)) {
          moves.push({ x, y });
        }
      }
    }
    return moves;
  }
}

export { Player, HumanStrategy, AIStrategy };
