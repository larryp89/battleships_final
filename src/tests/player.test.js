import { Gameboard } from "./gameboard";
import { Ship } from "./ship";
import { Player, HumanStrategy, AIStrategy } from "./player";

let player1;
let player2;

beforeEach(() => {
  player1 = new Player("player-1", new HumanStrategy());
  player2 = new Player("player-2", new AIStrategy());
});

test("Player instantiates", () => {
  expect(player1).toBeInstanceOf(Player);
  expect(player2).toBeInstanceOf(Player);
});

test("Player 1 places ships", () => {
  const ship1 = new Ship(5);
  const ship2 = new Ship(3);
  player1.gameboard.placeShip(ship1, 0, 0, true);
  expect(player1.gameboard.getCoordinate(0, 0)).toBeInstanceOf(Ship);

  //  Simulate attack on ship
  player1.gameboard.receiveAttack(0, 0);
  expect(player1.gameboard.getCoordinate(0, 0)).toBe("HIT");
});

test("Player 1 makes attack on p2 ship", () => {
  const ship1 = new Ship(5);
  player2.gameboard.placeShip(ship1, 0, 0, true);
  player1.makeMove(player2.gameboard, 0, 0);
  expect(player2.gameboard.getCoordinate(0, 0)).toBe("HIT");
});

test("Player 2 makes attack on p1 board", () => {
  player2.makeMove(player1.gameboard);
  expect(player1.gameboard.grid.flat().some((cell) => cell !== null)).toBe(
    true
  );
});
