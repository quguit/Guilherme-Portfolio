
// Teste unitário para o controller de usuários

const userController = require('../../../controllers/userController');
const User = require('../../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//mocka dependências externas
jest.mock('../../../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

//unitary test for userController.register
describe('UserController.register', () => {
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

    await userController.register(mockReq, mockRes);

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

    await userController.register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      erro: 'Erro ao registrar usuário',
      detalhes: 'Erro de hash'
    });
  });
});

// test unitary for userControllers.login
describe('userControllers.login', () => {
  let req, res;

  beforeEach(() => {
    //simula objectos de req e res
    req = {
      body: {
        email: 'test@example.com',
        password: 'senha1234#'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('deve retornar 401 se usuário não for encontrado', async () => {
    // Simula o retorno do método findOne do mongoose
    User.findOne.mockResolvedValue(null);

    await userController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário não encontrado'
    });
  });

  it('deve retornar 401 se a senha estiver incorreta', async () => {
    // simula usuario encontrado
    const mockUser = { password: 'hash'};
    User.findOne.mockResolvedValue(mockUser);

    // simula bcrypt.compare retornando false
    bcrypt.compare.mockResolvedValue(false);

    await userController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Senha incorreta'});
  });

  it('deve retornar token e dados do usuário se o login for bem-sucedido', async () => {
    // simula usuário encontrado
    const mockUser = {
      _id: 'adc123',
      name: 'Test user',
      email: 'test@example.com',
      type_user: 'student',
      identification: '123456',
      password: 'hash'
    };

    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-token');

    await userController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login realizado com sucesso',
      token: 'fake-token',
      user: {
        id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        type_user: mockUser.type_user
      }
    });
  });

  it('deveretornar 500 em caso de erro inesperado', async () => {
    User.findOne.mockRejectedValue(new Error('DB error'));

    await userController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Erro ao fazer login',
      details: 'DB error'
    });
  });
});
