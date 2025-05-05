
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// create a booking
exports.create = async (req, res) => {
  try {
    const { room_id, start_time, end_time, purpose , requested_teacher} = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type_user;

    if (!room_id || !start_time || !end_time || !purpose || (user_type === 'student' && !requested_teacher)) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const room = await Room.findById(room_id).populate('responsibles', 'name email');
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada.' });
    }

    //verifica conflitos de reserva
    const conflictingBookings = await Booking.findOne({
      room_id,
      $or: [
        { start_time: { $lt: new Date(end_time) } },
        { end_time: { $gt: new Date(start_time) } }
      ]
    }).populate('user_id', 'name email')
      .populate('room_id', 'number responsibles');

    if (conflictingBookings) {
      return res.status(409).json({
        error: 'Conflito de reserva. A sala já está reservada nesse horário.',
        reservado_para: conflictingBookings.purpose,
        reservado_por: conflictingBookings.user_id,
        sala: conflictingBookings.room_id.number,
        responsáveis: conflictingBookings.room_id.responsibles 
      });
    }      

    //regras de acesso 
    if (user_type === 'student' && room.responsibles.length > 0 && !requested_teacher) {
      return res.status(403).json({
        error: 'Sala exige professor responsável. Selecione um professor para solicitar aprovação.'
      });
    }
    
    if (user_type === 'student' && requested_teacher) {
      const teacherExists = await User.findById(requested_teacher);
      if (!teacherExists || teacherExists.type_user !== 'teacher') {
        return res.status(400).json({ error: 'Professor responsável inválido.' });
      }
    }
    
    
    const booking = await Booking.create({
      user_id,
      room_id,
      start_time,
      end_time,
      purpose,
      requested_teacher: user_type === 'student' ? requested_teacher : undefined,
      status_booking: user_type === 'teacher' ? 'approved' : 'pending',
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
    if(userType !== 'teacher') {
      return res.status(403).json({ error: 'Apenas professores podem aprovar ou rejeitar reservas.' });
    }

    //verifica se a sala tem responsáveis
    if (room.responsibles && room.responsibles.length > 0) {
      const isResponsible = room.responsibles.some(responsible => responsible.toString() === userId);
      if (!isResponsible) {
        return res.status(403).json({ error: 'Você não tem permissão para aprovar ou rejeitar esta reserva.' });
      }
    }
    // Atualiza o status da reserva
    booking.status_booking = status_booking;
    await booking.save();

    res.status(200).json({
      message:'Reserva ${status_booking} com sucesso.',
      booking
     });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status de reserva.', detalhes: error.message });
  }
};

// Register a return key
exports.registerKeyReturn = async (req, res) => {
  try {
    const {id} = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    // Verifica se a reserva já foi devolvida
    if (booking.key_return) {
      return res.status(400).json({ error: 'A chave já foi devolvida.' });
    }

    // Atualiza o status da devolução da chave
    booking.key_return = true;
    await booking.save();

    res.status(200).json({
      message: 'Chave devolvida com sucesso.',
      booking
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar devolução da chave.', detalhes: error.message });
}
}


// Listar todas as reservas por ID do usuário
exports.listByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const bookings = await Booking.find({ user_id: user_id })
      .populate('room_id', 'number type')
      .populate('user_id', 'name email');

    const formatted = bookings.map(b => ({
      id: b._id,
      date: {
        start: b.start_time,
        end: b.end_time
      },
      room: {
        number: b.room_id?.number || 'Sala não encontrada',
        type: b.room_id?.type || 'Tipo não encontrado'
      },
      person_in_charge: {
        name: b.user_id?.name || 'Usuário não encontrado',
        email: b.user_id?.email || 'Email não encontrado'
      },
      status: b.status_booking,
      key_return: b.key_return,
      purpose: b.purpose,
      responsible_teachers: b.room_id?.responsibles.map(r => ({
        name: r.name,
        email: r.email
      })),
      

    }));

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
}
