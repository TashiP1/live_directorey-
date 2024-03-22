const express = require("express");
const mongoose = require("mongoose");
const homeRoute = require('./routes/homeRoute')

const app = express();
const dbURI =
  "mongodb+srv://TashiP1:Tashi123@cluster0.o80jfgd.mongodb.net/DiaryDb?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/about", (req, res) => {
  res.render("about", { title: "about" });
});

app.use(homeRoute);

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
