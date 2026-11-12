const express = require('express');
const router = express.Router();

const {getNotes,getNoteByID,createNote,updNote,delNote} = require("../controllers/noteController")

router.get('/', getNotes)
router.get('/:id', getNoteByID )
router.post('/', createNote )
router.put('/:id', updNote )
router.delete('/:id', delNote)

module.exports = router;