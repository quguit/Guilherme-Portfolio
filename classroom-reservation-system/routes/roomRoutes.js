const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const auth = require('../middlewares/authMiddleware');
const permit = require('../middlewares/roleMiddleware');
const { validateRoomCreate } = require('../middlewares/roomValidation');

router.post('/', auth, permit('teacher', 'servant'), validateRoomCreate, roomController.create);


router.post('/', roomController.create); // POST /api/rooms
router.get('/', roomController.list); // GET /api/rooms

router.put('/:id', roomController.update); // PUT /api/rooms/:id
module.exports = router;
