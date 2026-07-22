import { body } from "express-validator";

const newPasswordValidator = body('newPassword')
    .isString()
    .withMessage('password should be string')
    .trim()
    .notEmpty()
    .withMessage('password shouldnt be empty')
    .isLength({min: 6, max: 20})
    .withMessage('Count of symbols for Password sould be between 6 and 20')

const recoveryCodeValidator = body('recoveryCode')
    .isString()
    .withMessage('recoveryCode should be string')
    .trim()
    .notEmpty()
    .withMessage('recoveryCode shouldnt be empty')

export const newPasswordValidatorMiddleware = [
    newPasswordValidator,
    recoveryCodeValidator
]