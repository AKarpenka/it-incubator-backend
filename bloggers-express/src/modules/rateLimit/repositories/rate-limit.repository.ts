import { TRateLimit } from "../../../middlewares/rateLimit/types";
import { rateLimitCollection } from "../../../db/db";
import { Filter, ObjectId } from "mongodb/mongodb";
import { getTenSecondsAgoFromNow } from "./helpers";

export const rateLimitRepository = {
    createRequest: async (newRequest: TRateLimit): Promise<{ insertedId: ObjectId }> => ({
        insertedId: (await rateLimitCollection.insertOne(newRequest)).insertedId
    }),

    cleanRequests: async(query: Filter<{ip: string; url: string}>) => {
        const filter = {
            ...query,
            date: { $lt: getTenSecondsAgoFromNow() }
        };

        await rateLimitCollection.deleteMany(filter);

        return;
    },
}