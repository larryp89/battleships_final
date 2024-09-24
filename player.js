import { Gameboard } from "./gameboard";

class Player {
  constructor(name, strategy) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.strategy = strategy;
  }

  makeMove(oppBoard, x, y) {
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
  makeMove(oppBoard) {
    const { x, y } = this.easyAttack();
    return oppBoard.receiveAttack(x, y);
  }

  easyAttack() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return { x, y };
  }
}

export { Player, HumanStrategy, AIStrategy };
