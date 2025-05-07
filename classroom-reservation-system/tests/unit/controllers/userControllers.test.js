// Teste unitário para o controller de usuários
const { register } = require('../../controllers/userController');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

jest.mock('../../models/User');
jest.mock('bcrypt');

describe('UserController - register', () => {
  const mockReq = {
    body: {
      name: 'João',
      email: 'joao@email.com',
      password: 'senha123',
      type_user: 'aluno',
      identification: '123456'
    }
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo usuário e retornar 201', async () => {
    const hashedPassword = 'senhaHasheada';
    bcrypt.hash.mockResolvedValue(hashedPassword);
    User.create.mockResolvedValue({ id: 'abc123', ...mockReq.body, password: hashedPassword });

    await register(mockReq, mockRes);

    expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
    expect(User.create).toHaveBeenCalledWith({
      name: 'João',
      email: 'joao@email.com',
      password: hashedPassword,
      type_user: 'aluno',
      identification: '123456'
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      user: expect.objectContaining({
        name: 'João',
        email: 'joao@email.com'
      })
    });
  });

  it('deve retornar 400 em caso de erro', async () => {
    bcrypt.hash.mockRejectedValue(new Error('Erro de hash'));

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      erro: 'Erro ao registrar usuário',
      detalhes: 'Erro de hash'
    });
  });
});
