const { validateRegister, validateResetPassword} = require('../../../middlewares/userValidation');
const { validateResult } = require('express-validator');

//mock validateResult
jest.mock('express-validator', () => ({
    body: jest.fn().mockImplementation(field => {
        const chainMethods = {
            notEmpty: () => chainMethods,
            isLength: () => chainMethods,
            matches: () => chainMethods,
            isEmail: () => chainMethods,
            isIn: () => chainMethods,
            custon: jest.fn(fn => {
                chainMethods.customValidator = fn;
                return chainMethods;
            }),
            withMessage: () => chainMethods,
        };
        return chainMethods;
    }),
    validationResult: jest.fn()
}));