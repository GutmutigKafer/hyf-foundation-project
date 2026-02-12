import express from "express";
import knex from "knex";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

const knexInstance = knex({
  client: "sqlite3",
  connection: {
    filename: "./pictures.sqlite3",
  },
  useNullAsDefault: true,
});

app.get("/", (req, res) => {
  res.send("API root. Type /all-pictures to get data");
});

app.get("/all-pictures", async (req, res) => {
  const allPictures = await getAllPictures();
  return res.json(allPictures);
});

app.listen(port, () => {
  console.log(`Server ready on http://localhost:${port}`);
});

const getAllPictures = async () => {
  const data = await knexInstance.raw(
    "SELECT * FROM images ORDER BY img_id ASC;",
  );
  return data;
};

app.post("/submit-score", async (req, res) => {
  const player_Name = req.body.player_name;
  const cards_Revealed = req.body.cards_revealed;
  const time_Taken = req.body.time_taken;
  try {
    await knexInstance("game_scores").insert({
      player_name: player_Name,
      cards_revealed: cards_Revealed,
      time_taken: time_Taken,
    });

    return res.json({ success: true, message: "Score saved!" });
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  }
});
