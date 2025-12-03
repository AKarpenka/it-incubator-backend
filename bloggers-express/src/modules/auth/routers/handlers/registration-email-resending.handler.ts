import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { Statuses } from '../../../../core/types/resultStasuses';
import { authService } from '../../application/auth.service';

export async function registrationEmailResendingHandler(req: Request, res: Response) {
    try {
        const result = await authService.registrationEmailResending(req.body.email);

        if (result.status !== Statuses.Success) {
            console.error('Error:', result);

            res
                .status(HttpStatus.BadRequest)
                .json({ errorsMessages: result.extensions });

            return;
        }

        res.sendStatus(HttpStatus.NoContent);

        return;
            
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}