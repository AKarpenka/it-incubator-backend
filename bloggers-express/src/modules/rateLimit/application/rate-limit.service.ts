import { ObjectId, WithId } from "mongodb/mongodb";
import { Result } from "../../../core/types/resultTypes";
import { TRateLimit } from "../../../middlewares/rateLimit/types";
import { RateLimitQueryRepository } from "../repositories/rate-limit.query-repository";
import { Statuses } from "../../../core/types/resultStasuses";
import { RateLimitRepository } from "../repositories/rate-limit.repository";

export class RateLimitService {
    private rateLimitQueryRepository: RateLimitQueryRepository;
    private rateLimitRepository: RateLimitRepository;

    constructor() {
        this.rateLimitQueryRepository = new RateLimitQueryRepository();
        this.rateLimitRepository = new RateLimitRepository();
    }

    async getRequestByIpAndUrl (
        ip: string, 
        url: string
    ): Promise<Result<{requests: WithId<TRateLimit>[], totalCount: number} | null>> {
        const result = await this.rateLimitQueryRepository.getRequestByIpAndUrl({ip, url});

        await this.rateLimitRepository.cleanRequests({ip, url});

        return {
            status: Statuses.Success,
            data: result,
            extensions: [],
        };
    }

    async createNewRequest (ip: string, url: string): Promise<Result<{insertedId: ObjectId } | null>> {
        const result = await this.rateLimitRepository.createRequest({
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