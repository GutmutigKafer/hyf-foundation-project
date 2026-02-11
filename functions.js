// Game Variables
let grid = [];
let cardTypes = [];
let gridSize = 16;
let revealCount = 0;
let timeElapsed = 0;
let timerInterval = null;
let timerStarted = false;

let flipCount = 0;
let storedCardType = "";
let firstCard = null;

export const fetchCardTypes = async () => {
  try {
    const response = await fetch(`http://localhost:3000/all-pictures`);
    const data = await response.json();

    cardTypes = data.map((one) => ({
      type: one.type,
      pic: one.pic,
    }));
    console.log("Fetched cardTypes:", cardTypes);
    return cardTypes;
    // updateGridDisplay();
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  }
};

export const startTimer = (timerDisplay) => {
  if (timerStarted) return;
  timerStarted = true;
  timerInterval = setInterval(() => {
    timeElapsed++;
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerDisplay.value = `Time: ${minutes}:${seconds}`;
  }, 1000);
};

export const stopTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
};

export const resetTimer = (timerDisplay) => {
  stopTimer();
  timeElapsed = 0;
  timerStarted = false;
  timerDisplay.value = "Time: 00:00";
};

//* Grid & Card Functions
export const createCards = (gridDiv) => {
  gridDiv.innerHTML = "";

  const needTypes = Math.floor(gridSize / 2);
  const useTypes = cardTypes.slice(0, needTypes);

  grid = new Array(gridSize);
  const allTypes = useTypes.concat(useTypes);

  for (let i = 0; i < grid.length; i++) {
    let card = {
      id: i,
    };
    const typeIndx = Math.floor(Math.random() * allTypes.length);

    if (gridSize % 2 !== 0 && i === needTypes) {
      card.status = "placeholder";
    } else {
      card.type = allTypes[typeIndx].type;
      card.picture = allTypes[typeIndx].pic;
      card.status = "down";
      allTypes.splice(typeIndx, 1);
    }
    grid[i] = card;

    //Create card element
    //   <div class="flip-card">
    const flipCard = document.createElement("div");
    flipCard.setAttribute("class", `flip-card ${card.status}`);

    if (card.status === "down") {
      //     <div class="flip-card-inner">
      const flipCardInner = document.createElement("div");
      flipCardInner.setAttribute("class", `flip-card-inner ${card.id}`);

      //       <div class="front-side"></div>
      const frontSide = document.createElement("div");
      frontSide.setAttribute("class", "front-side");

      //       <div class="back-side"></div>
      const backSide = document.createElement("div");
      backSide.setAttribute("class", "back-side");

      const picture = document.createElement("img");
      picture.setAttribute("src", card.picture);
      backSide.appendChild(picture);

      flipCardInner.appendChild(frontSide);
      flipCardInner.appendChild(backSide);
      flipCard.appendChild(flipCardInner);
    }

    gridDiv.appendChild(flipCard);
  }

  //dynamically creates a square grid
  gridDiv.setAttribute(
    "style",
    `grid-template-columns: repeat(${Math.sqrt(gridSize)}, 1fr)`,
  );

  return grid;
};

//* Card Flip Handler
export const handleFlip = (event, countDisplay, timerDisplay, gridDiv) => {
  const flipCard = event.currentTarget;
  const cardInner = flipCard.querySelector(".flip-card-inner");
  const indx = Number.parseInt(cardInner.classList[1]);
  const cardType = grid[indx].type;
  if (
    flipCount >= 2 ||
    ["out", "active", "placeholder"].some((className) =>
      flipCard.classList.contains(className),
    )
  )
    return;

  cardInner.classList.toggle("flipped");
  flipCard.classList.replace("down", "active");
  flipCount++;

  // Increment the counter only if the card is being flipped to reveal
  if (cardInner.classList.contains("flipped")) {
    revealCount++;
    countDisplay.value = `Cards revealed: ${revealCount}`;

    // Start timer on first reveal
    if (!timerStarted) {
      startTimer(timerDisplay);
    }
  }

  if (flipCount === 1) {
    storedCardType = cardType;
    firstCard = flipCard;
  } else if (flipCount === 2) {
    if (storedCardType === cardType) {
      // Match
      setTimeout(() => {
        [firstCard, flipCard].forEach((card) => {
          card.classList.replace("active", "out");
        });

        // 2. Update the grid status
        const firstIndex = Number(
          firstCard.querySelector(".flip-card-inner").classList[1],
        );
        const secondIndex = Number(cardInner.classList[1]);
        grid[firstIndex].status = "out";
        grid[secondIndex].status = "out";

        flipCount = 0;
        storedCardType = "";
        firstCard = null;

        // Check if all cards are matched
        const allMatched = grid.every(
          (card) => card.status === "out" || card.status === "placeholder",
        );

        if (allMatched) {
          endGame(gridDiv, timerDisplay);
        }
      }, 1000);
    } else {
      // Not match
      setTimeout(() => {
        const flippedCards = document.querySelectorAll(
          ".flip-card-inner.flipped",
        );
        flippedCards.forEach((card) => {
          card.classList.remove("flipped");
          const flipCard = card.parentNode;
          flipCard.classList.replace("active", "down");
        });
        flipCount = 0;
        storedCardType = "";
        firstCard = null;
      }, 1000);
    }
  }
};

export const addListenerToAll = (handleFlip) => {
  const flipCards = document.querySelectorAll(".flip-card");
  if (flipCards) {
    flipCards.forEach((card) => {
      card.removeEventListener("click", handleFlip);
      card.addEventListener("click", handleFlip);
    });
  }
};

//End Game
export const endGame = (gridDiv, timerDisplay) => {
  stopTimer();

  document.querySelectorAll(".flip-card").forEach((card) => {
    card.removeEventListener("click", handleFlip);
  });

  let messageDiv = document.getElementById("gameMessage");
  if (!messageDiv) {
    messageDiv = document.createElement("div");
    messageDiv.id = "gameMessage";
    messageDiv.style.display = "block";
    gridDiv.appendChild(messageDiv);
  }
  messageDiv.textContent = "🎉 You won!";
  confetti();
};

export const restartGame = (countDisplay, timerDisplay, gridDiv) => {
  revealCount = 0;
  countDisplay.value = `Cards revealed: ${revealCount}`;
  flipCount = 0;
  storedCardType = "";
  firstCard = null;

  resetTimer(timerDisplay);
  updateGridDisplay(countDisplay, timerDisplay, gridDiv);
};

//* Grid Display
export const updateGridDisplay = (countDisplay, timerDisplay, gridDiv) => {
  document.getElementById("grid-display").textContent =
    `Grid size: ${gridSize}`;
  if (cardTypes.length > 0) {
    createCards(gridDiv);
    resetTimer(timerDisplay);
    addListenerToAll((event) =>
      handleFlip(event, countDisplay, timerDisplay, gridDiv),
    );
  }
};

export const setGridSize = (newSize) => {
  gridSize = newSize;
};

export const getGridSize = () => gridSize;
