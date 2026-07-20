import { devicesCollection } from "../../../db/db";
import { TDevice } from "../types/device";
import { Filter, WithId } from "mongodb/mongodb";

export class DevicesQueryRepository {
    async getDeviceByParams (filter: Filter<TDevice>): Promise<WithId<TDevice> | null> {
        return await devicesCollection
                    .findOne(filter);
    }

    async getAllDevicesByUserId (userId: string): Promise<{ devices: WithId<TDevice>[]; totalCount: number }> {
        const filter = {userId};
        const devices = await devicesCollection.find(filter).toArray();
        const totalCount = await devicesCollection.countDocuments(filter);

        return { devices, totalCount };
    }
}