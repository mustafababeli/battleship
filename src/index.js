import "./styles.css";
import { Ship } from "./ship.js";
import {
  renderGameStart,
  loadPlayerNameForm,
  loadPlayersBoards,
  renderShips,
  paintAttackResult,
  paintShipPlacement,
  updateDirectionLabel,
  showStatusMessage,
  showHoverPreview,
  clearHoverPreview,
  showGameOverlay,
  highlightSelectedShip,
  clearSelectedShipHighlight,
  hideShipControls,
  setComputerBoardCompact,
  setHumanBoardCompact,
} from "./render-ui.js";

import { startGame, startBattle, endGame, GameState, players } from "./game.js";

let direction = "horizontal";
let selectedShipData = null;

renderGameStart(() => {
  loadPlayerNameForm((inputValue) => {
    startGame(inputValue);

    renderShips((name, length) => {
      selectedShipData = { name, length };
      highlightSelectedShip(name);
      console.log("Selected ship:", name, length);
    });

    updateDirectionLabel(direction);
    showStatusMessage("Place your ships on your board.");

    loadPlayersBoards(
      players.human.name,
      players.computer.name,

      (x, y, board, spotElement) => {
        if (GameState === "placing" && board === "human" && selectedShipData) {
          try {
            const px = Number(x);
            const py = Number(y);

            const ship = new Ship(selectedShipData.length);
            players.human.board.placeShip(ship, px, py, direction);

            paintShipPlacement(px, py, direction, selectedShipData.length);

            const shipsBoard = document.querySelector(".ships-board");
            const shipElement = shipsBoard.querySelector(
              `[data-ship="${selectedShipData.name}"]`,
            );

            if (shipElement) {
              shipElement.remove();
            }

            clearHoverPreview();
            clearSelectedShipHighlight();
            selectedShipData = null;

            const placedCount = players.human.board.ships.length;
            const remaining = 5 - placedCount;

            if (remaining > 0) {
              showStatusMessage(`Ship placed. ${remaining} ship(s) remaining.`);
            }

            if (placedCount === 5) {
              setHumanBoardCompact();
              startBattle();
              hideShipControls();
              showStatusMessage("Battle started. Attack the computer board.");
            }
          } catch (error) {
            showStatusMessage(`Invalid placement: ${error.message}`);
          }

          return;
        }

        if (GameState !== "playing") return;
        if (board !== "computer") return;

        if (
          spotElement.classList.contains("hit") ||
          spotElement.classList.contains("miss")
        ) {
          return;
        }

        spotElement.classList.add("clicked");

        const result = players.computer.board.receiveAttack(
          Number(x),
          Number(y),
        );
        if (result === "already attacked") return;

        paintAttackResult(Number(x), Number(y), "computer", result);

        if (players.computer.board.allShipsSunk()) {
          endGame();
          showStatusMessage("You win!");
          showGameOverlay("Game Over — You Win");
          return;
        }

        computerTurn();
      },

      (x, y, board, shipData) => {
        if (GameState !== "placing") return;
        if (board !== "human") return;
        if (!shipData) return;

        try {
          const px = Number(x);
          const py = Number(y);

          const ship = new Ship(shipData.length);
          players.human.board.placeShip(ship, px, py, direction);

          paintShipPlacement(px, py, direction, shipData.length);

          const shipsBoard = document.querySelector(".ships-board");
          const shipElement = shipsBoard.querySelector(
            `[data-ship="${shipData.name}"]`,
          );

          if (shipElement) {
            shipElement.remove();
          }

          clearHoverPreview();
          clearSelectedShipHighlight();
          selectedShipData = null;

          const placedCount = players.human.board.ships.length;
          const remaining = 5 - placedCount;

          if (remaining > 0) {
            showStatusMessage(`Ship placed. ${remaining} ship(s) remaining.`);
          }

          if (placedCount === 5) {
            setHumanBoardCompact();
            startBattle();
            hideShipControls();
            showStatusMessage("Battle started. Attack the computer board.");
          }
        } catch (error) {
          showStatusMessage(`Invalid placement: ${error.message}`);
        }
      },

      (x, y, board, shipData) => {
        if (GameState !== "placing") return;
        if (board !== "human") return;

        const activeShip = shipData || selectedShipData;
        if (!activeShip) return;

        showHoverPreview(
          Number(x),
          Number(y),
          Number(activeShip.length),
          direction,
          players.human.board,
        );
      },

      () => {
        clearHoverPreview();
      },
    );

    setComputerBoardCompact();
    setupRotateButton();
  });
});

function setupRotateButton() {
  const rotateBtn = document.querySelector(".rotate-ships-btn");
  if (!rotateBtn) return;

  rotateBtn.addEventListener("click", () => {
    direction = direction === "horizontal" ? "vertical" : "horizontal";
    updateDirectionLabel(direction);
  });
}

function computerTurn() {
  if (GameState !== "playing") return;

  let result = "already attacked";
  let x;
  let y;

  while (result === "already attacked") {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    result = players.human.board.receiveAttack(x, y);
  }

  paintAttackResult(x, y, "human", result);

  if (players.human.board.allShipsSunk()) {
    endGame();
    showStatusMessage("Computer wins.");
    showGameOverlay("Game Over — Computer Wins");
  }
}
