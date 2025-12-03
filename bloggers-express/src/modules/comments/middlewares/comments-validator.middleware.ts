import { body } from "express-validator";

export const commentContentValidator = body('content')
    .isString()
    .withMessage('content should be string')
    .trim()
    .notEmpty()
    .withMessage('content should not be empty')
    .isLength({min: 20, max: 300})
    .withMessage('content should not be more then 30 symbols')

export const commentsValidatorMiddleware = [
    commentContentValidator
];
