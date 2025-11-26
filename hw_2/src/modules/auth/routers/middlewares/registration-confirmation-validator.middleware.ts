import { body } from "express-validator";

export const codeValidator = body('code')
    .isString()
    .withMessage('code should be string')
    .trim()
    .notEmpty()
    .withMessage('code shouldnt be empty')

export const registrationConfirmationValidatorMiddleware = [
    codeValidator
];