import { Ship } from "./ship";

let ship = new Ship(5);

test("Ship has a length", () => {
  expect(ship.length).toBe(5);
});

test("Ship is hit 5 times and is sunk", () => {
  for (let i = 0; i < 5; i++) {
    ship.hit();
  }
  expect(ship.numHits).toBe(5);
  expect(ship.isSunk()).toBe(true);
});
