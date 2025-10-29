import { idValidation } from './../../../middlewares/validation/id-validators.middleware';
import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { postsValidatorMiddleware } from './middlewares/posts-validators.middleware';
import { createPostHandler, deletePostByIdHandler, getPostByIdHandler, getPostsHandler, updatePostByIdHandler } from './handlers';

export const postsRouter = Router();

postsRouter
    .get('/', getPostsHandler)
    .get('/:id', idValidation, errorsResultMiddleware, getPostByIdHandler)

    .delete('/:id', 
        authorizationMiddleware, 
        idValidation,
        errorsResultMiddleware,
        deletePostByIdHandler
    )

    .post('/', 
        authorizationMiddleware, 
        ...postsValidatorMiddleware,
        errorsResultMiddleware,
        createPostHandler
    )

    .put('/:id', 
        authorizationMiddleware, 
        idValidation,
        ...postsValidatorMiddleware,
        errorsResultMiddleware,
        updatePostByIdHandler
    );