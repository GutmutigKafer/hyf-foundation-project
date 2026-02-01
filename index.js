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
];

const gridSize = 16;

const createCards = (gridSize, types) => {
  const needTypes = Math.floor(gridSize / 2);
  const useTypes = types.slice(0, needTypes);
  const grid = new Array(gridSize);
  const allTypes = useTypes.concat(useTypes);
  for (let i = 0; i < grid.length; i++) {
    if (gridSize % 2 !== 0 && i === needTypes) continue;
    const typeIndx = Math.floor(Math.random() * allTypes.length);
    const cardType = allTypes[typeIndx].type;
    const cardPicture = allTypes[typeIndx].pic;
    const card = {
      // This will be used in API
      id: i + 1,
      name: cardType,
      picture: cardPicture,
      status: "down",
    };
    grid[i] = card;
    const showCard = document.createElement("div");
    const picture = document.createElement("img");
    picture.setAttribute("src", cardPicture);
    showCard.appendChild(picture);
    gridDiv.appendChild(showCard);
    allTypes.splice(typeIndx, 1);
  }
  return grid;
};

console.log(createCards(gridSize, cardTypes));
