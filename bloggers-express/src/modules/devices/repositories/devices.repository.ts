import { DeleteResult, Filter, ObjectId, WithId } from "mongodb/mongodb";
import { TDevice } from "../types/device";
import { devicesCollection } from "../../../db/db";

export class DevicesRepository {
    async createNewDevice (newDevice: TDevice): Promise<{ insertedId: ObjectId }> {
        return {
            insertedId: (await devicesCollection.insertOne(newDevice)).insertedId
        }
    }

    async updateDevice (deviceForUpdate: TDevice): Promise<{device: WithId<TDevice> | null}> {
        const result = await devicesCollection.findOneAndUpdate(
            { 
                deviceId: deviceForUpdate.deviceId,
                userId: deviceForUpdate.userId
            },
            {
                $set: {
                    lastActiveDate: deviceForUpdate.lastActiveDate,
                    expRTDate: deviceForUpdate.expRTDate
                }
            },
            { returnDocument: 'after' },
        );

        return { device: result }
    }

    async deleteDeviceByParams (filter: Filter<TDevice>): Promise<DeleteResult> {
        return await devicesCollection.deleteOne(filter);
    }

    async deleteAllDevices (userId: string, deviceId: string): Promise<DeleteResult> {
        return await devicesCollection.deleteMany({
            userId,
            deviceId: { $ne: deviceId },
        });
    }
}