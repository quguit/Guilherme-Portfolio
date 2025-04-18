const Booking = require('../models/Booking');

exports.create = async (req, res) => {
  try {
    const { user_id, room_id, start_time, end_time, purpose } = req.body;

    if (!user_id || !room_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const booking = await Booking.create({
      user_id,
      room_id,
      start_time,
      end_time,
      purpose
    });

    res.status(201).json({
      message: 'Reserva realizada com sucesso!',
      booking
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao criar reserva',
      detalhes: error.message
    });
  }
};



// Listar todas as reservas por ID do usuário
exports.listByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user_id: userId })
      .populate('room_id', 'number type')
      .populate('user_id', 'name email');

    res.status(200).json({
      total: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar reservas',
      detalhes: error.message
    });
  }
};