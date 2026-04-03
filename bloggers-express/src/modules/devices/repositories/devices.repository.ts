import { DeleteResult, Filter, ObjectId, WithId } from "mongodb/mongodb";
import { TDevice } from "../types/device";
import { devicesCollection } from "../../../db/db";

export const devicesRepository = {
    createNewDevice: async (newDevice: TDevice): Promise<{ insertedId: ObjectId }> => ({
        insertedId: (await devicesCollection.insertOne(newDevice)).insertedId
    }),

    updateDevice: async (deviceForUpdate: TDevice): Promise<{device: WithId<TDevice> | null}> => {
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
    },

    deleteDeviceByParams: async (filter: Filter<TDevice>): Promise<DeleteResult> => {
        return await devicesCollection.deleteOne(filter);
    },

    deleteAllDevices: async (userId: string, deviceId: string): Promise<DeleteResult> => {
        return await devicesCollection.deleteMany({
            userId,
            deviceId: { $ne: deviceId },
        });
    }
}