import { Router } from "express";
import { refreshTokenMiddleware } from "../../../middlewares/auth/refresh-token.middleware";
import { deviceIdValidation } from "./middlewares/id-validators.middleware";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { DevicesController } from "./controller";
import { container } from "../../composition-root";

export const devicesRouter = Router();
const devicesControllerInstance = container.get(DevicesController);

devicesRouter
    .get(
        '/', 
        refreshTokenMiddleware,
        devicesControllerInstance.getDevicesHandler.bind(devicesControllerInstance)
    )

    .delete(
        '/:deviceId',
        refreshTokenMiddleware,
        deviceIdValidation,
        errorsResultMiddleware,
        devicesControllerInstance.deleteDeviceByIdHandler.bind(devicesControllerInstance)
    )

    // Удвлить все сессии, кроме текущей 
    .delete(
        '/',
        refreshTokenMiddleware,
        devicesControllerInstance.deleteAllDevicesHandler.bind(devicesControllerInstance)
    )