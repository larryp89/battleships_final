import { DOMManager } from "./DOMmanager";
import { Gameboard } from "./gameboard";
import { Player, HumanStrategy, AIStrategy } from "./player";
import { Ship } from "./ship";

let domManager;
let startButton;

beforeEach(() => {
  document.body.innerHTML = '<button class="start-button">Start</button>';
  startButton = document.querySelector(".start-button");
  domManager = new DOMManager("player1", "player2");
});

test("should initialize properties correctly", () => {
  expect(domManager.player1).toBe("player1");
  expect(domManager.player2).toBe("player2");
  expect(domManager.currentPlayer).toBe("player1");
});

test("should bind methods correctly", () => {
  expect(domManager.boundStartGameHandler).toBeInstanceOf(Function);
});

test("should set event listeners correctly", () => {
  const clickEvent = new Event("click");
  startButton.dispatchEvent(clickEvent);
  expect(console.log).toHaveBeenCalledWith("CLICKEDY CLICK");
});
