import { Player } from "./player.js";

export let GameState = "not playing";
export let players = {};

export function startGame(inputValue) {
  GameState = "playing";
  players = {
    human: new Player(inputValue, "human"),
    computer: new Player("Computer", "computer"),
  };
}
