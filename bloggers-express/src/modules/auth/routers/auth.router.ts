/**
 * Аутентификация с токеном для работы с данными users (login, logout)
 */

import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { loginValidatorMiddleware } from "./middlewares/login-validators.middleware";
import { getCurrentUserHandler, loginHandler, registartionHandler, registrationConfirmationHandler, registrationEmailResendingHandler } from "./handlers";
import { accessTokenMiddleware } from "../../../middlewares/auth/access-token.middleware";
import { usersValidatorMiddleware } from "../../../modules/users/routers/middlewares/users-validators.middleware";
import { registrationConfirmationValidatorMiddleware } from "./middlewares/registration-confirmation-validator.middleware";
import { registrationEmailResendingValidatorMiddleware } from "./middlewares/registration-email-resending-validator.middleware";

export const authRouter = Router();

authRouter
    .post(
        '/login',
        ...loginValidatorMiddleware,
        errorsResultMiddleware,
        loginHandler
    )

    .post(
        '/registration',
        ...usersValidatorMiddleware,
        errorsResultMiddleware,
        registartionHandler 
    )

    .post(
        '/registration-confirmation',
        ...registrationConfirmationValidatorMiddleware,
        errorsResultMiddleware,
        registrationConfirmationHandler 
    )
    
    .post(
        '/registration-email-resending',
        ...registrationEmailResendingValidatorMiddleware,
        errorsResultMiddleware,
        registrationEmailResendingHandler 
    )

    .get(
        '/me',
        accessTokenMiddleware,
        getCurrentUserHandler
    )