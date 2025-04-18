const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');

router.post('/', RoomController.register); // POST /api/rooms
router.get('/', RoomController.list); // GET /api/rooms

router.put('/:id', RoomController.update); // PUT /api/rooms/:id
module.exports = router;
