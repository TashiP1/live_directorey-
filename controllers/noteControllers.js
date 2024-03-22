const Note = require("../models/dailyNote");

const note_index = (req, res) => {
  Note.find()
    .then((data) => {
      res.render("index", { title: "Home", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

const note_post = (req, res) => {
  const note = new Note(req.body);
  note
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const note_create = (req, res) => {
      res.render("newNote", { title: "New Note" });
}

const note_id = (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .then((result) => {
      res.render("details", { note: result, title: "Note Details" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const note_delete = (req, res) => {
  const id = req.params.id;

  Note.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  note_index,
  note_post,
  note_create,
  note_id,
  note_delete,
};
