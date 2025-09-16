const { body, validationResult } = require('express-validator');

// Password must contain at least one uppercase letter and one number
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;

// Registration and login validation middleware
const validateRegister = [
  body('username').notEmpty().withMessage('Username é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 7 }).withMessage('Senha deve ter no mínimo 7 caracteres')
    .matches(passwordRegex)
    .withMessage('Senha deve conter pelo menos uma letra maiúscula e um número'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = { validateRegister, validateLogin };