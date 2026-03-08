import { Player } from "./player.js";

const startGameBtn = document.createElement("button");

// Initial UI
export function renderGameStart(onStart) {
  startGameBtn.classList.add("start-game-btn");
  startGameBtn.textContent = "Start Game";

  startGameBtn.addEventListener("click", () => {
    onStart();

    //Start game button is removed after click
    startGameBtn.remove();
  });

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(startGameBtn);
}

// Name player UI
export function loadPlayerNameForm(sendName) {
  //Create form elements
  const playerNameForm = document.createElement("form");

  const nameInputLabel = document.createElement("label");
  nameInputLabel.textContent = "Player Name";
  nameInputLabel.setAttribute("for", "player-name");

  const nameInput = document.createElement("input");
  nameInput.id = "player-name";
  nameInput.required = true;

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.type = "submit";

  //Players created
  playerNameForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //store a string name
    const inputValue = nameInput.value;

    //Form removed after name submittion
    playerNameForm.remove();

    //name sent to index.js
    sendName(inputValue);
  });

  playerNameForm.appendChild(nameInputLabel);
  playerNameForm.appendChild(nameInput);
  playerNameForm.appendChild(submitBtn);

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(playerNameForm);
}

//Render Players Names to UI

export function loadPlayerTags(humanPlayer, computerPlayer) {
  //Players' names div
  const namesDiv = document.createElement("div");
  namesDiv.classList.add("names-div");

  //Human's name div
  const humanName = document.createElement("div");
  humanName.classList.add("human-name");
  humanName.textContent = `${humanPlayer}`;

  namesDiv.appendChild(humanName);

  //computer' names div
  const computerName = document.createElement("div");
  computerName.classList.add("computer-name");
  computerName.textContent = computerPlayer;

  namesDiv.appendChild(computerName);

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(namesDiv);
}

//==============boards creation==============//

export function loadPlayersBoards(passSpotCoords) {
  //computer' board div
  const computerBoard = document.createElement("div");
  computerBoard.classList.add("computerboard-div");

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const spot = document.createElement("div");
      spot.classList.add("spot");
      spot.dataset.x = x;
      spot.dataset.y = y;
      spot.dataset.board = "computer";

      computerBoard.appendChild(spot);
    }
  }

  //Human's board div
  const humanBoard = document.createElement("div");
  humanBoard.classList.add("humanboard-div");

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const spot = document.createElement("div");
      spot.classList.add("spot");
      spot.dataset.x = x;
      spot.dataset.y = y;
      spot.dataset.board = "human";

      humanBoard.appendChild(spot);
    }
  }

  const boards = document.createElement("div");
  boards.classList.add("boards-div");

  boards.appendChild(computerBoard);
  boards.appendChild(humanBoard);

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(boards);

  //==============boards event listener logic==============//

  boards.addEventListener("click", (e) => {
    if (e.target.matches(".spot")) {
      e.target.classList.toggle("clicked");

      //store clicked spot's coordnates
      const cordX = e.target.dataset.x;
      const cordY = e.target.dataset.y;
      const board = e.target.dataset.board;

      passSpotCoords(cordX, cordY, board);
    }
  });
}

//=================Render Ships on ships boaard=================

export function renderShips() {
  // carrier
  const carrier = document.createElement("div");
  carrier.style.width = "50px";
  carrier.style.height = "10px";
  carrier.style.background = "red";

  carrier.dataset.ship = "carrier";
  carrier.dataset.length = 5;

  // battleship
  const battleship = document.createElement("div");
  battleship.style.width = "40px";
  battleship.style.height = "10px";
  battleship.style.background = "blue";

  battleship.dataset.ship = "battleShip";
  battleship.dataset.length = 4;

  // cruiser
  const cruiser = document.createElement("div");
  cruiser.style.width = "30px";
  cruiser.style.height = "10px";
  cruiser.style.background = "green";

  cruiser.dataset.ship = "cruiser";
  cruiser.dataset.length = 3;

  // submarine
  const submarine = document.createElement("div");
  submarine.style.width = "30px";
  submarine.style.height = "10px";
  submarine.style.background = "purple";

  submarine.dataset.ship = "submarine";
  submarine.dataset.length = 3;

  // destroyer
  const destroyer = document.createElement("div");
  destroyer.style.width = "20px";
  destroyer.style.height = "10px";
  destroyer.style.background = "yellow";

  destroyer.dataset.ship = "destroyer";
  destroyer.dataset.length = 2;

  // ships board
  const shipsBoard = document.createElement("div");
  shipsBoard.classList.add("ships-board");
  shipsBoard.append(destroyer, submarine, cruiser, battleship, carrier);

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(shipsBoard);
}

//render computer ships on computer board
export function renderComputerShips(ships) {
  for (const shipObj of ships) {
    for (const [x, y] of shipObj.coordinates) {
      const spot = document.querySelector(
        `.computerboard-div .spot[data-x="${x}"][data-y="${y}"]`,
      );

      if (spot) {
        spot.classList.add("ship-preview");
      }
    }
  }
}
