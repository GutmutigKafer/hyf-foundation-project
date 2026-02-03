const gridDiv = document.querySelector(".grid");

const cardTypes = [
  {
    type: "circle",
    pic: "https://img.icons8.com/sf-black-filled/100/filled-circle.png",
  },
  {
    type: "triangle",
    pic: "https://img.icons8.com/glyph-neue/100/sort-down.png",
  },
  {
    type: "square",
    pic: "https://img.icons8.com/material-sharp/100/unchecked-checkbox.png",
  },
  { type: "rectangle", pic: "https://img.icons8.com/android/96/rectangle.png" },
  {
    type: "pentagon",
    pic: "https://img.icons8.com/forma-light-filled-sharp/96/quintile-72.png",
  },
  { type: "hexagon", pic: "https://img.icons8.com/officel/80/hexagon.png" },
  {
    type: "heptagon",
    pic: "https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/external-glyph-shapes-tanah-basah-glyph-tanah-basah-25.png",
  },
  { type: "octagon", pic: "https://img.icons8.com/fluency/96/octagon.png" },
  { type: "star", pic: "https://img.icons8.com/glyph-neue/64/filled-star.png" },
  { type: "heart", pic: "https://img.icons8.com/glyph-neue/64/like--v1.png" },
  { type: "oval", pic: "https://img.icons8.com/android/96/ellipse.png" },
  { type: "diamond", pic: "https://img.icons8.com/poly/90/diamond.png" },
];

let gridSize = 16;

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

  gridDiv.setAttribute(
    "style",
    `grid-template-columns: repeat(${Math.sqrt(gridSize)}, 1fr)`,
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
};

updateGridDisplay();

// Changing the size of the grid dinamically using square root
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
  }
}
