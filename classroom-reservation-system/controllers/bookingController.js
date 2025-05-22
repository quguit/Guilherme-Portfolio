const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User'); // <- você usou User mas não estava importando

/**
 * Cria uma nova reserva de sala
 * - Alunos precisam informar um professor responsável
 * - Professores aprovam reservas automaticamente
 */
exports.create = async (req, res) => {
  try {
    const { room_id, start_time, end_time, purpose, requested_teacher } = req.body;
    const user_id = req.user.id;
    const user_type = req.user.type_user;

    // Validação básica de campos obrigatórios
    if (!room_id || !start_time || !end_time || !purpose) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    // Buscar sala
    const room = await Room.findById(room_id).populate('responsibles', 'name email');
    if (!room) {
      return res.status(404).json({ error: 'Sala não encontrada.' });
    }

    // Verificar conflito de horário
    const conflictingBooking = await Booking.findOne({
      room_id,
      $or: [
        { start_time: { $lt: new Date(end_time) }, end_time: { $gt: new Date(start_time) } }
      ]
    }).populate('user_id', 'name email')
      .populate('room_id', 'number responsibles');

    if (conflictingBooking) {
      return res.status(409).json({
        error: 'Conflito de reserva. A sala já está reservada nesse horário.',
        reservado_para: conflictingBooking.purpose,
        reservado_por: conflictingBooking.user_id,
        sala: conflictingBooking.room_id.number,
        responsáveis: conflictingBooking.room_id.responsibles 
      });
    }

    // Regras para alunos
    if (user_type === 'student') {
      // Sala exige responsável e nenhum foi informado
      if (room.responsibles.length > 0 && !requested_teacher) {
        return res.status(403).json({
          error: 'Sala exige professor responsável. Selecione um professor para solicitar aprovação.'
        });
      }

      // Professor informado deve ser válido
      if (requested_teacher) {
        const teacher = await User.findById(requested_teacher);
        if (!teacher || teacher.type_user !== 'teacher') {
          return res.status(400).json({ error: 'Professor responsável inválido.' });
        }
      }
    }

    // Criar reserva
    const booking = await Booking.create({
      user_id,
      room_id,
      start_time,
      end_time,
      purpose,
      requested_teacher: user_type === 'student' ? requested_teacher : undefined,
      status_booking: user_type === 'teacher' ? 'approved' : 'pending'
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

/**
 * Atualiza o status (approved/rejected) de uma reserva
 * - Apenas professores podem aprovar/rejeitar
 * - Se a sala tiver responsáveis, apenas eles podem aprovar
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_booking } = req.body;
    const userId = req.user.id;
    const userType = req.user.type_user;

    if (!['approved', 'rejected'].includes(status_booking)) {
      return res.status(400).json({ error: 'Status inválido.' });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Reserva não encontrada.' });

    const room = await Room.findById(booking.room_id);
    if (!room) return res.status(404).json({ error: 'Sala não encontrada.' });

    if (userType !== 'teacher') {
      return res.status(403).json({ error: 'Apenas professores podem aprovar ou rejeitar reservas.' });
    }

    if (room.responsibles.length > 0) {
      const isResponsible = room.responsibles.some(res => res.toString() === userId);
      if (!isResponsible) {
        return res.status(403).json({ error: 'Você não tem permissão para aprovar ou rejeitar esta reserva.' });
      }
    }

    booking.status_booking = status_booking;
    await booking.save();

    res.status(200).json({
      message: `Reserva ${status_booking} com sucesso.`,
      booking
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar status de reserva.', detalhes: error.message });
  }
};

/**
 * Marca uma reserva como "chave devolvida"
 */
exports.registerKeyReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: 'Reserva não encontrada.' });

    if (booking.key_return) {
      return res.status(400).json({ error: 'A chave já foi devolvida.' });
    }

    booking.key_return = true;
    await booking.save();

    res.status(200).json({
      message: 'Chave devolvida com sucesso.',
      booking
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar devolução da chave.', detalhes: error.message });
  }
};

/**
 * Lista reservas com filtros (usuário, sala, status, datas)
 */
exports.list = async (req, res) => {
  try {
    const {
      user_id,
      room_id,
      status_booking,
      active_only,
      start_date,
      end_date
    } = req.query;

    const filters = {};

    if (user_id) filters.user_id = user_id;
    if (room_id) filters.room_id = room_id;
    if (status_booking) filters.status_booking = status_booking;

    const dateFilters = {};
    if (start_date) dateFilters.$gte = new Date(start_date);
    if (end_date) dateFilters.$lte = new Date(end_date);
    if (Object.keys(dateFilters).length > 0) {
      filters.start_time = dateFilters;
    }

    if (active_only === 'true') {
      const now = new Date();
      filters.end_time = filters.end_time || {};
      filters.end_time.$gte = now;
    }

    const bookings = await Booking.find(filters)
      .populate('room_id', 'number type responsibles')
      .populate('user_id', 'name email')
      .populate({
        path: 'room_id',
        populate: {
          path: 'responsibles',
          select: 'name email'
        }
      })
      .sort({ start_time: 1 });

    const formatted = bookings.map(b => ({
      id: b._id,
      date: {
        start: b.start_time,
        end: b.end_time
      },
      room: {
        id: b.room_id?._id || 'ID não encontrado',
        number: b.room_id?.number || 'Sala não encontrada',
        type: b.room_id?.type || 'Tipo não encontrado'
      },
      person_in_charge: {
        id: b.user_id?._id || 'ID não encontrado',
        name: b.user_id?.name || 'Usuário não encontrado',
        email: b.user_id?.email || 'Email não encontrado'
      },
      status: b.status_booking,
      key_return: b.key_return,
      purpose: b.purpose,
      responsible_teachers: b.room_id?.responsibles?.map(r => ({
        name: r.name,
        email: r.email
      })) || []
    }));

    res.status(200).json({
      total: bookings.length,
      bookings: formatted
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar reservas',
      detalhes: error.message
    });
  }
};
/**
 * Cancela uma reserva
 */
