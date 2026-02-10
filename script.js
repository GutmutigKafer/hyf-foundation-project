const gridDiv = document.querySelector(".grid");
let grid = [];
let cardTypes = [];
let gridSize = 16;

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

let revealCount = 0;
const countDisplay = document.querySelector(".count");

let timeElapsed = 0;
let timerInterval = null;
let timerStarted = false;
const timerDisplay = document.querySelector(".timer");

const flipCard = document.querySelectorAll(".flip-card");

let flipCount = 0;
let storedCardType = "";
let firstCard = null;

const startTimer = () => {
  timerInterval = setInterval(() => {
    timeElapsed++;
    timerDisplay.textContent = `Time: ${timeElapsed} seconds`;
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timerInterval);
  timeElapsed = 0;
  timerStarted = false;
  timerDisplay.textContent = "Time: 0";
};

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

const togglePanel = () => {
  const panel = document.querySelector(".side-panel");
  panel.style.display = panel.style.display === "none" ? "flex" : "none";
};

const updateGridDisplay = () => {
  document.getElementById("grid-display").textContent = gridSize;
  if (cardTypes.length > 0) {
  createCards(gridSize, cardTypes);

  revealCount = 0;
  countDisplay.textContent = `Cards revealed: ${revealCount}`;

  resetTimer();
  addListenerToAll();
  }
};
document.addEventListener("DOMContentLoaded", () => fetchCardTypes());

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
    countDisplay.textContent = `Cards revealed: ${revealCount}`;

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
        flipCount = 0;
        storedCardType = "";
        firstCard = null;
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

document.querySelector(".restart").addEventListener("click", restartGame);

function restartGame() {
  revealCount = 0;
  countDisplay.textContent = `Cards revealed: ${revealCount}`;

  updateGridDisplay();
}
