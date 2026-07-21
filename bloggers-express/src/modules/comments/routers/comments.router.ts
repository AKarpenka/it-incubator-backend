import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { idValidation } from "../../../middlewares/validation/id-validators.middleware";
import { accessTokenMiddleware } from "../../../middlewares/auth/access-token.middleware";
import { commentsValidatorMiddleware } from "../middlewares/comments-validator.middleware";
import { CommentsController } from "./controller";
import { container } from "../../composition-root";


export const commentsRouter = Router();
const commensControllerInstance = container.get(CommentsController);

commentsRouter
    .get(
        '/:id', 
        idValidation, 
        errorsResultMiddleware, 
        commensControllerInstance.getCommentsByIdHandler.bind(commensControllerInstance)
    )

    .put('/:id', 
        accessTokenMiddleware, 
        idValidation,
        ...commentsValidatorMiddleware,
        errorsResultMiddleware,
        commensControllerInstance.updateCommentHandler.bind(commensControllerInstance)
    )

    .delete('/:id', 
        accessTokenMiddleware, 
        idValidation,
        errorsResultMiddleware,
        commensControllerInstance.deleteCommentByIdHandler.bind(commensControllerInstance)
    );