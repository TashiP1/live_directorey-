const express = require("express");
const detailsController = require("../controllers/detailsControllers");

const router = express.Router();

router.get("/", detailsController.note_index);

router.get("/user", detailsController.note_user);

router.post("/", detailsController.note_post);

router.get("/note/create", detailsController.note_create);

router.get("/:id", detailsController.note_id);

router.delete("/:id", detailsController.note_delete);

module.exports = router;