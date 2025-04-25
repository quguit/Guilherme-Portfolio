const { cody, validationResult, body } = require('express-validator');

exports.validateBookingCreate = [
    body('room_id')
        .notEmpty().withMessage('ID da sala é obrigatório')
        .isMongoId().withMessage('ID da sala deve ser um ID válido do MongoDB'),

    body('start_time')
        .notEmpty().withMessage('Horário de início é obrigatório')
        .isISO8601().withMessage('Formato de data/hora inválido'),
    
    body('end_time')
        .notEmpty().withMessage('Horário de término é obrigatório')
        .isISO8601().withMessage('Formato de data/hora inválido'),
    
    body('purpose')
        .notEmpty().withMessage('Finalidade da reserva é obrigatória')
        .isLength({ min: 3 }).withMessage('Finalidade deve ter pelo menos 3 caracteres'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ erros: errors.array() });
        }
        next();
    }
];