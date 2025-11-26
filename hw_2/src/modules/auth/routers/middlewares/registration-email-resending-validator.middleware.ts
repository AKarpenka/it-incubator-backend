import { body } from "express-validator";

export const emailValidator = body('email')
    .isString()
    .withMessage('Email should be string')
    .notEmpty()
    .withMessage('Email shouldnt be empty')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Email should looks like example@example.com')

export const registrationEmailResendingValidatorMiddleware = [
    emailValidator
];