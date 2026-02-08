import express from "express";
import knex from "knex";

const app = express();
const port = 3000;

// This connects to the database stored in the file mentioned below
const knexInstance = knex({
  client: "sqlite3",
  connection: {
    filename: "./pictures.sqlite3",
  },
  useNullAsDefault: true, // Omit warning in console
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
