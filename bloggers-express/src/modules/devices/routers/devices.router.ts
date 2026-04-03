import { Router } from "express";
import { refreshTokenMiddleware } from "../../../middlewares/auth/refresh-token.middleware";
import { getDevicesHandler } from "./handlers/get-devices.handler";
import { deleteDeviceByIdHandler } from "./handlers/delete-device-by-id.handler";
import { deviceIdValidation } from "./middlewares/id-validators.middleware";
import { errorsResultMiddleware } from "../../../middlewares/validation/errors-result.middleware";
import { deleteAllDevicesHandler } from "./handlers/delete-all-devices.handler";

export const devicesRouter = Router();

devicesRouter
    .get(
        '/', 
        refreshTokenMiddleware,
        getDevicesHandler
    )

    .delete(
        '/:deviceId',
        refreshTokenMiddleware,
        deviceIdValidation,
        errorsResultMiddleware,
        deleteDeviceByIdHandler
    )

    // Удвлить все сессии, кроме текущей 
    .delete(
        '/',
        refreshTokenMiddleware,
        deleteAllDevicesHandler
    )