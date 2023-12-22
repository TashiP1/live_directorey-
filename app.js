const express = require("express");

const app = express();

app.set("view engine", "ejs");

app.listen(3000);

app.get("/", (req, res) => {
  const notes = [
    {
      title: "Yoshi finds eggs",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      title: "Mario finds stars",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
    {
      title: "How to defeat bowser",
      snippet: "Lorem ipsum dolor sit amet consectetur",
    },
  ];
  res.render("index", { title: "Home", notes});
});

app.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

app.get("/note/create", (req, res) => {
  res.render("newNote", { title: "New Note" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
