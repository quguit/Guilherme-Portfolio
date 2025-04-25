
const { body, validationResult } = require('express-validator');

exports.validateRoomCreate = [
    body('number')
        .notEmpty().withMessage('Número da sala não pode ser vazio')
        .isLength({min: 1}).withMessage('Número da sala deve ter pelo menos 1 caractere')
        .isLength({max: 10}).withMessage('Número da sala deve ter no máximo 10 caracteres')
        .isAlphanumeric().withMessage('Número da sala deve conter apenas letras e números'),

    body('type')
        .notEmpty().withMessage('Tipo de sala não pode ser vazio')
        .isIn(['classroom', 'laboratory']).withMessage('Tipo de sala inválido'),

    body('capacity')
        .notEmpty().withMessage('Capacidade não pode ser vazia')
        .isNumeric().withMessage('Capacidade deve ser um número')
        .isInt({ min: 1, max: 100 }).withMessage('Capacidade deve ser entre 1 e 100'),
    body('resources')
        .optional()
        .isArray().withMessage('Recursos devem ser um array'),
    body('status_clean')
        .optional()
        .isIn(['clean', 'dirty', 'cleaning']).withMessage('Status de limpeza inválido'),
    body('observations')
        .optional()
        .isString().withMessage('Observações devem ser uma string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];