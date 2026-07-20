import { Router } from "express";
import { paginationAndSortingValidation } from "../../../middlewares/validation/pagination-sorting-validation.middleware";
import { UsersSortBy } from "../constants";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { usersValidatorMiddleware } from "./middlewares/users-validators.middleware";
import { idValidation } from "../../../middlewares/validation/id-validators.middleware";
import { UsersController } from "./controller";

export const usersRouter = Router();
const usersControllerInstance = new UsersController();

usersRouter
    .get(
        '/',
        authorizationMiddleware,
        paginationAndSortingValidation(UsersSortBy),
        errorsResultMiddleware,
        usersControllerInstance.getUsersHandler.bind(usersControllerInstance)
    )

    .post(
        '/',
        authorizationMiddleware,
        ...usersValidatorMiddleware,
        errorsResultMiddleware,
        usersControllerInstance.createUserHandler.bind(usersControllerInstance)
    )

    .delete(
        '/:id',
        authorizationMiddleware,
        idValidation,
        errorsResultMiddleware,
        usersControllerInstance.deleteUserHandler.bind(usersControllerInstance)
    )
