// bookingValidator.test.js
const { validationResult } = require('express-validator');
const { validateBookingCreate } = require('../../../middlewares/bookingValidation'); 

// Mock do express-validator
jest.mock('express-validator', () => {
  // Create a mock for validationResult
  const validationResult = jest.fn();
  
  // Create a mock for body validation chain
  const bodyChain = {
    notEmpty: () => bodyChain,
    withMessage: () => bodyChain,
    isMongoId: () => bodyChain,
    isISO8601: () => bodyChain,
    isLength: () => bodyChain
  };
  
  // Create a mock for body function
  const body = jest.fn().mockReturnValue(bodyChain);
  
  return {
    validationResult,
    body
  };
});