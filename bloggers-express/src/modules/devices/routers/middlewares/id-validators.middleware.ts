import { param } from 'express-validator';

export const deviceIdValidation = param('deviceId')
  .exists()
  .withMessage('ID is required') 
  .isString()
  .withMessage('ID must be a string');