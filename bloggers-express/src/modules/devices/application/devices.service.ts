import { WithId } from "mongodb/mongodb";
import { TDevice } from "../types/device";
import { devicesQueryRepository } from "../repositories/devices.query-repository";
import { Statuses } from "../../../core/types/resultStasuses";
import { Result } from "../../../core/types/resultTypes";
import { devicesRepository } from "../repositories/devices.repository";

export const devicesService = {
    getDevicesByUserId: async (userId: string): Promise<{ devices: WithId<TDevice>[]; totalCount: number }> => {
        return await devicesQueryRepository.getAllDevicesByUserId(userId);
    },

    deleteDeviceByDeviceId: async (userId: string, deviceId: string): Promise<Result<{} | null>>  => {
        const foundDevice = await devicesQueryRepository.getDeviceByParams({deviceId});

        if(!foundDevice) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'deviceId', message: 'Device not found' }],
            };
        }

        if(foundDevice.userId !== userId) {
            return {
                status: Statuses.Forbidden,
                data: null,
                errorMessage: 'Forbidden',
                extensions: [{ field: 'userId', message: 'You are trying to delete the deviceId of other user' }],
            };
        }

        const deletedDevice = await devicesRepository.deleteDeviceByParams({userId, deviceId});

        if (deletedDevice.deletedCount < 1) {
            return {
                status: Statuses.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'deviceId', message: 'Couldnt remove device' }],
            };
        };

        return {
            status: Statuses.NoContent,
            data: {},
            extensions: [],
        };
    },

    deleteAllDevices: async (userId: string, deviceId: string): Promise<Result<{} | null>> => {
        await devicesRepository.deleteAllDevices(userId, deviceId);

        return {
            status: Statuses.NoContent,
            data: {},
            extensions: [],
        };
    }

}