import { Router } from "express";
import { blogsValidatorMiddleware } from "./middlewares/blogs-validators.middleware";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { BlogsController } from "./controller";
import { idValidation } from "../../../middlewares/validation/id-validators.middleware";
import { paginationAndSortingValidation } from "../../../middlewares/validation/pagination-sorting-validation.middleware";
import { BlogsSortBy } from "../constants";
import { postsByBlogValidatorMiddleware } from "./middlewares/posts-by-blog-validators.middleware";
import { PostsSortBy } from "../../posts/constants";
import { ioc } from "./composition-root";

export const blogsRouter = Router();
const blogsControllerInstance = ioc.getInstance<BlogsController>(BlogsController)

blogsRouter
    .get(
        '/:id/posts', 
        idValidation, 
        paginationAndSortingValidation(PostsSortBy), 
        errorsResultMiddleware, 
        blogsControllerInstance.getPostsByBlogHandler.bind(blogsControllerInstance)
    )
    .get('/:id', idValidation, errorsResultMiddleware, blogsControllerInstance.getBlogsByIdHandler.bind(blogsControllerInstance))
    .get(
        '/',  
        paginationAndSortingValidation(BlogsSortBy), 
        errorsResultMiddleware,
        blogsControllerInstance.getBlogsHandler.bind(blogsControllerInstance)
    )

    .delete('/:id', 
        authorizationMiddleware,
        idValidation,
        errorsResultMiddleware,
        blogsControllerInstance.deleteBlogByIdHandler.bind(blogsControllerInstance),
    )

    .post('/:id/posts', 
        authorizationMiddleware, 
        idValidation,
        ...postsByBlogValidatorMiddleware,
        errorsResultMiddleware,
        blogsControllerInstance.createPostByBlogHandler.bind(blogsControllerInstance),
    )
    .post('/', 
        authorizationMiddleware, 
        ...blogsValidatorMiddleware,
        errorsResultMiddleware,
        blogsControllerInstance.createBlogHandler.bind(blogsControllerInstance), 
    )

    .put('/:id', 
        authorizationMiddleware, 
        idValidation,
        ...blogsValidatorMiddleware,
        errorsResultMiddleware,
        blogsControllerInstance.updateBlogByIdHandler.bind(blogsControllerInstance),
    );
