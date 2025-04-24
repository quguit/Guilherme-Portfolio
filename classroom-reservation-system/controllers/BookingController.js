
const Booking = require('../models/Booking');
const Room = require('../models/Room');

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
    const { user_id } = req.params;

    const bookings = await Booking.find({ user_id: user_id })
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

// Atualizar status da reserva
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params; //ID da reserva
    const { status_booking } = req.body;
    const userId = req.user.id;
    const userType = req.user.type_user;

    //validate  router
    if (!['approved', 'rejected'].includes(status_booking)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }
    //busca a reserva
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }
    //buscar a sala vinculada
    const room = await Room.findById(booking.room_id);
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada.' });
    }

    //verificar se o usuario é professor
    if(userType === 'teacher') {
      return res.status(403).json({ error: 'Apenas professores podem aprovar ou rejeitar reservas.' });
    }

    //verifica se a sala tem responsáveis
    if (room.responsibles && room.responsibles.length > 0) {
      const isResponsible = room.responsible.some(responsible => responsible.toString() === userId);
      if (!isResponsible) {
        return res.status(403).json({ error: 'Você não tem permissão para aprovar ou rejeitar esta reserva.' });
      }
    }
    // Atualiza o status da reserva
    booking.status_booking = status_booking;
    await booking.save();

    res.status(200).json({
      message:'Reserva ${status} com sucesso.',
      booking
     });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status de reserva.', detalhes: error.message });
  }
};