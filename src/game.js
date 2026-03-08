import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Board } from "./board.js";

export let GameState = "not playing";
export let players = {};

export function startGame(inputValue) {
  //Game state changed
  GameState = "playing";
  //players objects created
  players = {
    human: new Player(inputValue, "human"),
    computer: new Player("Computer", "computer"),
  };

  //create & place computer's ships
  const computerBoard = players.computer.board;

  const carrier = new Ship(5);
  placeShipRandomly(computerBoard, carrier);

  const battleship = new Ship(4);
  placeShipRandomly(computerBoard, battleship);

  const cruiser = new Ship(3);
  placeShipRandomly(computerBoard, cruiser);

  const submarine = new Ship(3);
  placeShipRandomly(computerBoard, submarine);

  const destroyer = new Ship(2);
  placeShipRandomly(computerBoard, destroyer);

  console.log(players);
}

//Get random coords for computer's ships placment
function randomCoords() {
  const x = Math.floor(Math.random() * 10);
  const y = Math.floor(Math.random() * 10);

  return [x, y];
}

//Get random direction for computer's ships placment
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
