import { Board } from "./board.js";

export class Player {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.board = new Board();
  }
}
