import { body } from "express-validator";

export const postContentValidator = body('content')
    .isString()
    .withMessage('The field content should be string')
    .trim()
    .notEmpty()
    .withMessage('The field content should not be empty')
    .isLength({min: 20, max: 300})
    .withMessage('The content should be beetween 20 and 300 symbols')

export const commentsByPostsValidatorMiddleware = [
    postContentValidator
];