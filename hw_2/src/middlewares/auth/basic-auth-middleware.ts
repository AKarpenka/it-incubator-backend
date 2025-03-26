import { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../../settings";

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
            .status(401)
            .json({})

        return;
    }

    const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);

    if (auth.slice(6) !== codedAuth) {
        res
            .status(401)
            .json({})

        return;
    }

    next();
}