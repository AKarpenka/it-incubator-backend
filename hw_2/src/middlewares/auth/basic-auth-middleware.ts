import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../../core/settings/settings";
import { HttpStatus } from "../../core/types/httpStatuses";

const TYPE_OF_AUTH = `Basic`;

export const fromUTF8ToBase64 = (code: string) => {
    const buff = Buffer.from(code, 'utf8');
    const codedAuth = buff.toString('base64');

    return codedAuth;
}

export const authorizationMiddleware = (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    const auth = req.headers['authorization'] as string;

    if (!auth || auth.slice(0, 6) !== `${TYPE_OF_AUTH} `) {
        res
            .status(HttpStatus.Unauthorized)
            .json({})

        return;
    }

    const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);

    if (auth.slice(6) !== codedAuth) {
        res
            .status(HttpStatus.Unauthorized)
            .json({})

        return;
    }

    next();
}