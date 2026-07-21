import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/httpStatuses";
import { JwtService } from "../../core/adapters/jwt.service";
import { container } from "../../modules/composition-root";

const TYPE_OF_AUTH = `Bearer`;

const jwtService = container.get(JwtService);

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

    const verifiedToken = jwtService.verifyAccessToken(token);

    if(!verifiedToken || !verifiedToken.userId) {
        res
            .status(HttpStatus.Unauthorized)
            .json({});
        
        return;
    }

    req.user = { id: verifiedToken.userId };

    next();
}