import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserId } from 'userId';
import { devicesService } from '../../application/devices.service';
import { jwtService } from '../../../../core/adapters/jwt.service';

export async function deleteAllDevicesHandler(req: Request<{}, {}, {}, {}, TUserId>, res: Response) {
    try {
        const user = req.user;

        const currentRT = req.cookies.refreshToken;
        const verifiedRefreshToken = jwtService.verifyRefreshToken(currentRT);

        if(!user || !verifiedRefreshToken || !verifiedRefreshToken.userId) {
            res
                .status(HttpStatus.Unauthorized)
                .json({});
        
            return;
        }

        await devicesService.deleteAllDevices(user.id.toString(), verifiedRefreshToken.deviceId);

        res
            .sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}