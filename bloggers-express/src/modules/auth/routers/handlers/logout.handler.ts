import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { refreshTokenBlacklistService } from '../../../../core/adapters/refresh-token-blacklist.service';

export async function logoutHandler(req: Request, res: Response) {
    try {
        if (req.refreshToken) {
            await refreshTokenBlacklistService.invalidateToken(req.refreshToken);
        }

        res.clearCookie('refreshToken');
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}