const gameDisplay = (function() {
  const _nodeArray = Array.from(document.querySelectorAll(".game-cell"));
  const _outputWindow = document.querySelector(".output-window");
  const _newRoundButton = document.querySelector("#new-round");
  const _newGameButton = document.querySelector("#new-game");
  const _player1NameElem = document.querySelector("#left-player>.player-name");
  const _player2NameElem = document.querySelector("#right-player>.player-name");
  const _obfuscator = document.querySelector(".obfuscator");
  const _scoreInput = document.querySelector(".input-wrapper");

  const clearRound = () => {
    _nodeArray.forEach(node => node.textContent = "");
    _outputWindow.textContent = "";
  }

  const toggleHide = (...args) => {
    args.forEach(elem => {
      if (elem === "obfuscator") _obfuscator.classList.toggle("hidden");
      if (elem === "newRoundButton") _newRoundButton.classList.toggle("hidden");
      if (elem === "newGameButton") _newGameButton.classList.toggle("hidden");
      if (elem === "scoreInput") _scoreInput.classList.toggle("hidden");
    })
  }

  const updatePlayerScore = (player) => {
    player.scoreElement.textContent = player.score;
  }

  const getPlayerNames = () => {
    return [_player1NameElem.textContent, _player2NameElem.textContent];
  }

  const attachEventListeners = () => {
    _newGameButton.addEventListener("click", game.newGame);
    _newRoundButton.addEventListener("click", game.newRound);
    _nodeArray.forEach(node => node.addEventListener("click", (event) => {
      const cell = event.target;
      if (cell.textContent!="") return;

      const marker = game.makeTurn();
      cell.textContent = marker;
      game.updateArray(cell.getAttribute("data-cell-number"), marker);

      result = game.checkRoundWinner();
      _outputWindow.textContent = result.resultMsg;
    }));
  }

  return {
    attachEventListeners,
    clearRound,
    updatePlayerScore,
    getPlayerNames,
    toggleHide,
  };
})();


const playerFactory = function(name, marker, scoreElement) {
  return {
    name,
    marker,
    scoreElement,
    score: 0
  };
}


const game = (function() {
  let _array = Array(9).fill("", 0, 9);
  const player1 = playerFactory("", "x", document.querySelector("#left-player>.player-score"));
  const player2 = playerFactory("", "o", document.querySelector("#right-player>.player-score"));
  let scoreGoal;
  let player1turn = true;
  let currentMarker = player1.marker;

  const clearArray = () => {
    _array = _array.fill("", 0, 9);
  }

  const updateArray = (index, marker) => {
    _array[index] = marker;
  }

  const newRound = () => {
    clearArray();
    gameDisplay.clearRound();
    gameDisplay.toggleHide("obfuscator");
  }

  const newGame = () => {
    clearArray();
    gameDisplay.clearRound();
    player1.name = gameDisplay.getPlayerNames()[0];
    player2.name = gameDisplay.getPlayerNames()[1];
    player1.score = 0;
    player2.score = 0;
    player1.scoreElement.textContent = 0;
    player2.scoreElement.textContent = 0;
    scoreGoal = document.querySelector("#score-goal").value;
    gameDisplay.toggleHide("obfuscator", "newRoundButton", "newGameButton", "scoreInput");
  }

  const makeTurn = () => {
    player1turn ? (currentMarker = player1.marker) : (currentMarker = player2.marker);
    player1turn = !player1turn;
    document.querySelector("body").classList.toggle("cursor-change");
    return currentMarker;
  }

  const checkRoundWinner = () => {
    let winner;
    let winnerPresent;
    let outputObj = {
      roundOver: false,
      resultMsg: ""
    };
    // horizontal check
    for (let i =0 ; i < 9; i = i+3) {
      if ((_array[i] === _array[i+1]) && (_array[i+1] === _array[i+2]) && (_array[i] !== "")) winnerPresent = "yes";
    }
    // vertical check
    for (i = 0; i < 3; i++) {
      if ((_array[i] === _array[i+3]) && (_array[i+3] === _array[i+6]) && (_array[i] !== "")) winnerPresent = "yes";
    }
    // diagonal check 
    if ((_array[0] === _array[4]) && (_array[4] === _array[8]) && (_array[4] !== "")) winnerPresent = "yes";
    if ((_array[2] === _array[4]) && (_array[4] === _array[6]) && (_array[4] !== "")) winnerPresent = "yes";
    // tie check
    if ((!_array.includes("")) && winnerPresent === undefined) winnerPresent = "tie";

     if (winnerPresent !== undefined) {
      outputObj.roundOver = true;
      if (currentMarker === player1.marker) winner = player1;
      if (currentMarker === player2.marker) winner = player2;
      if (winnerPresent !== "tie") {
        winner.score++;
        gameDisplay.updatePlayerScore(winner);
        outputObj.resultMsg = `${winner.name} won this round`;
      } else {
        outputObj.resultMsg = "Tie"
      }
      gameDisplay.toggleHide("obfuscator");
     }
    const winnerCheckObj = _checkGameWinner();
    if (winnerCheckObj.gameEnd) return winnerCheckObj;
    return outputObj;
  }

  const _checkGameWinner = () => {
    let winner;
    let outputObj = {
      gameEnd: false,
      resultMsg: "",
    }
    if (player1.score == scoreGoal) winner = player1;
    if (player2.score == scoreGoal) winner = player2;

    if (winner !== undefined) {
      gameDisplay.toggleHide("newRoundButton", "newGameButton", "scoreInput");
      outputObj.gameEnd = true;
      outputObj.resultMsg = `${winner.name} won the game!`;
    }
    return outputObj;
  }

  return {
    newRound,
    makeTurn,
    checkRoundWinner,
    newGame,
    updateArray,
  }
})();

gameDisplay.attachEventListeners();
