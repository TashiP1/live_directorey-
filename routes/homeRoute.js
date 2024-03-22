const express = require("express");
const noteController = require("../controllers/noteControllers");

const router = express.Router();

router.get("/", noteController.note_index);

router.post("/", noteController.note_post);

router.get("/note/create", noteController.note_create);

router.get("/:id", noteController.note_id);

router.delete("/:id", noteController.note_delete);

module.exports = router;