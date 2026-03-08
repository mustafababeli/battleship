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

export function loadPlayersBoards() {
  //Human's board div
  const humanBoard = document.createElement("div");
  humanBoard.classList.add("humanboard-div");

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const spot = document.createElement("div");
      spot.classList.add("spot");
      spot.dataset.x = x;
      spot.dataset.y = y;

      humanBoard.appendChild(spot);
    }
  }

  //computer' board div
  const computerBoard = document.createElement("div");
  computerBoard.classList.add("computerboard-div");

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const spot = document.createElement("div");
      spot.classList.add("spot");
      spot.dataset.x = x;
      spot.dataset.y = y;

      computerBoard.appendChild(spot);
    }
  }

  const boards = document.createElement("div");
  boards.classList.add("boards-div");

  boards.appendChild(humanBoard);
  boards.appendChild(computerBoard);

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(boards);
}
