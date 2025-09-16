const { body, validationResult } = require('express-validator');

// Tweet creation validation middleware
const validateTweet = [
  body('content')
    .notEmpty().withMessage('O conteúdo do tweet é obrigatório')
    .isLength({ max: 280 }).withMessage('O tweet não pode ter mais que 280 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = { validateTweet };
