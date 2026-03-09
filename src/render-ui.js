const startGameBtn = document.createElement("button");

function getDraggedShipData(event) {
  const rawData = event.dataTransfer?.getData("text/plain");

  if (!rawData || !rawData.trim()) return null;

  try {
    return JSON.parse(rawData);
  } catch {
    return null;
  }
}

export function renderGameStart(onStart) {
  startGameBtn.classList.add("start-game-btn");
  startGameBtn.textContent = "Start Game";

  startGameBtn.addEventListener("click", () => {
    onStart();
    startGameBtn.remove();
  });

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(startGameBtn);
}

export function loadPlayerNameForm(sendName) {
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

  playerNameForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = nameInput.value.trim();
    if (!inputValue) return;

    hideGameTitle();
    playerNameForm.remove();
    sendName(inputValue);
  });

  playerNameForm.appendChild(nameInputLabel);
  playerNameForm.appendChild(nameInput);
  playerNameForm.appendChild(submitBtn);

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(playerNameForm);
}

export function hideGameTitle() {
  const title = document.querySelector(".header");
  if (title) {
    title.remove();
  }
}

export function loadPlayersBoards(
  humanPlayer,
  computerPlayer,
  onAttack,
  onPlacement,
  onPlacementHover,
  onPlacementHoverLeave,
) {
  const computerWrapper = document.createElement("div");
  computerWrapper.classList.add("board-wrapper");

  const computerLabel = document.createElement("div");
  computerLabel.classList.add("board-label");
  computerLabel.textContent = computerPlayer;

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

  computerWrapper.appendChild(computerLabel);
  computerWrapper.appendChild(computerBoard);

  const humanWrapper = document.createElement("div");
  humanWrapper.classList.add("board-wrapper");

  const humanLabel = document.createElement("div");
  humanLabel.classList.add("board-label");
  humanLabel.textContent = humanPlayer;

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

  humanWrapper.appendChild(humanLabel);
  humanWrapper.appendChild(humanBoard);

  const boards = document.createElement("div");
  boards.classList.add("boards-div");
  boards.appendChild(computerWrapper);
  boards.appendChild(humanWrapper);

  const gameInterface = document.getElementById("game");
  gameInterface.appendChild(boards);

  boards.addEventListener("click", (e) => {
    if (!e.target.matches(".spot")) return;

    const cordX = e.target.dataset.x;
    const cordY = e.target.dataset.y;
    const board = e.target.dataset.board;

    if (
      board === "computer" &&
      (e.target.classList.contains("hit") ||
        e.target.classList.contains("miss"))
    ) {
      return;
    }

    if (onAttack) {
      onAttack(cordX, cordY, board, e.target);
    }
  });

  boards.addEventListener("pointerover", (e) => {
    if (!e.target.matches(".spot")) return;

    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    const board = e.target.dataset.board;

    if (onPlacementHover) {
      onPlacementHover(x, y, board, null);
    }
  });

  boards.addEventListener("pointerleave", (e) => {
    if (!e.target.matches(".spot")) return;

    if (onPlacementHoverLeave) {
      onPlacementHoverLeave();
    }
  });

  boards.addEventListener("dragover", (e) => {
    if (!e.target.matches(".spot")) return;

    e.preventDefault();

    const shipData = getDraggedShipData(e);
    if (!shipData) return;

    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    const board = e.target.dataset.board;

    if (onPlacementHover) {
      onPlacementHover(x, y, board, shipData);
    }
  });

  boards.addEventListener("dragleave", (e) => {
    if (!e.target.matches(".spot")) return;

    if (onPlacementHoverLeave) {
      onPlacementHoverLeave();
    }
  });

  boards.addEventListener("drop", (e) => {
    if (!e.target.matches(".spot")) return;

    e.preventDefault();

    const shipData = getDraggedShipData(e);
    if (!shipData) return;

    const x = e.target.dataset.x;
    const y = e.target.dataset.y;
    const board = e.target.dataset.board;

    if (onPlacement) {
      onPlacement(x, y, board, shipData);
    }
  });
}

