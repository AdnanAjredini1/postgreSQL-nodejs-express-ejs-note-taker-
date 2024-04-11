import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pg from "pg";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

let notes = [];

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Notes",
  password: "***********",
  port: 5432,
});
db.connect();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM notes ORDER BY id DESC");
    notes = result.rows;

    res.render("index", { notes: notes });
  } catch (err) {
    console.log(err);
  }
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/new", async (req, res) => {
  const { title, content } = req.body;
  try {
    await db.query("INSERT INTO notes (title, content) VALUES ($1, $2)", [
      title,
      content,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.get("/notes/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const note = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
    res.render("show", { note: note.rows[0] });
  } catch (error) {
    console.log(error);

    res.status(500).send("Internal Server Error");
  }
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const note = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
    res.render("edit", { note: note.rows[0] });
  } catch (error) {
    console.log(error);

    res.status(500).send("Internal Server Error");
  }
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  try {
    await db.query(
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 ;",
      [title, content, id]
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM notes WHERE id = $ ;", [id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
