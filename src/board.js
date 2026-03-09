export class Board {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
    this.hitAttacks = [];
  }

  placeShip(ship, x, y, direction) {
    const coordinates = [];

    for (let i = 0; i < ship.length; i++) {
      if (direction === "horizontal") {
        coordinates.push([x + i, y]);
      } else if (direction === "vertical") {
        coordinates.push([x, y + i]);
      } else {
        throw new Error("Invalid direction");
      }
    }

    for (const [cx, cy] of coordinates) {
      if (cx < 0 || cx >= 10 || cy < 0 || cy >= 10) {
        throw new Error("Ship out of bounds");
      }
    }

    for (const newCoord of coordinates) {
      for (const placedShip of this.ships) {
        for (const placedCoord of placedShip.coordinates) {
          if (
            newCoord[0] === placedCoord[0] &&
            newCoord[1] === placedCoord[1]
          ) {
            throw new Error("Ship overlap");
          }
        }
      }
    }

    this.ships.push({
      ship,
      coordinates,
    });
  }

  receiveAttack(x, y) {
    for (let i = 0; i < this.missedAttacks.length; i++) {
      const missedCoord = this.missedAttacks[i];
      if (missedCoord[0] === x && missedCoord[1] === y) {
        return "already attacked";
      }
    }

    for (let i = 0; i < this.hitAttacks.length; i++) {
      const hitCoord = this.hitAttacks[i];
      if (hitCoord[0] === x && hitCoord[1] === y) {
        return "already attacked";
      }
    }

    for (let i = 0; i < this.ships.length; i++) {
      const shipObj = this.ships[i];

      for (let j = 0; j < shipObj.coordinates.length; j++) {
        const coord = shipObj.coordinates[j];

        if (coord[0] === x && coord[1] === y) {
          shipObj.ship.hit();
          this.hitAttacks.push([x, y]);
          return "hit";
        }
      }
    }

    this.missedAttacks.push([x, y]);
    return "miss";
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
