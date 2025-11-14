import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { Statuses } from '../../../../core/types/resultStasuses';
import { authService } from '../../application/auth.service';

export async function loginHandler(req: Request, res: Response) {
    try {
        const { loginOrEmail, password } = req.body;

        const result = await authService.loginUser(loginOrEmail, password);

        if (result.status !== Statuses.Success) {
            res
                .status(HttpStatus.Unauthorized)
                .send(result.extensions);
            return;
        }

        res
            .sendStatus(HttpStatus.NoContent);
            
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}