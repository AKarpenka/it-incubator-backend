import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { idValidation } from "../../../middlewares/validation/id-validators.middleware";
import { deleteCommentByIdHandler, getCommentsByIdHandler, updateCommentHandler } from "./handlers";
import { accessTokenMiddleware } from "../../../middlewares/auth/access-token.middleware";
import { commentsValidatorMiddleware } from "../middlewares/comments-validator.middleware";

export const commentsRouter = Router();

commentsRouter
    .get(
        '/:id', 
        idValidation, 
        errorsResultMiddleware, 
        getCommentsByIdHandler
    )

    .put('/:id', 
        accessTokenMiddleware, 
        idValidation,
        ...commentsValidatorMiddleware,
        errorsResultMiddleware,
        updateCommentHandler
    )

    .delete('/:id', 
        accessTokenMiddleware, 
        idValidation,
        errorsResultMiddleware,
        deleteCommentByIdHandler
    );