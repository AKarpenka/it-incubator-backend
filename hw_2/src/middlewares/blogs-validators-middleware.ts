import { body } from "express-validator";

export const blogNameValidator = body('name')
    .isString()
    .withMessage('This field name shoud be string')
    .trim()
    .notEmpty()
    .withMessage('This field name shouldnt be empty')
    .isLength({min: 1, max: 15})
    .withMessage('The name shouldnt be more then 15 symbols')

export const blogDescriptionValidator = body('description')
    .isString()
    .withMessage('This field description shoud be string')
    .trim()
    .notEmpty()
    .withMessage('This field description shouldnt be empty')
    .isLength({min: 1, max: 500})
    .withMessage('The description shouldnt be more then 500 symbols')

export const blogWebsiteUrlValidator = body('websiteUrl')
    .isString()
    .withMessage('This field websiteUrl shoud be string')
    .trim()
    .notEmpty()
    .withMessage('This field websiteUrl shouldnt be empty')
    .isLength({min: 1, max: 100})
    .withMessage('The websiteUrl shouldnt be more then 100 symbols')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('The websiteUrl should be real link')

export const blogsValidatorMiddleware = [
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
];