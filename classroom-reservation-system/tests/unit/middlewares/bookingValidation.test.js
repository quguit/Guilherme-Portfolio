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

describe('Booking Validation Middleware', () => {

  //Testbase: check if all required validations are set up
  it('deve conter validações para room_id, start_time, end_time e purpose', () => {
    // the validateBookingCreate should be an array of middleware functions
    expect(Array.isArray(validateBookingCreate)).toBe(true);

    // validate array lenght (should have 5 items: 4 field validations + 1 error handler)
    expect(validateBookingCreate.length).toBe(5);

    // Check that the body function was called for each required field
    const { body } = require('express-validator');
    expect(body).toHaveBeenCalledTimes(4);
  });

  // Test case: Error handler middleware returns 400 when validation errors exist
  it('deve retornar status 400 com errors quando a validação falhar', () => {
    // Arrange
    const req = {};
    const res = {
      status:jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    //mock errors
    const mockErrors = {
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([
        {param: 'room_id', msg: 'Room ID is required'},
        {param: 'start_time', msg: 'Start time is required'},
        {param: 'end_time', msg: 'End time is required'},
        {param: 'purpose', msg: 'Purpose is required'}
      ])
    };
    validationResult.mockReturnValue(mockErrors);

    // act - call the erorhandler (last middleware in the array)
    const errorHandler = validateBookingCreate[validateBookingCreate.length - 1];
    errorHandler(req, res, next);

    // Assert
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(mockErrors.isEmpty).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erros: [
        {param: 'room_id', msg: 'Room ID is required'},
        {param: 'start_time', msg: 'Start time is required'},
        {param: 'end_time', msg: 'End time is required'},
        {param: 'purpose', msg: 'Purpose is required'}
      ]
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Test case: Error handler middleware calls next() when no validation erors
  it('deve chamar next() quando não houver errors de validação', () => {
    // Arrange
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    //mock no errors
    const mockErrors = {
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn()
    };
    validationResult.mockReturnValue(mockErrors);

    // Act - call the error handler (last middleware in the array)
    const errorHandler = validateBookingCreate[validateBookingCreate.length - 1];
    errorHandler(req, res, next);

    // Assert
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(mockErrors.isEmpty).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});