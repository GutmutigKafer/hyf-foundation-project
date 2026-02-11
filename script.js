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
  restartGame(countDisplay, timerDisplay, gridDiv),
);
