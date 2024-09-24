import { DOMManager } from "./DOMmanager";
import { Player, HumanStrategy, AIStrategy } from "./player";
import { Gameboard } from "./gameboard";
import { Ship } from "./ship";

// Instantiate objects
const player1 = new Player("player-1", new HumanStrategy());
const player2 = new Player("player-2", new AIStrategy());

const DOMmanager = new DOMManager(player1, player2);
