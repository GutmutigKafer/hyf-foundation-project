// Creating test
const flipCard = document.querySelector(".flip-card");

if (flipCard) {
  flipCard.addEventListener("click", handleFlip);
}

function handleFlip(event) {
  const cardInner = event.currentTarget.querySelector(".flip-card-inner");

  if (cardInner) {
    cardInner.classList.toggle("flipped");
    //console.log("Card flipped");
  }
}
