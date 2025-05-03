const {body, validationResult } = require('express-validator');

// Regras comuns para senha
const passwordRules = () => [
  body('new_password')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 8 }).withMessage('Senha deve ter pelo menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('A senha deve conter pelo menos uma letra maiúscula')
    .matches(/[0-9]/).withMessage('A senha deve conter pelo menos um número')
    .matches(/[\W_]/).withMessage('A senha deve conter pelo menos um caractere especial'),

  body('confirm_password')
    .notEmpty().withMessage('Confirmação de senha é obrigatória')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('As senhas não coincidem');
      }
      return true;
    })
];


exports.validateRegister = [
    body('name')
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ min: 3}).withMessage('Nome deve ter pelo menos 3 caracteres'),

    body('email')
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido'),

    ...passwordRules(),

    body('type_user')
        .notEmpty().withMessage('Tipo de usuário é obrigatório')
        .isIn(['student', 'teacher', 'servant']).withMessage('Tipo de usuário é obrigatório'),

    body('identification')
        .notEmpty().withMessage('Identificação é obrigatoria'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ erros: errors.array() });
        }
        next();
    }
];

exports.validateResetPassword = [
  
    ...passwordRules(),
    
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ erros: errors.array() });
      }
      next();
    }
  ];
  

  