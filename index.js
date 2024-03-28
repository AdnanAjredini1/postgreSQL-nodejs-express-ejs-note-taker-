import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const notes = [];

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { notes: notes });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/new", (req, res) => {
  const { title, content } = req.body;
  const _id = notes.length + 1;
  notes.push({ _id, title, content });
  res.redirect("/");
});

app.get("/notes/:_id", (req, res) => {
  const _id = req.params._id;
  const note = notes.find((note) => note._id === parseInt(_id));
  if (!note) {
    res.status(404).send("Note not found");
    return;
  }
  res.render("show", { note: note });
});

app.get("/edit/:_id", (req, res) => {
  const _id = parseInt(req.params._id);
  const note = notes.find((note) => note._id === _id);
  if (!note) {
    res.status(404).send("Note not found");
    return;
  }
  res.render("edit", { note: note });
});

app.post("/edit/:_id", (req, res) => {
  const _id = parseInt(req.params._id);
  const { title, content } = req.body;
  const noteIndex = notes.findIndex((note) => note._id === _id);
  if (noteIndex === -1) {
    res.status(404).send("Note not found");
    return;
  }
  notes[noteIndex].title = title;
  notes[noteIndex].content = content;
  res.redirect("/");
});

app.post("/delete/:_id", (req, res) => {
  const id = req.params._id.toString();
  const noteIndex = notes.findIndex((note) => note._id === parseInt(id));
  if (noteIndex === -1) {
    return res.status(404).send("Note not found");
  }
  notes.splice(noteIndex, 1);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
