import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { TUserId } from 'userId';
import { devicesService } from '../../application/devices.service';
import { Statuses } from '../../../../core/types/resultStasuses';

export async function deleteDeviceByIdHandler(req: Request<{ deviceId: string }, {}, {}, {}, TUserId>, res: Response) {
    try {
        const user = req.user;

         if(!user) {
            res
                .status(HttpStatus.Unauthorized)
                .json({});
        
            return;
        }

        const result  = await devicesService.deleteDeviceByDeviceId(user.id.toString(), req.params.deviceId);

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