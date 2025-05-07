
const request = require('supertest');
const app = require('../../app/app');
const User = require('../../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


function generateToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET || 'segredo_teste');
}

// ⬇️ Conectar ao banco antes de qualquer teste
beforeAll(async () => {
    const uri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/testdb';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

// limpar o banco de dados após cada teste
beforeEach(async () => {
  await User.deleteMany({});
});

// desconectar do banco de dados após todos os testes
afterAll(async () => {
  await mongoose.connection.close();
});

// describe register user
describe('User Controller - Register', () => {
  it('deve register novo usuário', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Luffy',
        email: 'reidospiratas@eiichirooda.com',
        password: 'Teste1234@',
        type_user: 'student',
        identification: '2018012358',
        confirmPassword: 'Teste1234@', // Ensure all required fields are included
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.user.email).toBe('reidospiratas@eiichirooda.com');      
  });

  it('deve falhar se houver campo obrigatório ausente', async () => {
    const res = await request(app).post('/api/users/register')
      .send({
        name: 'Luffy',
        
      });
    
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('erros');
    expect(Array.isArray(res.body.erros)).toBe(true);
    expect(res.body.erros[0]).toHaveProperty('msg');

  });
});