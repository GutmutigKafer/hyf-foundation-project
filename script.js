import {
  fetchCardTypes,
  updateGridDisplay,
  restartGame,
  setGridSize,
  getGridSize,
} from "./functions.js";

import { loadLeaderboard } from "./leaderboard.js";

//* DOM Elements
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

//* Grid Size controls
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

//* Restart the game
restartButton.addEventListener("click", () =>
  restartGame(countDisplay, timerDisplay, gridDiv)
);

// Load all three leaderboards on page load
document.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard(9);
  loadLeaderboard(16);
  loadLeaderboard(25);

  const toggleBtn = document.getElementById("toggle-leaderboard-btn");
  const leaderboardContainer = document.getElementById("leaderboard-container");

  toggleBtn.addEventListener("click", () => {
    if (leaderboardContainer.style.display === "none") {
      leaderboardContainer.style.display = "block";
      toggleBtn.textContent = "Hide Leaderboard";

      loadLeaderboard(9);
      loadLeaderboard(16);
      loadLeaderboard(25);
    } else {
      leaderboardContainer.style.display = "none";
      toggleBtn.textContent = "Show Leaderboard";
    }
  });
});
