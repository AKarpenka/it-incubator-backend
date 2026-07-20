import { idValidation } from './../../../middlewares/validation/id-validators.middleware';
import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { postsValidatorMiddleware } from './middlewares/posts-validators.middleware';
import { paginationAndSortingValidation } from '../../../middlewares/validation/pagination-sorting-validation.middleware';
import { PostsSortBy } from '../constants';
import { commentsByPostsValidatorMiddleware } from './middlewares/comments-by-posts-validators.middleware';
import { accessTokenMiddleware } from '../../../middlewares/auth/access-token.middleware';
import { CommentsSortBy } from '../../../modules/comments/constants';
import { PostsController } from './controller';

export const postsRouter = Router();
const postsControllerInstance = new PostsController();

postsRouter
    .get(
        '/:id/comments', 
        idValidation,
        paginationAndSortingValidation(CommentsSortBy),
        errorsResultMiddleware,
        postsControllerInstance.getCommentsForPostsHandler.bind(postsControllerInstance)
    )
    .get('/:id', idValidation, errorsResultMiddleware, postsControllerInstance.getPostByIdHandler.bind(postsControllerInstance))
    .get(
        '/', 
        paginationAndSortingValidation(PostsSortBy),
        errorsResultMiddleware,
        postsControllerInstance.getPostsHandler.bind(postsControllerInstance)
    )

    .delete('/:id', 
        authorizationMiddleware, 
        idValidation,
        errorsResultMiddleware,
        postsControllerInstance.deletePostByIdHandler.bind(postsControllerInstance)
    )

    .post('/:id/comments', 
        accessTokenMiddleware,
        idValidation,
        ...commentsByPostsValidatorMiddleware,
        errorsResultMiddleware,
        postsControllerInstance.createCommentByPostHandler.bind(postsControllerInstance)
    )
    .post('/', 
        authorizationMiddleware, 
        ...postsValidatorMiddleware,
        errorsResultMiddleware,
        postsControllerInstance.createPostHandler.bind(postsControllerInstance)
    )

    .put('/:id', 
        authorizationMiddleware, 
        idValidation,
        ...postsValidatorMiddleware,
        errorsResultMiddleware,
        postsControllerInstance.updatePostByIdHandler.bind(postsControllerInstance)
    );