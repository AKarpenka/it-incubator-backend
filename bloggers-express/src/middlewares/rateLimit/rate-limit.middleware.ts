import { NextFunction, Request, Response } from "express";
import { RateLimitService } from "../../modules/rateLimit/application/rate-limit.service";
import { HttpStatus } from "../../core/types/httpStatuses";
import { container } from "../../modules/composition-root";

const ALLOWED_COUNT_OF_REQUESTS = 5;

const rateLimitService = container.get(RateLimitService);

export const rateLimitMiddleware = async (
    req: Request,
    res: Response, 
    next: NextFunction,
) => {
    try {
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
    } catch (error) {
        res.sendStatus(HttpStatus.InternalServerError);
    }
}