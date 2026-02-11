import {
  fetchCardTypes,
  updateGridDisplay,
  restartGame,
  setGridSize,
  getGridSize,
} from "./functions.js";

//DOM Elements
const gridDiv = document.querySelector(".grid");
const countDisplay = document.getElementById("cardsRevealed");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restartGameBtn");

//* Initialization
const init = async () => {
  await fetchCardTypes();
  updateGridDisplay(countDisplay, timerDisplay, gridDiv);
};

document.addEventListener("DOMContentLoaded", () => init());
const flipCard = document.querySelectorAll(".flip-card");
const getTimeFromTimer = () => timeElapsed;

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
    `grid-template-columns: repeat(${Math.sqrt(gridSize)}, 1fr)`
    //`grid-template-columns: repeat(auto-fit, minmax(200px,1fr))`
  );

  return grid;
};

//Grid Display
const updateGridDisplay = () => {
  document.getElementById(
    "grid-display"
  ).textContent = `Grid size: ${gridSize}`;
  if (cardTypes.length > 0) {
    createCards(gridSize, cardTypes);
    resetTimer();
    addListenerToAll();
  }
};
document.addEventListener("DOMContentLoaded", () => fetchCardTypes());

//Grid Size controls
let sqrtGridSize = Math.sqrt(getGridSize());

document.getElementById("grid-more").addEventListener("click", () => {
  if (sqrtGridSize < 5) {
    setGridSize((++sqrtGridSize) ** 2);
    updateGridDisplay(countDisplay, timerDisplay, gridDiv);
  }
});
document.getElementById("grid-less").addEventListener("click", () => {
  if (sqrtGridSize > 3) {
    setGridSize((--sqrtGridSize) ** 2);
    updateGridDisplay(countDisplay, timerDisplay, gridDiv);
  }
});

//restart the game
restartButton.addEventListener("click", () =>
  restartGame(countDisplay, timerDisplay, gridDiv)
);
