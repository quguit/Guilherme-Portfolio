const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app/app'); 
const User = require('../../../models/User');
const Room = require('../../../models/Room');
const Booking = require('../../../models/Booking');

const MONGO_TEST_URI = 'mongodb://localhost:27017/booking_test'; 

describe('Booking Controller - Integração', () => {
  let studentToken, teacherToken;
  let student, teacher, room;

  beforeAll(async () => {
    await mongoose.connect(MONGO_TEST_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Limpa DB
    await User.deleteMany({});
    await Room.deleteMany({});
    await Booking.deleteMany({});

    // Cria usuários
    student = await User.create({
      name: 'Aluno Teste',
      email: 'aluno@example.com',
      password: '123456',
      type_user: 'student'
    });

    teacher = await User.create({
      name: 'Professor Teste',
      email: 'prof@example.com',
      password: '123456',
      type_user: 'teacher'
    });

    // Cria sala com professor responsável
    room = await Room.create({
      number: 'A101',
      type: 'lab',
      responsibles: [teacher._id]
    });

    // Simula tokens — aqui simplificando para uso direto
    studentToken = generateTestToken(student);
    teacherToken = generateTestToken(teacher);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /bookings - Criação de reserva', () => {
    it('Aluno deve conseguir criar uma reserva pendente com professor responsável', async () => {
      const res = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          room_id: room._id,
          start_time: new Date(Date.now() + 3600000), // +1h
          end_time: new Date(Date.now() + 7200000),   // +2h
          purpose: 'Apresentação de projeto',
          requested_teacher: teacher._id
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.booking.status_booking).toBe('pending');
      expect(res.body.booking.room_id).toBe(room._id.toString());
    });

    it('Professor deve conseguir criar uma reserva já aprovada', async () => {
    const res = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        room_id: room._id,
        start_time: new Date(Date.now() + 10800000), // +3h
        end_time: new Date(Date.now() + 14400000),   // +4h
        purpose: 'Aula extra'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.booking.status_booking).toBe('approved');
  });
    it('Deve impedir reserva com conflito de horário', async () => {
      const res = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          room_id: room._id,
          start_time: new Date(Date.now() + 3600000),  // +1h (conflito com 1º teste)
          end_time: new Date(Date.now() + 7200000),
          purpose: 'Tentativa inválida'
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.error).toMatch(/conflito/i);
    });
  });
});

function generateTestToken(user) {
  const jwt = require('jsonwebtoken');
  const SECRET = 'testsecret'; // igual ao do seu projeto
  return jwt.sign({
    id: user._id,
    type_user: user.type_user,
    email: user.email
  }, SECRET, { expiresIn: '1h' });
}

  describe('PUT /bookings/:id/status - Atualização de status', () => {
    let bookingToApprove;

    beforeAll(async () => {
      // Cria nova reserva pendente para teste
      bookingToApprove = await Booking.create({
        user_id: student._id,
        room_id: room._id,
        start_time: new Date(Date.now() + 21600000), // +6h
        end_time: new Date(Date.now() + 25200000),   // +7h
        purpose: 'Reserva pendente',
        requested_teacher: teacher._id,
        status_booking: 'pending'
      });
    });

    it('Professor responsável deve aprovar a reserva', async () => {
      const res = await request(app)
        .put(`/bookings/${bookingToApprove._id}/status`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({ status_booking: 'approved' });

      expect(res.statusCode).toBe(200);
      expect(res.body.booking.status_booking).toBe('approved');
    });

    it('Aluno não deve conseguir alterar status da reserva', async () => {
      const res = await request(app)
        .put(`/bookings/${bookingToApprove._id}/status`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ status_booking: 'rejected' });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toMatch(/apenas professores/i);
    });
  });

    describe('PATCH /bookings/:id/key-return - Devolução de chave', () => {
    let keyBooking;

    beforeAll(async () => {
      // Cria reserva aprovada
      keyBooking = await Booking.create({
        user_id: teacher._id,
        room_id: room._id,
        start_time: new Date(Date.now() + 30000000), // +8h
        end_time: new Date(Date.now() + 30600000),
        purpose: 'Teste devolução',
        status_booking: 'approved',
        key_return: false
      });
    });

    it('Deve registrar a devolução de chave com sucesso', async () => {
      const res = await request(app)
        .patch(`/bookings/${keyBooking._id}/key-return`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.booking.key_return).toBe(true);
    });

    it('Não deve permitir devolução duplicada', async () => {
      const res = await request(app)
        .patch(`/bookings/${keyBooking._id}/key-return`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/já foi devolvida/i);
    });
  });

    describe('GET /bookings - Listagem com filtros', () => {
    it('Deve listar todas as reservas do banco', async () => {
      const res = await request(app)
        .get('/bookings')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.total).toBeGreaterThan(0);
      expect(Array.isArray(res.body.bookings)).toBe(true);
    });

    it('Deve filtrar reservas por status', async () => {
      const res = await request(app)
        .get('/bookings')
        .query({ status_booking: 'approved' })
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(200);
      res.body.bookings.forEach(b => {
        expect(b.status).toBe('approved');
      });
    });

    it('Deve filtrar reservas ativas (futuras)', async () => {
      const res = await request(app)
        .get('/bookings')
        .query({ active_only: 'true' })
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(res.statusCode).toBe(200);
      res.body.bookings.forEach(b => {
        expect(new Date(b.date.end) >= new Date()).toBe(true);
      });
    });
  });
