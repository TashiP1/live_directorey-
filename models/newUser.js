const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const noteSchema = new Schema({
      title: {
            type: String,
            required: true
      },
      snippet: {
            type: String,
            required: true
      },
      uname: {
            type: String,
            required: true
      },
      pass: {
            type: String,
            required: true
      },
      body: {
            type: String,
            required: true
      }
}, {timestamps:true});

noteSchema.pre("save", async function(next) {
      if (this.isModified("pass")) {
        this.pass = await bcrypt.hash(this.pass, 10); // Salt rounds set to 10
      }
      next();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;