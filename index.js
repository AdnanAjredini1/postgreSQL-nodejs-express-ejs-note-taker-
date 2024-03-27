import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const notes = [{ _id: "", title: "", content: "" }];

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", { notes: notes });
    console.log(notes);
  });



  app.get("/new", (req, res) => {
    res.render("new");
  });
  
  app.post("/new", (req, res) => {
    const { title, content } = req.body;
  
    let _id = notes.length + 1;
    notes.push({ _id, title, content });
    res.redirect("/");
    
  });


  app.get("notes/:_id",(req,res) => {
    
  })
   



  app.post("/delete/:_id",(req,res) => {
    const id = req.params._id.toString()
    // Find the index of the note with the specified ID
    console.log(req.params._id.toString());
    const noteIndex=notes.findIndex((note) => note._id===id);

    if (noteIndex < -1){
        return res.status(404).send('Note not found');
    }

    // Remove the note from the array
    notes.splice(noteIndex,1);
    
    res.redirect("/");


});



  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });