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
    this.huntDirections = ["up", "right", "down", "left"];
    this.currentDirection = null;
    this.successfulHits = [];
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

    const startPoint = this.lastHit || this.successfulHits[0];
    let x = startPoint.x;
    let y = startPoint.y;

    switch (this.currentDirection) {
      case "up":
        y--;
        break;
      case "right":
        x++;
        break;
      case "down":
        y++;
        break;
      case "left":
        x--;
        break;
    }

    if (!oppBoard.checkOnGrid(x, y) || !this.isValidTarget(oppBoard, x, y)) {
      this.currentDirection = this.huntDirections.shift();
      if (!this.currentDirection) {
        this.resetHuntMode();
        return this.randomAttack(oppBoard);
      }
      return this.huntNextTarget(oppBoard);
    }

    return { x, y };
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
        this.lastHit = { x, y };
      } else {
        this.lastHit = { x, y };
      }
    } else if (cellContent === "MISS") {
      if (this.huntMode) {
        this.currentDirection = null;
        if (this.huntDirections.length === 0) {
          if (this.successfulHits.length > 1) {
            this.lastHit = this.successfulHits[0];
            this.huntDirections = ["up", "right", "down", "left"];
          } else {
            this.resetHuntMode();
          }
        }
      }
    } else if (cellContent === "SUNK") {
      this.resetHuntMode();
    }
  }

  resetHuntMode() {
    this.huntMode = false;
    this.lastHit = null;
    this.huntDirections = ["up", "right", "down", "left"];
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
