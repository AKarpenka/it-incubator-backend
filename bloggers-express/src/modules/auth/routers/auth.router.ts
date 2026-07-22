/**
 * Аутентификация с токеном для работы с данными users (login, logout)
 */
import { Router } from "express";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { AuthController } from "./controller";
import { accessTokenMiddleware } from "../../../middlewares/auth/access-token.middleware";
import { refreshTokenMiddleware } from "../../../middlewares/auth/refresh-token.middleware";
import { usersValidatorMiddleware } from "../../../modules/users/routers/middlewares/users-validators.middleware";
import { rateLimitMiddleware } from "../../../middlewares/rateLimit/rate-limit.middleware";
import { container } from "../../composition-root";
import { 
    loginValidatorMiddleware, 
    newPasswordValidatorMiddleware, 
    passwordRecoveryValidatorMiddleware, 
    registrationConfirmationValidatorMiddleware, 
    registrationEmailResendingValidatorMiddleware 
} from "./middlewares";

export const authRouter = Router();
const authControllerInstance = container.get(AuthController);

authRouter
    .post(
        '/login',
        rateLimitMiddleware,
        ...loginValidatorMiddleware,
        errorsResultMiddleware,
        authControllerInstance.loginHandler.bind(authControllerInstance)
    )

    .post(
        '/refresh-token',
        refreshTokenMiddleware,
        authControllerInstance.refreshTokenHandler.bind(authControllerInstance)
    )

    .post(
        '/registration',
        rateLimitMiddleware,
        ...usersValidatorMiddleware,
        errorsResultMiddleware,
        authControllerInstance.registartionHandler.bind(authControllerInstance) 
    )

    .post(
        '/registration-confirmation',
        rateLimitMiddleware,
        ...registrationConfirmationValidatorMiddleware,
        errorsResultMiddleware,
        authControllerInstance.registrationConfirmationHandler.bind(authControllerInstance) 
    )
    
    .post(
        '/registration-email-resending',
        rateLimitMiddleware,
        ...registrationEmailResendingValidatorMiddleware,
        errorsResultMiddleware,
        authControllerInstance.registrationEmailResendingHandler.bind(authControllerInstance) 
    )

    .post(
        '/password-recovery',
        rateLimitMiddleware,
        ...passwordRecoveryValidatorMiddleware,
        errorsResultMiddleware,
        authControllerInstance.passwordRecoveryHandler.bind(authControllerInstance) 
    )

    .post(
        '/new-password',
        rateLimitMiddleware,
        ...newPasswordValidatorMiddleware,
        errorsResultMiddleware,
        authControllerInstance.newPasswordHandler.bind(authControllerInstance) 
    )

    .post(
        '/logout',
        refreshTokenMiddleware,
        authControllerInstance.logoutHandler.bind(authControllerInstance) 
    )

    .get(
        '/me',
        accessTokenMiddleware,
        authControllerInstance.getCurrentUserHandler.bind(authControllerInstance)
    )