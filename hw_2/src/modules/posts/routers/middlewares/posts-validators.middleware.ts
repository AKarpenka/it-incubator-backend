import { body } from "express-validator";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";

export const postTitleValidator = body('title')
    .isString()
    .withMessage('The field title should be string')
    .trim()
    .notEmpty()
    .withMessage('The field title should not be empty')
    .isLength({min: 1, max: 30})
    .withMessage('The title should not be more then 30 symbols')

export const postShortDescriptionValidator = body('shortDescription')
    .isString()
    .withMessage('The field shortDescription should be string')
    .trim()
    .notEmpty()
    .withMessage('The field shortDescription should not be empty')
    .isLength({min: 1, max: 100})
    .withMessage('The shortDescription should not be more then 100 symbols')

export const postContentValidator = body('content')
    .isString()
    .withMessage('The field content should be string')
    .trim()
    .notEmpty()
    .withMessage('The field content should not be empty')
    .isLength({min: 1, max: 1000})
    .withMessage('The content should not be more then 1000 symbols')

export const postBlogIdValidator = body('blogId')
    .isString()
    .withMessage('The field blogId should be string')
    .trim()
    .notEmpty()
    .withMessage('The field blogId should not be empty')
    .custom(async (blogId) => {
        const blog = await blogsRepository.getBlogById(blogId);

        if (!blog) {
            throw new Error('no blog');
        }

        return true;
    })
    .withMessage('no blog')

export const postsValidatorMiddleware = [
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
];