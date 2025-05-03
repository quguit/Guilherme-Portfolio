/* Testar o comportamento da função create sob diferentes cenários, como:

Dados válidos → deve criar uma reserva.

Dados ausentes → deve retornar erro 400.

Conflito de horários → deve retornar erro 409.

Estudante sem professor → deve retornar erro 403.*/

const request = require('supertest');
const jwt = require('mongoose');
const app = require('../../app/app');
const mongoose = require('mongoose');
const Booking = require('../../models/Booking');
const Room = require('../../models/Room');
const User = require('../../models/User');

const { describe, it } = require('node:test');
// mock do token JWT
function generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET || 'segredo_teste');
}
//limpar o banco após cada teste
afterEach(async () => {
    await Booking.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();
});

jest.mock('../../models/Booking.js');
jest.mock('../../models/Room.js')

describe('Booking Controller - Create', () => {
    const mockReq = {
        body: {
            room_id: 'fakeRoomId',
            start_time: new Date(),
            end_time: new Date(Date.now() + 60*60*1000),
            purpose: 'Aula de teste',
            requested_teacher: 'professorId'
        },
        user: {
            id: 'user123',
            type_user: 'student'
        }
    };

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar 400 para campos obrigatórios ausentes', async () => {
        const req ={...mockReq, body: { ...mockReq.body, purpose:undefined} };
        await require('../../controllers/bookingController').create(req, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Campos obrigatórios ausentes.'});
    });

    it('deve retornar 404 se a sala não for encontrada', async () => {
        Room.findById.mockResolvedValue(null);

        await require('../../controllers/bookingController').create(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Sala não encontrada'});
    });

    it('deve retornar erro de conflito de horário', async () => {
        //criar sala e reserva existente
        const room = await Room.create({ number: '101', type: 'teórica' });
        const user = await User.create({ name: 'João', email: 'joao@email.com', password: 'Teste@1234', type_user: 'teacher', identification: '1122'});

        await Booking.create({
            user_id: user._id,
            room_id: room._id,
            start_time: new Date('2025-04-30T10:00:00'),
            end_time: new Date('2025-04-30T12:00:00'),
            purpose: 'Aula de física',
        });

        const token = generateToken({ id: user._id, type_user: user.type_user });

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                room_id: room._id,
                start_time: '2025-04-30T11:00:00',
                end_time: '2025-04-30T13:00:00',
                purpose: 'Aula de matemática'
            });
        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('error');
    });

    it('deve retornar erro se estudante não indicar professor responsável', async () => {
        const room = await Room.create({ number: '102', type: 'prática', responsibles: ['507f1f77bcf86cd799439011'] });
        const user = await User.create({ name: 'Aluno', email: 'aluno@email.com', password: '123', type_user: 'student', identification: '112' });

        const token = generateToken({ id: user._id, type_user: user.type_user });

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                room_id: room._id,
                start_time: '2025-05-01T14:00:00',
                end_time: '2025-05-01T16:00:00',
                purpose: 'Estudo em grupo'
            });

            expect(res.statusCode).toBe(403);
            expect(res.body.error).toMatch(/professor responsável/i);
    });

    it('deve criar reserva com sucesso para professor', async () => {
        const room = await Room.create({ number: '103', type: 'laboratory'});
        const user = await User.create({ name: 'Prof Girafales', email: 'profg@email.com', password: 'Test@1234', type_user: 'teacher', identification: '113'});

        const token = generateToken({ id: user._id, type_user: user.type_user});

        const res = await request(app)
            .post('/api/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send({
                room_id: room._id,
                start_time: '2025-05-02T08:00:00',
                end_time: '2025-05-02T10:00:00',
                purpose: 'Aula prática'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body.booking).toHaveProperty('_id');        
    });
});