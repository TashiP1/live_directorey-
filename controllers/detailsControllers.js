const fs = require("fs");
const path = require("path");
const Note = require("../models/newUser");

// Function to log actions
const logAction = (req, action) => {
  if (req.session && req.session.actions) {
    req.session.actions.push({ action, timestamp: new Date().toISOString() });
  }
};

const note_index = (req, res) => {
  Note.find()
    .then((data) => {
      logAction(req, "Visited Home page");
      res.render("index", { title: "Home", data });
    })
    .catch((err) => {
      console.log(err);
    });
};

const note_user = (req, res) => {
  Note.find()
    .then((data) => {
      logAction(req, "Visited User Dashboard");
      res.render("user", { title: "Home", data });
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
      logAction(req, `Created a new note with name: ${req.body.title} username ${req.body.uname}`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const note_create = (req, res) => {
  logAction(req, "Accessed new note creation page");
  res.render("newEmployee", { 
    title: "New Note", 
    csrfToken: req.csrfToken() 
  });
};

const note_id = (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .then((result) => {
      logAction(req, `Viewed note with ID: ${id}`);
      res.render("details", { 
        note: result, 
        title: "Note Details", 
        csrfToken: req.csrfToken() 
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const note_delete = (req, res) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((result) => {
      logAction(req, `Deleted note with ID: ${id}`);
      res.json({ redirect: "/" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  note_index,
  note_user,
  note_post,
  note_create,
  note_id,
  note_delete,
};
