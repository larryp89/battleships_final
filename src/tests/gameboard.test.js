import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard(); // Initializes new gameboard before each test
});

test("Gameboard should initialize with all cells empty", () => {
  // Check that the grid is empty
  const isEmpty = gameboard.grid.every((row) =>
    row.every((cell) => cell === null)
  );

  expect(isEmpty).toBe(true);
});

test("Gameboard should initialize with 5 ships", () => {
  expect(gameboard.allShips.length).toBe(5);
});

test("Gameboard should initialize with 5 unsunk ships", () => {
  expect(gameboard.checkAllSunk()).toBe(false);

  // Simulate allSunk true
  gameboard.allShips.forEach((ship) => {
    for (let i = 0; i < ship.length; i++) {
      ship.hit();
    }
  });
  expect(gameboard.checkAllSunk()).toBe(true);
});

test("Return Null from empty board using check coordinate", () => {
  expect(gameboard.getCoordinate(0, 0)).toBe(null);
});

test("Return true if on grid or false if not", () => {
  const ship1 = new Ship(5);
  const ship2 = new Ship(2);
  const ship3 = new Ship(5);
  const ship4 = new Ship(5);
  const ship5 = new Ship(3);

  expect(gameboard.checkValidPlacement(ship1, 0, 0, true)).toBe(true);
  expect(gameboard.checkValidPlacement(ship2, 7, 7, true)).toBe(true);
  expect(gameboard.checkValidPlacement(ship3, 6, 6, true)).toBe(false);
  expect(gameboard.checkValidPlacement(ship4, 6, 6, false)).toBe(false);
  expect(gameboard.checkValidPlacement(ship5, 6, 6, false)).toBe(true);
});

test("Check validity of placing ship", () => {
  const ship1 = new Ship(5);
  const ship2 = new Ship(5);
  const ship3 = new Ship(5);

  expect(gameboard.placeShip(ship1, 4, 4, true)).toBe(true);
  // 4,4, 5,4, 6,4, 7,4, 8,4 occupied
  expect(gameboard.placeShip(ship2, 9, 4, false)).toBe(true);
  // 9,4, 9,5, 9,6, 9.7, 9,8 occupied
  expect(gameboard.placeShip(ship3, 5, 4, true)).toBe(false); // Occupied
  expect(gameboard.placeShip(ship3, 9, 6, false)).toBe(false); // Off board
});

test("Simulating hitting and sinking a ship", () => {
  const ship1 = new Ship(5);
  gameboard.placeShip(ship1, 0, 0, true);
  gameboard.receiveAttack(5, 5);
  expect(gameboard.getCoordinate(0, 0)).toBeInstanceOf(Ship);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.getCoordinate(0, 0)).toBe("HIT");
  expect(gameboard.getCoordinate(5, 5)).toBe("MISS");
  expect(ship1.numHits).toBe(1);
  console.log(gameboard.placeRandomShips());
  console.log(gameboard.placeRandomShips());
});
