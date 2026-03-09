import { Player } from "./player.js";
import { Ship } from "./ship.js";

export let GameState = "not playing";
export let players = {};

export function startGame(inputValue) {
  GameState = "placing";

  players = {
    human: new Player(inputValue, "human"),
    computer: new Player("Computer", "computer"),
  };

  const computerBoard = players.computer.board;

  placeShipRandomly(computerBoard, new Ship(5));
  placeShipRandomly(computerBoard, new Ship(4));
  placeShipRandomly(computerBoard, new Ship(3));
  placeShipRandomly(computerBoard, new Ship(3));
  placeShipRandomly(computerBoard, new Ship(2));
}

export function startBattle() {
  GameState = "playing";
}

export function endGame() {
  GameState = "gameover";
}

function randomCoords() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);
  return [x, y];
}

function getRandomDirection() {
  return Math.random() < 0.5 ? "horizontal" : "vertical";
}

function placeShipRandomly(board, ship) {
  let placed = false;

  while (!placed) {
    const [x, y] = randomCoords();
    const direction = getRandomDirection();

    try {
      board.placeShip(ship, x, y, direction);
      placed = true;
    } catch (error) {
      // try again
    }
  }
}
