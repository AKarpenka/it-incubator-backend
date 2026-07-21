import { TRateLimit } from "../../../middlewares/rateLimit/types";
import { rateLimitCollection } from "../../../db/db";
import { Filter, ObjectId } from "mongodb/mongodb";
import { getTenSecondsAgoFromNow } from "./helpers";
import { injectable } from "inversify";

@injectable()
export class RateLimitRepository {
    async createRequest (newRequest: TRateLimit): Promise<{ insertedId: ObjectId }> {
        return {
        insertedId: (await rateLimitCollection.insertOne(newRequest)).insertedId
        }
    }

    async cleanRequests (query: Filter<{ip: string; url: string}>) {
        const filter = {
            ...query,
            date: { $lt: getTenSecondsAgoFromNow() }
        };

        await rateLimitCollection.deleteMany(filter);

        return;
    }
}