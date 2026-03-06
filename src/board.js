export class Board {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, x, y, direction) {
    let coordinates = [];

    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        coordinates.push([x + i, y]);
      } else if (direction === "vertical") {
        coordinates.push([x, y + i]);
      }
    }

    for (const coord of coordinates) {
      const cx = coord[0];
      const cy = coord[1];

      if (cx < 0 || cx >= 10 || cy < 0 || cy >= 10) {
        throw new Error("Ship out of bounds");
      }
    }

    this.ships.push({
      ship,
      coordinates,
    });
  }

  receiveAttack(x, y) {
    //Loop through every ship on board
    for (let i = 0; i < this.ships.length; i++) {
      let shipObj = this.ships[i];
      //Loop through every coordnate of every ship
      for (let j = 0; j < shipObj.coordinates.length; j++) {
        let coord = shipObj.coordinates[j];

        //check if hit coordnate corresponds with ship position
        if (coord[0] === x && coord[1] === y) {
          shipObj.ship.hit();
          return;
        }
      }
    }

    this.missedAttacks.push([x, y]);
  }

  allShipsSunk() {
    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].ship.isSunk()) {
        return false;
      }
    }

    return true;
  }
}
