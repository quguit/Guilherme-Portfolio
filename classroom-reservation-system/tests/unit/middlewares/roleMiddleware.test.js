
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
})