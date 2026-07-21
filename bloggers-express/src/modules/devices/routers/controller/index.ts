import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserId } from '@shared/userId';
import { JwtService } from '../../../../core/adapters/jwt.service';
import { DevicesService } from '../../application/devices.service';
import { Statuses } from '../../../../core/types/resultStasuses';
import { mapToDevicesViewModel } from '../mappers/map-to-devices-view-model.utils';
import { inject, injectable } from 'inversify';

@injectable()
export class DevicesController {
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(DevicesService) protected devicesService: DevicesService,
    ) {}

    async deleteAllDevicesHandler(req: Request<{}, {}, {}, {}, TUserId>, res: Response) {
        try {
            const user = req.user;

            const currentRT = req.cookies.refreshToken;
            const verifiedRefreshToken = this.jwtService.verifyRefreshToken(currentRT);

            if(!user || !verifiedRefreshToken || !verifiedRefreshToken.userId) {
                res
                    .status(HttpStatus.Unauthorized)
                    .json({});
            
                return;
            }

            await this.devicesService.deleteAllDevices(user.id.toString(), verifiedRefreshToken.deviceId);

            res
                .sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async deleteDeviceByIdHandler(req: Request<{ deviceId: string }, {}, {}, {}, TUserId>, res: Response) {
        try {
            const user = req.user;
    
             if(!user) {
                res
                    .status(HttpStatus.Unauthorized)
                    .json({});
            
                return;
            }
    
            const result  = await this.devicesService.deleteDeviceByDeviceId(user.id.toString(), req.params.deviceId);
    
            switch (result.status) {
                case Statuses.NotFound: {
                    res
                        .status(HttpStatus.NotFound)
                        .send(result.extensions);
                    
                    return;    
                }
    
                case Statuses.Forbidden: {
                    res
                        .status(HttpStatus.Forbidden)
                        .send(result.extensions);
                        
                    return;
                }        
            }
    
            res
                .sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }

    async getDevicesHandler(req: Request<{}, {}, {}, {}, TUserId>, res: Response) {
        try {
            const user = req.user;
    
            if(!user) {
                res
                    .status(HttpStatus.Unauthorized)
                    .json({});
            
                return;
            }
    
            const { devices, totalCount } = await this.devicesService.getDevicesByUserId(user.id.toString());
    
            const devicesViewModel = mapToDevicesViewModel(devices);
    
            res
                .status(HttpStatus.Ok)
                .json(devicesViewModel);
        } catch (e: unknown) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    }
}