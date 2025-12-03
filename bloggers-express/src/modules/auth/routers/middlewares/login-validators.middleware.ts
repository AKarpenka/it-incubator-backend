import { body } from "express-validator";

export const loginOrEmailValidator = body('loginOrEmail')
    .isString()
    .withMessage('loginOrEmail should be string')
    .trim()
    .notEmpty()
    .withMessage('loginOrEmail shouldnt be empty')

export const passwordValidator = body('password')
    .isString()
    .withMessage('password should be string')
    .trim()
    .notEmpty()
    .withMessage('password shouldnt be empty')
    .isLength({min: 6, max: 20})
    .withMessage('Count of symbols for Password sould be between 6 and 20')

export const loginValidatorMiddleware = [
    loginOrEmailValidator,
    passwordValidator,
];