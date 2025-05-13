
const { validateRoomCreate } = require('../../../middlewares/roomValidation');
const { validationResult } = require('express-validator');
const httpMocks = require('node-mocks-http');

//mock espress-validator

jest.mock('express-validator', () => {
  const originalModule = jest.requireActual('express-validator');
  
  return {
    ...originalModule,
    body: jest.fn().mockImplementation((field) => {
      return {
        notEmpty: jest.fn().mockReturnThis(),
        isLength: jest.fn().mockReturnThis(),
        isAlphanumeric: jest.fn().mockReturnThis(),
        isIn: jest.fn().mockReturnThis(),
        isNumeric: jest.fn().mockReturnThis(),
        isInt: jest.fn().mockReturnThis(),
        isArray: jest.fn().mockReturnThis(),
        isString: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis()
      };
    }),
    validationResult: jest.fn()
  };
});