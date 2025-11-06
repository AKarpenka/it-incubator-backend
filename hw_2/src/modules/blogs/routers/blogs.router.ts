import { Router } from "express";
import { blogsValidatorMiddleware } from "./middlewares/blogs-validators.middleware";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { createPostByBlogHandler, createBlogHandler, deleteBlogByIdHandler, getBlogsByIdHandler, getBlogsHandler, getPostsByBlogHandler, updateBlogByIdHandler } from "./handlers";
import { idValidation } from "../../../middlewares/validation/id-validators.middleware";
import { paginationAndSortingValidation } from "../../../middlewares/validation/pagination-sorting-validation.middleware";
import { BlogsSortBy } from "../constants";
import { postsByBlogValidatorMiddleware } from "./middlewares/posts-by-blog-validators.middleware";
import { PostsSortBy } from "../../posts/constants";

export const blogsRouter = Router();

blogsRouter
    .get('/:id/posts', idValidation, paginationAndSortingValidation(PostsSortBy), errorsResultMiddleware, getPostsByBlogHandler)
    .get('/:id', idValidation, errorsResultMiddleware, getBlogsByIdHandler)
    .get(
        '/',  
        paginationAndSortingValidation(BlogsSortBy), 
        errorsResultMiddleware,
        getBlogsHandler
    )

    .delete('/:id', 
        authorizationMiddleware,
        idValidation,
        errorsResultMiddleware,
        deleteBlogByIdHandler,
    )

    .post('/:id/posts', 
        authorizationMiddleware, 
        idValidation,
        ...postsByBlogValidatorMiddleware,
        errorsResultMiddleware,
        createPostByBlogHandler,
    )
    .post('/', 
        authorizationMiddleware, 
        ...blogsValidatorMiddleware,
        errorsResultMiddleware,
        createBlogHandler
    )

    .put('/:id', 
        authorizationMiddleware, 
        idValidation,
        ...blogsValidatorMiddleware,
        errorsResultMiddleware,
        updateBlogByIdHandler
    );
