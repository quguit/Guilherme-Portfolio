const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const auth = require('../middlewares/authMiddleware');

router.get('/user/:userId', BookingController.listByUser);
router.post('/', BookingController.create);
router.put('/:id/status', BookingController.updateStatus);

module.exports = router;
// This code defines a route for listing reservations by user ID.