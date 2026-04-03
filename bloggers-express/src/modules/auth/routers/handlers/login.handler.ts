import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { Statuses } from '../../../../core/types/resultStasuses';
import { authService } from '../../application/auth.service';

export async function loginHandler(req: Request, res: Response) {
    try {
        const { loginOrEmail, password } = req.body;

        const result = await authService.loginUser({
            loginOrEmail, 
            password, 
            deviceName: req.get('user-agent') ?? 'unknown',
            ip: req.ip ?? 'unknown'
        });

        if (result.status !== Statuses.Success) {
            res
                .status(HttpStatus.Unauthorized)
                .send(result.extensions);
                
            return;
        }

        res.cookie('refreshToken', result.data?.refreshToken, {
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict',
            maxAge: 20000
        });

        res
            .status(HttpStatus.Ok)
            .send({ accessToken: result.data?.accessToken });
            
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}