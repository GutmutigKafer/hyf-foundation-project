import express from "express";
import knex from "knex";

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
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
