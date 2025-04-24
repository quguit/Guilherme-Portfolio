const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const auth = require('../middlewares/authMiddleware');
const permit = require('../middlewares/roleMiddleware');

// rota acessível apenas por professores
router.put('/:id/status', auth, permit('teacher'), BookingController.updateStatus);

// rota para qualquer usuário autenticado
router.post('/', auth, BookingController.create);

// rota para listar reservas por usuário (autenticado)
router.get('/user/:user_id', auth, BookingController.listByUser);

//PATCH: devolução da chave
router.patch('/:id/return', auth, permit('teacher', 'servant'), BookingController.registerKeyReturn);

module.exports = router;
// This code defines a route for listing reservations by user ID.