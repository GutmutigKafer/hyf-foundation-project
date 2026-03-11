export const loadLeaderboard = async (gridSize) => {
  try {
    const res = await fetch(`http://localhost:3000/leaderboard/${gridSize}`);
    const data = await res.json();

    const container = document.getElementById(`leaderboard-${gridSize}`);

    if (!data.length) {
      container.innerHTML = "No scores yet.";
      return;
    }

    container.innerHTML = data
      .map(
        (player, i) =>
          `<div>${i + 1}. ${player.player_name} - ${player.best_time}s</div>`
      )
      .join("");
  } catch (err) {
    console.error("Error loading leaderboard:", err);
  }
};
