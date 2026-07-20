import { TRateLimit } from "../../../middlewares/rateLimit/types";
import { rateLimitCollection } from "../../../db/db";
import { Filter, WithId } from "mongodb/mongodb";
import { getTenSecondsAgoFromNow } from "./helpers";

export class RateLimitQueryRepository {
    async getRequestByIpAndUrl(
        query: Filter<{ip: string; url: string}>
    ): Promise<{requests: WithId<TRateLimit>[], totalCount: number}> {
        const filter = {
            ...query,
            date: { $gte: getTenSecondsAgoFromNow() }
        };

        const requests = await rateLimitCollection.find(filter).toArray();
        const totalCount = await rateLimitCollection.countDocuments(filter);
        
        return { requests, totalCount };
    }
}