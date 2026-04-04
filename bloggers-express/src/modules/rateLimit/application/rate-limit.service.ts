import { ObjectId, WithId } from "mongodb/mongodb";
import { Result } from "../../../core/types/resultTypes";
import { TRateLimit } from "../../../middlewares/rateLimit/types";
import { rateLimitQueryRepository } from "../repositories/rate-limit.query-repository";
import { Statuses } from "../../../core/types/resultStasuses";
import { rateLimitRepository } from "../repositories/rate-limit.repository";

export const rateLimitService = {
    getRequestByIpAndUrl: async (ip: string, url: string): Promise<Result<{requests: WithId<TRateLimit>[], totalCount: number} | null>> => {
        const result = await rateLimitQueryRepository.getRequestByIpAndUrl({ip, url});

        await rateLimitRepository.cleanRequests({ip, url});

        return {
            status: Statuses.Success,
            data: result,
            extensions: [],
        };
    },

    createNewRequest: async (ip: string, url: string): Promise<Result<{insertedId: ObjectId } | null>> => {
        const result = await rateLimitRepository.createRequest({
            ip,
            url,
            date: new Date().toISOString()
        });

        return {
            status: Statuses.Success,
            data: result,
            extensions: [],
        };
    }
}