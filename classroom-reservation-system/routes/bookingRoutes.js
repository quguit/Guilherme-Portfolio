const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');
const auth = require('../middlewares/authMiddleware');
const permit = require('../middlewares/roleMiddleware');

const { validateBookingCreate } = require('../middlewares/bookingValidation');


// rota acessível apenas por professores
router.put('/:id/status', auth, permit('teacher'), BookingController.updateStatus);

// rota para qualquer usuário autenticado
router.post('/', auth, validateBookingCreate, BookingController.create);

// rota para listar reservas por usuário (autenticado)
router.get('/user/:user_id', auth, BookingController.listByUser);

//PATCH: devolução da chave
router.patch('/:id/return', auth, permit('teacher', 'servant'), BookingController.registerKeyReturn);
// test api
//URL PATCH http://localhost:7000/api/bookings/<id>/return
//Headers: Authorization: Bearer <seu_token>
// Content-Type: application/json
//não precisa body pois é uma atualização simples de estado


module.exports = router;
// This code defines a route for listing reservations by user ID.