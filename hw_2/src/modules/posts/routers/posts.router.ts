import { idValidation } from './../../../middlewares/validation/id-validators.middleware';
import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { postsValidatorMiddleware } from './middlewares/posts-validators.middleware';
import { createCommentByPostHandler, createPostHandler, deletePostByIdHandler, getCommentsForPostsHandler, getPostByIdHandler, getPostsHandler, updatePostByIdHandler } from './handlers';
import { paginationAndSortingValidation } from '../../../middlewares/validation/pagination-sorting-validation.middleware';
import { PostsSortBy } from '../constants';
import { commentsByPostsValidatorMiddleware } from './middlewares/comments-by-posts-validators.middleware';
import { accessTokenMiddleware } from '../../../middlewares/auth/access-token.middleware';
import { CommentsSortBy } from '../../../modules/comments/constants';

export const postsRouter = Router();

postsRouter
    .get(
        '/:id/comments', 
        idValidation,
        paginationAndSortingValidation(CommentsSortBy),
        errorsResultMiddleware,
        getCommentsForPostsHandler
    )
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

    .post('/:id/comments', 
        accessTokenMiddleware,
        idValidation,
        ...commentsByPostsValidatorMiddleware,
        errorsResultMiddleware,
        createCommentByPostHandler
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