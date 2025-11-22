import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/httpStatuses";
import { jwtService } from "../../modules/auth/application/jwt.service";

const TYPE_OF_AUTH = `Bearer`;

export const accessTokenMiddleware = (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    const auth = req.headers['authorization'] as string;
    const [authType, token] = auth?.split(' ') || [];

    if (!auth || authType !== `${TYPE_OF_AUTH}` || !token) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    const verrifiredUserId = jwtService.verifyToken(token);

    if(!verrifiredUserId || !verrifiredUserId.userId) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    req.user = { id: verrifiredUserId.userId };

    next();
}