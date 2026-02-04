const gridDiv = document.querySelector(".grid");

const cardTypes = [
  {
    type: "mouse",
    pic: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400",
  },
  {
    type: "grey_cat",
    pic: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400",
  },
  {
    type: "human",
    pic: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400",
  },
  {
    type: "sitting_cat",
    pic: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400",
  },
  {
    type: "looking_cat",
    pic: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400",
  },
  {
    type: "angry_cat",
    pic: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400",
  },
  {
    type: "cute_dog",
    pic: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400",
  },
  {
    type: "yellow_dog",
    pic: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400",
  },
  {
    type: "beach",
    pic: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
  },
  {
    type: "scenery",
    pic: "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=400",
  },
  {
    type: "people_at_beach",
    pic: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=400",
  },
  {
    type: "boat",
    pic: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
  },
];

let gridSize = 16;

let revealCount = 0;
const countDisplay = document.querySelector(".count");

let time = 0;
let timerInterval = null;
let timerStarted = false;
const timerDisplay = document.querySelector(".timer");

const startTimer = () => {
  timerInterval = setInterval(() => {
    time++;
    timerDisplay.textContent = `Time: ${time} seconds`;
  }, 1000);
};

const resetTimer = () => {
  clearInterval(timerInterval);
  time = 0;
  timerStarted = false;
  timerDisplay.textContent = "Time: 0";
};

const createCards = (gridSize, types) => {
  gridDiv.innerHTML = "";

  // Checking how many "types" we need depending on the grid size, then combining two array copies to create doubles
  const needTypes = Math.floor(gridSize / 2);
  const useTypes = types.slice(0, needTypes);
  console.log(useTypes);
  const grid = new Array(gridSize);
  const allTypes = useTypes.concat(useTypes);

  for (let i = 0; i < grid.length; i++) {
    let card = {
      // This is a placeholder until we connect the API
      id: i + 1,
    };
    const typeIndx = Math.floor(Math.random() * allTypes.length);
    let cardType;
    let cardPicture;

    if (gridSize % 2 !== 0 && i === needTypes) {
      card.status = "placeholder";
    } else {
      cardType = allTypes[typeIndx].type;
      cardPicture = allTypes[typeIndx].pic;
      card.name = cardType;
      card.picture = cardPicture;
      card.status = "active";
      // removes the card type already used so it can't be used again
      allTypes.splice(typeIndx, 1);
    }
    grid[i] = card;

    //   <div class="flip-card">
    const flipCard = document.createElement("div");
    flipCard.setAttribute("class", `flip-card ${card.status}`);

    //     <div class="flip-card-inner">
    const flipCardInner = document.createElement("div");
    flipCardInner.setAttribute("class", "flip-card-inner");
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

    gridDiv.appendChild(flipCard);
  }

  //dynamically creates a square grid
  gridDiv.setAttribute(
    "style",
    `grid-template-columns: repeat(${Math.sqrt(gridSize)}, 1fr)`
  );

  return grid;
};

createCards(gridSize, cardTypes);

const togglePanel = () => {
  const panel = document.querySelector(".panel");
  panel.style.display = panel.style.display === "none" ? "flex" : "none";
};

const updateGridDisplay = () => {
  document.getElementById("grid-display").textContent = gridSize;
  createCards(gridSize, cardTypes);
  // Reset the reveal counter
  revealCount = 0;
  countDisplay.textContent = `Count: ${revealCount}`;

  resetTimer();
};

updateGridDisplay();

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

const flipCard = document.querySelectorAll(".flip-card");
// Made into reusable function, so we can check every time for different grid sizes
const addListenerToAll = () => {
  const flipCard = document.querySelectorAll(".flip-card");

  if (flipCard) {
    flipCard.forEach((card) => {
      card.addEventListener("click", handleFlip);
    });
  }
};
addListenerToAll();

function handleFlip(event) {
  const cardInner = event.currentTarget.querySelector(".flip-card-inner");

  if (cardInner) {
    cardInner.classList.toggle("flipped");
    //console.log("Card flipped");

    // Increment the counter only if the card is being flipped to reveal
    if (cardInner.classList.contains("flipped")) {
      revealCount++;
      countDisplay.textContent = `Count: ${revealCount}`;

      // Start timer on first reveal
      if (!timerStarted) {
        timerStarted = true;
        startTimer();
      }
    }
  }
}

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", restartGame);

function restartGame() {
  //reset counter
  revealCount = 0;
  countDisplay.textContent = `Count: ${revealCount}`;

  resetTimer();
  // recreate the grid
  createCards(gridSize, cardTypes);
}
