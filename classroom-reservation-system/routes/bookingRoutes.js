const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');

router.get('/user/:userId', BookingController.listByUser);
router.post('/', BookingController.create);
module.exports = router;
// This code defines a route for listing reservations by user ID.