class Ship {
  constructor(length) {
    this.length = length;
    this.numHits = 0;
    this.positions = [];
  }

  hit() {
    this.numHits++;
  }

  isSunk() {
    return this.numHits >= this.length;
  }

  updatePosition(x, y) {
    this.positions.push([x, y]);
  }

  getPositions() {
    return this.positions;
  }
}

export { Ship };
