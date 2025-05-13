const jwt = require('jsonwebtoken');
const authMiddleware = require('../../../middlewares/authMiddleware');

// mock the module jwt
jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    //setup
    let req, res, next;

    beforeEach(() => {
        // reset mocks before each test
        jest.clearAllMocks();

        // mock the request, response, and next function
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();

        //mock environment variable
        process.env.JWT_SECRET = 'test_secret';
    });

    // Test case: Authorization header provided
    it('deve retornar 401 quando header de authorization não for fornecido', () => {
        // act
        authMiddleware(req, res, next);

        // Assert 
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido'});
        expect(next).not.toHaveBeenCalled();
    });

    // Test case: Authorization header doesn't start with 'Bearer'
    it('deve retornar 401 quando o header de autorização não inicia com "Bearer"', () => {
        // Arrange
        req.headers.authorization = 'InvalidToken';

        // Act
        authMiddleware(req, res, next);

          // Assert
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test case: Invalid token
    it('deve retornar 403 quando token inválido', () => {
        // Arrange
        req.headers.authorization = 'Bearer invalid_token';
        jwt.verify.mockImplementation(() => {
           throw new Error('Token inválido');
        });

        // Act
        authMiddleware(req, res, next);
        // Assert
        expect(jwt.verify).toHaveBeenCalledWith('invalid_token', 'test_secret');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
        expect(next).not.toHaveBeenCalled();

    });

      // Test case: Expired token
  test('deve retornar erro 403 quando o token está expirado', () => {
    // Arrange
    req.headers.authorization = 'Bearer expired_token';
    jwt.verify.mockImplementation(() => {
      const error = new Error('Token expirado');
      error.name = 'TokenExpiredError';
      throw error;
    });
    
    // Act
    authMiddleware(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('expired_token', 'test_secret');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: Valid token
  test('deve chamar next() e adicionar usuário decodificado ao request quando o token é válido', () => {
    // Arrange
    const mockUser = { id: 123, user_type: 'admin' };
    req.headers.authorization = 'Bearer valid_token';
    jwt.verify.mockReturnValue(mockUser);
    
    // Act
    authMiddleware(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith('valid_token', 'test_secret');
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

});