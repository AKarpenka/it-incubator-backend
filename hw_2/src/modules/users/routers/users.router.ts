import { Router } from "express";
import { paginationAndSortingValidation } from "../../../middlewares/validation/pagination-sorting-validation.middleware";
import { UsersSortBy } from "../constants";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { createUserHandler, deleteUserHandler, getUsersHandler } from "./handlers";
import { authorizationMiddleware } from "../../../middlewares/auth/basic-auth-middleware";
import { usersValidatorMiddleware } from "./middlewares/users-validators.middleware";
import { idValidation } from "../../../middlewares/validation/id-validators.middleware";

export const usersRouter = Router();

usersRouter
    .get(
        '/',
        authorizationMiddleware,
        paginationAndSortingValidation(UsersSortBy),
        errorsResultMiddleware,
        getUsersHandler
    )

    .post(
        '/',
        authorizationMiddleware,
        ...usersValidatorMiddleware,
        errorsResultMiddleware,
        createUserHandler
    )

    .delete(
        '/:id',
        authorizationMiddleware,
        idValidation,
        errorsResultMiddleware,
        deleteUserHandler
    )
