/**
 * Аутентификация с токеном для работы с данными users (login, logout)
 */

import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { loginValidatorMiddleware } from "./middlewares/login-validators.middleware";
import { loginHandler } from "./handlers";

export const authRouter = Router();

authRouter
    .post(
        '/login',
        ...loginValidatorMiddleware,
        errorsResultMiddleware,
        loginHandler
    )