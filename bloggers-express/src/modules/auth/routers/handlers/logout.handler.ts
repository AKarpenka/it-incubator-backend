import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { devicesService } from '../../../../modules/devices/application/devices.service';
import { jwtService } from '../../../../core/adapters/jwt.service';

export async function logoutHandler(req: Request, res: Response) {
    try {
        const user = req.user;

        if(!user) {
            res
                .status(HttpStatus.Unauthorized)
                .json({});
        
            return;
        }

        if (req.refreshToken) {
            const currentRT = jwtService.decodePayloadToken<{deviceId: string}>(req.refreshToken);
            await devicesService.deleteDeviceByDeviceId(user.id.toString(), currentRT.deviceId);
        }

        res.clearCookie('refreshToken');
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}