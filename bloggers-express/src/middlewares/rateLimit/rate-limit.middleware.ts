import { NextFunction, Request, Response } from "express";
import { rateLimitService } from "../../modules/rateLimit/application/rate-limit.service";
import { HttpStatus } from "../../core/types/httpStatuses";

const ALLOWED_COUNT_OF_REQUESTS = 5;

export const rateLimitMiddleware = async (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    const ip = req.ip ?? 'unknown';
    const url = req.originalUrl || req.baseUrl;

    const existingRequest = await rateLimitService.getRequestByIpAndUrl(ip, url);

    if(existingRequest.data && existingRequest.data?.totalCount >= ALLOWED_COUNT_OF_REQUESTS) {
        res
            .sendStatus(HttpStatus.TooManyRequests);

        return;
    } else  {
        await rateLimitService.createNewRequest(ip, url);
    }

    next();
}