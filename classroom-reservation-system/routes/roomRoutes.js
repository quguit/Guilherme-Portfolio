const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');
const auth = require('../middlewares/authMiddleware');
const permit = require('../middlewares/roleMiddleware');
const { validateRoomCreate } = require('../middlewares/roomValidation');

router.post('/', auth, permit('teacher', 'servant'), validateRoomCreate, RoomController.create);


router.post('/', RoomController.register); // POST /api/rooms
router.get('/', RoomController.list); // GET /api/rooms

router.put('/:id', RoomController.update); // PUT /api/rooms/:id
module.exports = router;
