import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username harus 3-30 karakter'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email tidak valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email tidak valid'),
  body('password')
    .notEmpty()
    .withMessage('Password diperlukan'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validateSeries = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Judul wajib diisi'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Deskripsi minimal 10 karakter'),
  body('year')
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Tahun tidak valid'),
  body('genre')
    .isArray()
    .withMessage('Genre harus berupa array'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const validateEpisode = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Judul episode wajib diisi'),
  body('season')
    .isInt({ min: 1 })
    .withMessage('Season harus angka positif'),
  body('episode')
    .isInt({ min: 1 })
    .withMessage('Episode harus angka positif'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
