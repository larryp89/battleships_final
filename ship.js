class Ship {
  constructor(length) {
    this.length = length;
    this.numHits = 0;
  }

  hit() {
    this.numHits++;
  }

  isSunk() {
    return this.numHits >= this.length;
  }
}


export { Ship };
