import "./styles.css";
import {
  renderGameStart,
  loadPlayerNameForm,
  loadPlayerTags,
  loadPlayersBoards,
  renderShips,
  renderComputerShips,
} from "./render-ui.js";

import { startGame, players } from "./game.js";

renderGameStart(() => {
  loadPlayerNameForm((inputValue) => {
    startGame(inputValue);

    const human = players.human.name;
    const computer = players.computer.name;

    loadPlayerTags(human, computer);

    loadPlayersBoards((x, y, board) => {
      console.log("clicked", x, y, board);
    });

    //show computer ships
    renderComputerShips(players.computer.board.ships);

    renderShips();
  });
});
