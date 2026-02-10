//DOM Elements
const gridDiv = document.querySelector(".grid");
const countDisplay = document.getElementById("cardsRevealed");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restartGameBtn");
const flipCard = document.querySelectorAll(".flip-card");

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

const fetchCardTypes = async () => {
  try {
    const response = await fetch(`http://localhost:3000/all-pictures`);
    const data = await response.json();

    cardTypes = data.map((one) => ({
      type: one.type,
      pic: one.pic,
    }));
    console.log("Fetched cardTypes:", cardTypes);

    updateGridDisplay();
  } catch (error) {
    console.error("Error fetching:", error);
  }
};
const startTimer = () => {
  timerInterval = setInterval(() => {
    timeElapsed++;
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timerDisplay.value = `Time: ${minutes}:${seconds}`;
  }, 1000);
};

const stopTimer = () => clearInterval(timerInterval);

const resetTimer = () => {
  stopTimer();
  timeElapsed = 0;
  timerStarted = false;
  timerDisplay.value = "Time: 00:00";
};

// Grid & Card Functions

const createCards = (gridSize, types) => {
  gridDiv.innerHTML = "";

  // Checking how many "types" we need depending on the grid size, then combining two array copies to create doubles
  const needTypes = Math.floor(gridSize / 2);
  const useTypes = types.slice(0, needTypes);

  grid = new Array(gridSize);
  const allTypes = useTypes.concat(useTypes);

  for (let i = 0; i < grid.length; i++) {
    let card = {
      id: i,
    };
    const typeIndx = Math.floor(Math.random() * allTypes.length);
    let cardType;
    let cardPicture;
    if (gridSize % 2 !== 0 && i === needTypes) {
      card.status = "placeholder";
    } else {
      cardType = allTypes[typeIndx].type;
      cardPicture = allTypes[typeIndx].pic;
      card.type = cardType;
      card.picture = cardPicture;
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
      flipCard.appendChild(flipCardInner);

      //       <div class="front-side"></div>
      const frontSide = document.createElement("div");
      frontSide.setAttribute("class", "front-side");

      //       <div class="back-side"></div>
      const backSide = document.createElement("div");
      backSide.setAttribute("class", "back-side");

      const picture = document.createElement("img");
      picture.setAttribute("src", cardPicture);
      backSide.appendChild(picture);

      flipCardInner.appendChild(frontSide);
      flipCardInner.appendChild(backSide);
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

//Grid Display
const updateGridDisplay = () => {
  document.getElementById("grid-display").textContent =
    `Grid size: ${gridSize}`;
  if (cardTypes.length > 0) {
    createCards(gridSize, cardTypes);
    resetTimer();
    addListenerToAll();
  }
};
document.addEventListener("DOMContentLoaded", () => fetchCardTypes());

//Grid Size controls
// Changing the size of the grid dynamically using square root
let sqrtGridSize = Math.sqrt(gridSize);

document.getElementById("grid-more").addEventListener("click", () => {
  if (sqrtGridSize < 5) {
    gridSize = (++sqrtGridSize) ** 2;
    updateGridDisplay();
    addListenerToAll();
  }
});
document.getElementById("grid-less").addEventListener("click", () => {
  if (sqrtGridSize > 3) {
    gridSize = (--sqrtGridSize) ** 2;
    updateGridDisplay();
    addListenerToAll();
  }
});

//Card Flip Handler
const handleFlip = (event) => {
  const flipCard = event.currentTarget;
  const cardInner = flipCard.querySelector(".flip-card-inner");
  if (
    flipCard.classList.contains("out") ||
    flipCard.classList.contains("active") ||
    flipCard.classList.contains("placeholder") ||
    flipCount >= 2
  ) {
    return;
  }

  const indx = Number.parseInt(cardInner.classList[1]);
  const cardType = grid[indx].type;

  cardInner.classList.toggle("flipped");
  flipCard.classList.remove("down");
  flipCard.classList.add("active");
  flipCount++;

  // Increment the counter only if the card is being flipped to reveal
  if (cardInner.classList.contains("flipped")) {
    revealCount++;
    countDisplay.value = `Cards revealed: ${revealCount}`;

    // Start timer on first reveal
    if (!timerStarted) {
      timerStarted = true;
      startTimer();
    }
  }

  if (flipCount === 1) {
    storedCardType = cardType;
    firstCard = flipCard;
  } else if (flipCount === 2) {
    if (storedCardType === cardType) {
      setTimeout(() => {
        firstCard.classList.add("out");
        flipCard.classList.add("out");
        firstCard.classList.remove("active");
        flipCard.classList.remove("active");

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
          endGame();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        const flippedCards = document.querySelectorAll(
          ".flip-card-inner.flipped",
        );
        flippedCards.forEach((card) => {
          card.classList.remove("flipped");
          const flipCard = card.parentNode;
          flipCard.classList.remove("active");
          flipCard.classList.add("down");
        });
        flipCount = 0;
        storedCardType = "";
        firstCard = null;
      }, 1000);
    }
  }
};

const addListenerToAll = () => {
  const flipCards = document.querySelectorAll(".flip-card");
  if (flipCards) {
    flipCards.forEach((card) => {
      card.removeEventListener("click", handleFlip);
      card.addEventListener("click", handleFlip);
    });
  }
};

updateGridDisplay();

//restart the game

restartButton.addEventListener("click", restartGame);

function restartGame() {
  revealCount = 0;
  countDisplay.value = `Cards revealed: ${revealCount}`;
  flipCount = 0;
  storedCardType = "";
  firstCard = null;

  resetTimer();
  updateGridDisplay();
  addListenerToAll();
}

//End Game
const endGame = () => {
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
