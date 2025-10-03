const candies = ["yellow", "blue", "pink", "purple", "opgreen", "orange"];
const rows = 9;
const columns = 9;
let board = [];
let score = 0;
let movesLeft = 40;
let selectedCandy = null;

window.onload = () => {
  initializeBoard();
  updateScore();
  updateMoves();
};

function initializeBoard() {
  board = [];
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < columns; c++) {
      const candyType = getRandomCandy();
      board[r][c] = candyType;

      const candyImg = document.createElement("img");
      candyImg.src = `./images/${candyType}.jpg`;
      candyImg.id = `${r}-${c}`;
      candyImg.classList.add("candy");
      candyImg.draggable = false;

      candyImg.addEventListener("click", () => handleCandyClick(r, c));

      boardDiv.appendChild(candyImg);
    }
  }

  while (checkAndClearMatches()) {
    refillBoard();
  }

  updateBoardUI();
}

function getRandomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

function updateBoardUI() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const candyImg = document.getElementById(`${r}-${c}`);
      if (candyImg) {
        candyImg.src = `./images/${board[r][c]}.jpg`;
        candyImg.classList.remove("selected");
      }
    }
  }
  selectedCandy = null;
}

function updateScore() {
  document.getElementById("pisteet").innerText = score;
}

function updateMoves() {
  document.getElementById("movesLeft").innerText = `Moves left: ${movesLeft}`;
  if (movesLeft <= 0) {
    document.getElementById("gameOverText").style.display = "block";
  } else {
    document.getElementById("gameOverText").style.display = "none";
  }
}

function handleCandyClick(r, c) {
  if (movesLeft <= 0) return;

  const clickedCandy = document.getElementById(`${r}-${c}`);

  if (!selectedCandy) {
    selectedCandy = { r, c };
    clickedCandy.classList.add("selected");
  } else {
    if (selectedCandy.r === r && selectedCandy.c === c) {
      clickedCandy.classList.remove("selected");
      selectedCandy = null;
      return;
    }

    const dr = Math.abs(selectedCandy.r - r);
    const dc = Math.abs(selectedCandy.c - c);

    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      if (willSwapCreateMatch(selectedCandy, { r, c })) {
        swap(selectedCandy, { r, c });
        movesLeft--;
        updateMoves();

        updateBoardUI();
        handleMatches();
      } else {
        document.getElementById(`${selectedCandy.r}-${selectedCandy.c}`).classList.remove("selected");
      }
      selectedCandy = null;
    } else {
      document.getElementById(`${selectedCandy.r}-${selectedCandy.c}`).classList.remove("selected");
      selectedCandy = { r, c };
      clickedCandy.classList.add("selected");
    }
  }
}

function swap(pos1, pos2) {
  const temp = board[pos1.r][pos1.c];
  board[pos1.r][pos1.c] = board[pos2.r][pos2.c];
  board[pos2.r][pos2.c] = temp;
}

function willSwapCreateMatch(pos1, pos2) {
  swap(pos1, pos2);
  const result = checkForAnyMatch();
  swap(pos1, pos2);
  return result;
}

function checkForAnyMatch() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (getMatchAt(r, c).length >= 3) {
        return true;
      }
    }
  }
  return false;
}

function getMatchAt(r, c) {
  const candyType = board[r][c];
  if (!candyType) return [];

  let horizontalMatches = [{ r, c }];

  for (let cc = c - 1; cc >= 0; cc--) {
    if (board[r][cc] === candyType) horizontalMatches.push({ r, c: cc });
    else break;
  }

  for (let cc = c + 1; cc < columns; cc++) {
    if (board[r][cc] === candyType) horizontalMatches.push({ r, c: cc });
    else break;
  }

  let verticalMatches = [{ r, c }];

  for (let rr = r - 1; rr >= 0; rr--) {
    if (board[rr][c] === candyType) verticalMatches.push({ r: rr, c });
    else break;
  }
 
  for (let rr = r + 1; rr < rows; rr++) {
    if (board[rr][c] === candyType) verticalMatches.push({ r: rr, c });
    else break;
  }

  if (horizontalMatches.length >= 3) return horizontalMatches;
  if (verticalMatches.length >= 3) return verticalMatches;

  return [];
}

function handleMatches() {
  let matchedPositions = new Set();
  let foundMatch = false;


  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const match = getMatchAt(r, c);
      if (match.length >= 3) {
        foundMatch = true;
        match.forEach(pos => {
          matchedPositions.add(`${pos.r}-${pos.c}`);
        });
      }
    }
  }

  if (!foundMatch) {
    updateScore();
    return;
  }


  matchedPositions.forEach(posStr => {
    const [r, c] = posStr.split("-").map(Number);
    board[r][c] = null;
  });

  score++;
  updateScore();

  collapseBoard();
}

function collapseBoard() {
  for (let c = 0; c < columns; c++) {
    let emptySpots = 0;
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][c] === null) {
        emptySpots++;
      } else if (emptySpots > 0) {
        board[r + emptySpots][c] = board[r][c];
        board[r][c] = null;
      }
    }

    for (let r = 0; r < emptySpots; r++) {
      board[r][c] = getRandomCandy();
    }
  }

  updateBoardUI();

 
  setTimeout(() => {
    if (checkAndClearMatches()) {
      
      collapseBoard();
    } else {
      updateScore();
    }
  }, 200);
}

function checkAndClearMatches() {
  let foundMatch = false;
  let matchedPositions = new Set();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const match = getMatchAt(r, c);
      if (match.length >= 3) {
        foundMatch = true;
        match.forEach(pos => {
          matchedPositions.add(`${pos.r}-${pos.c}`);
        });
      }
    }
  }

  if (!foundMatch) return false;

  matchedPositions.forEach(posStr => {
    const [r, c] = posStr.split("-").map(Number);
    board[r][c] = null;
  });

  score++;
  updateScore();

  collapseBoard();
  return true;
}
