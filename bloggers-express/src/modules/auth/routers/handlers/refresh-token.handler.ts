import { Request, Response } from 'express';
import { HttpStatus } from '../../../../core/types/httpStatuses';
import { Statuses } from '../../../../core/types/resultStasuses';
import { authService } from '../../application/auth.service';
import { refreshTokenBlacklistService } from '../../../../core/adapters/refresh-token-blacklist.service';

export async function refreshTokenHandler(req: Request, res: Response) {
    try {
        if (!req.user || !req.refreshToken) {
            res
                .status(HttpStatus.Unauthorized)
                .json({});
            
            return;
        }

        const result = await authService.refreshTokens(req.user.id);

        if (result.status !== Statuses.Success) {
            res
                .status(HttpStatus.Unauthorized)
                .json({});
                
            return;
        }

        // Инвалидируем старый токен
        await refreshTokenBlacklistService.invalidateToken(req.refreshToken);

        res.cookie('refreshToken', result.data?.refreshToken, {
            httpOnly: true, 
            secure: true, 
            sameSite: 'strict',
            maxAge: 20000
        });

        res
            .status(HttpStatus.Ok)
            .json({ accessToken: result.data?.accessToken });
            
    } catch (e: unknown) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}

