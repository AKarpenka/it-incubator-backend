import { Router, Request, Response } from "express";
import { blogsValidatorMiddleware } from "./middlewares/blogs-validators.middleware";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { createBlogHandler, deleteBlogByIdHandler, getBlogsByIdHandler, getBlogsHandler, updateBlogByIdHandler } from "./handlers";
import { idValidation } from "../../../middlewares/validation/id-validators.middleware";

export const blogsRouter = Router();

blogsRouter
    .get('/', getBlogsHandler)
    .get('/:id', idValidation, errorsResultMiddleware, getBlogsByIdHandler)

    .delete('/:id', 
        authorizationMiddleware,
        idValidation,
        errorsResultMiddleware,
        deleteBlogByIdHandler,
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
