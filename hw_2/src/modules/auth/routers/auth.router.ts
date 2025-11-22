/**
 * Аутентификация с токеном для работы с данными users (login, logout)
 */

import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { loginValidatorMiddleware } from "./middlewares/login-validators.middleware";
import { getCurrentUserHandler, loginHandler } from "./handlers";
import { accessTokenMiddleware } from "../../../middlewares/auth/access-token.middleware";

export const authRouter = Router();

authRouter
    .post(
        '/login',
        ...loginValidatorMiddleware,
        errorsResultMiddleware,
        loginHandler
    )

    .get(
        '/me',
        accessTokenMiddleware,
        getCurrentUserHandler

    )