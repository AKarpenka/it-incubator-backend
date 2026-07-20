import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/httpStatuses";
import { JwtService } from "../../core/adapters/jwt.service";
import { DevicesQueryRepository } from "../../modules/devices/repositories/devices.query-repository";

function refreshTokenIatMatchesDevice(lastActiveDate: string, tokenIatSec: number): boolean {
    const deviceIatSec = Math.floor(Date.parse(lastActiveDate) / 1000);
    return deviceIatSec === tokenIatSec;
}

const devicesQueryRepository = new DevicesQueryRepository();
const jwtService = new JwtService();

// ???
export const refreshTokenMiddleware = async (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    const refreshToken = req.cookies?.refreshToken as string;

    if (!refreshToken) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    const verifiedRefreshToken = jwtService.verifyRefreshToken(refreshToken);

    if(!verifiedRefreshToken || !verifiedRefreshToken.userId) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    const device = await devicesQueryRepository.getDeviceByParams({
        userId: verifiedRefreshToken.userId,
        deviceId: verifiedRefreshToken.deviceId,
    });

    if (!device) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    if (!refreshTokenIatMatchesDevice(device.lastActiveDate, verifiedRefreshToken.iat)) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    req.user = { id: verifiedRefreshToken.userId };
    req.refreshToken = refreshToken;

    next();
}
