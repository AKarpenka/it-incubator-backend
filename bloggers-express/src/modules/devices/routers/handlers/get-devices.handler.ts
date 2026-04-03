import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserId } from 'userId';
import { devicesService } from '../../application/devices.service';
import { mapToDevicesViewModel } from '../mappers/map-to-devices-view-model.utils';

export async function getDevicesHandler(req: Request<{}, {}, {}, {}, TUserId>, res: Response) {
    try {
        const user = req.user;

        if(!user) {
            res
                .status(HttpStatus.Unauthorized)
                .json({});
        
            return;
        }

        const { devices, totalCount } = await devicesService.getDevicesByUserId(user.id.toString());

        const devicesViewModel = mapToDevicesViewModel(devices);

        res
            .status(HttpStatus.Ok)
            .json(devicesViewModel);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}