export function renderShips(onSelectShip) {
  function createShip(name, length, color) {
    const ship = document.createElement("div");
    ship.style.width = `${length * 34 + (length - 1) * 3}px`;
    ship.style.height = "34px";
    ship.style.background = color;

    ship.dataset.ship = name;
    ship.dataset.length = length;
    ship.draggable = true;
    ship.classList.add("ship-stock");

    ship.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          name,
          length,
        }),
      );

      onSelectShip(name, Number(length), ship);
    });

    ship.addEventListener("click", () => {
      onSelectShip(name, Number(length), ship);
    });

    return ship;
  }

  const carrier = createShip("carrier", 5, "red");
  const battleship = createShip("battleship", 4, "blue");
  const cruiser = createShip("cruiser", 3, "green");
  const submarine = createShip("submarine", 3, "purple");
  const destroyer = createShip("destroyer", 2, "yellow");

  const controlsRow = document.createElement("div");
  controlsRow.classList.add("ships-controls");

  const directionInfo = document.createElement("p");
  directionInfo.classList.add("direction-indicator");
  directionInfo.textContent = "Direction: horizontal";

  const rotateBtn = document.createElement("button");
  rotateBtn.classList.add("rotate-ships-btn");
  rotateBtn.type = "button";
  rotateBtn.textContent = "Rotate Ships";

  controlsRow.append(directionInfo, rotateBtn);

  const shipsBoard = document.createElement("div");
  shipsBoard.classList.add("ships-board");
  shipsBoard.append(destroyer, submarine, cruiser, battleship, carrier);

  const stockpileMessage = document.createElement("p");
  stockpileMessage.classList.add("stockpile-message");
  stockpileMessage.textContent = "";

  shipsBoard.appendChild(stockpileMessage);

  const game = document.getElementById("game");
  game.appendChild(controlsRow);
  game.appendChild(shipsBoard);
}

export function hideShipControls() {
  const controls = document.querySelector(".ships-controls");
  if (controls) {
    controls.remove();
  }
}

export function highlightSelectedShip(name) {
  clearSelectedShipHighlight();

  const ship = document.querySelector(`[data-ship="${name}"]`);
  if (!ship) return;

  ship.classList.add("selected-ship");
}

export function clearSelectedShipHighlight() {
  document.querySelectorAll(".selected-ship").forEach((ship) => {
    ship.classList.remove("selected-ship");
  });
}

export function updateDirectionLabel(direction) {
  const label = document.querySelector(".direction-indicator");
  if (!label) return;

  label.textContent = `Direction: ${direction}`;
}

export function showStatusMessage(message) {
  const shipsBoard = document.querySelector(".ships-board");
  const stockpileMessage = document.querySelector(".stockpile-message");

  if (!shipsBoard || !stockpileMessage) return;

  const remainingShips = shipsBoard.querySelectorAll("[data-ship]");

  if (remainingShips.length === 0) {
    stockpileMessage.textContent = message;
    stockpileMessage.classList.add("visible");
  } else {
    stockpileMessage.textContent = "";
    stockpileMessage.classList.remove("visible");
  }
}

export function paintShipPlacement(x, y, direction, length) {
  for (let i = 0; i < length; i++) {
    const px = direction === "horizontal" ? x + i : x;
    const py = direction === "vertical" ? y + i : y;

    const spot = document.querySelector(
      `.humanboard-div .spot[data-x="${px}"][data-y="${py}"]`,
    );

    if (spot) {
      spot.classList.add("ship-preview");
    }
  }
}

export function showHoverPreview(x, y, length, direction, boardInstance) {
  clearHoverPreview();

  let isValid = true;
  const previewCells = [];

  for (let i = 0; i < length; i++) {
    const px = direction === "horizontal" ? x + i : x;
    const py = direction === "vertical" ? y + i : y;

    if (px < 0 || px >= 10 || py < 0 || py >= 10) {
      isValid = false;
      continue;
    }

    for (const placedShip of boardInstance.ships) {
      for (const [sx, sy] of placedShip.coordinates) {
        if (sx === px && sy === py) {
          isValid = false;
        }
      }
    }

    previewCells.push([px, py]);
  }

  for (const [px, py] of previewCells) {
    const spot = document.querySelector(
      `.humanboard-div .spot[data-x="${px}"][data-y="${py}"]`,
    );

    if (!spot) continue;

    spot.classList.add("hover-preview");
    spot.classList.add(isValid ? "preview-valid" : "preview-invalid");
  }
}

export function clearHoverPreview() {
  const previewSpots = document.querySelectorAll(".hover-preview");

  previewSpots.forEach((spot) => {
    spot.classList.remove("hover-preview", "preview-valid", "preview-invalid");
  });
}

export function paintAttackResult(x, y, board, result) {
  const spot = document.querySelector(
    `.${board}board-div .spot[data-x="${x}"][data-y="${y}"]`,
  );

  if (!spot) return;

  spot.classList.remove("clicked");

  if (result === "hit") {
    spot.classList.add("hit");
  }

  if (result === "miss") {
    spot.classList.add("miss");
  }
}

export function showGameOverlay(message) {
  let overlay = document.querySelector(".game-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.classList.add("game-overlay");
    document.getElementById("game").appendChild(overlay);
  }

  overlay.textContent = message;
}

export function setComputerBoardCompact() {
  const computerBoard = document.querySelector(".computerboard-div");
  if (computerBoard) {
    computerBoard.classList.add("board-compact");
  }
}

export function setHumanBoardCompact() {
  const humanBoard = document.querySelector(".humanboard-div");
  if (humanBoard) {
    humanBoard.classList.add("board-compact");
  }
}
