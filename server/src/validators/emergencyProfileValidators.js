const { body } = require('express-validator');

const emergencyProfileValidators = [
  body('bloodGroup').optional().trim().isLength({ max: 20 }),
  body('allergies').optional().trim().isLength({ max: 2000 }),
  body('medicalConditions').optional().trim().isLength({ max: 2000 }),
  body('medications').optional().trim().isLength({ max: 2000 }),
  body('guardianPhone').optional().trim().isLength({ max: 20 }),
  body('secondaryPhone').optional().trim().isLength({ max: 20 }),
  body('emergencyNote').optional().trim().isLength({ max: 1000 }),
  body('age').optional().isInt({ min: 0, max: 150 }).toInt(),
  body('language').optional().trim().isLength({ max: 50 }),
  body('organDonor').optional().isBoolean().toBoolean(),
];

module.exports = { emergencyProfileValidators };
