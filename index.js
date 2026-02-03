const gridDiv = document.querySelector(".grid");

const cardTypes = [
  { type: "circle", pic: "url1010" },
  { type: "triangle", pic: "url2020" },
  { type: "square", pic: "url3030" },
  { type: "rectangle", pic: "url4040" },
  { type: "pentagon", pic: "url5050" },
  { type: "hexagon", pic: "url6060" },
  { type: "heptagon", pic: "url7070" },
  { type: "octagon", pic: "url8080" },
  { type: "nonagon", pic: "url9090" },
  { type: "decagon", pic: "url10010" },
  { type: "star", pic: "url11110" },
  { type: "heart", pic: "url12120" },
  { type: "oval", pic: "url13130" },
  { type: "diamond", pic: "url14140" },
];

let gridSize = 16;

const createCards = (gridSize, types) => {
  gridDiv.innerHTML = "";
  const needTypes = Math.floor(gridSize / 2);
  const useTypes = types.slice(0, needTypes + 1);
  const grid = new Array(gridSize);
  const allTypes = useTypes.concat(useTypes);
  for (let i = 0; i < grid.length; i++) {
    const typeIndx = Math.floor(Math.random() * allTypes.length);
    const cardType = allTypes[typeIndx].type;
    const cardPicture = allTypes[typeIndx].pic;
    const card = {
      // This will be used in API
      id: i + 1,
      name: cardType,
      picture: cardPicture,
      status: gridSize % 2 !== 0 && i === needTypes ? "placeholder" : "active",
    };

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
    // picture.setAttribute("src", cardPicture);
    backSide.appendChild(picture);

    flipCardInner.appendChild(frontSide);
    flipCardInner.appendChild(backSide);

    gridDiv.appendChild(flipCard);
    allTypes.splice(typeIndx, 1);
  }

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
};

updateGridDisplay();

let sqrtGridSize = Math.sqrt(gridSize);

document.getElementById("grid-more").addEventListener("click", () => {
  if (sqrtGridSize < 5) {
    gridSize = (++sqrtGridSize) ** 2;
    updateGridDisplay();
  }
});
document.getElementById("grid-less").addEventListener("click", () => {
  if (sqrtGridSize > 3) {
    gridSize = (--sqrtGridSize) ** 2;
    updateGridDisplay();
  }
});

const flipCard = document.querySelectorAll(".flip-card");

if (flipCard) {
  flipCard.forEach((card) => {
    card.addEventListener("click", handleFlip);
  });
}

function handleFlip(event) {
  const cardInner = event.currentTarget.querySelector(".flip-card-inner");

  if (cardInner) {
    cardInner.classList.toggle("flipped");
    //console.log("Card flipped");
  }
}
