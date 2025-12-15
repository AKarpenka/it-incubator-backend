import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';

export async function logoutHandler(req: Request, res: Response) {
    try {
        res.clearCookie('refreshToken');
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}