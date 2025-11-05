import { idValidation } from './../../../middlewares/validation/id-validators.middleware';
import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { postsValidatorMiddleware } from './middlewares/posts-validators.middleware';
import { createPostHandler, deletePostByIdHandler, getPostByIdHandler, getPostsHandler, updatePostByIdHandler } from './handlers';
import { paginationAndSortingValidation } from '../../../middlewares/validation/pagination-sorting-validation.middleware';
import { PostsSortBy } from '../constants';

export const postsRouter = Router();

postsRouter
    .get('/:id', idValidation, errorsResultMiddleware, getPostByIdHandler)
    .get(
        '/', 
        paginationAndSortingValidation(PostsSortBy),
        errorsResultMiddleware,
        getPostsHandler
    )

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