import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/httpStatuses";
import { jwtService } from "../../core/adapters/jwt.service";

export const refreshTokenMiddleware = async (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    const refreshToken = req.cookies?.refreshToken as string;

    if (!refreshToken) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    const verifiedRefreshToken = jwtService.verifyToken(refreshToken);

    if(!verifiedRefreshToken || !verifiedRefreshToken.userId) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    req.user = { id: verifiedRefreshToken.userId };
    req.refreshToken = refreshToken;

    next();
}
