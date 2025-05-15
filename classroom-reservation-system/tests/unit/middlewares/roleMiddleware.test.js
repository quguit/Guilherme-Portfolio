
const permit = require('../../../middlewares/roleMiddleware'); 

describe('Middleware de Permissão de Papéis', () => {
  // Setup inicial para cada teste
  let req, res, next;

  beforeEach(() => {
    // Setup mock request, response, and next function
    req = {
      user: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  // Test case: Allow access for user with permitted role
  it('deve permitir acesso para usuário com papel permitido', () => {
    // Arrange
    req.user.type_user = 'admin';
    const roles = permit('admin', 'superadmin');
    // Act
    roles(req, res, next);
    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test case: Deny access for user with non-permitted role
  it('deve negar acesso quando o papel do usuário não é permitido', () => {
    // Arrange
    req.user.type_user = 'user';
    const roles = permit('admin', 'superadmin');
    // Act
    roles(req, res, next);
    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });

  // Test case: Multiple roles in permit function
  test('deve permitir acesso quando o usuário tem qualquer um dos papéis autorizados', () => {
    // Arrange
    req.user.type_user = 'editor';
    const middleware = permit('admin', 'editor', 'moderator');
    
    // Act
    middleware(req, res, next);
    
    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test case: Empty roles array should deny access to everyonde
  it('deve negar acesso a todos quando nenhum papel é autorizado', () => {
    // Arrange
    req.user.type_user = 'admin';
    const roles = permit();//no roles allowed
    // Act
    roles(req, res, next);
    // Assert
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado' });
  });

  // Test case: Check if middliware is creaed correctly
  it('deve retornar uma função middleware', () => {
    // act
    const middleware = permit('admin');
    // assert
    expect(typeof middleware).toBe('function');
    expect(middleware.length).toBe(3); // should accept 3 parameters (req, res, next)
  })

})