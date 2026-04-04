/**
 * Аутентификация с токеном для работы с данными users (login, logout)
 */

import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { loginValidatorMiddleware } from "./middlewares/login-validators.middleware";
import { getCurrentUserHandler, loginHandler, registartionHandler, registrationConfirmationHandler, registrationEmailResendingHandler, refreshTokenHandler, logoutHandler } from "./handlers";
import { accessTokenMiddleware } from "../../../middlewares/auth/access-token.middleware";
import { refreshTokenMiddleware } from "../../../middlewares/auth/refresh-token.middleware";
import { usersValidatorMiddleware } from "../../../modules/users/routers/middlewares/users-validators.middleware";
import { registrationConfirmationValidatorMiddleware } from "./middlewares/registration-confirmation-validator.middleware";
import { registrationEmailResendingValidatorMiddleware } from "./middlewares/registration-email-resending-validator.middleware";
import { rateLimitMiddleware } from "../../../middlewares/rateLimit/rate-limit.middleware";

export const authRouter = Router();

authRouter
    .post(
        '/login',
        rateLimitMiddleware,
        ...loginValidatorMiddleware,
        errorsResultMiddleware,
        loginHandler
    )

    .post(
        '/refresh-token',
        refreshTokenMiddleware,
        refreshTokenHandler
    )

    .post(
        '/registration',
        rateLimitMiddleware,
        ...usersValidatorMiddleware,
        errorsResultMiddleware,
        registartionHandler 
    )

    .post(
        '/registration-confirmation',
        rateLimitMiddleware,
        ...registrationConfirmationValidatorMiddleware,
        errorsResultMiddleware,
        registrationConfirmationHandler 
    )
    
    .post(
        '/registration-email-resending',
        rateLimitMiddleware,
        ...registrationEmailResendingValidatorMiddleware,
        errorsResultMiddleware,
        registrationEmailResendingHandler 
    )

    .post(
        '/logout',
        refreshTokenMiddleware,
        logoutHandler 
    )

    .get(
        '/me',
        accessTokenMiddleware,
        getCurrentUserHandler
    )